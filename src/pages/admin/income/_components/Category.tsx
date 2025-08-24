import React, { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from "@/components/ui/dialog";
import incomeCategories from '@/data/admin/income/incomeCategories.json';

interface Category {
  id: string;
  name: string;
}

interface NewCategoryData {
  name: string;
}

interface CategoryDropdownProps {
  selectedCategory: string | null;
  onCategoryChange: (categoryId: string | null) => void;
}

interface CategoryPage {
  items: Category[];
  next: string | null;
  previous: string | null;
  count: number;
}

const fetchCategories = async (search: string, page: number): Promise<CategoryPage> => {
  const pageSize = 10;
  const start = (page - 1) * pageSize;
  const end = start + pageSize;
  const filteredItems = search
    ? incomeCategories.filter((cat) => cat.name.toLowerCase().includes(search.toLowerCase()))
    : incomeCategories;
  const paginatedItems = filteredItems.slice(start, end);
  return {
    items: paginatedItems,
    next: end < filteredItems.length ? `page=${page + 1}` : null,
    previous: page > 1 ? `page=${page - 1}` : null,
    count: filteredItems.length,
  };
};

const CategoryDropdown: React.FC<CategoryDropdownProps> = ({ selectedCategory, onCategoryChange }) => {
  const queryClient = useQueryClient();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [newCategory, setNewCategory] = useState<NewCategoryData>({ name: "" });
  const [isDeletingLocal, setIsDeletingLocal] = useState(false);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);

  const { data, isLoading } = { data: fetchCategories(search, page), isLoading: false };

  const addCategoryMutation = useMutation({
    mutationFn: async (categoryData: NewCategoryData) => {
      const newId = `cat-${incomeCategories.length + 1}`;
      const newCategory = { id: newId, name: categoryData.name };
      incomeCategories.unshift(newCategory);
      return newCategory;
    },
    onSuccess: (data) => {
      if (!data.id) {
        toast.error("Failed to retrieve category ID.");
        return;
      }
      queryClient.invalidateQueries({ queryKey: ["income-categories"] });
      onCategoryChange(data.id);
      toast.success("Category added successfully!");
      setNewCategory({ name: "" });
      setIsDialogOpen(false);
    },
    onError: (error: any) => {
      toast.error(error?.message || "Failed to add category.");
    },
  });

  const deleteCategoryMutation = useMutation({
    mutationFn: async (categoryId: string) => {
      setIsDeletingLocal(true);
      const index = incomeCategories.findIndex((cat) => cat.id === categoryId);
      if (index === -1) throw new Error('Category not found');
      incomeCategories.splice(index, 1);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["income-categories"] });
      onCategoryChange(null);
      toast.success("Category deleted successfully!");
      setIsDeletingLocal(false);
    },
    onError: () => {
      toast.error("Failed to delete category. Please try again.");
      setIsDeletingLocal(false);
    },
  });

  const handleDeleteCategory = () => {
    if (selectedCategory && window.confirm("Are you sure you want to delete this category?")) {
      deleteCategoryMutation.mutate(selectedCategory);
    }
  };

  const handleCategoryChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    onCategoryChange(e.target.value ? e.target.value : null);
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
        <Label htmlFor="income-category">Category</Label>
        <div className="flex space-x-2">
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button type="button" variant="outline" size="sm" className="text-xs">
                Create New
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Create New Income Category</DialogTitle>
              </DialogHeader>
              <div className="space-y-4 py-4">
                <div className="space-y-2">
                  <Label htmlFor="incomeCategoryName">Category Name</Label>
                  <Input
                    id="incomeCategoryName"
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
                <Button type="button" onClick={handleAddCategory} disabled={addCategoryMutation.isPending}>
                  {addCategoryMutation.isPending ? "Creating..." : "Create Category"}
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
          <Button
            type="button"
            variant="destructive"
            size="sm"
            onClick={handleDeleteCategory}
            disabled={!selectedCategory || isDeletingLocal}
            className="text-xs"
          >
            {isDeletingLocal ? "Deleting..." : "Delete"}
          </Button>
        </div>
      </div>

      <Input
        placeholder="Search category..."
        value={search}
        onChange={(e) => { setSearch(e.target.value); setPage(1); }}
      />

      <select
        id="income-category"
        name="category"
        value={selectedCategory ?? ""}
        onChange={handleCategoryChange}
        className="w-full border px-3 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        required
      >
        <option value="">Select Category</option>
        {isLoading ? (
          <option disabled>Loading...</option>
        ) : Array.isArray(data?.items) && data.items.length > 0 ? (
          data.items.map((category) => (
            <option key={category.id} value={category.id}>
              {category.name}
            </option>
          ))
        ) : (
          <option disabled>No categories</option>
        )}
      </select>

      <div className="flex items-center justify-between">
        <Button
          type="button"
          variant="outline"
          size="sm"
          disabled={!data?.previous}
          onClick={() => setPage((p) => Math.max(1, p - 1))}
        >
          Prev
        </Button>
        <span className="text-xs text-gray-500">Page {page}</span>
        <Button
          type="button"
          variant="outline"
          size="sm"
          disabled={!data?.next}
          onClick={() => setPage((p) => p + 1)}
        >
          Next
        </Button>
      </div>
    </div>
  );
};

export default CategoryDropdown;