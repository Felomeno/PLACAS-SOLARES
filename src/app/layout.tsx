import type { Metadata, Viewport } from "next";
import { Bricolage_Grotesque, Manrope } from "next/font/google";
import "./globals.css";

const bricolage = Bricolage_Grotesque({
  variable: "--font-bricolage",
  subsets: ["latin"],
  axes: ["opsz", "wdth"],
  display: "swap",
});

const manrope = Manrope({
  variable: "--font-manrope",
  subsets: ["latin"],
  display: "swap",
});

const siteUrl = "https://solara-demo.twoside.digital";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "SOLARA | Instalación de placas solares para viviendas y empresas",
    template: "%s | SOLARA",
  },
  description:
    "Instalación de placas solares fotovoltaicas para viviendas y empresas: paneles, inversor, baterías y monitorización. Calcula cuántas placas necesitas y cuánto podrías producir.",
  keywords: [
    "placas solares",
    "instalación de placas solares",
    "paneles fotovoltaicos",
    "autoconsumo",
    "baterías solares",
    "calculadora solar",
  ],
  openGraph: {
    type: "website",
    locale: "es_ES",
    url: siteUrl,
    siteName: "SOLARA",
    title: "SOLARA | Instalación de placas solares",
    description:
      "Paneles, inversor, baterías y monitorización para viviendas y empresas. Calcula tu instalación solar.",
    images: [{ url: "/images/hero-main.jpg", width: 2400, height: 1600, alt: "Tejado de una vivienda con placas solares fotovoltaicas" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "SOLARA | Instalación de placas solares",
    description: "Calcula cuántas placas necesita tu tejado.",
    images: ["/images/hero-main.jpg"],
  },
  robots: { index: true, follow: true },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#f6f4ec" },
    { media: "(prefers-color-scheme: dark)", color: "#16211b" },
  ],
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="es" className={`${bricolage.variable} ${manrope.variable}`}>
      <body>
        <a
          href="#contenido"
          className="sr-only focus-visible:not-sr-only focus-visible:fixed focus-visible:top-4 focus-visible:left-4 focus-visible:z-[100] focus-visible:rounded-full focus-visible:bg-green focus-visible:px-5 focus-visible:py-3 focus-visible:text-cream focus-visible:font-semibold"
        >
          Saltar al contenido
        </a>
        {children}
      </body>
    </html>
  );
}
