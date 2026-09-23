"use client";

import { useMemo, useState } from "react";
import clsx from "clsx";
import { Container } from "@/components/ui/Container";
import { Reveal } from "@/components/ui/Reveal";
import { LiveNumber } from "@/components/ui/LiveNumber";
import { Button } from "@/components/ui/Button";
import { PROVINCIAS, TIPOS_VIVIENDA, estimateSavings, type TipoVivienda } from "@/lib/calculator";

const eur = new Intl.NumberFormat("es-ES", {
  style: "currency",
  currency: "EUR",
  maximumFractionDigits: 0,
  useGrouping: true,
});
const int = new Intl.NumberFormat("es-ES", { maximumFractionDigits: 0, useGrouping: true });
const kwp = new Intl.NumberFormat("es-ES", { minimumFractionDigits: 1, maximumFractionDigits: 2 });

// Reparto mensual típico de la producción en España (fracción del total anual).
// Es un perfil orientativo para dibujar el gráfico, no una medición de tu provincia.
const PERFIL_MENSUAL = [0.051, 0.061, 0.083, 0.091, 0.104, 0.11, 0.115, 0.108, 0.089, 0.075, 0.061, 0.052];
const MESES = ["E", "F", "M", "A", "M", "J", "J", "A", "S", "O", "N", "D"];
const PICO = Math.max(...PERFIL_MENSUAL);

// Filas del tejado: la cubierta se dibuja más ancha que alta, como una vivienda real.
function filasPara(paneles: number) {
  if (paneles <= 8) return 2;
  if (paneles <= 18) return 3;
  return 4;
}

