import React, { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
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

interface NewCategoryData {
  name: string;
}

const fetchProjects = async () => {
  const response = await axios.get("https://kidsdesigncompany.pythonanywhere.com/api/project/");
  return response.data.all_projects || [];
};

const fetchShopItems = async () => {
  const response = await axios.get("https://kidsdesigncompany.pythonanywhere.com/api/inventory-item/");
  return response.data.results?.items || [];
};

const fetchCategories = async (): Promise<Category[]> => {
  const { data } = await axios.get<{ results: Category[] }>(
    "https://kidsdesigncompany.pythonanywhere.com/api/expense-category/"
  );
  return data.results;
};

const CategoryDropdown = ({ selectedCategory, onCategoryChange }) => {
  const queryClient = useQueryClient();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [newCategory, setNewCategory] = useState<NewCategoryData>({ name: "" });

  const { data: categories = [], isLoading } = useQuery({
    queryKey: ["categories"],
    queryFn: fetchCategories,
  });

  const addCategoryMutation = useMutation({
    mutationFn: async (categoryData: NewCategoryData) => {
      const response = await axios.post<Category>(
        "https://kidsdesigncompany.pythonanywhere.com/api/expense-category/",
        categoryData
      );
      return response.data;
    },
    onSuccess: (data) => {
      queryClient.setQueryData(["categories"], (oldData: Category[] = []) => [
        ...oldData,
        { id: data.id, name: data.name },
      ]);

      onCategoryChange(data.id);
      toast.success("Category added successfully!");
      setNewCategory({ name: "" });
      setIsDialogOpen(false);
    },
    onError: () => toast.error("Failed to add category."),
  });

  return (
    <div className="space-y-2">
      <div className="flex items-end justify-between">
        <Label>Category</Label>
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
            <form
              onSubmit={(e) => {
                e.preventDefault();
                if (newCategory.name.trim()) {
                  addCategoryMutation.mutate(newCategory);
                } else {
                  toast.error("Category name is required");
                }
              }}
            >
              <div className="space-y-2">
                <Label htmlFor="categoryName">Category Name</Label>
                <Input
                  id="categoryName"
                  name="name"
                  value={newCategory.name}
                  onChange={(e) => setNewCategory({ name: e.target.value })}
                  required
                />
              </div>
              <DialogFooter>
                <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>
                  Cancel
                </Button>
                <Button type="submit" disabled={addCategoryMutation.isPending}>
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
        value={selectedCategory ?? ""}
        onChange={(e) => onCategoryChange(e.target.value ? Number(e.target.value) : null)}
        className="w-full border px-3 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        required
      >
        <option value="">Select Category</option>
        {isLoading ? <option disabled>Loading...</option> : categories.map((cat) => <option key={cat.id} value={cat.id}>{cat.name}</option>)}
      </select>
    </div>
  );
};

const AddExpense = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: "",
    amount: "",
    quantity: "",
    selectedItem: "",
    selectedType: "",
    category: null,
    description: "", // Added description field
  });

  const { data: projects = [], isLoading: isLoadingProjects } = useQuery({
    queryKey: ["projects"],
    queryFn: fetchProjects,
  });

  const { data: shopItems = [], isLoading: isLoadingShop } = useQuery({
    queryKey: ["shopItems"],
    queryFn: fetchShopItems,
  });

  const addExpenseMutation = useMutation({
    mutationFn: async (newExpense) => {
      if (!newExpense.selectedItem) throw new Error("Please select a project or shop item");
      
      // Format the data according to the API expectations
      const formattedData = {
        name: newExpense.name,
        amount: Number(newExpense.amount),
        quantity: Number(newExpense.quantity),
        category: newExpense.category,
        description: newExpense.description || "",
        // Add the correct field based on selectedType
        ...(newExpense.selectedType === "project" ? { linked_project: Number(newExpense.selectedItem) } : {}),
        ...(newExpense.selectedType === "shop" ? { sold_item: Number(newExpense.selectedItem) } : {})
      };

      const response = await axios.post("https://kidsdesigncompany.pythonanywhere.com/api/expense/", formattedData);
      return response.data;
    },
    onSuccess: () => {
      toast.success("Expense added successfully!");
      navigate("/admin/expenses");
    },
    onError: (error) => {
      console.error("Error details:", error);
      toast.error(error.response?.data?.message || "Failed to add expense.");
    },
  });

  const handleSelectItemType = (type, itemId) => {
    setFormData((prev) => ({
      ...prev,
      selectedItem: itemId,
      selectedType: type,
      // Clear the other selection when one is chosen
      ...(type === "project" ? { shopItemId: "" } : { projectId: "" })
    }));
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
        <div>
          <Label htmlFor="name">Name</Label>
          <Input 
            id="name"
            name="name" 
            value={formData.name} 
            onChange={(e) => setFormData((prev) => ({ ...prev, name: e.target.value }))} 
            required 
          />
        </div>

        <div>
          <Label htmlFor="description">Description (Optional)</Label>
          <Input 
            id="description"
            name="description" 
            value={formData.description} 
            onChange={(e) => setFormData((prev) => ({ ...prev, description: e.target.value }))} 
          />
        </div>

        <div>
          <Label htmlFor="amount">Amount</Label>
          <Input 
            id="amount"
            name="amount" 
            type="number" 
            value={formData.amount} 
            onChange={(e) => setFormData((prev) => ({ ...prev, amount: e.target.value }))} 
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
            onChange={(e) => setFormData((prev) => ({ ...prev, quantity: e.target.value }))} 
            required 
          />
        </div>

        <div className="space-y-1">
          <Label className="text-lg font-medium">Select Item Type</Label>
          <div className="grid grid-cols-2 gap-4 mt-2">
            <div className="col-span-1">
              <Label htmlFor="projectSelect" className="block mb-2">Project</Label>
              <select
                id="projectSelect"
                onChange={(e) => handleSelectItemType("project", e.target.value)}
                value={formData.selectedType === "project" ? formData.selectedItem : ""}
                disabled={formData.selectedType === "shop" && formData.selectedItem !== ""}
                className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Select a Project</option>
                {isLoadingProjects ? 
                  <option disabled>Loading...</option> : 
                  projects.map((proj) => (
                    <option key={proj.id} value={proj.id}>{proj.name}</option>
                  ))
                }
              </select>
            </div>
            
            <div className="col-span-1">
              <Label htmlFor="shopSelect" className="block mb-2">Shop Item</Label>
              <select
                id="shopSelect"
                onChange={(e) => handleSelectItemType("shop", e.target.value)}
                value={formData.selectedType === "shop" ? formData.selectedItem : ""}
                disabled={formData.selectedType === "project" && formData.selectedItem !== ""}
                className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Select a Shop Item</option>
                {isLoadingShop ? 
                  <option disabled>Loading...</option> : 
                  shopItems.map((item) => (
                    <option key={item.id} value={item.id}>{item.name}</option>
                  ))
                }
              </select>
            </div>
          </div>
          {formData.selectedType && (
            <p className="text-sm text-blue-600 mt-1">
              Selected {formData.selectedType === "project" ? "Project" : "Shop Item"}
            </p>
          )}
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
            disabled={addExpenseMutation.isPending || !formData.selectedItem || !formData.category}
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