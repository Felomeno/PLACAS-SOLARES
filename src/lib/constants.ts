export const NAV_LINKS = [
  { href: "#soluciones", label: "Placas solares" },
  { href: "#como-funciona", label: "Cómo funciona" },
  { href: "#calculadora", label: "Calculadora" },
  { href: "#proyectos", label: "Instalaciones" },
  { href: "#faq", label: "FAQ" },
] as const;

export interface Servicio {
  id: string;
  title: string;
  description: string;
  tags: string[];
  image?: string;
  imageAlt?: string;
}

export const SERVICIOS: Servicio[] = [
  {
    id: "fotovoltaica",
    title: "Instalación fotovoltaica",
    description:
      "Paneles dimensionados con tu consumo real, la orientación y las sombras de tu tejado. Diseño, estructura, cableado e inversor con el mismo equipo.",
    tags: ["Estudio", "Diseño", "Instalación"],
    image: "/images/hero-main.jpg",
    imageAlt: "Tejado de teja con una instalación de placas solares fotovoltaicas",
  },
  {
    id: "baterias",
    title: "Baterías",
    description:
      "Guardan los excedentes del día para usarlos por la tarde y por la noche. Se instalan con un sistema nuevo o se añaden a paneles que ya tienes.",
    tags: ["Almacenamiento", "Autoconsumo", "Ampliable"],
    image: "/images/proyecto-sevilla.jpg",
    imageAlt: "Vivienda con placas solares en la cubierta al anochecer, con las ventanas iluminadas",
  },
  {
    id: "cargadores",
    title: "Cargadores para vehículo eléctrico",
    description:
      "Punto de carga en el garaje, configurado para cargar el coche en las horas en que tus placas producen.",
    tags: ["Carga solar", "Instalación", "Configuración"],
  },
  {
    id: "empresas",
    title: "Autoconsumo para empresas",
    description:
      "Naves, oficinas y comercios. Instalaciones dimensionadas con tu curva de consumo en horario laboral, cuando más produce el tejado.",
    tags: ["Naves", "Oficinas", "Comercios"],
    image: "/images/panel-filas.jpg",
    imageAlt: "Filas de paneles fotovoltaicos sobre una cubierta de gran superficie",
  },
  {
    id: "monitorizacion",
    title: "Monitorización y mantenimiento",
    description:
      "Producción, consumo y excedentes en el móvil. Revisión de protecciones y conexiones, y limpieza de paneles cuando hace falta.",
    tags: ["App", "Revisiones", "Limpieza"],
    image: "/images/sol-mantenimiento.jpg",
    imageAlt: "Técnico revisando una instalación de paneles solares en una cubierta",
  },
];

export interface PasoProceso {
  numero: string;
  title: string;
  description: string;
}

export const PROCESO: PasoProceso[] = [
  {
    numero: "01",
    title: "Estudio",
    description: "Revisamos tus facturas, medimos el tejado y comprobamos sombras, orientación y cuadro eléctrico.",
  },
  {
    numero: "02",
    title: "Diseño y presupuesto",
    description: "Una propuesta con número de paneles, potencia, producción estimada y un presupuesto cerrado.",
  },
  {
    numero: "03",
    title: "Tramitación e instalación",
    description: "Gestionamos la documentación que corresponda y montamos estructura, paneles, inversor y protecciones.",
  },
  {
    numero: "04",
    title: "Puesta en marcha",
    description: "Pruebas, puesta en servicio y la app de monitorización funcionando en tu móvil.",
  },
];

export interface Proyecto {
  id: string;
  title: string;
  location: string;
  image: string;
  imageAlt: string;
  paneles: number;
  kwp: number;
  produccionKwh: number;
  ahorroAnual: number;
}

