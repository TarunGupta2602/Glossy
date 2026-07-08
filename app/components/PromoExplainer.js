import { PROMO_DETAIL, PROMO_LABEL, PROMO_SHORT } from "@/lib/promo";

export default function PromoExplainer({ variant = "card" }) {
    if (variant === "inline") {
        return (
            <p className="text-xs text-gray-600 leading-relaxed">
                <span className="font-bold text-[#E91E63]">{PROMO_LABEL}:</span>{" "}
                {PROMO_SHORT}. {PROMO_DETAIL}
            </p>
        );
    }

    return (
        <div className="rounded-2xl border border-[#E91E63]/15 bg-gradient-to-br from-[#E91E63]/5 to-pink-50/50 p-4 md:p-5">
            <div className="flex items-start gap-3">
                <span className="text-xl shrink-0" aria-hidden="true">🎁</span>
                <div>
                    <p className="text-[11px] font-black uppercase tracking-wider text-[#E91E63] mb-1">
                        {PROMO_LABEL}
                    </p>
                    <p className="text-sm font-bold text-gray-900 mb-1">{PROMO_SHORT}</p>
                    <p className="text-xs text-gray-600 leading-relaxed">{PROMO_DETAIL}</p>
                </div>
            </div>
        </div>
    );
}
