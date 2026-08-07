import Link from "next/link";

function buildPageUrl(basePath, page, queryParams = {}) {
    const params = new URLSearchParams();

    Object.entries(queryParams).forEach(([key, value]) => {
        if (value != null && value !== "") {
            params.set(key, String(value));
        }
    });

    if (page > 1) {
        params.set("page", String(page));
    }

    const qs = params.toString();
    return qs ? `${basePath}?${qs}` : basePath;
}

function getVisiblePages(currentPage, totalPages) {
    if (totalPages <= 7) {
        return Array.from({ length: totalPages }, (_, i) => i + 1);
    }

    const pages = new Set([1, totalPages, currentPage]);

    for (let offset = -1; offset <= 1; offset += 1) {
        const page = currentPage + offset;
        if (page > 1 && page < totalPages) {
            pages.add(page);
        }
    }

    return Array.from(pages).sort((a, b) => a - b);
}

export default function CategoryPagination({ basePath, page, totalPages, queryParams = {} }) {
    if (totalPages <= 1) return null;

    const visiblePages = getVisiblePages(page, totalPages);

    return (
        <nav className="flex justify-center pt-6 md:pt-8 px-2" aria-label="Pagination">
            <ul className="inline-flex flex-wrap items-center justify-center gap-1 bg-white/90 rounded-full px-3 py-2 shadow border border-gray-100 max-w-full">
                <li>
                    <Link
                        href={buildPageUrl(basePath, page - 1, queryParams)}
                        aria-disabled={page === 1}
                        tabIndex={page === 1 ? -1 : 0}
                        className={`min-h-11 inline-flex items-center rounded-full px-3.5 py-2 text-xs sm:text-sm font-semibold transition-colors duration-200 ${page === 1 ? "text-gray-300 cursor-not-allowed pointer-events-none" : "text-[#E91E63] hover:bg-pink-50"}`}
                    >
                        Prev
                    </Link>
                </li>
                {visiblePages.map((pageNum, index) => {
                    const prevPage = visiblePages[index - 1];
                    const showEllipsis = prevPage && pageNum - prevPage > 1;

                    return (
                        <li key={pageNum} className="flex items-center gap-1">
                            {showEllipsis && (
                                <span className="px-1 text-gray-300 text-sm" aria-hidden>
                                    …
                                </span>
                            )}
                            <Link
                                href={buildPageUrl(basePath, pageNum, queryParams)}
                                aria-current={pageNum === page ? "page" : undefined}
                                className={`min-w-11 min-h-11 flex items-center justify-center rounded-full px-2.5 text-xs sm:text-sm font-semibold transition-colors duration-200 ${pageNum === page ? "bg-[#E91E63] text-white shadow" : "text-[#E91E63] hover:bg-pink-50"}`}
                            >
                                {pageNum}
                            </Link>
                        </li>
                    );
                })}
                <li>
                    <Link
                        href={buildPageUrl(basePath, page + 1, queryParams)}
                        aria-disabled={page === totalPages}
                        tabIndex={page === totalPages ? -1 : 0}
                        className={`min-h-11 inline-flex items-center rounded-full px-3.5 py-2 text-xs sm:text-sm font-semibold transition-colors duration-200 ${page === totalPages ? "text-gray-300 cursor-not-allowed pointer-events-none" : "text-[#E91E63] hover:bg-pink-50"}`}
                    >
                        Next
                    </Link>
                </li>
            </ul>
        </nav>
    );
}
