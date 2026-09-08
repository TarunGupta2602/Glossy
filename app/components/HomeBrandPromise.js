import Link from "next/link";
import { HOME_CONTAINER } from "@/lib/siteLayout";

const PILLARS = [
    { title: "Waterproof", body: "Made for real days — coffee, humidity, and all." },
    { title: "Anti-tarnish", body: "18k gold plated finishes that stay brighter longer." },
    { title: "Everyday wear", body: "Lightweight pieces that never stay in the box." },
];

export default function HomeBrandPromise() {
    return (
        <section className="bg-[#fafafa] py-16 md:py-24">
            <div className={`${HOME_CONTAINER} text-center`}>
                <p className="text-[11px] font-medium tracking-[0.2em] uppercase text-gray-400 mb-4">
                    Built for real life
                </p>
                <h2 className="font-playfair text-3xl sm:text-4xl md:text-5xl font-medium text-gray-900 tracking-tight leading-[1.12] max-w-2xl mx-auto mb-4">
                    Jewellery that keeps up{" "}
                    <em className="italic font-normal">with you</em>
                </h2>
                <p className="text-[15px] text-gray-500 max-w-md mx-auto leading-relaxed mb-12 md:mb-14">
                    Because your favourite jewellery shouldn&apos;t stay tucked away.
                </p>

                <div className="grid sm:grid-cols-3 gap-10 sm:gap-8 max-w-4xl mx-auto text-left sm:text-center">
                    {PILLARS.map((item) => (
                        <div key={item.title}>
                            <p className="text-[11px] font-semibold tracking-[0.16em] uppercase text-gray-900 mb-2">
                                ✦ {item.title}
                            </p>
                            <p className="text-[14px] text-gray-500 leading-relaxed">{item.body}</p>
                        </div>
                    ))}
                </div>

                <div className="mt-12 md:mt-14">
                    <Link
                        href="/shop"
                        className="inline-flex min-h-12 items-center text-[11px] font-semibold uppercase tracking-[0.16em] text-gray-900 border-b border-gray-900 hover:text-[#E91E63] hover:border-[#E91E63] transition-colors"
                    >
                        Shop the edit
                    </Link>
                </div>
            </div>
        </section>
    );
}
