import { getBusiness } from "@/lib/content";
import { siteUrl } from "@/lib/site";
import type { Weekday } from "@/types/content";

const schemaDays = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

export function BusinessJsonLd() {
  const business = getBusiness();
  const verified = <T extends { status: string }>(item: T | undefined) => (item?.status === "verified" ? item : undefined);

  const address = verified(business.address);
  const hours = verified(business.hours);
  const contact = verified(business.contact);
  const sameAs = business.social.filter((s) => s.status === "verified").map((s) => s.url);

  const data: Record<string, unknown> = {
    "@context": "https://schema.org",
    "@type": "CafeOrCoffeeShop",
    name: business.name,
    url: siteUrl,
    image: `${siteUrl}/og.jpg`,
    description: business.description,
  };

  if (sameAs.length) data.sameAs = sameAs;
  if (contact?.phone) data.telephone = `+${contact.phone}`;

  if (address) {
    data.address = {
      "@type": "PostalAddress",
      streetAddress: [address.street, address.number, address.complement].filter(Boolean).join(", "),
      addressLocality: address.city,
      addressRegion: address.state,
      postalCode: address.postalCode,
      addressCountry: "BR",
    };
    if (address.geo) {
      data.geo = { "@type": "GeoCoordinates", latitude: address.geo.lat, longitude: address.geo.lng };
    }
  }

  if (hours) {
    data.openingHoursSpecification = ([0, 1, 2, 3, 4, 5, 6] as Weekday[]).flatMap((day) =>
      hours.week[day].map((p) => ({
        "@type": "OpeningHoursSpecification",
        dayOfWeek: schemaDays[day],
        opens: p.opens,
        closes: p.closes,
      })),
    );
  }

  return <JsonLd data={data} />;
}

export function JsonLd({ data }: { data: Record<string, unknown> }) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data).replace(/</g, "\\u003c") }}
    />
  );
}
