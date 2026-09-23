"use client";

import { useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { Plus } from "@phosphor-icons/react/dist/ssr";
import { Container } from "@/components/ui/Container";
import { FAQ as FAQ_ITEMS } from "@/lib/constants";

export function Faq() {
  const [open, setOpen] = useState<number | null>(0);
  const reduce = useReducedMotion();

  return (
    <section id="faq" className="scroll-mt-16 bg-cream py-24 sm:py-32">
      <Container>
        <div className="grid grid-cols-1 gap-12 lg:grid-cols-[minmax(0,0.8fr)_minmax(0,1.2fr)] lg:gap-20">
          <div className="lg:sticky lg:top-28 lg:self-start">
            <p className="label text-ink-muted">Preguntas frecuentes</p>
            <h2 className="mt-5 font-display text-4xl leading-[1.02] font-normal tracking-[-0.028em] text-ink sm:text-6xl">
              Antes de instalar placas.
            </h2>
          </div>

          <div>
            <div className="divide-y divide-line border-y border-line">
              {FAQ_ITEMS.map((item, i) => {
                const isOpen = open === i;
                return (
                  <div key={item.question}>
                    <h3>
                      <button
                        type="button"
                        onClick={() => setOpen(isOpen ? null : i)}
                        aria-expanded={isOpen}
                        aria-controls={`faq-panel-${i}`}
                        id={`faq-trigger-${i}`}
                        className="flex w-full items-start justify-between gap-6 py-6 text-left"
                      >
                        <span className="font-display text-lg font-normal text-ink sm:text-xl">{item.question}</span>
                        <Plus
                          size={22}
                          weight="light"
                          className={`mt-0.5 shrink-0 text-ink transition-transform duration-300 ease-out ${
                            isOpen ? "rotate-45" : ""
                          }`}
                        />
                      </button>
                    </h3>
                    <AnimatePresence initial={false}>
                      {isOpen && (
                        <motion.div
                          id={`faq-panel-${i}`}
                          role="region"
                          aria-labelledby={`faq-trigger-${i}`}
                          initial={reduce ? { height: "auto", opacity: 1 } : { height: 0, opacity: 0 }}
                          animate={{ height: "auto", opacity: 1 }}
                          exit={reduce ? { opacity: 0 } : { height: 0, opacity: 0 }}
                          transition={{ duration: 0.28, ease: [0.16, 1, 0.3, 1] }}
                          className="overflow-hidden"
                        >
                          <p className="max-w-2xl pb-7 text-[1.05rem] leading-relaxed text-ink-muted">{item.answer}</p>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
}
