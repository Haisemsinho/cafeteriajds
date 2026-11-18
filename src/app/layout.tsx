import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import type { ReactNode } from "react";
import { BusinessJsonLd } from "@/components/layout/BusinessJsonLd";
import { DraftNotice } from "@/components/layout/DraftNotice";
import { SiteFooter } from "@/components/layout/SiteFooter";
import { SiteHeader } from "@/components/layout/SiteHeader";
import { getBrand, getBusiness, getInstagram } from "@/lib/content";
import { isIndexable, showDrafts, siteUrl } from "@/lib/site";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
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
  themeColor: "#f7f2ea",
};

export default function RootLayout({ children }: Readonly<{ children: ReactNode }>) {
  const instagram = getInstagram();

  return (
    <html lang="pt-BR" className={inter.variable}>
      <body id="topo" className="antialiased">
        <a href="#conteudo" className="skip-link">
          Pular para o conteúdo
        </a>
        <SiteHeader
          brand={getBrand()}
          instagram={instagram ? { url: instagram.url, handle: instagram.handle } : undefined}
        />
        <main id="conteudo" tabIndex={-1} className="outline-none">
          {children}
        </main>
        <SiteFooter />
        {showDrafts ? <DraftNotice /> : null}
        <BusinessJsonLd />
      </body>
    </html>
  );
}
