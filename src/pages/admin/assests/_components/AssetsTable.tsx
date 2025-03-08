import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription,
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

const BASE_URL = "https://kidsdesigncompany.pythonanywhere.com/api/assets/";

interface Asset {
  id: number;
  name: string;
  value: number;
  expected_lifespan: string;
  is_still_available: boolean;
  get_total_value: number;
}

interface AssetsResponse {
  assets: Asset[];
}

const fetchAssets = async (): Promise<AssetsResponse> => {
  const response = await axios.get(BASE_URL);
  return { assets: response.data.results.assets };
};

const AssetsTable = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  // States for modal and selected asset
  const [selectedAsset, setSelectedAsset] = useState<Asset | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);

  // Use a consistent query key for assets data
  const { data, isLoading, error } = useQuery<AssetsResponse>({
    queryKey: ["assets"],
    queryFn: fetchAssets,
  });

  // Delete asset mutation
  const deleteAssetMutation = useMutation({
    mutationFn: async (assetId: number) => {
      await axios.delete(`${BASE_URL}${assetId}/`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["assets"] });
      setIsDeleteDialogOpen(false);
      setIsModalOpen(false);
    },
  });

  // Handle row click to show modal
  const handleRowClick = (asset: Asset) => {
    setSelectedAsset(asset);
    setIsModalOpen(true);
  };

  // Handle edit button click
  const handleEdit = () => {
    if (selectedAsset?.id) {
      console.log("Navigating to edit page:", `/admin/dashboard/edit-asset/${selectedAsset.id}`);
      navigate(`/admin/dashboard/edit-asset/${selectedAsset.id}`);
    }
  };
  
  // Handle delete button click
  const handleDelete = () => {
    setIsDeleteDialogOpen(true);
  };

  // Confirm delete
  const confirmDelete = () => {
    if (selectedAsset?.id) {
      deleteAssetMutation.mutate(selectedAsset.id);
    }
  };

  if (isLoading) return <p>Loading...</p>;
  if (error) return <p>Error: {(error as Error).message}</p>;

  return (
    <div className="overflow-x-auto p-4">
      <Link
        to="/admin/dashboard/add-asset"
        className="bg-neutral-900 text-white px-4 py-2 rounded-md mb-4 inline-block"
      >
        Add Asset
      </Link>
      <table className="min-w-full bg-white border border-gray-200">
        <thead>
          <tr className="bg-gray-100">
            <th className="border px-4 py-2">Name</th>
            <th className="border px-4 py-2">Value</th>
            <th className="border px-4 py-2">Expected Lifespan</th>
            <th className="border px-4 py-2">Available</th>
            <th className="border px-4 py-2">Total Value</th>
          </tr>
        </thead>
        <tbody>
          {data?.assets?.map((asset) => (
            <tr
              key={asset.id}
              className="text-center border hover:bg-gray-50 cursor-pointer"
              onClick={() => handleRowClick(asset)}
            >
              <td className="border px-4 py-2">{asset.name}</td>
              <td className="border px-4 py-2">${asset.value}</td>
              <td className="border px-4 py-2">{asset.expected_lifespan}</td>
              <td className="border px-4 py-2">{asset.is_still_available ? "Yes" : "No"}</td>
              <td className="border px-4 py-2">${asset.get_total_value}</td>
            </tr>
          ))}
        </tbody>
      </table>

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
            </div>
          )}

          <DialogFooter className="flex justify-between sm:justify-between">
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
            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the asset and remove the data from the server.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={confirmDelete} className="bg-red-600 hover:bg-red-700">
              {deleteAssetMutation.isPending ? "Deleting..." : "Delete"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default AssetsTable;
