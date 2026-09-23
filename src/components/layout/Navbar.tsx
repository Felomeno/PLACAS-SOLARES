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
    <header className="fixed inset-x-0 top-0 z-50">
      {/* Barra a todo el ancho, recta y con filete inferior: siempre legible sobre la foto; al hacer scroll gana sombra. */}
      <div
        className={`border-b backdrop-blur-md transition-[box-shadow,background-color,border-color] duration-300 ease-out ${
          solidStyles
            ? "border-line bg-paper/97 shadow-[0_10px_30px_-18px_rgb(20_41_58/30%)]"
            : "border-transparent bg-paper/95"
        }`}
      >
        <Container className="flex h-16 items-center justify-between sm:h-[4.5rem]">
        <Link href="#inicio" className="font-display flex items-center gap-2.5 text-lg font-semibold tracking-[0.08em] text-ink">
          <span className="size-2.5 rounded-full bg-sky-deep" aria-hidden />
          SOLARA
        </Link>

        <nav aria-label="Principal" className="hidden items-center gap-9 text-[0.92rem] font-medium text-ink lg:flex">
          {NAV_LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="relative py-2 after:absolute after:inset-x-0 after:bottom-0.5 after:h-px after:origin-left after:scale-x-0 after:bg-ink after:transition-transform after:duration-300 after:ease-[cubic-bezier(0.23,1,0.32,1)] hover:after:scale-x-100"
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          <Button as="a" href="#calculadora" variant="deep" className="!px-5 !py-2.5 max-sm:!hidden">
            Calcula tu instalación
          </Button>
          <button
            type="button"
            aria-label={menuOpen ? "Cerrar menú" : "Abrir menú"}
            aria-expanded={menuOpen}
            onClick={() => setMenuOpen((v) => !v)}
            className="flex h-10 w-10 items-center justify-center rounded-[10px] border border-ink/20 text-ink transition-[transform,border-color] hover:border-ink/50 active:scale-[0.95] sm:h-11 sm:w-11 lg:hidden"
          >
            {menuOpen ? <X size={20} /> : <List size={20} />}
          </button>
        </div>
        </Container>
      </div>

      <AnimatePresence>
        {menuOpen && (
          <motion.div
            initial={reduce ? { opacity: 1 } : { opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={reduce ? { opacity: 0 } : { opacity: 0, y: -8 }}
            transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
            className="border-b border-line bg-paper shadow-[0_24px_40px_-24px_rgb(20_41_58/35%)] lg:hidden"
          >
            <Container>
              <nav aria-label="Menú móvil" className="flex flex-col gap-1 py-6 text-lg font-medium text-ink">
                {NAV_LINKS.map((link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    onClick={() => setMenuOpen(false)}
                    className="border-b border-line py-4"
                  >
                    {link.label}
                  </Link>
                ))}
                <Button as="a" href="#calculadora" variant="deep" className="mt-3 w-full" onClick={() => setMenuOpen(false)}>
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
