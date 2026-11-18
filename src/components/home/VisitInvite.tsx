import { ButtonLink } from "@/components/ui/Button";
import { SetupHint } from "@/components/ui/Feedback";
import { home } from "@/content/home";
import { getBusiness, getInstagram } from "@/lib/content";
import { directionsUrl, formatAddress } from "@/lib/links";
import { showDrafts } from "@/lib/site";

export function VisitInvite() {
  const { address } = getBusiness();
  const instagram = getInstagram();
  const lines = address ? formatAddress(address) : undefined;

  return (
    <section aria-labelledby="convite-title" className="page-x py-20 sm:py-24">
      <div className="on-dark rounded-3xl bg-night px-6 py-14 text-center text-white sm:px-12 sm:py-20">
        <h2 id="convite-title" className="text-h1 text-white">
          {home.visit.title}
        </h2>
        {lines ? (
          <address className="mx-auto mt-4 max-w-md text-lede text-sand not-italic">
            {lines.line1}, {lines.line2}
          </address>
        ) : (
          <p className="mx-auto mt-4 max-w-md text-lede text-sand">
            {home.visit.fallback}
          </p>
        )}

        <div className="mt-8 flex flex-col justify-center gap-3 xs:flex-row">
          {address ? (
            <ButtonLink href={directionsUrl(address)} external variant="light" icon="arrowUpRight">
              Como chegar
            </ButtonLink>
          ) : instagram ? (
            <ButtonLink href={instagram.url} external variant="light" icon="arrowUpRight">
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
    </section>
  );
}
