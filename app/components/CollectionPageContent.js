import { SITE_CONTAINER } from "@/lib/siteLayout";
import CollectionHero from "./CollectionHero";
import ProductCard from "./ProductCard";
import CategoryPagination from "./CategoryPagination";
import ExploreCollections from "./ExploreCollections";
import { reviewCardProps } from "@/lib/reviewCounts";

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
    eyebrow,
}) {
    const isSmallCollection = products.length <= 4;

    const gridClass = isSmallCollection
        ? "grid grid-cols-2 md:grid-cols-4 gap-x-4 gap-y-8 sm:gap-x-5 sm:gap-y-10"
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
                eyebrow={eyebrow}
            />

            <div className="bg-gradient-to-b from-[#FAFAFA] to-white">
                <div className={`${SITE_CONTAINER} py-6 md:py-14`}>
                    {products.length > 0 ? (
                        <>
                            {!isSmallCollection && count > 0 && (
                                <p className="text-xs font-semibold text-gray-400 uppercase tracking-widest mb-6 md:mb-8">
                                    Showing {showingCount ?? products.length} of {count}
                                </p>
                            )}

                            <div className={gridClass}>
                                {products.map((product, index) => (
                                    <ProductCard
                                        key={product.id}
                                        product={product}
                                        {...reviewCardProps(reviewCounts, product.id)}
                                        hideCategory
                                        priority={index < 1}
                                        sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
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
                            <p className="text-sm text-gray-400">New pieces are on the way.</p>
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
