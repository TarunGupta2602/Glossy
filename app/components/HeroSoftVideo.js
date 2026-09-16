"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { IMAGE_BLUR_DATA_URL } from "@/lib/imageBlur";

/**
 * Soft looping hero film: poster Image is LCP; muted video fades in once playing.
 * Reduced-motion: poster only (video never loads).
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
        if (!node || typeof IntersectionObserver === "undefined") {
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
            { rootMargin: "160px", threshold: 0.01 }
        );
        io.observe(node);
        return () => io.disconnect();
    }, []);

    useEffect(() => {
        const video = videoRef.current;
        if (!video || !shouldLoad) return;

        let cancelled = false;

        const markPlaying = () => {
            if (!cancelled) setReady(true);
        };

        const tryPlay = () => {
            const playPromise = video.play();
            if (playPromise?.then) {
                playPromise.then(markPlaying).catch(() => {
                    // Autoplay blocked — keep poster visible
                });
            } else {
                markPlaying();
            }
        };

        video.addEventListener("playing", markPlaying);
        video.addEventListener("loadeddata", tryPlay);
        // Force load after <source> mounts (preload=auto alone can stall on some mobile)
        video.load();
        if (video.readyState >= 2) tryPlay();

        return () => {
            cancelled = true;
            video.removeEventListener("playing", markPlaying);
            video.removeEventListener("loadeddata", tryPlay);
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
                autoPlay
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
