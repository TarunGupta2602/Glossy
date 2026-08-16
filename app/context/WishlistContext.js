"use client";

import { createContext, useContext, useState, useEffect, useCallback } from "react";
import { useAuth } from "./AuthContext";
import { authFetch } from "@/lib/adminApi";

const WishlistContext = createContext();

export function WishlistProvider({ children }) {
    const [wishlist, setWishlist] = useState([]);
    const [isInitialized, setIsInitialized] = useState(false);
    const { user } = useAuth();

    const fetchDBWishlist = useCallback(async () => {
        if (!user) return;

        try {
            const response = await authFetch("/api/wishlist");
            const data = await response.json();

            if (data.success) {
                setWishlist(data.wishlist || []);
            } else {
                console.error("Error fetching wishlist from API:", data.error);
            }
        } catch (error) {
            console.error("Wishlist fetch error:", error);
        }
    }, [user]);

    const syncLocalWishlistToDB = useCallback(
        async (localWish) => {
            if (!user || localWish.length === 0) return;

            try {
                for (const item of localWish) {
                    await authFetch("/api/wishlist", {
                        method: "POST",
                        body: JSON.stringify({ productId: item.id, action: "add" }),
                    });
                }
                await fetchDBWishlist();
            } catch (error) {
                console.error("Wishlist sync error:", error);
            }
        },
        [user, fetchDBWishlist]
    );

    useEffect(() => {
        const loadInitialWishlist = async () => {
            if (user) {
                await fetchDBWishlist();
                const localWishString = localStorage.getItem("theluxejewels-wishlist");
                if (localWishString) {
                    try {
                        const localWish = JSON.parse(localWishString);
                        if (localWish.length > 0) {
                            await syncLocalWishlistToDB(localWish);
                            localStorage.removeItem("theluxejewels-wishlist");
                        }
                    } catch (e) {
                        console.error("Failed to parse local wishlist for sync", e);
                    }
                }
            } else {
                const savedWishlist = localStorage.getItem("theluxejewels-wishlist");
                if (savedWishlist) {
                    try {
                        setWishlist(JSON.parse(savedWishlist));
                    } catch {
                        setWishlist([]);
                    }
                } else {
                    setWishlist([]);
                }
            }
            setIsInitialized(true);
        };

        loadInitialWishlist();
    }, [user, fetchDBWishlist, syncLocalWishlistToDB]);

    useEffect(() => {
        if (isInitialized && !user) {
            localStorage.setItem("theluxejewels-wishlist", JSON.stringify(wishlist));
        }
    }, [wishlist, isInitialized, user]);

    const addToWishlist = async (product) => {
        const previousWishlist = [...wishlist];
        setWishlist((prev) => {
            if (prev.some((item) => item.id === product.id)) return prev;
            return [...prev, product];
        });

        if (user) {
            try {
                const response = await authFetch("/api/wishlist", {
                    method: "POST",
                    body: JSON.stringify({ productId: product.id, action: "add" }),
                });

                const data = await response.json();
                if (!data.success) {
                    console.error("Wishlist Add Error:", data.error);
                    setWishlist(previousWishlist);
                } else {
                    await fetchDBWishlist();
                }
            } catch (error) {
                console.error("Wishlist context add error:", error);
                setWishlist(previousWishlist);
            }
        }
    };

    const removeFromWishlist = async (productId) => {
        const previousWishlist = [...wishlist];
        setWishlist((prev) => prev.filter((item) => item.id !== productId));

        if (user) {
            try {
                const response = await authFetch("/api/wishlist", {
                    method: "POST",
                    body: JSON.stringify({ productId, action: "remove" }),
                });

                const data = await response.json();
                if (!data.success) {
                    console.error("Wishlist Remove Error:", data.error);
                    setWishlist(previousWishlist);
                } else {
                    await fetchDBWishlist();
                }
            } catch (error) {
                console.error("Wishlist context remove error:", error);
                setWishlist(previousWishlist);
            }
        }
    };

    const isInWishlist = (productId) => {
        return wishlist.some((item) => item.id === productId);
    };

    const toggleWishlist = async (product) => {
        if (isInWishlist(product.id)) {
            await removeFromWishlist(product.id);
        } else {
            await addToWishlist(product);
        }
    };

    return (
        <WishlistContext.Provider
            value={{
                wishlist,
                addToWishlist,
                removeFromWishlist,
                isInWishlist,
                toggleWishlist,
                isInitialized,
            }}
        >
            {children}
        </WishlistContext.Provider>
    );
}

export function useWishlist() {
    const context = useContext(WishlistContext);
    if (context === undefined) {
        throw new Error("useWishlist must be used within a WishlistProvider");
    }
    return context;
}
