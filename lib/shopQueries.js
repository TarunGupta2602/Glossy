import { getServiceClient } from "@/lib/supabaseServiceClient";
import { PRODUCT_CARD_SELECT } from "@/lib/productQueries";

const PAGE_SIZE = 12;

export { PAGE_SIZE };

export async function fetchShopProducts({
    page = 1,
    sort = "newest",
    categoryIds = [],
    minPrice = 0,
    maxPrice = 5000,
}) {
    const supabase = getServiceClient();
    const safePage = Math.max(1, page);
    const from = (safePage - 1) * PAGE_SIZE;
    const to = from + PAGE_SIZE - 1;

    let query = supabase
        .from("products")
        .select(PRODUCT_CARD_SELECT, { count: "exact" })
        .gte("price", minPrice)
        .lte("price", maxPrice);

    if (categoryIds.length > 0) {
        query = query.in("category_id", categoryIds);
    }

    switch (sort) {
        case "price-asc":
            query = query.order("price", { ascending: true });
            break;
        case "price-desc":
            query = query.order("price", { ascending: false });
            break;
        case "name":
            query = query.order("name", { ascending: true });
            break;
        case "popular":
            query = query
                .order("is_bestseller", { ascending: false, nullsFirst: false })
                .order("created_at", { ascending: false });
            break;
        default:
            query = query.order("created_at", { ascending: false });
    }

    const { data, count, error } = await query.range(from, to);

    if (error) {
        console.error("Shop query failed:", error);
        return { products: [], totalCount: 0, totalPages: 0, page: safePage };
    }

    const totalCount = count || 0;
    const totalPages = Math.max(1, Math.ceil(totalCount / PAGE_SIZE));

    return {
        products: data || [],
        totalCount,
        totalPages,
        page: safePage,
    };
}

export async function searchProducts(term, { page = 1 } = {}) {
    const supabase = getServiceClient();
    const query = term.trim();
    if (!query) {
        return { products: [], totalCount: 0, totalPages: 0, page: 1 };
    }

    const { data: matchingCategories } = await supabase
        .from("categories")
        .select("id")
        .ilike("name", `%${query}%`)
        .limit(20);

    const categoryIds = (matchingCategories || []).map((c) => c.id);
    // Fetch a bounded window — enough for a few pages without loading the whole catalog
    const fetchLimit = Math.min(PAGE_SIZE * 5, 60);

    const textFilter = `name.ilike.%${query}%,description.ilike.%${query}%,meta_keywords.ilike.%${query}%,meta_title.ilike.%${query}%`;

    const [textResults, categoryResults] = await Promise.all([
        supabase
            .from("products")
            .select(PRODUCT_CARD_SELECT)
            .or(textFilter)
            .order("created_at", { ascending: false })
            .limit(fetchLimit),
        categoryIds.length
            ? supabase
                  .from("products")
                  .select(PRODUCT_CARD_SELECT)
                  .in("category_id", categoryIds)
                  .order("created_at", { ascending: false })
                  .limit(fetchLimit)
            : Promise.resolve({ data: [] }),
    ]);

    const merged = new Map();
    [...(textResults.data || []), ...(categoryResults.data || [])].forEach((product) => {
        merged.set(product.id, product);
    });

    const allProducts = Array.from(merged.values()).sort(
        (a, b) => new Date(b.created_at) - new Date(a.created_at)
    );

    const totalCount = allProducts.length;
    const totalPages = Math.max(1, Math.ceil(totalCount / PAGE_SIZE));
    const safePage = Math.min(Math.max(1, page), totalPages);
    const from = (safePage - 1) * PAGE_SIZE;
    const products = allProducts.slice(from, from + PAGE_SIZE);

    return {
        products,
        totalCount,
        totalPages,
        page: safePage,
    };
}
