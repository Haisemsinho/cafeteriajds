import type { ReactNode } from "react";
import { ButtonLink } from "./Button";

type Props = {
  title: ReactNode;
  text?: string;
  primary: { href: string; label: string; external?: boolean };
  secondary?: { href: string; label: string; external?: boolean };
};

export function CtaBand({ title, text, primary, secondary }: Props) {
  return (
    <section className="page-x py-16 sm:py-20">
      <div className="on-dark rounded-2xl bg-espresso px-6 py-12 text-paper sm:px-12 sm:py-14 lg:flex lg:items-center lg:justify-between lg:gap-10">
        <div className="max-w-xl">
          <h2 className="text-h2 text-paper">{title}</h2>
          {text ? <p className="mt-3 text-sand">{text}</p> : null}
        </div>
        <div className="mt-8 flex flex-col gap-3 xs:flex-row lg:mt-0 lg:shrink-0">
          <ButtonLink href={primary.href} external={primary.external} variant="light" icon="arrowRight">
            {primary.label}
          </ButtonLink>
          {secondary ? (
            <ButtonLink href={secondary.href} external={secondary.external} variant="outline-light">
              {secondary.label}
            </ButtonLink>
          ) : null}
        </div>
      </div>
    </section>
  );
}
