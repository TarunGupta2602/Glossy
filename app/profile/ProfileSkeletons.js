

export function ProfileHeaderSkeleton() {
    return (
        <div className="relative h-[250px] overflow-hidden bg-gray-50 rounded-b-[60px] animate-pulse">
            <div className="absolute inset-0 bg-gradient-to-br from-gray-100 to-gray-200 opacity-50" />
            <div className="relative h-full flex items-end px-12 pb-12">
                <div className="flex items-center gap-8 w-full max-w-7xl mx-auto">
                    <div className="w-24 h-24 rounded-full bg-gray-200 border-4 border-white shadow-xl" />
                    <div className="space-y-3">
                        <div className="h-8 w-64 bg-gray-200 rounded-lg" />
                        <div className="h-4 w-40 bg-gray-200 rounded-lg" />
                    </div>
                </div>
            </div>
        </div>
    );
}

export function OrderCardSkeleton() {
    return (
        <div className="group bg-white rounded-[32px] border border-gray-100 p-8 md:p-10 flex flex-col md:flex-row items-center gap-10 animate-pulse">
            <div className="space-y-4 min-w-[200px]">
                <div className="flex gap-2">
                    <div className="h-5 w-20 bg-gray-100 rounded-full" />
                    <div className="h-5 w-24 bg-gray-100 rounded-full" />
                </div>
                <div className="space-y-2">
                    <div className="h-3 w-32 bg-gray-50 rounded" />
                    <div className="h-8 w-24 bg-gray-100 rounded" />
                </div>
            </div>
            <div className="flex-1 flex gap-4">
                <div className="w-20 h-20 bg-gray-100 rounded-2xl" />
                <div className="w-20 h-20 bg-gray-100 rounded-2xl" />
                <div className="w-20 h-20 bg-gray-100 rounded-2xl" />
            </div>
            <div className="h-14 w-40 bg-gray-100 rounded-2xl" />
        </div>
    );
}

export function WishlistSkeleton() {
    return (
        <div className="space-y-6 animate-pulse">
            <div className="aspect-[4/5] bg-gray-100 rounded-[32px] w-full" />
            <div className="space-y-3">
                <div className="h-4 w-1/2 bg-gray-100 rounded-lg mx-auto" />
                <div className="h-4 w-1/4 bg-gray-100 rounded-lg mx-auto" />
            </div>
        </div>
    );
}
