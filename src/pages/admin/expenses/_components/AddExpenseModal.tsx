import { useState, useEffect } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import expensesData from "../data/admin/expenses/expenses.json";

interface Category {
  id: number;
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
  payment_method?: string;
}

interface ExpenseFormData {
  name: string;
  amount: string;
  quantity?: string;
  selectedItem: string | null;
  selectedType: string;
  category: number | null;
  description: string;
  date?: string;
  product?: number | null;
  payment_method: string;
}

interface AddExpenseModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
}

// Static data for dropdowns
const projects: LinkedProject[] = [
  { id: 1, name: "Downtown Renovation" },
  { id: 2, name: "Office Expansion" },
  { id: 3, name: "Residential Build" },
];

const shopItems: SoldItem[] = [
  { id: 1, name: "Retail Product A", quantity: "10", cost_price: "1000", selling_price: "1500", total_price: 15000 },
  { id: 2, name: "Retail Product B", quantity: "5", cost_price: "2000", selling_price: "3000", total_price: 15000 },
];

const products: LinkedProduct[] = [
  { id: 1, name: "Product Line X" },
  { id: 2, name: "Product Line Y" },
];

const categories: Category[] = [
  { id: 1, name: "General Expenses" },
  { id: 2, name: "Maintenance" },
  { id: 3, name: "Project Expenses" },
  { id: 4, name: "Shop Expenses" },
  { id: 5, name: "Product Expenses" },
  { id: 6, name: "Operational Costs" },
];

const AddExpenseModal: React.FC<AddExpenseModalProps> = ({ isOpen, onClose, onSuccess }) => {
  const [formData, setFormData] = useState<ExpenseFormData>(() => {
    const today = new Date();
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, "0");
    const day = String(today.getDate()).padStart(2, "0");
    const todayFormatted = `${year}-${month}-${day}`;

    return {
      name: "",
      amount: "",
      quantity: undefined,
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

  useEffect(() => {
    setUserRole(localStorage.getItem("user_role"));
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    toast.error("Add expense functionality is disabled in static mode.");
    onClose();
    if (onSuccess) onSuccess();
  };

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

        <form onSubmit={handleSubmit} className="p-2 sm:p-4 space-y-4">
          <div className="grid grid-cols-2 gap-4">
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
          </div>

          <div className="grid grid-cols-2 gap-4">
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
              <Label htmlFor="quantity">Quantity (Optional)</Label>
              <Input
                id="quantity"
                name="quantity"
                type="text"
                value={formData.quantity || ""}
                onChange={(e) => handleInputChange(e.target.name, e.target.value)}
              />
            </div>
          </div>

          <div className="space-y-1">
            <Label className="text-lg font-medium">Item Type (Optional)</Label>
            <div className="grid grid-cols-2 gap-4 mt-2">
              {!formData.selectedType || formData.selectedType === "project" ? (
                <div className="col-span-1">
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
              ) : null}

              {!formData.selectedType || formData.selectedType === "shop" ? (
                <div className="col-span-1">
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
              ) : null}
            </div>
            <div className="grid grid-cols-1 gap-4 mt-2">
              {!formData.selectedType || formData.selectedType === "product" ? (
                <div className="col-span-1">
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
              ) : null}
            </div>
            {formData.selectedType && (
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
                    setFormData((prev) => ({
                      ...prev,
                      selectedType: "",
                      selectedItem: null,
                    }))
                  }
                  className="ml-2 text-red-500 hover:text-red-700 focus:outline-none"
                >
                  (Clear)
                </button>
              </p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="category">Category</Label>
            <select
              id="category"
              name="category"
              value={formData.category ?? ""}
              onChange={(e) => handleInputChange("category", e.target.value)}
              className="w-full border px-3 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            >
              <option value="">Select Category</option>
              {categories.map((category) => (
                <option key={category.id} value={category.id}>
                  {category.name}
                </option>
              ))}
            </select>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="payment_method">Payment Method</Label>
              <select
                id="payment_method"
                name="payment_method"
                value={formData.payment_method}
                onChange={(e) => handleInputChange("payment_method", e.target.value)}
                className="w-full border px-3 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              >
                <option value="CASH">CASH</option>
                <option value="BANK">BANK</option>
                <option value="DEBT">DEBT</option>
              </select>
            </div>
              <div className="col-span-1">
                <Label htmlFor="date">Date</Label>
                <Input
                  id="date"
                  name="date"
                  type="date"
                  value={formData.date || ""}
                  onChange={(e) => handleInputChange("date", e.target.value)}
                  className="w-full"
                  required
                />
              </div>
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit" disabled={!formData.category}>
              Add Expense
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default AddExpenseModal;