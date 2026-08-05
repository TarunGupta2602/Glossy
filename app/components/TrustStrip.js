export default function TrustStrip({ className = "" }) {
    const items = [
        "Secure online payment",
        "Free shipping over ₹1000",
        "10-day easy returns",
    ];

    return (
        <div className={`flex flex-wrap items-center gap-x-4 gap-y-2 text-[11px] font-semibold text-gray-600 ${className}`}>
            {items.map((item, i) => (
                <span key={item} className="flex items-center gap-2">
                    {i > 0 && <span className="text-gray-300 hidden sm:inline" aria-hidden="true">|</span>}
                    <span className="flex items-center gap-1.5">
                        <span className="text-[#E91E63]">✓</span>
                        {item}
                    </span>
                </span>
            ))}
        </div>
    );
}
