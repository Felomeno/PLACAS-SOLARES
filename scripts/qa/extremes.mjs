import { chromium } from "playwright";
import { mkdirSync } from "node:fs";

const URL = process.env.URL || "http://localhost:4325/";
const OUT = ".impeccable/review/extremes";
mkdirSync(OUT, { recursive: true });

const SIZES = [
  { name: "320", width: 320, height: 720 },
  { name: "768", width: 768, height: 1024 },
  { name: "2560", width: 2560, height: 1200 },
];

const browser = await chromium.launch();

for (const size of SIZES) {
  const page = await browser.newPage({ viewport: { width: size.width, height: size.height } });
  await page.goto(URL, { waitUntil: "networkidle" });
  const height = await page.evaluate(() => document.body.scrollHeight);
  for (let y = 0; y < height; y += 500) {
    await page.evaluate((y) => window.scrollTo(0, y), y);
    await page.waitForTimeout(80);
  }
  await page.evaluate(() => window.scrollTo(0, 0));
  await page.waitForTimeout(700);

  const overflow = await page.evaluate(() => ({
    scrollW: document.documentElement.scrollWidth,
    clientW: document.documentElement.clientWidth,
    offenders: [...document.querySelectorAll("body *")]
      .filter((el) => el.getBoundingClientRect().right > document.documentElement.clientWidth + 1)
      .slice(0, 6)
      .map((el) => `${el.tagName.toLowerCase()}.${(el.className || "").toString().split(" ").slice(0, 3).join(".")}`),
  }));
  console.log(
    `${size.name}px → scrollWidth ${overflow.scrollW} / clientWidth ${overflow.clientW}` +
      (overflow.scrollW > overflow.clientW + 1 ? ` OVERFLOW: ${overflow.offenders.join(", ")}` : " ok"),
  );

  await page.screenshot({ path: `${OUT}/${size.name}-full.png`, fullPage: true });
  await page.screenshot({ path: `${OUT}/${size.name}-hero.png` });
  await page.close();
}

await browser.close();
