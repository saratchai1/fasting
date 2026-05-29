import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { pullDataFromSupabase, clearAdaptiveFastingData } from "@/lib/storage";
import type { User } from "@supabase/supabase-js";

export function useAuth() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check active sessions
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
      if (session) {
        pullDataFromSupabase().catch(console.error);
      }
      setLoading(false);
    });

    // Listen for changes on auth state
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((event, session) => {
      setUser(session?.user ?? null);
      if (event === "SIGNED_IN" && session) {
        pullDataFromSupabase().catch(console.error);
      }
      if (event === "SIGNED_OUT") {
        clearAdaptiveFastingData();
      }
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  const signOut = async () => {
    await supabase.auth.signOut();
  };

  return { user, loading, signOut };
}
