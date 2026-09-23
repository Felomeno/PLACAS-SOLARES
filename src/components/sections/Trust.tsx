import Image from "next/image";
import { Container } from "@/components/ui/Container";
import { Button } from "@/components/ui/Button";

// Solo lo que la web ya afirma en otras secciones: sin cifras de empresa ni sellos.
const INCLUYE = [
  { title: "Garantías del fabricante", text: "Paneles e inversor con garantía de producto y de rendimiento según cada fabricante." },
  { title: "Un mismo equipo", text: "Quien estudia tu tejado es quien diseña, instala y revisa la instalación." },
  { title: "Monitorización incluida", text: "Producción, consumo y excedentes en la app desde el primer día." },
  { title: "Documentación gestionada", text: "Preparamos la documentación y los trámites que correspondan en tu caso." },
];

export function Trust() {
  return (
    <section className="bg-cream px-2 py-2 sm:px-3">
      <div className="relative overflow-hidden rounded-[28px] bg-carbon text-cream sm:rounded-[36px]">
        <Image
          src="/images/panel-reflejo.jpg"
          alt=""
          fill
          sizes="100vw"
          className="object-cover object-[50%_70%] opacity-50"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-carbon/70 via-carbon/60 to-carbon/95" />

        <Container className="relative py-24 sm:py-36">
          <div className="mx-auto max-w-3xl text-center">
            <p className="label justify-center text-cream/80">Cada instalación</p>
            <h2 className="font-display mt-5 text-4xl leading-[1.02] font-normal tracking-[-0.028em] text-balance sm:text-6xl lg:text-7xl">
              Pensada para durar tanto como tu tejado.
            </h2>
            <p className="mx-auto mt-6 max-w-xl text-lg text-cream/80">
              El mismo cuidado en una vivienda con 8 paneles que en una nave con 80.
            </p>
            <div className="mt-9 flex flex-col justify-center gap-3 sm:flex-row">
              <Button as="a" href="#contacto" variant="light">
                Solicitar estudio solar
              </Button>
              <Button as="a" href="#faq" variant="secondaryOnDark">
                Preguntas frecuentes
              </Button>
            </div>
          </div>

          <dl className="mt-20 grid grid-cols-1 gap-px overflow-hidden rounded-[22px] bg-cream/15 sm:mt-28 sm:grid-cols-2 lg:grid-cols-4">
            {INCLUYE.map((item) => (
              <div key={item.title} className="bg-carbon/80 p-6 backdrop-blur-sm sm:p-7">
                <dt className="font-display text-xl font-normal">{item.title}</dt>
                <dd className="mt-2 text-[0.95rem] leading-relaxed text-cream/75">{item.text}</dd>
              </div>
            ))}
          </dl>
        </Container>
      </div>
    </section>
  );
}
