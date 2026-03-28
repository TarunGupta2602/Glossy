"use client";

import { createContext, useContext, useState, useEffect, useCallback } from "react";
import { supabase } from "@/lib/supabaseClient";
import { useAuth } from "./AuthContext";

const WishlistContext = createContext();

export function WishlistProvider({ children }) {
    const [wishlist, setWishlist] = useState([]);
    const [isInitialized, setIsInitialized] = useState(false);
    const { user } = useAuth();

    // Fetch wishlist from database for authenticated users
    const fetchDBWishlist = useCallback(async () => {
        if (!user) return;

        try {
            const response = await fetch(`/api/wishlist?userId=${user.id}`);
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




    // Initial load: either from DB or localStorage
    useEffect(() => {
        const loadInitialWishlist = async () => {
            if (user) {
                await fetchDBWishlist();
                // Sync local items manually right after login if they exist
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
                    } catch (e) {
                        setWishlist([]);
                    }
                } else {
                    setWishlist([]);
                }
            }
            setIsInitialized(true);
        };

        loadInitialWishlist();
    }, [user, fetchDBWishlist]);

    // Save Guest wishlist to localStorage ONLY if user is not logged in
    useEffect(() => {
        if (isInitialized && !user) {
            localStorage.setItem("theluxejewels-wishlist", JSON.stringify(wishlist));
        }
    }, [wishlist, isInitialized, user]);

    const syncLocalWishlistToDB = async (localWish) => {
        if (!user || localWish.length === 0) return;

        try {
            // Synchronize each item via the API
            for (const item of localWish) {
                await fetch("/api/wishlist", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ userId: user.id, productId: item.id, action: "add" }),
                });
            }
            await fetchDBWishlist();
        } catch (error) {
            console.error("Wishlist sync error:", error);
        }
    };


    const addToWishlist = async (product) => {
        // Optimistic update
        const previousWishlist = [...wishlist];
        setWishlist((prev) => {
            if (prev.some((item) => item.id === product.id)) return prev;
            return [...prev, product];
        });

        if (user) {
            try {
                const response = await fetch("/api/wishlist", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ userId: user.id, productId: product.id, action: "add" }),
                });

                const data = await response.json();
                if (!data.success) {
                    console.error("Wishlist Add Error:", data.error);
                    setWishlist(previousWishlist); // Revert on error
                } else {
                    await fetchDBWishlist();
                }
            } catch (error) {
                console.error("Wishlist context add error:", error);
                setWishlist(previousWishlist);
            }
        }

        // Guest mode is already handled by the state update above and the useEffect for localStorage
    };

    const removeFromWishlist = async (productId) => {
        // Optimistic update
        const previousWishlist = [...wishlist];
        setWishlist((prev) => prev.filter((item) => item.id !== productId));

        if (user) {
            try {
                const response = await fetch("/api/wishlist", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ userId: user.id, productId: productId, action: "remove" }),
                });

                const data = await response.json();
                if (!data.success) {
                    console.error("Wishlist Remove Error:", data.error);
                    setWishlist(previousWishlist); // Revert on error
                } else {
                    await fetchDBWishlist();
                }
            } catch (error) {
                console.error("Wishlist context remove error:", error);
                setWishlist(previousWishlist);
            }
        }

        // Guest mode handled by state update
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
        <WishlistContext.Provider value={{ wishlist, addToWishlist, removeFromWishlist, isInWishlist, toggleWishlist, isInitialized }}>
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
