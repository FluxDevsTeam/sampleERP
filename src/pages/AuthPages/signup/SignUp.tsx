import { useState } from "react";
import { Logo } from "../../../assets";
import Button from "../../../components/Button";
import FormInput from "../_components/FormInput";
import FormHeader from "./_components/FormHeader";
import { useAuth } from "../AuthContext";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";


const SignUp = () => {
  const { signup } = useAuth();
  const [formData, setFormData] = useState({
    first_name: "",
    last_name: "",
    phone_number: "",
    email: "",
    password: "",
    verify_password: "",
    roles: [""] 
  });

  const roleOptions = [
    "shopkeeper",
    "project_manager",
    "factory_manager",
    "ceo",
    "admin",
    "storekeeper"
  ];

  const [isTermsAgreed, setIsTermsAgreed] = useState(false);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const navigate = useNavigate()
  // Generic input handler
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  // Handler for role selection
  const handleRoleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const value = e.target.value;
    setFormData(prev => ({ ...prev, roles: [value] })); // Always store as array
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    // Validation
    if (!isTermsAgreed) {
      setError("You must accept the terms and conditions");
      return;
    }

    if (formData.password !== formData.verify_password) {
      setError("Passwords do not match");
      return;
    }

    if (!formData.roles[0]) {
      setError("Please select a role");
      return;
    }

    setIsLoading(true);
    try {
      const result = await signup({
        first_name: formData.first_name,
        last_name: formData.last_name,
        phone_number: formData.phone_number,
        email: formData.email,
        password: formData.password,
        verify_password: formData.verify_password,
        roles: formData.roles 
      });

      if (!result.success) {
        setError(result.error || "Signup failed");
      } else {
        toast.success("Profile successfully created");
        navigate('/ceo/settings')
      }
    } catch (err) {
      setError("An unexpected error occurred");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <section className="w-full h-full md:h-fit px-4 py-6 space-y-4 bg-gray_2-100">
      {/* Logo and Header */}
      <div className="w-full flex space-y-1 flex-col items-center">
        <img src={Logo} alt="logo" className="w-[139px] h-[57px] object-contain" />
        <FormHeader header="Create an account" />
      </div>

      <form onSubmit={handleSubmit} className="max-w-[508px] w-full mx-auto space-y-4 pt-5 md:space-y-6">
        {/* Name fields */}
        <div className="flex space-x-6">
          <FormInput
            name="first_name"
            type="text"
            label="First Name"
            value={formData.first_name}
            onChange={handleChange}
            required
          />
          <FormInput
            name="last_name"
            type="text"
            label="Last Name"
            value={formData.last_name}
            onChange={handleChange}
            required
          />
        </div>
        
        {/* Other fields */}
        <FormInput
          name="email"
          type="email"
          label="Email"
          value={formData.email}
          onChange={handleChange}
          required
        />
        
        <FormInput
          name="password"
          type="password"
          label="Password"
          value={formData.password}
          onChange={handleChange}
          required
        />
        
        <FormInput
          name="verify_password"
          type="password"
          label="Confirm Password"
          value={formData.verify_password}
          onChange={handleChange}
          required
        />
        
        <FormInput
          name="phone_number"
          type="tel"
          label="Phone Number"
          value={formData.phone_number}
          onChange={handleChange}
          required
        />

        {/* Role Dropdown */}
        <div className="flex flex-col space-y-1">
          <label className="text-sm font-semibold text-blue-20">Role</label>
          <select
            name="role"
            value={formData.roles[0]}
            onChange={handleRoleChange}
            required
            className="p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
          >
            <option value="">Select a role</option>
            {roleOptions.map((role) => (
              <option key={role} value={role}>
                {role.replace(/_/g, " ").replace(/\b\w/g, l => l.toUpperCase())}
              </option>
            ))}
          </select>
        </div>

        {/* Terms checkbox */}
        <div className="flex items-center gap-1">
          <input
            type="checkbox"
            id="is_terms_agreed"
            checked={isTermsAgreed}
            onChange={(e) => setIsTermsAgreed(e.target.checked)}
            required
          />
          <label htmlFor="is_terms_agreed" className="text-sm font-semibold text-blue-20">
            Accept terms and conditions
          </label>
        </div>

        {error && <div className="text-red-500 text-sm text-center">{error}</div>}

        <Button 
          type="submit"
          className="bg-blue-400 text-white w-full font-semibold text-sm py-2"
          disabled={isLoading}
        >
          {isLoading ? "Signing Up..." : "Sign Up"}
        </Button>
      </form>
    </section>
  );
};

export default SignUp;