const draftFlag = process.env.SHOW_DRAFT_CONTENT;

export const siteUrl = (process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000").replace(/\/+$/, "");

export const showDrafts =
  draftFlag === "true" || (draftFlag === undefined && process.env.NODE_ENV === "development");

export const isIndexable = !showDrafts && Boolean(process.env.NEXT_PUBLIC_SITE_URL);
