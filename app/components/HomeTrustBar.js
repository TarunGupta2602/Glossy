import { HOME_CONTAINER, HOME_EDGE_SCROLL } from "@/lib/siteLayout";
import { PROMO_LABEL, PROMO_SHORT } from "@/lib/promo";
import TrustStrip from "./TrustStrip";

export default function HomeTrustBar() {
    return (
        <section className="border-b border-gray-100 bg-[#faf7f8]">
            <div className={`${HOME_CONTAINER} py-3.5 md:py-6`}>
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3 md:gap-4">
                    <div className={`${HOME_EDGE_SCROLL} overflow-x-auto no-scrollbar md:overflow-visible`}>
                        <TrustStrip className="justify-start md:justify-start whitespace-nowrap w-max md:w-auto md:whitespace-normal md:flex-wrap" />
                    </div>
                    <p className="text-center md:text-right text-[11px] sm:text-[13px] text-gray-700 leading-snug md:max-w-md">
                        <span className="font-bold text-[#E91E63]">{PROMO_LABEL}</span>
                        <span className="hidden sm:inline text-gray-600"> — {PROMO_SHORT}</span>
                        <span className="sm:hidden text-gray-600"> — unlock a free gift</span>
                    </p>
                </div>
            </div>
        </section>
    );
}
