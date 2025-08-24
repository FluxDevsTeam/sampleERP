import React, { useState, useEffect } from "react";
import { useQueryClient, useMutation } from "@tanstack/react-query";
import { useNavigate, useParams } from "react-router-dom";
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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import paidData from "@/data/admin/paid/paidData.json";
import workersData from "@/data/admin/paid/workers.json";

interface PaymentData {
  amount: number;
  salary?: number;
  contract?: number;
  recipientType: "contractor" | "salary-worker";
  recipientId: number;
}

const EditPayment = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const [formData, setFormData] = useState<PaymentData>({
    amount: 0,
    recipientType: "salary-worker",
    recipientId: 0,
  });

  const [contractors, setContractors] = useState(workersData.contractors);
  const [salaryWorkers, setSalaryWorkers] = useState(workersData.salary_workers);

  // Simulate fetching payment data
  const payment = paidData.daily_data
    .flatMap(day => day.entries)
    .find(entry => entry.id === parseInt(id || '0'));

  useEffect(() => {
    if (payment) {
      setFormData({
        amount: parseFloat(payment.amount),
        recipientType: payment.salary_detail ? "salary-worker" : "contractor",
        recipientId: payment.salary_detail?.id || payment.contractor_detail?.id || 0,
        salary: payment.salary_detail?.id,
        contract: payment.contractor_detail?.id
      });
    }
  }, [id]);

  const updatePaymentMutation = useMutation({
    mutationFn: async (paymentData: PaymentData) => {
      const updatedEntry = {
        ...payment,
        amount: paymentData.amount.toString(),
        salary_detail: paymentData.recipientType === "salary-worker" ? 
          salaryWorkers.find(w => w.id === paymentData.recipientId) || null : null,
        contractor_detail: paymentData.recipientType === "contractor" ? 
          contractors.find(c => c.id === paymentData.recipientId) || null : null
      };

      // Update in-memory data
      const day = paidData.daily_data.find(d => d.entries.some(e => e.id === parseInt(id || '0')));
      if (day && payment) {
        const oldAmount = parseFloat(payment.amount);
        const entryIndex = day.entries.findIndex(e => e.id === parseInt(id || '0'));
        day.entries[entryIndex] = updatedEntry;
        day.daily_total = (day.daily_total || 0) - oldAmount + paymentData.amount;

        // Update totals
        paidData.monthly_total = paidData.monthly_total - oldAmount + paymentData.amount;
        if (paymentData.recipientType === "salary-worker") {
          paidData.salary_paid_this_month = paidData.salary_paid_this_month - oldAmount + paymentData.amount;
        } else {
          paidData.contractors_paid_this_month = paidData.contractors_paid_this_month - oldAmount + paymentData.amount;
        }
        paidData.yearly_total = paidData.monthly_total;
      }

      return updatedEntry;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["paid"] });
      toast.success("Payment updated successfully!");
      navigate("/admin/paid");
    },
    onError: (error: any) => {
      console.error("Error updating payment:", error);
      toast.error("Failed to update payment. Try again.");
    },
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === "amount" || name === "recipientId" ? Number(value) : value,
    }));
  };

  const handleSelectChange = (name: string, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [name]: name === "recipientId" ? Number(value) : value,
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.recipientId) {
      toast.error("Please select a valid recipient.");
      return;
    }
    updatePaymentMutation.mutate(formData);
  };

  if (!payment) return <p className="text-center">Payment not found.</p>;

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
              <Label htmlFor="recipientType">Recipient Type</Label>
              <Select 
                value={formData.recipientType} 
                onValueChange={(value) => handleSelectChange("recipientType", value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select Recipient Type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="contractor">Contractor</SelectItem>
                  <SelectItem value="salary-worker">Salary Worker</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="recipientId">Select Recipient</Label>
              <Select 
                value={formData.recipientId.toString()} 
                onValueChange={(value) => handleSelectChange("recipientId", value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select Recipient" />
                </SelectTrigger>
                <SelectContent>
                  {formData.recipientType === "contractor" ? (
                    contractors.map((contractor) => (
                      <SelectItem key={contractor.id} value={contractor.id.toString()}>
                        {contractor.first_name} {contractor.last_name}
                      </SelectItem>
                    ))
                  ) : (
                    salaryWorkers.map((worker) => (
                      <SelectItem key={worker.id} value={worker.id.toString()}>
                        {worker.first_name} {worker.last_name}
                      </SelectItem>
                    ))
                  )}
                </SelectContent>
              </Select>
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