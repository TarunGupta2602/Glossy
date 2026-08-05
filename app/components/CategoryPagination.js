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

export default function CategoryPagination({ basePath, page, totalPages, queryParams = {} }) {
    if (totalPages <= 1) return null;

    return (
        <nav className="flex justify-center pt-12" aria-label="Pagination">
            <ul className="inline-flex items-center gap-1 bg-white/80 rounded-full px-4 py-2 shadow border border-gray-100">
                <li>
                    <Link
                        href={buildPageUrl(basePath, page - 1, queryParams)}
                        aria-disabled={page === 1}
                        tabIndex={page === 1 ? -1 : 0}
                        className={`rounded-full px-3 py-2 text-sm font-semibold transition-colors duration-200 ${page === 1 ? "text-gray-300 cursor-not-allowed pointer-events-none" : "text-[#E91E63] hover:bg-pink-50"}`}
                    >
                        Prev
                    </Link>
                </li>
                {Array.from({ length: totalPages }, (_, i) => i + 1).map((n) => (
                    <li key={n}>
                        <Link
                            href={buildPageUrl(basePath, n, queryParams)}
                            aria-current={n === page ? "page" : undefined}
                            className={`rounded-full px-3 py-2 text-sm font-semibold transition-colors duration-200 ${n === page ? "bg-[#E91E63] text-white shadow" : "text-[#E91E63] hover:bg-pink-50"}`}
                        >
                            {n}
                        </Link>
                    </li>
                ))}
                <li>
                    <Link
                        href={buildPageUrl(basePath, page + 1, queryParams)}
                        aria-disabled={page === totalPages}
                        tabIndex={page === totalPages ? -1 : 0}
                        className={`rounded-full px-3 py-2 text-sm font-semibold transition-colors duration-200 ${page === totalPages ? "text-gray-300 cursor-not-allowed pointer-events-none" : "text-[#E91E63] hover:bg-pink-50"}`}
                    >
                        Next
                    </Link>
                </li>
            </ul>
        </nav>
    );
}
