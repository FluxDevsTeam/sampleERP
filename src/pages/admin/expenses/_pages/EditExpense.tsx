import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import SkeletonLoader from "../_components/SkeletonLoader";

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

const fetchProjects = async (): Promise<Project[]> => {
  const response = await axios.get("https://backend.kidsdesigncompany.com/api/project/");
  return response.data.all_projects || [];
};

const fetchShopItems = async (): Promise<ShopItem[]> => {
  try {
    const response = await axios.get("https://backend.kidsdesigncompany.com/api/sold/");
    console.log("Fetched Sold API response:", response.data);
    
    // Extract items from daily_data entries
    const items: ShopItem[] = [];
    
    if (response.data.daily_data && Array.isArray(response.data.daily_data)) {
      // Loop through each day
      response.data.daily_data.forEach((day: any) => {
        // Loop through each entry in that day
        if (day.entries && Array.isArray(day.entries)) {
          day.entries.forEach((entry: any) => {
            // Only add unique items to the list
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
    "https://backend.kidsdesigncompany.com/api/expense-category/"
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

const EditExpense: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
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

  // Fetch expense data
  const { data: expense, isLoading } = useQuery<Expense>({
    queryKey: ["expense", id],
    queryFn: async () => {
      const { data } = await axios.get(`https://backend.kidsdesigncompany.com/api/expense/${id}/`);
      return data;
    },
    enabled: !!id,
  });

  const { data: projects = [], isLoading: isLoadingProjects } = useQuery<Project[]>({
    queryKey: ["projects"],
    queryFn: fetchProjects,
  });

  const { data: shopItems = [], isLoading: isLoadingShop } = useQuery<ShopItem[]>({
    queryKey: ["shopItems"],
    queryFn: fetchShopItems,
  });

  // Update mutation
  const updateExpenseMutation = useMutation({
    mutationFn: async (data: ExpenseFormData) => {
      // Format the data according to the API expectations
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
      await axios.put(`https://backend.kidsdesigncompany.com/api/expense/${id}/`, formattedData);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["expenses"] });
      toast.success("Expense updated successfully!");
      navigate("/admin/expenses");
    },
    onError: (error) => {
      console.error("Error details:", error);
      toast.error("Failed to update expense. Please try again.");
    },
  });

  // Populate form when expense data is loaded
  useEffect(() => {
    if (expense) {
      // Determine the selected type and item
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
  }, [expense]);

  // Handle input changes
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

  // Handle form submission
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    updateExpenseMutation.mutate(formData);
  };

  return (
    <div className="container mx-auto p-4">
      <Card className="max-w-xl mx-auto">
        <CardHeader>
          <CardTitle>Edit Expense</CardTitle>
        </CardHeader>
        {isLoading ? (
          <CardContent>
            <SkeletonLoader/>
          </CardContent>
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
            </CardContent>
            <CardFooter className="flex justify-between">
              <Button
                type="button"
                variant="outline"
                onClick={() => navigate("/admin/expenses")}
              >
                Cancel
              </Button>
              <Button 
                type="submit" 
                disabled={updateExpenseMutation.isPending || !formData.selectedItem || !formData.category}
              >
                {updateExpenseMutation.isPending ? "Updating..." : "Update Expense"}
              </Button>
            </CardFooter>
          </form>
        )}
      </Card>
    </div>
  );
};

export default EditExpense;