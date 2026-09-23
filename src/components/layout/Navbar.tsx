"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { motion, useMotionValueEvent, useScroll, useReducedMotion, AnimatePresence } from "motion/react";
import { List, X } from "@phosphor-icons/react/dist/ssr";
import { Container } from "@/components/ui/Container";
import { Button } from "@/components/ui/Button";
import { NAV_LINKS } from "@/lib/constants";

export function Navbar() {
  const [solid, setSolid] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const { scrollY } = useScroll();
  const reduce = useReducedMotion();

  useMotionValueEvent(scrollY, "change", (latest) => {
    setSolid(latest > 40);
  });

  useEffect(() => {
    if (!menuOpen) return;
    document.body.style.overflow = "hidden";
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setMenuOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", onKey);
    };
  }, [menuOpen]);

  const solidStyles = solid || menuOpen;

  return (
    <header className="fixed inset-x-0 top-0 z-50 px-3 pt-3 sm:px-5 sm:pt-4">
      {/* Barra flotante: siempre legible sobre la foto del hero; al hacer scroll gana sombra. */}
      <div
        className={`mx-auto flex h-14 max-w-[1400px] items-center justify-between rounded-full border pr-2 pl-5 backdrop-blur-md transition-[box-shadow,background-color,border-color] duration-300 ease-out sm:h-16 sm:pl-6 ${
          solidStyles
            ? "border-line bg-cream/92 shadow-[0_8px_30px_-12px_rgb(19_26_21/25%)]"
            : "border-cream/40 bg-cream/80"
        }`}
      >
        <Link href="#inicio" className="font-display text-lg font-semibold tracking-tight text-ink">
          SOLARA
        </Link>

        <nav aria-label="Principal" className="hidden items-center gap-1 text-[0.92rem] font-medium text-ink lg:flex">
          {NAV_LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="rounded-full px-4 py-2 transition-colors duration-200 hover:bg-ink/[0.06]"
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-1">
          <Button as="a" href="#calculadora" variant="primary" className="hidden !px-5 !py-2.5 sm:inline-flex">
            Calcula tu instalación
          </Button>
          <button
            type="button"
            aria-label={menuOpen ? "Cerrar menú" : "Abrir menú"}
            aria-expanded={menuOpen}
            onClick={() => setMenuOpen((v) => !v)}
            className="flex h-10 w-10 items-center justify-center rounded-full bg-carbon text-cream transition-transform active:scale-[0.95] sm:h-11 sm:w-11 lg:hidden"
          >
            {menuOpen ? <X size={20} /> : <List size={20} />}
          </button>
        </div>
      </div>

      <AnimatePresence>
        {menuOpen && (
          <motion.div
            initial={reduce ? { opacity: 1 } : { opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={reduce ? { opacity: 0 } : { opacity: 0, y: -8 }}
            transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
            className="mx-auto mt-2 max-w-[1400px] rounded-[28px] border border-line bg-cream shadow-[0_20px_50px_-20px_rgb(19_26_21/35%)] lg:hidden"
          >
            <Container>
              <nav aria-label="Menú móvil" className="flex flex-col gap-1 py-6 text-lg font-medium text-ink">
                {NAV_LINKS.map((link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    onClick={() => setMenuOpen(false)}
                    className="rounded-lg px-2 py-3"
                  >
                    {link.label}
                  </Link>
                ))}
                <Button as="a" href="#calculadora" variant="primary" className="mt-3 w-full" onClick={() => setMenuOpen(false)}>
                  Calcula tu instalación
                </Button>
              </nav>
            </Container>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
