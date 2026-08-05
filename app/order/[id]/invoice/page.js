import OrderInvoiceClient from "./OrderInvoiceClient";

export const metadata = {
    title: "Invoice",
    robots: { index: false, follow: false },
};

export default function OrderInvoicePage() {
    return <OrderInvoiceClient />;
}
