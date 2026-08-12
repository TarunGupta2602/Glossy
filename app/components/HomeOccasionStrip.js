import Link from "next/link";
import { HOME_CONTAINER, HOME_EDGE_SCROLL } from "@/lib/siteLayout";

const OCCASIONS = [
    { label: "Daily wear", href: "/shop?sort=popular", hint: "Everyday shine" },
    { label: "Office", href: "/blog/office-wear-jewellery-india-anti-tarnish", hint: "Subtle polish" },
    { label: "Gifts ₹499", href: "/gifts/under-499", hint: "Light & lovely" },
    { label: "Gifts ₹999", href: "/gifts/under-999", hint: "Ready to wrap" },
    { label: "Festive", href: "/necklaces", hint: "Layer & glow" },
];

export default function HomeOccasionStrip() {
    return (
        <section className="py-5 md:py-7 border-b border-gray-100 bg-white">
            <div className={HOME_CONTAINER}>
                <div className="flex items-center justify-between gap-3 mb-3 md:mb-4">
                    <p className="text-[10px] sm:text-[11px] font-semibold tracking-[0.18em] uppercase text-gray-500">
                        Shop by occasion
                    </p>
                    <Link
                        href="/shop"
                        className="text-[10px] sm:text-[11px] font-semibold tracking-[0.14em] uppercase text-[#E91E63] hover:text-[#c2185b] transition-colors"
                    >
                        All jewellery
                    </Link>
                </div>

                <div className={`flex gap-2 sm:gap-2.5 overflow-x-auto no-scrollbar ${HOME_EDGE_SCROLL} pb-0.5`}>
                    {OCCASIONS.map((item) => (
                        <Link
                            key={item.label}
                            href={item.href}
                            className="group shrink-0 inline-flex flex-col justify-center min-h-11 rounded-full border border-gray-200 bg-[#faf7f8] px-4 sm:px-5 py-2.5 transition-all duration-200 hover:border-[#E91E63]/40 hover:bg-[#fdf2f6] active:scale-[0.98]"
                        >
                            <span className="text-[12px] sm:text-[13px] font-semibold text-gray-900 group-hover:text-[#E91E63] transition-colors">
                                {item.label}
                            </span>
                            <span className="text-[10px] text-gray-400 tracking-wide">{item.hint}</span>
                        </Link>
                    ))}
                </div>
            </div>
        </section>
    );
}
