import Link from "next/link";
import { WHATSAPP_URL, INSTAGRAM_URL } from "@/lib/constants";

/**
 * In-article / sidebar shop CTA — cream/gold to match homepage journal UI.
 */
export default function BlogShopCta({ cta, compact = false }) {
    if (!cta?.primary?.href) return null;

    if (compact) {
        return (
            <aside className="rounded-2xl border border-[#efeae4] bg-[#fdfbf7] p-5">
                <p
                    className="text-[10px] font-medium uppercase tracking-[0.18em] mb-2"
                    style={{ color: "#b89a6a" }}
                >
                    {cta.eyebrow}
                </p>
                <h3 className="font-playfair text-[1.05rem] font-medium text-[#2a2724] leading-snug mb-2">
                    {cta.headline}
                </h3>
                <p className="text-[13px] text-[#6b6560] leading-relaxed mb-4">{cta.body}</p>
                <Link
                    href={cta.primary.href}
                    className="inline-flex w-full min-h-11 items-center justify-center rounded-full bg-[#2a2724] px-4 text-[11px] font-semibold uppercase tracking-[0.14em] text-white hover:bg-[#E91E63] transition-colors"
                >
                    {cta.primary.label}
                </Link>
                {cta.links?.length > 0 && (
                    <div className="mt-3 flex flex-wrap gap-x-3 gap-y-1">
                        {cta.links.map((link) => (
                            <Link
                                key={link.href}
                                href={link.href}
                                className="text-[11px] font-medium text-[#8a847c] hover:text-[#E91E63] transition-colors"
                            >
                                {link.label}
                            </Link>
                        ))}
                    </div>
                )}
                <div className="mt-4 pt-3 border-t border-[#efeae4] flex flex-col gap-2">
                    <a
                        href={WHATSAPP_URL}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-[11px] font-medium text-[#6b6560] hover:text-[#E91E63]"
                    >
                        Ask on WhatsApp before you buy
                    </a>
                    <a
                        href={INSTAGRAM_URL}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-[11px] font-medium text-[#6b6560] hover:text-[#E91E63]"
                    >
                        See new drops on Instagram
                    </a>
                </div>
            </aside>
        );
    }

    return (
        <section
            className="my-10 md:my-12 rounded-2xl border border-[#efeae4] bg-[#fdfbf7] p-6 sm:p-8"
            aria-label="Shop related jewellery"
        >
            <p
                className="text-[11px] font-medium uppercase tracking-[0.2em] mb-3"
                style={{ color: "#b89a6a" }}
            >
                {cta.eyebrow}
            </p>
            <h2 className="font-playfair text-2xl sm:text-[1.75rem] font-medium text-[#2a2724] tracking-tight mb-3">
                {cta.headline}
            </h2>
            <p className="text-[15px] text-[#6b6560] leading-relaxed max-w-2xl mb-6">
                {cta.body}
            </p>
            <div className="flex flex-col sm:flex-row sm:flex-wrap gap-3">
                <Link
                    href={cta.primary.href}
                    className="inline-flex min-h-11 items-center justify-center rounded-full bg-[#2a2724] px-6 text-[11px] font-semibold uppercase tracking-[0.14em] text-white hover:bg-[#E91E63] transition-colors"
                >
                    {cta.primary.label}
                </Link>
                {cta.links?.map((link) => (
                    <Link
                        key={link.href}
                        href={link.href}
                        className="inline-flex min-h-11 items-center justify-center rounded-full border border-[#2a2724]/20 px-5 text-[11px] font-semibold uppercase tracking-[0.14em] text-[#2a2724] hover:border-[#E91E63] hover:text-[#E91E63] transition-colors"
                    >
                        {link.label}
                    </Link>
                ))}
            </div>
        </section>
    );
}
