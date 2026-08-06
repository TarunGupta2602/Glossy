import Link from "next/link";
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
    const isSmallCollection = products.length <= 4;

    const gridClass = isSmallCollection
        ? "grid grid-cols-2 md:grid-cols-4 gap-x-4 gap-y-8 sm:gap-x-5 sm:gap-y-10 max-w-[1080px] mx-auto"
        : "grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-3 gap-y-7 sm:gap-x-5 sm:gap-y-9";

    return (
        <>
            <CollectionHero
                imageUrl={heroImageUrl}
                alt={title}
                title={title}
                description={description}
                count={count}
                showingCount={showingCount}
                breadcrumbs={breadcrumbs}
            />

            <div className="bg-gradient-to-b from-[#FAFAFA] to-white">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-12 py-10 md:py-14">
                    {products.length > 0 ? (
                        <>
                            {!isSmallCollection && count > 0 && (
                                <p className="text-xs font-semibold text-gray-400 uppercase tracking-widest mb-6 md:mb-8">
                                    Showing {showingCount ?? products.length} of {count}
                                </p>
                            )}

                            <div className={gridClass}>
                                {products.map((product) => (
                                    <ProductCard
                                        key={product.id}
                                        product={product}
                                        reviewCount={reviewCounts[product.id] || 0}
                                        hideCategory
                                    />
                                ))}
                            </div>

                            {pagination && pagination.totalPages > 1 && (
                                <div className="mt-10 md:mt-12">
                                    <CategoryPagination
                                        basePath={pagination.basePath}
                                        page={pagination.page}
                                        totalPages={pagination.totalPages}
                                    />
                                </div>
                            )}
                        </>
                    ) : (
                        <div className="text-center py-12 md:py-16 px-4 border border-dashed border-gray-200 rounded-2xl bg-white">
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
            </div>
        </>
    );
}
