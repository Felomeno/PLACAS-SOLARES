import { type ElementType, type ReactNode } from "react";
import clsx from "clsx";

export function Container({
  as: Tag = "div",
  className,
  children,
}: {
  as?: ElementType;
  className?: string;
  children: ReactNode;
}) {
  return (
    <Tag className={clsx("mx-auto w-full max-w-[1440px] px-6 sm:px-10 lg:px-16", className)}>
      {children}
    </Tag>
  );
}
