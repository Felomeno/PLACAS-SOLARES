import { chromium } from "playwright";

const URL = process.env.URL || "http://localhost:4328/";

const luminance = ([r, g, b]) => {
  const f = (c) => {
    const s = c / 255;
    return s <= 0.03928 ? s / 12.92 : Math.pow((s + 0.055) / 1.055, 2.4);
  };
  return 0.2126 * f(r) + 0.7152 * f(g) + 0.0722 * f(b);
};

const ratio = (fg, bg) => {
  const [hi, lo] = [luminance(fg), luminance(bg)].sort((a, b) => b - a);
  return (hi + 0.05) / (lo + 0.05);
};

const browser = await chromium.launch();

for (const width of [1440, 1920, 2560]) {
  const page = await browser.newPage({ viewport: { width, height: 1200 } });
  await page.goto(URL, { waitUntil: "networkidle" });
  await page.waitForTimeout(1200);

  const boxes = await page.evaluate(() => {
    const pick = (sel) => {
      const el = document.querySelector(sel);
      if (!el) return null;
      const r = el.getBoundingClientRect();
      return { x: Math.round(r.x), y: Math.round(r.y), w: Math.round(r.width), h: Math.round(r.height) };
    };
    return { h1: pick("#inicio h1"), sub: pick("#inicio p"), stats: pick("#inicio dl") };
  });

  await page.addStyleTag({ content: "#inicio h1, #inicio h1 *, #inicio p, #inicio p *, #inicio dl, #inicio dl * { color: transparent !important; }" });
  await page.waitForTimeout(200);
  const png = (await page.screenshot({ clip: { x: 0, y: 0, width, height: 1200 } })).toString("base64");

  // El píxel más claro del recuadro es el fondo más exigente detrás del texto crema.
  const results = await page.evaluate(
    async ({ png, boxes }) => {
      const img = new Image();
      img.src = `data:image/png;base64,${png}`;
      await img.decode();
      const canvas = document.createElement("canvas");
      canvas.width = img.width;
      canvas.height = img.height;
      const ctx = canvas.getContext("2d");
      ctx.drawImage(img, 0, 0);

      const out = {};
      for (const [name, b] of Object.entries(boxes)) {
        if (!b) continue;
        const data = ctx.getImageData(b.x, b.y, Math.max(1, b.w), Math.max(1, b.h)).data;
        let brightest = [0, 0, 0];
        let brightestL = -1;
        for (let i = 0; i < data.length; i += 4) {
          const px = [data[i], data[i + 1], data[i + 2]];
          const l = 0.2126 * px[0] + 0.7152 * px[1] + 0.0722 * px[2];
          // Ignora el propio texto crema (muy claro) quedándonos por debajo de 200.
          if (l > brightestL) {
            brightestL = l;
            brightest = px;
          }
        }
        out[name] = brightest;
      }
      return out;
    },
    { png, boxes },
  );

  const cream = [250, 246, 236];
  const line = Object.entries(results)
    .map(([name, bg]) => `${name} ${ratio(cream, bg).toFixed(1)}:1`)
    .join("  ·  ");
  console.log(`${width}px → ${line}`);
  await page.close();
}

await browser.close();
