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
import SearchablePaginatedDropdown from "./SearchablePaginatedDropdown";
import paidData from "@/data/admin/paid/paidData.json";
import workersData from "@/data/admin/paid/workers.json";

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
  const [date, setDate] = useState<string>("");
  const [userRole, setUserRole] = useState<string | null>(null);

  const queryClient = useQueryClient();

  const addPaidEntryMutation = useMutation({
    mutationFn: async (newEntry: { amount: string; salary?: number; contract?: number; date?: string }) => {
      const newId = Math.max(...paidData.daily_data.flatMap(day => day.entries.map(e => e.id)), 0) + 1;
      const entryDate = newEntry.date || new Date().toISOString().split('T')[0];
      
      const entry = {
        id: newId,
        amount: newEntry.amount,
        date: entryDate,
        salary_detail: newEntry.salary ? workersData.salary_workers.find(w => w.id === newEntry.salary) || null : null,
        contractor_detail: newEntry.contract ? workersData.contractors.find(c => c.id === newEntry.contract) || null : null
      };

      const existingDay = paidData.daily_data.find(d => d.date === entryDate);
      if (existingDay) {
        existingDay.entries.push(entry);
        existingDay.daily_total = (existingDay.daily_total || 0) + parseFloat(newEntry.amount);
      } else {
        paidData.daily_data.push({
          date: entryDate,
          daily_total: parseFloat(newEntry.amount),
          entries: [entry]
        });
      }

      paidData.monthly_total += parseFloat(newEntry.amount);
      if (newEntry.salary) {
        paidData.salary_paid_this_month += parseFloat(newEntry.amount);
      } else {
        paidData.contractors_paid_this_month += parseFloat(newEntry.amount);
      }
      paidData.yearly_total += parseFloat(newEntry.amount);

      return entry;
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

    const payload: { amount: string; salary?: number; contract?: number; date?: string } = {
      amount,
    };
    if (workerType === "salary") {
      payload.salary = parseInt(workerId);
    } else {
      payload.contract = parseInt(workerId);
    }
    if (userRole === 'ceo' && date) {
      payload.date = date;
    }
    console.log('AddPaidModal payload:', payload);
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

  const workers = workerType === "salary" ? workersData.salary_workers : workersData.contractors;

  useEffect(() => {
    setUserRole(localStorage.getItem('user_role'));
  }, []);

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl w-full px-3 md:px-6 py-6 md:py-8 max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Record New Paid Entry</DialogTitle>
          <DialogDescription>Fill in the details for the new paid entry.</DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="grid gap-4 py-2">
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
          <div className="col-span-4">
            <SearchablePaginatedDropdown
              key={workerId || "add-worker-dropdown"}
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
                onChange={e => setDate(e.target.value)}
                className="p-2 border rounded w-full"
                required
              />
            </div>
          <DialogFooter>
            <div className="w-full md:mt-8 grid grid-cols-2 gap-2 md:flex md:gap-2 md:w-auto">
              <Button type="submit" disabled={addPaidEntryMutation.isPending || !workerId} className="w-full">
                {addPaidEntryMutation.isPending ? "Adding..." : "Add Entry"}
              </Button>
              <Button type="button" variant="outline" onClick={onClose} className="w-full">Cancel</Button>
            </div>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default AddPaidModal;