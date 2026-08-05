import { BRAND_URL } from "@/lib/constants";
import { getProductPath } from "@/lib/seo";
import { PAGE_SIZE } from "@/lib/shopQueries";

export function buildShopItemListSchema({ products, totalCount, page = 1, listName = "Shop All Fine Jewellery" }) {
    return {
        "@context": "https://schema.org",
        "@type": "ItemList",
        name: listName,
        numberOfItems: totalCount,
        itemListElement: products.map((product, index) => ({
            "@type": "ListItem",
            position: (page - 1) * PAGE_SIZE + index + 1,
            item: {
                "@type": "Product",
                name: product.name,
                url: `${BRAND_URL}${getProductPath(product)}`,
                image: product.main_image || `${BRAND_URL}/logo.png`,
                offers: {
                    "@type": "Offer",
                    price: product.price,
                    priceCurrency: "INR",
                    availability: product.stock_count === 0
                        ? "https://schema.org/OutOfStock"
                        : "https://schema.org/InStock",
                },
            },
        })),
    };
}
