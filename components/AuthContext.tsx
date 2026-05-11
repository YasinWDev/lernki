"use client";

import {
  createContext,
  useContext,
  useEffect,
  useState,
  ReactNode,
} from "react";
import type { User as SupabaseUser } from "@supabase/supabase-js";
import { createClient } from "@/lib/supabase/client";

export type User = {
  id: string;
  email: string;
  name?: string;
};

type AuthContextType = {
  user: User | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, password: string, name?: string) => Promise<void>;
  logout: () => Promise<void>;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Supabase User → dein User-Format
function mapUser(supaUser: SupabaseUser | null): User | null {
  if (!supaUser) return null;
  return {
    id: supaUser.id,
    email: supaUser.email ?? "",
    name: (supaUser.user_metadata?.name as string | undefined) ?? undefined,
  };
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const supabase = createClient();

  useEffect(() => {
    // Beim Mount: aktuellen User holen
    supabase.auth.getUser().then(({ data }) => {
      setUser(mapUser(data.user));
      setLoading(false);
    });

    // Auf Auth-Änderungen lauschen (Login/Logout/Token-Refresh in anderen Tabs etc.)
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        setUser(mapUser(session?.user ?? null));
      }
    );

    return () => subscription.unsubscribe();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const login = async (email: string, password: string) => {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    if (error) throw new Error(translateError(error.message));
    setUser(mapUser(data.user));
  };

  const register = async (email: string, password: string, name?: string) => {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: { name: name || null },
        emailRedirectTo: `${location.origin}/auth/callback`,
      },
    });
    if (error) throw new Error(translateError(error.message));

    // Wenn E-Mail-Bestätigung aktiv ist, ist user noch nicht eingeloggt
    if (data.user && data.session) {
      setUser(mapUser(data.user));
    } else {
      // User muss erst E-Mail bestätigen
      throw new Error(
        "Bitte bestätige deine E-Mail-Adresse. Wir haben dir einen Link geschickt."
      );
    }
  };

  const logout = async () => {
    await supabase.auth.signOut();
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth muss innerhalb von AuthProvider verwendet werden");
  return ctx;
}

// Englische Supabase-Fehler → Deutsch
function translateError(msg: string): string {
  const map: Record<string, string> = {
    "Invalid login credentials": "E-Mail oder Passwort ist falsch.",
    "User already registered": "Diese E-Mail ist bereits registriert.",
    "Email not confirmed": "Bitte bestätige zuerst deine E-Mail.",
    "Password should be at least 6 characters":
      "Das Passwort muss mindestens 6 Zeichen lang sein.",
    "Unable to validate email address: invalid format":
      "Ungültige E-Mail-Adresse.",
    "Signup requires a valid password": "Bitte gib ein gültiges Passwort ein.",
  };
  return map[msg] || msg;
}