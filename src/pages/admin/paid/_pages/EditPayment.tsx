import React, { useState, useEffect } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";

interface PaymentData {
  amount: number;
  salary?: number;
}

const EditPayment = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const [formData, setFormData] = useState<PaymentData>({
    amount: 0,
    salary: undefined,
  });

  // Fetch Payment Data
  const { data, isLoading, error } = useQuery({
    queryKey: ["paid", id],
    queryFn: async () => {
      const response = await axios.get<PaymentData>(
        `https://kidsdesigncompany.pythonanywhere.com/api/paid/${id}/`
      );
      return response.data;
    },
    enabled: !!id, // Fetch only if ID exists
  });

  // Populate form when data is fetched
  useEffect(() => {
    if (data) {
      setFormData({
        amount: data.amount,
        salary: data.salary ?? 0, // Ensure salary is a valid number
      });
    }
  }, [data]);

  // Update Payment Mutation
  const updatePaymentMutation = useMutation({
    mutationFn: async (paymentData: PaymentData) => {
      const response = await axios.put(
        `https://kidsdesigncompany.pythonanywhere.com/api/paid/${id}/`,
        paymentData
      );
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["paid"] });
      toast.success("Payment updated successfully!");
      navigate("/admin/paid");
    },
    onError: (error: any) => {
      console.error("Error updating payment:", error.response?.data || error.message);
      toast.error(
        error.response?.data?.error?.[0] || "Failed to update payment. Try again."
      );
    },
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value ? Number(value) : 0, // Ensure numeric values
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    updatePaymentMutation.mutate(formData);
  };

  if (isLoading) return <p className="text-center">Loading payment details...</p>;
  if (error) return <p className="text-center text-red-500">Error loading data.</p>;

  return (
    <div className="container mx-auto p-4">
      <Card className="max-w-md mx-auto">
        <CardHeader>
          <CardTitle>Edit Payment</CardTitle>
        </CardHeader>
        <form onSubmit={handleSubmit}>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="amount">Amount</Label>
              <Input
                id="amount"
                name="amount"
                type="number"
                min="1"
                value={formData.amount}
                onChange={handleChange}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="salary">Salary</Label>
              <Input
                id="salary"
                name="salary"
                type="number"
                min="1"
                value={formData.salary ?? ""}
                onChange={handleChange}
              />
            </div>
          </CardContent>
          <CardFooter className="flex justify-between">
            <Button type="button" variant="outline" onClick={() => navigate("/admin/paid")}>
              Cancel
            </Button>
            <Button type="submit" disabled={updatePaymentMutation.isPending}>
              {updatePaymentMutation.isPending ? "Updating..." : "Update Payment"}
            </Button>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
};

export default EditPayment;
