import Image from "next/image";
import Link from "next/link";
import { HOME_CONTAINER } from "@/lib/siteLayout";

export default function HomeCollections({ collections = [] }) {
    if (!collections.length) return null;

    return (
        <section className="py-8 md:py-14 bg-white">
            <div className={HOME_CONTAINER}>
                <div className="text-center mb-6 md:mb-10 px-2">
                    <h2 className="text-xs sm:text-base md:text-lg font-semibold tracking-[0.18em] sm:tracking-[0.22em] uppercase text-gray-900">
                        Everyday Luxe Collection
                    </h2>
                </div>

                <div className="flex justify-start md:justify-center gap-4 sm:gap-8 md:gap-10 overflow-x-auto no-scrollbar snap-x snap-mandatory pb-1 -mx-4 px-4 md:mx-0 md:px-0">
                    {collections.map((item) => (
                        <Link
                            key={item.href}
                            href={item.href}
                            className="group flex flex-col items-center gap-2.5 sm:gap-3 shrink-0 w-[76px] sm:w-[104px] md:w-[120px] snap-start"
                        >
                            <span className="relative block w-[76px] h-[76px] sm:w-[104px] sm:h-[104px] md:w-[120px] md:h-[120px] rounded-full overflow-hidden bg-[#f5f0eb] ring-1 ring-black/5 transition-transform duration-500 group-active:scale-95 sm:group-hover:scale-[1.04]">
                                <Image
                                    src={item.image || "/logo.png"}
                                    alt={item.label}
                                    fill
                                    sizes="120px"
                                    quality={75}
                                    className="object-cover"
                                />
                            </span>
                            <span className="text-[10px] sm:text-xs md:text-[13px] font-medium text-gray-900 text-center leading-snug tracking-wide">
                                {item.label}
                            </span>
                        </Link>
                    ))}
                </div>
            </div>
        </section>
    );
}
