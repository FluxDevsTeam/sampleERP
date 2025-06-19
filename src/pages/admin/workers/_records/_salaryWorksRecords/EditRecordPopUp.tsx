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

interface EditRecordPopupProps {
  isOpen: boolean;
  onClose: () => void;
  salaryWorkerId: string;
  record: { id: number; report: string; date: string };
}

const EditRecordPopup: React.FC<EditRecordPopupProps> = ({
  isOpen,
  onClose,
  salaryWorkerId,
  record,
}) => {
  const queryClient = useQueryClient();
  const [isPending, setIsPending] = useState(false);
  const [updatedRecord, setUpdatedRecord] = useState({
    report: record.report,
  });

  const editRecordMutation = useMutation({
    mutationFn: async (updatedData: { report: string }) => {
      const token = localStorage.getItem("accessToken");
      await axios.put(
        `https://backend.kidsdesigncompany.com/api/salary-workers/${salaryWorkerId}/record/${record.id}/`,
        updatedData,
        {
          headers: {
            Authorization: `JWT ${token}`,
          },
        }
      );
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["salary-worker-records", salaryWorkerId],
      });
      toast.success("Record updated successfully!");
      onClose();
    },
    onError: () => {
      toast.error("Failed to update record. Please try again.");
    },
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsPending(true);
    await editRecordMutation.mutateAsync(updatedRecord);
    setIsPending(false);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Edit Record</DialogTitle>
          <DialogDescription>
            Update the details of this record.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="report">Report</Label>
            <Input
              id="report"
              name="report"
              value={updatedRecord.report}
              onChange={(e) =>
                setUpdatedRecord({ ...updatedRecord, report: e.target.value })
              }
              required
            />
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit" disabled={isPending}>
              {isPending ? "Updating..." : "Update Record"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default EditRecordPopup;
