import type { Address } from "@/types/content";

export function formatAddress(address: Address) {
  const line1 = [address.street, address.number].filter(Boolean).join(", ");
  const line2 = [address.district, `${address.city} - ${address.state}`].filter(Boolean).join(", ");
  return { line1: address.complement ? `${line1}, ${address.complement}` : line1, line2 };
}

export function directionsUrl(address: Address) {
  if (address.mapsUrl) return address.mapsUrl;
  const { line1, line2 } = formatAddress(address);
  const destination = address.geo ? `${address.geo.lat},${address.geo.lng}` : `${line1}, ${line2}`;
  return `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(destination)}`;
}

export function whatsappUrl(number: string, text?: string) {
  const base = `https://wa.me/${number}`;
  return text ? `${base}?text=${encodeURIComponent(text)}` : base;
}

export function formatPhone(digits: string) {
  const local = digits.startsWith("55") && digits.length > 11 ? digits.slice(2) : digits;
  if (local.length === 11) return `(${local.slice(0, 2)}) ${local.slice(2, 7)}-${local.slice(7)}`;
  if (local.length === 10) return `(${local.slice(0, 2)}) ${local.slice(2, 6)}-${local.slice(6)}`;
  return digits;
}
