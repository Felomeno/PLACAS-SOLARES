"use client";

import { useState, type FormEvent } from "react";
import Image from "next/image";
import clsx from "clsx";
import { CheckCircle } from "@phosphor-icons/react/dist/ssr";
import { Container } from "@/components/ui/Container";
import { Button } from "@/components/ui/Button";

interface FormValues {
  nombre: string;
  telefono: string;
  email: string;
  codigoPostal: string;
  factura: string;
}

type Errors = Partial<Record<keyof FormValues, string>>;

const FIELDS: {
  name: keyof FormValues;
  label: string;
  type: string;
  autoComplete: string;
  placeholder: string;
  inputMode?: "text" | "tel" | "email" | "numeric";
}[] = [
  { name: "nombre", label: "Nombre", type: "text", autoComplete: "name", placeholder: "Marta Rodríguez" },
  { name: "telefono", label: "Teléfono", type: "tel", autoComplete: "tel", inputMode: "tel", placeholder: "612 345 678" },
  { name: "email", label: "Email", type: "email", autoComplete: "email", inputMode: "email", placeholder: "marta@correo.es" },
  { name: "codigoPostal", label: "Código postal", type: "text", autoComplete: "postal-code", inputMode: "numeric", placeholder: "41010" },
  { name: "factura", label: "Factura mensual aproximada (€)", type: "text", autoComplete: "off", inputMode: "numeric", placeholder: "90" },
];

function validate(values: FormValues): Errors {
  const errors: Errors = {};
  if (values.nombre.trim().length < 2) errors.nombre = "Escribe tu nombre para poder dirigirnos a ti.";
  if (!/^[+\d][\d\s]{7,15}$/.test(values.telefono.trim())) errors.telefono = "Introduce un teléfono válido, por ejemplo 612 345 678.";
  if (!/^[^@\s]+@[^@\s]+\.[^@\s]{2,}$/.test(values.email.trim())) errors.email = "Introduce un email válido para enviarte el estudio.";
  if (!/^\d{5}$/.test(values.codigoPostal.trim())) errors.codigoPostal = "El código postal tiene 5 dígitos.";
  const factura = Number(values.factura.replace(",", "."));
  if (!values.factura.trim() || !Number.isFinite(factura) || factura < 10 || factura > 5000)
    errors.factura = "Indica tu factura mensual aproximada en euros, por ejemplo 90.";
  return errors;
}

export function FinalCta() {
  const [values, setValues] = useState<FormValues>({ nombre: "", telefono: "", email: "", codigoPostal: "", factura: "" });
  const [errors, setErrors] = useState<Errors>({});
  const [status, setStatus] = useState<"idle" | "submitting" | "success">("idle");

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const nextErrors = validate(values);
    setErrors(nextErrors);
    if (Object.keys(nextErrors).length > 0) return;

    setStatus("submitting");
    window.setTimeout(() => setStatus("success"), 900);
  }

  return (
    <section id="contacto" className="bg-cream px-2 pt-2 pb-2 sm:px-3">
      {/* Cierre en un marco redondeado con la foto a sangre: el formulario flota sobre ella. */}
      <div className="relative overflow-hidden rounded-[28px] bg-carbon py-20 text-cream sm:rounded-[36px] sm:py-28">
      <Image
        src="/images/hero-main.jpg"
        alt=""
        fill
        sizes="100vw"
        className="object-cover object-[40%_50%]"
      />
      <div className="absolute inset-0 bg-gradient-to-r from-carbon/85 via-carbon/70 to-carbon/40" />
      <div className="absolute inset-0 bg-gradient-to-t from-carbon/70 to-transparent lg:hidden" />

      <Container className="relative">
        <div className="grid grid-cols-1 gap-14 lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)] lg:gap-20">
          <div className="lg:self-center">
            <div>
              <p className="label text-cream/85">Estudio solar sin compromiso</p>
              <h2 className="font-display mt-5 text-5xl leading-[0.98] font-normal tracking-[-0.032em] text-balance sm:text-7xl lg:text-[5.5rem]">
                Tu tejado ya tiene potencial.
              </h2>
              <p className="mt-6 max-w-md text-lg text-cream/85">
                Descubre cuántas placas necesita tu vivienda. Con tu código postal y tu factura preparamos el número de
                paneles, la potencia, la producción estimada y un presupuesto.
              </p>
              <a
                href="#calculadora"
                className="mt-8 inline-flex items-center gap-2 text-[0.95rem] font-semibold text-cream underline decoration-cream/40 underline-offset-[6px] transition-colors hover:decoration-cream"
              >
                Prefiero calcularlo yo primero
              </a>
            </div>
          </div>

          <div>
            {status === "success" ? (
              <div className="flex h-full flex-col justify-center rounded-[28px] border border-cream/15 bg-carbon/85 p-7 backdrop-blur-md sm:p-10">
                <CheckCircle size={40} weight="light" className="text-green-bright" />
                <p className="font-display mt-5 text-3xl">Solicitud recibida</p>
                <p className="mt-3 text-cream/75">
                  Gracias, {values.nombre.split(" ")[0]}. Un técnico revisaría tu caso y te llamaría en menos de 24 horas
                  laborables.
                </p>
                <p className="mt-6 text-xs text-cream/70">
                  Formulario de demostración: este proyecto es conceptual y no envía ni almacena ningún dato.
                </p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} noValidate className="rounded-[28px] border border-cream/15 bg-carbon/85 p-7 backdrop-blur-md sm:p-10">
                <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                  {FIELDS.map((field) => (
                    <div key={field.name} className={field.name === "nombre" || field.name === "email" || field.name === "factura" ? "sm:col-span-2" : ""}>
                      <label htmlFor={`cta-${field.name}`} className="block text-sm font-medium text-cream/80">
                        {field.label}
                      </label>
                      <input
                        id={`cta-${field.name}`}
                        name={field.name}
                        type={field.type}
                        inputMode={field.inputMode}
                        autoComplete={field.autoComplete}
                        placeholder={field.placeholder}
                        value={values[field.name]}
                        onChange={(e) => setValues((v) => ({ ...v, [field.name]: e.target.value }))}
                        aria-invalid={Boolean(errors[field.name])}
                        aria-describedby={errors[field.name] ? `cta-${field.name}-error` : undefined}
                        className={clsx(
                          "mt-2 w-full rounded-full border bg-cream/10 px-5 py-3.5 text-cream transition-colors placeholder:text-cream/70",
                          errors[field.name]
                            ? "border-alert-on-dark"
                            : "border-cream/35 hover:border-cream/55 focus-visible:border-green-bright",
                        )}
                      />
                      {errors[field.name] && (
                        <p id={`cta-${field.name}-error`} className="mt-2 text-sm text-alert-on-dark">
                          {errors[field.name]}
                        </p>
                      )}
                    </div>
                  ))}
                </div>

                <Button type="submit" variant="light" className="mt-8 w-full sm:w-auto" disabled={status === "submitting"}>
                  {status === "submitting" ? "Enviando…" : "Solicitar estudio solar"}
                </Button>

                <p className="mt-5 text-xs text-cream/75">
                  Formulario de demostración: este proyecto es conceptual y no envía ni almacena ningún dato.
                </p>
              </form>
            )}
          </div>
        </div>
      </Container>
      </div>
    </section>
  );
}
