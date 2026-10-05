import { unstable_cache } from "next/cache";
import { getServiceClient } from "@/lib/supabaseServiceClient";
import { PRODUCT_CARD_SELECT } from "@/lib/productQueries";
import { withCalculatedDiscount } from "@/lib/discountUtils";
import { getReviewCounts } from "@/lib/reviewCounts";
import { attachHoverImages } from "@/lib/hoverImages";
import { STOREFRONT_CACHE_TAG } from "@/lib/cacheTags";

const PAGE_SIZE = 12;

async function fetchStorefrontCatalog() {
    const supabase = getServiceClient();
    const [{ data: categories }, { data: products }] = await Promise.all([
        supabase.from("categories").select("id, name, slug, image_url, description"),
        supabase
            .from("products")
            .select(PRODUCT_CARD_SELECT)
            .order("created_at", { ascending: false }),
    ]);

    const discounted = (products || []).map(withCalculatedDiscount);
    const [withHover, reviewCounts] = await Promise.all([
        attachHoverImages(supabase, discounted),
        getReviewCounts(discounted.map((product) => product.id)),
    ]);

    return {
        categories: categories || [],
        products: withHover,
        reviewCounts,
    };
}

/** Full card catalogue, shared by shop, category pages, and the homepage. */
export const getStorefrontCatalog = unstable_cache(
    fetchStorefrontCatalog,
    ["storefront-catalog"],
    { revalidate: 300, tags: [STOREFRONT_CACHE_TAG] }
);

export function reviewCountsFor(allCounts = {}, products = []) {
    const picked = {};
    for (const product of products) {
        if (!product?.id) continue;
        picked[product.id] = allCounts[product.id] || { count: 0, average: 0 };
    }
    return picked;
}

export function sliceMatchedProducts(products = [], predicate, page = 1, pageSize = PAGE_SIZE) {
    const matched = products.filter(predicate);
    const count = matched.length;
    const totalPages = Math.max(1, Math.ceil(count / pageSize) || 1);
    const safePage = Math.max(1, page);
    const start = (safePage - 1) * pageSize;
    return {
        products: matched.slice(start, start + pageSize),
        count,
        totalPages,
        page: safePage,
    };
}

export function sliceShopProducts(
    products = [],
    { page = 1, sort = "newest", categoryIds = [], minPrice = 0, maxPrice = 5000, pageSize = PAGE_SIZE } = {}
) {
    let list = products.filter((product) => {
        const price = Number(product.price) || 0;
        if (price < minPrice || price > maxPrice) return false;
        if (categoryIds.length > 0 && !categoryIds.includes(product.category_id)) return false;
        return true;
    });

    list = [...list];
    switch (sort) {
        case "price-asc":
            list.sort((a, b) => (Number(a.price) || 0) - (Number(b.price) || 0));
            break;
        case "price-desc":
            list.sort((a, b) => (Number(b.price) || 0) - (Number(a.price) || 0));
            break;
        case "name":
            list.sort((a, b) => String(a.name || "").localeCompare(String(b.name || "")));
            break;
        case "popular":
            list.sort((a, b) => {
                const best = Number(Boolean(b.is_bestseller)) - Number(Boolean(a.is_bestseller));
                if (best) return best;
                return new Date(b.created_at) - new Date(a.created_at);
            });
            break;
        default:
            list.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
    }

    return sliceMatchedProducts(list, () => true, page, pageSize);
}
