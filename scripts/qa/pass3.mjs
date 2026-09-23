import { chromium } from "playwright";
const url = process.env.URL ?? "http://localhost:4337";
const out = ".impeccable/review/pass3";
const browser = await chromium.launch();
const report = { overflow: {}, console: [] };
const ids = ["inicio", "soluciones", "proyectos", "como-funciona", "paneles", "calculadora", "ahorro", "proceso", "faq", "contacto"];
for (const [w, h] of [[375, 812], [390, 844], [430, 932], [768, 1024], [1024, 768], [1440, 900]]) {
  const page = await browser.newPage({ viewport: { width: w, height: h }, reducedMotion: "reduce" });
  page.on("console", (m) => m.type() === "error" && report.console.push(`${w}: ${m.text()}`));
  page.on("pageerror", (e) => report.console.push(`${w}: ${e.message}`));
  await page.goto(url, { waitUntil: "networkidle" });
  await page.evaluate(async () => {
    for (let y = 0; y < document.body.scrollHeight; y += 700) { window.scrollTo(0, y); await new Promise((r) => setTimeout(r, 50)); }
    window.scrollTo(0, 0);
  });
  await page.waitForTimeout(400);
  report.overflow[w] = await page.evaluate(() => document.documentElement.scrollWidth - window.innerWidth);
  if (w === 1440 || w === 390) {
    await page.screenshot({ path: `${out}/full-${w}.png`, fullPage: true });
    await page.addStyleTag({ content: "header{display:none!important}" });
    for (const id of ids) {
      const el = page.locator(`#${id}`);
      await el.scrollIntoViewIfNeeded();
      await page.waitForTimeout(150);
      await el.screenshot({ path: `${out}/${w}-${id}.png` });
    }
  }
  await page.close();
}
console.log(JSON.stringify(report, null, 1));
await browser.close();
