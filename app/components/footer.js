import Link from "next/link";
import Image from "next/image";

export default function Footer() {
    return (
        <footer className="bg-white border-t border-gray-100 py-16 px-6 md:px-12 ">
            <div className="max-w-7xl mx-auto">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-10">
                    {/* Logo & Bio */}
                    <div className="md:col-span-1">
                        <Link href="/" className="mb-4 group block focus:outline-none">
                            <Image
                                src="/logo.png"
                                alt="The luxe jewels Logo"
                                width={240}
                                height={96}
                                className="h-24 w-auto object-contain "
                            />
                        </Link>
                        <p className="text-gray-500 leading-relaxed max-w-xs">
                            Defining modern luxury through intentional design and sustainable practices in fine jewelry.
                        </p>
                    </div>

                    {/* Shop Links */}
                    <div>
                        <h3 className="text-xs font-bold text-gray-900 uppercase tracking-widest mb-6">Shop</h3>
                        <ul className="space-y-4">
                            <li><Link href="/shop" className="text-gray-500 hover:text-[#E91E63] transition-colors">New Arrivals</Link></li>
                            <li><Link href="/earrings" className="text-gray-500 hover:text-[#E91E63] transition-colors">Earrings</Link></li>
                            <li><Link href="/necklaces" className="text-gray-500 hover:text-[#E91E63] transition-colors">Necklaces</Link></li>

                        </ul>
                    </div>

                    {/* Support Links */}
                    <div>
                        <h3 className="text-xs font-bold text-gray-900 uppercase tracking-widest mb-6">Support</h3>
                        <ul className="space-y-4">
                            <li><Link href="/shipping-returns" className="text-gray-500 hover:text-[#E91E63] transition-colors">Shipping & Returns</Link></li>
                            <li><Link href="/contact" className="text-gray-500 hover:text-[#E91E63] transition-colors">Contact Us</Link></li>
                            <li><Link href="/faqs" className="text-gray-500 hover:text-[#E91E63] transition-colors">FAQs</Link></li>

                        </ul>
                    </div>

                    {/* Follow Us */}
                    <div>
                        <h3 className="text-xs font-bold text-gray-900 uppercase tracking-widest mb-6">Follow Us</h3>
                        <div className="flex items-center space-x-4">
                            <a href="#" className="w-10 h-10 rounded-full border border-gray-100 flex items-center justify-center text-gray-900 hover:bg-[#E91E63] hover:text-white hover:border-[#E91E63] transition-all">
                                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                    <rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect>
                                    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path>
                                    <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line>
                                </svg>
                            </a>
                            <a href="#" className="w-10 h-10 rounded-full border border-gray-100 flex items-center justify-center text-gray-900 hover:bg-[#E91E63] hover:text-white hover:border-[#E91E63] transition-all">
                                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                    <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"></path>
                                </svg>
                            </a>
                        </div>
                    </div>
                </div>

                {/* Bottom Bar */}
                <div className="pt-8 border-t border-gray-100 flex flex-col md:flex-row items-center justify-between gap-4">
                    <p className="text-gray-400 text-sm">
                        © {new Date().getFullYear()} The luxe jewels. All rights reserved.
                    </p>
                    <div className="flex items-center space-x-6 text-sm text-gray-400">
                        <Link href="/privacy" className="hover:text-gray-900 transition-colors">Privacy Policy</Link>
                        <Link href="/terms" className="hover:text-gray-900 transition-colors">Terms of Service</Link>
                    </div>
                </div>
            </div>
        </footer>
    );
}
