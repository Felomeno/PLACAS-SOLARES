import Image from "next/image";
import clsx from "clsx";
import { Container } from "@/components/ui/Container";
import { PROYECTOS } from "@/lib/constants";

const kwp = (n: number) => `${n.toLocaleString("es-ES", { maximumFractionDigits: 1 })} kWp`;
const eur = (n: number) =>
  new Intl.NumberFormat("es-ES", { style: "currency", currency: "EUR", maximumFractionDigits: 0, useGrouping: true }).format(n);
const kwh = (n: number) => `${n.toLocaleString("es-ES", { useGrouping: true })} kWh/año`;

// Galería en dos columnas con alturas desfasadas: fotos grandes y los datos como etiquetas.
export function Projects() {
  return (
    <section id="proyectos" className="bg-cream py-24 sm:py-32">
      <Container>
        <div className="flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
          <div className="max-w-2xl">
            <p className="label text-ink-muted">Instalaciones tipo</p>
            <h2 className="font-display mt-5 text-4xl leading-[1.02] font-normal tracking-[-0.028em] text-balance text-ink sm:text-6xl lg:text-7xl">
              Tejados listos para producir.
            </h2>
          </div>
          <p className="max-w-sm text-[0.95rem] leading-relaxed text-ink-muted">
            Casos conceptuales con el número de paneles, la potencia y la producción que tendría cada inmueble.
          </p>
        </div>

        <div className="mt-14 grid grid-cols-1 gap-x-6 gap-y-14 sm:mt-20 md:grid-cols-2">
          {PROYECTOS.map((p, i) => (
            <article key={p.id} className={clsx("group", i % 2 === 1 && "md:mt-24")}>
              <div className="unveil relative aspect-[4/3] overflow-hidden rounded-[28px] bg-cream-deep">
                <Image
                  src={p.image}
                  alt={p.imageAlt}
                  fill
                  sizes="(min-width: 768px) 48vw, 100vw"
                  className="object-cover transition-transform duration-700 ease-[cubic-bezier(0.23,1,0.32,1)] group-hover:scale-[1.03]"
                />
              </div>
              <ul className="mt-5 flex flex-wrap gap-2" aria-label="Datos de la instalación">
                {[kwp(p.kwp), `${p.paneles} × 450 W`, kwh(p.produccionKwh)].map((d) => (
                  <li key={d} className="tnum rounded-full bg-cream-deep px-3.5 py-1.5 text-sm text-ink">
                    {d}
                  </li>
                ))}
              </ul>
              <div className="mt-4 flex flex-wrap items-baseline justify-between gap-x-6 gap-y-1">
                <h3 className="font-display text-2xl font-normal tracking-[-0.02em] text-ink sm:text-3xl">
                  {p.title}, {p.location}
                </h3>
                <p className="tnum text-sm text-ink-muted">Ahorro estimado {eur(p.ahorroAnual)}/año</p>
              </div>
              <p className="mt-1 text-xs text-ink-muted">Proyecto demostrativo</p>
            </article>
          ))}
        </div>
      </Container>
    </section>
  );
}
