"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";

const AuthContext = createContext();

export function AuthProvider({ children }) {
    const [user, setUser] = useState(null);
    const [profile, setProfile] = useState(null);
    const [loading, setLoading] = useState(true);

    const fetchProfile = async (userId) => {
        try {
            const response = await fetch(`/api/profile?userId=${userId}`);
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

    const googleClientId = "483518069191-egjpfiap3opnnj90q6ui20evr8pg6fic.apps.googleusercontent.com";

    // Handle identity from Google prompt
    const handleGoogleResponse = async (response) => {
        try {
            const { data, error } = await supabase.auth.signInWithIdToken({
                provider: 'google',
                token: response.credential,
            });

            if (data?.user) {
                setUser(data.user);
                await fetchProfile(data.user.id);
            } else if (error) {
                console.error("Supabase Auth error with Google Token:", error.message);
            }
        } catch (error) {
            console.error("Failed to sign in with Google ID token:", error);
        }
    };

    useEffect(() => {
        // Initial session check
        supabase.auth.getSession().then(async ({ data: { session } }) => {
            const currentUser = session?.user ?? null;
            setUser(currentUser);
            if (currentUser) {
                await fetchProfile(currentUser.id);
            }
            setLoading(false);
        });

        // Initialize Google GSI Client
        const initGSI = () => {
            if (window.google) {
                window.google.accounts.id.initialize({
                    client_id: googleClientId,
                    callback: handleGoogleResponse,
                    auto_select: false, // Don't auto-select to avoid surprising users
                });
                // Still try One Tap as it's a great UX
                window.google.accounts.id.prompt();
            }
        };

        // Try to init, or wait for script load
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

        // Listen for auth changes
        const { data: { subscription } } = supabase.auth.onAuthStateChange(async (_event, session) => {
            const currentUser = session?.user ?? null;
            setUser(currentUser);
            if (currentUser) {
                await fetchProfile(currentUser.id);
            } else {
                setProfile(null);
            }
            setLoading(false);
        });

        return () => subscription.unsubscribe();
    }, []);

    const signInWithGoogle = async () => {
        // Fallback to old flow if called without GSI or if user explicitly wants it
        const origin = typeof window !== 'undefined' ? window.location.origin : 'http://localhost:3000';
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
        <AuthContext.Provider value={{ user, profile, loading, signInWithGoogle, signOut, googleClientId }}>
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    return useContext(AuthContext);
}
