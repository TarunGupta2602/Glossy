import OrderConfirmationClient from "./OrderConfirmationClient";

export const metadata = {
    title: "Order Confirmation",
    robots: { index: false, follow: false },
};

export default function OrderConfirmationPage() {
    return <OrderConfirmationClient />;
}
