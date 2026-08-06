import ShopGridSkeleton from "../../components/ShopGridSkeleton";
import { SITE_CONTAINER } from "@/lib/siteLayout";

export default function CategoryLoading() {
    return (
        <section className="py-24 bg-white">
            <div className={SITE_CONTAINER}>
                <div className="h-64 bg-gray-100 rounded-3xl animate-pulse mb-12" />
                <div className="h-10 w-64 bg-gray-100 rounded animate-pulse mx-auto mb-12" />
                <ShopGridSkeleton count={8} />
            </div>
        </section>
    );
}
