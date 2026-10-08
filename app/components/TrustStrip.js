export default function TrustStrip({ className = "" }) {
    const items = [
        "Cash on delivery or UPI",
        "Shipping from ₹50",
        "10-day easy returns",
        "Fashion jewellery",
    ];

    return (
        <div
            className={`flex flex-wrap items-center gap-x-1 gap-y-2 text-[11px] font-medium text-[#6b6560] ${className}`}
        >
            {items.map((item, i) => (
                <span key={item} className="inline-flex items-center gap-1.5">
                    {i > 0 && (
                        <span className="mx-1.5 hidden sm:inline text-[#d4cfc8]" aria-hidden>
                            ·
                        </span>
                    )}
                    <span className="inline-flex items-center gap-1.5">
                        <span className="text-[#E91E63]" aria-hidden>
                            ✓
                        </span>
                        {item}
                    </span>
                </span>
            ))}
        </div>
    );
}
