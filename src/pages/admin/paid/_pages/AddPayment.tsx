import React, { useState } from "react";
import { useQueryClient, useMutation } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
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
  salary?: number; // Making salary optional to satisfy API
}

const AddPayment = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const [formData, setFormData] = useState<PaymentData>({
    amount: 0,
    salary: undefined, // Keeping it optional
  });

  const createPaymentMutation = useMutation({
    mutationFn: async (paymentData: PaymentData) => {
      const response = await axios.post(
        "https://kidsdesigncompany.pythonanywhere.com/api/paid/",
        paymentData
      );
      return response.data;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["paid"] });
      toast.success("Payment added successfully!");
      console.log("Payment Response:", data);
      navigate("/admin/paid");
    },
    onError: (error: any) => {
      console.error("Error adding payment:", error.response?.data || error.message);
      
      // Extracting error message safely
      const errorMessage =
        error.response?.data?.message ||
        error.response?.data?.error?.[0] ||
        "Failed to add payment. Please try again.";

      toast.error(errorMessage);
    },
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value.trim() === "" ? undefined : Number(value),
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Ensuring the payload has correct values
    const payload: PaymentData = { amount: formData.amount };
    if (formData.salary !== undefined) {
      payload.salary = formData.salary;
    }

    createPaymentMutation.mutate(payload);
  };

  return (
    <div className="container mx-auto p-4">
      <Card className="max-w-md mx-auto">
        <CardHeader>
          <CardTitle>Add New Payment</CardTitle>
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

            {/* Salary Field (Optional) */}
            <div className="space-y-2">
              <Label htmlFor="salary">Salary</Label>
              <Input
                id="salary"
                name="salary"
                type="number"
                min="1"
                value={formData.salary || ""}
                onChange={handleChange}
              />
            </div>
          </CardContent>
          <CardFooter className="flex justify-between">
            <Button
              type="button"
              variant="outline"
              onClick={() => navigate("/admin/paid")}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={createPaymentMutation.isPending}>
              {createPaymentMutation.isPending ? "Saving..." : "Save Payment"}
            </Button>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
};

export default AddPayment;
