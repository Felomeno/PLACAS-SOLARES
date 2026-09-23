import Link from "next/link";
import { InstagramLogo, LinkedinLogo, YoutubeLogo } from "@phosphor-icons/react/dist/ssr";
import { Container } from "@/components/ui/Container";
import { Button } from "@/components/ui/Button";

const COLUMNS = [
  {
    title: "Placas solares",
    links: [
      { label: "Para viviendas", href: "#soluciones" },
      { label: "Para empresas", href: "#soluciones" },
      { label: "Paneles fotovoltaicos", href: "#paneles" },
      { label: "Baterías", href: "#como-funciona" },
      { label: "Monitorización y mantenimiento", href: "#soluciones" },
    ],
  },
  {
    title: "Instalación",
    links: [
      { label: "Cómo funciona", href: "#como-funciona" },
      { label: "Calculadora", href: "#calculadora" },
      { label: "Proceso", href: "#proceso" },
      { label: "Instalaciones tipo", href: "#proyectos" },
      { label: "Preguntas frecuentes", href: "#faq" },
    ],
  },
  {
    title: "Legal",
    links: [
      { label: "Aviso legal", href: "#" },
      { label: "Política de privacidad", href: "#" },
      { label: "Política de cookies", href: "#" },
    ],
  },
];

const SOCIAL = [
  { label: "Instagram", icon: InstagramLogo },
  { label: "LinkedIn", icon: LinkedinLogo },
  { label: "YouTube", icon: YoutubeLogo },
];

export function Footer() {
  return (
    <footer className="bg-cream px-2 pb-2 sm:px-3 sm:pb-3">
      <div className="rounded-[28px] bg-carbon pt-16 pb-10 text-cream sm:rounded-[36px] sm:pt-20">
      <Container>
        <div className="flex flex-col gap-8 border-b border-cream/15 pb-14 sm:pb-20 lg:flex-row lg:items-end lg:justify-between">
          <p className="font-display max-w-2xl text-4xl leading-[1.02] font-normal tracking-[-0.028em] text-balance sm:text-6xl">
            ¿Cuántas placas caben en tu tejado?
          </p>
          <div className="flex flex-col gap-3 sm:flex-row">
            <Button as="a" href="#contacto" variant="primary">
              Solicitar estudio solar
            </Button>
            <Button as="a" href="#calculadora" variant="secondaryOnDark">
              Calcula tu instalación
            </Button>
          </div>
        </div>

        <div className="mt-14 grid grid-cols-2 gap-x-8 gap-y-12 sm:mt-16 sm:grid-cols-4">
          {COLUMNS.map((column) => (
            <nav key={column.title} aria-label={column.title}>
              <p className="text-sm font-semibold text-cream">{column.title}</p>
              <ul className="mt-4">
                {column.links.map((link) => (
                  <li key={link.label}>
                    <Link
                      href={link.href}
                      className="inline-flex min-h-[44px] items-center text-sm text-cream/75 transition-colors hover:text-cream"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>
          ))}

          <div>
            <p className="text-sm font-semibold text-cream">Contacto</p>
            <ul className="mt-4 text-sm text-cream/75">
              <li>
                <a
                  href="mailto:hola@solara.es"
                  className="inline-flex min-h-[44px] items-center transition-colors hover:text-cream"
                >
                  hola@solara.es
                </a>
              </li>
              <li>
                <a
                  href="tel:+34900000000"
                  className="inline-flex min-h-[44px] items-center transition-colors hover:text-cream"
                >
                  900 000 000
                </a>
              </li>
              <li className="mt-2">Lunes a viernes, 9:00 a 19:00</li>
              <li className="mt-2">Instalaciones en España</li>
            </ul>

            <ul className="mt-6 flex gap-3">
              {SOCIAL.map(({ label, icon: Icon }) => (
                <li key={label}>
                  <a
                    href="#"
                    aria-label={label}
                    className="flex h-10 w-10 items-center justify-center rounded-full border border-cream/20 text-cream/70 transition-colors hover:border-cream/50 hover:text-cream"
                  >
                    <Icon size={18} />
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <svg
          aria-hidden
          viewBox="0 0 1000 190"
          className="mt-20 w-full select-none"
          role="presentation"
          focusable="false"
        >
          <text
            x="0"
            y="152"
            textLength="1000"
            lengthAdjust="spacingAndGlyphs"
            className="font-display"
            fontSize="190"
            fontWeight="400"
            style={{ fill: "rgb(246 244 236 / 12%)" }}
          >
            SOLARA
          </text>
        </svg>

        <div className="mt-10 flex flex-col gap-3 border-t border-cream/15 pt-8 text-xs text-cream/70 sm:flex-row sm:items-center sm:justify-between">
          <p>© {new Date().getFullYear()} SOLARA. Todos los derechos reservados.</p>
          <p>Proyecto conceptual de TwoSide Digital. SOLARA es una marca ficticia creada como demostración de diseño.</p>
        </div>
      </Container>
      </div>
    </footer>
  );
}
