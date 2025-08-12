import { useState, useEffect } from "react";
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
import SearchablePaginatedDropdown from "@/pages/shop/sold/Sold Components/SearchablePaginatedDropdown";
import CategoryDropdown from "./Category";

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

interface ExpenseFormData {
  name: string;
  amount: string;
  quantity: string;
  selectedItem: string | null;
  selectedType: string;
  category: number | null;
  description: string;
  date?: string;
  product?: number | null; // Add product field
  payment_method: string;
}

interface AddPaymentModalProps {
  onSuccess?: () => void;
  children: React.ReactNode;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
}

interface AddExpenseModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
}

const AddExpenseModal: React.FC<AddExpenseModalProps> = ({
  isOpen,
  onClose,
  onSuccess,
}) => {
  const queryClient = useQueryClient();

  const [formData, setFormData] = useState<ExpenseFormData>(() => {
    const today = new Date();
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, '0'); // Months are 0-indexed
    const day = String(today.getDate()).padStart(2, '0');
    const todayFormatted = `${year}-${month}-${day}`;

    return {
      name: "",
      amount: "",
      quantity: "",
      selectedItem: null,
      selectedType: "",
      category: null,
      description: "",
      date: todayFormatted,
      product: null,
      payment_method: "CASH",
    };
  });
  const [userRole, setUserRole] = useState<string | null>(null);

  // Set user role on mount
  useEffect(() => {
    setUserRole(localStorage.getItem('user_role'));
  }, []);

  const addExpenseMutation = useMutation({
    mutationFn: async (newExpense: ExpenseFormData) => {
      const token = localStorage.getItem("accessToken");

      const formattedData = {
        name: newExpense.name,
        amount: Number(newExpense.amount),
        quantity: newExpense.quantity,
        category: newExpense.category,
        description: newExpense.description || "",
        project:
          newExpense.selectedType === "project" && newExpense.selectedItem
            ? Number(newExpense.selectedItem)
            : null,
        shop:
          newExpense.selectedType === "shop" && newExpense.selectedItem
            ? Number(newExpense.selectedItem)
            : null,
        product:
          newExpense.selectedType === "product" && newExpense.selectedItem
            ? Number(newExpense.selectedItem)
            : null,
        date: newExpense.date || undefined,
        payment_method: newExpense.payment_method || undefined,
      };

      console.log("Sending data to API:", formattedData);

      try {
        const response = await axios.post(
          "https://backend.kidsdesigncompany.com/api/expense/",
          formattedData,
          {
            headers: {
              Authorization: `JWT ${token}`,
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
      toast.success("Expense added successfully!");
      queryClient.invalidateQueries({ queryKey: ["expenses"] });
      onClose();
      setFormData({
        name: "",
        amount: "",
        quantity: "",
        selectedItem: null,
        selectedType: "",
        category: null,
        description: "",
        date: "",
        product: null, // Reset product
          payment_method: "CASH",
      });
      if (onSuccess) onSuccess();
    },
    onError: (error: any) => {
      console.error("Error details:", error);
      console.error("API Response:", error.response?.data);
      toast.error(
        error.response?.data?.message ||
          "Failed to add expense. Please try again."
      );
    },
  });

  const handleInputChange = (name: string, value: string) => {
    if (name === "category") {
      setFormData((prev) => ({ ...prev, [name]: Number(value) }));
    } else if (name === "project" || name === "shop" || name === "product") {
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
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Add New Expense</DialogTitle>
        </DialogHeader>

        <form
          onSubmit={(e) => {
            e.preventDefault();
            addExpenseMutation.mutate(formData);
          }}
          className="p-2 sm:p-4 space-y-4"
        >
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="name">Name</Label>
              <Input
                id="name"
                name="name"
                value={formData.name}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, name: e.target.value }))
                }
                required
              />
            </div>

            <div>
              <Label htmlFor="description">Description (Optional)</Label>
              <Input
                id="description"
                name="description"
                value={formData.description}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    description: e.target.value,
                  }))
                }
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="amount">Amount</Label>
              <Input
                id="amount"
                name="amount"
                type="number"
                value={formData.amount}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, amount: e.target.value }))
                }
                required
              />
            </div>

            <div>
              <Label htmlFor="quantity">Quantity</Label>
              <Input
                id="quantity"
                name="quantity"
                type="text"
                value={formData.quantity}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, quantity: e.target.value }))
                }
                required
              />
            </div>
          </div>


          <div className="space-y-1">
            <Label className="text-lg font-medium">Item Type (Optional)</Label>
            <div className="grid grid-cols-2 gap-4 mt-2">
              {!formData.selectedType || formData.selectedType === "project" ? (
                <div className="col-span-1">
                  <SearchablePaginatedDropdown
                    endpoint="https://backend.kidsdesigncompany.com/api/project/"
                    label="Project"
                    name="project"
                    onChange={handleInputChange}
                    resultsKey="all_projects"
                    selectedValue={formData.selectedType === "project" ? formData.selectedItem : null}
                  />
                </div>
              ) : null}

              {!formData.selectedType || formData.selectedType === "shop" ? (
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
                    selectedValue={formData.selectedType === "shop" ? formData.selectedItem : null}
                  />
                </div>
              ) : null}
            </div>
            <div className="grid grid-cols-1 gap-4 mt-2">
              {!formData.selectedType || formData.selectedType === "product" ? (
                <div className="col-span-1">
                  <SearchablePaginatedDropdown
                    endpoint="https://backend.kidsdesigncompany.com/api/product/"
                    label="Product"
                    name="product"
                    onChange={handleInputChange}
                    resultsKey="results"
                    selectedValue={formData.selectedType === "product" ? formData.selectedItem : null}
                  />
                </div>
              ) : null}
            </div>
            {formData.selectedType && (
              <p className="text-sm text-blue-600 mt-1">
                Selected{" "}
                {formData.selectedType === "project" ? "Project" : formData.selectedType === "shop" ? "Shop Item" : "Product"}
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

          <CategoryDropdown
            selectedCategory={formData.category}
            onCategoryChange={(categoryId: number | null) =>
              setFormData((prev) => ({ ...prev, category: categoryId }))
            }
          />

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="payment_method">Payment Method</Label>
              <select
                id="payment_method"
                name="payment_method"
                value={formData.payment_method}
                onChange={(e) => setFormData(prev => ({ ...prev, payment_method: e.target.value }))}
                className="w-full border px-3 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              >
                <option value="CASH">CASH</option>
                <option value="BANK">BANK</option>
                <option value="DEBT">DEBT</option>
              </select>
            </div>
          {/* Add date field for CEO only */}
          {userRole === 'ceo' && (
            <div className="col-span-1">
              <Label htmlFor="date">Date</Label>
              <Input
                id="date"
                name="date"
                type="date"
                value={formData.date || ""}
                onChange={e => setFormData(prev => ({ ...prev, date: e.target.value }))}
                className="w-full"
                required
              />
            </div>
          )}
          </div>

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={addExpenseMutation.isPending || !formData.category}
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
