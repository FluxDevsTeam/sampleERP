import { useState, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import axios from "axios";
import PaginationComponent from "./Pagination";
import Modals from "./Modal"

const BASE_URL = "https://kidsdesigncompany.pythonanywhere.com/api/assets/";

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
  const response = await axios.get(`${BASE_URL}?page=${page}`);
  return response.data;
};

const AssetsTable = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [searchParams, setSearchParams] = useSearchParams();
  
  const currentPage = parseInt(searchParams.get("page") || "1", 10);
  const [selectedAsset, setSelectedAsset] = useState<Asset | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [totalPages, setTotalPages] = useState(1);

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
      await axios.delete(`${BASE_URL}${assetId}/`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["assets"] });
      setIsDeleteDialogOpen(false);
      setIsModalOpen(false);
    },
  });

  const handleRowClick = (asset: Asset) => {
    setSelectedAsset(asset);
    setIsModalOpen(true);
  };

  const handleEdit = () => {
    if (selectedAsset?.id) {
      navigate(`/admin/dashboard/edit-asset/${selectedAsset.id}`);
    }
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

  if (isLoading) return <p>Loading...</p>;
  if (error) return <p>Error: {(error as Error).message}</p>;

  const assets = data?.results?.assets || [];
  const hasNextPage = !!data?.next;
  const hasPreviousPage = !!data?.previous;

  return (
  
    <div className=" p-4">
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
            </tr>
          ))}
        </tbody>
      </table>

      <PaginationComponent
        currentPage={currentPage}
        totalPages={totalPages}
        hasNextPage={hasNextPage}
        hasPreviousPage={hasPreviousPage}
        handlePageChange={handlePageChange}
      />

      {/* Importing Modals Component */}
      <Modals
        isModalOpen={isModalOpen}
        setIsModalOpen={setIsModalOpen}
        selectedAsset={selectedAsset}
        handleEdit={handleEdit}
        handleDelete={handleDelete}
        isDeleteDialogOpen={isDeleteDialogOpen}
        setIsDeleteDialogOpen={setIsDeleteDialogOpen}
        confirmDelete={confirmDelete}
      />
    </div>
  );
};

export default AssetsTable;
