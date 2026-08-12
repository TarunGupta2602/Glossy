import ContactForm from "../components/ContactForm";
import {
    WHATSAPP_URL,
    SUPPORT_EMAIL,
    SUPPORT_PHONE,
    BUSINESS_HOURS,
    BUSINESS_ADDRESS_LINE,
    SERVICE_AREA_LABEL,
} from "@/lib/constants";

export const metadata = {
    title: "Contact The Luxe Jewels | Noida NCR Jewellery Support",
    description:
        "Contact The Luxe Jewels for jewellery support, order help, and custom enquiries. Serving Noida, Greater Noida, Delhi NCR, and pan-India with WhatsApp, phone, and email support.",
    alternates: {
        canonical: "/contact",
    },
    robots: {
        index: true,
        follow: true,
        "max-image-preview": "large",
        "max-snippet": -1,
    },
    openGraph: {
        title: "Contact The Luxe Jewels | Noida NCR & Pan-India Support",
        description:
            "Reach out for support, custom orders, or shipping help. Serving Noida, Delhi NCR, and pan-India.",
        url: "https://www.theluxejewels.in/contact",
        siteName: "The Luxe Jewels",
        type: "website",
    },
};

export default function ContactPage() {
    return (
        <section className="bg-white py-12 md:py-20 px-4 sm:px-6">
            <div className="max-w-3xl mx-auto">
                <div className="text-center mb-8 md:mb-12">
                    <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-3 md:mb-4">Get in Touch</h1>
                    <p className="text-sm md:text-base text-gray-600">We&apos;re here to help with any questions about your order or our jewellery.</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
                    <div className="bg-gray-50 rounded-xl p-6 border border-gray-100">
                        <div className="flex items-center gap-3 mb-2">
                            <svg className="w-5 h-5 text-[#E91E63]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                            </svg>
                            <h2 className="font-bold text-gray-900">Phone</h2>
                        </div>
                        <a href={`tel:${SUPPORT_PHONE.replace(/\s/g, "")}`} className="text-gray-600 hover:text-[#E91E63] transition-colors">
                            {SUPPORT_PHONE}
                        </a>
                    </div>

                    <div className="bg-gray-50 rounded-xl p-6 border border-gray-100">
                        <div className="flex items-center gap-3 mb-2">
                            <svg className="w-5 h-5 text-[#E91E63]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                            </svg>
                            <h2 className="font-bold text-gray-900">Email</h2>
                        </div>
                        <a href={`mailto:${SUPPORT_EMAIL}`} className="text-gray-600 hover:text-[#E91E63] transition-colors">
                            {SUPPORT_EMAIL}
                        </a>
                    </div>

                    <div className="bg-gray-50 rounded-xl p-6 border border-gray-100">
                        <div className="flex items-center gap-3 mb-2">
                            <svg className="w-5 h-5 text-[#25D366]" fill="currentColor" viewBox="0 0 24 24">
                                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                            </svg>
                            <h2 className="font-bold text-gray-900">WhatsApp</h2>
                        </div>
                        <a href={WHATSAPP_URL} target="_blank" rel="noopener noreferrer" className="text-gray-600 hover:text-[#25D366] transition-colors">
                            Chat with us instantly
                        </a>
                    </div>

                    <div className="bg-gray-50 rounded-xl p-6 border border-gray-100">
                        <div className="flex items-center gap-3 mb-2">
                            <svg className="w-5 h-5 text-[#E91E63]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                            <h2 className="font-bold text-gray-900">Support Hours</h2>
                        </div>
                        <p className="text-gray-600">{BUSINESS_HOURS}</p>
                        <p className="text-sm text-gray-500 mt-2">{SERVICE_AREA_LABEL}</p>
                    </div>

                    <div className="bg-gray-50 rounded-xl p-6 border border-gray-100 md:col-span-2">
                        <div className="flex items-center gap-3 mb-2">
                            <svg className="w-5 h-5 text-[#E91E63]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                            </svg>
                            <h2 className="font-bold text-gray-900">Business address</h2>
                        </div>
                        <p className="text-gray-600">{BUSINESS_ADDRESS_LINE}</p>
                        <p className="text-sm text-gray-500 mt-2">
                            Online jewellery store for Noida, Greater Noida, Ghaziabad &amp; Delhi NCR shoppers — we ship pan-India.
                        </p>
                    </div>
                </div>

                <div className="mb-12 rounded-2xl overflow-hidden border border-gray-100 shadow-sm">
                    <iframe
                        title="The Luxe Jewels — Noida & Delhi NCR service area"
                        src="https://maps.google.com/maps?q=Noida%2C%20Uttar%20Pradesh&z=10&output=embed"
                        className="w-full h-64 md:h-80 border-0"
                        loading="lazy"
                        referrerPolicy="no-referrer-when-downgrade"
                    />
                    <p className="px-4 py-3 text-xs text-gray-500 bg-gray-50 text-center">
                        {SERVICE_AREA_LABEL} · Free delivery on orders over ₹1000
                    </p>
                </div>

                <ContactForm />
            </div>
        </section>
    );
}
