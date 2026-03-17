export const dynamic = "force-static";

export const metadata = {
    title: "Store Locator | Glossy Jewelry",
    description:
        "Find Glossy Jewelry stores near you. Visit our locations for an in-store shopping experience.",
};

const stores = [
    {
        city: "Delhi",
        address: "Connaught Place, New Delhi, India",
        hours: "10:00 AM – 9:00 PM",
    },
    {
        city: "Mumbai",
        address: "Bandra West, Mumbai, India",
        hours: "11:00 AM – 10:00 PM",
    },
    {
        city: "Bangalore",
        address: "Indiranagar, Bangalore, India",
        hours: "10:30 AM – 9:30 PM",
    },
];

export default function StoreLocator() {
    return (
        <section className="bg-white py-20 px-6">
            <div className="max-w-4xl mx-auto">

                {/* Heading */}
                <div className="text-center mb-12">
                    <h1 className="text-3xl md:text-4xl font-semibold text-gray-900 mb-3">
                        Store Locator
                    </h1>
                    <p className="text-gray-500 text-sm">
                        Visit our stores and experience Glossy Jewelry in person.
                    </p>
                </div>

                {/* Store List */}
                <div className="divide-y divide-gray-200">

                    {stores.map((store, index) => (
                        <div key={index} className="py-6">

                            <h2 className="text-lg font-medium text-gray-900">
                                {store.city}
                            </h2>

                            <p className="text-sm text-gray-600 mt-1">
                                {store.address}
                            </p>

                            <p className="text-sm text-gray-500 mt-1">
                                Hours: {store.hours}
                            </p>

                        </div>
                    ))}

                </div>

            </div>
        </section>
    );
}