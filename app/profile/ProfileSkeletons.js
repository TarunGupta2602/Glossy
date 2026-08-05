export function ProfileHeaderSkeleton() {
    return (
        <div className="rounded-3xl border border-gray-100 bg-white p-8 animate-pulse">
            <div className="flex flex-col sm:flex-row items-center gap-6">
                <div className="w-24 h-24 rounded-full bg-gray-100" />
                <div className="space-y-3 flex-1 w-full">
                    <div className="h-3 w-24 bg-gray-100 rounded mx-auto sm:mx-0" />
                    <div className="h-8 w-48 bg-gray-100 rounded mx-auto sm:mx-0" />
                    <div className="h-4 w-56 bg-gray-100 rounded mx-auto sm:mx-0" />
                </div>
            </div>
        </div>
    );
}

export function OrderCardSkeleton() {
    return (
        <div className="bg-white rounded-2xl border border-gray-100 p-6 animate-pulse space-y-4">
            <div className="flex gap-3">
                <div className="h-6 w-24 bg-gray-100 rounded-full" />
                <div className="h-6 w-20 bg-gray-100 rounded-full" />
            </div>
            <div className="h-8 w-32 bg-gray-100 rounded" />
            <div className="flex gap-3">
                <div className="w-16 h-16 bg-gray-100 rounded-xl" />
                <div className="w-16 h-16 bg-gray-100 rounded-xl" />
            </div>
            <div className="h-10 w-36 bg-gray-100 rounded-xl" />
        </div>
    );
}

export function WishlistSkeleton() {
    return (
        <div className="aspect-square bg-gray-100 rounded-2xl animate-pulse" />
    );
}
