import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
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

interface ExpenseCategory {
  id: number;
  name: string;
}

interface LinkedProject {
  id: number;
  name: string;
}

interface SoldItem {
  id: number;
  name: string;
  quantity: string;
  cost_price: string;
  selling_price: string;
  total_price: number;
}

interface Entry {
  id: number;
  name: string;
  expense_category: ExpenseCategory | null;
  description: string;
  linked_project: LinkedProject | null;
  sold_item: SoldItem | null;
  amount: string;
  quantity: string;
  date: string;
}

interface Project {
  id: number;
  name: string;
}

interface ShopItem {
  id: number;
  name: string;
}

interface CategoryDropdownProps {
  selectedCategory: number | null;
  onCategoryChange: (categoryId: number | null) => void;
}

interface ItemDropdownProps {
  label: string;
  items: any[];
  selectedItem: string;
  isLoading: boolean;
  disabled: boolean;
  onItemChange: (itemId: string) => void;
}

interface ExpenseFormData {
  name: string;
  amount: string;
  quantity: string;
  selectedItem: string;
  selectedType: string;
  category: number | null;
  description: string;
}

const fetchProjects = async (): Promise<Project[]> => {
  const response = await axios.get("https://backend.kidsdesigncompany.com/api/project/");
  return response.data.all_projects || [];
};

const fetchShopItems = async (): Promise<ShopItem[]> => {
  try {
    const response = await axios.get("https://backend.kidsdesigncompany.com/api/sold/");
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
  } catch (error: any) {
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
        value={selectedItem}
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
        "https://backend.kidsdesigncompany.com/api/expense-category/",
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
              <DialogFooter className="mt-6">
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

interface AddExpenseModalProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess?: () => void;
}

const AddExpenseModal: React.FC<AddExpenseModalProps> = ({ isOpen, onOpenChange, onSuccess }) => {
  const [formData, setFormData] = useState<ExpenseFormData>({
    name: "",
    amount: "",
    quantity: "",
    selectedItem: "",
    selectedType: "",
    category: null,
    description: "",
  });

  const { data: projects = [], isLoading: isLoadingProjects } = useQuery<Project[]>({
    queryKey: ["projects"],
    queryFn: fetchProjects,
  });

  const { data: shopItems = [], isLoading: isLoadingShop } = useQuery<ShopItem[]>({
    queryKey: ["shopItems"],
    queryFn: fetchShopItems,
  });

  const addExpenseMutation = useMutation({
    mutationFn: async (newExpense: ExpenseFormData) => {
      if (!newExpense.selectedItem) throw new Error("Please select a project or shop item");

      if (newExpense.selectedType === "shop") {
        const shopItemExists = shopItems.some((item) => item.id === Number(newExpense.selectedItem));
        if (!shopItemExists) {
          throw new Error(`Selected shop item with ID ${newExpense.selectedItem} does not exist.`);
        }
      }

      const formattedData = {
        name: newExpense.name,
        amount: Number(newExpense.amount),
        quantity: newExpense.quantity, 
        category: newExpense.category,
        description: newExpense.description || "",
        project: newExpense.selectedType === "project" ? Number(newExpense.selectedItem) : null,
        shop: newExpense.selectedType === "shop" ? Number(newExpense.selectedItem) : null, 
      };

      console.log("Sending data to API:", formattedData);

      try {
        const response = await axios.post(
          "https://backend.kidsdesigncompany.com/api/expense/",
          formattedData
        );
        return response.data;
      } catch (error: any) {
        console.error("API Error Details:", error.response?.data); 
        throw error;
      }
    },
    onSuccess: () => {
      toast.success("Expense added successfully!");
      onOpenChange(false);
      setFormData({
        name: "",
        amount: "",
        quantity: "",
        selectedItem: "",
        selectedType: "",
        category: null,
        description: "",
      });
      if (onSuccess) onSuccess();
    },
    onError: (error: any) => {
      console.error("Error details:", error);
      console.error("API Response:", error.response?.data);
      toast.error(error.response?.data?.message || "Failed to add expense. Please try again.");
    },
  });

  const handleSelectItemType = (type: "project" | "shop", itemId: string) => {
    setFormData((prev) => ({
      ...prev,
      selectedItem: itemId,
      selectedType: type,
    }));
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Add New Expense</DialogTitle>
        </DialogHeader>
        
        <form
          onSubmit={(e) => {
            e.preventDefault();
            addExpenseMutation.mutate(formData);
          }}
          className="space-y-4"
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
                <ItemDropdown
                  label="Project"
                  items={projects}
                  selectedItem={formData.selectedType === "project" ? formData.selectedItem : ""}
                  isLoading={isLoadingProjects}
                  disabled={formData.selectedType === "shop" && formData.selectedItem !== ""}
                  onItemChange={(itemId) => handleSelectItemType("project", itemId)}
                />
              </div>

              <div className="col-span-1">
                <ItemDropdown
                  label="Shop Item"
                  items={shopItems}
                  selectedItem={formData.selectedType === "shop" ? formData.selectedItem : ""}
                  isLoading={isLoadingShop}
                  disabled={formData.selectedType === "project" && formData.selectedItem !== ""}
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
              disabled={addExpenseMutation.isPending || !formData.selectedItem || !formData.category}
              className="flex-1"
            >
              {addExpenseMutation.isPending ? "Adding..." : "Add Expense"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default AddExpenseModal;