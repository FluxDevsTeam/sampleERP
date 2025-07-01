import React, { useState, useEffect } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { toast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import SearchablePaginatedDropdown from "./SearchablePaginatedDropdown";

interface AddPaidModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

const AddPaidModal: React.FC<AddPaidModalProps> = ({
  isOpen,
  onClose,
  onSuccess,
}) => {
  const [amount, setAmount] = useState<string>("");
  const [workerType, setWorkerType] = useState<"salary" | "contractor">("salary");
  const [workerId, setWorkerId] = useState<string | null>(null);
  const [selectedWorkerName, setSelectedWorkerName] = useState<string | null>(null);

  const queryClient = useQueryClient();

  const addPaidEntryMutation = useMutation({
    mutationFn: async (newEntry: { amount: string; salary?: number; contract?: number }) => {
      const accessToken = localStorage.getItem("accessToken");
      const response = await axios.post(
        "https://backend.kidsdesigncompany.com/api/paid/",
        newEntry,
        {
          headers: {
            Authorization: `JWT ${accessToken}`,
            "Content-Type": "application/json",
          },
        }
      );
      return response.data;
    },
    onSuccess: () => {
      toast.success("Paid entry added successfully!");
      onSuccess();
      onClose();
      setAmount("");
      setWorkerId(null);
      setSelectedWorkerName(null);
      setWorkerType("salary");
    },
    onError: (error) => {
      console.error("Add error:", error);
      toast.error("Failed to add paid entry. Please try again.");
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!workerId) {
      toast.error("Please select a worker.");
      return;
    }

    const payload: { amount: string; salary?: number; contract?: number } = {
      amount,
    };
    if (workerType === "salary") {
      payload.salary = parseInt(workerId);
    } else {
      payload.contract = parseInt(workerId);
    }
    addPaidEntryMutation.mutate(payload);
  };

  const handleWorkerChange = (name: string, value: string) => {
    console.log("AddPaidModal: handleWorkerChange - name:", name, "value:", value);
    
    setWorkerId(value);
    setSelectedWorkerName(name);
  };

  const salaryWorkersMapper = (data: any[]) => {
    return data.map((worker: any) => ({
      id: worker.id,
      name: `${worker.first_name} ${worker.last_name}`,
    }));
  };

  const contractorsMapper = (data: any[]) => {
    return data.map((contractor: any) => ({
      id: contractor.id,
      name: `${contractor.first_name} ${contractor.last_name}`,
    }));
  };

  const workerEndpoint = workerType === "salary" 
    ? "https://backend.kidsdesigncompany.com/api/salary-workers/" 
    : "https://backend.kidsdesigncompany.com/api/contractors/";

  const workerResultsKey = workerType === "salary" ? "results.workers" : "results.contractor";

  useEffect(() => {
    if (isOpen) {
    }
  }, [isOpen]);

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-xl p-20">
        <DialogHeader>
          <DialogTitle>Record New Paid Entry</DialogTitle>
          <DialogDescription>Fill in the details for the new paid entry.</DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="grid gap-4 py-4">
          <div className="items-center gap-4">
            <Label htmlFor="amount" className="text-right">Amount</Label>
            <Input
              id="amount"
              type="number"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              className="p-2 border rounded w-full"
              required
            />
          </div>
          
          <div className="">
            <Label htmlFor="workerType" className="text-left">Worker Type</Label>
            <select
              id="workerType"
              value={workerType}
              onChange={(e) => {
                setWorkerType(e.target.value as "salary" | "contractor");
                setWorkerId(null); // Reset workerId when type changes
                setSelectedWorkerName(null);
              }}
              className="p-2  border rounded w-full"
            >
              <option value="salary">Salary Worker</option>
              <option value="contractor">Contractor</option>
            </select>
          </div>
          <div className="col-span-4">
            <SearchablePaginatedDropdown
              key={workerId || "add-worker-dropdown"}
              endpoint={workerEndpoint}
              label={`${workerType === "salary" ? "Salary Worker" : "Contractor"} Name`}
              onChange={handleWorkerChange}
              name="worker"
              resultsKey={workerResultsKey}
              dataMapper={workerType === "salary" ? salaryWorkersMapper : contractorsMapper}
              selectedValue={workerId}
              selectedName={selectedWorkerName}
            />
          </div>
          <DialogFooter>
            <Button type="submit" disabled={addPaidEntryMutation.isPending || !workerId}>
              {addPaidEntryMutation.isPending ? "Adding..." : "Add Entry"}
            </Button>
            <Button type="button" variant="outline" onClick={onClose}>Cancel</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default AddPaidModal; 