// Casos conceptuales: paneles de 450 Wp y producción calculada con la irradiancia
// media de cada zona, igual que en la calculadora.
export const PROYECTOS: Proyecto[] = [
  {
    id: "sevilla",
    title: "Vivienda unifamiliar",
    location: "Sevilla",
    image: "/images/proyecto-sevilla.jpg",
    imageAlt: "Vivienda unifamiliar con placas solares en la cubierta al atardecer",
    paneles: 14,
    kwp: 6.3,
    produccionKwh: 10400,
    ahorroAnual: 1090,
  },
  {
    id: "marbella",
    title: "Chalet con piscina",
    location: "Marbella",
    image: "/images/proyecto-marbella.jpg",
    imageAlt: "Vista aérea de un chalet con piscina, jardín y paneles solares en la cubierta",
    paneles: 22,
    kwp: 9.9,
    produccionKwh: 16300,
    ahorroAnual: 1710,
  },
  {
    id: "malaga",
    title: "Nave comercial",
    location: "Málaga",
    image: "/images/proyecto-malaga.jpg",
    imageAlt: "Vista aérea de una cubierta comercial ocupada por filas de paneles solares",
    paneles: 84,
    kwp: 37.8,
    produccionKwh: 62400,
    ahorroAnual: 7900,
  },
  {
    id: "madrid",
    title: "Vivienda pareada",
    location: "Madrid",
    image: "/images/proyecto-madrid.jpg",
    imageAlt: "Cubierta de una vivienda con una instalación de placas solares",
    paneles: 12,
    kwp: 5.4,
    produccionKwh: 8400,
    ahorroAnual: 870,
  },
];

export interface FaqItem {
  question: string;
  answer: string;
}

export const FAQ: FaqItem[] = [
  {
    question: "¿Cuántas placas necesito?",
    answer:
      "Depende de tu consumo, de tu provincia y del espacio útil del tejado. Una vivienda unifamiliar suele necesitar entre 6 y 16 paneles. La calculadora te da una primera cifra y el estudio del tejado la confirma.",
  },
  {
    question: "¿Cuánto puede costar una instalación?",
    answer:
      "Una instalación residencial suele situarse entre unos 3.000 y 12.000 € según la potencia, la estructura y si incluye batería. El estudio solar te da un presupuesto cerrado para tu tejado.",
  },
  {
    question: "¿Cuánto producen las placas?",
    answer:
      "En España, cada kWp instalado produce aproximadamente entre 1.250 y 1.650 kWh al año según la zona. Un panel de unos 450 W puede generar del orden de 550 a 750 kWh anuales en buenas condiciones.",
  },
  {
    question: "¿Funcionan cuando está nublado?",
    answer:
      "Sí, aunque producen menos. Los paneles aprovechan también la luz difusa. Por eso la producción se estima con medias anuales y no con un día concreto.",
  },
  {
    question: "¿Qué pasa con los excedentes?",
    answer:
      "La electricidad que tu casa no usa en ese momento puede cargar una batería o enviarse a la red. Cómo se compensa ese vertido depende de tu modalidad de autoconsumo y de tu comercializadora.",
  },
  {
    question: "¿Necesito batería?",
    answer:
      "No es imprescindible. Tiene sentido si consumes mucho por la tarde o por la noche, porque te permite usar tu propia energía cuando las placas ya no producen. También se puede añadir más adelante.",
  },
  {
    question: "¿Cuánto duran las placas?",
    answer:
      "Los paneles fotovoltaicos tienen una vida útil habitual de 25 años o más, con una pérdida de rendimiento gradual. El inversor suele durar menos y puede necesitar sustitución durante la vida de la instalación.",
  },
  {
    question: "¿Qué mantenimiento necesitan?",
    answer:
      "Muy poco. Una revisión periódica de protecciones y conexiones, y limpieza de los paneles si se acumula suciedad. La monitorización avisa si la producción baja de lo esperado.",
  },
  {
    question: "¿Cuánto tarda una instalación?",
    answer:
      "El montaje en una vivienda suele llevar de uno a tres días. Sumando estudio, diseño y documentación, el proceso completo suele ser de varias semanas.",
  },
];
