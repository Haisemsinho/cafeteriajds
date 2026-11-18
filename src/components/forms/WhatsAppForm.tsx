"use client";

import { useRef, useState, type FormEvent } from "react";
import { Button } from "@/components/ui/Button";
import { Notice } from "@/components/ui/Feedback";
import { Icon } from "@/components/ui/Icon";
import { cn } from "@/lib/cn";
import { whatsappUrl } from "@/lib/links";

const subjects = ["Dúvida", "Sugestão", "Encomenda", "Outro assunto"];

type Values = { name: string; subject: string; message: string };
type Field = keyof Values;

function validate(values: Values) {
  const errors: Partial<Record<Field, string>> = {};
  if (values.name.trim().length < 2) errors.name = "Conta pra gente como você se chama.";
  if (values.message.trim().length < 10) errors.message = "Escreve um pouquinho mais, pelo menos 10 letras.";
  return errors;
}

const inputClass =
  "w-full rounded-md border bg-paper px-4 py-3 text-[0.9375rem] text-espresso placeholder:text-mocha/70 transition-colors focus:outline-none focus:border-caramel-deep";

export function WhatsAppForm({ number }: { number: string }) {
  const [values, setValues] = useState<Values>({ name: "", subject: subjects[0] ?? "", message: "" });
  const [touched, setTouched] = useState<Partial<Record<Field, boolean>>>({});
  const [sent, setSent] = useState(false);
  const formRef = useRef<HTMLFormElement>(null);
  const errors = validate(values);

  const update = (field: Field, value: string) => {
    setValues((v) => ({ ...v, [field]: value }));
    setSent(false);
  };

  const errorFor = (field: Field) => (touched[field] ? errors[field] : undefined);

  const onSubmit = (e: FormEvent) => {
    e.preventDefault();
    setTouched({ name: true, subject: true, message: true });
    const firstInvalid = (Object.keys(errors) as Field[])[0];
    if (firstInvalid) {
      formRef.current?.querySelector<HTMLElement>(`[name="${firstInvalid}"]`)?.focus();
      return;
    }
    const text = `Olá, JDS! Sou ${values.name.trim()}.\nAssunto: ${values.subject}\n\n${values.message.trim()}`;
    window.open(whatsappUrl(number, text), "_blank", "noopener,noreferrer");
    setSent(true);
  };

  return (
    <form ref={formRef} onSubmit={onSubmit} noValidate className="space-y-5">
      <div>
        <label htmlFor="wa-name" className="mb-1.5 block text-sm font-medium text-espresso">
          Seu nome
        </label>
        <input
          id="wa-name"
          name="name"
          autoComplete="name"
          value={values.name}
          onChange={(e) => update("name", e.target.value)}
          onBlur={() => setTouched((t) => ({ ...t, name: true }))}
          aria-invalid={Boolean(errorFor("name"))}
          aria-describedby={errorFor("name") ? "wa-name-error" : undefined}
          className={cn(inputClass, errorFor("name") ? "border-caramel-deep" : "border-espresso/15")}
        />
        {errorFor("name") ? (
          <p id="wa-name-error" className="mt-1.5 text-sm text-caramel-deep">
            {errorFor("name")}
          </p>
        ) : null}
      </div>

      <div>
        <label htmlFor="wa-subject" className="mb-1.5 block text-sm font-medium text-espresso">
          Assunto
        </label>
        <div className="relative">
          <select
            id="wa-subject"
            name="subject"
            value={values.subject}
            onChange={(e) => update("subject", e.target.value)}
            className={cn(inputClass, "appearance-none border-espresso/15 pr-10")}
          >
            {subjects.map((s) => (
              <option key={s}>{s}</option>
            ))}
          </select>
          <Icon
            name="chevronRight"
            size={16}
            className="pointer-events-none absolute top-1/2 right-4 -translate-y-1/2 rotate-90 text-mocha"
          />
        </div>
      </div>

      <div>
        <label htmlFor="wa-message" className="mb-1.5 block text-sm font-medium text-espresso">
          Mensagem
        </label>
        <textarea
          id="wa-message"
          name="message"
          rows={4}
          value={values.message}
          onChange={(e) => update("message", e.target.value)}
          onBlur={() => setTouched((t) => ({ ...t, message: true }))}
          aria-invalid={Boolean(errorFor("message"))}
          aria-describedby={errorFor("message") ? "wa-message-error" : "wa-message-hint"}
          className={cn(inputClass, "resize-y", errorFor("message") ? "border-caramel-deep" : "border-espresso/15")}
        />
        {errorFor("message") ? (
          <p id="wa-message-error" className="mt-1.5 text-sm text-caramel-deep">
            {errorFor("message")}
          </p>
        ) : (
          <p id="wa-message-hint" className="mt-1.5 text-sm text-mocha">
            A mensagem abre pronta no WhatsApp. É só revisar e enviar.
          </p>
        )}
      </div>

      <Button type="submit" icon="arrowUpRight" className="w-full sm:w-auto">
        Abrir no WhatsApp
      </Button>

      <div aria-live="polite">
        {sent ? (
          <Notice tone="special" title="WhatsApp aberto em outra aba">
            Se nada abriu, confira se o navegador bloqueou a janela.
          </Notice>
        ) : null}
      </div>
    </form>
  );
}
