import Link from "next/link";

/**
 * In-article interlink block — category pages + related journal posts.
 * Always shown so HTML CMS posts still pass link equity even without body links.
 */
export default function BlogKeepReading({ shopLinks = [], relatedPosts = [] }) {
    const shops = shopLinks.filter((l) => l?.href && l?.label).slice(0, 6);
    const related = relatedPosts.filter((p) => p?.slug && p?.title).slice(0, 4);

    if (shops.length === 0 && related.length === 0) return null;

    return (
        <section
            aria-labelledby="keep-reading"
            className="mt-10 md:mt-12 rounded-2xl border border-[#efeae4] bg-[#fdfbf7] p-6 md:p-8"
        >
            <p
                className="text-[11px] font-semibold uppercase tracking-[0.16em] mb-2"
                style={{ color: "#b89a6a" }}
            >
                Keep reading &amp; shopping
            </p>
            <h2
                id="keep-reading"
                className="font-playfair text-2xl md:text-[1.75rem] font-medium text-[#2a2724] tracking-tight mb-5"
            >
                Next steps on{" "}
                <em className="italic font-normal" style={{ color: "#b89a6a" }}>
                    The Luxe Jewels
                </em>
            </h2>

            {shops.length > 0 && (
                <div className="mb-6">
                    <p className="text-[12px] font-semibold uppercase tracking-[0.12em] text-[#8a847c] mb-3">
                        Shop collections
                    </p>
                    <ul className="flex flex-wrap gap-2">
                        {shops.map((link) => (
                            <li key={link.href}>
                                <Link
                                    href={link.href}
                                    className="inline-flex min-h-10 items-center rounded-full border border-[#eadfce] bg-white px-4 text-[13px] font-medium text-[#2a2724] hover:border-[#E91E63] hover:text-[#E91E63] transition-colors"
                                >
                                    {link.label}
                                </Link>
                            </li>
                        ))}
                    </ul>
                </div>
            )}

            {related.length > 0 && (
                <div>
                    <p className="text-[12px] font-semibold uppercase tracking-[0.12em] text-[#8a847c] mb-3">
                        Related journal guides
                    </p>
                    <ul className="space-y-2.5">
                        {related.map((post) => (
                            <li key={post.slug}>
                                <Link
                                    href={`/blog/${post.slug}`}
                                    className="group flex items-start justify-between gap-3 text-[15px] text-[#2a2724] hover:text-[#E91E63] transition-colors"
                                >
                                    <span className="font-medium leading-snug group-hover:underline underline-offset-4">
                                        {post.title}
                                    </span>
                                    <span className="shrink-0 text-[#d4cbc0]" aria-hidden>
                                        →
                                    </span>
                                </Link>
                            </li>
                        ))}
                    </ul>
                </div>
            )}
        </section>
    );
}
