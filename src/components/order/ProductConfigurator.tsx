"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useId, useMemo, useState, type ReactNode } from "react";
import { Icon } from "@/components/ui/Icon";
import { useUrlParam } from "@/hooks/useUrlParam";
import { cn } from "@/lib/cn";
import { formatPrice } from "@/lib/format";
import {
  clampQuantity,
  defaultSelection,
  lineTotal,
  NOTE_LIMIT,
  unitPrice,
  validateSelection,
  visibleGroups,
  type GroupId,
  type OptionGroup,
  type Selection,
} from "@/lib/order/pricing";
import { addToCart, setUnit, updateLine, useCart, useUnit } from "@/lib/order/store";
import { orderBlock } from "@/lib/order/rules";
import { showToast } from "@/lib/order/toast";
import { OptionIcon, hasOptionIcon } from "./OptionIcon";
import { useOrderConfig } from "./OrderContext";
import { QuantityStepper } from "./QuantityStepper";
import { UnitPicker } from "./UnitPicker";

type Props = { slug: string; intro: ReactNode; details: ReactNode };

const tileClass = cn(
  "press relative flex min-h-[5.5rem] cursor-pointer flex-col items-center justify-center gap-1 rounded-2xl border bg-white px-2 py-3 text-center text-espresso transition-colors",
  "border-line-strong hover:border-espresso",
  "has-checked:border-night has-checked:bg-night has-checked:text-white has-checked:[--icon-cut:#14110f]",
  "has-focus-visible:outline-2 has-focus-visible:outline-offset-2 has-focus-visible:outline-caramel-deep",
);

const chipClass = cn(
  "press relative inline-flex min-h-12 cursor-pointer items-center gap-2 rounded-full border bg-white px-4 text-[0.9375rem] text-espresso transition-colors",
  "border-line-strong hover:border-espresso",
  "has-checked:border-night has-checked:bg-night has-checked:text-white",
  "has-focus-visible:outline-2 has-focus-visible:outline-offset-2 has-focus-visible:outline-caramel-deep",
  "has-disabled:cursor-not-allowed has-disabled:opacity-45",
);

function priceTag(group: OptionGroup, cents?: number) {
  if (!cents) return null;
  return group.id === "tamanho" ? formatPrice(cents) : `+ ${formatPrice(cents)}`;
}

