import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import SkeletonLoader from "../_components/SkeletonLoader";
import CategoryDropdown from "../_components/Category";
import expensesData from "@/data/admin/expenses/expenses.json";

interface ExpenseFormData {
  name: string;
  amount: number | "";
  quantity: number | "";
  description: string | undefined;
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

// Static data for dropdowns
const projects: Project[] = [
  { id: 1, name: "Downtown Renovation" },
  { id: 2, name: "Office Expansion" },
  { id: 3, name: "Residential Build" },
];

const shopItems: ShopItem[] = [
  { id: 1, name: "Retail Product A" },
  { id: 2, name: "Retail Product B" },
];

const EditExpense: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const [formData, setFormData] = useState<ExpenseFormData>({
    name: "",
    amount: "",
    quantity: "",
    description: "",
    selectedType: "",
    selectedItem: null,
    category: null,
  });
  const [isLoading, setIsLoading] = useState(true);
  const [expense, setExpense] = useState<Expense | null>(null);

  // Simulate fetching expense data from static JSON
  useEffect(() => {
    const foundExpense = expensesData.daily_data
      .flatMap((day) => day.entries)
      .find((entry) => entry.id === Number(id));

    if (foundExpense) {
      let selectedType = "";
      let selectedItem = null;

      if (foundExpense.linked_project) {
        selectedType = "project";
        selectedItem = foundExpense.linked_project.id.toString();
      } else if (foundExpense.sold_item) {
        selectedType = "shop";
        selectedItem = foundExpense.sold_item.id.toString();
      } else if (foundExpense.expense_category && !foundExpense.linked_project && !foundExpense.sold_item) {
        selectedType = "other";
      }

      setFormData({
        name: foundExpense.name || "",
        description: foundExpense.description || "",
        amount: Number(foundExpense.amount) || "",
        quantity: Number(foundExpense.quantity) || "",
        selectedType,
        selectedItem,
        category: foundExpense.expense_category?.id || null,
      });
      setExpense({
        id: foundExpense.id,
        name: foundExpense.name,
        description: foundExpense.description,
        amount: Number(foundExpense.amount),
        quantity: Number(foundExpense.quantity),
        category: foundExpense.expense_category,
        project: foundExpense.linked_project,
        shop: foundExpense.sold_item,
      });
    }
    setIsLoading(false);
  }, [id]);

  // Handle input changes
  const handleInputChange = (name: string, value: string) => {
    if (name === "project" || name === "shop") {
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
    toast.error("Update expense functionality is disabled in static mode.");
    navigate("/admin/expenses");
  };

  return (
    <div className="container mx-auto p-4">
      <Card className="max-w-xl mx-auto">
        <CardHeader>
          <CardTitle>Edit Expense</CardTitle>
        </CardHeader>
        {isLoading ? (
          <CardContent>
            <SkeletonLoader />
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
                  onChange={(e) => handleInputChange(e.target.name, e.target.value)}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Description (Optional)</Label>
                <Input
                  id="description"
                  name="description"
                  value={formData.description}
                  onChange={(e) => handleInputChange(e.target.name, e.target.value)}
                />
              </div>

              <div className="space-y-2">
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

              <div className="space-y-2">
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

              <div className="space-y-2">
                <Label className="text-lg font-medium">Item Type</Label>
                <div className="grid grid-cols-2 gap-4 mt-2">
                  <div className="col-span-1">
                    <Label htmlFor="project">Project</Label>
                    <select
                      id="project"
                      name="project"
                      value={formData.selectedType === "project" ? formData.selectedItem || "" : ""}
                      onChange={(e) => handleInputChange(e.target.name, e.target.value)}
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

                  <div className="col-span-1">
                    <Label htmlFor="shop">Shop Item</Label>
                    <select
                      id="shop"
                      name="shop"
                      value={formData.selectedType === "shop" ? formData.selectedItem || "" : ""}
                      onChange={(e) => handleInputChange(e.target.name, e.target.value)}
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
                </div>
                {formData.selectedType && formData.selectedType !== "other" && (
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
              <Button type="submit" disabled={!formData.category}>
                Update Expense
              </Button>
            </CardFooter>
          </form>
        )}
      </Card>
    </div>
  );
};

export default EditExpense;