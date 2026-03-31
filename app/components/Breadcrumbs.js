import Link from "next/link";

export default function Breadcrumbs({ items }) {
    return (
        <nav className="flex items-center gap-2 text-[10px] font-bold tracking-[0.1em] uppercase text-gray-400 mb-8 overflow-x-auto whitespace-nowrap pb-2 scrollbar-hide">
            <Link href="/" className="hover:text-gray-900 transition-colors">Home</Link>
            {items.map((item, index) => (
                <div key={index} className="flex items-center gap-2">
                    <svg className="w-3 h-3 opacity-30" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
                    </svg>
                    {item.href ? (
                        <Link href={item.href} className="hover:text-gray-900 transition-colors">
                            {item.label}
                        </Link>
                    ) : (
                        <span className="text-gray-900">{item.label}</span>
                    )}
                </div>
            ))}
        </nav>
    );
}
