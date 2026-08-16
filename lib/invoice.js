import {
    FREE_SHIPPING_THRESHOLD,
    PAID_SHIPPING_FEE,
} from "@/lib/promo";

/** Human-readable invoice number from order record. */
export function getInvoiceNumber(order) {
    if (order?.razorpay_payment_id) {
        return `TLJ-${String(order.razorpay_payment_id).slice(-8).toUpperCase()}`;
    }
    if (order?.id) {
        return `TLJ-${String(order.id).slice(0, 8).toUpperCase()}`;
    }
    return "TLJ-INVOICE";
}

export function formatInr(amount) {
    return `₹${Number(amount || 0).toLocaleString("en-IN", {
        maximumFractionDigits: 0,
    })}`;
}

export function getInvoiceTotals(order) {
    const items = order?.items || [];
    const paidItems = items.filter((item) => !item.isFreeGift);
    const subtotal = paidItems.reduce(
        (sum, item) =>
            sum + Number(item.price || 0) * Number(item.quantity || 1),
        0
    );
    const total = Number(order?.total_amount || 0);
    const shipping =
        subtotal >= FREE_SHIPPING_THRESHOLD ? 0 : PAID_SHIPPING_FEE;
    const giftSavings = items
        .filter((item) => item.isFreeGift)
        .reduce(
            (sum, item) =>
                sum +
                Number(item.originalPrice || 0) * Number(item.quantity || 1),
            0
        );

    return { subtotal, discount: giftSavings, shipping, total };
}
