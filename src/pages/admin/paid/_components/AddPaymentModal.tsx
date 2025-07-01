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
        const token = localStorage.getItem("accessToken");
        const config = {
          headers: {
            Authorization: `JWT ${token}`,
          },
        };

        const [contractorRes, salaryRes] = await Promise.all([
          axios.get(
            "https://backend.kidsdesigncompany.com/api/contractors/",
            config
          ),
          axios.get(
            "https://backend.kidsdesigncompany.com/api/salary-workers/",
            config
          ),
        ]);

        // Debug the response structure
        console.log("Full Contractor response:", contractorRes.data);
        console.log("Full Salary worker response:", salaryRes.data);
        console.log("Contractor results:", contractorRes.data.results);
        console.log("Salary worker results:", salaryRes.data.results);

        // Handle different possible data structures
        let contractorData = [];
        let salaryWorkerData = [];

        // Try to extract contractor data
        if (contractorRes.data.results?.contractor) {
          contractorData = contractorRes.data.results.contractor;
        } else if (contractorRes.data.contractor) {
          contractorData = contractorRes.data.contractor;
        } else if (contractorRes.data.results) {
          contractorData = Array.isArray(contractorRes.data.results) ? contractorRes.data.results : [];
        } else if (Array.isArray(contractorRes.data)) {
          contractorData = contractorRes.data;
        }

        // Try to extract salary worker data
        if (salaryRes.data.results?.workers) {
          salaryWorkerData = salaryRes.data.results.workers;
        } else if (salaryRes.data.workers) {
          salaryWorkerData = salaryRes.data.workers;
        } else if (salaryRes.data.results) {
          salaryWorkerData = Array.isArray(salaryRes.data.results) ? salaryRes.data.results : [];
        } else if (Array.isArray(salaryRes.data)) {
          salaryWorkerData = salaryRes.data;
        }

        console.log("Processed contractor data:", contractorData);
        console.log("Processed salary worker data:", salaryWorkerData);

        setContractors(contractorData);
        setSalaryWorkers(salaryWorkerData);
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
        const token = localStorage.getItem("accessToken");

        const response = await axios.post(
          "https://backend.kidsdesigncompany.com/api/paid/",
          formattedData,
          {
            headers: {
              Authorization: `JWT ${token}`,
            },
          }
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
      toast.error(
        error.error?.[0] || "Failed to add payment. Please try again."
      );
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
                      // Debug each contractor object
                      console.log(`Contractor ${index}:`, contractor);
                      
                      // Handle different possible name field structures
                      const firstName = contractor.first_name || contractor.firstName || contractor.name || contractor.full_name || "";
                      const lastName = contractor.last_name || contractor.lastName || contractor.surname || "";
                      const fullName = `${firstName} ${lastName}`.trim() || contractor.name || contractor.full_name || `Contractor ${contractor.id || index}`;
                      
                      console.log(`Contractor ${index} name:`, { firstName, lastName, fullName });
                      
                      return (
                        <option key={contractor.id || index} value={contractor.id}>
                          {fullName}
                        </option>
                      );
                    })
                  : salaryWorkers.map((worker: any, index: number) => {
                      // Debug each worker object
                      console.log(`Worker ${index}:`, worker);
                      
                      // Handle different possible name field structures
                      const firstName = worker.first_name || worker.firstName || worker.name || worker.full_name || "";
                      const lastName = worker.last_name || worker.lastName || worker.surname || "";
                      const fullName = `${firstName} ${lastName}`.trim() || worker.name || worker.full_name || `Worker ${worker.id || index}`;
                      
                      console.log(`Worker ${index} name:`, { firstName, lastName, fullName });
                      
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
