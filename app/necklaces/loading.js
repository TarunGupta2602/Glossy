import ShopGridSkeleton from "../components/ShopGridSkeleton";

export default function NecklacesLoading() {
    return (
        <section className="py-24 px-6 md:px-12 bg-white">
            <div className="max-w-7xl mx-auto">
                <div className="h-10 w-72 bg-gray-100 rounded animate-pulse mx-auto mb-12" />
                <ShopGridSkeleton count={8} />
            </div>
        </section>
    );
}
