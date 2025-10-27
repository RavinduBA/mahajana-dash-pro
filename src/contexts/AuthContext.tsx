import {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "@/hooks/use-toast";
import { apiClient } from "@/lib/api";

interface User {
  id: number;
  name: string;
  email: string;
  role: string;
  branch?: {
    id: number;
    title: string;
  };
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  login: (
    email: string,
    password: string,
    rememberMe: boolean
  ) => Promise<void>;
  register: (data: RegisterData) => Promise<void>;
  logout: () => void;
  isLoading: boolean;
}

interface RegisterData {
  fullName: string;
  email: string;
  phone: string;
  password: string;
  role: "Admin" | "Staff" | "Delivery";
}

interface LoginResponse {
  data: {
    token: string;
    user: {
      id: number;
      name: string;
      email: string;
      role: string;
      branch?: {
        id: number;
        title: string;
      };
    };
  };
}

interface MeResponse {
  data: {
    id: number;
    name: string;
    email: string;
    role: string;
    branch?: {
      id: number;
      title: string;
    };
  };
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    // Check for stored token and user data on mount
    const checkAuth = async () => {
      const token = localStorage.getItem("admin_token");
      const storedUser = localStorage.getItem("admin_user");

      if (token && storedUser) {
        try {
          // Set token for API calls
          apiClient.setToken(token);

          // Parse and set stored user data
          const userData = JSON.parse(storedUser);
          setUser(userData);
          console.log("✅ Restored user session:", userData);
        } catch (error) {
          // Invalid stored data, clear everything
          console.error("❌ Failed to restore session:", error);
          apiClient.clearToken();
          localStorage.removeItem("admin_user");
          localStorage.removeItem("admin_token");
          setUser(null);
        }
      }
      setIsLoading(false);
    };

    checkAuth();
  }, []);

  const login = async (
    email: string,
    password: string,
    rememberMe: boolean
  ) => {
    setIsLoading(true);
    try {
      console.log("🔐 Attempting login...", { email });
      const response = await apiClient.post<LoginResponse>(
        "/auth/staff/login",
        {
          email,
          password,
        }
      );

      console.log("✅ Login response:", response);

      const { token, user: userData } = response.data;

      // Store token
      apiClient.setToken(token);
      console.log("🔑 Token stored:", token.substring(0, 20) + "...");

      // Store user data
      setUser(userData);
      localStorage.setItem("admin_user", JSON.stringify(userData));
      console.log("👤 User data stored:", userData);

      // Only persist token if remember me is checked
      if (!rememberMe) {
        // For session-only login, we'll clear token on window close
        window.addEventListener("beforeunload", () => {
          apiClient.clearToken();
        });
      }

      toast({
        title: "Login successful",
        description: `Welcome back, ${userData.name}!`,
      });

      console.log("🚀 Navigating to dashboard...");
      navigate("/");
    } catch (error) {
      console.error("❌ Login error:", error);
      const errorMessage =
        error instanceof Error ? error.message : "Invalid email or password";

      toast({
        title: "Login failed",
        description: errorMessage,
        variant: "destructive",
      });
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (data: RegisterData) => {
    setIsLoading(true);
    try {
      // Note: The API doesn't have a public staff registration endpoint
      // Staff accounts should be created by administrators
      // For now, we'll show an appropriate error message
      toast({
        title: "Registration not available",
        description:
          "Please contact your administrator to create a staff account.",
        variant: "destructive",
      });
      throw new Error("Registration endpoint not available");
    } catch (error) {
      const errorMessage =
        error instanceof Error
          ? error.message
          : "Registration failed. Please contact your administrator.";

      toast({
        title: "Registration failed",
        description: errorMessage,
        variant: "destructive",
      });
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    // Clear auth state
    setUser(null);
    apiClient.clearToken();
    localStorage.removeItem("admin_user");

    toast({
      title: "Logged out",
      description: "You have been logged out successfully.",
    });
    navigate("/login");
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        login,
        register,
        logout,
        isLoading,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within AuthProvider");
  }
  return context;
}
