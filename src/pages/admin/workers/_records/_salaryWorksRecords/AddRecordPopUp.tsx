import React, { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
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
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";

interface AddRecordPopupProps {
  isOpen: boolean;
  onClose: () => void;
  salaryWorkerId: string;
}

const AddRecordPopup: React.FC<AddRecordPopupProps> = ({
  isOpen,
  onClose,
  salaryWorkerId,
}) => {
  const queryClient = useQueryClient();
  const [isPending, setIsPending] = useState(false);
  const [newRecord, setNewRecord] = useState({ report: ""});

  const addRecordMutation = useMutation({
    mutationFn: async (record: { report: string; date: string }) => {
      await axios.post(
        `https://kidsdesigncompany.pythonanywhere.com/api/salary-workers/${salaryWorkerId}/record/`,
        record
      );
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["salary-worker-records", salaryWorkerId] });
      toast.success("Record added successfully!");
      setNewRecord({ report: "" });
      onClose();
    },
    onError: () => {
      toast.error("Failed to add record. Please try again.");
    },
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsPending(true);
    await addRecordMutation.mutateAsync(newRecord);
    setIsPending(false);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Add New Record</DialogTitle>
          <DialogDescription>
            Add a new record for this salary worker.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="report">Report</Label>
            <Input
              id="report"
              name="report"
              value={newRecord.report}
              onChange={(e) => setNewRecord({ ...newRecord, report: e.target.value })}
              required
            />
          </div>
          
          <DialogFooter>
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit" disabled={isPending}>
              {isPending ? "Adding..." : "Add Record"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default AddRecordPopup;