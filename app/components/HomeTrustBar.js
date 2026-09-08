import { PROMO_LABEL } from "@/lib/promo";

const ITEMS = [
    "Waterproof & anti-tarnish",
    "Perfect gifts for her",
    "Free shipping over ₹1000",
    PROMO_LABEL,
];

export default function HomeTrustBar() {
    return (
        <section className="bg-[#1a1214] text-white">
            <div className="mx-auto max-w-[1600px] px-4 sm:px-6">
                <ul className="flex items-center justify-center gap-x-6 sm:gap-x-10 overflow-x-auto no-scrollbar py-2.5 text-[11px] tracking-wide whitespace-nowrap text-white/85">
                    {ITEMS.map((item, i) => (
                        <li key={item} className="flex items-center gap-6 sm:gap-10 shrink-0">
                            {i > 0 && <span className="text-white/25" aria-hidden>·</span>}
                            <span className={i === ITEMS.length - 1 ? "text-[#E8C9A0]" : undefined}>
                                {item}
                            </span>
                        </li>
                    ))}
                </ul>
            </div>
        </section>
    );
}
