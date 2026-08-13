import Link from "next/link";

/**
 * In-article / sidebar shop CTA for blog posts — pushes gift & category landings.
 */
export default function BlogShopCta({ cta, compact = false }) {
    if (!cta?.primary?.href) return null;

    if (compact) {
        return (
            <aside className="rounded-2xl border border-pink-100 bg-[#fdf2f6] p-5 shadow-sm">
                <p className="text-[10px] font-black uppercase tracking-[0.18em] text-[#E91E63] mb-2">
                    {cta.eyebrow}
                </p>
                <h3 className="text-base font-black text-slate-900 leading-snug mb-2">
                    {cta.headline}
                </h3>
                <p className="text-sm text-slate-600 leading-relaxed mb-4">{cta.body}</p>
                <Link
                    href={cta.primary.href}
                    className="inline-flex w-full min-h-11 items-center justify-center rounded-full bg-[#E91E63] px-4 text-xs font-bold uppercase tracking-widest text-white hover:bg-[#c2185b] transition-colors"
                >
                    {cta.primary.label}
                </Link>
                {cta.links?.length > 0 && (
                    <div className="mt-3 flex flex-wrap gap-x-3 gap-y-1">
                        {cta.links.map((link) => (
                            <Link
                                key={link.href}
                                href={link.href}
                                className="text-[11px] font-semibold text-[#E91E63] hover:underline"
                            >
                                {link.label}
                            </Link>
                        ))}
                    </div>
                )}
            </aside>
        );
    }

    return (
        <section
            className="my-10 md:my-12 rounded-3xl border border-pink-100 bg-[#fdf2f6] p-6 sm:p-8"
            aria-label="Shop related jewellery"
        >
            <p className="text-[10px] font-black uppercase tracking-[0.2em] text-[#E91E63] mb-2">
                {cta.eyebrow}
            </p>
            <h2 className="font-playfair text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight mb-3">
                {cta.headline}
            </h2>
            <p className="text-[15px] text-slate-600 leading-relaxed max-w-2xl mb-5">
                {cta.body}
            </p>
            <div className="flex flex-col sm:flex-row sm:flex-wrap gap-3">
                <Link
                    href={cta.primary.href}
                    className="inline-flex min-h-11 items-center justify-center rounded-full bg-[#E91E63] px-6 text-xs font-bold uppercase tracking-widest text-white hover:bg-[#c2185b] transition-colors"
                >
                    {cta.primary.label}
                </Link>
                {cta.links?.map((link) => (
                    <Link
                        key={link.href}
                        href={link.href}
                        className="inline-flex min-h-11 items-center justify-center rounded-full border border-slate-200 bg-white px-5 text-xs font-bold uppercase tracking-widest text-slate-800 hover:border-[#E91E63] hover:text-[#E91E63] transition-colors"
                    >
                        {link.label}
                    </Link>
                ))}
            </div>
        </section>
    );
}
