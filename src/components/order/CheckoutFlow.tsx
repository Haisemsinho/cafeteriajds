"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useId, useRef, useState, type ReactNode } from "react";
import { Icon, type IconName } from "@/components/ui/Icon";
import { pushUrlParams, useUrlParam } from "@/hooks/useUrlParam";
import { dismissToast, showToast } from "@/lib/order/toast";
import { cn } from "@/lib/cn";
import { formatPrice } from "@/lib/format";
import {
  hasErrors,
  LIMITS,
  maskCep,
  maskPhone,
  steps,
  validateAddress,
  validateGift,
  type StepId,
} from "@/lib/order/checkout";
import { describeSelection, orderTotals } from "@/lib/order/pricing";
import {
  clearCart,
  newOrderNumber,
  patchCheckout,
  resetCheckout,
  saveOrder,
  useCheckout,
  type CheckoutDraft,
} from "@/lib/order/store";
import { DemoBadge, EmptyCart, SummaryRows } from "./CartLines";
import { useOrderConfig, useResolvedCart } from "./OrderContext";
import { UnitPicker } from "./UnitPicker";

const packagingIcons: Record<string, IconName> = { padrao: "bag", reforcada: "shield", presente: "gift" };

const states = [
  "AC",
  "AL",
  "AP",
  "AM",
  "BA",
  "CE",
  "DF",
  "ES",
  "GO",
  "MA",
  "MT",
  "MS",
  "MG",
  "PA",
  "PB",
  "PR",
  "PE",
  "PI",
  "RJ",
  "RN",
  "RS",
  "RO",
  "RR",
  "SC",
  "SP",
  "SE",
  "TO",
];

const inputClass = (invalid?: boolean) =>
  cn(
    "mt-2 block min-h-13 w-full rounded-2xl border bg-white px-4 py-3 text-base text-espresso placeholder:text-mocha focus:border-caramel-deep focus:shadow-[0_0_0_4px_rgb(185_119_53/0.14)] focus:outline-none",
    invalid ? "border-alert" : "border-line-strong",
  );

const cardChoice = cn(
  "press relative flex min-h-16 cursor-pointer items-center gap-4 rounded-2xl border bg-white px-4 py-3 text-espresso transition-colors",
  "border-line-strong hover:border-espresso has-checked:border-night has-checked:bg-night has-checked:text-white",
  "has-focus-visible:outline-2 has-focus-visible:outline-offset-2 has-focus-visible:outline-caramel-deep",
);

function Check() {
  return (
    <span
      aria-hidden
      className="grid size-6 shrink-0 place-items-center rounded-full border border-line-strong [:checked~&]:border-caramel-light [:checked~&]:bg-caramel-light [:checked~&]:text-night"
    >
      <Icon name="check" size={14} strokeWidth={2.6} className="hidden [:checked~*_&]:block" />
    </span>
  );
}

type FieldProps = {
  id: string;
  label: string;
  error?: string;
  hint?: string;
  optional?: boolean;
  className?: string;
  children: (props: {
    id: string;
    "aria-invalid"?: boolean;
    "aria-describedby"?: string;
    className: string;
  }) => ReactNode;
};

function Field({ id, label, error, hint, optional, className, children }: FieldProps) {
  const describedBy = [error ? `${id}-erro` : null, hint ? `${id}-dica` : null].filter(Boolean).join(" ") || undefined;
  return (
    <div className={className} data-invalid={error ? "true" : undefined}>
      <label htmlFor={id} className="text-base font-semibold text-espresso">
        {label}
        {optional ? <span className="font-normal text-mocha"> (opcional)</span> : null}
      </label>
      {children({
        id,
        "aria-invalid": error ? true : undefined,
        "aria-describedby": describedBy,
        className: inputClass(Boolean(error)),
      })}
      {hint ? (
        <p id={`${id}-dica`} className="mt-1.5 text-sm text-mocha">
          {hint}
        </p>
      ) : null}
      {error ? (
        <p id={`${id}-erro`} className="mt-1.5 flex items-start gap-1.5 text-sm font-medium text-alert">
          <Icon name="info" size={16} className="mt-0.5 shrink-0" />
          {error}
        </p>
      ) : null}
    </div>
  );
}

