export function ProfileHeaderSkeleton() {
    return (
        <div className="relative animate-pulse">
            <div className="flex flex-col md:flex-row items-center md:items-end justify-between gap-10">
                <div className="flex flex-col md:flex-row items-center md:items-start gap-12">
                    <div className="w-40 h-40 rounded-full bg-gray-100 border border-gray-50" />
                    <div className="space-y-4 text-center md:text-left">
                        <div className="h-4 w-32 bg-gray-100 rounded-full mx-auto md:mx-0" />
                        <div className="h-16 w-64 bg-gray-100 rounded-2xl mx-auto md:mx-0" />
                        <div className="h-4 w-48 bg-gray-100 rounded-full mx-auto md:mx-0" />
                    </div>
                </div>
                <div className="w-64 h-32 bg-gray-50 rounded-[40px] border border-gray-100" />
            </div>
        </div>
    );
}

export function OrderCardSkeleton() {
    return (
        <div className="group bg-white rounded-[40px] border border-gray-50 p-12 flex flex-col xl:flex-row gap-12 animate-pulse">
            <div className="xl:w-1/4 space-y-6">
                <div className="flex gap-3">
                    <div className="h-6 w-20 bg-gray-100 rounded-full" />
                    <div className="h-6 w-24 bg-gray-100 rounded-full" />
                </div>
                <div className="space-y-3">
                    <div className="h-3 w-32 bg-gray-50 rounded" />
                    <div className="h-12 w-40 bg-gray-100 rounded-xl" />
                </div>
            </div>
            <div className="flex-1 space-y-8">
                <div className="flex gap-4">
                    <div className="w-24 h-24 bg-gray-100 rounded-3xl" />
                    <div className="w-24 h-24 bg-gray-100 rounded-3xl" />
                    <div className="w-24 h-24 bg-gray-100 rounded-3xl" />
                </div>
                <div className="h-14 w-48 bg-gray-100 rounded-full" />
            </div>
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
