"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { getProductPath } from "@/lib/seo";
import { isRealBestseller } from "@/lib/unitsSold";

export default function EmptyCartSuggestions({
    excludeIds = [],
    title = "Best Sellers You Might Love",
    subtitle = "",
    className = "w-full max-w-4xl mt-16 pt-12 border-t border-gray-100",
}) {
    const [products, setProducts] = useState([]);
    const excluded = excludeIds.join(",");

    useEffect(() => {
        const skip = new Set(excluded.split(",").filter(Boolean));
        fetch("/api/products")
            .then((res) => res.json())
            .then((data) => {
                if (!data.success) return;
                const list = (data.products || []).filter((product) => !skip.has(product.id));
                const best = list.filter((product) => isRealBestseller(product.units_sold)).slice(0, 4);
                setProducts(best);
            })
            .catch(() => {});
    }, [excluded]);

    if (!products.length) return null;

    return (
        <section className={className}>
            <h2 className="text-lg font-bold text-gray-900 mb-1 text-center">{title}</h2>
            {subtitle ? (
                <p className="text-sm text-gray-500 mb-5 text-center">{subtitle}</p>
            ) : (
                <div className="mb-6" />
            )}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {products.map((product) => (
                    <Link key={product.id} href={getProductPath(product)} className="group text-center">
                        <div className="relative aspect-square rounded-2xl overflow-hidden bg-gray-50 mb-2">
                            <Image
                                src={product.main_image || "/logo.png"}
                                alt={product.name}
                                fill
                                sizes="25vw"
                                className="object-cover group-hover:scale-105 transition-transform duration-500"
                            />
                        </div>
                        <p className="text-sm font-semibold text-gray-900 line-clamp-2">{product.name}</p>
                        <p className="text-sm font-bold text-[#E91E63] mt-1">
                            ₹{Number(product.price).toLocaleString(undefined, { maximumFractionDigits: 0 })}
                        </p>
                    </Link>
                ))}
            </div>
        </section>
    );
}
