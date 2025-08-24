import React, { useState, useEffect } from "react";
import { useQueryClient, useMutation } from "@tanstack/react-query";
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
} from "@/components/ui/dialog";
import paidData from "@/data/admin/paid/paidData.json";
import workersData from "@/data/admin/paid/workers.json";

interface PaymentData {
  amount: number;
  recipientId: number;
  recipientType: "contractor" | "salary-worker";
}

interface AddPaymentModalProps {
  onSuccess?: () => void;
  children: React.ReactNode;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
}

const initialFormData: PaymentData = {
  amount: 0,
  recipientId: 0,
  recipientType: "contractor",
};

const AddPaymentModal = ({
  children,
  onSuccess,
  open,
  onOpenChange,
}: AddPaymentModalProps) => {
  const queryClient = useQueryClient();
  const [isInternalOpen, setIsInternalOpen] = useState(false);
  const isControlled = open !== undefined && onOpenChange !== undefined;
  const isOpen = isControlled ? open : isInternalOpen;
  const setIsOpen = isControlled ? onOpenChange : setIsInternalOpen;

  const [formData, setFormData] = useState<PaymentData>(initialFormData);
  const [contractors, setContractors] = useState(workersData.contractors);
  const [salaryWorkers, setSalaryWorkers] = useState(workersData.salary_workers);

  useEffect(() => {
    if (!isOpen) {
      setFormData(initialFormData);
    }
  }, [isOpen]);

  const createPaymentMutation = useMutation({
    mutationFn: async (paymentData: PaymentData) => {
      const newEntry = {
        id: Math.max(...paidData.daily_data.flatMap(day => day.entries.map(e => e.id)), 0) + 1,
        amount: paymentData.amount.toString(),
        date: new Date().toISOString().split('T')[0],
        salary_detail: paymentData.recipientType === "salary-worker" ? 
          salaryWorkers.find(w => w.id === paymentData.recipientId) || null : null,
        contractor_detail: paymentData.recipientType === "contractor" ? 
          contractors.find(c => c.id === paymentData.recipientId) || null : null
      };

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
      setFormData(initialFormData);
      setIsOpen(false);
      onSuccess?.();
    },
    onError: (error: any) => {
      console.error("Error adding payment:", error);
      toast.error("Failed to add payment. Please try again.");
    },
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]:
        name === "amount" || name === "recipientId" ? Number(value) : value,
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

  const handleCancel = () => {
    setIsOpen(false);
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Add New Payment</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="amount">Amount</Label>
              <Input
                id="amount"
                name="amount"
                type="number"
                min="1"
                value={formData.amount || ""}
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
                value={formData.recipientId || ""}
                onChange={handleChange}
                className="w-full p-2 border rounded"
                required
              >
                <option value="">-- Select --</option>
                {formData.recipientType === "contractor"
                  ? contractors.map((contractor: any, index: number) => {
                      const firstName = contractor.first_name || "";
                      const lastName = contractor.last_name || "";
                      const fullName = `${firstName} ${lastName}`.trim() || `Contractor ${contractor.id || index}`;
                      return (
                        <option key={contractor.id || index} value={contractor.id}>
                          {fullName}
                        </option>
                      );
                    })
                  : salaryWorkers.map((worker: any, index: number) => {
                      const firstName = worker.first_name || "";
                      const lastName = worker.last_name || "";
                      const fullName = `${firstName} ${lastName}`.trim() || `Worker ${worker.id || index}`;
                      return (
                        <option key={worker.id || index} value={worker.id}>
                          {fullName}
                        </option>
                      );
                    })}
              </select>
            </div>
          </div>
          <div className="flex justify-end gap-2 mt-6">
            <Button type="button" variant="outline" onClick={handleCancel}>
              Cancel
            </Button>
            <Button type="submit" disabled={createPaymentMutation.isPending}>
              {createPaymentMutation.isPending ? "Saving..." : "Save Payment"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default AddPaymentModal;