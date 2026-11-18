import { BusinessHours } from "@/components/business/BusinessHours";
import { WhatsAppForm } from "@/components/forms/WhatsAppForm";
import { PageHero } from "@/components/layout/PageHero";
import { ButtonLink } from "@/components/ui/Button";
import { Notice, SetupHint } from "@/components/ui/Feedback";
import { Icon, type IconName } from "@/components/ui/Icon";
import { getAnnouncements, getBusiness } from "@/lib/content";
import { directionsUrl, formatAddress, formatPhone, whatsappUrl } from "@/lib/links";
import { pageMetadata } from "@/lib/metadata";
import { showDrafts } from "@/lib/site";

export const metadata = pageMetadata({
  title: "Contato e localização",
  description: "Endereço, horários, WhatsApp e Instagram da JDS Cafeteria.",
  path: "/contato",
});

export const revalidate = 3600;

type Channel = { icon: IconName; label: string; value: string; href: string; external?: boolean };

export default function ContatoPage() {
  const business = getBusiness();
  const announcements = getAnnouncements();
  const { address, hours, contact } = business;
  const lines = address ? formatAddress(address) : undefined;

  const channels: Channel[] = [];
  if (contact.whatsapp) {
    channels.push({
      icon: "chat",
      label: "WhatsApp",
      value: formatPhone(contact.whatsapp),
      href: whatsappUrl(contact.whatsapp),
      external: true,
    });
  }
  if (contact.phone) {
    channels.push({ icon: "phone", label: "Telefone", value: formatPhone(contact.phone), href: `tel:+${contact.phone}` });
  }
  if (contact.email) {
    channels.push({ icon: "arrowUpRight", label: "E-mail", value: contact.email, href: `mailto:${contact.email}` });
  }
  for (const social of business.social) {
    channels.push({
      icon: social.network === "instagram" ? "instagram" : "external",
      label: social.network === "instagram" ? "Instagram" : social.network,
      value: social.handle,
      href: social.url,
      external: true,
    });
  }

  return (
    <>
      <PageHero
        eyebrow="Visite a JDS"
        title="Contato e localização"
        intro="Onde estamos, quando abrimos e os canais para falar com a casa."
      />

      {announcements.length ? (
        <div className="page-x space-y-3 pt-10">
          {announcements.map((a) => (
            <Notice key={a.id} tone={a.tone} title={a.title}>
              {a.message}
            </Notice>
          ))}
        </div>
      ) : null}

      <div className="page-x grid gap-12 py-14 sm:py-20 lg:grid-cols-12 lg:gap-10">
        <section aria-labelledby="onde-title" className="lg:col-span-6">
          <h2 id="onde-title" className="flex items-center gap-2 text-h3">
            <Icon name="pin" size={20} className="text-caramel-deep" />
            Onde estamos
          </h2>

          {address && lines ? (
            <>
              <address className="mt-4 text-2xl leading-snug font-semibold tracking-[-0.02em] text-espresso not-italic">
                {lines.line1}
                <br />
                <span className="font-normal text-mocha">{lines.line2}</span>
              </address>
              {address.reference ? <p className="mt-3 text-mocha">{address.reference}</p> : null}
              <ButtonLink href={directionsUrl(address)} external icon="arrowUpRight" className="mt-8">
                Como chegar
              </ButtonLink>
            </>
          ) : (
            <div className="mt-4">
              <p className="text-2xl font-semibold tracking-[-0.02em] text-espresso">Endereço em breve</p>
              {showDrafts ? (
                <SetupHint field="endereço" className="mt-6 max-w-lg">
                  Preencha <code>address</code> em src/content/business.ts. Com ele, entram o botão de rota, o rodapé e os
                  dados estruturados para o Google.
                </SetupHint>
              ) : null}
            </div>
          )}

          <div className="mt-12 border-t border-line pt-8">
            <h2 className="flex items-center gap-2 text-h3">
              <Icon name="clock" size={20} className="text-caramel-deep" />
              Horários
            </h2>
            <div className="mt-6 max-w-lg">
              {hours ? (
                <BusinessHours hours={hours} />
              ) : showDrafts ? (
                <SetupHint field="horários">
                  Preencha <code>hours</code> com os sete dias da semana. O selo &ldquo;Aberto agora&rdquo; só aparece quando os
                  horários estiverem marcados como verificados.
                </SetupHint>
              ) : (
                <p className="text-mocha">Os horários serão publicados aqui em breve.</p>
              )}
            </div>
          </div>
        </section>

        <section aria-labelledby="fale-title" className="lg:col-span-5 lg:col-start-8">
          <h2 id="fale-title" className="flex items-center gap-2 text-h3">
            <Icon name="chat" size={20} className="text-caramel-deep" />
            Fale com a gente
          </h2>
          {channels.length ? (
            <ul className="mt-4 divide-y divide-line overflow-hidden rounded-xl border border-line bg-paper">
              {channels.map((c) => (
                <li key={c.label}>
                  <a
                    href={c.href}
                    target={c.external ? "_blank" : undefined}
                    rel={c.external ? "noopener noreferrer" : undefined}
                    className="group flex min-h-16 items-center gap-4 px-4 py-3 transition-colors hover:bg-cream-soft"
                  >
                    <Icon name={c.icon} size={22} className="shrink-0 text-caramel-deep" />
                    <span className="flex-1">
                      <span className="block text-xs font-semibold text-mocha">{c.label}</span>
                      <span className="mt-0.5 block font-medium text-espresso">
                        {c.value}
                      </span>
                    </span>
                    <Icon
                      name={c.external ? "arrowUpRight" : "arrowRight"}
                      size={18}
                      className="text-mocha transition-transform duration-200 ease-soft group-hover:translate-x-0.5"
                    />
                    {c.external ? <span className="sr-only"> (abre em nova aba)</span> : null}
                  </a>
                </li>
              ))}
            </ul>
          ) : (
            <p className="mt-4 text-mocha">Os canais de contato serão publicados em breve.</p>
          )}

          {contact.whatsapp ? (
            <div className="mt-14">
              <h2 className="text-h3">Mande uma mensagem</h2>
              <p className="mt-2 mb-7 text-sm text-mocha">Preencha e a conversa abre direto no WhatsApp da JDS.</p>
              <WhatsAppForm number={contact.whatsapp} />
            </div>
          ) : showDrafts ? (
            <SetupHint field="WhatsApp e telefone" className="mt-8">
              Com o número em <code>contact.whatsapp</code> (só dígitos, com 55 e DDD), aparecem o botão de WhatsApp e o
              formulário que abre a conversa pronta.
            </SetupHint>
          ) : null}
        </section>
      </div>
    </>
  );
}
