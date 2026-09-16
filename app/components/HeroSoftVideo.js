"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { IMAGE_BLUR_DATA_URL } from "@/lib/imageBlur";

/**
 * Soft looping hero film: poster Image is LCP; muted video fades in once ready.
 */
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
        const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
        if (reduce) return;

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

        const onCanPlay = () => {
            setReady(true);
            const playPromise = video.play();
            if (playPromise?.catch) playPromise.catch(() => {});
        };

        video.addEventListener("canplay", onCanPlay);
        if (video.readyState >= 3) onCanPlay();

        return () => {
            video.removeEventListener("canplay", onCanPlay);
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
                preload={shouldLoad ? "metadata" : "none"}
                poster={poster}
                aria-hidden="true"
                tabIndex={-1}
            >
                {shouldLoad ? <source src={src} type="video/mp4" /> : null}
            </video>
        </div>
    );
}
