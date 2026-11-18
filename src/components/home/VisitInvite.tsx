import type { CSSProperties } from "react";
import Image from "next/image";
import { ButtonLink } from "@/components/ui/Button";
import { PhotoBadge } from "@/components/ui/PhotoCredit";
import { home } from "@/content/home";
import { getBusiness, getInstagram, getScenes } from "@/lib/content";
import { directionsUrl, formatAddress } from "@/lib/links";

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
      className="on-dark grain relative isolate flex min-h-svh items-center overflow-hidden bg-roast py-24 text-white"
    >
      {invite ? (
        <div aria-hidden data-moment="unveil" className="absolute inset-0 -z-20 overflow-hidden">
          <Image
            src={invite.src}
            alt=""
            fill
            sizes="100vw"
            placeholder="blur"
            style={focus}
            className="object-cover object-(--focus) md:object-(--focus-md)"
          />
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgb(14_11_9/0.55)_0%,rgb(14_11_9/0.8)_75%)]" />
          <PhotoBadge photo={invite} className="right-5 bottom-5 sm:right-8 xl:right-10" />
        </div>
      ) : null}

      <div className="page-x text-center">
        <h2 id="convite-title" className="mx-auto max-w-3xl text-display text-white">
          {home.visit.title}
        </h2>
        {lines ? (
          <address className="mx-auto mt-6 max-w-md text-lede text-sand not-italic">
            {lines.line1}, {lines.line2}
          </address>
        ) : (
          <p className="mx-auto mt-6 max-w-md text-lede text-sand">{home.visit.fallback}</p>
        )}

        <div className="mt-10 flex flex-col justify-center gap-3 xs:flex-row">
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
      </div>
    </section>
  );
}
