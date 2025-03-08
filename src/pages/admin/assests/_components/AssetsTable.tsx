import { useState, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
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
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";

const BASE_URL = "https://kidsdesigncompany.pythonanywhere.com/api/assets/";

interface Asset {
  id: number;
  name: string;
  value: number;
  expected_lifespan: string;
  is_still_available: boolean;
  get_total_value: number;
}

interface PaginatedAssetsResponse {
  count: number;
  next: string | null;
  previous: string | null;
  results: {
    assets: Asset[];
  };
}

const fetchAssets = async (page = 1): Promise<PaginatedAssetsResponse> => {
  const response = await axios.get(`${BASE_URL}?page=${page}`);
  return response.data;
};

const AssetsTable = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [searchParams, setSearchParams] = useSearchParams();
  
  // Get current page from URL or default to 1
  const currentPage = parseInt(searchParams.get("page") || "1", 10);
  
  // States for modal and selected asset
  const [selectedAsset, setSelectedAsset] = useState<Asset | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [totalPages, setTotalPages] = useState(1);

  // Use a consistent query key for assets data that includes the page
  const { 
    data, 
    isLoading, 
    error 
  } = useQuery({
    queryKey: ["assets", currentPage],
    queryFn: () => fetchAssets(currentPage),
  });

  // Calculate total pages when data changes
  useEffect(() => {
    if (data?.count) {
      // Assuming the API returns 10 items per page by default
      const itemsPerPage = 10; 
      setTotalPages(Math.ceil(data.count / itemsPerPage));
    }
  }, [data]);

  // Delete asset mutation
  const deleteAssetMutation = useMutation({
    mutationFn: async (assetId: number) => {
      await axios.delete(`${BASE_URL}${assetId}/`);
    },
    onSuccess: () => {
      // Invalidate all assets queries to refresh the latest data
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

  // Handle page change
  const handlePageChange = (page: number) => {
    setSearchParams({ page: page.toString() });
  };

  // Prefetch next page for smoother navigation
  useEffect(() => {
    if (currentPage < totalPages) {
      const nextPage = currentPage + 1;
      queryClient.prefetchQuery({
        queryKey: ["assets", nextPage],
        queryFn: () => fetchAssets(nextPage),
      });
    }
  }, [currentPage, queryClient, totalPages]);

  if (isLoading) return <p>Loading...</p>;
  if (error) return <p>Error: {(error as Error).message}</p>;

  const assets = data?.results?.assets || [];
  const hasNextPage = !!data?.next;
  const hasPreviousPage = !!data?.previous;

  return (
    <div className="h-screen p-4">
      <div className="flex justify-between items-center mb-4">
        <Link
          to="/admin/dashboard/add-asset"
          className="bg-neutral-900 text-white px-4 py-2 rounded-md inline-block"
        >
          Add Asset
        </Link>
        <div className="flex items-center gap-2">
          <span className="text-sm text-gray-500">
            Showing page {currentPage} of {totalPages}
          </span>
        </div>
      </div>

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
          {assets.map((asset) => (
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

      {/* Pagination Controls */}
      <Pagination className="mt-4">
        <PaginationContent>
          {/* Previous Button */}
          <PaginationItem>
            <PaginationPrevious 
              onClick={() => hasPreviousPage && handlePageChange(currentPage - 1)}
              className={!hasPreviousPage ? "pointer-events-none opacity-50" : "cursor-pointer"}
            />
          </PaginationItem>
          
          {/* First page */}
          {currentPage > 2 && (
            <PaginationItem>
              <PaginationLink onClick={() => handlePageChange(1)}>1</PaginationLink>
            </PaginationItem>
          )}
          
          {/* Ellipsis for pages before current */}
          {currentPage > 3 && (
            <PaginationItem>
              <PaginationEllipsis />
            </PaginationItem>
          )}
          
          {/* Page before current */}
          {currentPage > 1 && (
            <PaginationItem>
              <PaginationLink onClick={() => handlePageChange(currentPage - 1)}>
                {currentPage - 1}
              </PaginationLink>
            </PaginationItem>
          )}
          
          {/* Current page */}
          <PaginationItem>
            <PaginationLink isActive>{currentPage}</PaginationLink>
          </PaginationItem>
          
          {/* Page after current */}
          {currentPage < totalPages && (
            <PaginationItem>
              <PaginationLink onClick={() => handlePageChange(currentPage + 1)}>
                {currentPage + 1}
              </PaginationLink>
            </PaginationItem>
          )}
          
          {/* Ellipsis for pages after current */}
          {currentPage < totalPages - 2 && (
            <PaginationItem>
              <PaginationEllipsis />
            </PaginationItem>
          )}
          
          {/* Last page */}
          {currentPage < totalPages - 1 && totalPages > 1 && (
            <PaginationItem>
              <PaginationLink onClick={() => handlePageChange(totalPages)}>
                {totalPages}
              </PaginationLink>
            </PaginationItem>
          )}
          
          {/* Next Button */}
          <PaginationItem>
            <PaginationNext 
              onClick={() => hasNextPage && handlePageChange(currentPage + 1)}
              className={!hasNextPage ? "pointer-events-none opacity-50" : "cursor-pointer"}
            />
          </PaginationItem>
        </PaginationContent>
      </Pagination>

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
                <span className="font-medium">Expected Lifespan:</span>
                <span className="col-span-2">{selectedAsset.expected_lifespan}</span>
              </div>
              <div className="grid grid-cols-3 items-center gap-4">
                <span className="font-medium">Available:</span>
                <span className="col-span-2">{selectedAsset.is_still_available ? "Yes" : "No"}</span>
              </div>
              <div className="grid grid-cols-3 items-center gap-4">
                <span className="font-medium">Total Value:</span>
                <span className="col-span-2">${selectedAsset.get_total_value}</span>
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