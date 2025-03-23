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

// Define the Project interface based on your data structure
interface Project {
  id: number;
  name: string;
  status: string;
  start_date: string;
  deadline: string | null;
  selling_price: string;
  logistics: string;
  service_charge: string;
  products: {
    progress: number;
    total_project_selling_price: number;
    total_production_cost: number;
  };
  customer_detail: {
    id: number;
    name: string;
  };
}

interface ProjectModalsProps {
  isModalOpen: boolean;
  setIsModalOpen: (open: boolean) => void;
  selectedProject: Project | null;
  handleEdit: () => void;
  handleDelete: () => void;
  isDeleteDialogOpen: boolean;
  setIsDeleteDialogOpen: (open: boolean) => void;
  confirmDelete: () => void;
}

const ProjectModals: React.FC<ProjectModalsProps> = ({
  isModalOpen,
  setIsModalOpen,
  selectedProject,
  handleEdit,
  handleDelete,
  isDeleteDialogOpen,
  setIsDeleteDialogOpen,
  confirmDelete,
}) => {
  const navigate = useNavigate();

  const handleViewOtherProductionRecords = () => {
    if (selectedProject?.id) {
      navigate(`/ceo/projects/${selectedProject.id}/records`);
    }
  };

  return (
    <>
      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Project Details</DialogTitle>
            <DialogDescription>
              View details for the selected project.
            </DialogDescription>
          </DialogHeader>
          {selectedProject && (
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-3 items-center gap-4">
                <span className="font-medium">Name:</span>
                <span className="col-span-2">{selectedProject.name}</span>
              </div>
              <div className="grid grid-cols-3 items-center gap-4">
                <span className="font-medium">Customer:</span>
                <span className="col-span-2">{selectedProject.customer_detail.name}</span>
              </div>
              <div className="grid grid-cols-3 items-center gap-4">
                <span className="font-medium">Status:</span>
                <span className="col-span-2 capitalize">{selectedProject.status}</span>
              </div>
              <div className="grid grid-cols-3 items-center gap-4">
                <span className="font-medium">Progress:</span>
                <span className="col-span-2">{selectedProject.products.progress}%</span>
              </div>
              <div className="grid grid-cols-3 items-center gap-4">
                <span className="font-medium">Selling Price:</span>
                <span className="col-span-2">₦{selectedProject.selling_price}</span>
              </div>
              <div className="grid grid-cols-3 items-center gap-4">
                <span className="font-medium">Production Cost:</span>
                <span className="col-span-2">₦{selectedProject.products.total_production_cost}</span>
              </div>
              <div className="grid grid-cols-3 items-center gap-4">
                <span className="font-medium">Logistics:</span>
                <span className="col-span-2">₦{selectedProject.logistics}</span>
              </div>
              <div className="grid grid-cols-3 items-center gap-4">
                <span className="font-medium">Service Charge:</span>
                <span className="col-span-2">₦{selectedProject.service_charge}</span>
              </div>
              <div className="grid grid-cols-3 items-center gap-4">
                <span className="font-medium">Start Date:</span>
                <span className="col-span-2">{selectedProject.start_date}</span>
              </div>
              <div className="grid grid-cols-3 items-center gap-4">
                <span className="font-medium">Deadline:</span>
                <span className="col-span-2">{selectedProject.deadline || "Not set"}</span>
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
              <Button variant="outline" onClick={handleViewOtherProductionRecords}>
                Records
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
              This action cannot be undone. It will permanently delete the project.
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

export default ProjectModals;