export function ProductConfigurator({ slug, intro, details }: Props) {
  const router = useRouter();
  const { catalog, units } = useOrderConfig();
  const product = catalog.find((p) => p.slug === slug);
  const [editId] = useUrlParam("editar");
  const unitId = useUnit();
  const formId = useId();

  const [selection, setSelection] = useState<Selection>(() =>
    product ? defaultSelection(product) : { choices: {}, note: "" },
  );
  const [quantity, setQuantity] = useState(1);
  const [submitted, setSubmitted] = useState(false);
  const [added, setAdded] = useState(false);
  const [loadedEdit, setLoadedEdit] = useState<string | null>(null);
  const cartLines = useCart();
  const editing = editId ? cartLines.find((l) => l.id === editId && l.productId === product?.id) : undefined;

  if (editing && loadedEdit !== editing.id) {
    setLoadedEdit(editing.id);
    setSelection(editing.selection);
    setQuantity(editing.quantity);
  }

  const groups = useMemo(() => (product ? visibleGroups(product, selection) : []), [product, selection]);
  const price = product ? unitPrice(product, selection) : undefined;
  const errors = product ? validateSelection(product, selection) : [];
  const errorFor = (id: GroupId | "note") => (submitted ? errors.find((e) => e.group === id) : undefined);

  if (!product || !price) return null;

  const unit = units.find((u) => u.id === unitId);
  const inUnit = !unitId || product.unitIds.includes(unitId);
  const block = orderBlock(product);
  const available = block === null;
  const otherUnit = units.find((u) => product.unitIds.includes(u.id));

  const pick = (group: OptionGroup, id: string) => {
    setAdded(false);
    setSelection((s) => {
      const current = s.choices[group.id] ?? [];
      const next =
        group.kind === "single" ? [id] : current.includes(id) ? current.filter((x) => x !== id) : [...current, id];
      return { ...s, choices: { ...s.choices, [group.id]: next } };
    });
  };

  const submit = () => {
    setSubmitted(true);
    if (!unitId || errors.length) {
      requestAnimationFrame(() => {
        const target = !unitId
          ? document.getElementById("unidade")
          : document.querySelector<HTMLElement>("[data-invalid='true']");
        target?.scrollIntoView({ block: "center", behavior: "smooth" });
        target?.querySelector<HTMLElement>("input")?.focus({ preventScroll: true });
      });
      return;
    }
    if (editing) {
      updateLine(editing.id, { selection, quantity });
      showToast("Alterações salvas no carrinho.");
      router.push("/carrinho");
      return;
    }
    addToCart(product.id, selection, quantity);
    showToast(`${quantity > 1 ? `${quantity} × ` : ""}${product.name} no carrinho.`, {
      label: "Ver carrinho",
      href: "/carrinho",
    });
    setAdded(true);
    setQuantity(1);
    setSelection((s) => ({ ...s, note: "" }));
    setSubmitted(false);
  };

  const total = lineTotal(price.unitCents, quantity);
  const blocked = !available || !inUnit;

  const actionBar = (
    <>
      {blocked ? (
        <p className="mb-2 text-sm font-medium text-caramel-dark">
          {block === "restricted"
            ? "Venda somente na cafeteria, com confirmação de idade. Este item não pode ser pedido pelo site."
            : !available
              ? "Este item está indisponível no momento."
              : `Este item não está disponível na unidade ${unit?.name}.`}
        </p>
      ) : null}
      <button
        type="submit"
        form={formId}
        disabled={blocked}
        className="press flex min-h-14 w-full items-center justify-between gap-3 rounded-full bg-caramel-deep px-6 text-base font-semibold text-white shadow-[0_10px_24px_-12px_rgb(156_95_34/0.8)] transition-colors hover:bg-caramel-dark disabled:cursor-not-allowed disabled:bg-latte disabled:shadow-none"
      >
        <span className="flex items-center gap-2">
          <Icon name={editing ? "check" : "bag"} size={20} />
          {editing ? "Salvar alterações" : "Adicionar ao carrinho"}
        </span>
        <span className="tabular-nums">
          {quantity > 1 ? `${quantity} × ` : ""}
          {formatPrice(total)}
        </span>
      </button>
    </>
  );

  return (
    <>
      <div className="mt-5" aria-live="polite">
        <p className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
          <span className="text-[2rem] leading-none font-semibold tracking-[-0.02em] text-caramel-deep tabular-nums">
            {formatPrice(price.unitCents)}
          </span>
          <span className="text-sm text-mocha">por unidade, com as opções escolhidas</span>
          {product.dataStatus !== "verified" ? (
            <span className="rounded-full bg-cream-soft px-2.5 py-1 text-xs font-semibold text-caramel-deep">
              {product.dataStatus === "review" ? "preço a conferir" : "preço de exemplo"}
            </span>
          ) : null}
        </p>
      </div>

      {intro}

      <form
        id={formId}
        noValidate
        onSubmit={(e) => {
          e.preventDefault();
          submit();
        }}
        className="mt-8 space-y-8 border-t border-line pt-7"
      >
        {editing ? (
          <p className="flex items-center gap-2 rounded-xl bg-cream-soft px-4 py-3 text-[0.9375rem] text-espresso">
            <Icon name="edit" size={18} className="text-caramel-deep" />
            Você está editando um item do carrinho.
          </p>
        ) : null}

        <UnitPicker title="Unidade do pedido" compact invalid={submitted} />
        {unit && !inUnit && otherUnit ? (
          <div className="rounded-xl border border-caramel-deep/40 bg-[#f6e6d6] px-4 py-3 text-[0.9375rem]" role="note">
            Disponível só na unidade {otherUnit.name}.{" "}
            <button
              type="button"
              className="min-h-11 font-semibold text-caramel-dark underline underline-offset-4"
              onClick={() => setUnit(otherUnit.id)}
            >
              Trocar para {otherUnit.name}
            </button>
          </div>
        ) : null}

        {groups.map((group) => {
          const err = errorFor(group.id);
          const picked = selection.choices[group.id] ?? [];
          const withIcons = group.kind === "single" && group.choices.every((c) => hasOptionIcon(group.id, c.id));
          return (
            <fieldset
              key={group.id}
              data-invalid={err ? "true" : undefined}
              aria-describedby={err ? `${formId}-${group.id}-erro` : undefined}
            >
              <legend className="text-base font-semibold text-espresso">
                {group.label}
                {group.required && !group.defaultChoice ? (
                  <span className="font-normal text-mocha"> (obrigatório)</span>
                ) : null}
              </legend>
              {group.hint ? <p className="mt-1 text-sm text-mocha">{group.hint}</p> : null}
              {err ? (
                <p
                  id={`${formId}-${group.id}-erro`}
                  className="mt-1.5 flex items-center gap-1.5 text-sm font-medium text-alert"
                >
                  <Icon name="info" size={16} />
                  {err.message}
                </p>
              ) : null}

              {group.kind === "single" ? (
                <div
                  className={cn(
                    "mt-3 grid gap-2",
                    group.choices.length === 2
                      ? "grid-cols-2"
                      : group.choices.length === 4
                        ? "grid-cols-2 sm:grid-cols-4"
                        : "grid-cols-3",
                  )}
                >
                  {group.choices.map((c) => (
                    <label key={c.id} className={cn(tileClass, err && "border-alert")}>
                      <input
                        type="radio"
                        name={group.id}
                        value={c.id}
                        checked={picked.includes(c.id)}
                        onChange={() => pick(group, c.id)}
                        className="sr-only"
                      />
                      {withIcons ? <OptionIcon group={group.id} choice={c.id} /> : null}
                      <span className="text-[0.9375rem] leading-tight font-semibold">{c.label}</span>
                      {c.detail ? <span className="text-xs opacity-80">{c.detail}</span> : null}
                      {priceTag(group, c.priceCents) ? (
                        <span className="text-xs tabular-nums opacity-80">{priceTag(group, c.priceCents)}</span>
                      ) : null}
                      <span
                        aria-hidden
                        className="absolute top-2 right-2 hidden size-5 place-items-center rounded-full bg-caramel-light text-night [:checked~&]:grid"
                      >
                        <Icon name="check" size={12} strokeWidth={2.6} />
                      </span>
                    </label>
                  ))}
                </div>
              ) : (
                <div className="mt-3 flex flex-wrap gap-2">
                  {group.choices.map((c) => {
                    const on = picked.includes(c.id);
                    const full = !on && group.maxChoices !== undefined && picked.length >= group.maxChoices;
                    return (
                      <label key={c.id} className={chipClass}>
                        <input
                          type="checkbox"
                          name={group.id}
                          value={c.id}
                          checked={on}
                          disabled={full}
                          onChange={() => pick(group, c.id)}
                          className="sr-only"
                        />
                        <span
                          aria-hidden
                          className={cn(
                            "grid size-5 place-items-center rounded-md border",
                            on ? "border-caramel-light bg-caramel-light text-night" : "border-line-strong",
                          )}
                        >
                          {on ? <Icon name="check" size={13} strokeWidth={2.6} /> : null}
                        </span>
                        {c.label}
                        {c.priceCents ? (
                          <span className="text-sm tabular-nums opacity-80">+ {formatPrice(c.priceCents)}</span>
                        ) : null}
                      </label>
                    );
                  })}
                </div>
              )}
            </fieldset>
          );
        })}

        <div data-invalid={errorFor("note") ? "true" : undefined}>
          <label htmlFor={`${formId}-obs`} className="text-base font-semibold text-espresso">
            Alguma observação para o preparo? <span className="font-normal text-mocha">(opcional)</span>
          </label>
          <textarea
            id={`${formId}-obs`}
            value={selection.note}
            maxLength={NOTE_LIMIT}
            rows={2}
            onChange={(e) => setSelection((s) => ({ ...s, note: e.target.value }))}
            placeholder="Ex.: pouco gelo, sem canela, menos doce."
            aria-describedby={`${formId}-obs-ajuda`}
            className="mt-2 block w-full resize-none rounded-2xl border border-line-strong bg-white px-4 py-3 text-base text-espresso placeholder:text-mocha focus:border-caramel-deep focus:shadow-[0_0_0_4px_rgb(185_119_53/0.14)] focus:outline-none"
          />
          <p id={`${formId}-obs-ajuda`} className="mt-1.5 flex justify-between gap-4 text-sm text-mocha">
            <span>A equipe tenta atender, mas pedidos fora do cardápio dependem da unidade.</span>
            <span className="shrink-0 tabular-nums">
              {selection.note.length}/{NOTE_LIMIT}
            </span>
          </p>
        </div>

        <div className="rounded-2xl border border-line bg-cream-soft p-5">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <span className="text-base font-semibold text-espresso">Quantidade</span>
            <QuantityStepper
              value={quantity}
              onChange={(n) => setQuantity(clampQuantity(n))}
              label={`Quantidade de ${product.name}`}
              size="lg"
            />
          </div>
          <dl className="mt-5 space-y-2 border-t border-line pt-4 text-[0.9375rem]">
            <div className="flex justify-between gap-4">
              <dt className="text-mocha">{price.base.label}</dt>
              <dd className="tabular-nums">{formatPrice(price.base.cents)}</dd>
            </div>
            {price.extras.map((e) => (
              <div key={e.label} className="flex justify-between gap-4">
                <dt className="text-mocha">{e.label}</dt>
                <dd className="tabular-nums">+ {formatPrice(e.cents)}</dd>
              </div>
            ))}
            <div className="flex justify-between gap-4 font-semibold">
              <dt>Valor unitário</dt>
              <dd className="tabular-nums">{formatPrice(price.unitCents)}</dd>
            </div>
            <div className="flex justify-between gap-4 border-t border-line pt-2 text-lg font-semibold">
              <dt>
                Total{" "}
                <span className="text-[0.9375rem] font-normal text-mocha">
                  ({quantity} × {formatPrice(price.unitCents)})
                </span>
              </dt>
              <dd className="text-caramel-deep tabular-nums">{formatPrice(total)}</dd>
            </div>
          </dl>
        </div>

        <div className="hidden md:block">{actionBar}</div>

        {added ? (
          <div className="flex flex-col gap-2 sm:flex-row">
            <Link
              href="/carrinho"
              className="press inline-flex min-h-12 flex-1 items-center justify-center gap-2 rounded-full bg-night px-6 font-semibold text-white hover:bg-walnut"
            >
              Ver carrinho
              <Icon name="arrowRight" size={18} />
            </Link>
            <Link
              href={unitId ? `/cardapio?unidade=${unitId}` : "/cardapio"}
              className="press inline-flex min-h-12 flex-1 items-center justify-center rounded-full border border-line-strong bg-white px-6 font-semibold text-espresso hover:border-espresso"
            >
              Continuar comprando
            </Link>
          </div>
        ) : null}
      </form>

      {details}

      <div className="sticky bottom-0 z-30 -mx-5 mt-8 border-t border-line bg-porcelain/95 px-5 pt-3 pb-[max(0.75rem,env(safe-area-inset-bottom))] backdrop-blur-sm sm:-mx-8 sm:px-8 md:hidden">
        {actionBar}
      </div>
    </>
  );
}
