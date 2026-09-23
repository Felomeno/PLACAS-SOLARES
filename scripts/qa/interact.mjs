import { chromium } from "playwright";

const URL = process.env.URL || "http://localhost:4337/";
const OUT = ".impeccable/review/states";
const results = [];

function check(name, pass, detail = "") {
  results.push(`${pass ? "PASS" : "FAIL"} · ${name}${detail ? ` · ${detail}` : ""}`);
}

const browser = await chromium.launch();

// --- desktop interactions ---
const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
await page.goto(URL, { waitUntil: "networkidle" });

// 1. Bill comparison toggle
await page.locator("#ahorro").scrollIntoViewIfNeeded();
await page.waitForTimeout(500);
const totalBefore = await page.locator("#ahorro p.text-4xl").textContent();
await page.getByRole("button", { name: "Con placas" }).click();
await page.waitForTimeout(500);
const totalAfter = await page.locator("#ahorro p.text-4xl").textContent();
check("factura antes/después cambia", totalBefore !== totalAfter, `${totalBefore?.trim()} -> ${totalAfter?.trim()}`);
await page.screenshot({ path: `${OUT}/ahorro-con-solara.png` });

// 2. Solar flow diagram: day/night mode swaps the steps
await page.locator("#como-funciona").scrollIntoViewIfNeeded();
await page.getByRole("button", { name: "De noche" }).click();
await page.waitForTimeout(600);
const nightStep = await page.locator("#como-funciona").getByRole("button", { name: /La batería alimenta tu casa/ }).count();
check("esquema cambia a modo noche", nightStep === 1, `pasos de noche: ${nightStep}`);
await page.screenshot({ path: `${OUT}/esquema-noche.png` });

// 3. Calculator
await page.locator("#calculadora").scrollIntoViewIfNeeded();
await page.waitForTimeout(400);
const savingLocator = page.locator("#calculadora dt", { hasText: "Ahorro anual" }).locator("xpath=following-sibling::dd[1]");
const savingBefore = await savingLocator.textContent();
await page.locator("#factura").fill("240");
await page.selectOption("#provincia", "Sevilla");
await page.getByRole("button", { name: "Piso o ático" }).click();
await page.waitForTimeout(900);
const savingAfter = await savingLocator.textContent();
check("calculadora recalcula", savingBefore !== savingAfter, `${savingBefore?.trim()} -> ${savingAfter?.trim()}`);
await page.screenshot({ path: `${OUT}/calculadora-sevilla.png` });

// 4. FAQ accordion
const faqTrigger = page.getByRole("button", { name: "¿Necesito batería?" });
await faqTrigger.scrollIntoViewIfNeeded();
await faqTrigger.click();
await page.waitForTimeout(500);
check("FAQ abre el panel", (await faqTrigger.getAttribute("aria-expanded")) === "true");

// 5. Form validation + success
await page.locator("#contacto").scrollIntoViewIfNeeded();
await page.waitForTimeout(400);
await page.getByRole("button", { name: "Solicitar estudio solar" }).click();
await page.waitForTimeout(300);
const errorCount = await page.locator("#contacto p[id$='-error']").count();
check("formulario valida campos vacíos", errorCount === 5, `${errorCount} errores`);
await page.screenshot({ path: `${OUT}/formulario-errores.png` });

await page.fill("#cta-nombre", "Marta Rodríguez");
await page.fill("#cta-telefono", "612 345 678");
await page.fill("#cta-email", "marta@correo.es");
await page.fill("#cta-codigoPostal", "41010");
await page.fill("#cta-factura", "90");
await page.getByRole("button", { name: "Solicitar estudio solar" }).click();
await page.waitForTimeout(1500);
const success = await page.getByText("Solicitud recibida").isVisible();
check("formulario muestra estado de éxito", success);
await page.screenshot({ path: `${OUT}/formulario-exito.png` });

// 6. Navbar becomes solid on scroll
await page.evaluate(() => window.scrollTo(0, 0));
await page.waitForTimeout(400);
const navTransparent = await page.locator("header").evaluate((el) => getComputedStyle(el.firstElementChild).boxShadow);
await page.evaluate(() => window.scrollTo(0, 600));
await page.waitForTimeout(600);
const navSolid = await page.locator("header").evaluate((el) => getComputedStyle(el.firstElementChild).boxShadow);
check("navbar gana sombra al hacer scroll", navTransparent !== navSolid, `${navTransparent} -> ${navSolid}`);

await page.close();

// --- reduced motion ---
const rmPage = await browser.newPage({ viewport: { width: 1440, height: 900 }, reducedMotion: "reduce" });
await rmPage.goto(URL, { waitUntil: "networkidle" });
await rmPage.locator("#calculadora").evaluate((el) => el.scrollIntoView());
await rmPage.waitForTimeout(600);
const opacity = await rmPage.locator("#calculadora .reveal").first().evaluate((el) => getComputedStyle(el).opacity);
check("con prefers-reduced-motion el contenido es visible", opacity === "1", `opacity ${opacity}`);
await rmPage.evaluate(() => window.scrollTo(0, 0));
await rmPage.waitForTimeout(400);
await rmPage.screenshot({ path: `${OUT}/reduced-motion.png`, fullPage: true });
await rmPage.close();

// --- no javascript ---
// Captura sin JS con motion reducido: así la imagen refleja el contenido real y no el
// estado inicial de las animaciones ligadas al scroll.
const noJsContext = await browser.newContext({
  javaScriptEnabled: false,
  viewport: { width: 1440, height: 900 },
  reducedMotion: "reduce",
});
const noJsPage = await noJsContext.newPage();
await noJsPage.goto(URL, { waitUntil: "domcontentloaded" });
await noJsPage.waitForTimeout(800);
const h1Visible = await noJsPage.locator("h1").isVisible();
const quoteVisible = await noJsPage.getByText("Descubre cuántas placas", { exact: false }).isVisible();
check("sin JS el contenido sigue siendo legible", h1Visible && quoteVisible);
const noJsHeight = await noJsPage.evaluate(() => document.body.scrollHeight);
for (let y = 0; y < noJsHeight; y += 600) {
  await noJsPage.evaluate((y) => window.scrollTo(0, y), y);
  await noJsPage.waitForTimeout(80);
}
await noJsPage.evaluate(() => window.scrollTo(0, 0));
await noJsPage.waitForTimeout(600);
await noJsPage.screenshot({ path: `${OUT}/sin-js.png`, fullPage: true });
await noJsContext.close();

// Sin JS y con motion normal: la entrada al hacer scroll es CSS puro, así que sigue funcionando.
const noJsMotionContext = await browser.newContext({
  javaScriptEnabled: false,
  viewport: { width: 1440, height: 900 },
});
const noJsMotionPage = await noJsMotionContext.newPage();
await noJsMotionPage.goto(URL, { waitUntil: "domcontentloaded" });
await noJsMotionPage.locator("#calculadora .reveal").evaluate((el) => el.scrollIntoView({ block: "center", behavior: "instant" }));
await noJsMotionPage.waitForTimeout(900);
const revealOpacity = await noJsMotionPage
  .locator("#calculadora .reveal")
  .first()
  .evaluate((el) => getComputedStyle(el).opacity);
check("sin JS la entrada al hacer scroll sigue animando (CSS)", Number(revealOpacity) > 0.9, `opacity ${revealOpacity}`);
await noJsMotionPage.screenshot({ path: `${OUT}/sin-js-scroll.png` });
await noJsMotionContext.close();

await browser.close();
console.log(results.join("\n"));

