/**
 * Returns discount info only when a real original_price is set in the database.
 */
export function getProductDiscountInfo(product) {
    const price = Number(product?.price) || 0;
    const originalPrice = Number(product?.original_price) || 0;

    if (!originalPrice || originalPrice <= price) {
        return { hasDiscount: false, originalPrice: null, discountPercent: null };
    }

    return {
        hasDiscount: true,
        originalPrice,
        discountPercent: Math.round(((originalPrice - price) / originalPrice) * 100),
    };
}

export function withCalculatedDiscount(product) {
    const { discountPercent } = getProductDiscountInfo(product);
    return {
        ...product,
        calculated_discount: discountPercent,
    };
}
