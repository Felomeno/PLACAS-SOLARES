import Image from "next/image";
import heroImage from "@/../public/images/sol-residencial.jpg";
import { Button } from "@/components/ui/Button";

// Ficha de una configuración tipo, no de una instalación real.
const CONFIGURACION = [
  { label: "Paneles", value: "12 × 450 W" },
  { label: "Potencia", value: "5,4 kWp" },
  { label: "Inversor", value: "Híbrido" },
  { label: "Batería", value: "Opcional" },
];

// El hero vive dentro de un marco redondeado con margen al viewport: la foto se lee
// como un objeto, no como un fondo, y la barra flotante se apoya encima.
export function Hero() {
  return (
    <section id="inicio" className="bg-cream p-2 sm:p-3">
      <div className="relative flex min-h-[calc(100dvh-1rem)] items-end overflow-hidden rounded-[28px] bg-carbon sm:min-h-[calc(100dvh-1.5rem)] sm:rounded-[36px]">
        <Image
          src={heroImage}
          alt="Vivienda moderna de ladrillo con placas solares fotovoltaicas negras en toda la cubierta"
          fill
          priority
          placeholder="blur"
          quality={55}
          sizes="100vw"
          className="object-cover object-[65%_80%] lg:object-[50%_70%]"
        />
        {/* Velo inferior e izquierdo: solo donde vive el texto. */}
        <div
          className="absolute inset-0"
          style={{
            background:
              "linear-gradient(to top, rgb(22 33 27 / 88%) 0%, rgb(22 33 27 / 55%) 38%, rgb(22 33 27 / 10%) 70%, rgb(22 33 27 / 0%) 100%)",
          }}
        />
        <div
          className="absolute inset-0 hidden lg:block"
          style={{ background: "linear-gradient(to right, rgb(22 33 27 / 55%) 0%, rgb(22 33 27 / 0%) 55%)" }}
        />

        <div className="relative w-full px-5 pt-28 pb-6 sm:px-10 sm:pb-10 lg:px-14 lg:pb-14">
          <div className="grid grid-cols-1 items-end gap-10 lg:grid-cols-[minmax(0,1fr)_18rem]">
            <div className="max-w-[52rem]">
              <p className="label rise text-cream/85">Instalación fotovoltaica para viviendas y empresas</p>
              <h1 className="font-display mt-5 text-[2.7rem] leading-[0.98] font-normal tracking-[-0.032em] text-balance text-cream sm:text-7xl lg:text-[6.2rem]">
                Placas solares que producen tu propia electricidad.
              </h1>

              <p className="rise mt-6 max-w-xl text-lg leading-relaxed text-cream/85 sm:text-xl">
                Diseñamos e instalamos sistemas fotovoltaicos con paneles, inversor, baterías y monitorización.
              </p>

              <div className="rise rise-1 mt-8 flex flex-col gap-3 sm:flex-row sm:items-center">
                <Button as="a" href="#calculadora" variant="primary" className="w-full sm:w-auto">
                  Calcula tu instalación
                </Button>
                <Button as="a" href="#proyectos" variant="secondaryOnDark" className="w-full sm:w-auto">
                  Ver instalaciones
                </Button>
              </div>
            </div>

            {/* Ficha técnica: ancla la foto a un producto concreto. Solo en escritorio. */}
            <div className="rise rise-2 hidden rounded-[22px] border border-cream/15 bg-carbon/70 p-5 backdrop-blur-md lg:block">
              <p className="text-sm text-cream/85">Configuración de ejemplo, vivienda unifamiliar</p>
              <dl className="mt-4">
                {CONFIGURACION.map((row) => (
                  <div key={row.label} className="flex items-baseline justify-between border-t border-cream/15 py-3">
                    <dt className="text-sm text-cream/85">{row.label}</dt>
                    <dd className="font-display tnum text-lg font-medium text-cream">{row.value}</dd>
                  </div>
                ))}
              </dl>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
