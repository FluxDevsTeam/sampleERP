import React, { useState, useEffect } from "react";
import { useQueryClient, useMutation } from "@tanstack/react-query";
import axios from "axios";
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

const AddPaymentModal = ({ children, onSuccess, open, onOpenChange }: AddPaymentModalProps) => {
  const queryClient = useQueryClient();
  const [isInternalOpen, setIsInternalOpen] = useState(false);
  const isControlled = open !== undefined && onOpenChange !== undefined;
  const isOpen = isControlled ? open : isInternalOpen;
  const setIsOpen = isControlled ? onOpenChange : setIsInternalOpen;

  const [formData, setFormData] = useState<PaymentData>(initialFormData);
  const [contractors, setContractors] = useState([]);
  const [salaryWorkers, setSalaryWorkers] = useState([]);

  // Reset form when modal closes
  useEffect(() => {
    if (!isOpen) {
      setFormData(initialFormData);
    }
  }, [isOpen]);

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

    if (isOpen) {
      fetchData();
    }
  }, [isOpen]);

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
      setFormData(initialFormData); // Reset form after success
      setIsOpen(false);
      onSuccess?.();
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

  const handleCancel = () => {
    setIsOpen(false);
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        {children}
      </DialogTrigger>
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
          </div>
          <div className="flex justify-end gap-2 mt-6">
            <Button 
              type="button" 
              variant="outline" 
              onClick={handleCancel}
            >
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