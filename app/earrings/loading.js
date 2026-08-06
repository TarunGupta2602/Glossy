import ShopGridSkeleton from "../components/ShopGridSkeleton";
import { SITE_CONTAINER } from "@/lib/siteLayout";

export default function EarringsLoading() {
    return (
        <section className="py-24 bg-white">
            <div className={SITE_CONTAINER}>
                <div className="h-10 w-72 bg-gray-100 rounded animate-pulse mx-auto mb-12" />
                <ShopGridSkeleton count={8} />
            </div>
        </section>
    );
}
