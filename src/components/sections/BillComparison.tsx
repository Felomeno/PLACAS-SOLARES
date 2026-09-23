"use client";

import { useState } from "react";
import clsx from "clsx";
import { Container } from "@/components/ui/Container";

const eur = (n: number) => new Intl.NumberFormat("es-ES", { style: "currency", currency: "EUR", maximumFractionDigits: 0 }).format(n);
const kwh = (n: number) => `${new Intl.NumberFormat("es-ES").format(n)} kWh`;

// Mes de ejemplo de una vivienda unifamiliar: 380 kWh de consumo. Cifras redondeadas.
const CONSUMO = 380;
const ESCENARIOS = {
  sin: { red: 380, produccion: 0, autoconsumo: 0, excedentes: 0, factura: 96 },
  con: { red: 180, produccion: 420, autoconsumo: 200, excedentes: 220, factura: 46 },
};
const ESCALA = 420; // la barra más larga, para que ambas compartan escala

export function BillComparison() {
  const [conPlacas, setConPlacas] = useState(false);
  const e = conPlacas ? ESCENARIOS.con : ESCENARIOS.sin;
  const ahorro = ESCENARIOS.sin.factura - ESCENARIOS.con.factura;

  const metricas = [
    { label: "Consumo de red", value: kwh(e.red) },
    { label: "Producción solar", value: kwh(e.produccion) },
    { label: "Autoconsumo", value: kwh(e.autoconsumo) },
    { label: "Excedentes", value: kwh(e.excedentes) },
  ];

  return (
    <section id="ahorro" className="bg-cream-deep py-24 sm:py-32">
      <Container>
        <div className="grid grid-cols-1 gap-14 lg:grid-cols-[minmax(0,1.1fr)_minmax(0,0.9fr)] lg:items-center lg:gap-20">
          <div>
            <p className="label text-ink">Ahorro</p>
            <h2 className="mt-5 font-display text-4xl leading-[1.02] font-normal tracking-[-0.028em] text-balance text-ink sm:text-6xl">
              Tu casa, sin placas y con placas.
            </h2>
            <p className="mt-5 max-w-md text-lg text-ink-muted">
              Con placas, parte de lo que consumes sale de tu tejado y compras menos a la red. Lo que sobra se guarda en
              una batería o se envía a la red, según tu configuración.
            </p>

            <div className="mt-8 inline-flex rounded-[12px] border border-ink/15 bg-paper p-1" role="group" aria-label="Escenario">
              {[
                { value: false, label: "Sin placas" },
                { value: true, label: "Con placas" },
              ].map((o) => (
                <button
                  key={o.label}
                  type="button"
                  onClick={() => setConPlacas(o.value)}
                  aria-pressed={conPlacas === o.value}
                  className={clsx(
                    "rounded-[8px] px-5 py-2.5 text-sm font-semibold transition-[background-color,color,transform] duration-200 active:scale-[0.97]",
                    conPlacas === o.value ? (o.value ? "bg-sky-deep text-paper" : "bg-carbon text-cream") : "text-ink-muted hover:text-ink",
                  )}
                >
                  {o.label}
                </button>
              ))}
            </div>
          </div>

          <div className="rounded-[20px] bg-paper p-7 sm:p-10 lg:order-first">
            <div className="flex flex-col gap-1 sm:flex-row sm:items-baseline sm:justify-between sm:gap-4">
              <p className="font-display text-lg font-normal text-ink">Un mes de ejemplo</p>
              <p className="text-xs text-ink-muted">Vivienda unifamiliar, {kwh(CONSUMO)} de consumo</p>
            </div>

            {/* Dos barras con la misma escala: de dónde sale la energía de casa y a dónde va la de las placas. */}
            <div className="mt-8 space-y-7">
              <div>
                <p className="text-sm font-medium text-ink">Lo que consume tu casa</p>
                <div className="mt-2.5 flex h-9 gap-1" style={{ width: `${(CONSUMO / ESCALA) * 100}%` }}>
                  <span
                    className="h-full rounded-[6px] bg-sky-deep transition-[flex-grow] duration-500 ease-[cubic-bezier(0.77,0,0.175,1)]"
                    style={{ flexGrow: e.autoconsumo, flexBasis: 0 }}
                  />
                  <span
                    className="h-full rounded-[6px] bg-ink/75 transition-[flex-grow] duration-500 ease-[cubic-bezier(0.77,0,0.175,1)]"
                    style={{ flexGrow: e.red, flexBasis: 0 }}
                  />
                </div>
                <div className="mt-2 flex gap-5 text-xs text-ink-muted">
                  <span className="flex items-center gap-1.5">
                    <span className="size-2 rounded-[2px] bg-sky-deep" /> De tus placas
                  </span>
                  <span className="flex items-center gap-1.5">
                    <span className="size-2 rounded-[2px] bg-ink/75" /> De la red
                  </span>
                </div>
              </div>

              <div>
                <p className="text-sm font-medium text-ink">Lo que producen tus placas</p>
                <div
                  className="mt-2.5 flex h-9 gap-1 transition-[width,opacity] duration-500 ease-[cubic-bezier(0.77,0,0.175,1)]"
                  style={{ width: `${(e.produccion / ESCALA) * 100}%`, opacity: conPlacas ? 1 : 0 }}
                >
                  <span className="h-full rounded-[6px] bg-sky-deep" style={{ flexGrow: e.autoconsumo || 1, flexBasis: 0 }} />
                  <span
                    className="h-full rounded-[6px] border border-sky-deep/50 bg-sky-light/70"
                    style={{ flexGrow: e.excedentes || 1, flexBasis: 0 }}
                  />
                </div>
                <div className="mt-2 flex min-h-4 gap-5 text-xs text-ink-muted">
                  {conPlacas ? (
                    <>
                      <span className="flex items-center gap-1.5">
                        <span className="size-2 rounded-[2px] bg-sky-deep" /> Usado en casa
                      </span>
                      <span className="flex items-center gap-1.5">
                        <span className="size-2 rounded-[2px] border border-sky-deep/50 bg-sky-light/70" /> Excedentes
                      </span>
                    </>
                  ) : (
                    <span>Sin placas no hay producción propia.</span>
                  )}
                </div>
              </div>
            </div>

            <dl className="mt-9 grid grid-cols-2 gap-x-6 gap-y-5 border-t border-line pt-7 sm:grid-cols-4">
              {metricas.map((m) => (
                <div key={m.label}>
                  <dt className="text-xs text-ink-muted">{m.label}</dt>
                  <dd className="tnum mt-1 text-base font-semibold text-ink">{m.value}</dd>
                </div>
              ))}
            </dl>

            <div className="mt-7 flex flex-wrap items-end justify-between gap-4 border-t border-line pt-7">
              <div>
                <p className="text-xs text-ink-muted">Factura estimada del mes</p>
                <p className="font-display tnum mt-1 text-4xl font-normal text-ink">{eur(e.factura)}</p>
              </div>
              <p
                className={clsx(
                  "tnum text-sm font-semibold text-sky-ink transition-opacity duration-200",
                  conPlacas ? "opacity-100" : "opacity-0",
                )}
                aria-hidden={!conPlacas}
              >
                Ahorro estimado: {eur(ahorro)} este mes
              </p>
            </div>

            <p className="mt-6 text-xs text-ink-muted">
              Ejemplo ilustrativo, no es una garantía de ahorro. El resultado real depende de tu consumo, tu tarifa y
              cómo se compensen los excedentes.
            </p>
          </div>
        </div>
      </Container>
    </section>
  );
}
