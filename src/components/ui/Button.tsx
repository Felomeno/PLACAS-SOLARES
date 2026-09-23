import { type ComponentPropsWithoutRef, type ElementType, type ReactNode } from "react";
import clsx from "clsx";

type Variant = "primary" | "deep" | "light" | "secondary" | "secondaryOnDark" | "ghost";

const base =
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-[10px] px-7 py-3.5 text-[0.95rem] font-semibold transition-[transform,background-color,color,border-color] duration-200 ease-out active:scale-[0.97] focus-visible:outline-2 focus-visible:outline-offset-2";

const variants: Record<Variant, string> = {
  primary: "bg-sky text-on-sky hover:bg-sky-hover",
  deep: "bg-sky-deep text-paper hover:bg-sky-navy",
  light: "bg-paper text-ink hover:bg-sky-light",
  secondary: "border border-ink/25 text-ink hover:border-ink/55",
  secondaryOnDark: "border border-paper/40 bg-carbon/25 text-paper backdrop-blur-sm hover:border-paper/80 hover:bg-paper/10",
  ghost: "text-inherit hover:opacity-70",
};

type ButtonProps<T extends ElementType> = {
  as?: T;
  variant?: Variant;
  className?: string;
  children: ReactNode;
} & Omit<ComponentPropsWithoutRef<T>, "as" | "className" | "children">;

export function Button<T extends ElementType = "button">({
  as,
  variant = "primary",
  className,
  children,
  ...props
}: ButtonProps<T>) {
  const Tag = as || "button";
  return (
    <Tag className={clsx(base, variants[variant], className)} {...props}>
      {children}
    </Tag>
  );
}
