"use client";

import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";

const OverlayContext = createContext({
    register: () => {},
    unregister: () => {},
    isOverlayOpen: false,
});

export function OverlayProvider({ children }) {
    const [count, setCount] = useState(0);

    const register = useCallback(() => {
        setCount((c) => c + 1);
    }, []);

    const unregister = useCallback(() => {
        setCount((c) => Math.max(0, c - 1));
    }, []);

    const value = useMemo(
        () => ({
            register,
            unregister,
            isOverlayOpen: count > 0,
        }),
        [count, register, unregister]
    );

    return (
        <OverlayContext.Provider value={value}>
            {children}
        </OverlayContext.Provider>
    );
}

export function useOverlay() {
    return useContext(OverlayContext);
}

/** Register an open overlay so the WhatsApp FAB can hide behind/under it. */
export function useOverlayOpen(isOpen) {
    const { register, unregister } = useOverlay();

    useEffect(() => {
        if (!isOpen) return undefined;
        register();
        return () => unregister();
    }, [isOpen, register, unregister]);
}
