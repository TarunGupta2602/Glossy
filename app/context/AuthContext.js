"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";

const AuthContext = createContext();

export function AuthProvider({ children }) {
    const [user, setUser] = useState(null);
    const [profile, setProfile] = useState(null);
    const [loading, setLoading] = useState(true);

    const fetchProfile = async (userId, userData = null) => {
        const { data, error } = await supabase
            .from("users")
            .select("*")
            .eq("id", userId)
            .single();

        if (error) {
            // If profile doesn't exist (PGRST116), try to sync it as a fallback
            if (error.code === 'PGRST116' && userData) {
                console.log("Profile missing, attempting fallback sync...");
                const { data: newData, error: syncError } = await supabase.from("users").upsert({
                    id: userId,
                    email: userData.email,
                    name: userData.user_metadata?.full_name || userData.user_metadata?.name,
                    avatar: userData.user_metadata?.avatar_url || userData.user_metadata?.picture,
                }).select().single();

                if (syncError) {
                    console.error("Fallback sync failed:", syncError.message);
                } else {
                    setProfile(newData);
                    return;
                }
            }

            console.error("Error fetching profile:", error.message || error);
            setProfile(null);
        } else {
            setProfile(data);
        }
    };

    useEffect(() => {
        // Initial session check
        supabase.auth.getSession().then(({ data: { session } }) => {
            const currentUser = session?.user ?? null;
            setUser(currentUser);
            if (currentUser) {
                fetchProfile(currentUser.id, currentUser);
            }
            setLoading(false);
        });

        // Listen for auth changes
        const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
            const currentUser = session?.user ?? null;
            setUser(currentUser);
            if (currentUser) {
                fetchProfile(currentUser.id, currentUser);
            } else {
                setProfile(null);
            }
            setLoading(false);
        });

        return () => subscription.unsubscribe();
    }, []);

    const signInWithGoogle = async () => {
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
        <AuthContext.Provider value={{ user, profile, loading, signInWithGoogle, signOut }}>
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    return useContext(AuthContext);
}
