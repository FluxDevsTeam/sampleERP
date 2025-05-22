import React, { useState, useEffect } from "react";
import { useQuery, useQueryClient, useMutation } from "@tanstack/react-query";
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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";

interface PaymentData {
  amount: number;
  salary?: number;
  contract?: number;
  recipientType: "contractor" | "salary-worker";
  recipientId: number;
}

interface EditPaymentModalProps {
  id: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess?: () => void;
}

const EditPaymentModal: React.FC<EditPaymentModalProps> = ({ id, open, onOpenChange, onSuccess }) => {
  const queryClient = useQueryClient();

  const [formData, setFormData] = useState<PaymentData>({
    amount: 0,
    recipientType: "salary-worker",
    recipientId: 0,
  });

  const [contractors, setContractors] = useState<any[]>([]);
  const [salaryWorkers, setSalaryWorkers] = useState<any[]>([]);

  // Fetch Payment Data
  const { data, isLoading, error } = useQuery({
    queryKey: ["paid", id],
    queryFn: async () => {
      const response = await axios.get<PaymentData>(
        `https://kidsdesigncompany.pythonanywhere.com/api/paid/${id}/`
      );
      return response.data;
    },
    enabled: !!id && open,
  });

  // Fetch Contractors and Salary Workers
  useEffect(() => {
    if (!open) return;

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
  }, [open]);

  // Populate form when data is fetched
  useEffect(() => {
    if (data) {
      setFormData({
        amount: data.amount,
        recipientType: data.salary ? "salary-worker" : "contractor",
        recipientId: data.salary || data.contract || 0,
        salary: data.salary,
        contract: data.contract
      });
    }
  }, [data]);

  // Update Payment Mutation
  const updatePaymentMutation = useMutation({
    mutationFn: async (paymentData: PaymentData) => {
      // Format the data based on recipient type
      const formattedData = paymentData.recipientType === "contractor"
        ? { amount: paymentData.amount, contract: paymentData.recipientId }
        : { amount: paymentData.amount, salary: paymentData.recipientId };

      const response = await axios.put(
        `https://kidsdesigncompany.pythonanywhere.com/api/paid/${id}/`,
        formattedData
      );
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["paid"] });
      toast.success("Payment updated successfully!");
      onOpenChange(false);
      onSuccess?.();
    },
    onError: (error: any) => {
      console.error("Error updating payment:", error.response?.data || error.message);
      toast.error(
        error.response?.data?.error?.[0] || "Failed to update payment. Try again."
      );
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

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Edit Payment</DialogTitle>
        </DialogHeader>
        {isLoading ? (
          <p className="text-center">Loading payment details...</p>
        ) : error ? (
          <p className="text-center text-red-500">Error loading data.</p>
        ) : (
          <form onSubmit={handleSubmit}>
            <div className="space-y-4">
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
            </div>
            <div className="flex justify-between mt-6">
              <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
                Cancel
              </Button>
              <Button type="submit" disabled={updatePaymentMutation.isPending}>
                {updatePaymentMutation.isPending ? "Updating..." : "Update Payment"}
              </Button>
            </div>
          </form>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default EditPaymentModal;