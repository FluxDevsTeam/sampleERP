import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import SkeletonLoader from "../_components/SkeletonLoader";
import SearchablePaginatedDropdown from "@/pages/shop/sold/Sold Components/SearchablePaginatedDropdown";
import CategoryDropdown from "../_components/Category";

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

const EditExpense: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  
  const [formData, setFormData] = useState<ExpenseFormData>({
    name: "",
    amount: "",
    quantity: "",
    description: "",
    selectedType: "",
    selectedItem: null,
    category: null,
  });

  // Fetch expense data
  const { data: expense, isLoading } = useQuery<Expense>({
    queryKey: ["expense", id],
    queryFn: async () => {
      const { data } = await axios.get(`https://backend.kidsdesigncompany.com/api/expense/${id}/`);
      return data;
    },
    enabled: !!id,
  });

  // Update mutation
  const updateExpenseMutation = useMutation({
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
      };

      if (data.selectedType === "other") {
        formattedData.project = null;
        formattedData.shop = null;
      }

      console.log("Sending update data to API:", formattedData);
      const accessToken = localStorage.getItem("accessToken");
      await axios.put(`https://backend.kidsdesigncompany.com/api/expense/${id}/`, formattedData, {
        headers: {
          Authorization: `JWT ${accessToken}`,
        },
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["expenses"] });
      toast.success("Expense updated successfully!");
      navigate("/admin/expenses");
    },
    onError: (error) => {
      console.error("Error details:", error);
      toast.error("Failed to update expense. Please try again.");
    },
  });

  // Populate form when expense data is loaded
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
      } else if (expense.category && !expense.project && !expense.shop) {
        selectedType = "other";
      }
      
      setFormData({
        name: expense.name || "",
        description: expense.description || "",
        amount: expense.amount || "",
        quantity: expense.quantity || "",
        selectedType,
        selectedItem,
        category: expense.category?.id || null,
      });
    }
  }, [expense]);

  // Handle input changes
  const handleInputChange = (name: string, value: string) => {
    if (name === "project" || name === "shop") {
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
    updateExpenseMutation.mutate(formData);
  };

  return (
    <div className="container mx-auto p-4">
      <Card className="max-w-xl mx-auto">
        <CardHeader>
          <CardTitle>Edit Expense</CardTitle>
        </CardHeader>
        {isLoading ? (
          <CardContent>
            <SkeletonLoader/>
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
                    <SearchablePaginatedDropdown
                      endpoint="https://backend.kidsdesigncompany.com/api/project/"
                      label="Project"
                      name="project"
                      onChange={handleInputChange}
                      resultsKey="all_projects"
                      selectedValue={formData.selectedType === "project" ? formData.selectedItem : null}
                      selectedName={formData.selectedType === "project" ? expense?.project?.name || null : null}
                    />
                  </div>

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
                      selectedName={formData.selectedType === "shop" ? expense?.shop?.name || null : null}
                    />
                  </div>
                </div>
                {formData.selectedType && (formData.selectedType !== "other") && (
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
              <Button 
                type="submit" 
                disabled={updateExpenseMutation.isPending || !formData.category}
              >
                {updateExpenseMutation.isPending ? "Updating..." : "Update Expense"}
              </Button>
            </CardFooter>
          </form>
        )}
      </Card>
    </div>
  );
};

export default EditExpense;