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
  date_added?: string
  end_date?: string
  note?: string
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
        <DialogContent className="w-[95vw] max-w-md mx-auto p-4 sm:p-6">
          <DialogHeader>
            <DialogTitle className="text-lg sm:text-xl">Asset Details</DialogTitle>
            <DialogDescription className="text-sm">View details for the selected asset.</DialogDescription>
          </DialogHeader>

          {selectedAsset && (
            <div className="grid gap-3 sm:gap-4 py-3 sm:py-4">
              <div className="grid grid-cols-1 sm:grid-cols-3 items-start sm:items-center gap-2 sm:gap-4">
                <span className="font-medium text-sm sm:text-base">Name:</span>
                <span className="col-span-1 sm:col-span-2 text-sm sm:text-base">{selectedAsset.name}</span>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-3 items-start sm:items-center gap-2 sm:gap-4">
                <span className="font-medium text-sm sm:text-base">Value:</span>
                <span className="col-span-1 sm:col-span-2 text-sm sm:text-base">NGN{selectedAsset.value}</span>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-3 items-start sm:items-center gap-2 sm:gap-4">
                <span className="font-medium text-sm sm:text-base">Expected Lifespan:</span>
                <span className="col-span-1 sm:col-span-2 text-sm sm:text-base">{selectedAsset.expected_lifespan}</span>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-3 items-start sm:items-center gap-2 sm:gap-4">
                <span className="font-medium text-sm sm:text-base">Status:</span>
                <span className="col-span-1 sm:col-span-2 text-sm sm:text-base">
                  {selectedAsset.is_still_available ? (
                    <span className="text-black">Available</span>
                  ) : (
                    <span className="text-red-600">Not Available</span>
                  )}
                </span>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-3 items-start sm:items-center gap-2 sm:gap-4">
                <span className="font-medium text-sm sm:text-base">Date Added:</span>
                <span className="col-span-1 sm:col-span-2 text-sm sm:text-base">{selectedAsset.date_added ? new Date(selectedAsset.date_added).toLocaleDateString() : "-"}</span>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-3 items-start sm:items-center gap-2 sm:gap-4">
                <span className="font-medium text-sm sm:text-base">End Date:</span>
                <span className="col-span-1 sm:col-span-2 text-sm sm:text-base">{selectedAsset.end_date ? new Date(selectedAsset.end_date).toLocaleDateString() : "-"}</span>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-3 items-start sm:items-center gap-2 sm:gap-4">
                <span className="font-medium text-sm sm:text-base">Note:</span>
                <span className="col-span-1 sm:col-span-2 text-sm sm:text-base">{selectedAsset.note ? selectedAsset.note : "-"}</span>
              </div>
            </div>
          )}

          <DialogFooter>
            <div className="flex flex-col sm:flex-row justify-around items-center w-full gap-2 sm:gap-0">
              <Button variant="outline" onClick={() => setIsModalOpen(false)} className="w-full sm:w-auto text-sm">
                Close
              </Button>
              {isCEO && (
                <Button variant="outline" onClick={handleEditClick} className="w-full sm:w-auto text-sm">
                  Edit
                </Button>
              )}
              {isCEO && (
                <Button variant="destructive" onClick={handleDelete} disabled={isDeleting} className="w-full sm:w-auto text-sm">
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