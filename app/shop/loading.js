import ShopGridSkeleton from "../components/ShopGridSkeleton";
import { SITE_CONTAINER } from "@/lib/siteLayout";

export default function ShopLoading() {
    return (
        <main className="min-h-screen bg-white pb-32 pt-10">
            <div className={SITE_CONTAINER}>
                <div className="h-4 w-48 bg-gray-100 rounded animate-pulse mb-16" />
                <div className="h-10 w-72 bg-gray-100 rounded animate-pulse mx-auto mb-8" />
                <ShopGridSkeleton count={9} />
            </div>
        </main>
    );
}
