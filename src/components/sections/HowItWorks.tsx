import Image from "next/image";
import { Check } from "@phosphor-icons/react/dist/ssr";
import { Container } from "@/components/ui/Container";
import { PROCESO } from "@/lib/constants";

// Cuatro pasos con cuatro composiciones distintas: lista, propuesta, foto y lectura en vivo.
// Las cifras de las visualizaciones son de la configuración de ejemplo, y así se indica.
export function HowItWorks() {
  const [estudio, diseno, instalacion, marcha] = PROCESO;

  return (
    <section id="proceso" className="bg-cream py-24 sm:py-32">
      <Container>
        <div className="max-w-3xl">
          <p className="label text-ink-muted">Cómo trabajamos</p>
          <h2 className="font-display mt-5 text-4xl leading-[1.02] font-normal tracking-[-0.028em] text-balance text-ink sm:text-6xl lg:text-7xl">
            Cuatro pasos, un mismo equipo.
          </h2>
        </div>

        <ol className="mt-14 grid grid-cols-1 gap-4 sm:mt-20 lg:grid-cols-12">
          {/* 01: lista de lo que se comprueba */}
          <li className="flex flex-col justify-between gap-10 rounded-[28px] bg-cream-deep p-7 sm:p-9 lg:col-span-5">
            <StepHead paso={estudio} />
            <ul className="space-y-2.5">
              {["Consumo de tus facturas", "Orientación y sombras", "Estado del cuadro eléctrico"].map((t) => (
                <li key={t} className="flex items-center gap-3 rounded-full bg-cream px-4 py-2.5 text-[0.95rem] text-ink">
                  <Check size={16} weight="bold" className="text-green" aria-hidden />
                  {t}
                </li>
              ))}
            </ul>
            <p className="text-[0.95rem] leading-relaxed text-ink-muted">{estudio.description}</p>
          </li>

          {/* 02: propuesta de ejemplo */}
          <li className="flex flex-col justify-between gap-10 rounded-[28px] bg-cream-deep p-7 sm:p-9 lg:col-span-7">
            <StepHead paso={diseno} />
            <div className="rounded-[22px] bg-cream p-5 sm:p-6">
              <div className="flex items-baseline justify-between">
                <p className="text-sm font-semibold text-ink">Propuesta de instalación</p>
                <p className="text-xs text-ink-muted">Ejemplo</p>
              </div>
              <dl className="mt-4 grid grid-cols-2 gap-x-6 gap-y-4 sm:grid-cols-4">
                {[
                  ["Paneles", "12 × 450 W"],
                  ["Potencia", "5,4 kWp"],
                  ["Producción", "8.400 kWh"],
                  ["Precio", "Cerrado"],
                ].map(([k, v]) => (
                  <div key={k}>
                    <dt className="text-xs text-ink-muted">{k}</dt>
                    <dd className="font-display tnum mt-1 text-xl text-ink">{v}</dd>
                  </div>
                ))}
              </dl>
            </div>
            <p className="max-w-lg text-[0.95rem] leading-relaxed text-ink-muted">{diseno.description}</p>
          </li>

          {/* 03: foto del montaje */}
          <li className="grid grid-cols-1 overflow-hidden rounded-[28px] bg-cream-deep sm:grid-cols-2 lg:col-span-7">
            <div className="relative aspect-[4/3] sm:aspect-auto sm:min-h-[20rem]">
              <Image
                src="/images/sol-mantenimiento.jpg"
                alt="Técnico revisando el montaje de paneles solares en una cubierta"
                fill
                sizes="(min-width: 1024px) 30vw, (min-width: 640px) 50vw, 100vw"
                className="object-cover"
              />
            </div>
            <div className="flex flex-col justify-between gap-8 p-7 sm:p-9">
              <StepHead paso={instalacion} />
              <p className="text-[0.95rem] leading-relaxed text-ink-muted">{instalacion.description}</p>
            </div>
          </li>

          {/* 04: lectura de la app, en oscuro para cerrar la secuencia */}
          <li className="flex flex-col justify-between gap-10 rounded-[28px] bg-carbon p-7 text-cream sm:p-9 lg:col-span-5">
            <StepHead paso={marcha} dark />
            <div className="rounded-[22px] bg-carbon-soft p-5">
              <div className="flex items-center justify-between text-xs text-cream/75">
                <span className="flex items-center gap-2">
                  <span className="size-2 rounded-full bg-green-bright" aria-hidden />
                  Produciendo
                </span>
                <span>Ejemplo de la app</span>
              </div>
              <div className="mt-5 flex h-16 items-end gap-1.5" aria-hidden>
                {[18, 30, 46, 62, 78, 90, 96, 88, 72, 52, 34, 20].map((h, i) => (
                  <span key={i} className="flex-1 rounded-[3px] bg-green-bright/80" style={{ height: `${h}%` }} />
                ))}
              </div>
              <p className="mt-3 text-xs text-cream/75">Producción a lo largo del día</p>
            </div>
            <p className="text-[0.95rem] leading-relaxed text-cream/80">{marcha.description}</p>
          </li>
        </ol>
      </Container>
    </section>
  );
}

function StepHead({ paso, dark = false }: { paso: (typeof PROCESO)[number]; dark?: boolean }) {
  return (
    <div>
      <p className={`tnum text-sm font-semibold ${dark ? "text-green-bright" : "text-green-deep"}`}>{paso.numero}</p>
      <h3 className="font-display mt-2 text-3xl font-normal tracking-[-0.025em] sm:text-4xl">{paso.title}</h3>
    </div>
  );
}
