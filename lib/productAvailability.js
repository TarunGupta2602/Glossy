/** In-stock pieces first. Sold-out pieces stay visible, after the ones that can be ordered. */
export function sortInStockFirst(products = []) {
    return [...products].sort((a, b) => {
        const aOut = isProductOutOfStock(a) ? 1 : 0;
        const bOut = isProductOutOfStock(b) ? 1 : 0;
        return aOut - bOut;
    });
}

/** Null stock_count means unlimited / not tracked — treat as in stock. */
export function isProductOutOfStock(product) {
    return product?.stock_count != null && Number(product.stock_count) <= 0;
}

/** Schema.org availability from product stock_count. */
export function getProductAvailability(product) {
    if (isProductOutOfStock(product)) {
        return "https://schema.org/OutOfStock";
    }
    return "https://schema.org/InStock";
}
