import React, { useState, useEffect } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import SkeletonLoader from "../_components/SkeletonLoader";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";

interface ExpenseFormData {
  name: string;
  amount: number | "";
  quantity: number | "";
  description: string;
  selectedType: string;
  selectedItem: string | null;
  category: number | null;
}

interface Project {
  id: number;
  name: string;
}

interface ShopItem {
  id: number;
  name: string;
}

interface Category {
  id: number;
  name: string;
}

interface ItemDropdownProps {
  label: string;
  items: any[];
  selectedItem: string | null;
  isLoading: boolean;
  disabled: boolean;
  onItemChange: (itemId: string) => void;
}

interface CategoryDropdownProps {
  selectedCategory: number | null;
  onCategoryChange: (categoryId: number | null) => void;
}

interface Expense {
  id: number;
  name: string;
  description: string;
  amount: number;
  quantity: number;
  category?: {
    id: number;
    name: string;
  };
  project?: {
    id: number;
    name: string;
  };
  shop?: {
    id: number;
    name: string;
  };
}

interface EditExpenseModalProps {
  expenseId: string;
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess?: () => void;
  initialData?: Expense;
}

const fetchProjects = async (): Promise<Project[]> => {
  const response = await axios.get("https://kidsdesigncompany.pythonanywhere.com/api/project/");
  return response.data.all_projects || [];
};

const fetchShopItems = async (): Promise<ShopItem[]> => {
  try {
    const response = await axios.get("https://kidsdesigncompany.pythonanywhere.com/api/sold/");
    console.log("Fetched Sold API response:", response.data);
    
    const items: ShopItem[] = [];
    
    if (response.data.daily_data && Array.isArray(response.data.daily_data)) {
      response.data.daily_data.forEach((day: any) => {
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
    }
    
    console.log("Processed Shop Items:", items);
    return items;
  } catch (error) {
    console.error("Error fetching shop items:", error);
    toast.error("Failed to fetch shop items. Please try again.");
    return [];
  }
};

const fetchCategories = async (): Promise<Category[]> => {
  const { data } = await axios.get<Category[]>(
    "https://kidsdesigncompany.pythonanywhere.com/api/expense-category/"
  );
  return data;
};

const ItemDropdown: React.FC<ItemDropdownProps> = ({ label, items, selectedItem, isLoading, disabled, onItemChange }) => {
  return (
    <div>
      <Label htmlFor={`${label.toLowerCase()}Select`} className="block mb-2">{label}</Label>
      <select
        id={`${label.toLowerCase()}Select`}
        onChange={(e) => onItemChange(e.target.value)}
        value={selectedItem || ""}
        disabled={disabled}
        className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500"
      >
        <option value="">Select a {label}</option>
        {isLoading ? (
          <option disabled>Loading...</option>
        ) : (
          items.map((item) => (
            <option key={item.id} value={item.id}>
              {item.name}
            </option>
          ))
        )}
      </select>
    </div>
  );
};

const CategoryDropdown: React.FC<CategoryDropdownProps> = ({ selectedCategory, onCategoryChange }) => {
  const { data: categories = [], isLoading } = useQuery({
    queryKey: ["categories"],
    queryFn: fetchCategories,
  });

  return (
    <div className="space-y-2">
      <Label>Category</Label>
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

const EditExpenseModal: React.FC<EditExpenseModalProps> = ({ 
  expenseId, 
  isOpen, 
  onOpenChange, 
  onSuccess,
  initialData 
}) => {
  const queryClient = useQueryClient();
  
  const [formData, setFormData] = useState<ExpenseFormData>({
    name: "",
    amount: "",
    quantity: "",
    description: "",
    selectedType: "",
    selectedItem: null,
    category: null,
  });

  const { data: projects = [], isLoading: isLoadingProjects } = useQuery<Project[]>({
    queryKey: ["projects"],
    queryFn: fetchProjects,
  });

  const { data: shopItems = [], isLoading: isLoadingShop } = useQuery<ShopItem[]>({
    queryKey: ["shopItems"],
    queryFn: fetchShopItems,
  });

  // Populate form when initial data is provided or when modal opens
  useEffect(() => {
    if (initialData || isOpen) {
      const expense = initialData;
      if (expense) {
        let selectedType = "";
        let selectedItem = null;
        
        if (expense.project) {
          selectedType = "project";
          selectedItem = expense.project.id.toString();
        } else if (expense.shop) {
          selectedType = "shop";
          selectedItem = expense.shop.id.toString();
        }
        
        setFormData({
          name: expense.name || "",
          description: expense.description || "",
          amount: expense.amount || "",
          quantity: expense.quantity || "",
          selectedType,
          selectedItem,
          category: expense.category?.id || null,
        });
      }
    }
  }, [initialData, isOpen]);

  // Update mutation
  const updateExpenseMutation = useMutation({
    mutationFn: async (data: ExpenseFormData) => {
      const formattedData = {
        name: data.name,
        description: data.description || "",
        amount: Number(data.amount) || 0,
        quantity: data.quantity,
        category: data.category,
        project: data.selectedType === "project" ? Number(data.selectedItem) : null,
        shop: data.selectedType === "shop" ? Number(data.selectedItem) : null,
      };

      console.log("Sending update data to API:", formattedData);
      await axios.put(`https://kidsdesigncompany.pythonanywhere.com/api/expense/${expenseId}/`, formattedData);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["expenses"] });
      toast.success("Expense updated successfully!");
      onOpenChange(false);
      if (onSuccess) onSuccess();
    },
    onError: (error) => {
      console.error("Error details:", error);
      toast.error("Failed to update expense. Please try again.");
    },
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === "amount" || name === "quantity" ? (value === "" ? "" : Number(value)) : value,
    }));
  };

  const handleSelectItemType = (type: "project" | "shop", itemId: string) => {
    setFormData((prev) => ({
      ...prev,
      selectedItem: itemId,
      selectedType: type,
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    updateExpenseMutation.mutate(formData);
  };

  const isLoading = !initialData && isOpen;

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Edit Expense</DialogTitle>
        </DialogHeader>
        
        {isLoading ? (
          <SkeletonLoader/>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
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
              <Label htmlFor="description">Description (Optional)</Label>
              <Input
                id="description"
                name="description"
                value={formData.description}
                onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
              />
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

            <div className="space-y-2">
              <Label className="text-lg font-medium">Item Type</Label>
              <div className="grid grid-cols-2 gap-4 mt-2">
                <div className="col-span-1">
                  <ItemDropdown
                    label="Project"
                    items={projects}
                    selectedItem={formData.selectedType === "project" ? formData.selectedItem : ""}
                    isLoading={isLoadingProjects}
                    disabled={formData.selectedType === "shop" && !!formData.selectedItem}
                    onItemChange={(itemId) => handleSelectItemType("project", itemId)}
                  />
                </div>

                <div className="col-span-1">
                  <ItemDropdown
                    label="Shop Item"
                    items={shopItems}
                    selectedItem={formData.selectedType === "shop" ? formData.selectedItem : ""}
                    isLoading={isLoadingShop}
                    disabled={formData.selectedType === "project" && !!formData.selectedItem}
                    onItemChange={(itemId) => handleSelectItemType("shop", itemId)}
                  />
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

            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() => onOpenChange(false)}
              >
                Cancel
              </Button>
              <Button 
                type="submit" 
                disabled={updateExpenseMutation.isPending || !formData.selectedItem || !formData.category}
              >
                {updateExpenseMutation.isPending ? "Updating..." : "Update Expense"}
              </Button>
            </DialogFooter>
          </form>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default EditExpenseModal;