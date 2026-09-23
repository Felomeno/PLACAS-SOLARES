import Image from "next/image";
import { Container } from "@/components/ui/Container";

// Puntos anotados sobre la foto. La imagen se muestra con su proporción original (2:3),
// así que las posiciones en porcentaje caen siempre sobre el mismo detalle.
const ANOTACIONES = [
  { label: "Vidrio templado", x: 44, y: 52, side: "right" as const },
  { label: "Marco de aluminio", x: 54, y: 37, side: "right" as const },
  { label: "Células monocristalinas", x: 70, y: 79, side: "left" as const },
];

const DESTACADAS = [
  { value: "450 W", label: "de potencia por panel" },
  { value: "25+ años", label: "de vida útil habitual" },
];

const FICHA = [
  { label: "Tecnología", value: "Silicio monocristalino, de alta eficiencia" },
  { label: "Exterior", value: "Vidrio templado y marco de aluminio, pensados para sol, lluvia y viento" },
  { label: "Rendimiento", value: "Pérdida gradual y lenta de producción a lo largo de las décadas" },
  { label: "Garantías", value: "De producto y de rendimiento, en los términos de cada fabricante" },
];

const COMPONENTES = [
  {
    title: "Paneles fotovoltaicos",
    description: "Captan la energía del sol y la convierten en electricidad.",
    size: "lg" as const,
  },
  {
    title: "Inversor",
    description: "Convierte la corriente continua de los paneles en la corriente alterna que usa tu casa.",
    size: "lg" as const,
  },
  {
    title: "Batería",
    description: "Almacena los excedentes del día para cuando no hay sol.",
    size: "md" as const,
  },
  {
    title: "Monitorización",
    description: "Controla producción y consumo desde el móvil.",
    size: "sm" as const,
  },
  {
    title: "Protecciones",
    description: "Protegen la instalación y la vivienda ante sobretensiones y fallos.",
    size: "sm" as const,
  },
];

export function PanelShowcase() {
  return (
    <section id="paneles" className="bg-cream px-2 py-2 sm:px-3">
      <div className="rounded-[28px] bg-carbon py-24 text-cream sm:rounded-[36px] sm:py-32">
      <Container>
        <div className="grid grid-cols-1 gap-14 lg:grid-cols-12 lg:gap-16">
          <figure className="relative lg:col-span-5">
            <div className="relative aspect-[2/3] overflow-hidden rounded-[28px] bg-carbon-soft">
              <Image
                src="/images/panel-reflejo.jpg"
                alt="Paneles fotovoltaicos negros de células monocristalinas instalados sobre un tejado, vistos de cerca"
                fill
                sizes="(min-width: 1024px) 38vw, 100vw"
                className="object-cover"
              />
              {ANOTACIONES.map((a) => (
                <span
                  key={a.label}
                  className="absolute hidden items-center gap-2 sm:flex"
                  style={{
                    top: `${a.y}%`,
                    ...(a.side === "right" ? { left: `${a.x}%` } : { right: `${100 - a.x}%` }),
                    flexDirection: a.side === "right" ? "row" : "row-reverse",
                    transform: "translateY(-50%)",
                  }}
                >
                  <span className="size-2.5 shrink-0 rounded-full border-2 border-green-bright bg-carbon" />
                  <span className="h-px w-8 bg-cream/70" />
                  <span className="rounded-[6px] bg-carbon/80 px-2 py-1 text-xs font-medium whitespace-nowrap text-cream">
                    {a.label}
                  </span>
                </span>
              ))}
            </div>
          </figure>

          <div className="lg:col-span-7 lg:self-center lg:pl-6">
            <p className="label text-cream/75">Producto</p>
            <h2 className="mt-5 font-display max-w-xl text-4xl leading-[1.02] font-normal tracking-[-0.028em] text-balance sm:text-6xl lg:text-6xl">
              Paneles pensados para trabajar décadas en tu tejado.
            </h2>
            <p className="mt-6 max-w-lg text-lg text-cream/80">
              Instalamos paneles monocristalinos de alta eficiencia, elegidos para la orientación y el espacio de cada
              cubierta.
            </p>

            <div className="mt-12 grid grid-cols-2 gap-8 border-t border-cream/25 pt-8">
              {DESTACADAS.map((d) => (
                <div key={d.value}>
                  <p className="font-display tnum text-4xl leading-[1.02] font-normal tracking-[-0.028em] text-green-bright sm:text-5xl">
                    {d.value}
                  </p>
                  <p className="mt-2 text-sm text-cream/75">{d.label}</p>
                </div>
              ))}
            </div>

            <dl className="mt-10 grid grid-cols-1 gap-x-10 gap-y-6 sm:grid-cols-2">
              {FICHA.map((f) => (
                <div key={f.label}>
                  <dt className="text-sm font-semibold text-cream">{f.label}</dt>
                  <dd className="mt-1 text-[0.95rem] leading-relaxed text-cream/75">{f.value}</dd>
                </div>
              ))}
            </dl>
            <p className="mt-8 text-xs text-cream/70">
              Configuración de ejemplo. El modelo concreto se elige en el estudio de cada tejado.
            </p>
          </div>
        </div>

        {/* Componentes: escalas distintas según su peso en la instalación. */}
        <div className="mt-28 grid grid-cols-1 gap-12 lg:mt-36 lg:grid-cols-12 lg:gap-16">
          <div className="lg:col-span-4">
            <div className="lg:sticky lg:top-28">
              <h3 className="font-display max-w-xs text-3xl font-normal tracking-[-0.02em] text-balance sm:text-4xl">
                Qué lleva una instalación completa
              </h3>
              <div className="relative mt-8 aspect-[4/3] overflow-hidden rounded-[28px] bg-carbon-soft lg:aspect-[4/5]">
                <Image
                  src="/images/sol-mantenimiento.jpg"
                  alt="Técnico revisando el montaje de una instalación de paneles solares en una cubierta"
                  fill
                  sizes="(min-width: 1024px) 28vw, 100vw"
                  className="object-cover"
                />
              </div>
            </div>
          </div>
          <div className="lg:col-span-8">
            <div className="grid grid-cols-1 gap-x-12 sm:grid-cols-2">
              {COMPONENTES.map((c) => (
                <div
                  key={c.title}
                  className={
                    c.size === "lg"
                      ? "border-t border-cream/25 py-8 sm:col-span-2 sm:grid sm:grid-cols-[minmax(0,1.1fr)_minmax(0,1fr)] sm:items-baseline sm:gap-12"
                      : c.size === "md"
                        ? "border-t border-cream/25 py-8 sm:col-span-2"
                        : "border-t border-cream/25 py-7"
                  }
                >
                  <p
                    className={
                      c.size === "lg"
                        ? "font-display text-3xl font-normal tracking-[-0.02em] sm:text-[2.6rem] sm:leading-[1.05]"
                        : c.size === "md"
                          ? "font-display text-2xl font-normal sm:text-3xl"
                          : "font-display text-xl font-normal sm:text-2xl"
                    }
                  >
                    {c.title}
                  </p>
                  <p className="mt-2 max-w-md text-[0.95rem] leading-relaxed text-cream/75 sm:mt-2">
                    {c.description}
                    {c.title === "Batería" && (
                      <>
                        {" "}
                        <a
                          href="#como-funciona"
                          className="text-green-bright underline decoration-green-bright/50 underline-offset-4 transition-colors hover:decoration-green-bright"
                        >
                          Así funciona de noche
                        </a>
                      </>
                    )}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </Container>
      </div>
    </section>
  );
}
