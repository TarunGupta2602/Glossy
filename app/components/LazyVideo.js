"use client";

import { useEffect, useRef, useState } from "react";

/**
 * Muted autoplay loop that only loads media when near the viewport.
 * Poster stays visible until the video can play — keeps LCP/bandwidth low.
 */
export default function LazyVideo({
    src,
    webmSrc,
    poster,
    className = "",
    videoClassName = "absolute inset-0 h-full w-full object-cover",
    rootMargin = "180px 0px",
    ariaLabel,
}) {
    const ref = useRef(null);
    const videoRef = useRef(null);
    const [shouldLoad, setShouldLoad] = useState(false);
    const [ready, setReady] = useState(false);

    useEffect(() => {
        const node = ref.current;
        if (!node || shouldLoad) return;

        if (typeof IntersectionObserver === "undefined") {
            const id = window.setTimeout(() => setShouldLoad(true), 0);
            return () => window.clearTimeout(id);
        }

        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting) {
                    setShouldLoad(true);
                    observer.disconnect();
                }
            },
            { rootMargin }
        );
        observer.observe(node);
        return () => observer.disconnect();
    }, [shouldLoad, rootMargin]);

    useEffect(() => {
        const video = videoRef.current;
        if (!video || !shouldLoad) return;

        const tryPlay = () => {
            const playPromise = video.play();
            if (playPromise?.catch) playPromise.catch(() => {});
        };

        const onCanPlay = () => {
            setReady(true);
            tryPlay();
        };

        video.addEventListener("canplay", onCanPlay);

        let readyTimer;
        if (video.readyState >= 3) {
            readyTimer = window.setTimeout(onCanPlay, 0);
        }

        const onVisibility = () => {
            if (document.hidden) {
                video.pause();
            } else {
                tryPlay();
            }
        };
        document.addEventListener("visibilitychange", onVisibility);

        return () => {
            video.removeEventListener("canplay", onCanPlay);
            document.removeEventListener("visibilitychange", onVisibility);
            if (readyTimer) window.clearTimeout(readyTimer);
        };
    }, [shouldLoad]);

    return (
        <div ref={ref} className={`relative overflow-hidden ${className}`}>
            {poster ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                    src={poster}
                    alt=""
                    aria-hidden="true"
                    decoding="async"
                    className={`absolute inset-0 h-full w-full object-cover transition-opacity duration-700 ${
                        ready ? "opacity-0" : "opacity-100"
                    }`}
                />
            ) : null}

            {shouldLoad ? (
                <video
                    ref={videoRef}
                    className={`${videoClassName} transition-opacity duration-700 ${
                        ready ? "opacity-100" : "opacity-0"
                    }`}
                    muted
                    playsInline
                    loop
                    autoPlay
                    preload="metadata"
                    poster={poster}
                    aria-label={ariaLabel}
                >
                    {webmSrc ? <source src={webmSrc} type="video/webm" /> : null}
                    <source src={src} type="video/mp4" />
                </video>
            ) : null}
        </div>
    );
}
