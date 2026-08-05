import ShopGridSkeleton from "../components/ShopGridSkeleton";

export default function ShopLoading() {
    return (
        <main className="min-h-screen bg-white pb-32 px-6 md:px-12 pt-10">
            <div className="max-w-7xl mx-auto">
                <div className="h-4 w-48 bg-gray-100 rounded animate-pulse mb-16" />
                <div className="h-10 w-72 bg-gray-100 rounded animate-pulse mx-auto mb-8" />
                <ShopGridSkeleton count={9} />
            </div>
        </main>
    );
}
