import { useState, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import axios from "axios";
import PaginationComponent from "./Pagination";
import Modals from "./Modal";
import { toast } from "sonner";
import SkeletonLoader from "./SkeletonLoader";

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
      toast.success("Asset deleted successfully!");
    },
  });

  const handleRowClick = (asset: Asset) => {
    setSelectedAsset(asset);
    setIsModalOpen(true);
  };

  const handleEdit = () => {
    if (selectedAsset?.id) {
      navigate(`/admin/edit-asset/${selectedAsset.id}`);
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

  if (isLoading) return <SkeletonLoader />;
  if (error) return <p className="text-red-600">Error: {(error as Error).message}</p>;

  const assets = data?.results?.assets || [];
  const hasNextPage = !!data?.next;
  const hasPreviousPage = !!data?.previous;

  return (
    <div className="p-6 flex flex-col h-full bg-white">
      <div className="flex justify-between items-center mb-6">
        <Link
          to="/admin/add-asset"
          className="bg-blue-600 text-white px-6 py-3 rounded-lg shadow-md hover:bg-blue-700 transition duration-300"
        >
          Add Asset
        </Link>
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
            {assets.map((project) => (
              <tr 
                key={project.id} 
                className="hover:bg-gray-50 transition duration-150 ease-in-out cursor-pointer"
                onClick={() => handleRowClick(project)}
              >
                <td className="px-6 py-4">
                  <p className="text-sm font-medium text-neutral-900">{project.name}</p>
                </td>
                <td className="px-6 py-4">
                   <p className="text-sm font-medium text-neutral-900">NGN {project.value}</p>
                </td>
                <td className="px-6 py-4">
                 <p className="text-sm font-medium text-neutral-900">{project.expected_lifespan}</p>
             
                </td>
                <td className="px-6 py-4 text-sm text-neutral-700">
                 <p className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">{project.is_still_available ? " Yes" : " No"}</p>
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