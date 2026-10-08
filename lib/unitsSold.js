import { getServiceClient } from "@/lib/supabaseServiceClient";

/** Paid units before a card may say Bestseller. The admin flag is not enough. */
export const BESTSELLER_MIN_UNITS = 3;

export function isRealBestseller(unitsSold) {
    return Number(unitsSold) >= BESTSELLER_MIN_UNITS;
}

/**
 * Units sold from real orders. Free gifts and cancelled orders are skipped.
 * Missing order_status still counts, so older rows are not ignored.
 */
export async function getUnitsSoldMap(supabase = getServiceClient()) {
    const { data, error } = await supabase
        .from("orders")
        .select("items, order_status")
        .or("order_status.is.null,order_status.neq.cancelled");

    if (error) {
        console.error("Units sold query failed:", error);
        return {};
    }

    const counts = {};
    for (const order of data || []) {
        const items = Array.isArray(order.items) ? order.items : [];
        for (const item of items) {
            if (!item || item.isFreeGift || Number(item.price) === 0) continue;
            const id = item.id || item.productId;
            if (!id) continue;
            const qty = Math.max(1, Number(item.quantity) || 1);
            counts[id] = (counts[id] || 0) + qty;
        }
    }
    return counts;
}
