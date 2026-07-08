import ContactForm from "../components/ContactForm";

export const metadata = {
    title: "Contact The luxe jewels | Jewelry Support & Custom Enquiries",
    description: "Get in touch with The luxe jewels for jewelry support, order help, custom enquiries, and shipping questions across India.",
    alternates: {
        canonical: "/contact",
    },
    keywords: [
        "contact the luxe jewels",
        "jewelry support india",
        "custom jewelry enquiry",
        "order support jewelry",
    ],
    openGraph: {
        title: "Contact The luxe jewels",
        description: "Reach out for support, custom orders, or shipping help with premium anti-tarnish jewelry in India.",
        url: "https://www.theluxejewels.in/contact",
        siteName: "The luxe jewels",
        type: "website",
    },
};

export default function ContactPage() {
    return (
        <section className="bg-white py-20 px-6">
            <div className="max-w-3xl mx-auto">
                <ContactForm />
            </div>
        </section>
    );
}