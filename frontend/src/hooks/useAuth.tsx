import { useState, useEffect, createContext, useContext, ReactNode } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { supabase } from "@/lib/supabase";
import type { Session } from "@supabase/supabase-js";

type UserType = {
  id: string;
  type: "student" | "teacher";
  name: string;
  email: string;
  rollNumber?: string;
  department?: string;
} | null;

interface AuthContextType {
  user: UserType;
  logout: () => void;
  isAuthenticated: boolean;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  logout: () => {},
  isAuthenticated: false,
  isLoading: true,
});

async function loadUserProfile(session: Session): Promise<UserType> {
  try {
    const { data: profile, error } = await supabase
      .from("profiles")
      .select("*")
      .eq("id", session.user.id)
      .maybeSingle();

    if (error) {
      console.error("Error loading user profile:", error);
    }

    if (!profile) {
      // Automatic profile fallback generation for authenticated Google Auth routines
      const emailLower = session.user.email?.toLowerCase().trim() || "";
      const studentEmailRegex = /^([a-zA-Z]{2})((21|22|23|24)ma[a-zA-Z0-9]+)@student\.nitw\.ac\.in$/;
      const match = emailLower.match(studentEmailRegex);

      if (match) {
        const rollNumber = match[2].toUpperCase(); 
        const name =
          session.user.user_metadata?.full_name ||
          session.user.user_metadata?.name ||
          "Anonymous Student";
        const department = "Mathematics";

        const { data: newProfile, error: insertError } = await supabase
          .from("profiles")
          .insert({
            id: session.user.id,
            name: name,
            role: "student",
            roll_number: rollNumber,
            department: department
          })
          .select()
          .single();

        if (insertError) {
          console.error("Failed to automatically create student profile:", insertError);
          return null;
        }

        return {
          id: session.user.id,
          type: "student",
          name: newProfile.name,
          email: emailLower,
          rollNumber: newProfile.roll_number,
          department: newProfile.department
        };
      }

      console.error("Profile records absent; unauthorized access configuration.");
      return null;
    }

    return {
      id: session.user.id,
      type: profile.role,
      name: profile.name,
      email: session.user.email ?? "",
      rollNumber: profile.roll_number ?? undefined,
      department: profile.department ?? undefined,
    };
  } catch (err) {
    console.error("Unexpected error fetching profile:", err);
    return null;
  }
}

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<UserType>(null);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    let isMounted = true;

    // Observes auth changes and handles initial mounting setup in a unified stream
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (_event, session) => {
      if (!session) {
        if (isMounted) {
          setUser(null);
          setIsLoading(false);
        }
        return;
      }

      const profile = await loadUserProfile(session);
      
      if (!isMounted) return;

      if (profile) {
        setUser(profile);
      } else {
        await supabase.auth.signOut();
        setUser(null);
        toast.error("Access Denied: Only Mathematics department student emails or whitelisted faculty are allowed.");
      }
      setIsLoading(false);
    });

    return () => {
      isMounted = false;
      subscription.unsubscribe();
    };
  }, []);

  const logout = async () => {
    try {
      await supabase.auth.signOut();
      setUser(null);
      navigate("/");
      toast.info("Logged out successfully");
    } catch (err) {
      toast.error("Logout failed cleanly");
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        logout,
        isAuthenticated: !!user,
        isLoading,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);