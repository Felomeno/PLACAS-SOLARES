// Menú móvil desde la parte superior de la página y barra a 390 px.
import { chromium } from "playwright";

const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 390, height: 844 } });
await page.goto("http://localhost:4337/", { waitUntil: "networkidle" });
await page.screenshot({ path: ".impeccable/review/solar/390-top.png" });
await page.getByRole("button", { name: "Abrir menú" }).click();
await page.waitForTimeout(400);
const top = await page.locator("header").evaluate((el) => el.getBoundingClientRect().top);
console.log("header top", top);
await page.screenshot({ path: ".impeccable/review/solar/390-menu.png" });
await browser.close();