export function SavingsCalculator() {
  const [factura, setFactura] = useState(90);
  const [provincia, setProvincia] = useState("Madrid");
  const [tipo, setTipo] = useState<TipoVivienda>("unifamiliar");

  const result = useMemo(
    () => estimateSavings({ facturaMensual: factura, provincia, tipoVivienda: tipo }),
    [factura, provincia, tipo],
  );

  const filas = filasPara(result.paneles);
  const columnas = Math.ceil(result.paneles / filas);

  return (
    <section id="calculadora" className="bg-cream py-24 sm:py-32">
      <Container>
        <div className="max-w-3xl">
          <p className="label text-green-deep">Calculadora de instalación solar</p>
          <h2 className="font-display mt-5 text-4xl leading-[1.02] font-normal tracking-[-0.028em] text-balance text-ink sm:text-6xl lg:text-7xl">
            Configura tu instalación.
          </h2>
          <p className="mt-5 max-w-xl text-lg text-ink-muted">
            Tres datos y verás cuántas placas necesitaría tu tejado, cuánto producirían y cuánto podrías ahorrar.
          </p>
        </div>
        <Reveal className="mt-12 sm:mt-16">
          {/* Herramienta: configuración a la izquierda y simulación a la derecha, en un mismo marco. */}
          <div className="grid grid-cols-1 gap-3 rounded-[32px] bg-cream-deep p-2 sm:p-3 lg:grid-cols-[minmax(0,0.8fr)_minmax(0,1.2fr)]">
            <div className="flex flex-col gap-9 rounded-[24px] bg-cream p-6 sm:p-8">
              <p className="text-sm font-semibold text-ink">Tus datos</p>

              <div>
                <div className="flex items-baseline justify-between">
                  <label htmlFor="factura" className="text-sm font-medium text-ink">
                    Factura eléctrica mensual
                  </label>
                  <span className="font-display tnum text-3xl text-ink">{eur.format(factura)}</span>
                </div>
                <input
                  id="factura"
                  type="range"
                  min={30}
                  max={400}
                  step={5}
                  value={factura}
                  onChange={(e) => setFactura(Number(e.target.value))}
                  className="range mt-5 w-full"
                  style={{ "--fill": `${((factura - 30) / (400 - 30)) * 100}%` } as React.CSSProperties}
                  aria-valuetext={eur.format(factura)}
                />
                <div className="mt-1.5 flex justify-between text-xs text-ink-muted">
                  <span>30 €</span>
                  <span>400 €</span>
                </div>
              </div>

              <div>
                <label htmlFor="provincia" className="text-sm font-medium text-ink">
                  Provincia
                </label>
                <select
                  id="provincia"
                  value={provincia}
                  onChange={(e) => setProvincia(e.target.value)}
                  className="mt-3 w-full rounded-full border border-ink/15 bg-cream-deep/60 px-5 py-3.5 text-base text-ink transition-colors hover:border-ink/35 focus-visible:border-green-vivid"
                >
                  {PROVINCIAS.map((p) => (
                    <option key={p.nombre} value={p.nombre}>
                      {p.nombre}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <span id="tipo-label" className="text-sm font-medium text-ink">
                  Tipo de vivienda
                </span>
                <div role="group" aria-labelledby="tipo-label" className="mt-3 grid grid-cols-1 gap-1 rounded-[20px] bg-cream-deep/70 p-1 sm:grid-cols-3 sm:rounded-full lg:grid-cols-1 lg:rounded-[20px]">
                  {TIPOS_VIVIENDA.map((t) => (
                    <button
                      key={t.value}
                      type="button"
                      onClick={() => setTipo(t.value)}
                      aria-pressed={tipo === t.value}
                      className={clsx(
                        "rounded-full px-4 py-3 text-sm font-medium transition-[background-color,color,transform] duration-200 active:scale-[0.97]",
                        tipo === t.value ? "bg-green text-ink" : "text-ink hover:bg-cream",
                      )}
                    >
                      {t.label}
                    </button>
                  ))}
                </div>
              </div>
              <div className="mt-auto rounded-[20px] bg-cream-deep/60 p-5">
                <p className="text-sm font-semibold text-ink">Qué tiene en cuenta</p>
                <ul className="mt-3 space-y-1.5 text-sm text-ink-muted">
                  <li>Paneles de referencia de 450 W</li>
                  <li>Irradiancia media de tu provincia</li>
                  <li>Consumo deducido de tu factura, sin batería</li>
                </ul>
              </div>
            </div>

            {/* Resultado dibujado como la propia cubierta: un panel por cada placa recomendada. */}
            <div className="rounded-[24px] bg-carbon px-6 py-8 text-cream sm:px-9 sm:py-9" aria-live="polite">
              <div className="flex flex-wrap items-baseline justify-between gap-2">
                <p className="font-display text-xl">Tu instalación recomendada</p>
                <p className="text-sm text-green-bright">Estimación orientativa.</p>
              </div>

              <div className="mt-7 rounded-[20px] bg-carbon-soft p-4 sm:p-6">
                <div
                  className="mx-auto grid gap-1.5 sm:gap-2"
                  style={{ gridTemplateColumns: `repeat(${columnas}, minmax(0, 1fr))`, maxWidth: `${columnas * 3.4}rem` }}
                  aria-hidden
                >
                  {Array.from({ length: result.paneles }, (_, i) => (
                    <span
                      key={i}
                      className="aspect-[1/1.65] rounded-[3px] border border-cream/25 transition-[opacity,transform] duration-300 ease-[cubic-bezier(0.23,1,0.32,1)] starting:scale-90 starting:opacity-0"
                      style={{
                        transitionDelay: `${Math.min(i, 12) * 18}ms`,
                        backgroundColor: "#1d2733",
                        backgroundImage:
                          "linear-gradient(to right, rgb(250 246 236 / 10%) 1px, transparent 1px), linear-gradient(to bottom, rgb(250 246 236 / 10%) 1px, transparent 1px)",
                        backgroundSize: "33.4% 16.7%",
                      }}
                    />
                  ))}
                </div>
                <p className="mt-4 text-center text-xs text-cream/75">
                  Distribución indicativa. La disposición real depende de tu tejado.
                </p>
              </div>

              <dl className="mt-8 grid grid-cols-2 gap-x-6 gap-y-6 sm:grid-cols-3">
                <div>
                  <dt className="text-xs text-cream/75">Paneles</dt>
                  <dd className="font-display tnum mt-1 text-2xl">{result.paneles}</dd>
                </div>
                <div>
                  <dt className="text-xs text-cream/75">Potencia</dt>
                  <dd className="font-display tnum mt-1 text-2xl">{kwp.format(result.potenciaKwp)} kWp</dd>
                </div>
                <div>
                  <dt className="text-xs text-cream/75">Producción anual</dt>
                  <dd className="mt-1">
                    <LiveNumber
                      value={result.produccionAnualKwh}
                      format={(n) => `${int.format(Math.round(n / 100) * 100)} kWh`}
                      className="font-display tnum text-2xl"
                    />
                  </dd>
                </div>
                <div>
                  <dt className="text-xs text-cream/75">Autoconsumo</dt>
                  <dd className="font-display tnum mt-1 text-2xl">~{result.autoconsumoPct} %</dd>
                </div>
                <div>
                  <dt className="text-xs text-cream/75">Amortización</dt>
                  <dd className="font-display tnum mt-1 text-2xl">~{result.amortizacionAnios} años</dd>
                </div>
                <div>
                  <dt className="text-xs text-cream/75">Ahorro anual</dt>
                  <dd className="mt-1">
                    <LiveNumber
                      value={result.ahorroAnual}
                      format={(n) => eur.format(Math.round(n / 10) * 10)}
                      className="font-display tnum text-2xl text-green-bright"
                    />
                  </dd>
                </div>
              </dl>

              {/* Producción mensual: reparto orientativo del total anual estimado. */}
              <div className="mt-8 border-t border-cream/15 pt-6">
                <p className="text-xs text-cream/75">Producción estimada por mes</p>
                <div className="mt-4 grid h-24 grid-cols-12 items-end gap-1.5" aria-hidden>
                  {PERFIL_MENSUAL.map((f, i) => (
                    <span
                      key={i}
                      className="w-full rounded-[4px] bg-green-bright/85 transition-[height] duration-500 ease-[cubic-bezier(0.23,1,0.32,1)]"
                      style={{ height: `${(f / PICO) * 100 * Math.min(1, 0.35 + result.produccionAnualKwh / 14000)}%` }}
                    />
                  ))}
                </div>
                <div className="mt-2 grid grid-cols-12 gap-1.5 text-center text-[0.7rem] text-cream/70" aria-hidden>
                  {MESES.map((m, i) => (
                    <span key={i}>{m}</span>
                  ))}
                </div>
                <p className="sr-only">La producción se concentra entre abril y septiembre, con el máximo en julio.</p>
              </div>

              <div className="mt-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <p className="max-w-xs text-sm text-cream/80">Lo confirmamos con un estudio de tu tejado.</p>
                <Button as="a" href="#contacto" variant="primary" className="shrink-0">
                  Solicitar estudio solar
                </Button>
              </div>

              <p className="mt-8 border-t border-cream/15 pt-6 text-xs leading-relaxed text-cream/75">
                Calculado con paneles de 450 W, la irradiancia media de {provincia} y sin batería. Autoconsumo: parte de
                la producción que se usa en casa en el momento. La inversión orientativa ronda los{" "}
                {eur.format(result.inversionEstimada)}; el presupuesto real sale del estudio solar.
              </p>
            </div>
          </div>
        </Reveal>
      </Container>
    </section>
  );
}
