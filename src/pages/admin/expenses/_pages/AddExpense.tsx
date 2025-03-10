import React, { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import SkeletonLoader from "../_components/SkeletonLoader";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog";

interface Category {
  id: number;
  name: string;
}

interface ExpenseData {
  id?: number;
  name: string;
  category: number | null;
  amount: number | "";
  quantity: number | "";
}

interface NewCategoryData {
  name: string;
}

const fetchCategories = async (): Promise<Category[]> => {
  const { data } = await axios.get<{ results: Category[] }>(
    "https://kidsdesigncompany.pythonanywhere.com/api/expense-category/"
  );
  return data.results;
};

const AddExpense: React.FC = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  
  const { data: categories = [], isLoading } = useQuery<Category[]>({
    queryKey: ["categories"],
    queryFn: fetchCategories,
  });

  const [formData, setFormData] = useState<ExpenseData>({
    name: "",
    category: null,
    amount: "",
    quantity: "",
  });

  const [newCategory, setNewCategory] = useState<NewCategoryData>({
    name: "",
  });

  const addCategoryMutation = useMutation({
    mutationFn: async (categoryData: NewCategoryData) => {
      const response = await axios.post(
        "https://kidsdesigncompany.pythonanywhere.com/api/expense-category/",
        categoryData
      );
      return response.data;
    },
    onSuccess: (data) => {
      // Add the new category to the existing categories in React Query cache
      const newCategoryItem: Category = {
        id: data.id,
        name: data.name,
      };
      
      queryClient.setQueryData(["categories"], (oldData: Category[] = []) => {
        return [...oldData, newCategoryItem];
      });
      
      // Set the newly created category as selected
      setFormData((prev) => ({
        ...prev,
        category: data.id,
      }));
      
      toast.success("Category added successfully!");
      setNewCategory({ name: "" });
      setIsDialogOpen(false);
    },
    onError: (error: any) => {
      const errorMessage = error.response?.data
        ? Object.values(error.response.data).flat().join(", ")
        : "Failed to add category. Please try again.";
      toast.error(errorMessage);
    },
  });

  const addExpenseMutation = useMutation({
    mutationFn: async (newExpense: ExpenseData) => {
      if (!newExpense.category) {
        throw new Error("Category is required");
      }
      const response = await axios.post(
        "https://kidsdesigncompany.pythonanywhere.com/api/expense/",
        newExpense
      );
      return response.data;
    },
    onSuccess: () => {
      toast.success("Expense added successfully!");
      navigate("/admin/dashboard/expenses");
    },
    onError: (error: any) => {
      const errorMessage = error.response?.data
        ? Object.values(error.response.data).flat().join(", ")
        : "Failed to add expense. Please try again.";
      toast.error(errorMessage);
    },
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]:
        name === "category"
          ? value ? Number(value) : null
          : name === "amount" || name === "quantity"
          ? value === "" ? "" : Number(value)
          : value,
    }));
  };

  const handleCategoryChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setNewCategory((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleAddCategory = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCategory.name.trim()) {
      toast.error("Category name is required");
      return;
    }
    addCategoryMutation.mutate(newCategory);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Skip category validation if the dialog is open
    if (!formData.category && !isDialogOpen) {
      toast.error("Please select a category");
      return;
    }
    
    // If dialog is open, delay form submission and open the category modal
    if (isDialogOpen) {
      e.preventDefault();
      return;
    }
    
    addExpenseMutation.mutate({
      ...formData,
      amount: Number(formData.amount) || 0,
      quantity: Number(formData.quantity) || 1,
    });
  };

  return (
    <div className="container mx-auto p-4">
      <Card className="max-w-md mx-auto">
        <CardHeader>
          <CardTitle>Add New Expense</CardTitle>
        </CardHeader>
        {isLoading ? (
          <p className="text-center text-gray-500"><SkeletonLoader/></p>
        ) : (
          <form onSubmit={handleSubmit}>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">Name</Label>
                <Input
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="space-y-2">
                <div className="flex items-end justify-between">
                  <Label htmlFor="category">Category</Label>
                  <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                    <DialogTrigger asChild>
                      <Button type="button" variant="outline" size="sm">
                        Create New
                      </Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>Create New Category</DialogTitle>
                      </DialogHeader>
                      <form onSubmit={handleAddCategory}>
                        <div className="space-y-4 py-4">
                          <div className="space-y-2">
                            <Label htmlFor="categoryName">Category Name</Label>
                            <Input
                              id="categoryName"
                              name="name"
                              value={newCategory.name}
                              onChange={handleCategoryChange}
                              required
                            />
                          </div>
                        </div>
                        <DialogFooter>
                          <Button 
                            type="button" 
                            variant="outline" 
                            onClick={() => setIsDialogOpen(false)}
                          >
                            Cancel
                          </Button>
                          <Button 
                            type="submit" 
                            disabled={addCategoryMutation.isPending}
                          >
                            {addCategoryMutation.isPending ? "Creating..." : "Create Category"}
                          </Button>
                        </DialogFooter>
                      </form>
                    </DialogContent>
                  </Dialog>
                </div>
                <select
                  id="category"
                  name="category"
                  value={formData.category ?? ""}
                  onChange={handleChange}
                  className="w-full border px-3 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required={!isDialogOpen} // Only required when dialog is closed
                >
                  <option value="">Select Category</option>
                  {categories.map((category) => (
                    <option key={category.id} value={category.id}>
                      {category.name}
                    </option>
                  ))}
                </select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="amount">Amount</Label>
                <Input
                  id="amount"
                  name="amount"
                  type="number"
                  value={formData.amount}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="quantity">Quantity</Label>
                <Input
                  id="quantity"
                  name="quantity"
                  type="number"
                  value={formData.quantity}
                  onChange={handleChange}
                  required
                />
              </div>
            </CardContent>
            <CardFooter className="flex justify-between">
              <Button
                type="button"
                variant="outline"
                onClick={() => navigate("/admin/dashboard/expenses")}
              >
                Cancel
              </Button>
              <Button 
                type="submit" 
                disabled={addExpenseMutation.isPending || isDialogOpen}
              >
                {addExpenseMutation.isPending ? "Adding..." : "Add Expense"}
              </Button>
            </CardFooter>
          </form>
        )}
      </Card>
    </div>
  );
};

export default AddExpense;