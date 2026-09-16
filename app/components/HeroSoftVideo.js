"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { IMAGE_BLUR_DATA_URL } from "@/lib/imageBlur";

/** Poster first (LCP). Soft muted loop fades in when ready. Reduced-motion = image only. */
export default function HeroSoftVideo({
    src,
    poster,
    alt,
    className = "object-cover object-center",
    sizes = "600px",
    priority = false,
}) {
    const videoRef = useRef(null);
    const [shouldLoad, setShouldLoad] = useState(false);
    const [ready, setReady] = useState(false);

    useEffect(() => {
        if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

        const node = videoRef.current?.parentElement;
        if (!node) {
            setShouldLoad(true);
            return;
        }

        const io = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting) {
                    setShouldLoad(true);
                    io.disconnect();
                }
            },
            { rootMargin: "120px" }
        );
        io.observe(node);
        return () => io.disconnect();
    }, []);

    useEffect(() => {
        const video = videoRef.current;
        if (!video || !shouldLoad) return;

        const onPlaying = () => setReady(true);
        const start = () => {
            video.play()?.catch(() => {});
        };

        video.addEventListener("playing", onPlaying);
        video.addEventListener("loadeddata", start);
        video.load();
        if (video.readyState >= 2) start();

        return () => {
            video.removeEventListener("playing", onPlaying);
            video.removeEventListener("loadeddata", start);
            video.pause();
        };
    }, [shouldLoad]);

    return (
        <div className="absolute inset-0">
            <Image
                src={poster}
                alt={alt}
                fill
                priority={priority}
                sizes={sizes}
                quality={90}
                placeholder="blur"
                blurDataURL={IMAGE_BLUR_DATA_URL}
                className={`${className} transition-opacity duration-700 ${
                    ready ? "opacity-0" : "opacity-100"
                }`}
            />
            <video
                ref={videoRef}
                className={`absolute inset-0 h-full w-full ${className} transition-opacity duration-1000 ${
                    ready ? "opacity-100" : "opacity-0"
                }`}
                muted
                playsInline
                loop
                preload={shouldLoad ? "auto" : "none"}
                poster={poster}
                aria-hidden="true"
                tabIndex={-1}
            >
                {shouldLoad ? <source src={src} type="video/mp4" /> : null}
            </video>
        </div>
    );
}
