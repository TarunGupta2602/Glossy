"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import { authFetch } from "@/lib/adminApi";

const AuthContext = createContext();

export function AuthProvider({ children }) {
    const [user, setUser] = useState(null);
    const [profile, setProfile] = useState(null);
    const [loading, setLoading] = useState(true);

    const googleClientId =
        process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID ||
        "483518069191-egjpfiap3opnnj90q6ui20evr8pg6fic.apps.googleusercontent.com";

    const fetchProfile = async () => {
        try {
            const response = await authFetch("/api/profile");
            const data = await response.json();

            if (data.success) {
                setProfile(data.profile);
            } else {
                console.error("Error fetching profile via API:", data.error);
                setProfile(null);
            }
        } catch (error) {
            console.error("Error fetching profile from API:", error);
            setProfile(null);
        }
    };

    const handleGoogleResponse = async (response) => {
        try {
            const { data, error } = await supabase.auth.signInWithIdToken({
                provider: "google",
                token: response.credential,
            });

            if (data?.user) {
                setUser(data.user);
                await fetchProfile();
            } else if (error) {
                console.error("Supabase Auth error with Google Token:", error.message);
            }
        } catch (error) {
            console.error("Failed to sign in with Google ID token:", error);
        }
    };

    useEffect(() => {
        supabase.auth.getUser().then(async ({ data: { user: currentUser } }) => {
            setUser(currentUser ?? null);
            if (currentUser) {
                await fetchProfile();
            }
            setLoading(false);
        });

        const initGSI = () => {
            if (!window.google?.accounts?.id) return;

            window.google.accounts.id.initialize({
                client_id: googleClientId,
                callback: handleGoogleResponse,
                auto_select: false,
            });

            const isLocalhost =
                window.location.hostname === "localhost" ||
                window.location.hostname === "127.0.0.1";

            if (!isLocalhost) {
                window.google.accounts.id.prompt();
            }
        };

        if (window.google) {
            initGSI();
        } else {
            const interval = setInterval(() => {
                if (window.google) {
                    initGSI();
                    clearInterval(interval);
                }
            }, 500);
            setTimeout(() => clearInterval(interval), 5000);
        }

        const {
            data: { subscription },
        } = supabase.auth.onAuthStateChange(async (_event, session) => {
            const currentUser = session?.user ?? null;
            setUser(currentUser);
            if (currentUser) {
                await fetchProfile();
            } else {
                setProfile(null);
            }
            setLoading(false);
        });

        return () => subscription.unsubscribe();
    }, []);

    const signInWithGoogle = async () => {
        const origin =
            typeof window !== "undefined"
                ? window.location.origin
                : "http://localhost:3000";
        await supabase.auth.signInWithOAuth({
            provider: "google",
            options: {
                redirectTo: `${origin}/auth/callback`,
            },
        });
    };

    const signOut = async () => {
        await supabase.auth.signOut();
        setProfile(null);
    };

    return (
        <AuthContext.Provider
            value={{
                user,
                profile,
                loading,
                signInWithGoogle,
                signOut,
                googleClientId,
            }}
        >
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    return useContext(AuthContext);
}
