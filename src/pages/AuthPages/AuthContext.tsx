import {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";

type User = {
  role: string;
} | null;

type AuthContextType = {
  user: User;
  login: (
    email: string,
    password: string
  ) => Promise<{ success: boolean; error?: string; role?: string }>;
  signup: (
    userData: SignupData
  ) => Promise<{ success: boolean; error?: string }>;
  logout: () => void;
  loading: boolean;
};

type AuthProviderProps = {
  children: ReactNode;
};

type LoginResponse = {
  accessToken: string;
  refresh_token: string;
  role: string;
};

type SignupData = {
  first_name: string;
  last_name: string;
  phone_number: string;
  email: string;
  password: string;
  verify_password: string;
  roles: string[];
};

// Create context with a default value
const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const [user, setUser] = useState<User>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const initializeAuth = async () => {
      const token = localStorage.getItem("accessToken");
      const role = localStorage.getItem("user_role");

      if (token && role) {
        setUser({ role });
      }
      setLoading(false);
    };

    initializeAuth();
  }, []);

  const login = async (email: string, password: string) => {
    try {
      const response = await fetch(
        "https://backend.kidsdesigncompany.com/auth/login/",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ email, password }),
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Login failed");
      }

      const data: LoginResponse = await response.json();

      localStorage.setItem("accessToken", data.access_token);
      localStorage.setItem("refresh_token", data.refresh_token);
      localStorage.setItem("user_role", data.role);

      setUser({ role: data.role });
      return { success: true, role: data.role };
    } catch (error) {
      return {
        success: false,
        error:
          error instanceof Error ? error.message : "An unknown error occurred",
      };
    }
  };

  const signup = async (userData: SignupData) => {
    try {
      const token = localStorage.getItem("accessToken");
      const response = await fetch(
        "https://backend.kidsdesigncompany.com/auth/signup/",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `JWT ${token}`,
          },
          body: JSON.stringify(userData),
        }
      );

      const data = await response.json(); // Always parse the response

      if (!response.ok) {
        // Log the full error response from backend
        console.error("Signup failed:", data);

        // Attempt to get a message or stringified version
        const errorMessage =
          data.message ||
          (typeof data === "object" ? JSON.stringify(data) : "Signup failed");

        throw new Error(errorMessage);
      }

      return { success: true, data };
    } catch (error) {
      // Log the caught error
      console.error("Signup error:", error);

      return {
        success: false,
        error: error instanceof Error ? error.message : "Unknown error",
      };
    }
  };

  const logout = () => {
    localStorage.removeItem("accessToken");
    localStorage.removeItem("refresh_token");
    localStorage.removeItem("user_role");
    setUser(null);
    return "/login";
  };

  return (
    <AuthContext.Provider value={{ user, login, signup, logout, loading }}>
      {!loading && children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
