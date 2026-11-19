import { CheckoutFlow } from "@/components/order/CheckoutFlow";
import { OrderGate } from "@/components/order/OrderGate";

export const metadata = { title: "Finalizar pedido", robots: { index: false } };

export default function Page() {
  return (
    <OrderGate>
      <CheckoutFlow />
    </OrderGate>
  );
}
