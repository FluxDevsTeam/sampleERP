import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import axios, { AxiosError } from "axios";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

const API_URL = "https://backend.kidsdesigncompany.com/api/overhead-cost/";

// Define types for API response
interface OverheadCostData {
    overhead_cost_base: string;
}

export default function OverheadCost() {
    const queryClient = useQueryClient();
    const { register, handleSubmit, reset } = useForm<{ overhead_cost_base: string }>();

    // Fetch overhead cost
    const { data, isLoading, error } = useQuery<OverheadCostData>({
        queryKey: ["overheadCost"],
        queryFn: async () => {
            const response = await axios.get<OverheadCostData>(API_URL);
            return response.data;
        }
    });

    // Update overhead cost
    const mutation = useMutation({
        mutationFn: async (updatedData: { overhead_cost_base: string }) => {
            const response = await axios.patch<OverheadCostData>(API_URL, updatedData, {
                headers: { "Content-Type": "application/json" }
            });
            return response.data;
        },
        onSuccess: () => {
            toast.success("Overhead Cost updated successfully!");
            queryClient.invalidateQueries({ queryKey: ["overheadCost"] });
            reset(); // Reset form after successful update
        }
    });

    // Handle form submission
    const onSubmit = (formData: { overhead_cost_base: string }) => {
        mutation.mutate(formData);
    };

    if (isLoading) return <p>Loading...</p>;
    if (error) return <p>Error fetching data: {((error as AxiosError).message) || "Unknown error"}</p>;

    return (
        <div className="p-6 max-w-md bg-[#f5f7fa] rounded-lg shadow-md">
            <h2 className="text-xl font-bold mb-4">Overhead Cost</h2>
            <p className="mb-4">
                Current Base Cost: <strong>NGN{data?.overhead_cost_base ?? "N/A"}</strong>
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
                    className="w-full bg-blue-500 text-white py-2 rounded hover:bg-blue-600"
                    disabled={mutation.isPending}
                >
                    {mutation.isPending ? "Updating..." : "Update Cost"}
                </button>
            </form>
        </div>
    );
}