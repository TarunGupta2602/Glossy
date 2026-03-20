"use client";

import { createContext, useContext, useState, useEffect, useCallback } from "react";
import { supabase } from "@/lib/supabaseClient";
import { useAuth } from "./AuthContext";

const CartContext = createContext();

export function CartProvider({ children }) {
    const [cart, setCart] = useState([]);
    const [isInitialized, setIsInitialized] = useState(false);
    const { user } = useAuth();

    // Fetch cart from database for authenticated users
    const fetchDBCart = useCallback(async () => {
        // Disabled database fetch to prevent RLS recursion error for now
        return;
        /*
        if (!user) return;

        const { data, error } = await supabase
            .from("cart_items")
            .select(`
                quantity,
                product:products (
                    *,
                    categories(name)
                )
            `)
            .eq("user_id", user.id);

        if (error) {
            console.error("Error fetching cart from DB:", error.message);
        } else {
            const formattedCart = data.map(item => ({
                id: item.product.id,
                name: item.product.name,
                price: item.product.price,
                image: item.product.main_image || "/placeholder.jpg",
                category: item.product.categories?.name || "Jewelry",
                quantity: item.quantity
            }));
            setCart(formattedCart);
        }
        */
    }, [user]);

    // Initial load: either from DB or localStorage
    useEffect(() => {
        const loadInitialCart = async () => {
            if (user) {
                await fetchDBCart();
                // Sync local items ONLY manually right after login if they exist
                const localCartString = localStorage.getItem("glossy-cart");
                if (localCartString) {
                    try {
                        const localCart = JSON.parse(localCartString);
                        if (localCart.length > 0) {
                            await syncLocalCartToDB(localCart);
                            localStorage.removeItem("glossy-cart");
                        }
                    } catch (e) {
                        console.error("Failed to parse local cart for sync", e);
                    }
                }
            } else {
                // If we just logged out (isInitialized was true and now user is null)
                // we should reload the local cart (which should be empty or have guest items)
                const savedCart = localStorage.getItem("glossy-cart");
                if (savedCart) {
                    try {
                        setCart(JSON.parse(savedCart));
                    } catch (e) {
                        setCart([]);
                    }
                } else {
                    setCart([]);
                }
            }
            setIsInitialized(true);
        };

        loadInitialCart();
    }, [user, fetchDBCart]);

    // Save Guest cart to localStorage ONLY if user is not logged in
    useEffect(() => {
        if (isInitialized && !user) {
            localStorage.setItem("glossy-cart", JSON.stringify(cart));
        }
    }, [cart, isInitialized, user]);

    const syncLocalCartToDB = async (localCart) => {
        if (!user || localCart.length === 0) return;

        for (const item of localCart) {
            const { error } = await supabase
                .from("cart_items")
                .upsert({
                    user_id: user.id,
                    product_id: item.id,
                    quantity: item.quantity
                }, { onConflict: 'user_id,product_id' });

            if (error) console.error("Sync Error:", error.message);
        }
        await fetchDBCart();
    };

    const addToCart = async (product, quantity = 1) => {
        const previousCart = [...cart];

        // Optimistic local update
        setCart((prevCart) => {
            const existingItem = prevCart.find((item) => item.id === product.id);
            if (existingItem) {
                return prevCart.map((item) =>
                    item.id === product.id
                        ? { ...item, quantity: item.quantity + quantity }
                        : item
                );
            }
            return [...prevCart, { ...product, quantity }];
        });

        if (user) {
            const { error } = await supabase
                .from("cart_items")
                .upsert({
                    user_id: user.id,
                    product_id: product.id,
                    quantity: (cart.find(i => i.id === product.id)?.quantity || 0) + quantity
                }, { onConflict: 'user_id,product_id' });

            if (error) {
                console.error("Cart Add Error:", error.message);
                setCart(previousCart); // Revert on error
            } else {
                await fetchDBCart();
            }
        }
        // Guest mode handled by the initial setCart call and the useEffect for localStorage
    };

    const removeFromCart = async (productId) => {
        const previousCart = [...cart];

        // Optimistic update
        setCart((prevCart) => prevCart.filter((item) => item.id !== productId));

        if (user) {
            const { error } = await supabase
                .from("cart_items")
                .delete()
                .eq("user_id", user.id)
                .eq("product_id", productId);

            if (error) {
                console.error("Cart Remove Error:", error.message);
                setCart(previousCart); // Revert on error
            } else {
                await fetchDBCart();
            }
        }
    };

    const updateQuantity = async (productId, quantity) => {
        if (quantity < 1) return;
        const previousCart = [...cart];

        // Optimistic update
        setCart((prevCart) =>
            prevCart.map((item) =>
                item.id === productId ? { ...item, quantity } : item
            )
        );

        if (user) {
            const { error } = await supabase
                .from("cart_items")
                .update({ quantity })
                .eq("user_id", user.id)
                .eq("product_id", productId);

            if (error) {
                console.error("Cart Update Error:", error.message);
                setCart(previousCart);
            } else {
                await fetchDBCart();
            }
        }
    };

    const clearCart = async () => {
        if (user) {
            const { error } = await supabase
                .from("cart_items")
                .delete()
                .eq("user_id", user.id);

            if (!error) setCart([]);
        } else {
            setCart([]);
        }
    };

    const cartCount = cart.reduce((total, item) => total + item.quantity, 0);
    const cartTotal = cart.reduce(
        (total, item) => total + item.price * (item.quantity || 0),
        0
    );

    return (
        <CartContext.Provider
            value={{
                cart,
                addToCart,
                removeFromCart,
                updateQuantity,
                clearCart,
                cartCount,
                cartTotal,
                isInitialized,
            }}
        >
            {children}
        </CartContext.Provider>
    );
}

export function useCart() {
    const context = useContext(CartContext);
    if (context === undefined) {
        throw new Error("useCart must be used within a CartProvider");
    }
    return context;
}
