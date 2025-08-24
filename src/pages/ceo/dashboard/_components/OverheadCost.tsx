import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

// Import static JSON data
import overheadCostDataInitial from "@/data/ceo/settings/overhead_cost.json";

// Define types for data
interface OverheadCostData {
  overhead_cost_base: string;
}

interface OverheadCostProps {
  onUpdateOverheadCost: (updatedData: OverheadCostData) => void;
}

const formatNumber = (num: string | number) => {
  const n = typeof num === "string" ? parseFloat(num) : num;
  if (isNaN(n)) return num;
  return n.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 });
};

export default function OverheadCost({ onUpdateOverheadCost }: OverheadCostProps) {
  const { register, handleSubmit, reset } = useForm<{
    overhead_cost_base: string;
  }>();
  const [data, setData] = useState<OverheadCostData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isUpdating, setIsUpdating] = useState(false);

  useEffect(() => {
    const fetchData = () => {
      try {
        // Load data from overhead_cost.json
        const dashboardData: OverheadCostData = overheadCostDataInitial;
        setData({ overhead_cost_base: dashboardData.overhead_cost_base });
        setIsLoading(false);
      } catch (err) {
        setError("Failed to load overhead cost");
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  // Handle form submission
  const onSubmit = (formData: { overhead_cost_base: string }) => {
    setIsUpdating(true);
    try {
      // Create updated data object
      const updatedData: OverheadCostData = {
        overhead_cost_base: formData.overhead_cost_base,
      };

      // Update local state
      setData(updatedData);
      // Notify parent component of the update
      onUpdateOverheadCost(updatedData);
      console.log("Updated overhead cost (simulated):", updatedData);

      toast.success("Overhead Cost updated successfully!");
      reset();
    } catch (error) {
      console.error("Error updating overhead cost:", error);
      toast.error("Error updating overhead cost");
    } finally {
      setIsUpdating(false);
    }
  };

  if (isLoading) return <p>Loading...</p>;
  if (error) return <p>Error fetching data: {error}</p>;

  return (
    <div className="p-0 pl-2 max-w-md bg-[#f5f7fa] rounded-lg shadow-md">
      <h2 className="text-xl font-bold mb-1">Overhead Cost</h2>
      <p className="mb-2">
        Current Base Cost:{" "}
        <strong>₦{data?.overhead_cost_base ? formatNumber(data.overhead_cost_base) : "N/A"}</strong>
      </p>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <input
          {...register("overhead_cost_base", { required: true })}
          type="number"
          step="0.01"
          placeholder="Enter new cost"
          className="w-full p-2 border rounded"
        />
        <button
          type="submit"
          className="w-full bg-gradient-to-r from-blue-400 via-blue-500 to-blue-600 text-white py-2 rounded hover:from-blue-500 hover:to-blue-700 hover:via-blue-600"
          disabled={isUpdating}
        >
          {isUpdating ? "Updating..." : "Update Cost"}
        </button>
      </form>
    </div>
  );
}