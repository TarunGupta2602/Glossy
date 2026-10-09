import { SITE_CONTAINER } from "@/lib/siteLayout";
import Link from "next/link";
import CollectionHero from "./CollectionHero";
import ProductCard from "./ProductCard";
import CategoryPagination from "./CategoryPagination";
import ExploreCollections from "./ExploreCollections";
import { reviewCardProps } from "@/lib/reviewCounts";
import { isProductOutOfStock } from "@/lib/productAvailability";

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
    const available = products.filter((product) => !isProductOutOfStock(product));
    const soldOut = products.filter((product) => isProductOutOfStock(product));
    const isSmallCollection = available.length > 0 && available.length <= 4;

    const gridClass = isSmallCollection
        ? "grid grid-cols-2 md:grid-cols-4 gap-x-4 gap-y-8 sm:gap-x-5 sm:gap-y-10"
        : "grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-3 gap-y-7 sm:gap-x-5 sm:gap-y-9";

    const renderCards = (list, startIndex = 0) =>
        list.map((product, index) => (
            <ProductCard
                key={product.id}
                product={product}
                {...reviewCardProps(reviewCounts, product.id)}
                hideCategory
                priority={startIndex + index < 1}
                sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
            />
        ));

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

                            {available.length > 0 ? (
                                <div className={gridClass}>{renderCards(available)}</div>
                            ) : (
                                <div className="mb-8 rounded-2xl border border-[#efeae4] bg-white px-5 py-6">
                                    <p className="font-playfair text-xl text-[#2a2724]">
                                        These pieces are sold out
                                    </p>
                                    <p className="mt-2 text-sm text-[#6b6560] max-w-lg">
                                        <Link href="/earrings" className="underline underline-offset-2">Earrings</Link>
                                        {" "}and{" "}
                                        <Link href="/necklaces" className="underline underline-offset-2">necklaces</Link>
                                        {" "}that are in stock are ready to order.
                                    </p>
                                </div>
                            )}

                            {soldOut.length > 0 && (
                                <div className={available.length > 0 ? "mt-12 md:mt-16" : ""}>
                                    <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-[#8a847c] mb-5">
                                        Sold out for now
                                    </p>
                                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-3 gap-y-7 sm:gap-x-5 sm:gap-y-9 opacity-80">
                                        {renderCards(soldOut, available.length)}
                                    </div>
                                </div>
                            )}

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
