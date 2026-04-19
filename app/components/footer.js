import Link from "next/link";
import Image from "next/image";

export default function Footer() {
    return (
        <footer className="bg-white border-t border-gray-100 pt-20 pb-10 px-6 md:px-12">
            <div className="max-w-7xl mx-auto">
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-12 lg:gap-24 mb-16 text-center sm:text-left">
                    {/* Brand Section */}
                    <div className="flex flex-col items-center sm:items-start md:col-span-1">
                        <Link href="/" className="mb-6 group block focus:outline-none">
                            {/* Universal Text Logo */}
                            <div className="flex flex-col items-center sm:items-start leading-none">
                                <span className="text-[8px] md:text-[9px] font-black uppercase tracking-[0.4em] text-[#E91E63] mb-1">THE</span>
                                <span className="text-2xl md:text-3xl font-bold tracking-tight text-gray-900 uppercase">
                                    LUXE <span className="font-light text-gray-500">JEWELS</span>
                                </span>
                            </div>
                        </Link>
                        <p className="text-gray-500 text-sm leading-relaxed max-w-[280px] sm:max-w-xs font-medium">
                            Defining modern luxury through intentional design, waterproof durability, and ethical sourcing.
                        </p>
                    </div>

                    {/* Shop Links */}
                    <div className="flex flex-col items-center sm:items-start">
                        <h3 className="text-[10px] font-black text-gray-950 uppercase tracking-[0.25em] mb-6">Collections</h3>
                        <ul className="space-y-4 text-[13px] font-semibold text-gray-500">
                            <li><Link href="/shop" className="hover:text-[#E91E63] transition-colors">Shop All</Link></li>
                            <li><Link href="/earrings" className="hover:text-[#E91E63] transition-colors">Earrings</Link></li>
                            <li><Link href="/necklaces" className="hover:text-[#E91E63] transition-colors">Necklaces</Link></li>
                            <li><Link href="/collection" className="hover:text-[#E91E63] transition-colors">Featured</Link></li>
                        </ul>
                    </div>

                    {/* Info Links */}
                    <div className="flex flex-col items-center sm:items-start">
                        <h3 className="text-[10px] font-black text-gray-950 uppercase tracking-[0.25em] mb-6">Experience</h3>
                        <ul className="space-y-4 text-[13px] font-semibold text-gray-500">
                            <li><Link href="/our-story" className="hover:text-[#E91E63] transition-colors">Our Story</Link></li>
                            <li><Link href="/shipping-returns" className="hover:text-[#E91E63] transition-colors">Shipping</Link></li>
                            <li><Link href="/faqs" className="hover:text-[#E91E63] transition-colors">FAQs</Link></li>
                            <li><Link href="/contact" className="hover:text-[#E91E63] transition-colors">Contact</Link></li>
                        </ul>
                    </div>

                    {/* Connect Section */}
                    <div className="flex flex-col items-center sm:items-start">
                        <h3 className="text-[10px] font-black text-gray-950 uppercase tracking-[0.25em] mb-6">Community</h3>
                        <div className="flex items-center space-x-6">
                            {/* Instagram Social - Mobile Button, Desktop Icon */}
                            <a
                                href="https://www.instagram.com/theluxejewels.in_?igsh=MTQ1NWkyaTh1cDJ6Mg%3D%3D"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="sm:hidden group flex items-center space-x-3 text-gray-900 font-bold text-sm bg-gray-50 px-8 py-3 rounded-full hover:bg-pink-50 hover:text-[#E91E63] transition-all duration-300"
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                    <rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect>
                                    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path>
                                    <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line>
                                </svg>
                                <span>Instagram</span>
                            </a>
                            <a
                                href="https://www.instagram.com/theluxejewels.in_?igsh=MTQ1NWkyaTh1cDJ6Mg%3D%3D"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="hidden sm:block text-gray-400 hover:text-[#E91E63] transition-all hover:-translate-y-1 duration-300"
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                                    <rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect>
                                    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path>
                                    <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line>
                                </svg>
                            </a>
                        </div>
                        <div className="mt-8">
                            <p className="text-[11px] text-gray-400 font-black uppercase tracking-widest leading-none">India / International</p>
                        </div>
                    </div>
                </div>

                {/* SEO Keyword Narrative - Visually Hidden for SEO only */}
                <div className="sr-only">
                    <h4 className="text-[10px] font-black text-gray-400 uppercase tracking-[0.25em] mb-4">India's Premier Anti-Tarnish Jewelry Destination</h4>
                    <p className="text-[12px] text-gray-400 leading-relaxed font-medium">
                        Welcome to <span className="text-gray-900 font-bold text-xs uppercase tracking-tighter">The Luxe Jewels</span>, your ultimate destination for premium <span className="text-gray-600">anti-tarnish jewelry in India</span>.
                        We specialize in meticulously handcrafted <span className="text-gray-600">waterproof jewelry</span> designed to withstand the rigors of daily life without losing its signature sparkle.
                        Whether you are looking for <span className="text-gray-600">18k gold plated necklaces</span>, <span className="text-gray-600">luxury earrings</span>, or <span className="text-gray-600">tarnish-free rings</span>,
                        our collection offers the perfect blend of modern aesthetics and sustainable durability.
                        Experience the elegance of <span className="text-gray-600">minimalist fine jewelry</span> that is both hypoallergenic and skin-safe.
                        Shop now for the best <span className="text-gray-600">artificial jewelry online India</span> and enjoy free shipping on orders above ₹1000.
                    </p>
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
