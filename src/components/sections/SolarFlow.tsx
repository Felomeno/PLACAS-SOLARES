"use client";

import { useState } from "react";
import clsx from "clsx";
import {
  BatteryCharging,
  BatteryMedium,
  House,
  Moon,
  PlugsConnected,
  SolarPanel,
  Sun,
  WaveSine,
} from "@phosphor-icons/react/dist/ssr";
import { Container } from "@/components/ui/Container";

type Modo = "dia" | "noche";
type NodoId = "sol" | "paneles" | "inversor" | "vivienda" | "bateria" | "red";
type TramoId = "luz" | "dc" | "ac" | "bateria" | "red";

// Coordenadas en el mismo sistema que el viewBox del SVG (400 × 520): los nodos HTML y
// las líneas comparten posiciones porque el contenedor tiene la misma proporción.
const NODOS: Record<NodoId, { x: number; y: number }> = {
  sol: { x: 200, y: 40 },
  paneles: { x: 200, y: 142 },
  inversor: { x: 200, y: 246 },
  vivienda: { x: 200, y: 350 },
  bateria: { x: 80, y: 474 },
  red: { x: 320, y: 474 },
};

const TRAMOS_BASE = [
  "M200 68 V112",
  "M200 170 V216",
  "M200 274 V320",
  "M200 378 V410 H80 V444",
  "M200 378 V410 H320 V444",
];

// Cada flujo es un trazado con sentido: la flecha marca hacia dónde va la electricidad.
const FLUJOS: Record<Modo, { id: TramoId; d: string; tenue?: boolean }[]> = {
  dia: [
    { id: "luz", d: "M200 68 V112" },
    { id: "dc", d: "M200 170 V216" },
    { id: "ac", d: "M200 274 V320" },
    { id: "bateria", d: "M200 378 V410 H80 V444" },
    { id: "red", d: "M200 378 V410 H320 V444" },
  ],
  noche: [
    { id: "bateria", d: "M80 444 V410 H200 V380" },
    { id: "red", d: "M320 444 V410 H200 V380", tenue: true },
  ],
};

interface Paso {
  title: string;
  description: string;
  nodos: NodoId[];
  tramos: TramoId[];
}

const PASOS: Record<Modo, Paso[]> = {
  dia: [
    {
      title: "Los paneles generan electricidad",
      description: "Las placas convierten la luz del sol en corriente continua.",
      nodos: ["sol", "paneles"],
      tramos: ["luz"],
    },
    {
      title: "El inversor la transforma",
      description: "La convierte en corriente alterna, la misma que llega a los enchufes de casa.",
      nodos: ["paneles", "inversor"],
      tramos: ["dc"],
    },
    {
      title: "Tu casa la usa primero",
      description: "La electricidad que producen tus paneles se consume antes que la de la red.",
      nodos: ["inversor", "vivienda"],
      tramos: ["ac"],
    },
    {
      title: "El excedente se almacena",
      description: "Lo que sobra puede cargar una batería para usarlo más tarde.",
      nodos: ["vivienda", "bateria"],
      tramos: ["bateria"],
    },
    {
      title: "El resto puede ir a la red",
      description: "Sin batería, o con ella llena, se vierte a la red según la configuración y las condiciones aplicables.",
      nodos: ["vivienda", "red"],
      tramos: ["red"],
    },
  ],
  noche: [
    {
      title: "Sin sol, no hay producción",
      description: "Por la noche los paneles no generan electricidad.",
      nodos: ["sol", "paneles"],
      tramos: [],
    },
    {
      title: "La batería alimenta tu casa",
      description: "La energía guardada durante el día cubre el consumo de la noche.",
      nodos: ["bateria", "vivienda"],
      tramos: ["bateria"],
    },
    {
      title: "La red cubre lo que falte",
      description: "Si la batería se agota, la vivienda toma electricidad de la red, como hasta ahora.",
      nodos: ["red", "vivienda"],
      tramos: ["red"],
    },
  ],
};