function focusFirstError() {
  requestAnimationFrame(() => {
    const el = document.querySelector<HTMLElement>("[data-invalid='true']");
    el?.scrollIntoView({ block: "center", behavior: "smooth" });
    el?.querySelector<HTMLElement>("input, textarea, select")?.focus({ preventScroll: true });
  });
}

export function CheckoutFlow() {
  const router = useRouter();
  const { packaging, units } = useOrderConfig();
  const { lines, unit, unitId } = useResolvedCart();
  const draft = useCheckout();
  const [stepParam] = useUrlParam("etapa");
  const [tried, setTried] = useState<Partial<Record<StepId, boolean>>>({});
  const [paying, setPaying] = useState(false);
  const headingRef = useRef<HTMLHeadingElement>(null);
  const uid = useId();

  const packagingIds = packaging.map((p) => p.id);
  const giftErrors = validateGift(draft, packagingIds);
  const addressErrors = validateAddress(draft, unit?.delivery?.cities ?? []);
  const blocked = !unitId || lines.some((l) => !l.available);

  const requested = steps.findIndex((s) => s.id === stepParam);
  const firstInvalid = blocked || hasErrors(giftErrors) ? 0 : hasErrors(addressErrors) ? 1 : 3;
  const index = Math.max(0, Math.min(requested < 0 ? 0 : requested, firstInvalid));
  const step = steps[index] ?? steps[0]!;

  useEffect(() => {
    headingRef.current?.focus({ preventScroll: true });
  }, [step.id]);

  const go = (id: StepId) => {
    pushUrlParams({ etapa: id });
    window.scrollTo({ top: 0 });
  };

  const next = () => {
    setTried((t) => ({ ...t, [step.id]: true }));
    if (step.id === "embalagem" && (blocked || hasErrors(giftErrors))) return focusFirstError();
    if (step.id === "endereco" && hasErrors(addressErrors)) return focusFirstError();
    if (step.id === "endereco") showToast("Endereço conferido.");
    const following = steps[index + 1];
    if (following) go(following.id);
  };

  const pack = packaging.find((p) => p.id === draft.packaging);
  const delivery = unit?.delivery;
  const totals = orderTotals(lines, { packagingCents: pack?.priceCents ?? 0, deliveryCents: delivery?.feeCents ?? 0 });
  const set = (patch: Partial<CheckoutDraft>) => patchCheckout(patch);
  const t = tried[step.id];

  if (!lines.length && !paying) {
    return (
      <div className="page-x py-16">
        <h1 className="sr-only">Finalizar pedido</h1>
        <div className="rounded-3xl border border-line bg-white">
          <EmptyCart />
        </div>
      </div>
    );
  }

  const pay = () => {
    setTried((x) => ({ ...x, pagamento: true }));
    if (!draft.payment || !unitId) return focusFirstError();
    setPaying(true);
    dismissToast();
    const number = newOrderNumber();
    saveOrder({
      number,
      createdAt: new Date().toISOString(),
      unitId,
      lines: lines.map((l) => ({
        productId: l.productId,
        name: l.product.name,
        quantity: l.quantity,
        unitCents: l.unitCents,
        details: [
          ...describeSelection(l.product, l.selection),
          ...(l.selection.note ? [`Observação: ${l.selection.note}`] : []),
        ],
        selection: l.selection,
      })),
      packaging: pack?.label ?? "",
      isGift: Boolean(draft.isGift),
      recipientFirstName: draft.recipient.trim().split(/\s+/)[0] ?? "",
      place: [draft.district, draft.city].filter(Boolean).join(", "),
      payment: draft.payment,
      subtotalCents: totals.subtotalCents,
      packagingCents: totals.packagingCents,
      deliveryCents: totals.deliveryCents,
      totalCents: totals.totalCents,
      status: 0,
    });
    clearCart();
    resetCheckout();
    router.push(`/finalizar/confirmado?pedido=${number}`);
  };

  const summary = (
    <div className="rounded-3xl border border-line bg-white p-5 sm:p-6">
      <div className="flex items-center justify-between gap-3">
        <h2 className="font-sans text-lg font-semibold text-espresso">Resumo do pedido</h2>
        <Link
          href="/carrinho"
          className="inline-flex min-h-11 items-center text-sm font-semibold text-caramel-deep hover:underline"
        >
          Editar itens
        </Link>
      </div>
      <p className="text-sm text-mocha">{unit ? `Unidade ${unit.name}` : "Unidade não escolhida"}</p>
      <ul className="mt-4 space-y-2 border-y border-line py-4 text-[0.9375rem]">
        {lines.map((l) => (
          <li key={l.id} className="flex justify-between gap-3">
            <span>
              {l.quantity} × {l.product.name}
            </span>
            <span className="tabular-nums">{formatPrice(l.unitCents * l.quantity)}</span>
          </li>
        ))}
      </ul>
      <div className="mt-4">
        <SummaryRows
          rows={[
            { label: "Itens", cents: totals.subtotalCents },
            { label: pack?.label ?? "Embalagem", cents: totals.packagingCents },
            ...(delivery ? [{ label: "Entrega", cents: totals.deliveryCents, note: "taxa de exemplo" }] : []),
          ]}
          total={totals.totalCents}
        />
      </div>
    </div>
  );

  return (
    <div className="page-x pt-8 pb-16 sm:pt-12 sm:pb-24">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <DemoBadge />
      </div>

      <nav aria-label="Etapas da finalização" className="mt-5">
        <p className="text-sm font-semibold text-mocha">
          Etapa {index + 1} de {steps.length}
        </p>
        <ol className="mt-3 grid grid-cols-4 gap-1.5 sm:gap-3">
          {steps.map((s, i) => {
            const done = i < index;
            const current = i === index;
            return (
              <li key={s.id}>
                <button
                  type="button"
                  disabled={i > firstInvalid || i > index}
                  onClick={() => go(s.id)}
                  aria-current={current ? "step" : undefined}
                  className="group flex w-full min-h-11 flex-col items-start gap-2 text-left disabled:cursor-default"
                >
                  <span className={cn("h-1.5 w-full rounded-full", done || current ? "bg-caramel-deep" : "bg-cream")} />
                  <span
                    className={cn(
                      "flex items-center gap-1 text-xs font-semibold sm:text-sm",
                      current ? "text-espresso" : done ? "text-caramel-deep group-hover:underline" : "text-mocha",
                    )}
                  >
                    {done ? <Icon name="check" size={14} strokeWidth={2.4} /> : null}
                    {s.label}
                    {done ? <span className="sr-only"> (concluída, voltar para esta etapa)</span> : null}
                  </span>
                </button>
              </li>
            );
          })}
        </ol>
      </nav>

      <div className="mt-8 grid gap-8 lg:grid-cols-[1fr_22rem] lg:gap-12">
        <div key={step.id} className="step-enter min-w-0">
          {step.id === "embalagem" ? (
            <section aria-labelledby={`${uid}-h`} className="space-y-8">
              <h1
                id={`${uid}-h`}
                ref={headingRef}
                tabIndex={-1}
                className="font-sans text-2xl font-semibold text-espresso outline-none sm:text-3xl"
              >
                Como você gostaria de receber seu pedido?
              </h1>

              {!unitId || blocked ? (
                <div data-invalid={t ? "true" : undefined}>
                  <UnitPicker title="Unidade do pedido" invalid={t} />
                  {unitId && blocked ? (
                    <p className="mt-2 text-sm font-medium text-alert">
                      Há itens indisponíveis nesta unidade.{" "}
                      <Link href="/carrinho" className="underline">
                        Revise o carrinho
                      </Link>
                      .
                    </p>
                  ) : null}
                </div>
              ) : null}

              <fieldset data-invalid={t && giftErrors.isGift ? "true" : undefined}>
                <legend className="text-base font-semibold text-espresso">Este pedido é para presente?</legend>
                {t && giftErrors.isGift ? (
                  <p className="mt-1.5 text-sm font-medium text-alert">{giftErrors.isGift}</p>
                ) : null}
                <div className="mt-3 grid grid-cols-2 gap-2">
                  {[
                    { v: true, label: "Sim, é presente" },
                    { v: false, label: "Não" },
                  ].map((o) => (
                    <label key={String(o.v)} className={cn(cardChoice, t && giftErrors.isGift && "border-alert")}>
                      <input
                        type="radio"
                        name="presente"
                        checked={draft.isGift === o.v}
                        onChange={() =>
                          set({
                            isGift: o.v,
                            ...(o.v && draft.packaging === "padrao" ? { packaging: "presente" } : {}),
                          })
                        }
                        className="sr-only"
                      />
                      <Check />
                      <span className="font-semibold">{o.label}</span>
                    </label>
                  ))}
                </div>
              </fieldset>

              {draft.isGift ? (
                <div className="space-y-5 rounded-3xl border border-line bg-cream-soft p-5 sm:p-6">
                  <Field id={`${uid}-presenteado`} label="Nome da pessoa presenteada" optional>
                    {(p) => (
                      <input
                        {...p}
                        value={draft.giftName}
                        maxLength={60}
                        autoComplete="off"
                        onChange={(e) => set({ giftName: e.target.value })}
                      />
                    )}
                  </Field>
                  <Field
                    id={`${uid}-mensagem`}
                    label="Mensagem para acompanhar o presente"
                    optional
                    error={giftErrors.giftMessage}
                    hint={`${draft.giftMessage.length}/${LIMITS.giftMessage} caracteres. Vai escrita num cartão junto do pedido.`}
                  >
                    {(p) => (
                      <textarea
                        {...p}
                        rows={3}
                        value={draft.giftMessage}
                        maxLength={LIMITS.giftMessage}
                        onChange={(e) => set({ giftMessage: e.target.value })}
                        className={cn(p.className, "resize-none")}
                      />
                    )}
                  </Field>
                </div>
              ) : null}

              <fieldset>
                <legend className="text-base font-semibold text-espresso">Tipo de embalagem</legend>
                <p className="mt-1 text-sm text-mocha">
                  Opções de exemplo. A JDS ainda vai confirmar quais embalagens oferece.
                </p>
                <div className="mt-3 grid gap-2">
                  {packaging.map((p) => (
                    <label key={p.id} className={cardChoice}>
                      <input
                        type="radio"
                        name="embalagem"
                        value={p.id}
                        checked={draft.packaging === p.id}
                        onChange={() => set({ packaging: p.id })}
                        className="sr-only"
                      />
                      <Check />
                      <Icon
                        name={packagingIcons[p.id] ?? "box"}
                        size={26}
                        className="shrink-0 text-caramel-deep [:checked~&]:text-caramel-light"
                      />
                      <span className="min-w-0 flex-1">
                        <span className="block font-semibold">{p.label}</span>
                        <span className="block text-sm opacity-80">{p.description}</span>
                      </span>
                      <span className="shrink-0 text-sm font-semibold tabular-nums">
                        {p.priceCents ? `+ ${formatPrice(p.priceCents)}` : "Sem custo"}
                      </span>
                    </label>
                  ))}
                </div>
              </fieldset>

              <Field
                id={`${uid}-obs-emb`}
                label="Instruções sobre a embalagem"
                optional
                error={giftErrors.packagingNote}
                hint="Ex.: não colocar o comprovante de valor junto ao presente."
              >
                {(p) => (
                  <textarea
                    {...p}
                    rows={2}
                    value={draft.packagingNote}
                    maxLength={LIMITS.packagingNote}
                    onChange={(e) => set({ packagingNote: e.target.value })}
                    className={cn(p.className, "resize-none")}
                  />
                )}
              </Field>
            </section>
          ) : null}

          {step.id === "endereco" ? (
            <section aria-labelledby={`${uid}-h`} className="space-y-6">
              <div>
                <h1
                  id={`${uid}-h`}
                  ref={headingRef}
                  tabIndex={-1}
                  className="font-sans text-2xl font-semibold text-espresso outline-none sm:text-3xl"
                >
                  Para quem e onde entregar?
                </h1>
                {delivery ? <p className="mt-2 text-[0.9375rem] text-mocha">{delivery.note}</p> : null}
              </div>

              <fieldset className="space-y-5">
                <legend className="text-lg font-semibold text-espresso">Quem vai receber</legend>
                <Field
                  id={`${uid}-nome`}
                  label="Nome de quem vai receber"
                  error={t ? addressErrors.recipient : undefined}
                >
                  {(p) => (
                    <input
                      {...p}
                      value={draft.recipient}
                      maxLength={80}
                      autoComplete="name"
                      onChange={(e) => set({ recipient: e.target.value })}
                    />
                  )}
                </Field>
                <Field
                  id={`${uid}-tel`}
                  label="Telefone para contato"
                  error={t ? addressErrors.phone : undefined}
                  hint="Com DDD."
                >
                  {(p) => (
                    <input
                      {...p}
                      type="tel"
                      inputMode="numeric"
                      autoComplete="tel-national"
                      placeholder="(00) 00000-0000"
                      value={draft.phone}
                      onChange={(e) => set({ phone: maskPhone(e.target.value) })}
                    />
                  )}
                </Field>
              </fieldset>

              <div aria-hidden className="border-t border-line" />
              <fieldset className="space-y-5">
                <legend className="text-lg font-semibold text-espresso">Endereço de entrega</legend>
                <Field id={`${uid}-cep`} label="CEP" error={t ? addressErrors.cep : undefined} className="max-w-xs">
                  {(p) => (
                    <input
                      {...p}
                      inputMode="numeric"
                      autoComplete="postal-code"
                      placeholder="00000-000"
                      value={draft.cep}
                      onChange={(e) => set({ cep: maskCep(e.target.value) })}
                    />
                  )}
                </Field>
                <div className="grid gap-5 sm:grid-cols-[1fr_9rem]">
                  <Field id={`${uid}-rua`} label="Rua ou avenida" error={t ? addressErrors.street : undefined}>
                    {(p) => (
                      <input
                        {...p}
                        value={draft.street}
                        maxLength={120}
                        autoComplete="address-line1"
                        onChange={(e) => set({ street: e.target.value })}
                      />
                    )}
                  </Field>
                  <Field id={`${uid}-num`} label="Número" error={t ? addressErrors.number : undefined}>
                    {(p) => (
                      <input
                        {...p}
                        value={draft.number}
                        maxLength={10}
                        onChange={(e) => set({ number: e.target.value })}
                      />
                    )}
                  </Field>
                </div>
                <Field id={`${uid}-comp`} label="Complemento" optional>
                  {(p) => (
                    <input
                      {...p}
                      value={draft.complement}
                      maxLength={60}
                      autoComplete="address-line2"
                      placeholder="Apartamento, bloco, casa"
                      onChange={(e) => set({ complement: e.target.value })}
                    />
                  )}
                </Field>
                <Field id={`${uid}-bairro`} label="Bairro" error={t ? addressErrors.district : undefined}>
                  {(p) => (
                    <input
                      {...p}
                      value={draft.district}
                      maxLength={60}
                      onChange={(e) => set({ district: e.target.value })}
                    />
                  )}
                </Field>
                <div className="grid gap-5 sm:grid-cols-[1fr_9rem]">
                  <Field id={`${uid}-cidade`} label="Cidade" error={t ? addressErrors.city : undefined}>
                    {(p) => (
                      <input
                        {...p}
                        value={draft.city}
                        maxLength={60}
                        autoComplete="address-level2"
                        onChange={(e) => set({ city: e.target.value })}
                      />
                    )}
                  </Field>
                  <Field id={`${uid}-uf`} label="Estado" error={t ? addressErrors.state : undefined}>
                    {(p) => (
                      <select
                        {...p}
                        value={draft.state}
                        autoComplete="address-level1"
                        onChange={(e) => set({ state: e.target.value })}
                      >
                        {states.map((s) => (
                          <option key={s} value={s}>
                            {s}
                          </option>
                        ))}
                      </select>
                    )}
                  </Field>
                </div>
                <Field id={`${uid}-ref`} label="Ponto de referência" optional error={addressErrors.reference}>
                  {(p) => (
                    <input
                      {...p}
                      value={draft.reference}
                      maxLength={LIMITS.reference}
                      placeholder="Perto de..."
                      onChange={(e) => set({ reference: e.target.value })}
                    />
                  )}
                </Field>
                <Field id={`${uid}-inst`} label="Instruções para a entrega" optional error={addressErrors.deliveryNote}>
                  {(p) => (
                    <textarea
                      {...p}
                      rows={2}
                      value={draft.deliveryNote}
                      maxLength={LIMITS.deliveryNote}
                      placeholder="Ex.: tocar a campainha do portão azul."
                      onChange={(e) => set({ deliveryNote: e.target.value })}
                      className={cn(p.className, "resize-none")}
                    />
                  )}
                </Field>
              </fieldset>
            </section>
          ) : null}

          {step.id === "revisao" ? (
            <section aria-labelledby={`${uid}-h`} className="space-y-4">
              <h1
                id={`${uid}-h`}
                ref={headingRef}
                tabIndex={-1}
                className="font-sans text-2xl font-semibold text-espresso outline-none sm:text-3xl"
              >
                Confira seu pedido
              </h1>
              <p className="text-[0.9375rem] text-mocha">
                Revise tudo com calma. Você pode corrigir qualquer parte antes do pagamento.
              </p>

              <ReviewBlock title="Unidade" icon="store" editHref="/carrinho" editLabel="Trocar unidade">
                <p className="font-semibold">{unit?.name}</p>
                <p className="text-mocha">
                  {unit ? `${unit.address.street}, ${unit.address.city} - ${unit.address.state}` : null}
                </p>
              </ReviewBlock>

              <ReviewBlock title="Itens" icon="bag" editHref="/carrinho" editLabel="Editar itens">
                <ul className="space-y-3">
                  {lines.map((l) => (
                    <li key={l.id} className="flex justify-between gap-3">
                      <span>
                        <span className="font-semibold">
                          {l.quantity} × {l.product.name}
                        </span>
                        {describeSelection(l.product, l.selection).length ? (
                          <span className="block text-sm text-mocha">
                            {describeSelection(l.product, l.selection).join(" · ")}
                          </span>
                        ) : null}
                        {l.selection.note ? (
                          <span className="block text-sm text-mocha">Observação: {l.selection.note}</span>
                        ) : null}
                      </span>
                      <span className="shrink-0 tabular-nums">{formatPrice(l.unitCents * l.quantity)}</span>
                    </li>
                  ))}
                </ul>
              </ReviewBlock>

              <ReviewBlock title="Embalagem e presente" icon="gift" onEdit={() => go("embalagem")}>
                <p className="font-semibold">{pack?.label}</p>
                <p className="text-mocha">
                  {draft.isGift ? `Para presente${draft.giftName ? `, para ${draft.giftName}` : ""}` : "Não é presente"}
                </p>
                {draft.isGift && draft.giftMessage ? (
                  <p className="mt-1 text-mocha">Mensagem: “{draft.giftMessage}”</p>
                ) : null}
                {draft.packagingNote ? <p className="mt-1 text-mocha">Instruções: {draft.packagingNote}</p> : null}
              </ReviewBlock>

              <ReviewBlock title="Destinatário e endereço" icon="home" onEdit={() => go("endereco")}>
                <p className="font-semibold">{draft.recipient}</p>
                <p className="text-mocha">{draft.phone}</p>
                <p className="mt-1 text-mocha">
                  {draft.street}, {draft.number}
                  {draft.complement ? `, ${draft.complement}` : ""}
                </p>
                <p className="text-mocha">
                  {draft.district}, {draft.city} - {draft.state}, CEP {draft.cep}
                </p>
                {draft.reference ? <p className="text-mocha">Referência: {draft.reference}</p> : null}
                {draft.deliveryNote ? <p className="text-mocha">Instruções: {draft.deliveryNote}</p> : null}
              </ReviewBlock>
            </section>
          ) : null}

          {step.id === "pagamento" ? (
            <section aria-labelledby={`${uid}-h`} className="space-y-6">
              <h1
                id={`${uid}-h`}
                ref={headingRef}
                tabIndex={-1}
                className="font-sans text-2xl font-semibold text-espresso outline-none sm:text-3xl"
              >
                Pagamento
              </h1>
              <p className="flex items-start gap-3 rounded-2xl border border-caramel-deep/40 bg-[#f6e6d6] px-4 py-4 text-base font-semibold text-espresso">
                <Icon name="shield" size={24} className="shrink-0 text-caramel-deep" />
                Pagamento demonstrativo. Nenhum valor será cobrado.
              </p>

              <fieldset data-invalid={tried.pagamento && !draft.payment ? "true" : undefined}>
                <legend className="text-base font-semibold text-espresso">Como você quer simular o pagamento?</legend>
                {tried.pagamento && !draft.payment ? (
                  <p className="mt-1.5 text-sm font-medium text-alert">Escolha Pix ou cartão.</p>
                ) : null}
                <div className="mt-3 grid gap-2 sm:grid-cols-2">
                  {(
                    [
                      { id: "pix", label: "Pix", detail: "Demonstração", icon: "pix" },
                      { id: "cartao", label: "Cartão", detail: "Demonstração", icon: "card" },
                    ] as const
                  ).map((o) => (
                    <label key={o.id} className={cardChoice}>
                      <input
                        type="radio"
                        name="pagamento"
                        checked={draft.payment === o.id}
                        onChange={() => set({ payment: o.id })}
                        className="sr-only"
                      />
                      <Check />
                      <Icon name={o.icon} size={26} className="text-caramel-deep [:checked~&]:text-caramel-light" />
                      <span>
                        <span className="block font-semibold">{o.label}</span>
                        <span className="block text-sm opacity-80">{o.detail}</span>
                      </span>
                    </label>
                  ))}
                </div>
              </fieldset>

              {draft.payment ? (
                <div className="rounded-3xl border border-dashed border-line-strong bg-white p-5 text-[0.9375rem] text-mocha sm:p-6">
                  {draft.payment === "pix" ? (
                    <>
                      <p className="font-semibold text-espresso">Pix de demonstração</p>
                      <p className="mt-1">
                        Na versão real, aqui aparece o código Pix da cafeteria para você pagar pelo aplicativo do banco.
                        Nesta demonstração nenhum código é gerado.
                      </p>
                    </>
                  ) : (
                    <>
                      <p className="font-semibold text-espresso">Cartão de demonstração</p>
                      <p className="mt-1">
                        Na versão real, os dados do cartão são digitados numa página segura da empresa de pagamento.
                        Nesta demonstração nenhum dado de cartão é pedido.
                      </p>
                    </>
                  )}
                </div>
              ) : null}
            </section>
          ) : null}

          <div className="mt-10 flex flex-col-reverse gap-3 border-t border-line pt-6 sm:flex-row sm:justify-between">
            {index > 0 ? (
              <button
                type="button"
                onClick={() => go(steps[index - 1]!.id)}
                className="press inline-flex min-h-13 items-center justify-center gap-2 rounded-full border border-line-strong bg-white px-6 font-semibold text-espresso hover:border-espresso"
              >
                <Icon name="chevronLeft" size={18} />
                Voltar para {steps[index - 1]!.label.toLowerCase()}
              </button>
            ) : (
              <Link
                href="/carrinho"
                className="press inline-flex min-h-13 items-center justify-center gap-2 rounded-full border border-line-strong bg-white px-6 font-semibold text-espresso hover:border-espresso"
              >
                <Icon name="chevronLeft" size={18} />
                Voltar ao carrinho
              </Link>
            )}
            {step.id === "pagamento" ? (
              <button
                type="button"
                onClick={pay}
                disabled={paying}
                className="press inline-flex min-h-14 items-center justify-center gap-2 rounded-full bg-forest px-8 text-base font-semibold text-white shadow-[0_10px_24px_-12px_rgb(35_75_58/0.8)] hover:bg-forest-deep disabled:opacity-60"
              >
                <Icon name="check" size={20} />
                Simular pagamento de {formatPrice(totals.totalCents)}
              </button>
            ) : (
              <button
                type="button"
                onClick={next}
                className="press inline-flex min-h-14 items-center justify-center gap-2 rounded-full bg-caramel-deep px-8 text-base font-semibold text-white shadow-[0_10px_24px_-12px_rgb(156_95_34/0.8)] hover:bg-caramel-dark"
              >
                {step.id === "revisao"
                  ? "Ir para o pagamento"
                  : `Continuar para ${steps[index + 1]!.label.toLowerCase()}`}
                <Icon name="arrowRight" size={18} />
              </button>
            )}
          </div>
        </div>

        <aside className="lg:sticky lg:top-28 lg:self-start">
          <details className="group rounded-3xl lg:hidden" open={false}>
            <summary className="flex min-h-14 cursor-pointer list-none items-center justify-between gap-3 rounded-3xl border border-line bg-white px-5 font-semibold [&::-webkit-details-marker]:hidden">
              <span>Resumo do pedido</span>
              <span className="flex items-center gap-2 tabular-nums text-caramel-deep">
                {formatPrice(totals.totalCents)}
                <Icon
                  name="chevronRight"
                  size={16}
                  className="rotate-90 text-mocha transition-transform group-open:-rotate-90"
                />
              </span>
            </summary>
            <div className="mt-2">{summary}</div>
          </details>
          <div className="hidden lg:block">{summary}</div>
          {units.length > 1 && unit ? (
            <p className="mt-3 px-1 text-sm text-mocha">Pedido para a unidade {unit.name}.</p>
          ) : null}
        </aside>
      </div>
    </div>
  );
}

