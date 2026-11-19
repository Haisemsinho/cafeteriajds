export type StepId = "embalagem" | "endereco" | "revisao" | "pagamento";

export const steps: { id: StepId; label: string }[] = [
  { id: "embalagem", label: "Embalagem" },
  { id: "endereco", label: "Endereço" },
  { id: "revisao", label: "Revisão" },
  { id: "pagamento", label: "Pagamento" },
];

export type GiftFields = {
  isGift: boolean | null;
  giftName: string;
  giftMessage: string;
  packaging: string;
  packagingNote: string;
};

export type AddressFields = {
  recipient: string;
  phone: string;
  cep: string;
  street: string;
  number: string;
  complement: string;
  district: string;
  city: string;
  state: string;
  reference: string;
  deliveryNote: string;
};

export type Errors<K extends string> = Partial<Record<K, string>>;

export const LIMITS = { giftMessage: 200, packagingNote: 160, deliveryNote: 160, reference: 80 } as const;

export const onlyDigits = (v: string) => v.replace(/\D/g, "");

export function maskPhone(v: string) {
  const d = onlyDigits(v).slice(0, 11);
  if (d.length <= 2) return d.length ? `(${d}` : "";
  if (d.length <= 6) return `(${d.slice(0, 2)}) ${d.slice(2)}`;
  if (d.length <= 10) return `(${d.slice(0, 2)}) ${d.slice(2, 6)}-${d.slice(6)}`;
  return `(${d.slice(0, 2)}) ${d.slice(2, 7)}-${d.slice(7)}`;
}

export function maskCep(v: string) {
  const d = onlyDigits(v).slice(0, 8);
  return d.length > 5 ? `${d.slice(0, 5)}-${d.slice(5)}` : d;
}

const plain = (v: string) => v.normalize("NFD").replace(/[̀-ͯ]/g, "").toLowerCase().trim();

export function validateGift(f: GiftFields, packagingIds: string[]): Errors<keyof GiftFields> {
  const e: Errors<keyof GiftFields> = {};
  if (f.isGift === null) e.isGift = "Responda se o pedido é para presente.";
  if (!packagingIds.includes(f.packaging)) e.packaging = "Escolha uma embalagem.";
  if (f.giftMessage.length > LIMITS.giftMessage)
    e.giftMessage = `A mensagem pode ter até ${LIMITS.giftMessage} caracteres.`;
  if (f.packagingNote.length > LIMITS.packagingNote) e.packagingNote = `Use até ${LIMITS.packagingNote} caracteres.`;
  return e;
}

export function validateAddress(f: AddressFields, coveredCities: string[]): Errors<keyof AddressFields> {
  const e: Errors<keyof AddressFields> = {};
  if (f.recipient.trim().length < 3) e.recipient = "Escreva o nome de quem vai receber o pedido.";
  const phone = onlyDigits(f.phone);
  if (phone.length < 10 || phone.length > 11) e.phone = "Informe o telefone com DDD. Exemplo: (33) 99999-0000.";
  if (onlyDigits(f.cep).length !== 8) e.cep = "O CEP tem 8 números. Exemplo: 36918-000.";
  if (f.street.trim().length < 3) e.street = "Informe a rua ou avenida.";
  if (!f.number.trim()) e.number = "Informe o número ou s/n.";
  if (f.district.trim().length < 2) e.district = "Informe o bairro.";
  if (f.city.trim().length < 2) e.city = "Informe a cidade.";
  else if (!coveredCities.some((c) => plain(c) === plain(f.city)))
    e.city = `Nesta demonstração, a entrega de exemplo só atende ${coveredCities.join(", ")}.`;
  if (!/^[A-Za-z]{2}$/.test(f.state.trim())) e.state = "Escolha o estado.";
  if (f.reference.length > LIMITS.reference) e.reference = `Use até ${LIMITS.reference} caracteres.`;
  if (f.deliveryNote.length > LIMITS.deliveryNote) e.deliveryNote = `Use até ${LIMITS.deliveryNote} caracteres.`;
  return e;
}

export const hasErrors = (e: object) => Object.keys(e).length > 0;
