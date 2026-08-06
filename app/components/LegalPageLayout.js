import Link from "next/link";
import { SITE_CONTAINER } from "@/lib/siteLayout";
import Breadcrumbs from "./Breadcrumbs";
import { SUPPORT_EMAIL } from "@/lib/constants";

const LEGAL_LINKS = [
    { href: "/privacy", label: "Privacy Policy" },
    { href: "/terms", label: "Terms of Service" },
    { href: "/shipping-returns", label: "Shipping & Returns" },
];

export function LegalSection({ title, children }) {
    return (
        <section>
            <h2 className="text-lg font-semibold text-gray-900 mb-3">{title}</h2>
            <div className="text-sm text-gray-600 leading-relaxed space-y-3">{children}</div>
        </section>
    );
}

export default function LegalPageLayout({ title, description, lastUpdated = "March 2026", children }) {
    return (
        <section className="bg-[#FAFAFA] min-h-screen py-12 md:py-16">
            <div className={`${SITE_CONTAINER} max-w-3xl`}>
                <Breadcrumbs items={[{ label: title }]} />

                <header className="mb-8 md:mb-10">
                    <p className="text-[11px] font-bold uppercase tracking-widest text-[#E91E63] mb-3">
                        Legal
                    </p>
                    <h1 className="text-3xl md:text-4xl font-bold text-gray-900 tracking-tight mb-3">
                        {title}
                    </h1>
                    {description && (
                        <p className="text-gray-500 text-sm md:text-base leading-relaxed max-w-2xl">
                            {description}
                        </p>
                    )}
                    {lastUpdated && (
                        <p className="text-xs text-gray-400 mt-4">Last updated: {lastUpdated}</p>
                    )}
                </header>

                <article className="bg-white rounded-2xl border border-gray-100 shadow-sm p-8 md:p-10 space-y-8">
                    {children}
                </article>

                <footer className="mt-10 pt-8 border-t border-gray-200">
                    <p className="text-xs font-semibold uppercase tracking-widest text-gray-400 mb-4">
                        Related policies
                    </p>
                    <div className="flex flex-wrap gap-3">
                        {LEGAL_LINKS.map((link) => (
                            <Link
                                key={link.href}
                                href={link.href}
                                className="px-4 py-2 rounded-full border border-gray-200 bg-white text-sm font-medium text-gray-700 hover:border-[#E91E63] hover:text-[#E91E63] transition-colors"
                            >
                                {link.label}
                            </Link>
                        ))}
                    </div>
                    <p className="text-sm text-gray-500 mt-8">
                        Questions?{" "}
                        <a href={`mailto:${SUPPORT_EMAIL}`} className="font-medium text-gray-900 hover:text-[#E91E63] transition-colors">
                            {SUPPORT_EMAIL}
                        </a>
                    </p>
                </footer>
            </div>
        </section>
    );
}
