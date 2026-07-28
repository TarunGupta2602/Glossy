/**
 * Calculate a deterministic discount percentage based on product ID
 * This ensures the same product always shows the same discount (15-40%)
 * while varying across products to avoid looking fake.
 * 
 * @param {string} productId - The product ID to hash
 * @returns {number} - Discount percentage between 15 and 40
 */
export function calculateDiscount(productId) {
    if (!productId) return 30;
    
    // Hash the product ID to get a consistent value
    const hash = productId.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
    
    // Generate discount between 15-40% based on hash
    return (hash % 26) + 15;
}

/**
 * Calculate original price from current price and discount percentage
 * 
 * @param {number} currentPrice - The current/sale price
 * @param {number} discountPercent - The discount percentage (e.g., 30 for 30%)
 * @returns {number} - The original price before discount
 */
export function calculateOriginalPrice(currentPrice, discountPercent) {
    return Math.round(currentPrice / (1 - discountPercent / 100));
}
