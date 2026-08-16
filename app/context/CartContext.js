"use client";

import { createContext, useContext, useState, useEffect, useCallback, useMemo } from "react";
import { useAuth } from "./AuthContext";
import { authFetch } from "@/lib/adminApi";
import { calculateBuy2Get1Free } from "@/lib/promo";
import { trackAddToCart } from "@/lib/gtag";
import { trackMetaAddToCart } from "@/lib/metaPixel";

const CartContext = createContext();

export function CartProvider({ children }) {
    const [cart, setCart] = useState([]);
    const [isInitialized, setIsInitialized] = useState(false);
    const [allProducts, setAllProducts] = useState([]);
    const [isCartOpen, setIsCartOpen] = useState(false);
    const { user } = useAuth();

    const openCart = useCallback(() => setIsCartOpen(true), []);
    const closeCart = useCallback(() => setIsCartOpen(false), []);
    const toggleCart = useCallback(() => setIsCartOpen((v) => !v), []);

    const fetchDBCart = useCallback(async () => {
        if (!user) return;

        try {
            const response = await authFetch("/api/cart");
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

    const syncLocalCartToDB = useCallback(
        async (localCart) => {
            if (!user || localCart.length === 0) return;

            try {
                for (const item of localCart) {
                    await authFetch("/api/cart", {
                        method: "POST",
                        body: JSON.stringify({
                            productId: item.id,
                            quantity: item.quantity,
                            action: "add",
                        }),
                    });
                }
                await fetchDBCart();
            } catch (error) {
                console.error("Cart sync error:", error);
            }
        },
        [user, fetchDBCart]
    );

    useEffect(() => {
        const loadInitialCart = async () => {
            if (user) {
                await fetchDBCart();
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
                const savedCart = localStorage.getItem("theluxejewels-cart");
                if (savedCart) {
                    try {
                        setCart(JSON.parse(savedCart));
                    } catch {
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

    useEffect(() => {
        if (isInitialized && !user) {
            localStorage.setItem("theluxejewels-cart", JSON.stringify(cart));
        }
    }, [cart, isInitialized, user]);

    useEffect(() => {
        const fetchAllProducts = async () => {
            try {
                const response = await fetch("/api/products?lite=1");
                const data = await response.json();
                if (data?.success) {
                    setAllProducts(data.products || []);
                }
            } catch (error) {
                console.error("Failed to fetch products for promo", error);
            }
        };
        fetchAllProducts();
    }, []);

    const addToCart = async (product, quantity = 1) => {
        const previousCart = [...cart];
        const existingQty = cart.find((i) => i.id === product.id)?.quantity || 0;
        const nextQty = existingQty + quantity;

        if (
            product.stock_count != null &&
            product.stock_count < nextQty
        ) {
            alert(
                product.stock_count <= 0
                    ? "Out of stock"
                    : `Only ${product.stock_count} left in stock`
            );
            return;
        }

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

        trackAddToCart({
            id: product.id,
            name: product.name,
            price: product.price || 0,
            quantity,
            category: product.category,
        });

        trackMetaAddToCart({
            id: product.id,
            name: product.name,
            value: (product.price || 0) * quantity,
            category: product.category,
        });

        if (user) {
            try {
                const response = await authFetch("/api/cart", {
                    method: "POST",
                    body: JSON.stringify({
                        productId: product.id,
                        quantity: nextQty,
                        action: "add",
                    }),
                });

                const data = await response.json();
                if (!data.success) {
                    console.error("Cart Add Error:", data.error);
                    setCart(previousCart);
                    if (data.error) alert(data.error);
                } else {
                    await fetchDBCart();
                }
            } catch (error) {
                console.error("Cart context add error:", error);
                setCart(previousCart);
            }
        }

        setIsCartOpen(true);
    };

    const removeFromCart = async (productId) => {
        const previousCart = [...cart];
        setCart((prevCart) => prevCart.filter((item) => item.id !== productId));

        if (user) {
            try {
                const response = await authFetch("/api/cart", {
                    method: "POST",
                    body: JSON.stringify({ productId, action: "remove" }),
                });

                const data = await response.json();
                if (!data.success) {
                    console.error("Cart Remove Error:", data.error);
                    setCart(previousCart);
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
        const product = cart.find((i) => i.id === productId);
        if (
            product?.stock_count != null &&
            product.stock_count < quantity
        ) {
            alert(`Only ${product.stock_count} left in stock`);
            return;
        }

        setCart((prevCart) =>
            prevCart.map((item) =>
                item.id === productId ? { ...item, quantity } : item
            )
        );

        if (user) {
            try {
                const response = await authFetch("/api/cart", {
                    method: "POST",
                    body: JSON.stringify({
                        productId,
                        quantity,
                        action: "update",
                    }),
                });

                const data = await response.json();
                if (!data.success) {
                    console.error("Cart Update Error:", data.error);
                    setCart(previousCart);
                    if (data.error) alert(data.error);
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
                const response = await authFetch("/api/cart", {
                    method: "POST",
                    body: JSON.stringify({ action: "clear" }),
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

    const promo = useMemo(
        () => calculateBuy2Get1Free(cart, allProducts),
        [cart, allProducts]
    );
    const discountAmount = promo.discountAmount;
    const shippingFee = promo.shippingFee;
    // Gift MRP is savings only; paid total is subtotal + shipping.
    const cartTotal = cartSubtotal + shippingFee;

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
                discountAmount,
                shippingFee,
                cartTotal,
                isInitialized,
                promo,
                isCartOpen,
                openCart,
                closeCart,
                toggleCart,
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
