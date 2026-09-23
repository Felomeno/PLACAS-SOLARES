import { chromium } from "playwright";
import { mkdirSync } from "node:fs";

const URL = process.env.URL || "http://localhost:4325/";
const OUT = process.argv[2] || ".impeccable/review";
mkdirSync(OUT, { recursive: true });
mkdirSync(`${OUT}/sections`, { recursive: true });

const SECTIONS = [
  ["01-hero", "#inicio"],
  ["02-calculadora", "#calculadora"],
  ["03-soluciones", "#soluciones"],
  ["04-proceso", "section:nth-of-type(4)"],
  ["05-ahorro", "#ahorro"],
  ["06-proyectos", "#proyectos"],
  ["07-stats", "section:nth-of-type(7)"],
  ["08-nosotros", "#nosotros"],
  ["09-testimonios", "section:nth-of-type(9)"],
  ["10-faq", "section:nth-of-type(10)"],
  ["11-contacto", "#contacto"],
  ["12-footer", "footer"],
];

async function scrollThrough(page) {
  const height = await page.evaluate(() => document.body.scrollHeight);
  for (let y = 0; y < height; y += 600) {
    await page.evaluate((y) => window.scrollTo(0, y), y);
    await page.waitForTimeout(110);
  }
  await page.evaluate(() => window.scrollTo(0, 0));
  await page.waitForTimeout(700);
}

/**
 * Las entradas al hacer scroll son animaciones CSS ligadas al scroll (animation-timeline: view()),
 * así que en una captura fullPage las secciones fuera del scrollport aparecerían en su estado
 * inicial. Con prefers-reduced-motion la animación no existe y la captura refleja la página real.
 */
async function captureFullPage(name, width, height) {
  const browser = await chromium.launch();
  const page = await browser.newPage({ viewport: { width, height }, reducedMotion: "reduce" });
  await page.goto(URL, { waitUntil: "networkidle" });
  await scrollThrough(page);
  await page.screenshot({ path: `${OUT}/${name}.png`, fullPage: true });
  await browser.close();
  console.log(`captured ${name} (full page, reduced motion)`);
}

async function captureSections(name, width, height) {
  const browser = await chromium.launch();
  const page = await browser.newPage({ viewport: { width, height } });
  await page.goto(URL, { waitUntil: "networkidle" });
  await scrollThrough(page);
  for (const [label, selector] of SECTIONS) {
    const el = page.locator(selector).first();
    if ((await el.count()) === 0) continue;
    await el.scrollIntoViewIfNeeded();
    await page.waitForTimeout(800);
    await page.screenshot({ path: `${OUT}/sections/${name}-${label}.png` });

    // El carrusel de proyectos deja la última ficha fuera de encuadre: se captura también
    // con el scroll al final para poder revisarla.
    if (label === "06-proyectos") {
      await page.evaluate(() => {
        const track = document.querySelector("#proyectos ~ div [class*='overflow-x-auto'], #proyectos + div, .snap-x");
        const scroller = document.querySelector(".snap-x");
        (scroller || track)?.scrollTo({ left: 99999, behavior: "instant" });
      });
      await page.waitForTimeout(600);
      await page.screenshot({ path: `${OUT}/sections/${name}-06b-proyectos-final.png` });
    }
  }
  await browser.close();
  console.log(`captured ${name} sections (animated, as a visitor sees them)`);
}

async function captureFirstViewport(name, width, height) {
  const browser = await chromium.launch();
  const page = await browser.newPage({ viewport: { width, height } });
  await page.goto(URL, { waitUntil: "networkidle" });
  await page.waitForTimeout(1500);
  await page.screenshot({ path: `${OUT}/${name}.png` });
  await browser.close();
  console.log(`captured ${name} (first viewport)`);
}

await captureFullPage("desktop", 1440, 900);
await captureSections("desktop", 1440, 900);
await captureFullPage("mobile", 390, 844);
await captureSections("mobile", 390, 844);
await captureFirstViewport("wide-first-viewport", 1920, 1080);
await captureFullPage("wide", 1920, 1080);
console.log("done");
