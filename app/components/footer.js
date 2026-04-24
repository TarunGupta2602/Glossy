import Link from "next/link";
import Image from "next/image";

export default function Footer() {
    return (
        <footer className="relative bg-gradient-to-b from-white via-[#fffafa] to-[#f9f9fb] border-t border-gray-100/50 pt-24 pb-12 overflow-hidden">
            {/* Decorative element */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-px bg-gradient-to-r from-transparent via-gray-200 to-transparent" />

            <div className="max-w-7xl mx-auto px-6 md:px-12">
                <div className="grid grid-cols-1 md:grid-cols-12 gap-12 lg:gap-16 pb-20 border-b border-gray-100">

                    {/* Brand Identity Section */}
                    <div className="md:col-span-5 lg:col-span-4 flex flex-col items-center md:items-start text-center md:text-left">
                        <Link href="/" className="mb-8 group block focus:outline-none">
                            <div className="flex flex-col items-center md:items-start leading-none gap-1">
                                <span className="text-[10px] font-black uppercase tracking-[0.5em] text-[#E91E63]">THE</span>
                                <span className="text-3xl md:text-4xl font-bold tracking-tight text-gray-900 uppercase">
                                    LUXE <span className="font-light text-gray-400">JEWELS</span>
                                </span>
                            </div>
                        </Link>

                        <p className="text-gray-500 text-base leading-relaxed max-w-sm font-medium mb-8">
                            Curating the finest anti-tarnish, waterproof jewelry that celebrates your unique sparkle. Modern luxury designed for every day.
                        </p>

                        
                    </div>

                    {/* Navigation Columns */}
                    <div className="md:col-span-7 lg:col-span-8 grid grid-cols-2 lg:grid-cols-3 gap-10 md:gap-8">

                        {/* Shop Section */}
                        <div className="flex flex-col items-center md:items-start">
                            <h3 className="text-sm font-black text-gray-900 uppercase tracking-[0.2em] mb-8">Shop</h3>
                            <ul className="flex flex-col gap-4 text-sm font-bold text-gray-400 group-links">
                                <li><Link href="/shop" className="hover:text-[#E91E63] hover:translate-x-1 inline-block transition-all duration-300">Shop All</Link></li>
                                <li><Link href="/earrings" className="hover:text-[#E91E63] hover:translate-x-1 inline-block transition-all duration-300">Earrings</Link></li>
                                <li><Link href="/necklaces" className="hover:text-[#E91E63] hover:translate-x-1 inline-block transition-all duration-300">Necklaces</Link></li>
                                <li><Link href="/collection" className="hover:text-[#E91E63] hover:translate-x-1 inline-block transition-all duration-300">Featured Collections</Link></li>
                            </ul>
                        </div>

                        {/* Experience Section */}
                        <div className="flex flex-col items-center md:items-start">
                            <h3 className="text-sm font-black text-gray-900 uppercase tracking-[0.2em] mb-8">Experience</h3>
                            <ul className="flex flex-col gap-4 text-sm font-bold text-gray-400">
                                <li><Link href="/our-story" className="hover:text-[#E91E63] hover:translate-x-1 inline-block transition-all duration-300">Our Story</Link></li>
                                <li><Link href="/shipping-returns" className="hover:text-[#E91E63] hover:translate-x-1 inline-block transition-all duration-300">Shipping Policy</Link></li>
                                <li><Link href="/contact" className="hover:text-[#E91E63] hover:translate-x-1 inline-block transition-all duration-300">Contact Us</Link></li>
                                <li><Link href="/faqs" className="hover:text-[#E91E63] hover:translate-x-1 inline-block transition-all duration-300">FAQs</Link></li>
                            </ul>
                        </div>

                        {/* Connection Section */}
                        <div className="flex flex-col items-center md:items-start col-span-2 lg:col-span-1 border-t md:border-t-0 pt-10 md:pt-0 border-gray-100">
                            <h3 className="text-sm font-black text-gray-900 uppercase tracking-[0.2em] mb-8">Connect</h3>
                            <p className="text-gray-400 text-sm font-medium mb-6 text-center md:text-left">
                                Join our community on Instagram for styling tips and exclusive updates.
                            </p>
                            <div className="flex items-center gap-4">
                                <a
                                    href="https://www.instagram.com/theluxejewels.in_?igsh=MTQ1NWkyaTh1cDJ6Mg%3D%3D"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="px-6 py-3 rounded-2xl bg-white border border-gray-100 flex items-center gap-3 text-gray-900 hover:bg-[#E91E63] hover:text-white hover:-translate-y-1 transition-all duration-300 shadow-sm font-bold text-sm"
                                    aria-label="Instagram"
                                >
                                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line></svg>
                                    Instagram
                                </a>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Bottom Bar */}
                <div className="pt-12 flex flex-col md:flex-row items-center justify-between gap-8">
                    {/* Copyright & Links */}
                    <div className="flex flex-col items-center md:items-start gap-3 order-2 md:order-1">
                        <p className="text-[13px] font-bold text-gray-900 tracking-tight">
                            © {new Date().getFullYear()} The luxe jewels. <span className="text-gray-400 font-medium">Crafted for the modern muse.</span>
                        </p>
                        <div className="flex items-center gap-6">
                            <Link href="/privacy" className="text-[11px] font-black uppercase tracking-widest text-gray-400 hover:text-gray-900 transition-colors">Privacy</Link>
                            <span className="w-1 h-1 rounded-full bg-gray-200" />
                            <Link href="/terms" className="text-[11px] font-black uppercase tracking-widest text-gray-400 hover:text-gray-900 transition-colors">Terms</Link>
                        </div>
                    </div>

                    {/* Payment Indicators */}
                    <div className="flex items-center gap-6 order-1 md:order-2 opacity-50 grayscale hover:grayscale-0 transition-all duration-500">
                        <div className="flex flex-col items-center md:items-end gap-3">
                            <span className="text-[9px] font-black text-black uppercase tracking-[0.25em]">Secure Payments via Razorpay</span>
                            <div className="flex items-center gap-5">


                                <Image src="https://razorpay.com/assets/razorpay-glyph.svg" alt="Razorpay" width={32} height={24} className="h-10 w-auto" unoptimized />
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* SEO Disclaimer (SR Only) */}
            <div className="sr-only">
                <h2 className="text-[10px] uppercase font-black">India's Premier Anti-Tarnish Jewelry Destination</h2>
                <p>Welcome to The Luxe Jewels, your ultimate destination for premium anti-tarnish jewelry in India. We specialize in handcrafted waterproof jewelry designed to withstand daily life without losing sparkle. Explore 18k gold plated necklaces, luxury earrings, and tarnish-free rings.</p>
            </div>
        </footer>
    );
}

