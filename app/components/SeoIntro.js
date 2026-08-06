import Link from "next/link";
import { SITE_CONTAINER } from "@/lib/siteLayout";

export default function SeoIntro({ title, children, links = [] }) {
    return (
        <section className="py-16 bg-gray-50/60 border-t border-gray-100">
            <div className={`${SITE_CONTAINER} max-w-3xl text-center`}>
                {title && (
                    <h2 className="text-xl md:text-2xl font-bold text-gray-900 mb-4 tracking-tight">
                        {title}
                    </h2>
                )}
                <div className="text-sm md:text-base text-gray-500 leading-relaxed space-y-4">
                    {children}
                </div>
                {links.length > 0 && (
                    <div className="flex flex-wrap justify-center gap-4 mt-8 text-xs font-bold uppercase tracking-widest text-[#E91E63]">
                        {links.map((link) => (
                            <Link key={link.href} href={link.href} className="hover:underline">
                                {link.label}
                            </Link>
                        ))}
                    </div>
                )}
            </div>
        </section>
    );
}