function ReviewBlock({
  title,
  icon,
  editHref,
  editLabel = "Editar",
  onEdit,
  children,
}: {
  title: string;
  icon: IconName;
  editHref?: string;
  editLabel?: string;
  onEdit?: () => void;
  children: ReactNode;
}) {
  const cls =
    "inline-flex min-h-11 shrink-0 items-center gap-1.5 rounded-full px-3 text-sm font-semibold text-caramel-deep hover:bg-cream-soft";
  return (
    <div className="rounded-3xl border border-line bg-white p-5 sm:p-6">
      <div className="flex items-center justify-between gap-3">
        <h2 className="flex items-center gap-2 font-sans text-lg font-semibold text-espresso">
          <Icon name={icon} size={20} className="text-caramel-deep" />
          {title}
        </h2>
        {editHref ? (
          <Link href={editHref} className={cls}>
            <Icon name="edit" size={16} />
            {editLabel}
            <span className="sr-only">: {title}</span>
          </Link>
        ) : (
          <button type="button" onClick={onEdit} className={cls}>
            <Icon name="edit" size={16} />
            {editLabel}
            <span className="sr-only">: {title}</span>
          </button>
        )}
      </div>
      <div className="mt-3 text-[0.9375rem] leading-relaxed text-espresso">{children}</div>
    </div>
  );
}
