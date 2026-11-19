import type { Metadata, Viewport } from "next";
import { Inter, Instrument_Serif } from "next/font/google";
import type { ReactNode } from "react";
import { BusinessJsonLd } from "@/components/layout/BusinessJsonLd";
import { DraftNotice } from "@/components/layout/DraftNotice";
import { SiteFooter } from "@/components/layout/SiteFooter";
import { SiteHeader } from "@/components/layout/SiteHeader";
import { OrderProvider } from "@/components/order/OrderContext";
import { Toaster } from "@/components/order/Toaster";
import { getOrderConfig } from "@/lib/order/catalog";
import { getBrand, getBusiness, getInstagram } from "@/lib/content";
import { isIndexable, showDrafts, siteUrl } from "@/lib/site";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

const serif = Instrument_Serif({
  subsets: ["latin"],
  weight: "400",
  variable: "--font-serif",
  display: "swap",
});

const business = getBusiness();

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: `${business.name} | ${business.tagline}`,
    template: `%s | ${business.name}`,
  },
  description: business.description,
  applicationName: business.name,
  openGraph: {
    type: "website",
    locale: "pt_BR",
    siteName: business.name,
    images: [{ url: "/og.jpg", width: 1200, height: 630, alt: business.name }],
  },
  twitter: { card: "summary_large_image" },
  robots: isIndexable ? { index: true, follow: true } : { index: false, follow: false },
};

export const viewport: Viewport = {
  themeColor: "#14110f",
};

export default function RootLayout({ children }: Readonly<{ children: ReactNode }>) {
  const instagram = getInstagram();
  const order = getOrderConfig();

  return (
    <html lang="pt-BR" className={`${inter.variable} ${serif.variable}`}>
      <body id="topo" className="antialiased">
        <a href="#conteudo" className="skip-link">
          Pular para o conteúdo
        </a>
        <OrderProvider config={order}>
          {showDrafts ? <DraftNotice /> : null}
          <SiteHeader
            brand={getBrand()}
            instagram={instagram ? { url: instagram.url, handle: instagram.handle } : undefined}
            ordering={order.enabled}
          />
          <main id="conteudo" tabIndex={-1} className="outline-none">
            {children}
          </main>
          <SiteFooter />
          {order.enabled ? <Toaster /> : null}
        </OrderProvider>
        <BusinessJsonLd />
      </body>
    </html>
  );
}
