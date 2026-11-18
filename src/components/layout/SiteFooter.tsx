import Link from "next/link";
import { Icon } from "@/components/ui/Icon";
import { getBrand, getBusiness, getInstagram, getPhotoCredits } from "@/lib/content";
import { formatPeriods, weekdayNames } from "@/lib/hours";
import { formatAddress, formatPhone, whatsappUrl } from "@/lib/links";
import { footerNav } from "@/lib/navigation";
import type { Weekday } from "@/types/content";
import { Logo } from "./Logo";

const weekOrder: Weekday[] = [1, 2, 3, 4, 5, 6, 0];
const year = new Date().getFullYear();

export function SiteFooter() {
  const business = getBusiness();
  const instagram = getInstagram();
  const address = business.address ? formatAddress(business.address) : undefined;
  const credits = getPhotoCredits();

  return (
    <footer className="on-dark grain bg-night text-sand">
      <div className="page-x border-b border-line-dark pt-20 pb-14 sm:pt-24">
        <p className="max-w-3xl font-display text-h1 text-white">
          {business.tagline}
          <span className="text-caramel">.</span>
        </p>
      </div>
      <div className="page-x grid gap-12 py-14 sm:grid-cols-2 lg:grid-cols-[1.4fr_1fr_1fr] lg:py-16">
        <div>
          <Logo brand={getBrand()} large className="text-white" />
          <p className="mt-4 max-w-xs">{business.description}</p>
          <div className="mt-6 flex flex-col items-start gap-1">
            {instagram ? (
              <a
                href={instagram.url}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex min-h-11 items-center gap-2 font-medium text-white hover:text-caramel"
              >
                <Icon name="instagram" size={20} />
                {instagram.handle}
                <span className="sr-only"> no Instagram (abre em nova aba)</span>
              </a>
            ) : null}
            {business.contact.whatsapp ? (
              <a
                href={whatsappUrl(business.contact.whatsapp)}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex min-h-11 items-center gap-2 font-medium text-white hover:text-caramel"
              >
                <Icon name="chat" size={20} />
                WhatsApp {formatPhone(business.contact.whatsapp)}
                <span className="sr-only"> (abre em nova aba)</span>
              </a>
            ) : null}
          </div>
        </div>

        <nav aria-label="Rodapé">
          <p className="eyebrow mb-4 text-caramel-light">Navegação</p>
          <ul className="grid grid-cols-2 gap-x-6 sm:grid-cols-1">
            {footerNav.map((item) => (
              <li key={item.href}>
                <Link href={item.href} className="inline-flex min-h-10 items-center transition-colors hover:text-white">
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <div className="sm:col-span-2 lg:col-span-1">
          <p className="eyebrow mb-4 text-caramel-light">Visite</p>
          {address ? (
            <address className="not-italic">
              {address.line1}
              <br />
              {address.line2}
            </address>
          ) : (
            <p>Endereço e horários serão publicados em breve.</p>
          )}
          {business.hours ? (
            <dl className="mt-4 grid grid-cols-[auto_1fr] gap-x-6 gap-y-1 text-sm">
              {weekOrder.map((day) => (
                <div key={day} className="contents">
                  <dt className="text-latte">{weekdayNames[day]}</dt>
                  <dd>{formatPeriods(business.hours?.week[day] ?? [])}</dd>
                </div>
              ))}
            </dl>
          ) : null}
          <Link
            href="/contato"
            className="mt-4 inline-flex min-h-11 items-center gap-1.5 font-medium text-white hover:text-caramel"
          >
            Contato e localização
            <Icon name="arrowRight" size={16} />
          </Link>
        </div>
      </div>

      {credits.length ? (
        <div className="border-t border-line-dark">
          <div className="page-x py-6 text-sm leading-relaxed text-latte">
            <h2 className="font-sans text-sm font-semibold text-sand">Fotos ilustrativas</h2>
            <p className="mt-1.5 max-w-[68ch]">
              As fotos marcadas como ilustrativas são de bancos de imagens e não retratam a {business.shortName}.
              Créditos:{" "}
              {credits.map((credit, i) => (
                <span key={credit.url}>
                  <a
                    href={credit.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="underline decoration-latte/40 underline-offset-2 hover:text-white"
                  >
                    {credit.author ?? "autor não identificado"}
                  </a>{" "}
                  ({credit.license}){i < credits.length - 1 ? ", " : "."}
                </span>
              ))}
            </p>
          </div>
        </div>
      ) : null}

      <div className="border-t border-line-dark">
        <div className="page-x flex flex-col gap-2 py-5 text-sm text-latte sm:flex-row sm:items-center sm:justify-between">
          <p>
            © {year} {business.name}
          </p>
          <a href="#topo" className="inline-flex min-h-11 items-center gap-1.5 hover:text-white">
            Voltar ao topo
            <Icon name="arrowUpRight" size={14} className="-rotate-45" />
          </a>
        </div>
      </div>
    </footer>
  );
}