export function SolarFlow() {
  const [modo, setModo] = useState<Modo>("dia");
  const [activo, setActivo] = useState<number | null>(null);
  const noche = modo === "noche";
  const paso = activo === null ? null : PASOS[modo][activo];

  const nodoVisible = (id: NodoId) => !paso || paso.nodos.includes(id);
  const tramoVisible = (id: TramoId) => !paso || paso.tramos.includes(id);

  function cambiarModo(next: Modo) {
    setModo(next);
    setActivo(null);
  }

  const etiquetas: Record<NodoId, { label: string; icon: React.ReactNode }> = {
    sol: {
      label: noche ? "Noche" : "Sol",
      icon: noche ? <Moon size={34} weight="light" className="size-6 sm:size-[34px]" /> : <Sun size={34} weight="fill" className="size-6 text-green-vivid sm:size-[34px]" />,
    },
    paneles: { label: "Paneles", icon: <SolarPanel size={34} weight="light" className="size-6 sm:size-[34px]" /> },
    inversor: { label: "Inversor", icon: <WaveSine size={34} weight="light" className="size-6 sm:size-[34px]" /> },
    vivienda: { label: "Vivienda", icon: <House size={34} weight="light" className="size-6 sm:size-[34px]" /> },
    bateria: {
      label: "Batería",
      icon: noche ? <BatteryMedium size={34} weight="light" className="size-6 sm:size-[34px]" /> : <BatteryCharging size={34} weight="light" className="size-6 sm:size-[34px]" />,
    },
    red: { label: "Red eléctrica", icon: <PlugsConnected size={34} weight="light" className="size-6 sm:size-[34px]" /> },
  };

  return (
    <section id="como-funciona" className="bg-cream px-2 py-2 sm:px-3">
      <div className="rounded-[28px] bg-cream-deep py-24 sm:rounded-[36px] sm:py-32">
      <Container>
        <div className="grid grid-cols-1 gap-x-20 gap-y-12 lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)]">
          <div>
            <p className="label text-ink-muted">Cómo funciona</p>
            <h2 className="mt-5 font-display max-w-lg text-4xl leading-[1.02] font-normal tracking-[-0.028em] text-balance text-ink sm:text-6xl">
              Cómo funciona una instalación solar
            </h2>
            <p className="mt-5 max-w-md text-lg text-ink-muted">
              La electricidad que producen tus paneles se usa primero en tu casa. Cuando sobra, se guarda o se envía a
              la red.
            </p>

            <div className="mt-8 inline-flex rounded-full border border-ink/15 p-1" role="group" aria-label="Momento del día">
              {(
                [
                  { value: "dia", label: "De día", icon: <Sun size={18} /> },
                  { value: "noche", label: "De noche", icon: <Moon size={18} /> },
                ] as const
              ).map((m) => (
                <button
                  key={m.value}
                  type="button"
                  onClick={() => cambiarModo(m.value)}
                  aria-pressed={modo === m.value}
                  className={clsx(
                    "inline-flex items-center gap-2 rounded-full px-5 py-2.5 text-sm font-semibold transition-[background-color,color,transform] duration-200 active:scale-[0.97]",
                    modo === m.value
                      ? m.value === "dia"
                        ? "bg-green text-cream"
                        : "bg-carbon text-cream"
                      : "text-ink-muted hover:text-ink",
                  )}
                >
                  {m.icon}
                  {m.label}
                </button>
              ))}
            </div>
          </div>

          {/* Esquema */}
          <div className="lg:col-start-2 lg:row-span-2 lg:row-start-1">
            <div
              className={clsx(
                "rounded-[28px] px-4 py-6 transition-colors duration-500 ease-out sm:px-8 sm:py-8",
                noche ? "bg-carbon text-cream" : "bg-cream text-ink",
              )}
            >
              <div className="relative mx-auto aspect-[400/520] w-full max-w-[520px]">
                <svg
                  viewBox="0 0 400 520"
                  className="absolute inset-0 h-full w-full"
                  style={{ "--flow-color": noche ? "var(--color-green-bright)" : "var(--color-green-vivid)" } as React.CSSProperties}
                  aria-hidden
                >
                  <defs>
                    <marker
                      id="flujo-flecha"
                      viewBox="0 0 10 10"
                      refX="5"
                      refY="5"
                      markerWidth="5"
                      markerHeight="5"
                      orient="auto"
                    >
                      <path d="M0 1 L9 5 L0 9 z" fill="var(--flow-color)" />
                    </marker>
                  </defs>
                  {TRAMOS_BASE.map((d) => (
                    <path
                      key={d}
                      d={d}
                      fill="none"
                      strokeWidth={1.5}
                      className={clsx("transition-colors duration-500", noche ? "stroke-cream/20" : "stroke-ink/15")}
                    />
                  ))}
                  {FLUJOS[modo].map((f) => (
                    <path
                      key={`${modo}-${f.id}`}
                      d={f.d}
                      fill="none"
                      stroke="var(--flow-color)"
                      strokeWidth={2.5}
                      strokeLinecap="round"
                      markerEnd="url(#flujo-flecha)"
                      className="flow transition-opacity duration-200 ease-out"
                      style={{ opacity: tramoVisible(f.id) ? (f.tenue ? 0.45 : 1) : 0.12 }}
                    />
                  ))}
                </svg>

                {(Object.keys(NODOS) as NodoId[]).map((id) => (
                  <div
                    key={id}
                    className={clsx(
                      "absolute flex -translate-x-1/2 -translate-y-1/2 flex-col items-center gap-1 rounded-[12px] border px-2 py-1.5 text-center transition-[opacity,background-color,border-color] duration-200 ease-out sm:px-4 sm:py-2.5",
                      noche ? "border-cream/15 bg-carbon" : "border-ink/10 bg-cream",
                    )}
                    style={{
                      left: `${(NODOS[id].x / 400) * 100}%`,
                      top: `${(NODOS[id].y / 520) * 100}%`,
                      opacity: nodoVisible(id) ? 1 : 0.3,
                    }}
                  >
                    {etiquetas[id].icon}
                    <span className="text-xs font-semibold whitespace-nowrap sm:text-[0.95rem]">{etiquetas[id].label}</span>
                  </div>
                ))}

                {/* Anotaciones: lo que no es un nodo del flujo, pero forma parte de la instalación. */}
                <span
                  className={clsx(
                    "absolute top-[57%] left-[56%] flex items-center gap-2 text-[0.7rem] sm:text-xs",
                    noche ? "text-cream/75" : "text-ink-muted",
                  )}
                >
                  <span className={clsx("h-px w-4", noche ? "bg-cream/40" : "bg-ink/30")} />
                  Protecciones
                </span>
                <span
                  className={clsx(
                    "absolute top-[47.3%] right-[2%] flex items-center gap-2 text-[0.7rem] sm:text-xs",
                    noche ? "text-cream/75" : "text-ink-muted",
                  )}
                >
                  <span className={clsx("h-px w-4", noche ? "bg-cream/40" : "bg-ink/30")} />
                  Monitorización
                </span>
              </div>
            </div>
          </div>

          <ol className="space-y-1 lg:self-end">
            {PASOS[modo].map((p, i) => (
              <li key={`${modo}-${p.title}`}>
                <button
                  type="button"
                  onClick={() => setActivo(activo === i ? null : i)}
                  aria-pressed={activo === i}
                  className="group flex w-full gap-5 rounded-[14px] py-3.5 text-left"
                >
                  <span
                    className={clsx(
                      "tnum mt-1 text-sm font-semibold transition-colors duration-200",
                      activo === i ? "text-ink" : "text-ink-muted",
                    )}
                  >
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <span>
                    <span
                      className={clsx(
                        "font-display block text-lg font-normal transition-colors duration-200 sm:text-xl",
                        activo === null || activo === i ? "text-ink" : "text-ink/70 group-hover:text-ink",
                      )}
                    >
                      {p.title}
                    </span>
                    <span className="mt-1 block max-w-md text-[0.95rem] leading-relaxed text-ink-muted">
                      {p.description}
                    </span>
                  </span>
                </button>
              </li>
            ))}
          </ol>
        </div>
      </Container>
      </div>
    </section>
  );
}
