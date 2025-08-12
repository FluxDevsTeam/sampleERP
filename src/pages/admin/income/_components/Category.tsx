import React, { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from "@/components/ui/dialog";

interface Category {
  id: string; // income category uses uuid
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
  const token = localStorage.getItem("accessToken");
  const { data } = await axios.get(
    "https://backend.kidsdesigncompany.com/api/income-category/",
    {
      params: {
        search: search || undefined,
        page: page || undefined,
      },
      headers: {
        Authorization: `JWT ${token}`,
      },
    }
  );
  // Handle both array and paginated responses
  if (Array.isArray(data)) {
    return { items: data as Category[], next: null, previous: null, count: (data as Category[]).length };
  }
  const items: Category[] = Array.isArray(data?.results) ? data.results : Array.isArray(data) ? data : [];
  return {
    items,
    next: data?.next ?? null,
    previous: data?.previous ?? null,
    count: typeof data?.count === 'number' ? data.count : items.length,
  };
};

const CategoryDropdown: React.FC<CategoryDropdownProps> = ({ selectedCategory, onCategoryChange }) => {
  const queryClient = useQueryClient();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [newCategory, setNewCategory] = useState<NewCategoryData>({ name: "" });
  const [isDeletingLocal, setIsDeletingLocal] = useState(false);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);

  const { data, isLoading } = useQuery<CategoryPage>({
    queryKey: ["income-categories", search, page],
    queryFn: async () => fetchCategories(search, page),
  });

  const addCategoryMutation = useMutation({
    mutationFn: async (categoryData: NewCategoryData) => {
      const accessToken = localStorage.getItem("accessToken");
      const response = await axios.post<Category>(
        "https://backend.kidsdesigncompany.com/api/income-category/",
        categoryData,
        {
          headers: {
            Authorization: `JWT ${accessToken}`,
          },
        }
      );
      return response.data;
    },
    onSuccess: (data) => {
      if (!data.id) {
        toast.error("Failed to retrieve category ID.");
        return;
      }
      // Invalidate to refresh paginated list, then select the new category
      queryClient.invalidateQueries({ queryKey: ["income-categories"] });
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

  const deleteCategoryMutation = useMutation({
    mutationFn: async (categoryId: string) => {
      setIsDeletingLocal(true);
      const token = localStorage.getItem("accessToken");
      await axios.delete(
        `https://backend.kidsdesigncompany.com/api/income-category/${categoryId}/`,
        {
          headers: {
            Authorization: `JWT ${token}`,
          },
        }
      );
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

      {/* Search */}
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

      {/* Pagination controls */}
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


