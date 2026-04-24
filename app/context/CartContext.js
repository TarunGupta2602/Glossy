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
        if (!user) return;

        try {
            const response = await fetch(`/api/cart?userId=${user.id}`);
            const data = await response.json();

            if (data.success) {
                setCart(data.cart || []);
            } else {
                console.error("Error fetching cart from API:", data.error);
            }
        } catch (error) {
            console.error("Cart context fetch error:", error);
        }
    }, [user]);


    const syncLocalCartToDB = useCallback(async (localCart) => {
        if (!user || localCart.length === 0) return;

        try {
            for (const item of localCart) {
                await fetch("/api/cart", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ userId: user.id, productId: item.id, quantity: item.quantity, action: "add" }),
                });
            }
            await fetchDBCart();
        } catch (error) {
            console.error("Cart sync error:", error);
        }
    }, [user, fetchDBCart]);


    // Initial load: either from DB or localStorage
    useEffect(() => {
        const loadInitialCart = async () => {
            if (user) {
                await fetchDBCart();
                // Sync local items ONLY manually right after login if they exist
                const localCartString = localStorage.getItem("theluxejewels-cart");
                if (localCartString) {
                    try {
                        const localCart = JSON.parse(localCartString);
                        if (localCart.length > 0) {
                            await syncLocalCartToDB(localCart);
                            localStorage.removeItem("theluxejewels-cart");
                        }
                    } catch (e) {
                        console.error("Failed to parse local cart for sync", e);
                    }
                }
            } else {
                // If we just logged out (isInitialized was true and now user is null)
                // we should reload the local cart (which should be empty or have guest items)
                const savedCart = localStorage.getItem("theluxejewels-cart");
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
    }, [user, fetchDBCart, syncLocalCartToDB]);

    // Save Guest cart to localStorage ONLY if user is not logged in
    useEffect(() => {
        if (isInitialized && !user) {
            localStorage.setItem("theluxejewels-cart", JSON.stringify(cart));
        }
    }, [cart, isInitialized, user]);


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
            try {
                const response = await fetch("/api/cart", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ userId: user.id, productId: product.id, quantity: (cart.find(i => i.id === product.id)?.quantity || 0) + quantity, action: "add" }),
                });

                const data = await response.json();
                if (!data.success) {
                    console.error("Cart Add Error:", data.error);
                    setCart(previousCart); // Revert on error
                } else {
                    await fetchDBCart();
                }
            } catch (error) {
                console.error("Cart context add error:", error);
                setCart(previousCart);
            }
        }

        // Guest mode handled by the initial setCart call and the useEffect for localStorage
    };

    const removeFromCart = async (productId) => {
        const previousCart = [...cart];

        // Optimistic update
        setCart((prevCart) => prevCart.filter((item) => item.id !== productId));

        if (user) {
            try {
                const response = await fetch("/api/cart", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ userId: user.id, productId: productId, action: "remove" }),
                });

                const data = await response.json();
                if (!data.success) {
                    console.error("Cart Remove Error:", data.error);
                    setCart(previousCart); // Revert on error
                } else {
                    await fetchDBCart();
                }
            } catch (error) {
                console.error("Cart context remove error:", error);
                setCart(previousCart);
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
            try {
                const response = await fetch("/api/cart", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ userId: user.id, productId: productId, quantity: quantity, action: "update" }),
                });

                const data = await response.json();
                if (!data.success) {
                    console.error("Cart Update Error:", data.error);
                    setCart(previousCart);
                } else {
                    await fetchDBCart();
                }
            } catch (error) {
                console.error("Cart context update error:", error);
                setCart(previousCart);
            }
        }

    };

    const clearCart = async () => {
        if (user) {
            try {
                const response = await fetch("/api/cart", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ userId: user.id, action: "clear" }),
                });
                const data = await response.json();
                if (data.success) {
                    setCart([]);
                }
            } catch (error) {
                console.error("Cart clear error:", error);
            }
        } else {
            setCart([]);
        }
    };


    const cartCount = cart.reduce((total, item) => total + item.quantity, 0);
    const cartSubtotal = cart.reduce(
        (total, item) => total + item.price * (item.quantity || 0),
        0
    );

    // Buy 2 Get 1 Free Logic
    // Logic: Sort all individual items by price descending and every 3rd item is free
    const calculateDiscount = () => {
        const allItems = [];
        cart.forEach(item => {
            for (let i = 0; i < item.quantity; i++) {
                allItems.push(item.price);
            }
        });

        allItems.sort((a, b) => b - a);

        let discount = 0;
        for (let i = 2; i < allItems.length; i += 3) {
            discount += allItems[i];
        }
        return discount;
    };

    const discountAmount = calculateDiscount();

    // Rule: ₹10 shipping if subtotal - discount < ₹1000
    const finalSubtotal = cartSubtotal - discountAmount;
    const shippingFee = 0;
    const cartTotal = finalSubtotal + shippingFee;


    return (
        <CartContext.Provider
            value={{
                cart,
                addToCart,
                removeFromCart,
                updateQuantity,
                clearCart,
                cartCount,
                cartSubtotal,
                discountAmount, // Added discountAmount
                shippingFee,
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
