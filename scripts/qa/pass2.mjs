import { chromium } from "playwright";
const url = process.env.URL ?? "http://localhost:4337";
const out = ".impeccable/review/pass2";
const browser = await chromium.launch();
const report = [];
for (const [w, h] of [[375, 812], [430, 932], [768, 1024], [1024, 768], [1440, 900]]) {
  const page = await browser.newPage({ viewport: { width: w, height: h }, reducedMotion: "reduce" });
  await page.goto(url, { waitUntil: "networkidle" });
  const overflow = await page.evaluate(() => document.documentElement.scrollWidth - window.innerWidth);
  const offenders = await page.evaluate(() =>
    [...document.querySelectorAll("body *")]
      .filter((el) => el.getBoundingClientRect().right > window.innerWidth + 1)
      .slice(0, 5)
      .map((el) => el.tagName + "." + (el.className?.toString?.() ?? "").slice(0, 60)),
  );
  report.push({ w, overflow, offenders });
  await page.screenshot({ path: `${out}/hero-${w}.png` });
  if (w === 375 || w === 1440) {
    // Carga perezosa: recorrer la página antes de la captura completa.
    await page.evaluate(async () => {
      for (let y = 0; y < document.body.scrollHeight; y += 600) { window.scrollTo(0, y); await new Promise((r) => setTimeout(r, 60)); }
      window.scrollTo(0, 0);
    });
    await page.waitForTimeout(400);
    await page.screenshot({ path: `${out}/full-${w}.png`, fullPage: true });
  }
  await page.close();
}
// Estados interactivos
const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
await page.goto(url, { waitUntil: "networkidle" });
await page.locator("#como-funciona").scrollIntoViewIfNeeded();
await page.getByRole("button", { name: "De noche" }).click();
await page.waitForTimeout(700);
await page.locator("#como-funciona").screenshot({ path: `${out}/flow-noche.png` });
await page.getByRole("button", { name: "De día" }).click();
await page.getByRole("button", { name: /El excedente se almacena/ }).click();
await page.waitForTimeout(400);
await page.locator("#como-funciona").screenshot({ path: `${out}/flow-paso4.png` });
await page.locator("#factura").fill("250");
await page.waitForTimeout(800);
await page.locator("#calculadora").screenshot({ path: `${out}/calc-250.png` });
await page.getByRole("button", { name: "Con placas" }).click();
await page.waitForTimeout(700);
await page.locator("#ahorro").screenshot({ path: `${out}/ahorro-con.png` });
// Sin JS
const ctx = await browser.newContext({ javaScriptEnabled: false, viewport: { width: 1440, height: 900 } });
const nojs = await ctx.newPage();
await nojs.goto(url);
const hidden = await nojs.evaluate(() =>
  [...document.querySelectorAll("main section")].map((s) => ({ id: s.id, op: getComputedStyle(s.querySelector("h2,h1") ?? s).opacity })),
);
report.push({ nojs: hidden });
console.log(JSON.stringify(report, null, 1));
await browser.close();
