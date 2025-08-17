// Signin.tsx
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Logo } from "../../../assets";
import Button from "../../../components/Button";
import { ChromeIcon } from "../../../utils/SvgIcons";
import FormInput from "../_components/FormInput";
import AuthLayout from "../AuthLayout";
import FormHeader from "../signup/_components/FormHeader";
import { useAuth } from "../AuthContext";
import { toast } from "sonner";

declare global {
  interface Window {
    deferredPrompt: any;
  }
}

const Signin = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const { login } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e);
    };

    const handleAppInstalled = () => {
      setDeferredPrompt(null); // Clear prompt after installation
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    window.addEventListener('appinstalled', handleAppInstalled);

    // No initial state setting for deferredPrompt here, it will be set by the event listener if available.

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
      window.removeEventListener('appinstalled', handleAppInstalled);
    };
  }, []);

  const handleInstallClick = async () => {
    if (window.deferredPrompt) {
      window.deferredPrompt.prompt();
      const { outcome } = await window.deferredPrompt.userChoice;
      console.log(`User response to the install prompt: ${outcome}`);
      if (outcome === 'accepted') {
        console.log('User accepted the A2HS prompt');

      } else {
        console.log('User dismissed the A2HS prompt');
      }
      setDeferredPrompt(null);
    }
  };

  const handleOpenAppClick = () => {
    console.log('Opening installed app...');
    // Redirect to the root of the application to open the installed PWA
    window.location.href = '/';
  };

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
      {!window.matchMedia('(display-mode: standalone)').matches && (
         <button
           onClick={handleInstallClick}
           className="fixed top-4 right-4 bg-purple-600 text-white p-3 rounded-full shadow-lg hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-opacity-50 animate-bounce flex items-center"
           title="Install App"
         >
           <svg
             xmlns="http://www.w3.org/2000/svg"
             fill="none"
             viewBox="0 0 24 24"
             strokeWidth="1.5"
             stroke="currentColor"
             className="w-6 h-6"
           >
             <path
               strokeLinecap="round"
               strokeLinejoin="round"
               d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5M16.5 12L12 16.5m0 0L7.5 12m4.5 4.5V3"
             />
           </svg>
           <span className="ml-2">Download App</span>
         </button>
       )}

       {!deferredPrompt && !window.matchMedia('(display-mode: standalone)').matches && (
         <div className="fixed bottom-4 right-4 bg-green-500 text-white p-3 rounded-lg shadow-lg flex items-center space-x-2">
           <span>App already installed on your device and ready for use.</span>
         </div>
       )}
     </AuthLayout>
   );
 };

export default Signin;
