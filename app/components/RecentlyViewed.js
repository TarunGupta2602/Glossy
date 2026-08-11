"use client";

import { useEffect, useState } from "react";
import { readRecentlyViewed } from "@/lib/recentlyViewed";
import ProductRow from "./ProductRow";

export default function RecentlyViewed() {
    const [products, setProducts] = useState([]);

    useEffect(() => {
        setProducts(readRecentlyViewed());
    }, []);

    if (!products.length) return null;

    return (
        <ProductRow
            title="Recently viewed"
            eyebrow="Pick up where you left off"
            products={products}
            viewAllLink="/shop"
            accent="pink"
        />
    );
}
