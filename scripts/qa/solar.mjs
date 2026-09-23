// Capturas de viewport con la barra de navegación y estados hover/focus de la identidad solar.
import { chromium } from "playwright";
import { mkdirSync } from "node:fs";

const URL = "http://localhost:4337/";
const OUT = ".impeccable/review/solar";
mkdirSync(OUT, { recursive: true });

const browser = await chromium.launch();
const results = [];

for (const [w, h] of [
  [1440, 900],
  [390, 844],
]) {
  const page = await browser.newPage({ viewport: { width: w, height: h } });
  await page.goto(URL, { waitUntil: "networkidle" });
  await page.screenshot({ path: `${OUT}/${w}-top.png` });

  // Hover del CTA principal
  const cta = page.locator("#inicio a", { hasText: "Calcula tu instalación" });
  const before = await cta.evaluate((el) => getComputedStyle(el).backgroundColor);
  await cta.hover();
  await page.waitForTimeout(300);
  const after = await cta.evaluate((el) => getComputedStyle(el).backgroundColor);
  results.push(`${w} CTA hover: ${before} -> ${after}`);

  // Foco por teclado: el primer tabulado es el enlace de salto, luego el logo
  await page.keyboard.press("Tab");
  const skip = await page.evaluate(() => {
    const el = document.activeElement;
    const cs = getComputedStyle(el);
    return `${el.textContent.trim()} bg ${cs.backgroundColor} outline ${cs.outlineStyle} ${cs.outlineColor}`;
  });
  results.push(`${w} focus 1: ${skip}`);
  await page.keyboard.press("Tab");
  const logo = await page.evaluate(() => {
    const cs = getComputedStyle(document.activeElement);
    return `${document.activeElement.textContent.trim()} outline ${cs.outlineStyle} ${cs.outlineWidth} ${cs.outlineColor}`;
  });
  results.push(`${w} focus 2: ${logo}`);

  // Foco sobre grafito (calculadora, CTA de resultados)
  const dark = page.locator("#calculadora a", { hasText: "Solicitar estudio solar" });
  await dark.focus();
  const darkFocus = await dark.evaluate((el) => `${getComputedStyle(el).outlineStyle} ${getComputedStyle(el).outlineColor}`);
  results.push(`${w} focus sobre grafito: ${darkFocus}`);

  if (w === 1440) {
    await page.locator("#calculadora").scrollIntoViewIfNeeded();
    await page.locator("#factura").focus();
    await page.screenshot({ path: `${OUT}/${w}-slider-focus.png`, clip: { x: 0, y: 0, width: w, height: h } });
    await page.locator("nav[aria-label='Principal'] a").first().hover();
    await page.waitForTimeout(350);
    await page.evaluate(() => window.scrollTo({ top: 0, behavior: "instant" }));
    await page.locator("nav[aria-label='Principal'] a").first().hover();
    await page.waitForTimeout(350);
    await page.screenshot({ path: `${OUT}/${w}-nav-hover.png`, clip: { x: 0, y: 0, width: w, height: 90 } });
  } else {
    await page.getByRole("button", { name: "Abrir menú" }).click();
    await page.waitForTimeout(400);
    await page.screenshot({ path: `${OUT}/${w}-menu.png` });
  }
  await page.close();
}

// prefers-reduced-motion: todo visible y sin transformaciones pendientes
const ctx = await browser.newContext({ reducedMotion: "reduce", viewport: { width: 1440, height: 900 } });
const rp = await ctx.newPage();
await rp.goto(URL, { waitUntil: "networkidle" });
const hidden = await rp.evaluate(
  () => [...document.querySelectorAll(".reveal, .rise, .unveil")].filter((el) => getComputedStyle(el).opacity !== "1").length,
);
results.push(`reduced-motion elementos ocultos: ${hidden}`);

await browser.close();
console.log(results.join("\n"));
