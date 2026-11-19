import { OrderConfirmation } from "@/components/order/OrderConfirmation";
import { OrderGate } from "@/components/order/OrderGate";

export const metadata = { title: "Pedido de demonstração registrado", robots: { index: false } };

export default function Page() {
  return (
    <OrderGate>
      <OrderConfirmation />
    </OrderGate>
  );
}
