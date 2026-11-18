import type { CSSProperties } from "react";
import Image from "next/image";
import { ButtonLink } from "@/components/ui/Button";
import { SetupHint } from "@/components/ui/Feedback";
import { PhotoCredit } from "@/components/ui/PhotoCredit";
import { home } from "@/content/home";
import { getBusiness, getInstagram, getScenes } from "@/lib/content";
import { directionsUrl, formatAddress } from "@/lib/links";
import { showDrafts } from "@/lib/site";
import { stagger } from "@/lib/cn";

export function VisitInvite() {
  const { address } = getBusiness();
  const instagram = getInstagram();
  const lines = address ? formatAddress(address) : undefined;
  const { invite } = getScenes();
  const focus = {
    "--focus": invite?.positionMobile ?? invite?.position ?? "50% 50%",
    "--focus-md": invite?.position ?? "50% 50%",
  } as CSSProperties;

  return (
    <section
      aria-labelledby="convite-title"
      className="on-dark grain relative isolate flex min-h-[38rem] items-center overflow-hidden bg-roast py-24 text-white sm:min-h-[44rem]"
    >
      {invite ? (
        <div aria-hidden className="absolute -inset-y-[8%] inset-x-0 -z-20" data-parallax>
          <Image
            src={invite.src}
            alt=""
            fill
            sizes="100vw"
            placeholder="blur"
            style={focus}
            className="object-cover object-(--focus) md:object-(--focus-md)"
          />
        </div>
      ) : null}
      {invite ? (
        <div
          aria-hidden
          className="absolute inset-0 -z-10 bg-[radial-gradient(ellipse_at_center,rgb(14_11_9/0.62)_0%,rgb(14_11_9/0.82)_70%)]"
        />
      ) : null}

      <div className="page-x text-center">
        <p data-reveal className="eyebrow mb-5 text-caramel-light">
          {home.visit.eyebrow}
        </p>
        <h2 id="convite-title" data-reveal style={stagger(1)} className="mx-auto max-w-3xl text-display text-white">
          {home.visit.title}
        </h2>
        {lines ? (
          <address data-reveal style={stagger(2)} className="mx-auto mt-6 max-w-md text-lede text-sand not-italic">
            {lines.line1}, {lines.line2}
          </address>
        ) : (
          <p data-reveal style={stagger(2)} className="mx-auto mt-6 max-w-md text-lede text-sand">
            {home.visit.fallback}
          </p>
        )}

        <div data-reveal style={stagger(3)} className="mt-10 flex flex-col justify-center gap-3 xs:flex-row">
          {address ? (
            <ButtonLink href={directionsUrl(address)} external icon="arrowUpRight">
              Como chegar
            </ButtonLink>
          ) : instagram ? (
            <ButtonLink href={instagram.url} external icon="arrowUpRight">
              Seguir no Instagram
            </ButtonLink>
          ) : null}
          <ButtonLink href="/contato" variant="outline-light">
            Entrar em contato
          </ButtonLink>
        </div>

        {!address && showDrafts ? (
          <SetupHint field="endereço" className="mx-auto mt-10 max-w-md text-left">
            O botão &ldquo;Como chegar&rdquo; aparece quando o endereço for confirmado.
          </SetupHint>
        ) : null}
      </div>

      {invite ? (
        <div className="absolute right-0 bottom-0 left-0">
          <div className="page-x flex justify-end pb-4">
            <PhotoCredit photo={invite} tone="dark" />
          </div>
        </div>
      ) : null}
    </section>
  );
}
