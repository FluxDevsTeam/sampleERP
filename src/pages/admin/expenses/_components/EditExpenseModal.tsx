import React, { useState, useEffect } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import CategoryDropdown from "./Category";

interface ExpenseFormData {
  name: string;
  amount: number | "";
  quantity?: string;
  description: string | undefined;
  selectedType: string;
  selectedItem: string | null;
  category: number | null;
  date?: string;
  product?: number | null;
  payment_method?: string;
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
  };
  date?: string;
  payment_method?: string;
}

interface EditExpenseModalProps {
  expense: Expense;
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess?: () => void;
}

const projects: Project[] = [
  { id: 1, name: "Downtown Renovation" },
  { id: 2, name: "Office Expansion" },
  { id: 3, name: "Residential Build" },
];

const shopItems: ShopItem[] = [
  { id: 1, name: "Retail Product A" },
  { id: 2, name: "Retail Product B" },
];

const products: Project[] = [
  { id: 1, name: "Product Line X" },
  { id: 2, name: "Product Line Y" },
];

const EditExpenseModal: React.FC<EditExpenseModalProps> = ({ expense, isOpen, onOpenChange, onSuccess }) => {
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
    payment_method: "CASH",
  });

  useEffect(() => {
    if (expense) {
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
        quantity: String(expense.quantity ?? "") || undefined,
        selectedType,
        selectedItem,
        category: expense.category?.id || null,
        date: expense.date ? new Date(expense.date).toISOString().split("T")[0] : "",
        product: expense.product?.id || null,
        payment_method: expense.payment_method || "CASH",
      });
    }
  }, [expense]);

  const handleInputChange = (name: string, value: string) => {
    if (name === "project" || name === "shop" || name === "product") {
      setFormData((prev) => ({
        ...prev,
        selectedType: name,
        selectedItem: value,
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]: name === "amount" || name === "quantity" ? (value === "" ? "" : Number(value)) : value,
      }));
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    toast.error("Edit expense functionality is disabled in static mode.");
    onOpenChange(false);
    if (onSuccess) onSuccess();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[650px] max-sm:px-3 overflow-y-auto">
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
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
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
                    selectedItem: null,
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
            </div>
            <div className="space-y-2">
              <Label htmlFor="quantity">Quantity (Optional)</Label>
              <Input
                id="quantity"
                name="quantity"
                type="text"
                value={formData.quantity || ""}
                onChange={(e) => handleInputChange(e.target.name, e.target.value)}
                className="w-full"
              />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4 mt-2">
            {(!formData.selectedType || formData.selectedType === "project") && (
              <div className="col-span-2">
                <Label htmlFor="project">Project</Label>
                <select
                  id="project"
                  name="project"
                  value={formData.selectedType === "project" ? formData.selectedItem || "" : ""}
                  onChange={(e) => handleInputChange("project", e.target.value)}
                  className="w-full border px-3 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">Select Project</option>
                  {projects.map((project) => (
                    <option key={project.id} value={project.id}>
                      {project.name}
                    </option>
                  ))}
                </select>
              </div>
            )}

            {(!formData.selectedType || formData.selectedType === "shop") && (
              <div className="col-span-2">
                <Label htmlFor="shop">Shop Item</Label>
                <select
                  id="shop"
                  name="shop"
                  value={formData.selectedType === "shop" ? formData.selectedItem || "" : ""}
                  onChange={(e) => handleInputChange("shop", e.target.value)}
                  className="w-full border px-3 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">Select Shop Item</option>
                  {shopItems.map((item) => (
                    <option key={item.id} value={item.id}>
                      {item.name}
                    </option>
                  ))}
                </select>
              </div>
            )}

            {(!formData.selectedType || formData.selectedType === "product") && (
              <div className="col-span-2">
                <Label htmlFor="product">Product</Label>
                <select
                  id="product"
                  name="product"
                  value={formData.selectedType === "product" ? formData.selectedItem || "" : ""}
                  onChange={(e) => handleInputChange("product", e.target.value)}
                  className="w-full border px-3 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">Select Product</option>
                  {products.map((product) => (
                    <option key={product.id} value={product.id}>
                      {product.name}
                    </option>
                  ))}
                </select>
              </div>
            )}
          </div>
          {formData.selectedType && formData.selectedType !== "other" && (
            <p className="text-sm text-blue-600 mt-1">
              Selected{" "}
              {formData.selectedType === "project"
                ? "Project"
                : formData.selectedType === "shop"
                ? "Shop Item"
                : "Product"}
              <button
                type="button"
                onClick={() =>
                  setFormData((prev) => ({ ...prev, selectedType: "", selectedItem: null }))
                }
                className="ml-2 text-red-500 hover:text-red-700 focus:outline-none"
              >
                (Clear)
              </button>
            </p>
          )}

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
          <div className="grid grid-cols-2 gap-4">
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

            <div className="space-y-2">
              <Label htmlFor="payment_method">Payment Method</Label>
              <select
                id="payment_method"
                name="payment_method"
                value={formData.payment_method}
                onChange={(e) => handleInputChange(e.target.name, e.target.value)}
                className="w-full border px-3 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              >
                <option value="CASH">CASH</option>
                <option value="BANK">BANK</option>
                <option value="DEBT">DEBT</option>
              </select>
            </div>
          </div>

          <div>
            <CategoryDropdown
              selectedCategory={formData.category}
              onCategory sixChange={(categoryId) =>
                setFormData((prev) => ({ ...prev, category: categoryId }))
              }
            />
          </div>

          <DialogFooter>
            <Button type="submit" disabled={!formData.category}>
              Save Changes
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default EditExpenseModal;