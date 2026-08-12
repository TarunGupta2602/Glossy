"use client";

import { createContext, useCallback, useContext, useMemo, useRef, useState } from "react";

const ToastContext = createContext({
    toast: null,
    showToast: () => {},
    hideToast: () => {},
});

export function ToastProvider({ children }) {
    const [toast, setToast] = useState(null);
    const timerRef = useRef(null);

    const hideToast = useCallback(() => setToast(null), []);

    const showToast = useCallback((message, options = {}) => {
        const id = Date.now();
        setToast({
            id,
            message,
            href: options.href || null,
            hrefLabel: options.hrefLabel || "View",
            tone: options.tone || "default",
        });
        if (timerRef.current) window.clearTimeout(timerRef.current);
        timerRef.current = window.setTimeout(() => {
            setToast((current) => (current?.id === id ? null : current));
        }, options.duration ?? 2800);
    }, []);

    const value = useMemo(
        () => ({ toast, showToast, hideToast }),
        [toast, showToast, hideToast]
    );

    return (
        <ToastContext.Provider value={value}>{children}</ToastContext.Provider>
    );
}

export function useToast() {
    return useContext(ToastContext);
}
