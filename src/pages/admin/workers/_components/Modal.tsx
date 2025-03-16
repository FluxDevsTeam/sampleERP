import React from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { useNavigate } from "react-router-dom";

interface Worker {
  id: number;
  first_name: string;
  last_name: string;
  email: string;
  craft_specialty: string;
  salary?: string; // Optional for contractors
  is_still_active: boolean;
}

interface ModalsProps {
  isModalOpen: boolean;
  setIsModalOpen: (open: boolean) => void;
  selectedWorker: Worker | null;
  handleEdit: () => void;
  handleDelete: () => void;
  isDeleteDialogOpen: boolean;
  setIsDeleteDialogOpen: (open: boolean) => void;
  confirmDelete: () => void;
  workerType: "salary-worker" | "contractor"; // Add this prop to differentiate
}

const Modals: React.FC<ModalsProps> = ({
  isModalOpen,
  setIsModalOpen,
  selectedWorker,
  handleEdit,
  handleDelete,
  isDeleteDialogOpen,
  setIsDeleteDialogOpen,
  confirmDelete,
  workerType, // New prop to determine worker type
}) => {
  const navigate = useNavigate();

  const handleViewRecords = () => {
    if (selectedWorker?.id) {
      // Dynamically route based on worker type
      if (workerType === "salary-worker") {
        navigate(`/admin/salary-workers/${selectedWorker.id}/records`);
      } else if (workerType === "contractor") {
        navigate(`/admin/contractors/${selectedWorker.id}/records`);
      }
    }
  };

  return (
    <>
      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>
              {workerType === "salary-worker" ? "Salary Worker" : "Contractor"} Details
            </DialogTitle>
            <DialogDescription>
              View details for the selected {workerType === "salary-worker" ? "salary worker" : "contractor"}.
            </DialogDescription>
          </DialogHeader>
          {selectedWorker && (
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-3 items-center gap-4">
                <span className="font-medium">Name:</span>
                <span className="col-span-2">{`${selectedWorker.first_name} ${selectedWorker.last_name}`}</span>
              </div>
              <div className="grid grid-cols-3 items-center gap-4">
                <span className="font-medium">Email:</span>
                <span className="col-span-2">{selectedWorker.email}</span>
              </div>
              <div className="grid grid-cols-3 items-center gap-4">
                <span className="font-medium">Craft Specialty:</span>
                <span className="col-span-2">{selectedWorker.craft_specialty}</span>
              </div>
              {workerType === "salary-worker" && (
                <div className="grid grid-cols-3 items-center gap-4">
                  <span className="font-medium">Salary:</span>
                  <span className="col-span-2">${selectedWorker.salary}</span>
                </div>
              )}
              <div className="grid grid-cols-3 items-center gap-4">
                <span className="font-medium">Active:</span>
                <span className="col-span-2">{selectedWorker.is_still_active ? "Yes" : "No"}</span>
              </div>
            </div>
          )}
          <DialogFooter>
            <div className="flex justify-around items-center w-full">
              <Button variant="outline" onClick={() => setIsModalOpen(false)}>
                Close
              </Button>
              <Button variant="outline" onClick={handleEdit}>
                Edit
              </Button>
              <Button variant="destructive" onClick={handleDelete}>
                Delete
              </Button>
              <Button variant="outline" onClick={handleViewRecords}>
                Record
              </Button>
            </div>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. It will permanently delete the{" "}
              {workerType === "salary-worker" ? "salary worker" : "contractor"}.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={confirmDelete}>Confirm</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};

export default Modals;