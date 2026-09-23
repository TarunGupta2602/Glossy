import Link from "next/link";
import { SITE_CONTAINER } from "@/lib/siteLayout";
import { getRelatedGroups } from "@/lib/siteInterlinks";

export default function RelatedGuides({
    page = "default",
    eyebrow = "Keep exploring",
    title = "Shop, read, and gift from here",
    className = "",
}) {
    const groups = getRelatedGroups(page);

    return (
        <section className={`border-t border-[#efeae4] bg-[#fdfbf7] ${className}`}>
            <div className={`${SITE_CONTAINER} py-10 md:py-12`}>
                <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-[#b89a6a] mb-2">
                    {eyebrow}
                </p>
                <h2 className="font-playfair text-[1.45rem] sm:text-[1.7rem] font-semibold text-[#2a2724] tracking-tight mb-6">
                    {title}
                </h2>
                <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
                    {groups.map((group) => (
                        <div key={group.title}>
                            <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-[#8a847c] mb-3">
                                {group.title}
                            </p>
                            <ul className="space-y-1.5">
                                {group.links.map((link) => (
                                    <li key={link.href}>
                                        <Link
                                            href={link.href}
                                            className="text-[14px] text-[#2a2724] hover:text-[#E91E63] transition-colors"
                                        >
                                            {link.label}
                                        </Link>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
