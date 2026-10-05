"use client";

import { useLayoutEffect, useRef, useState } from "react";

export default function RevealOnScroll({ children, className = "", delay = 0, startVisible = false }) {
    const ref = useRef(null);
    const [visible, setVisible] = useState(startVisible);

    useLayoutEffect(() => {
        const el = ref.current;
        if (!el || visible) return undefined;

        if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
            setVisible(true);
            return undefined;
        }

        const rect = el.getBoundingClientRect();
        if (rect.top < window.innerHeight && rect.bottom > 0) {
            setVisible(true);
            return undefined;
        }

        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting) {
                    setVisible(true);
                    observer.disconnect();
                }
            },
            { threshold: 0.01, rootMargin: "120px 0px 120px 0px" }
        );

        observer.observe(el);
        return () => observer.disconnect();
    }, [visible]);

    return (
        <div
            ref={ref}
            className={`reveal-on-scroll ${visible ? "is-visible" : ""} ${className}`}
            style={delay ? { transitionDelay: `${delay}ms` } : undefined}
        >
            {children}
        </div>
    );
}
