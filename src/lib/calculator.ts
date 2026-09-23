export type TipoVivienda = "piso" | "adosado" | "unifamiliar";

export const TIPOS_VIVIENDA: { value: TipoVivienda; label: string }[] = [
  { value: "unifamiliar", label: "Vivienda unifamiliar" },
  { value: "adosado", label: "Adosado o chalet" },
  { value: "piso", label: "Piso o ático" },
];

// Horas solares pico equivalentes por año (kWh/kWp), agrupadas por zona climática.
const IRRADIANCE_ZONE_A = 1650; // sur y Canarias
const IRRADIANCE_ZONE_B = 1550; // centro y Levante
const IRRADIANCE_ZONE_C = 1400; // noreste y meseta norte
const IRRADIANCE_ZONE_D = 1250; // cornisa cantábrica

export const PROVINCIAS: { nombre: string; irradiancia: number }[] = [
  { nombre: "Almería", irradiancia: IRRADIANCE_ZONE_A },
  { nombre: "Cádiz", irradiancia: IRRADIANCE_ZONE_A },
  { nombre: "Córdoba", irradiancia: IRRADIANCE_ZONE_A },
  { nombre: "Granada", irradiancia: IRRADIANCE_ZONE_A },
  { nombre: "Huelva", irradiancia: IRRADIANCE_ZONE_A },
  { nombre: "Jaén", irradiancia: IRRADIANCE_ZONE_A },
  { nombre: "Málaga", irradiancia: IRRADIANCE_ZONE_A },
  { nombre: "Sevilla", irradiancia: IRRADIANCE_ZONE_A },
  { nombre: "Murcia", irradiancia: IRRADIANCE_ZONE_A },
  { nombre: "Alicante", irradiancia: IRRADIANCE_ZONE_A },
  { nombre: "Las Palmas", irradiancia: IRRADIANCE_ZONE_A },
  { nombre: "Santa Cruz de Tenerife", irradiancia: IRRADIANCE_ZONE_A },
  { nombre: "Ceuta", irradiancia: IRRADIANCE_ZONE_A },
  { nombre: "Melilla", irradiancia: IRRADIANCE_ZONE_A },
  { nombre: "Badajoz", irradiancia: IRRADIANCE_ZONE_B },
  { nombre: "Cáceres", irradiancia: IRRADIANCE_ZONE_B },
  { nombre: "Ciudad Real", irradiancia: IRRADIANCE_ZONE_B },
  { nombre: "Albacete", irradiancia: IRRADIANCE_ZONE_B },
  { nombre: "Toledo", irradiancia: IRRADIANCE_ZONE_B },
  { nombre: "Valencia", irradiancia: IRRADIANCE_ZONE_B },
  { nombre: "Castellón", irradiancia: IRRADIANCE_ZONE_B },
  { nombre: "Illes Balears", irradiancia: IRRADIANCE_ZONE_B },
  { nombre: "Madrid", irradiancia: IRRADIANCE_ZONE_B },
  { nombre: "Cuenca", irradiancia: IRRADIANCE_ZONE_B },
  { nombre: "Guadalajara", irradiancia: IRRADIANCE_ZONE_B },
  { nombre: "Zaragoza", irradiancia: IRRADIANCE_ZONE_B },
  { nombre: "Teruel", irradiancia: IRRADIANCE_ZONE_B },
  { nombre: "Huesca", irradiancia: IRRADIANCE_ZONE_B },
  { nombre: "Barcelona", irradiancia: IRRADIANCE_ZONE_C },
  { nombre: "Girona", irradiancia: IRRADIANCE_ZONE_C },
  { nombre: "Tarragona", irradiancia: IRRADIANCE_ZONE_C },
  { nombre: "Lleida", irradiancia: IRRADIANCE_ZONE_C },
  { nombre: "Navarra", irradiancia: IRRADIANCE_ZONE_C },
  { nombre: "La Rioja", irradiancia: IRRADIANCE_ZONE_C },
  { nombre: "Soria", irradiancia: IRRADIANCE_ZONE_C },
  { nombre: "Segovia", irradiancia: IRRADIANCE_ZONE_C },
  { nombre: "Ávila", irradiancia: IRRADIANCE_ZONE_C },
  { nombre: "Salamanca", irradiancia: IRRADIANCE_ZONE_C },
  { nombre: "Valladolid", irradiancia: IRRADIANCE_ZONE_C },
  { nombre: "Zamora", irradiancia: IRRADIANCE_ZONE_C },
  { nombre: "Palencia", irradiancia: IRRADIANCE_ZONE_C },
  { nombre: "Burgos", irradiancia: IRRADIANCE_ZONE_C },
  { nombre: "A Coruña", irradiancia: IRRADIANCE_ZONE_D },
  { nombre: "Lugo", irradiancia: IRRADIANCE_ZONE_D },
  { nombre: "Ourense", irradiancia: IRRADIANCE_ZONE_D },
  { nombre: "Pontevedra", irradiancia: IRRADIANCE_ZONE_D },
  { nombre: "Asturias", irradiancia: IRRADIANCE_ZONE_D },
  { nombre: "Cantabria", irradiancia: IRRADIANCE_ZONE_D },
  { nombre: "Álava", irradiancia: IRRADIANCE_ZONE_D },
  { nombre: "Gipuzkoa", irradiancia: IRRADIANCE_ZONE_D },
  { nombre: "Bizkaia", irradiancia: IRRADIANCE_ZONE_D },
].sort((a, b) => a.nombre.localeCompare(b.nombre, "es"));

