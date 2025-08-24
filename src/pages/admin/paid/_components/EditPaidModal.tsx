import React, { useState, useEffect } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
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
import { PaidEntry } from "../_api/apiService";
import SearchablePaginatedDropdown from "../../../shop/sold/Sold Components/SearchablePaginatedDropdown";
import paidData from "@/data/admin/paid/paidData.json";
import workersData from "@/data/admin/paid/workers.json";

interface EditPaidModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  entry: PaidEntry | null;
}

const EditPaidModal: React.FC<EditPaidModalProps> = ({
  isOpen,
  onClose,
  onSuccess,
  entry,
}) => {
  const [amount, setAmount] = useState<string>("");
  const [workerType, setWorkerType] = useState<"salary" | "contractor">("salary");
  const [workerId, setWorkerId] = useState<string | null>(null);
  const [selectedWorkerName, setSelectedWorkerName] = useState<string | null>(null);
  const [initialWorkerType, setInitialWorkerType] = useState<"salary" | "contractor">("salary");
  const [date, setDate] = useState<string>("");

  const queryClient = useQueryClient();

  useEffect(() => {
    if (isOpen && entry) {
      setAmount(entry.amount);
      if (entry.salary_detail) {
        setWorkerType("salary");
        setInitialWorkerType("salary");
        setWorkerId(entry.salary_detail.id.toString());
        setSelectedWorkerName(`${entry.salary_detail.first_name} ${entry.salary_detail.last_name}`);
      } else if (entry.contractor_detail) {
        setWorkerType("contractor");
        setInitialWorkerType("contractor");
        setWorkerId(entry.contractor_detail.id.toString());
        setSelectedWorkerName(`${entry.contractor_detail.first_name} ${entry.contractor_detail.last_name}`);
      } else {
        setWorkerId(null);
        setSelectedWorkerName(null);
        setInitialWorkerType("salary");
      }
      setDate(entry.date || "");
    }
  }, [isOpen, entry]);

  const editPaidEntryMutation = useMutation({
    mutationFn: async (updatedEntry: { id: number; amount: string; salary?: number | null; contract?: number | null; date?: string }) => {
      const day = paidData.daily_data.find(d => d.entries.some(e => e.id === updatedEntry.id));
      if (day) {
        const entryIndex = day.entries.findIndex(e => e.id === updatedEntry.id);
        const oldAmount = parseFloat(day.entries[entryIndex].amount);
        day.entries[entryIndex] = {
          ...day.entries[entryIndex],
          amount: updatedEntry.amount,
          date: updatedEntry.date || day.entries[entryIndex].date,
          salary_detail: updatedEntry.salary ? workersData.salary_workers.find(w => w.id === updatedEntry.salary) || null : null,
          contractor_detail: updatedEntry.contract ? workersData.contractors.find(c => c.id === updatedEntry.contract) || null : null
        };
        day.daily_total = (day.daily_total || 0) - oldAmount + parseFloat(updatedEntry.amount);

        paidData.monthly_total = paidData.monthly_total - oldAmount + parseFloat(updatedEntry.amount);
        if (updatedEntry.salary) {
          paidData.salary_paid_this_month = paidData.salary_paid_this_month - oldAmount + parseFloat(updatedEntry.amount);
        } else {
          paidData.contractors_paid_this_month = paidData.contractors_paid_this_month - oldAmount + parseFloat(updatedEntry.amount);
        }
        paidData.yearly_total = paidData.monthly_total;
      }

      return updatedEntry;
    },
    onSuccess: () => {
      toast.success("Paid entry updated successfully!");
      onSuccess();
      onClose();
    },
    onError: (error) => {
      console.error("Edit error:", error);
      toast.error("Failed to update paid entry. Please try again.");
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!entry || !workerId) {
      toast.error("Please select a worker.");
      return;
    }

    const payload: { id: number; amount: string; salary?: number | null; contract?: number | null; date?: string } = {
      id: entry.id,
      amount,
    };

    if (initialWorkerType === "salary" && workerType === "contractor") {
      payload.salary = null;
    } else if (initialWorkerType === "contractor" && workerType === "salary") {
      payload.contract = null;
    }

    if (workerType === "salary") {
      payload.salary = parseInt(workerId);
    } else {
      payload.contract = parseInt(workerId);
    }
    if (date) {
      payload.date = date;
    }
    console.log('EditPaidModal payload:', payload);
    editPaidEntryMutation.mutate(payload);
  };

  const handleWorkerChange = (name: string, value: string) => {
    console.log("EditPaidModal: handleWorkerChange - name:", name, "value:", value);
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

  const workers = workerType === "salary" ? workersData.salary_workers : workersData.contractors;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl w-full px-3 md:px-6 py-6 md:py-8 max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Edit Paid Entry</DialogTitle>
          <DialogDescription>Edit the details for the selected paid entry.</DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="grid gap-4 py-2">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex flex-col gap-2">
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
            <div className="flex flex-col gap-2">
              <Label htmlFor="workerType" className="text-left">Worker Type</Label>
              <select
                id="workerType"
                value={workerType}
                onChange={(e) => {
                  setWorkerType(e.target.value as "salary" | "contractor");
                  setWorkerId(null);
                  setSelectedWorkerName(null);
                }}
                className="p-2 border rounded w-full"
              >
                <option value="salary">Salary Worker</option>
                <option value="contractor">Contractor</option>
              </select>
            </div>
          </div>
          <div className="col-span-1 md:col-span-2">
            <SearchablePaginatedDropdown
              key={workerId || "edit-worker-dropdown"}
              endpoint={workerType === "salary" ? "salary-workers" : "contractors"}
              label={`${workerType === "salary" ? "Salary Worker" : "Contractor"} Name`}
              onChange={handleWorkerChange}
              name="worker"
              resultsKey={workerType === "salary" ? "salary_workers" : "contractors"}
              dataMapper={workerType === "salary" ? salaryWorkersMapper : contractorsMapper}
              selectedValue={workerId}
              selectedName={selectedWorkerName}
              staticData={workers}
            />
          </div>
          <div className="flex flex-col gap-2">
            <Label htmlFor="date" className="text-right">Date</Label>
            <Input
              id="date"
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="p-2 border rounded w-full"
              required
            />
          </div>
          <DialogFooter>
            <div className="w-full md:mt-8 grid grid-cols-2 gap-2 md:flex md:gap-2 md:w-auto">
              <Button type="submit" disabled={editPaidEntryMutation.isPending || !workerId} className="w-full">
                {editPaidEntryMutation.isPending ? "Saving..." : "Save Changes"}
              </Button>
              <Button type="button" variant="outline" onClick={onClose} className="w-full">Cancel</Button>
            </div>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default EditPaidModal;