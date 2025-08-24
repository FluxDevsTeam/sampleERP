import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import CategoryDropdown from "../_components/Category";

interface ExpenseFormData {
  name: string;
  amount: number | "";
  quantity: number | "";
  selectedItem: string | null;
  selectedType: string;
  category: number | null;
  description: string;
}

interface Project {
  id: number;
  name: string;
}

interface ShopItem {
  id: number;
  name: string;
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

const AddExpense: React.FC = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState<ExpenseFormData>({
    name: "",
    amount: "",
    quantity: "",
    selectedItem: null,
    selectedType: "",
    category: null,
    description: "",
  });

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
    toast.error("Add expense functionality is disabled in static mode.");
    navigate("/admin/expenses");
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-6">Add New Expense</h1>

      <form
        onSubmit={handleSubmit}
        className="space-y-4 max-w-2xl mx-auto"
      >
        <div className="space-y-4 max-w-2xl mx-auto">
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

          <div className="space-y-1">
            <Label className="text-lg font-medium">Item Type (Optional)</Label>
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
            disabled={!formData.category}
            className="flex-1"
          >
            Add Expense
          </Button>
        </div>
      </form>
    </div>
  );
};

export default AddExpense;