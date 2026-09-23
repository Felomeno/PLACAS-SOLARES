"use client";

import { useState } from "react";
import Image from "next/image";
import clsx from "clsx";
import { Plus } from "@phosphor-icons/react/dist/ssr";
import { Container } from "@/components/ui/Container";
import { SERVICIOS } from "@/lib/constants";

// Acordeón sobre verde oscuro: un servicio abierto cada vez, con foto y etiquetas.
// La altura se anima con grid-template-rows (0fr → 1fr), sin medir en JS.
export function Solutions() {
  const [abierto, setAbierto] = useState(0);

  return (
    <section id="soluciones" className="bg-cream px-2 py-2 sm:px-3">
      <div className="rounded-[28px] bg-carbon py-20 text-cream sm:rounded-[36px] sm:py-28">
        <Container>
          <div className="max-w-3xl">
            <p className="label text-cream/75">Qué instalamos</p>
            <h2 className="font-display mt-5 text-4xl leading-[1.02] font-normal tracking-[-0.028em] text-balance sm:text-6xl lg:text-7xl">
              Todo lo que va en el tejado y detrás de la pared.
            </h2>
          </div>

          <ul className="mt-14 border-t border-cream/15 sm:mt-20">
            {SERVICIOS.map((s, i) => {
              const open = abierto === i;
              return (
                <li key={s.id} className="border-b border-cream/15">
                  <h3>
                    <button
                      type="button"
                      id={`servicio-${s.id}`}
                      aria-expanded={open}
                      aria-controls={`servicio-panel-${s.id}`}
                      onClick={() => setAbierto(open ? -1 : i)}
                      className="group flex w-full items-center justify-between gap-6 py-6 text-left sm:py-8"
                    >
                      <span
                        className={clsx(
                          "font-display text-2xl font-normal tracking-[-0.02em] transition-colors duration-200 sm:text-4xl",
                          open ? "text-cream" : "text-cream/75 group-hover:text-cream",
                        )}
                      >
                        {s.title}
                      </span>
                      <span
                        className={clsx(
                          "flex size-10 shrink-0 items-center justify-center rounded-full transition-[background-color,color,transform] duration-300 ease-[cubic-bezier(0.23,1,0.32,1)] sm:size-12",
                          open ? "rotate-45 bg-green-bright text-carbon" : "bg-cream text-carbon group-hover:scale-105",
                        )}
                        aria-hidden
                      >
                        <Plus size={18} weight="bold" />
                      </span>
                    </button>
                  </h3>
                  <div
                    id={`servicio-panel-${s.id}`}
                    role="region"
                    aria-labelledby={`servicio-${s.id}`}
                    className={clsx(
                      "grid transition-[grid-template-rows,opacity] duration-500 ease-[cubic-bezier(0.23,1,0.32,1)]",
                      open ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0",
                    )}
                    inert={!open}
                  >
                    <div className="overflow-hidden">
                      <div
                        className={clsx(
                          "grid grid-cols-1 gap-6 pb-8 sm:gap-10 sm:pb-10",
                          s.image && "md:grid-cols-[minmax(0,1.1fr)_minmax(0,1fr)]",
                        )}
                      >
                        {s.image && (
                          <div className="relative aspect-[16/10] overflow-hidden rounded-[22px] bg-carbon-soft">
                            <Image
                              src={s.image}
                              alt={s.imageAlt ?? ""}
                              fill
                              sizes="(min-width: 768px) 50vw, 100vw"
                              className="object-cover"
                            />
                          </div>
                        )}
                        <div className="flex flex-col justify-between gap-6">
                          <p className="max-w-md text-lg leading-relaxed text-cream/80">{s.description}</p>
                          <ul className="flex flex-wrap gap-2" aria-label="Incluye">
                            {s.tags.map((t) => (
                              <li
                                key={t}
                                className="rounded-full border border-cream/20 px-3.5 py-1.5 text-sm text-cream/85"
                              >
                                {t}
                              </li>
                            ))}
                          </ul>
                        </div>
                      </div>
                    </div>
                  </div>
                </li>
              );
            })}
          </ul>
        </Container>
      </div>
    </section>
  );
}
