/**
 * Renders optional long-form CMS sections for blog posts.
 * Empty sections are omitted on the public page (fill via admin BlogForm).
 */
export default function BlogContentSections({
    whyThisMatters,
    comparisonTable,
    tipsMistakes,
}) {
    const hasWhy = typeof whyThisMatters === "string" && whyThisMatters.trim().length > 0;
    const hasComparison =
        comparisonTable &&
        Array.isArray(comparisonTable.headers) &&
        comparisonTable.headers.length > 0 &&
        Array.isArray(comparisonTable.rows) &&
        comparisonTable.rows.length > 0;
    const tips = Array.isArray(tipsMistakes)
        ? tipsMistakes.filter((t) => t?.title?.trim() && t?.body?.trim())
        : [];

    if (!hasWhy && !hasComparison && tips.length === 0) return null;

    return (
        <div className="space-y-12 md:space-y-16 pt-4">
            {hasWhy && (
                <section aria-labelledby="why-this-matters">
                    <p
                        className="text-[11px] font-medium tracking-[0.2em] uppercase mb-3"
                        style={{ color: "#b89a6a" }}
                    >
                        Context
                    </p>
                    <h2
                        id="why-this-matters"
                        className="font-playfair text-2xl md:text-3xl font-medium text-[#2a2724] tracking-tight mb-4"
                    >
                        Why this{" "}
                        <em className="italic font-normal" style={{ color: "#b89a6a" }}>
                            matters
                        </em>
                    </h2>
                    <div className="text-[15px] sm:text-[16px] text-[#6b6560] leading-relaxed whitespace-pre-line max-w-2xl">
                        {whyThisMatters.trim()}
                    </div>
                </section>
            )}

            {hasComparison && (
                <section aria-labelledby="quick-reference">
                    <p
                        className="text-[11px] font-medium tracking-[0.2em] uppercase mb-3"
                        style={{ color: "#b89a6a" }}
                    >
                        Quick reference
                    </p>
                    <h2
                        id="quick-reference"
                        className="font-playfair text-2xl md:text-3xl font-medium text-[#2a2724] tracking-tight mb-5"
                    >
                        Compare at a glance
                    </h2>
                    <div className="overflow-x-auto rounded-2xl border border-[#efeae4]">
                        <table className="min-w-full text-left text-[13px] sm:text-[14px]">
                            <thead className="bg-[#fdfbf7]">
                                <tr>
                                    {comparisonTable.headers.map((header) => (
                                        <th
                                            key={header}
                                            className="px-4 py-3 font-semibold text-[#2a2724] tracking-wide whitespace-nowrap"
                                        >
                                            {header}
                                        </th>
                                    ))}
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-[#efeae4]">
                                {comparisonTable.rows.map((row, i) => (
                                    <tr key={i} className="bg-white">
                                        {(Array.isArray(row) ? row : []).map((cell, j) => (
                                            <td
                                                key={j}
                                                className="px-4 py-3 text-[#6b6560] align-top"
                                            >
                                                {cell}
                                            </td>
                                        ))}
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </section>
            )}

            {tips.length > 0 && (
                <section aria-labelledby="tips-mistakes">
                    <p
                        className="text-[11px] font-medium tracking-[0.2em] uppercase mb-3"
                        style={{ color: "#b89a6a" }}
                    >
                        Practical
                    </p>
                    <h2
                        id="tips-mistakes"
                        className="font-playfair text-2xl md:text-3xl font-medium text-[#2a2724] tracking-tight mb-5"
                    >
                        Tips &amp;{" "}
                        <em className="italic font-normal" style={{ color: "#b89a6a" }}>
                            mistakes to avoid
                        </em>
                    </h2>
                    <ul className="space-y-4">
                        {tips.map((tip, i) => (
                            <li
                                key={i}
                                className="rounded-2xl border border-[#efeae4] bg-[#fdfbf7] px-5 py-4"
                            >
                                <p className="font-medium text-[#2a2724] mb-1.5">{tip.title}</p>
                                <p className="text-[14px] text-[#6b6560] leading-relaxed">
                                    {tip.body}
                                </p>
                            </li>
                        ))}
                    </ul>
                </section>
            )}
        </div>
    );
}
