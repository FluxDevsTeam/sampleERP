import React, { useState, useEffect } from "react";
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
  recipientId: number;
  recipientType: "contractor" | "salary-worker";
}

const AddPayment = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const [formData, setFormData] = useState<PaymentData>({
    amount: 0,
    recipientId: 0,
    recipientType: "contractor",
  });

  const [contractors, setContractors] = useState([]);
  const [salaryWorkers, setSalaryWorkers] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [contractorRes, salaryRes] = await Promise.all([
          axios.get("https://kidsdesigncompany.pythonanywhere.com/api/contractors/"),
          axios.get("https://kidsdesigncompany.pythonanywhere.com/api/salary-workers/")
        ]);

        setContractors(contractorRes.data.results.contractor);
        setSalaryWorkers(salaryRes.data.results.workers);
      } catch (error) {
        console.error("Error fetching data:", error);
        toast.error("Failed to fetch contractors and salary workers");
      }
    };

    fetchData();
  }, []);

  const createPaymentMutation = useMutation({
    mutationFn: async (paymentData: PaymentData) => {
      const formattedData =
        paymentData.recipientType === "contractor"
          ? { amount: paymentData.amount, contract: paymentData.recipientId }
          : { amount: paymentData.amount, salary: paymentData.recipientId };

      try {
        const response = await axios.post(
          "https://kidsdesigncompany.pythonanywhere.com/api/paid/",
          formattedData
        );
        return response.data;
      } catch (error: any) {
        throw error.response?.data || "Failed to process payment";
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["paid"] });
      toast.success("Payment added successfully!");
      navigate("/admin/paid");
    },
    onError: (error: any) => {
      console.error("Error adding payment:", error);
      toast.error(error.error?.[0] || "Failed to add payment. Please try again.");
    },
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === "amount" || name === "recipientId" ? Number(value) : value,
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.recipientId) {
      toast.error("Please select a valid recipient.");
      return;
    }
    createPaymentMutation.mutate(formData);
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

            <div className="space-y-2">
              <Label htmlFor="recipientType">Recipient Type</Label>
              <select
                id="recipientType"
                name="recipientType"
                value={formData.recipientType}
                onChange={handleChange}
                className="w-full p-2 border rounded"
              >
                <option value="contractor">Contractor</option>
                <option value="salary-worker">Salary Worker</option>
              </select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="recipientId">Select Recipient</Label>
              <select
                id="recipientId"
                name="recipientId"
                value={formData.recipientId}
                onChange={handleChange}
                className="w-full p-2 border rounded"
                required
              >
                <option value="">-- Select --</option>
                {formData.recipientType === "contractor" ? (
                  contractors.map((contractor: any) => (
                    <option key={contractor.id} value={contractor.id}>
                      {contractor.first_name} {contractor.last_name}
                    </option>
                  ))
                ) : (
                  salaryWorkers.map((worker: any) => (
                    <option key={worker.id} value={worker.id}>
                      {worker.first_name} {worker.last_name}
                    </option>
                  ))
                )}
              </select>
            </div>
          </CardContent>
          <CardFooter className="flex justify-between">
            <Button type="button" variant="outline" onClick={() => navigate("/admin/paid")}>
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
