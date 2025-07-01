import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog"
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog"
import { Button } from "@/components/ui/button"
import EditAssetModal from "./EditAssetModal"

interface Asset {
  id: number
  name: string
  value: number
  expected_lifespan: string
  is_still_available: boolean
}

interface ModalsProps {
  selectedAsset: Asset | null
  isModalOpen: boolean
  setIsModalOpen: (open: boolean) => void
  isDeleteDialogOpen: boolean
  setIsDeleteDialogOpen: (open: boolean) => void
  handleDelete: () => void
  confirmDelete: () => void
  isCEO: boolean
  isDeleting?: boolean
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
  isDeleting 
}: ModalsProps) => {
  const [isEditModalOpen, setIsEditModalOpen] = useState(false)

 const handleEditClick = () => {
    setIsModalOpen(false) // Close the details modal
    setIsEditModalOpen(true) // Open the edit modal
  }

  const handleEditModalClose = () => {
    setIsEditModalOpen(false)
    // Don't reopen details modal here
  }

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
                <span className="col-span-2">NGN{selectedAsset.value}</span>
              </div>
              <div className="grid grid-cols-3 items-center gap-4">
                <span className="font-medium">Expected Lifespan:</span>
                <span className="col-span-2">{selectedAsset.expected_lifespan}</span>
              </div>
              <div className="grid grid-cols-3 items-center gap-4">
                <span className="font-medium">Status:</span>
                <span className="col-span-2">
                  {selectedAsset.is_still_available ? (
                    <span className="text-black">Available</span>
                  ) : (
                    <span className="text-red-600">Not Available</span>
                  )}
                </span>
              </div>
            </div>
          )}

          <DialogFooter>
            <div className="flex justify-around items-center w-full">
              <Button variant="outline" onClick={() => setIsModalOpen(false)}>
                Close
              </Button>
              {isCEO && (
                <Button variant="outline" onClick={handleEditClick}>
                  Edit
                </Button>
              )}
              {isCEO && (
                <Button variant="destructive" onClick={handleDelete} disabled={isDeleting}>
                  Delete
                </Button>
              )}
            </div>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit Asset Modal */}
      {selectedAsset && (
        <EditAssetModal 
          asset={selectedAsset}
          isOpen={isEditModalOpen}
          onClose={handleEditModalClose}
        />
      )}

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
  )
}

export default Modals