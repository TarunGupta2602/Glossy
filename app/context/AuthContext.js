"use client";

import { createContext, useContext, useEffect, useState, useCallback } from "react";
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

    const fetchProfile = useCallback(async () => {
        // Retry briefly — session cookies can lag right after sign-in.
        for (let attempt = 0; attempt < 5; attempt += 1) {
            try {
                const response = await authFetch("/api/profile");
                const data = await response.json();

                if (data.success) {
                    setProfile(data.profile);
                    return data.profile;
                }

                console.error("Error fetching profile via API:", data.error);
            } catch (error) {
                if (attempt === 4) {
                    console.error("Error fetching profile from API:", error);
                    setProfile(null);
                    return null;
                }
                await new Promise((r) => setTimeout(r, 150 * (attempt + 1)));
                continue;
            }
            break;
        }
        setProfile(null);
        return null;
    }, []);

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
        let cancelled = false;

        supabase.auth.getSession().then(async ({ data: { session } }) => {
            if (cancelled) return;
            const currentUser = session?.user ?? null;
            setUser(currentUser);
            if (currentUser) {
                await fetchProfile();
            }
            if (!cancelled) setLoading(false);
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
        } = supabase.auth.onAuthStateChange((_event, session) => {
            // Defer async work — calling other auth methods inside this
            // callback can deadlock the Supabase client.
            setTimeout(async () => {
                if (cancelled) return;
                const currentUser = session?.user ?? null;
                setUser(currentUser);
                if (currentUser) {
                    await fetchProfile();
                } else {
                    setProfile(null);
                }
                setLoading(false);
            }, 0);
        });

        return () => {
            cancelled = true;
            subscription.unsubscribe();
        };
    }, [fetchProfile, googleClientId]);

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

    const signInWithPassword = async (email, password) => {
        const { data, error } = await supabase.auth.signInWithPassword({
            email,
            password,
        });
        if (error) throw error;

        const signedInUser = data.user ?? data.session?.user ?? null;
        setUser(signedInUser);

        // Ensure session is readable before profile API call.
        await supabase.auth.getSession();
        const loadedProfile = signedInUser ? await fetchProfile() : null;
        setLoading(false);
        return { user: signedInUser, profile: loadedProfile };
    };

    const signOut = async () => {
        await supabase.auth.signOut();
        setUser(null);
        setProfile(null);
    };

    return (
        <AuthContext.Provider
            value={{
                user,
                profile,
                loading,
                signInWithGoogle,
                signInWithPassword,
                signOut,
                googleClientId,
                refreshProfile: fetchProfile,
            }}
        >
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    return useContext(AuthContext);
}
