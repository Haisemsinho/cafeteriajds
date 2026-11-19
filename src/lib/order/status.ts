import type { IconName } from "@/components/ui/Icon";

export const orderSteps: { label: string; description: string; icon: IconName }[] = [
  { label: "Pedido recebido", description: "O pedido de demonstração foi registrado.", icon: "clipboard" },
  { label: "Preparando", description: "Hora de passar o café e montar o pedido.", icon: "cup" },
  { label: "Pedido despachado", description: "Pedido embalado e entregue ao entregador.", icon: "bag" },
  { label: "Em rota para o seu endereço", description: "O entregador está a caminho.", icon: "truck" },
  { label: "Pedido entregue", description: "Pedido concluído. Bom café!", icon: "checkCircle" },
];

export const lastStep = orderSteps.length - 1;
