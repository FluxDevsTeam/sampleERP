import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import SearchablePaginatedDropdown from "@/pages/shop/sold/Sold Components/SearchablePaginatedDropdown";
import CategoryDropdown from "../_components/Category";

interface ExpenseFormData {
  name: string;
  amount: number | "";
  quantity: number | "";
  selectedItem: string | null;
  selectedType: string;
  category: number | null;
  description: string;
}

const AddExpense: React.FC = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [formData, setFormData] = useState<ExpenseFormData>({
    name: "",
    amount: "",
    quantity: "",
    selectedItem: null,
    selectedType: "",
    category: null,
    description: "",
  });

  const addExpenseMutation = useMutation({
    mutationFn: async (newExpense: ExpenseFormData) => {
      const formattedData: any = {
        name: newExpense.name,
        amount: Number(newExpense.amount) || 0,
        quantity: newExpense.quantity || 0,
        category: newExpense.category,
        description: newExpense.description || "",
      };

      if (newExpense.selectedType === "project") {
        formattedData.project = Number(newExpense.selectedItem);
        formattedData.shop = null;
      } else if (newExpense.selectedType === "shop") {
        formattedData.shop = Number(newExpense.selectedItem);
        formattedData.project = null;
      } else {
        formattedData.project = null;
        formattedData.shop = null;
      }

      console.log("Sending data to API:", formattedData);

      try {
        const accessToken = localStorage.getItem("accessToken");
        const response = await axios.post(
          "https://backend.kidsdesigncompany.com/api/expense/",
          formattedData,
          {
            headers: {
              Authorization: `JWT ${accessToken}`,
            },
          }
        );
        return response.data;
      } catch (error: any) {
        console.error("API Error Details:", error.response?.data); 
        throw error;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["expenses"] });
      toast.success("Expense added successfully!");
      navigate("/admin/expenses");
    },
    onError: (error: any) => {
      console.error("Error details:", error);
      console.error("API Response:", error.response?.data);
      toast.error(error.response?.data?.message || "Failed to add expense. Please try again.");
    },
  });

  const handleInputChange = (name: string, value: string) => {
    if (name === "project" || name === "shop") {
      setFormData((prev) => ({
        ...prev,
        selectedType: name,
        selectedItem: value,
      }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-6">Add New Expense</h1>

      <form
        onSubmit={(e) => {
          e.preventDefault();
          addExpenseMutation.mutate(formData);
        }}
        className="space-y-4 max-w-2xl mx-auto"
      >
        <div className="space-y-4 max-w-2xl mx-auto">
          <div>
            <Label htmlFor="name">Name</Label>
            <Input
              id="name"
              name="name"
              value={formData.name}
              onChange={(e) => handleInputChange(e.target.name, e.target.value)}
              required
            />
          </div>

          <div>
            <Label htmlFor="description">Description (Optional)</Label>
            <Input
              id="description"
              name="description"
              value={formData.description}
              onChange={(e) => handleInputChange(e.target.name, e.target.value)}
            />
          </div>

          <div>
            <Label htmlFor="amount">Amount</Label>
            <Input
              id="amount"
              name="amount"
              type="number"
              value={formData.amount}
              onChange={(e) => handleInputChange(e.target.name, e.target.value)}
              required
            />
          </div>

          <div>
            <Label htmlFor="quantity">Quantity</Label>
            <Input
              id="quantity"
              name="quantity"
              type="number"
              value={formData.quantity}
              onChange={(e) => handleInputChange(e.target.name, e.target.value)}
              required
            />
          </div>

          <div className="space-y-1">
            <Label className="text-lg font-medium">Item Type (Optional)</Label>
            <div className="grid grid-cols-2 gap-4 mt-2">
              <div className="col-span-1">
                <SearchablePaginatedDropdown
                  endpoint="https://backend.kidsdesigncompany.com/api/project/"
                  label="Project"
                  name="project"
                  onChange={handleInputChange}
                  resultsKey="all_projects"
                />
              </div>

              <div className="col-span-1">
                <SearchablePaginatedDropdown
                  endpoint="https://backend.kidsdesigncompany.com/api/sold/"
                  label="Shop Item"
                  name="shop"
                  onChange={handleInputChange}
                  resultsKey="daily_data"
                  dataMapper={(data: any[]) => {
                    const items: { id: number; name: string }[] = [];
                    data.forEach((day: any) => {
                      if (day.entries && Array.isArray(day.entries)) {
                        day.entries.forEach((entry: any) => {
                          if (!items.some(item => item.id === entry.id)) {
                            items.push({
                              id: entry.id,
                              name: entry.name || "Unnamed item"
                            });
                          }
                        });
                      }
                    });
                    return items;
                  }}
                />
              </div>
            </div>
            {formData.selectedType && (formData.selectedType !== "other") && (
              <p className="text-sm text-blue-600 mt-1">
                Selected {formData.selectedType === "project" ? "Project" : "Shop Item"}
              </p>
            )}
          </div>
        </div>

        <CategoryDropdown
          selectedCategory={formData.category}
          onCategoryChange={(categoryId) => setFormData((prev) => ({ ...prev, category: categoryId }))}
        />

        <div className="flex gap-4 pt-4">
          <Button
            type="button"
            variant="outline"
            onClick={() => navigate("/admin/expenses")}
          >
            Cancel
          </Button>
          <Button
            type="submit"
            disabled={addExpenseMutation.isPending || !formData.category}
            className="flex-1"
          >
            {addExpenseMutation.isPending ? "Adding..." : "Add Expense"}
          </Button>
        </div>
      </form>
    </div>
  );
};

export default AddExpense;