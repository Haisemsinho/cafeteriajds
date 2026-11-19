import { CartPage } from "@/components/order/CartPage";
import { OrderGate } from "@/components/order/OrderGate";
import { pageMetadata } from "@/lib/metadata";

export const metadata = {
  ...pageMetadata({ title: "Carrinho", description: "Itens escolhidos para o pedido.", path: "/carrinho" }),
  robots: { index: false },
};

export default function Page() {
  return (
    <OrderGate>
      <CartPage />
    </OrderGate>
  );
}
