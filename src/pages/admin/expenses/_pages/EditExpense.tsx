import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

// Define TypeScript interfaces
interface Category {
  id: number;
  name: string;
}

// Interface for form state
interface ExpenseFormData {
  id?: number;
  name: string;
  expense_category: string; // Now storing category name instead of ID
  linked_project: number | null;
  sold_item: string | null;
  amount: string;
  quantity: string;
  description?: string;
}

// Fetch categories
const fetchCategories = async (): Promise<Category[]> => {
  const { data } = await axios.get<{ results: Category[] }>(
    "https://kidsdesigncompany.pythonanywhere.com/api/expense-category/"
  );
  return data.results;
};

const AddExpense: React.FC = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  // Fetch categories using React Query
  const { data: categories, isLoading } = useQuery<Category[]>({
    queryKey: ["categories"],
    queryFn: fetchCategories,
  });

  // Mutation to add an expense
  const addExpenseMutation = useMutation({
    mutationFn: async (newExpense: ExpenseFormData) => {
      try {
        const response = await axios.post(
          "https://kidsdesigncompany.pythonanywhere.com/api/expense/", 
          newExpense
        );
        return response.data;
      } catch (error) {
        console.error("Full error details:", error);
        throw error;
      }
    },
    onSuccess: () => {
      toast.success("Expense added successfully!");
      navigate("/admin/dashboard/expenses");
    },
    onError: () => {
      toast.error("Failed to add expense. Please try again.");
    },
  });

  const [formData, setFormData] = useState<ExpenseFormData>({
    name: "",
    expense_category: "", // Now storing the category name
    amount: "",
    quantity: "1",
    linked_project: null,
    sold_item: null,
    description: "",
  });

  // Handle form input change
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
  
    setFormData((prevData) => ({
      ...prevData,
      [name]: value, // ✅ Directly store category name
    }));
  };
  

  // Handle form submission
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
  
    // Find the selected category object based on the stored category name
    const selectedCategory = categories?.find(
      (cat) => cat.name === formData.expense_category
    );
  
    if (!selectedCategory) {
      toast.error("Please select a valid category.");
      return;
    }
  
    // Convert formData into the correct structure before submitting
    const formattedData = {
      ...formData,
      expense_category: { id: selectedCategory.id }, // Convert category name to ID
    };
  
    console.log("Submitting expense data:", formattedData);
    addExpenseMutation.mutate(formattedData);
  };

  if (isLoading) return <p>Loading categories...</p>;

  return (
    <div className="max-w-lg mx-auto p-6 bg-white shadow-md rounded-lg">
      <h2 className="text-xl font-bold mb-4">Add New Expense</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Name */}
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

        {/* Category */}
        <div>
          <label className="block text-sm font-medium mb-1">Category</label>
          <select
            name="expense_category"
            value={formData.expense_category} // Now binding to the category name
            onChange={handleChange}
            className="w-full border px-3 py-2 rounded-md"
          >
            <option value="">Select Category</option>
            {categories?.map((category) => (
              <option key={category.id} value={category.name}>
                {category.name}
              </option>
            ))}
          </select>
        </div>

        {/* Amount */}
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

        {/* Quantity */}
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

        {/* Description */}
        <div>
          <label className="block text-sm font-medium mb-1">Description</label>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
            placeholder="Description (Optional)"
            className="w-full border px-3 py-2 rounded-md"
            rows={3}
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
