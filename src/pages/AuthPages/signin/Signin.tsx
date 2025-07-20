// Signin.tsx
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Logo } from "../../../assets";
import Button from "../../../components/Button";
import { ChromeIcon } from "../../../utils/SvgIcons";
import FormInput from "../_components/FormInput";
import AuthLayout from "../AuthLayout";
import FormHeader from "../signup/_components/FormHeader";
import { useAuth } from "../AuthContext";
import { toast } from "sonner";

const Signin = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    // Basic validation
    if (!email || !password) {
      setError("Please fill in all fields");
      setLoading(false);
      return;
    }

    try {
      const result = await login(email, password);
      
      if (result.success) {
          toast.success("Login successful!");
          // Store the role from the API response
          if (result.role) {
            localStorage.setItem("user_role", result.role);
          } else {
            // Fallback if role is not directly in result, though it should be now
            const roleFromStorage = localStorage.getItem("user_role");
            if (!roleFromStorage) {
              console.warn("User role not found in login result or localStorage.");
            }
          }
          // Redirect based on role
          const role = result.role || localStorage.getItem("user_role");
        switch (role) {
          case "ceo":
            navigate("/ceo/dashboard");
            break;
          case "admin":
            navigate("/admin/dashboard");
            break;
          case "accountant":
            navigate("/accountant/dashboard");
            break;
          case "factory_manager":
            navigate("/factory-manager/dashboard");
            break;
          case "project_manager":
            navigate("/project-manager/dashboard");
            break;
          case "storekeeper":
            navigate("/store-keeper/dashboard");
            break;
          case "shopkeeper":
            navigate("/shop/dashboard");
            break;
          default:
            navigate("/");
        }
      } else {
        setError(result.error || "Login failed");
        toast.error(result.error || "Login failed");
      }
    } catch (err) {
      setError("An unexpected error occurred");
      toast.error("An unexpected error occurred");
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthLayout>
      <section className="w-full h-fit overflow-auto px-3 sm:px-4 py-4 max-sm:py-10 max-sm:px-8 max-sm:mb-32 sm:py-6 space-y-3 sm:space-y-4 bg-green-900 shadow-xl rounded-xl sm:rounded-2xl">
        <div className="w-full flex space-y-1 flex-col items-center">
          <img
            src={Logo}
            alt="logo"
            className="w-[100px] h-[40px] sm:w-[120px] sm:h-[50px] md:w-[139px] md:h-[57px] object-contain"
          />
          <FormHeader header="Login" />
        </div>

        {error && (
          <div className="text-red-500 text-center font-medium text-xs sm:text-sm">{error}</div>
        )}

        <form onSubmit={handleSubmit} className="max-w-[350px] sm:max-w-[380px] md:max-w-[408px] w-full mx-auto space-y-3 sm:space-y-4">
          <FormInput
            name="email"
            type="email"
            label="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <div className="w-full">
            <FormInput
              name="password"
              type="password"
              label="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <div className="flex flex-col items-center w-full space-y-3  sm:space-y-4">
            <Button
              type="submit"
              className="bg-blue-400 text-white w-full max-w-[250px] sm:max-w-[278px] font-semibold text-xs sm:text-sm py-2  m-6 sm:py-2"
              disabled={loading}
            >
              {loading ? "Logging in..." : "Login"}
            </Button>

          </div>
        </form>
      </section>
    </AuthLayout>
  );
};

export default Signin;
