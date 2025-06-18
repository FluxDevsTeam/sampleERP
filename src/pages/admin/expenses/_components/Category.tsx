import React, { useState } from "react";
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

interface CategoryDropdownProps {
  selectedCategory: number | null;
  onCategoryChange: (categoryId: number | null) => void;
}

const fetchCategories = async (): Promise<Category[]> => {
  const { data } = await axios.get<{ results: Category[] }>(
    "https://backend.kidsdesigncompany.com/api/expense-category/"
  );
  return data.results;
};

const CategoryDropdown: React.FC<CategoryDropdownProps> = ({
  selectedCategory,
  onCategoryChange,
}) => {
  const queryClient = useQueryClient();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [newCategory, setNewCategory] = useState<NewCategoryData>({ name: "" });

  const { data: categories = [], isLoading } = useQuery<Category[]>({
    queryKey: ["categories"],
    queryFn: fetchCategories,
  });

  const addCategoryMutation = useMutation({
    mutationFn: async (categoryData: NewCategoryData) => {
      const response = await axios.post<Category>(
        "https://backend.kidsdesigncompany.com/api/expense-category/",
        categoryData
      );
      return response.data; // Ensure the response includes id and name
    },
    onSuccess: (data) => {
      if (!data.id) {
        toast.error("Failed to retrieve category ID.");
        return;
      }

      const newCategoryItem: Category = {
        id: data.id,
        name: data.name,
      };

      queryClient.setQueryData(["categories"], (oldData: Category[] = []) => [
        ...oldData,
        newCategoryItem,
      ]);

      onCategoryChange(data.id);
      toast.success("Category added successfully!");
      setNewCategory({ name: "" });
      setIsDialogOpen(false);
    },
    onError: (error: any) => {
      const errorMessage = error.response?.data
        ? Object.values(error.response.data).flat().join(", ")
        : "Failed to add category. Please try again.";
      toast.error(errorMessage);
    },
  });

  const handleCategoryChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    onCategoryChange(e.target.value ? Number(e.target.value) : null);
  };

  const handleNewCategoryChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setNewCategory({ name: e.target.value });
  };

  const handleAddCategory = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCategory.name.trim()) {
      toast.error("Category name is required");
      return;
    }
    addCategoryMutation.mutate(newCategory);
  };

  return (
    <div className="space-y-2">
      <div className="flex items-end justify-between">
        <Label htmlFor="category">Category</Label>
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
            <form onSubmit={handleAddCategory}>
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
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setIsDialogOpen(false)}
                >
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
        onChange={handleCategoryChange}
        className="w-full border px-3 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        required
      >
        <option value="">Select Category</option>
        {isLoading ? (
          <option disabled>Loading...</option>
        ) : (
          categories.map((category) => (
            <option key={category.id} value={category.id}>
              {category.name}
            </option>
          ))
        )}
      </select>
    </div>
  );
};

export default CategoryDropdown;
