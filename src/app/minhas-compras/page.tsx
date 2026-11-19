import { MyOrders } from "@/components/order/MyOrders";
import { OrderGate } from "@/components/order/OrderGate";

export const metadata = { title: "Minhas compras", robots: { index: false } };

export default function Page() {
  return (
    <OrderGate>
      <MyOrders />
    </OrderGate>
  );
}
