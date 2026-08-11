import Image from "next/image";
import Link from "next/link";
import { HOME_CONTAINER } from "@/lib/siteLayout";

export default function ShopByIntent({ intents = [] }) {
    if (!intents.length) return null;

    return (
        <section className="py-8 md:py-12 bg-white">
            <div className={HOME_CONTAINER}>
                <div className="flex items-end justify-between gap-4 mb-5 md:mb-7">
                    <div>
                        <div className="flex items-center gap-3 mb-2">
                            <div className="h-px w-8 bg-[#E91E63]" />
                            <span className="text-[10px] font-black tracking-wider text-[#E91E63] uppercase">
                                Start here
                            </span>
                        </div>
                        <h2 className="text-2xl sm:text-3xl md:text-4xl font-playfair font-bold text-gray-900 tracking-tight">
                            Shop by intent
                        </h2>
                    </div>
                    <Link
                        href="/shop"
                        className="hidden sm:inline text-[11px] font-black tracking-wide uppercase text-gray-600 hover:text-[#E91E63] transition-colors"
                    >
                        Shop all
                    </Link>
                </div>

                <div className="grid grid-cols-2 lg:grid-cols-4 gap-2.5 sm:gap-4">
                    {intents.map((intent, index) => (
                        <Link
                            key={intent.href}
                            href={intent.href}
                            className="group relative aspect-[3/4] sm:aspect-[4/5] overflow-hidden bg-[#1a1214]"
                        >
                            <Image
                                src={intent.image || "/logo.png"}
                                alt={intent.label}
                                fill
                                sizes="(max-width: 1024px) 50vw, 25vw"
                                quality={75}
                                className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                                priority={index < 2}
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/25 to-black/5" />
                            <div className="absolute inset-0 flex flex-col justify-end p-3.5 sm:p-5">
                                <span className="text-[9px] sm:text-[10px] font-semibold tracking-[0.22em] uppercase text-white/55 mb-1.5">
                                    {String(index + 1).padStart(2, "0")}
                                </span>
                                <span className="font-playfair text-xl sm:text-2xl md:text-[1.65rem] font-bold text-white leading-tight mb-1">
                                    {intent.label}
                                </span>
                                <span className="text-[11px] sm:text-xs text-white/70 mb-3">
                                    {intent.hint}
                                </span>
                                <span className="inline-flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.16em] text-white">
                                    Shop
                                    <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        width="14"
                                        height="14"
                                        viewBox="0 0 24 24"
                                        fill="none"
                                        stroke="currentColor"
                                        strokeWidth="2.5"
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        className="transform group-hover:translate-x-1 transition-transform duration-300"
                                        aria-hidden="true"
                                    >
                                        <path d="M5 12h14m-7-7 7 7-7 7" />
                                    </svg>
                                </span>
                            </div>
                        </Link>
                    ))}
                </div>
            </div>
        </section>
    );
}