// Solo el término de energía de la factura es sustituible por autoconsumo: la potencia
// contratada y buena parte de los impuestos se siguen pagando igual.
const PARTE_ENERGIA = 0.65; // proporción de la factura que corresponde a energía consumida
const PRECIO_KWH = 0.16; // €/kWh del término de energía
const COSTE_POR_KWP = 1300; // € instalados por kWp, residencial, sin batería
const EXPORT_KWH = 0.05; // € de compensación por kWh excedente vertido a red
const WP_PANEL = 450; // potencia de un panel de referencia
// Sin batería, una vivienda consume en el momento aproximadamente la mitad de lo que produce.
const AUTOCONSUMO_DIRECTO = 0.5;

const OFFSET_POR_TIPO: Record<TipoVivienda, number> = {
  unifamiliar: 0.9,
  adosado: 0.75,
  piso: 0.45,
};

export interface EstimateInput {
  facturaMensual: number;
  provincia: string;
  tipoVivienda: TipoVivienda;
}

export interface EstimateResult {
  paneles: number;
  potenciaKwp: number;
  produccionAnualKwh: number;
  consumoAnualKwh: number;
  autoconsumoPct: number;
  ahorroAnual: number;
  inversionEstimada: number;
  amortizacionAnios: number;
}

function clamp(value: number, min: number, max: number) {
  return Math.min(max, Math.max(min, value));
}

// Redondeos deliberados: es una orientación, no un cálculo de ingeniería.
const roundTo = (value: number, step: number) => Math.round(value / step) * step;

export function estimateSavings({ facturaMensual, provincia, tipoVivienda }: EstimateInput): EstimateResult {
  const irradiancia = PROVINCIAS.find((p) => p.nombre === provincia)?.irradiancia ?? IRRADIANCE_ZONE_B;
  const consumoAnualKwh = ((facturaMensual * PARTE_ENERGIA) / PRECIO_KWH) * 12;
  const objetivoKwh = consumoAnualKwh * OFFSET_POR_TIPO[tipoVivienda];

  const paneles = clamp(Math.round((objetivoKwh / irradiancia) * (1000 / WP_PANEL)), 4, 28);
  const potenciaKwp = (paneles * WP_PANEL) / 1000;
  const produccion = potenciaKwp * irradiancia;

  const autoconsumoKwh = Math.min(produccion * AUTOCONSUMO_DIRECTO, consumoAnualKwh * 0.6);
  const excedenteKwh = produccion - autoconsumoKwh;

  const ahorroAnual = autoconsumoKwh * PRECIO_KWH + excedenteKwh * EXPORT_KWH;
  const inversionEstimada = potenciaKwp * COSTE_POR_KWP;

  return {
    paneles,
    potenciaKwp,
    produccionAnualKwh: roundTo(produccion, 100),
    consumoAnualKwh,
    autoconsumoPct: roundTo((autoconsumoKwh / produccion) * 100, 5),
    ahorroAnual: roundTo(ahorroAnual, 10),
    inversionEstimada: roundTo(inversionEstimada, 100),
    amortizacionAnios: ahorroAnual > 0 ? Math.round(inversionEstimada / ahorroAnual) : 0,
  };
}
