import Link from "next/link";
import Image from "next/image";

export default function Footer() {
    return (
        <footer className="bg-white border-t border-gray-100 pt-20 pb-10 px-6 md:px-12">
            <div className="max-w-7xl mx-auto">
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-12 lg:gap-24 mb-16 text-center sm:text-left">
                    {/* Brand Section */}
                    <div className="flex flex-col items-center sm:items-start md:col-span-1">
                        <Link href="/" className="mb-6 group block">
                            <Image
                                src="/logo.png"
                                alt="The luxe jewels | Premium Anti-Tarnish & Fine Jewelry"
                                width={160}
                                height={64}
                                className="h-16 w-auto object-contain transition-opacity hover:opacity-80"
                            />
                        </Link>
                        <p className="text-gray-500 text-sm leading-relaxed max-w-[240px]">
                            Defining modern luxury through intentional design, waterproof durability, and ethical sourcing.
                        </p>
                    </div>

                    {/* Shop Links */}
                    <div className="flex flex-col items-center sm:items-start">
                        <h3 className="text-[10px] font-black text-gray-950 uppercase tracking-[0.25em] mb-6">Collections</h3>
                        <ul className="space-y-4 text-[13px] font-medium text-gray-500">
                            <li><Link href="/shop" className="hover:text-gray-900 transition-colors">Shop All</Link></li>
                            <li><Link href="/earrings" className="hover:text-gray-900 transition-colors">Earrings</Link></li>
                            <li><Link href="/necklaces" className="hover:text-gray-900 transition-colors">Necklaces</Link></li>
                            <li><Link href="/collection" className="hover:text-gray-900 transition-colors">Featured</Link></li>
                        </ul>
                    </div>

                    {/* Info Links */}
                    <div className="flex flex-col items-center sm:items-start">
                        <h3 className="text-[10px] font-black text-gray-950 uppercase tracking-[0.25em] mb-6">Experience</h3>
                        <ul className="space-y-4 text-[13px] font-medium text-gray-500">
                            <li><Link href="/our-story" className="hover:text-gray-900 transition-colors">Our Story</Link></li>
                            <li><Link href="/shipping-returns" className="hover:text-gray-900 transition-colors">Shipping & Returns</Link></li>
                            <li><Link href="/faqs" className="hover:text-gray-900 transition-colors">FAQs</Link></li>
                            <li><Link href="/contact" className="hover:text-gray-900 transition-colors">Contact Us</Link></li>
                        </ul>
                    </div>

                    {/* Connect Section */}
                    <div className="flex flex-col items-center sm:items-start">
                        <h3 className="text-[10px] font-black text-gray-950 uppercase tracking-[0.25em] mb-6">Social</h3>
                        <div className="flex items-center space-x-5">
                            <a href="#" className="text-gray-400 hover:text-gray-900 transition-transform hover:-translate-y-1 duration-300">
                                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                                    <rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect>
                                    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path>
                                    <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line>
                                </svg>
                            </a>
                            <a href="#" className="text-gray-400 hover:text-gray-900 transition-transform hover:-translate-y-1 duration-300">
                                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                                    <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"></path>
                                </svg>
                            </a>
                        </div>
                        <div className="mt-8 pt-4 border-t border-gray-50 md:border-none">
                            <p className="text-[12px] text-gray-400 font-medium">India / International</p>
                        </div>
                    </div>
                </div>

                {/* Bottom Bar */}
                <div className="pt-10 border-t border-gray-50 flex flex-col md:flex-row items-center justify-between gap-6 text-[12px] font-medium tracking-tight text-gray-400">
                    <p>© {new Date().getFullYear()} The luxe jewels. All rights reserved.</p>
                    <div className="flex items-center space-x-8">
                        <Link href="/privacy" className="hover:text-gray-900 underline-offset-4 hover:underline transition-all">Privacy</Link>
                        <Link href="/terms" className="hover:text-gray-900 underline-offset-4 hover:underline transition-all">Terms</Link>
                    </div>
                </div>
            </div>
        </footer>
    );
}
