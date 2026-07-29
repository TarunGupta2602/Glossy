import ContactForm from "../components/ContactForm";

export const metadata = {
    title: "Contact The luxe jewels | Jewellery Support & Custom Enquiries",
    description: "Get in touch with The luxe jewels for jewellery support, order help, custom enquiries, and shipping questions across India.",
    alternates: {
        canonical: "/contact",
    },
    keywords: [
        "contact the luxe jewels",
        "jewellery support india",
        "custom jewellery enquiry",
        "order support jewellery",
    ],
    robots: {
        index: true,
        follow: true,
        "max-image-preview": "large",
        "max-snippet": -1,
    },
    openGraph: {
        title: "Contact The luxe jewels",
        description: "Reach out for support, custom orders, or shipping help with premium anti-tarnish jewellery in India.",
        url: "https://www.theluxejewels.in/contact",
        siteName: "The luxe jewels",
        type: "website",
    },
};

export default function ContactPage() {
    return (
        <section className="bg-white py-20 px-6">
            <div className="max-w-3xl mx-auto">
                <div className="text-center mb-12">
                    <h1 className="text-4xl font-bold text-gray-900 mb-4">Get in Touch</h1>
                    <p className="text-gray-600">We're here to help with any questions about your order or our jewellery.</p>
                </div>

                {/* Contact Information */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
                    <div className="bg-gray-50 rounded-xl p-6 border border-gray-100">
                        <div className="flex items-center gap-3 mb-2">
                            <svg className="w-5 h-5 text-[#E91E63]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                            </svg>
                            <h3 className="font-bold text-gray-900">Phone</h3>
                        </div>
                        <a href="tel:+917456096455" className="text-gray-600 hover:text-[#E91E63] transition-colors">
                            +91 7456096455
                        </a>
                    </div>

                    <div className="bg-gray-50 rounded-xl p-6 border border-gray-100">
                        <div className="flex items-center gap-3 mb-2">
                            <svg className="w-5 h-5 text-[#E91E63]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                            </svg>
                            <h3 className="font-bold text-gray-900">Email</h3>
                        </div>
                        <a href="mailto:supporttheluxejewels@gmail.com" className="text-gray-600 hover:text-[#E91E63] transition-colors">
                            supporttheluxejewels@gmail.com
                        </a>
                    </div>
                </div>

                <ContactForm />
            </div>
        </section>
    );
}