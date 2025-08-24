import React, { useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogFooter,
  DialogTrigger 
} from "@/components/ui/dialog";

interface Category {
  id: number;
  name: string;
}

interface NewCategoryData {
  name: string;
}

interface CategoryDropdownProps {
  selectedCategory: number | null;
  onCategoryChange: (categoryId: number | null) => void;
}

const categories: Category[] = [
  { id: 1, name: "General Expenses" },
  { id: 2, name: "Maintenance" },
  { id: 3, name: "Project Expenses" },
  { id: 4, name: "Shop Expenses" },
  { id: 5, name: "Product Expenses" },
  { id: 6, name: "Operational Costs" },
];

const CategoryDropdown: React.FC<CategoryDropdownProps> = ({ selectedCategory, onCategoryChange }) => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [newCategory, setNewCategory] = useState<NewCategoryData>({ name: "" });

  const handleCategoryChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    onCategoryChange(e.target.value ? Number(e.target.value) : null);
  };

  const handleNewCategoryChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setNewCategory({ name: e.target.value });
  };

  const handleAddCategory = (e: React.FormEvent) => {
    e.preventDefault();
    toast.error("Add category functionality is disabled in static mode.");
    setIsDialogOpen(false);
  };

  const handleDeleteCategory = () => {
    toast.error("Delete category functionality is disabled in static mode.");
  };

  return (
    <div className="space-y-2">
      <div className="flex items-end justify-between">
        <Label htmlFor="category">Category</Label>
        <div className="flex space-x-2">
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button type="button" variant="outline" size="sm" className="text-xs">
                Create New
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Create New Category</DialogTitle>
              </DialogHeader>
              <div className="space-y-4 py-4">
                <div className="space-y-2">
                  <Label htmlFor="categoryName">Category Name</Label>
                  <Input
                    id="categoryName"
                    name="name"
                    value={newCategory.name}
                    onChange={handleNewCategoryChange}
                    required
                  />
                </div>
              </div>
              <DialogFooter>
                <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>
                  Cancel
                </Button>
                <Button type="button" onClick={handleAddCategory}>
                  Create Category
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
          <Button
            type="button"
            variant="destructive"
            size="sm"
            onClick={handleDeleteCategory}
            disabled={!selectedCategory}
            className="text-xs"
          >
            Delete
          </Button>
        </div>
      </div>

      <select
        id="category"
        name="category"
        value={selectedCategory ?? ""}
        onChange={handleCategoryChange}
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
  );
};

export default CategoryDropdown;