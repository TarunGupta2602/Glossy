/**
 * Attach a secondary gallery image as `hover_image` for product cards.
 * Uses the first product_images row that differs from main_image.
 */
export async function attachHoverImages(supabase, products = []) {
    if (!products.length) return products;

    const ids = [...new Set(products.map((p) => p.id).filter(Boolean))];
    if (!ids.length) return products;

    const { data, error } = await supabase
        .from("product_images")
        .select("product_id, image_url")
        .in("product_id", ids)
        .limit(ids.length * 4);

    if (error || !data?.length) {
        return products.map((p) => ({ ...p, hover_image: p.hover_image || null }));
    }

    const mainById = Object.fromEntries(
        products.map((p) => [p.id, p.main_image || null])
    );
    const hoverById = {};

    for (const row of data) {
        if (!row?.product_id || !row?.image_url) continue;
        if (hoverById[row.product_id]) continue;
        if (mainById[row.product_id] && row.image_url === mainById[row.product_id]) continue;
        hoverById[row.product_id] = row.image_url;
    }

    return products.map((p) => ({
        ...p,
        hover_image: hoverById[p.id] || p.hover_image || null,
    }));
}

/** Merge hover images onto many product lists sharing one ID set */
export async function attachHoverImagesToLists(supabase, lists = []) {
    const flat = lists.flat().filter(Boolean);
    const withHover = await attachHoverImages(supabase, flat);
    const map = Object.fromEntries(withHover.map((p) => [p.id, p.hover_image]));

    return lists.map((list) =>
        (list || []).map((p) => ({ ...p, hover_image: map[p.id] || null }))
    );
}
