import React, { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

// Define the types
interface Category {
  id: number;
  name: string;
}

interface ExpenseData {
  id?: number;
  name: string;
  category: number | null; // Change from expense_category to category to match API expectation
  amount: number;
  quantity: number;
}

// Fetch categories from API
const fetchCategories = async (): Promise<Category[]> => {
  const { data } = await axios.get<{ results: Category[] }>(
    "https://kidsdesigncompany.pythonanywhere.com/api/expense-category/"
  );
  return data.results;
};

const AddExpense: React.FC = () => {
  const navigate = useNavigate();

  const { data: categories, isLoading } = useQuery<Category[]>({
    queryKey: ["categories"],
    queryFn: fetchCategories,
  });

  const [formData, setFormData] = useState<ExpenseData>({
    name: "",
    category: null, // Changed from expense_category to category
    amount: 0,
    quantity: 1,
  });

  const addExpenseMutation = useMutation({
    mutationFn: async (newExpense: ExpenseData) => {
      console.log("Submitting expense data:", newExpense);

      try {
        // Make sure category is not null before submitting
        if (!newExpense.category) {
          throw new Error("Category is required");
        }

        const response = await axios.post(
          "https://kidsdesigncompany.pythonanywhere.com/api/expense/",
          newExpense // Send the data as is with "category" field
        );
        console.log("Expense added successfully:", response.data);
        return response.data;
      } catch (error: any) {
        console.error("Error response:", error.response?.data || error.message);
        throw error;
      }
    },
    onSuccess: () => {
      toast.success("Expense added successfully!");
      navigate("/admin/dashboard/expenses");
    },
    onError: (error: any) => {
      console.error("Failed to add expense:", error);
      const errorMessage = error.response?.data
        ? Object.values(error.response.data).flat().join(", ")
        : "Failed to add expense. Please try again.";
      toast.error(errorMessage);
    },
  });

  // Handle input changes
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]:
        name === "category" // Changed from expense_category to category
          ? value ? Number(value) : null
          : name === "amount" || name === "quantity"
          ? Number(value)
          : value,
    }));
  };

  // Handle form submission
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate category before submission
    if (!formData.category) {
      toast.error("Please select a category");
      return;
    }
    
    addExpenseMutation.mutate(formData);
  };

  if (isLoading) return <p>Loading categories...</p>;

  return (
    <div className="max-w-lg mx-auto p-6 bg-white shadow-md rounded-lg">
      <h2 className="text-xl font-bold mb-4">Add New Expense</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Name Input */}
        <div>
          <label className="block text-sm font-medium mb-1">Name</label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            placeholder="Expense Name"
            className="w-full border px-3 py-2 rounded-md"
            required
          />
        </div>

        {/* Category Dropdown */}
        <div>
          <label className="block text-sm font-medium mb-1">Category</label>
          <select
            name="category" // Changed from expense_category to category
            value={formData.category ?? ""}
            onChange={handleChange}
            className="w-full border px-3 py-2 rounded-md"
            required // Added required attribute
          >
            <option value="">Select Category</option>
            {categories?.map((category) => (
              <option key={category.id} value={category.id}>
                {category.name}
              </option>
            ))}
          </select>
        </div>

        {/* Amount Input */}
        <div>
          <label className="block text-sm font-medium mb-1">Amount</label>
          <input
            type="number"
            name="amount"
            value={formData.amount}
            onChange={handleChange}
            placeholder="Amount"
            step="0.01"
            className="w-full border px-3 py-2 rounded-md"
            required
          />
        </div>

        {/* Quantity Input */}
        <div>
          <label className="block text-sm font-medium mb-1">Quantity</label>
          <input
            type="number"
            name="quantity"
            value={formData.quantity}
            onChange={handleChange}
            placeholder="Quantity"
            className="w-full border px-3 py-2 rounded-md"
            required
          />
        </div>

        {/* Submit Button */}
        <Button
          type="submit"
          className="w-full bg-neutral-900 text-white py-2 rounded-md"
          disabled={addExpenseMutation.isPending}
        >
          {addExpenseMutation.isPending ? "Adding..." : "Add Expense"}
        </Button>
      </form>
    </div>
  );
};

export default AddExpense;