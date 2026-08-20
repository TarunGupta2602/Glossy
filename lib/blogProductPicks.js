/**
 * Pull a few live products for blog → shop conversion blocks.
 */
export async function getBlogProductPicks(supabase, pickMode = "popular", limit = 4) {
    const { data, error } = await supabase
        .from("products")
        .select(
            "id, name, price, main_image, hover_image, slug, stock_count, categories ( name, slug )"
        )
        .order("created_at", { ascending: false })
        .limit(48);

    if (error || !data?.length) return [];

    const inStock = data.filter(
        (p) => p.stock_count == null || Number(p.stock_count) > 0
    );
    const pool = inStock.length ? inStock : data;

    const nameOf = (p) =>
        `${p.name || ""} ${p.categories?.name || ""}`.toLowerCase();

    let filtered = pool;
    switch (pickMode) {
        case "gift499":
            filtered = pool.filter((p) => Number(p.price) <= 499);
            break;
        case "gift999":
            filtered = pool.filter((p) => Number(p.price) <= 999);
            break;
        case "earrings":
            filtered = pool.filter((p) => /earring|stud|hoop|drop/.test(nameOf(p)));
            break;
        case "bracelet":
            filtered = pool.filter((p) =>
                /bracelet|bangle|ring|set/.test(nameOf(p))
            );
            break;
        case "necklace":
            filtered = pool.filter((p) =>
                /necklace|chain|choker|pendant/.test(nameOf(p))
            );
            break;
        default:
            filtered = [...pool].sort(
                (a, b) => Number(a.price || 0) - Number(b.price || 0)
            );
            break;
    }

    if (filtered.length < limit) {
        const ids = new Set(filtered.map((p) => p.id));
        for (const p of pool) {
            if (ids.has(p.id)) continue;
            filtered.push(p);
            if (filtered.length >= limit) break;
        }
    }

    return filtered.slice(0, limit);
}
