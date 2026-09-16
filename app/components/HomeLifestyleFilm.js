import Link from "next/link";
import { HOME_CONTAINER } from "@/lib/siteLayout";
import LazyVideo from "./LazyVideo";

const CLIPS = [
    {
        id: "wear",
        src: "/videos/necklace-wear.mp4",
        webmSrc: "/videos/necklace-wear.webm",
        poster: "/videos/necklace-wear-poster.jpg",
        label: "Everyday wear",
        aspect: "aspect-[3/4] md:aspect-[4/5]",
    },
    {
        id: "flatlay",
        src: "/videos/jewelry-flatlay.mp4",
        poster: "/videos/jewelry-flatlay-poster.jpg",
        label: "Gold details",
        aspect: "aspect-[16/10] md:aspect-[4/5]",
    },
    {
        id: "earrings",
        src: "/videos/earring-model.mp4",
        poster: "/videos/earring-model-poster.jpg",
        label: "Earring edit",
        aspect: "aspect-[16/10] md:aspect-[4/5]",
    },
];

/**
 * Theme-matching jewellery lifestyle films — muted, lazy-loaded loops.
 */
export default function HomeLifestyleFilm() {
    return (
        <section
            className="bg-[#fdfbf7] py-14 md:py-20 lg:py-24 border-t border-[#efeae4]"
            aria-label="Lifestyle films"
        >
            <div className={HOME_CONTAINER}>
                <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-5 mb-8 md:mb-12">
                    <div className="max-w-xl">
                        <p
                            className="text-[11px] font-medium tracking-[0.2em] uppercase mb-3"
                            style={{ color: "#b89a6a" }}
                        >
                            In motion
                        </p>
                        <h2 className="font-playfair text-3xl sm:text-4xl md:text-[2.65rem] font-medium text-[#2a2724] tracking-tight leading-[1.12]">
                            Shine you can{" "}
                            <em className="italic font-normal" style={{ color: "#b89a6a" }}>
                                live in
                            </em>
                        </h2>
                        <p className="mt-3 text-[14px] sm:text-[15px] text-[#6b6560] leading-relaxed max-w-md">
                            Soft gold moments — lightweight pieces made for real days, not just special
                            ones.
                        </p>
                    </div>
                    <Link
                        href="/shop"
                        className="inline-flex min-h-11 items-center text-[11px] font-semibold tracking-[0.14em] uppercase text-[#2a2724] hover:text-[#E91E63] transition-colors"
                    >
                        Shop the look →
                    </Link>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-5">
                    {CLIPS.map((clip, index) => (
                        <figure key={clip.id} className={index === 0 ? "md:col-span-1" : ""}>
                            <LazyVideo
                                src={clip.src}
                                webmSrc={clip.webmSrc}
                                poster={clip.poster}
                                className={`${clip.aspect} rounded-[1.5rem] md:rounded-[1.75rem] bg-[#efeae4]`}
                                ariaLabel={clip.label}
                                rootMargin={index === 0 ? "120px 0px" : "240px 0px"}
                            />
                            <figcaption className="mt-3 px-1 text-[11px] font-medium tracking-[0.16em] uppercase text-[#a39e97]">
                                {clip.label}
                            </figcaption>
                        </figure>
                    ))}
                </div>
            </div>
        </section>
    );
}
