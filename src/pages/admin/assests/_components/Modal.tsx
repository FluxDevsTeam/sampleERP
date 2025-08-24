// src/pages/admin/assets/_components/Modal.tsx
import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import EditAssetModal from "./EditAssetModal";

interface Asset {
  id: number;
  name: string;
  value: number;
  expected_lifespan: string;
  is_still_available: boolean;
  date_added?: string;
  end_date?: string;
  note?: string;
}

interface ModalsProps {
  selectedAsset: Asset | null;
  isModalOpen: boolean;
  setIsModalOpen: (open: boolean) => void;
  isDeleteDialogOpen: boolean;
  setIsDeleteDialogOpen: (open: boolean) => void;
  handleDelete: () => void;
  confirmDelete: () => void;
  isCEO: boolean;
  isDeleting?: boolean;
  onModalStateChange?: (isOpen: boolean) => void;
}

const Modals = ({
  selectedAsset,
  isModalOpen,
  setIsModalOpen,
  isDeleteDialogOpen,
  setIsDeleteDialogOpen,
  handleDelete,
  confirmDelete,
  isCEO,
  onModalStateChange,
}: ModalsProps) => {
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isClosing, setIsClosing] = useState(false);

  // Notify parent component about modal state changes
  useEffect(() => {
    if (onModalStateChange) {
      onModalStateChange(isModalOpen);
    }
  }, [isModalOpen, onModalStateChange]);

  const handleEditClick = () => {
    setIsModalOpen(false);
    setIsEditModalOpen(true);
  };

  const handleEditModalClose = () => {
    setIsEditModalOpen(false);
  };

  const handleClose = () => {
    setIsClosing(true);
    // Small delay to allow any animations to complete
    setTimeout(() => {
      setIsModalOpen(false);
      setIsClosing(false);
    }, 150);
  };

  return (
    <>
      <Dialog open={isModalOpen} onOpenChange={(open) => {
        if (!open) handleClose();
        else setIsModalOpen(true);
      }}>
        <DialogContent className="w-[95vw] max-w-md mx-auto p-4 sm:p-6">
          <DialogHeader>
            <DialogTitle className="text-lg sm:text-xl">Asset Details</DialogTitle>
            <DialogDescription className="text-sm">View details for the selected asset.</DialogDescription>
          </DialogHeader>
          {selectedAsset && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 bg-white border border-gray-200 rounded-lg p-4 mb-4 shadow">
              <div className="flex flex-col gap-1">
                <span className="text-xs font-semibold text-black uppercase">Name</span>
                <span className="text-base font-bold text-black">{selectedAsset.name}</span>
              </div>
              <div className="flex flex-col gap-1">
                <span className="text-xs font-semibold text-black uppercase">Value</span>
                <span className="text-base font-bold text-black">₦ {selectedAsset.value.toLocaleString("en-NG")}</span>
              </div>
              <div className="flex flex-col gap-1">
                <span className="text-xs font-semibold text-black uppercase">Expected Lifespan</span>
                <span className="text-base font-bold text-black">{selectedAsset.expected_lifespan}</span>
              </div>
              <div className="flex flex-col gap-1">
                <span className="text-xs font-semibold text-black uppercase">Status</span>
                <span className="text-base font-bold text-black">{selectedAsset.is_still_available ? "Available" : "Not Available"}</span>
              </div>
              <div className="flex flex-col gap-1">
                <span className="text-xs font-semibold text-black uppercase">Date Added</span>
                <span className="text-base font-bold text-black">{selectedAsset.date_added ? new Date(selectedAsset.date_added).toLocaleDateString() : "-"}</span>
              </div>
              <div className="flex flex-col gap-1">
                <span className="text-xs font-semibold text-black uppercase">End Date</span>
                <span className="text-base font-bold text-black">{selectedAsset.end_date ? new Date(selectedAsset.end_date).toLocaleDateString() : "-"}</span>
              </div>
              <div className="flex flex-col gap-1 sm:col-span-2">
                <span className="text-xs font-semibold text-black uppercase">Note</span>
                <span className="text-base font-bold text-black">{selectedAsset.note ? selectedAsset.note : "-"}</span>
              </div>
            </div>
          )}
          <DialogFooter>
            <div className="flex flex-row justify-around items-center w-full gap-2">
              <Button variant="outline" onClick={handleClose} className="w-full text-sm">
                Close
              </Button>
                <Button variant="outline" onClick={handleEditClick} className="w-full text-sm">
                  Edit
                </Button>
                <Button variant="destructive" onClick={handleDelete} className="w-full text-sm">
                  Delete
                </Button>
            </div>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      {selectedAsset && (
        <EditAssetModal
          asset={selectedAsset}
          isOpen={isEditModalOpen}
          onClose={handleEditModalClose}
          onSuccess={() => setIsEditModalOpen(false)}
        />
      )}
      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. It will permanently delete the asset.
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