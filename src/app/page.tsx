import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { Hero } from "@/components/sections/Hero";
import { SavingsCalculator } from "@/components/sections/SavingsCalculator";
import { Solutions } from "@/components/sections/Solutions";
import { HowItWorks } from "@/components/sections/HowItWorks";
import { BillComparison } from "@/components/sections/BillComparison";
import { Projects } from "@/components/sections/Projects";
import { PanelShowcase } from "@/components/sections/PanelShowcase";
import { SolarFlow } from "@/components/sections/SolarFlow";
import { Trust } from "@/components/sections/Trust";
import { Faq } from "@/components/sections/Faq";
import { FinalCta } from "@/components/sections/FinalCta";
import { FAQ } from "@/lib/constants";

const jsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "Organization",
      name: "SOLARA",
      description:
        "Marca ficticia de instalación de placas solares fotovoltaicas, creada por TwoSide Digital como proyecto conceptual de diseño.",
      url: "https://solara-demo.twoside.digital",
    },
    {
      "@type": "FAQPage",
      mainEntity: FAQ.map((item) => ({
        "@type": "Question",
        name: item.question,
        acceptedAnswer: { "@type": "Answer", text: item.answer },
      })),
    },
  ],
};

export default function Home() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <Navbar />
      <main id="contenido">
        <Hero />
        <Solutions />
        <Projects />
        <SolarFlow />
        <PanelShowcase />
        <SavingsCalculator />
        <BillComparison />
        <HowItWorks />
        <Trust />
        <Faq />
        <FinalCta />
      </main>
      <Footer />
    </>
  );
}
