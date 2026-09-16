import {
    INSTAGRAM_HANDLE,
    INSTAGRAM_URL,
    TRUST_CUSTOMER_COUNT_LABEL,
    TRUST_INSTAGRAM_LABEL,
} from "@/lib/constants";

/** Shown when a product has zero reviews — soft trust, not fake ratings. */
export default function ProductTrustFallback({ className = "" }) {
    return (
        <div
            className={`rounded-2xl border border-[#efeae4] bg-[#fdfbf7] p-6 md:p-8 ${className}`}
        >
            <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-[#b89a6a] mb-3">
                Be the first to review
            </p>
            <p className="text-lg font-semibold text-[#2a2724] mb-2">No reviews yet</p>
            <p className="text-sm text-[#6b6560] mb-5 max-w-md">
                This piece is new to the journal of reviews — shoppers still trust The Luxe Jewels
                for everyday anti-tarnish wear.
            </p>
            <ul className="flex flex-col sm:flex-row flex-wrap gap-3 text-[13px] font-medium text-[#2a2724]">
                <li className="inline-flex items-center gap-2 rounded-full bg-white px-3.5 py-2 ring-1 ring-black/[0.04]">
                    <span className="text-[#E91E63]" aria-hidden>
                        ✓
                    </span>
                    {TRUST_CUSTOMER_COUNT_LABEL}
                </li>
                <li>
                    <a
                        href={INSTAGRAM_URL}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-2 rounded-full bg-white px-3.5 py-2 ring-1 ring-black/[0.04] hover:text-[#E91E63] transition-colors"
                    >
                        <span className="text-[#E91E63]" aria-hidden>
                            ✓
                        </span>
                        {TRUST_INSTAGRAM_LABEL || `Loved on Instagram ${INSTAGRAM_HANDLE}`}
                    </a>
                </li>
            </ul>
        </div>
    );
}
