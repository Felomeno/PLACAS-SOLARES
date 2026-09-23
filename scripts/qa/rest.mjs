// Capturas de las secciones sin id propio (confianza y footer) a 1440 y 390.
import { chromium } from "playwright";

const browser = await chromium.launch();
for (const w of [1440, 390]) {
  const page = await browser.newPage({ viewport: { width: w, height: 900 } });
  await page.goto("http://localhost:4337/", { waitUntil: "networkidle" });
  const trust = page.locator("section", { hasText: "Pensada para durar tanto como tu tejado." });
  await trust.scrollIntoViewIfNeeded();
  await trust.screenshot({ path: `.impeccable/review/solar/${w}-confianza.png` });
  const footer = page.locator("footer");
  await footer.scrollIntoViewIfNeeded();
  await footer.screenshot({ path: `.impeccable/review/solar/${w}-footer.png` });
  await page.close();
}
await browser.close();
