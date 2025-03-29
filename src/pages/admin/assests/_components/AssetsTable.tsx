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
              <th className="px-6 py-4 text-left text-sm font-semibold text-neutral-900 uppercase">Progress</th>
              <th className="px-6 py-4 text-left text-sm font-semibold text-neutral-900 uppercase">Status</th>
              <th className="px-6 py-4 text-left text-sm font-semibold text-neutral-900 uppercase">Total Selling Price</th>
              <th className="px-6 py-4 text-left text-sm font-semibold text-neutral-900 uppercase">Start Date</th>
              <th className="px-6 py-4 text-left text-sm font-semibold text-neutral-900 uppercase">End Date</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {projects.map((project) => (
              <tr 
                key={project.id} 
                className="hover:bg-gray-50 transition duration-150 ease-in-out cursor-pointer"
                onClick={() => handleRowClick(project)}
              >
                <td className="px-6 py-4">
                  <p className="text-sm font-medium text-neutral-900">{project.name}</p>
                </td>
                <td className="px-6 py-4">
                  <div className="w-full bg-gray-200 rounded-full h-2.5">
                    <div
                      className="bg-lime-600 h-2.5 rounded-full"
                      style={{ width: `${project.products.progress}%` }}
                    ></div>
                  </div>
                  <p className="text-xs mt-1 text-neutral-500">{project.products.progress}%</p>
                </td>
                <td className="px-6 py-4">
                  <div className="flex items-center space-x-2">
                    {project.status === 'completed' || project.status === 'in progress' || project.status === 'delivered' ? (
                      <div className="w-3 h-3 bg-gray-300 border rounded-full flex items-center justify-start overflow-hidden">
                        <div
                          className={`h-full rounded-full ${
                            project.status === 'completed' ? 'bg-lime-600' :
                            project.status === 'in progress' ? 'bg-yellow-500' :
                            project.status === 'delivered' ? 'bg-blue-500' : ''
                          }`}
                          style={{
                            width: project.status === 'completed' || project.status === 'delivered' ? '100%' : '50%',
                          }}
                        ></div>
                      </div>
                    ) : (
                      <span className="w-3 h-3 bg-red-500 border rounded-full"></span>
                    )}
                    <p className={`text-sm ${
                      project.status === 'completed' ? 'text-lime-600' :
                      project.status === 'in progress' ? 'text-yellow-500' :
                      project.status === 'delivered' ? 'text-blue-500' : 'text-red-500'
                    }`}>
                      {project.status}
                    </p>
                  </div>
                </td>
                <td className="px-6 py-4 text-sm text-neutral-700">
                  ₦ {project.calculations.total_product_selling_price.toLocaleString()}
                </td>
                <td className="px-6 py-4 text-sm text-neutral-700">
                  {new Date(project.start_date).toLocaleDateString()}
                </td>
                <td className="px-6 py-4 text-sm text-neutral-700">
                  {project.deadline ? new Date(project.deadline).toLocaleDateString() : "Not set"}
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