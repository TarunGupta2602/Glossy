import Link from "next/link";

export default function Breadcrumbs({ items, variant = "default", className = "" }) {
    const isLight = variant === "light";

    return (
        <nav
            className={`flex items-center gap-2 text-[10px] font-bold tracking-wide uppercase overflow-x-auto whitespace-nowrap pb-1 scrollbar-hide ${
                isLight
                    ? "text-white/60"
                    : "text-gray-600 mb-3 md:mb-4"
            } ${className}`}
        >
            <Link href="/" className={isLight ? "hover:text-white transition-colors" : "hover:text-gray-900 transition-colors"}>
                Home
            </Link>
            {items.map((item, index) => (
                <div key={index} className="flex items-center gap-2">
                    <svg className={`w-3 h-3 ${isLight ? "opacity-40" : "opacity-30"}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
                    </svg>
                    {item.href ? (
                        <Link href={item.href} className={isLight ? "hover:text-white transition-colors" : "hover:text-gray-900 transition-colors"}>
                            {item.label}
                        </Link>
                    ) : (
                        <span className={isLight ? "text-white" : "text-gray-900"}>{item.label}</span>
                    )}
                </div>
            ))}
        </nav>
    );
}
