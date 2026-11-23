const draftFlag = process.env.SHOW_DRAFT_CONTENT;

function readSiteUrl() {
  const raw = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";
  try {
    const url = new URL(raw);
    if (url.protocol !== "https:" && url.hostname !== "localhost") {
      throw new Error("use https");
    }
    return url.origin;
  } catch {
    throw new Error(`NEXT_PUBLIC_SITE_URL inválida: "${raw}". Use o endereço completo, ex.: https://www.seudominio.com.br`);
  }
}

export const siteUrl = readSiteUrl();

export const showDrafts =
  draftFlag === "true" || (draftFlag === undefined && process.env.NODE_ENV === "development");

export const menuSource: "exemplo" | "oficial" = process.env.MENU_SOURCE === "oficial" ? "oficial" : "exemplo";

export const isIndexable = !showDrafts && Boolean(process.env.NEXT_PUBLIC_SITE_URL);
