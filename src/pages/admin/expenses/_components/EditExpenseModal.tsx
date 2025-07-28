import React, { useState, useEffect } from "react";
import axios from "axios";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import SkeletonLoader from "../_components/SkeletonLoader";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import SearchablePaginatedDropdown from "@/pages/shop/sold/Sold Components/SearchablePaginatedDropdown";
import CategoryDropdown from "./Category";

interface ExpenseFormData {
  name: string;
  amount: number | "";
  quantity: number | "";
  description: string | undefined;
  selectedType: string;
  selectedItem: string | null;
  category: number | null;
  date?: string;
  product?: number | null; // Add product field
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
  product?: {
    id: number;
    name: string;
  }; // Add product field to Expense interface
}

interface EditExpenseModalProps {
  expense: Expense;
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess?: () => void;
}

const fetchProjects = async (): Promise<Project[]> => {
  const token = localStorage.getItem("accessToken");
  const response = await axios.get(
    "https://backend.kidsdesigncompany.com/api/project/",
    {
      headers: {
        Authorization: `JWT ${token}`,
      },
    }
  );
  return response.data.all_projects || [];
};

const fetchShopItems = async (): Promise<ShopItem[]> => {
  try {
    const token = localStorage.getItem("accessToken");
    const response = await axios.get(
      "https://backend.kidsdesigncompany.com/api/sold/",
      {
        headers: {
          Authorization: `JWT ${token}`,
        },
      }
    );
    console.log("Fetched Sold API response:", response.data);

    const items: ShopItem[] = [];

    if (response.data.daily_data && Array.isArray(response.data.daily_data)) {
      response.data.daily_data.forEach((day: any) => {
        if (day.entries && Array.isArray(day.entries)) {
          day.entries.forEach((entry: any) => {
            if (!items.some((item) => item.id === entry.id)) {
              items.push({
                id: entry.id,
                name: entry.name || "Unnamed item",
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
  const token = localStorage.getItem("accessToken");
  const { data } = await axios.get<Category[]>(
    "https://backend.kidsdesigncompany.com/api/expense-category/",
    {
      headers: {
        Authorization: `JWT ${token}`,
      },
    }
  );
  return data;
};

const EditExpenseModal: React.FC<EditExpenseModalProps> = ({
  expense,
  isOpen,
  onOpenChange,
  onSuccess,
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
    date: "",
    product: null,
  });

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
      } else if (expense.product) {
        selectedType = "product";
        selectedItem = expense.product.id.toString();
      } else if (expense.category && !expense.project && !expense.shop && !expense.product) {
        selectedType = "other";
      }
      
      setFormData({
        name: expense.name || "",
        description: expense.description || "",
        amount: expense.amount || "",
        quantity: String(expense.quantity) || "", // Ensure quantity is string
        selectedType,
        selectedItem,
        category: expense.category?.id || null,
        date: expense.date ? new Date(expense.date).toISOString().split('T')[0] : "", // Ensure YYYY-MM-DD format
        product: expense.product?.id || null, // Populate product field
      });
    }
  }, [expense]);

  const mutation = useMutation({
    mutationFn: async (data: ExpenseFormData) => {
      // Format the data according to the API expectations
      const formattedData: any = {
        name: data.name,
        description: data.description || "",
        amount: Number(data.amount) || 0,
        quantity: data.quantity,
        category: data.category,
        project: data.selectedType === "project" && data.selectedItem ? Number(data.selectedItem) : null,
        shop: data.selectedType === "shop" && data.selectedItem ? Number(data.selectedItem) : null,
        product: data.selectedType === "product" && data.selectedItem ? Number(data.selectedItem) : null, // Change to 'product'
        date: data.date || undefined,
      };

      if (data.selectedType === "other") {
        formattedData.project = null;
        formattedData.shop = null;
        formattedData.product = null; // Clear 'product' as well
      }

      console.log("Sending update data to API:", formattedData);
      const accessToken = localStorage.getItem("accessToken");
      await axios.put(
        `https://backend.kidsdesigncompany.com/api/expense/${expense.id}/`,
        formattedData,
        {
          headers: {
            Authorization: `JWT ${accessToken}`,
          },
        }
      );
    },
    onSuccess: () => {
      toast.success("Expense updated successfully.");
      queryClient.invalidateQueries({ queryKey: ["expenses"] });
      if (onSuccess) {
        onSuccess();
      }
      onOpenChange(false); // Close the modal on success
    },
    onError: (error) => {
      console.error("Error updating expense:", error);
      toast.error(
        "Failed to update expense. " +
          (error as any).response?.data?.detail ||
          (error as any).message ||
          "Please try again."
      );
    },
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === "amount" || name === "quantity" ? (value === "" ? "" : Number(value)) : value,
    }));
  };

  const handleInputChange = (name: string, value: string) => {
    if (name === "project" || name === "shop" || name === "product") { // Include product
      setFormData((prev) => ({
        ...prev,
        selectedType: name,
        selectedItem: value,
      }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    mutation.mutate(formData);
  };

  const isSubmitDisabled = !formData.category || mutation.isPending;

  if (mutation.isPending) {
    return <SkeletonLoader />;
  }

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[650px]">
        <DialogHeader>
          <DialogTitle>Edit Expense</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="grid gap-4 py-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="name">Name</Label>
                <Input
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={(e) => handleInputChange(e.target.name, e.target.value)}
                className="w-full"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="amount">Amount (₦)</Label>
                <Input
                  id="amount"
                  name="amount"
                  type="number"
                  value={formData.amount}
                  onChange={(e) => handleInputChange(e.target.name, e.target.value)}
                className="w-full"
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
                <Label className="text-lg font-medium">Item Type (optional)</Label>
                <select
                  id="selectedType"
                  name="selectedType"
                  value={formData.selectedType}
                  onChange={(e) => {
                    setFormData((prev) => ({
                      ...prev,
                      selectedType: e.target.value,
                      selectedItem: null, // Clear selected item when type changes
                    }));
                  }}
                  className="w-full border px-3 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">Select Item Type</option>
                  <option value="project">Project</option>
                  <option value="shop">Shop Item</option>
                  <option value="product">Product</option>
                  <option value="other">None</option>
                </select>
                <div className="grid grid-cols-2 gap-4 mt-2">
                  {(!formData.selectedType || formData.selectedType === "project") && (
                    <div className="col-span-2">
                      <SearchablePaginatedDropdown
                        endpoint="https://backend.kidsdesigncompany.com/api/project/"
                        label="Project"
                        name="project"
                        onChange={handleInputChange}
                        resultsKey="all_projects"
                        selectedValue={formData.selectedType === "project" ? formData.selectedItem : null}
                        selectedName={expense?.project?.name || null}
                      />
                    </div>
                  )}

                  {(!formData.selectedType || formData.selectedType === "shop") && (
                    <div className="col-span-2">
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
                        selectedValue={formData.selectedType === "shop" ? formData.selectedItem : null}
                        selectedName={expense?.shop?.name || null}
                      />
                    </div>
                  )}

                  {(!formData.selectedType || formData.selectedType === "product") && (
                    <div className="col-span-2">
                      <SearchablePaginatedDropdown
                        endpoint="https://backend.kidsdesigncompany.com/api/product/"
                        label="Product"
                        name="product"
                        onChange={handleInputChange}
                        resultsKey="results"
                        selectedValue={formData.selectedType === "product" ? formData.selectedItem : null}
                        selectedName={expense?.product?.name || null}
                      />
                    </div>
                  )}
                </div>
                {formData.selectedType && (formData.selectedType !== "other") && (
                  <p className="text-sm text-blue-600 mt-1">
                    Selected {formData.selectedType === "project" ? "Project" : formData.selectedType === "shop" ? "Shop Item" : "Product"}
                    <button
                      type="button"
                      onClick={() => setFormData(prev => ({ ...prev, selectedType: "", selectedItem: null }))}
                      className="ml-2 text-red-500 hover:text-red-700 focus:outline-none"
                    >
                      (Clear)
                    </button>
                  </p>
                )}
              </div>

            <div className="space-y-2">
              <Label htmlFor="description">Description (Optional)</Label>
              <Input
                id="description"
                name="description"
                value={formData.description}
                onChange={(e) => handleInputChange(e.target.name, e.target.value)}
                className="w-full"
                />
            </div>

            <div className="space-y-2">
              <Label htmlFor="date">Date</Label>
              <Input
                id="date"
                name="date"
                type="date"
                value={formData.date || ""}
                onChange={(e) => handleInputChange(e.target.name, e.target.value)}
                className="w-full"
                required
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="quantity">Quantity</Label>
                <Input
                  id="quantity"
                  name="quantity"
                  type="text"
                  value={formData.quantity}
                  onChange={(e) => handleInputChange(e.target.name, e.target.value)}
                className="w-full"
                required
              />
              </div>

              <CategoryDropdown
                selectedCategory={formData.category}
                onCategoryChange={(categoryId) => setFormData((prev) => ({ ...prev, category: categoryId }))}
              />
            </div>

            <DialogFooter>
            <Button type="submit" disabled={isSubmitDisabled}>
              Save Changes
              </Button>
            </DialogFooter>
          </form>
      </DialogContent>
    </Dialog>
  );
};

export default EditExpenseModal;
