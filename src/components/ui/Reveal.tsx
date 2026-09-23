import { type ReactNode } from "react";
import clsx from "clsx";

/**
 * Entrada al hacer scroll resuelta en CSS (animation-timeline: view()).
 * Sin soporte del navegador o con prefers-reduced-motion el contenido
 * simplemente aparece visible: nunca depende de JS para poder leerse.
 */
export function Reveal({
  children,
  step = 0,
  className,
}: {
  children: ReactNode;
  step?: 0 | 1 | 2 | 3;
  className?: string;
}) {
  return (
    <div className={clsx("reveal", step > 0 && `reveal-${step}`, className)}>
      {children}
    </div>
  );
}
