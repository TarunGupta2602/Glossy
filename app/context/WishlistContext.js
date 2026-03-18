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

        const { data, error } = await supabase
            .from("wishlist_items")
            .select(`
                product:products (
                    *,
                    categories(name)
                )
            `)
            .eq("user_id", user.id);

        if (error) {
            console.error("Error fetching wishlist from DB:", error.message);
        } else {
            const formattedWishlist = data.map(item => ({
                id: item.product.id,
                name: item.product.name,
                price: item.product.price,
                image: item.product.main_image || "/placeholder.jpg",
                category: item.product.categories?.name || "Jewelry"
            }));
            setWishlist(formattedWishlist);
        }
    }, [user]);

    // Initial load: either from DB or localStorage
    useEffect(() => {
        const loadInitialWishlist = async () => {
            if (user) {
                await fetchDBWishlist();
                // Sync local items manually right after login if they exist
                const localWishString = localStorage.getItem("glossy-wishlist");
                if (localWishString) {
                    try {
                        const localWish = JSON.parse(localWishString);
                        if (localWish.length > 0) {
                            await syncLocalWishlistToDB(localWish);
                            localStorage.removeItem("glossy-wishlist");
                        }
                    } catch (e) {
                        console.error("Failed to parse local wishlist for sync", e);
                    }
                }
            } else {
                const savedWishlist = localStorage.getItem("glossy-wishlist");
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
            localStorage.setItem("glossy-wishlist", JSON.stringify(wishlist));
        }
    }, [wishlist, isInitialized, user]);

    const syncLocalWishlistToDB = async (localWish) => {
        if (!user || localWish.length === 0) return;

        const itemsToInsert = localWish.map(item => ({
            user_id: user.id,
            product_id: item.id
        }));

        const { error } = await supabase
            .from("wishlist_items")
            .upsert(itemsToInsert, { onConflict: 'user_id,product_id' });

        if (error) console.error("Wishlist Sync Error:", error.message);
        await fetchDBWishlist();
    };

    const addToWishlist = async (product) => {
        if (user) {
            const { error } = await supabase
                .from("wishlist_items")
                .upsert({
                    user_id: user.id,
                    product_id: product.id
                }, { onConflict: 'user_id,product_id' });

            if (!error) await fetchDBWishlist();
        } else {
            setWishlist((prev) => {
                if (prev.some((item) => item.id === product.id)) return prev;
                return [...prev, product];
            });
        }
    };

    const removeFromWishlist = async (productId) => {
        if (user) {
            const { error } = await supabase
                .from("wishlist_items")
                .delete()
                .eq("user_id", user.id)
                .eq("product_id", productId);

            if (!error) await fetchDBWishlist();
        } else {
            setWishlist((prev) => prev.filter((item) => item.id !== productId));
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
