export default function ShopGridSkeleton({ count = 8 }) {
    return (
        <div className="grid grid-cols-2 lg:grid-cols-3 gap-x-6 gap-y-10 animate-pulse">
            {Array.from({ length: count }).map((_, i) => (
                <div key={i} className="flex flex-col gap-3">
                    <div className="aspect-square rounded-2xl bg-gray-100" />
                    <div className="h-4 bg-gray-100 rounded w-3/4" />
                    <div className="h-4 bg-gray-100 rounded w-1/3" />
                </div>
            ))}
        </div>
    );
}
