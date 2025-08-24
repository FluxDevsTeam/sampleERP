import React, { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
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
import { updateContractorRecord } from "@/utils/jsonDataService";

interface EditRecordPopupProps {
  isOpen: boolean;
  onClose: () => void;
  contractorId: string;
  record: { id: number; report: string };
}

const EditRecordPopup: React.FC<EditRecordPopupProps> = ({
  isOpen,
  onClose,
  contractorId,
  record,
}) => {
  const queryClient = useQueryClient();
  const [isPending, setIsPending] = useState(false);
  const [updatedRecord, setUpdatedRecord] = useState({
    report: record.report, // Only report field
  });

  const editRecordMutation = useMutation({
    mutationFn: async (updatedData: { report: string }) => {
      await updateContractorRecord(contractorId, record.id, updatedData);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["contractor-records", contractorId],
      });
      toast.success("Record updated successfully!");
      onClose();
    },
    onError: (error) => {
      toast.error("Failed to update record. Please try again.");
      console.error("Error updating record:", error);
    },
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsPending(true);
    try {
      await editRecordMutation.mutateAsync(updatedRecord);
    } catch (error) {
      console.error("Error in handleSubmit:", error);
    } finally {
      setIsPending(false);
    }
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
          {/* Report Field */}
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

          {/* Form Footer */}
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
