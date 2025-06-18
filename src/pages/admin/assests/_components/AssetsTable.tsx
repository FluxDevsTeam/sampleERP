import { useState ,  useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {  useSearchParams } from "react-router-dom";
import axios from "axios";
import PaginationComponent from "./Pagination";
import Modals from "./Modal";
import { toast } from "sonner";
import SkeletonLoader from "./SkeletonLoader";
import AddAssetModal from "./AddAssetsModal";

const BASE_URL = "https://backend.kidsdesigncompany.com/api/assets/";

interface Asset {
  id: number;
  name: string;
  value: number;
  expected_lifespan: string;
  is_still_available: boolean;
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
    const token = localStorage.getItem("access_token");
  const response = await axios.get(`${BASE_URL}?page=${page}`,
    {
            headers: {
              Authorization: `JWT ${token}`,
            },
          }
  );
  return response.data;
};

const AssetsTable = () => {

  const queryClient = useQueryClient();
  const [searchParams, setSearchParams] = useSearchParams();
  
  const currentPage = parseInt(searchParams.get("page") || "1", 10);
  const [selectedAsset, setSelectedAsset] = useState<Asset | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [totalPages, setTotalPages] = useState(1);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  const { data, isLoading, error } = useQuery({
    queryKey: ["assets", currentPage],
    queryFn: () => fetchAssets(currentPage),
  });

  useEffect(() => {
    if (data?.count) {
      const itemsPerPage = 10;
      setTotalPages(Math.ceil(data.count / itemsPerPage));
    }
  }, [data]);

  const deleteAssetMutation = useMutation({
    mutationFn: async (assetId: number) => {
       const token = localStorage.getItem("access_token");
      await axios.delete(`${BASE_URL}${assetId}/` ,
          {
            headers: {
              Authorization: `JWT ${token}`,
            },
          }
      );
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["assets"] });
      setIsDeleteDialogOpen(false);
      setIsModalOpen(false);
      toast.success("Asset deleted successfully!");
    },
  });

  const handleRowClick = (asset: Asset) => {
    setSelectedAsset(asset);
    setIsModalOpen(true);
  };

  const handleDelete = () => {
    setIsDeleteDialogOpen(true);
  };

  const confirmDelete = () => {
    if (selectedAsset?.id) {
      deleteAssetMutation.mutate(selectedAsset.id);
    }
  };

  const handlePageChange = (newPage: number) => {
    setSearchParams({ page: newPage.toString() });
  };

  useEffect(() => {
    if (currentPage < totalPages) {
      const nextPage = currentPage + 1;
      queryClient.prefetchQuery({
        queryKey: ["assets", nextPage],
        queryFn: () => fetchAssets(nextPage),
      });
    }
  }, [currentPage, queryClient, totalPages]);

  if (isLoading) return <SkeletonLoader />;
  if (error) return <p className="text-red-600">Error: {(error as Error).message}</p>;

  const assets = data?.results?.assets || [];
  const hasNextPage = !!data?.next;
  const hasPreviousPage = !!data?.previous;

  return (
    <div className="p-6 flex flex-col h-full bg-white">
      <div className="flex justify-between items-center mb-6">
        <div
          onClick={() => setIsAddModalOpen(true)}
          className="cursor-pointer bg-blue-600 text-white px-6 py-3 rounded-lg shadow-md hover:text-white hover:bg-blue-400 transition duration-300"
        >
          Add Asset
        </div>
        <div className="flex items-center gap-2">
          <span className="text-sm text-gray-700">
            Showing page {currentPage} of {totalPages}
          </span>
        </div>
      </div>

      <div className="flex-1 overflow-auto rounded-lg shadow-sm border border-gray-200">
        <table className="min-w-full bg-white divide-y divide-gray-200">
          <thead className="bg-gray-100">
            <tr>
              <th className="px-6 py-4 text-left text-sm font-semibold text-neutral-900 uppercase">Name</th>
              <th className="px-6 py-4 text-left text-sm font-semibold text-neutral-900 uppercase">Value</th>
              <th className="px-6 py-4 text-left text-sm font-semibold text-neutral-900 uppercase">Lifespan</th>
              <th className="px-6 py-4 text-left text-sm font-semibold text-neutral-900 uppercase">Available</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {assets.map((asset) => (
              <tr 
                key={asset.id} 
                className="hover:bg-gray-50 transition duration-150 ease-in-out cursor-pointer"
                onClick={() => handleRowClick(asset)}
              >
                <td className="px-6 py-4">
                  <p className="text-sm font-medium text-neutral-900">{asset.name}</p>
                </td>
                <td className="px-6 py-4">
                  <p className="text-sm font-medium text-neutral-900">NGN {asset.value}</p>
                </td>
                <td className="px-6 py-4">
                  <p className="text-sm font-medium text-neutral-900">{asset.expected_lifespan}</p>
                </td>
                <td className="px-6 py-4 text-sm text-neutral-700">
                  <p className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                    asset.is_still_available ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"
                  }`}>
                    {asset.is_still_available ? "Yes" : "No"}
                  </p>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="mt-6">
        <PaginationComponent
          currentPage={currentPage}
          totalPages={totalPages}
          hasNextPage={hasNextPage}
          hasPreviousPage={hasPreviousPage}
          handlePageChange={handlePageChange}
        />
      </div>

      <AddAssetModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
      />

      <Modals
        isModalOpen={isModalOpen}
        setIsModalOpen={setIsModalOpen}
        selectedAsset={selectedAsset}
        handleDelete={handleDelete}
        isDeleteDialogOpen={isDeleteDialogOpen}
        setIsDeleteDialogOpen={setIsDeleteDialogOpen}
        confirmDelete={confirmDelete}
      />
    </div>
  );
};

export default AssetsTable;