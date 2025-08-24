import React, { useState, useEffect } from "react";
import { useQueryClient, useMutation } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
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
import workersData from "@/data/admin/paid/workers.json";

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

  const [contractors, setContractors] = useState(workersData.contractors);
  const [salaryWorkers, setSalaryWorkers] = useState(workersData.salary_workers);

  const createPaymentMutation = useMutation({
    mutationFn: async (paymentData: PaymentData) => {
      // Simulate adding payment to JSON data
      const newEntry = {
        id: Math.max(...paidData.daily_data.flatMap(day => day.entries.map(e => e.id)), 0) + 1,
        amount: paymentData.amount.toString(),
        date: new Date().toISOString().split('T')[0],
        salary_detail: paymentData.recipientType === "salary-worker" ? 
          salaryWorkers.find(w => w.id === paymentData.recipientId) || null : null,
        contractor_detail: paymentData.recipientType === "contractor" ? 
          contractors.find(c => c.id === paymentData.recipientId) || null : null
      };

      // Update in-memory data (not persisted to file)
      const today = newEntry.date;
      const existingDay = paidData.daily_data.find(d => d.date === today);
      if (existingDay) {
        existingDay.entries.push(newEntry);
        existingDay.daily_total = (existingDay.daily_total || 0) + parseFloat(newEntry.amount);
      } else {
        paidData.daily_data.push({
          date: today,
          daily_total: parseFloat(newEntry.amount),
          entries: [newEntry]
        });
      }

      // Update totals
      paidData.monthly_total += parseFloat(newEntry.amount);
      if (paymentData.recipientType === "salary-worker") {
        paidData.salary_paid_this_month += parseFloat(newEntry.amount);
      } else {
        paidData.contractors_paid_this_month += parseFloat(newEntry.amount);
      }
      paidData.yearly_total += parseFloat(newEntry.amount);

      return newEntry;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["paid"] });
      toast.success("Payment added successfully!");
      navigate("/admin/paid");
    },
    onError: (error: any) => {
      console.error("Error adding payment:", error);
      toast.error("Failed to add payment. Please try again.");
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