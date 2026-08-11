import Link from "next/link";
import { SITE_CONTAINER } from "@/lib/siteLayout";

export default function SeoIntro({ title, children, links = [] }) {
    return (
        <section className="py-10 md:py-16 bg-gray-50/60 border-t border-gray-100">
            <div className={`${SITE_CONTAINER} max-w-3xl text-center`}>
                {title && (
                    <h2 className="text-lg md:text-2xl font-bold text-gray-900 mb-3 md:mb-4 tracking-tight px-1">
                        {title}
                    </h2>
                )}
                <div className="text-sm md:text-base text-gray-500 leading-relaxed space-y-4">
                    {children}
                </div>
                {links.length > 0 && (
                    <div className="flex flex-wrap justify-center gap-x-4 gap-y-3 mt-6 md:mt-8 text-[10px] sm:text-xs font-bold uppercase tracking-widest text-[#E91E63]">
                        {links.map((link) => (
                            <Link key={link.href} href={link.href} className="min-h-9 inline-flex items-center hover:underline">
                                {link.label}
                            </Link>
                        ))}
                    </div>
                )}
            </div>
        </section>
    );
}
