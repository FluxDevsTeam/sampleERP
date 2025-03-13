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
interface ExpenseFormData {
  name: string;
  amount: number | "";
  quantity: number | "";
}

const EditExpense: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  
  const [formData, setFormData] = useState<ExpenseFormData>({
    name: "",
    amount: "",
    quantity: "",
  });

  // Fetch expense data
  const { data: expense, isLoading } = useQuery({
    queryKey: ["expense", id],
    queryFn: async () => {
      const { data } = await axios.get(`https://kidsdesigncompany.pythonanywhere.com/api/expense/${id}/`);
      return data;
    },
  });

  // Update mutation
  const updateExpenseMutation = useMutation({
    mutationFn: async (data: ExpenseFormData) => {
      await axios.put(`https://kidsdesigncompany.pythonanywhere.com/api/expense/${id}/`, data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["expenses"] });
      toast.success("Expense updated successfully!");
      navigate("/admin/expenses");
    },
    onError: () => {
      toast.error("Failed to update expense. Please try again.");
    },
  });

  // Populate form when expense data is loaded
  useEffect(() => {
    if (expense) {
      setFormData({
        name: expense.name || "",
        amount: expense.amount || "",
        quantity: expense.quantity || "",
      });
    }
  }, [expense]);

  // Handle input changes
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === "amount" || name === "quantity" ? (value === "" ? "" : Number(value)) : value,
    }));
  };

  // Handle form submission
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    updateExpenseMutation.mutate({
      ...formData,
      amount: Number(formData.amount) || 0,
      quantity: Number(formData.quantity) || 1,
    });
  };

  return (
    <div className="container mx-auto p-4">
      <Card className="max-w-md mx-auto">
        <CardHeader>
          <CardTitle>Edit Expense</CardTitle>
        </CardHeader>
        {isLoading ? (
          <p className="text-center text-gray-500"><SkeletonLoader/></p>
        ) : (
          <form onSubmit={handleSubmit}>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">Name</Label>
                <Input
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="amount">Amount</Label>
                <Input
                  id="amount"
                  name="amount"
                  type="number"
                  value={formData.amount}
                  onChange={handleChange}
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
                  onChange={handleChange}
                  required
                />
              </div>
            </CardContent>
            <CardFooter className="flex justify-between">
              <Button
                type="button"
                variant="outline"
                onClick={() => navigate("/admin/expenses")}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={updateExpenseMutation.isPending}>
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
