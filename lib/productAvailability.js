/** Schema.org availability from product stock_count. */
export function getProductAvailability(product) {
    if (product?.stock_count != null && product.stock_count <= 0) {
        return "https://schema.org/OutOfStock";
    }
    return "https://schema.org/InStock";
}
