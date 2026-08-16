"use client";

import { useEffect, useRef } from "react";

/**
 * Shared Google Identity button — must stay outside page components so it
 * does not remount on every parent render.
 */
export default function GoogleSignInButton({
    className = "w-full h-[50px] flex justify-center",
    text = "continue_with",
    width,
}) {
    const buttonRef = useRef(null);

    useEffect(() => {
        const render = () => {
            const el = buttonRef.current;
            if (!el || !window.google?.accounts?.id) return;
            el.innerHTML = "";
            const w = width || Math.max(240, Math.min(el.offsetWidth || 320, 400));
            window.google.accounts.id.renderButton(el, {
                theme: "outline",
                size: "large",
                text,
                shape: "pill",
                width: w,
            });
        };

        const frame = requestAnimationFrame(() => {
            requestAnimationFrame(render);
        });

        const interval = setInterval(() => {
            if (window.google?.accounts?.id) {
                render();
                clearInterval(interval);
            }
        }, 400);

        return () => {
            cancelAnimationFrame(frame);
            clearInterval(interval);
        };
    }, [text, width]);

    return <div ref={buttonRef} className={className} />;
}
