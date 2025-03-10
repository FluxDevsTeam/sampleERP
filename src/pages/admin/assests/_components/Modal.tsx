

// Modals.tsx
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from "@/components/ui/dialog";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";

interface Asset {
  id: number;
  name: string;
  value: number;
  expected_lifespan: string;
  is_still_available: boolean;
}

interface ModalsProps {
  selectedAsset: Asset | null;
  isModalOpen: boolean;
  setIsModalOpen: (open: boolean) => void;
  isDeleteDialogOpen: boolean;
  setIsDeleteDialogOpen: (open: boolean) => void;
  handleEdit: () => void;
  handleDelete: () => void;
  confirmDelete: () => void;
}

const Modals = ({ selectedAsset, isModalOpen, setIsModalOpen, isDeleteDialogOpen, setIsDeleteDialogOpen, handleEdit, handleDelete, confirmDelete }: ModalsProps) => {
  return (
    <>
      {/* Asset Details Modal */}
      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Asset Details</DialogTitle>
            <DialogDescription>View details for the selected asset.</DialogDescription>
          </DialogHeader>

          {selectedAsset && (
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-3 items-center gap-4">
                <span className="font-medium">Name:</span>
                <span className="col-span-2">{selectedAsset.name}</span>
              </div>
              <div className="grid grid-cols-3 items-center gap-4">
                <span className="font-medium">Value:</span>
                <span className="col-span-2">${selectedAsset.value}</span>
              </div>
              <div className="grid grid-cols-3 items-center gap-4">
                <span className="font-medium">Expected Lifespan :</span>
                <span className="col-span-2">{selectedAsset.expected_lifespan}</span>
              </div>
             
            </div>
          )}

<DialogFooter className="flex justify-between">
  <Button variant="outline" onClick={() => setIsModalOpen(false)}>
    Close
  </Button>
  <div className="flex gap-2">
    <Button variant="outline" onClick={handleEdit}>
      Edit
    </Button>
    <Button variant="destructive" onClick={handleDelete}>
      Delete
    </Button>
  </div>
</DialogFooter>

        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
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
