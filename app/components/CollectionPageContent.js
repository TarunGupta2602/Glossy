import Link from "next/link";
import Breadcrumbs from "./Breadcrumbs";
import CollectionHero from "./CollectionHero";
import ProductCard from "./ProductCard";
import CategoryPagination from "./CategoryPagination";
import ExploreCollections from "./ExploreCollections";
import { getCategoryHref } from "@/lib/categoryLanding";

export default function CollectionPageContent({
    breadcrumbs,
    heroImageUrl,
    title,
    description,
    count = 0,
    showingCount,
    products = [],
    reviewCounts = {},
    pagination,
    otherCategories = [],
}) {
    const gridClass =
        products.length <= 4
            ? "grid grid-cols-2 md:grid-cols-4 gap-x-3 gap-y-6 sm:gap-6 max-w-4xl mx-auto"
            : "grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-3 gap-y-6 sm:gap-x-5 sm:gap-y-8";

    return (
        <>
            <div className="border-b border-gray-50 bg-white">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-12 py-2.5 md:py-3">
                    <Breadcrumbs items={breadcrumbs} />
                </div>
            </div>

            <CollectionHero
                imageUrl={heroImageUrl}
                alt={title}
                title={title}
                description={description}
                count={count}
                showingCount={showingCount}
            />

            <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-12 py-6 md:py-8">
                {products.length > 0 ? (
                    <>
                        <div className={gridClass}>
                            {products.map((product) => (
                                <ProductCard
                                    key={product.id}
                                    product={product}
                                    reviewCount={reviewCounts[product.id] || 0}
                                />
                            ))}
                        </div>

                        {pagination && pagination.totalPages > 1 && (
                            <CategoryPagination
                                basePath={pagination.basePath}
                                page={pagination.page}
                                totalPages={pagination.totalPages}
                            />
                        )}
                    </>
                ) : (
                    <div className="text-center py-12 md:py-16 px-4 border border-dashed border-gray-200 rounded-2xl bg-gray-50/50">
                        <p className="text-gray-700 font-semibold mb-1">This collection is being curated</p>
                        <p className="text-sm text-gray-400 mb-6">New pieces are on the way.</p>
                        {otherCategories.length > 0 && (
                            <div className="flex flex-wrap justify-center gap-2 mb-6">
                                {otherCategories.slice(0, 5).map((cat) => (
                                    <Link
                                        key={cat.id}
                                        href={getCategoryHref(cat)}
                                        className="px-4 py-2 rounded-full border border-gray-200 text-xs font-semibold text-gray-700 hover:border-[#E91E63] hover:text-[#E91E63] transition-colors bg-white"
                                    >
                                        {cat.name}
                                    </Link>
                                ))}
                            </div>
                        )}
                        <Link
                            href="/shop"
                            className="inline-flex items-center gap-2 text-[#E91E63] font-bold text-xs uppercase tracking-widest hover:underline"
                        >
                            Browse all jewellery →
                        </Link>
                    </div>
                )}

                {otherCategories.length > 0 && products.length > 0 && (
                    <ExploreCollections categories={otherCategories} />
                )}
            </div>
        </>
    );
}
