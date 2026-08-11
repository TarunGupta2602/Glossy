"use client";

import { useEffect, useRef } from "react";

const AWAY_MESSAGES = [
    "Come back ❤️",
    "You left this 👀",
    "Wait — don't go! ✨",
    "Your bag misses you 🛍️",
    "Still deciding? 💎",
    "We saved your sparkle ✨",
    "Miss you already 💗",
    "Buy 2 Get 1 Free awaits 🎁",
];

/**
 * Changes the browser tab title while the user is on another tab,
 * to nudge them back to the store.
 */
export default function TabTeaser() {
    const originalTitleRef = useRef("");
    const indexRef = useRef(0);
    const intervalRef = useRef(null);

    useEffect(() => {
        originalTitleRef.current = document.title;

        const clearAway = () => {
            if (intervalRef.current) {
                clearInterval(intervalRef.current);
                intervalRef.current = null;
            }
        };

        const startAway = () => {
            originalTitleRef.current = document.title;
            indexRef.current = Math.floor(Math.random() * AWAY_MESSAGES.length);
            document.title = AWAY_MESSAGES[indexRef.current];

            clearAway();
            intervalRef.current = setInterval(() => {
                indexRef.current = (indexRef.current + 1) % AWAY_MESSAGES.length;
                document.title = AWAY_MESSAGES[indexRef.current];
            }, 2800);
        };

        const restore = () => {
            clearAway();
            if (originalTitleRef.current) {
                document.title = originalTitleRef.current;
            }
        };

        const onVisibility = () => {
            if (document.hidden) {
                startAway();
            } else {
                restore();
            }
        };

        document.addEventListener("visibilitychange", onVisibility);

        return () => {
            document.removeEventListener("visibilitychange", onVisibility);
            clearAway();
            if (originalTitleRef.current) {
                document.title = originalTitleRef.current;
            }
        };
    }, []);

    return null;
}
