import Image from "next/image";
import Link from "next/link";
import { HOME_CONTAINER } from "@/lib/siteLayout";
import { IMAGE_BLUR_DATA_URL } from "@/lib/imageBlur";

/** Soft rounded collection edits — Born-style calm tiles. */
export default function HomeCollections({ collections = [] }) {
    if (!collections.length) return null;

    const items = collections.slice(0, 5);

    return (
        <section className="bg-white py-14 md:py-20">
            <div className={HOME_CONTAINER}>
                <div className="flex items-end justify-between gap-4 mb-8 md:mb-12">
                    <div>
                        <p
                            className="text-[11px] font-medium tracking-[0.2em] uppercase mb-3"
                            style={{ color: "#b89a6a" }}
                        >
                            Explore
                        </p>
                        <h2 className="text-3xl sm:text-4xl font-playfair font-medium text-gray-900 tracking-tight">
                            Shop by <em className="italic font-normal" style={{ color: "#b89a6a" }}>edit</em>
                        </h2>
                    </div>
                    <Link
                        href="/collection"
                        className="text-[11px] font-semibold tracking-[0.14em] uppercase text-gray-500 hover:text-[#E91E63] transition-colors min-h-11 inline-flex items-center"
                    >
                        View all
                    </Link>
                </div>

                <div
                    className="flex md:grid md:grid-cols-5 gap-4 md:gap-5 overflow-x-auto md:overflow-visible no-scrollbar snap-x snap-mandatory pb-1"
                >
                    {items.map((item, index) => {
                        const title = item.label || item.name;
                        return (
                            <Link
                                key={item.href}
                                href={item.href}
                                className="group shrink-0 w-[42vw] max-w-[200px] md:w-auto md:max-w-none snap-start"
                            >
                                <div className="relative aspect-[3/4] overflow-hidden rounded-2xl md:rounded-[1.5rem] bg-[#efeae4] mb-3.5">
                                    <Image
                                        src={item.image || "/logo.png"}
                                        alt={title}
                                        fill
                                        sizes="(max-width: 768px) 42vw, 18vw"
                                        quality={index < 2 ? 78 : 65}
                                        placeholder="blur"
                                        blurDataURL={IMAGE_BLUR_DATA_URL}
                                        className="object-cover transition-transform duration-700 ease-out group-hover:scale-[1.04]"
                                    />
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/35 via-transparent to-transparent opacity-80" />
                                    <span className="absolute bottom-3 left-3 right-3 font-playfair text-white text-lg tracking-tight drop-shadow-sm">
                                        {title}
                                    </span>
                                </div>
                                <p className="text-[11px] font-semibold tracking-[0.14em] uppercase text-gray-500 group-hover:text-[#E91E63] transition-colors px-0.5">
                                    Shop {title.toLowerCase()}
                                </p>
                            </Link>
                        );
                    })}
                </div>
            </div>
        </section>
    );
}
