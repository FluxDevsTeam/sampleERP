import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import axios, { AxiosError } from "axios";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

const API_URL = "https://backend.kidsdesigncompany.com/api/overhead-cost/";

// Define types for API response
interface OverheadCostData {
  overhead_cost_base: string;
}

// Create an Axios instance with default headers
const api = axios.create({
  baseURL: API_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Add a request interceptor to include the token
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("accessToken");
  if (token) {
    config.headers.Authorization = `JWT ${token}`;
  }
  return config;
});

// Helper for comma formatting
const formatNumber = (num: string | number) => {
  const n = typeof num === 'string' ? parseFloat(num) : num;
  if (isNaN(n)) return num;
  return n.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 });
};

export default function OverheadCost() {
  const queryClient = useQueryClient();
  const { register, handleSubmit, reset } = useForm<{
    overhead_cost_base: string;
  }>();

  // Fetch overhead cost
  const { data, isLoading, error } = useQuery<OverheadCostData>({
    queryKey: ["overheadCost"],
    queryFn: async () => {
      const response = await api.get<OverheadCostData>("");
      return response.data;
    },
  });

  // Update overhead cost
  const mutation = useMutation({
    mutationFn: async (updatedData: { overhead_cost_base: string }) => {
      const response = await api.patch<OverheadCostData>("", updatedData);
      return response.data;
    },
    onSuccess: () => {
      toast.success("Overhead Cost updated successfully!");
      queryClient.invalidateQueries({ queryKey: ["overheadCost"] });
      reset(); // Reset form after successful update
    },
    onError: (error: AxiosError) => {
      toast.error(`Error updating overhead cost: ${error.message}`);
    },
  });

  // Handle form submission
  const onSubmit = (formData: { overhead_cost_base: string }) => {
    mutation.mutate(formData);
  };

  if (isLoading) return <p>Loading...</p>;
  if (error)
    return (
      <p>
        Error fetching data: {(error as AxiosError).message || "Unknown error"}
      </p>
    );

  return (
    <div className="p-0  pl-2 max-w-md bg-[#f5f7fa] rounded-lg shadow-md">
      <h2 className="text-xl font-bold mb-1">Overhead Cost</h2>
      <p className="mb-2">
        Current Base Cost:{" "}
        <strong>₦{data?.overhead_cost_base ? formatNumber(data.overhead_cost_base) : "N/A"}</strong>
      </p>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <input
          {...register("overhead_cost_base")}
          type="number"
          placeholder="Enter new cost"
          className="w-full p-2 border rounded"
        />
        <button
          type="submit"
          className="w-full bg-gradient-to-r from-blue-400 via-blue-500 to-blue-600 text-white py-2 rounded hover:from-blue-500 hover:to-blue-700 hover:via-blue-600"
          disabled={mutation.isPending}
        >
          {mutation.isPending ? "Updating..." : "Update Cost"}
        </button>
      </form>
    </div>
  );
}
