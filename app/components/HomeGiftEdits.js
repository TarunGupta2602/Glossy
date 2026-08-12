import Link from "next/link";
import { HOME_CONTAINER } from "@/lib/siteLayout";

/**
 * Light gift discovery strip — keeps budget gift landing pages findable for shoppers + SEO.
 */
export default function HomeGiftEdits() {
    return (
        <section className="border-b border-gray-100 bg-white">
            <div className={`${HOME_CONTAINER} py-4 md:py-5`}>
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                    <div>
                        <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-[#E91E63] mb-0.5">
                            Gift edits
                        </p>
                        <p className="text-[14px] text-gray-600">
                            Budget-friendly anti-tarnish picks for easy gifting
                        </p>
                    </div>
                    <div className="flex flex-wrap gap-2">
                        <Link
                            href="/gifts/under-499"
                            className="inline-flex min-h-10 items-center rounded-full border border-gray-200 bg-[#faf7f8] px-4 text-[12px] font-semibold text-gray-900 hover:border-[#E91E63] hover:text-[#E91E63] transition-colors"
                        >
                            Gifts under ₹499
                        </Link>
                        <Link
                            href="/gifts/under-999"
                            className="inline-flex min-h-10 items-center rounded-full bg-[#E91E63] px-4 text-[12px] font-semibold text-white hover:bg-[#c2185b] transition-colors"
                        >
                            Gifts under ₹999
                        </Link>
                    </div>
                </div>
            </div>
        </section>
    );
}
