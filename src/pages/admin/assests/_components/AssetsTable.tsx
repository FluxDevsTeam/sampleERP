import { useState, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useSearchParams } from "react-router-dom";
import axios from "axios";
import PaginationComponent from "./Pagination";
import Modals from "./Modal";
import { toast } from "sonner";
import SkeletonLoader from "./SkeletonLoader";
import { AssetsData, Asset } from "../_api/apiService";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faPencil,
  faTrash,
  faArrowLeft,
  faArrowRight,
  faXmark,
  faAnglesLeft,
  faAnglesRight,
} from "@fortawesome/free-solid-svg-icons";
import { Button } from "@/components/ui/button";

interface AssetsTableProps {
  headers: string[];
  searchQuery: string;
  showAvailable: boolean;
  showDeprecated: boolean;
  isTableModalOpen: boolean;
}

interface PaginatedAssetsResponse {
  count: number;
  next: string | null;
  previous: string | null;
  results: {
    assets: Asset[];
  };
}

const BASE_URL = "https://backend.kidsdesigncompany.com/api/assets/";

const fetchAssets = async (
  page = 1,
  searchQuery = "",
  showAvailable = false,
  showDeprecated = false
): Promise<PaginatedAssetsResponse> => {
  const token = localStorage.getItem("accessToken");
  const params = new URLSearchParams();
  params.append("page", String(page));

  if (searchQuery) {
    params.append("search", searchQuery);
  }
  if (showAvailable) {
    params.append("is_still_available", "true");
  }
  if (showDeprecated) {
    params.append("is_still_available", "false");
  }

  const response = await axios.get(`${BASE_URL}?${params.toString()}`, {
    headers: {
      Authorization: `JWT ${token}`,
    },
  });
  return response.data;
};

const AssetsTable = ({
  headers,
  searchQuery,
  showAvailable,
  showDeprecated,
  isTableModalOpen,
}: AssetsTableProps) => {
  const queryClient = useQueryClient();
  const [searchParams, setSearchParams] = useSearchParams();
  const currentUserRole = localStorage.getItem("user_role");
  const isCEO = currentUserRole === "ceo";

  const currentPage = parseInt(searchParams.get("page") || "1", 10);
  const [selectedAsset, setSelectedAsset] = useState<Asset | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [totalPages, setTotalPages] = useState(1);

  const { data, isLoading, error } = useQuery({
    queryKey: [
      "assets",
      currentPage,
      searchQuery,
      showAvailable,
      showDeprecated,
    ],
    queryFn: () =>
      fetchAssets(currentPage, searchQuery, showAvailable, showDeprecated),
  });

  useEffect(() => {
    if (data?.count) {
      const itemsPerPage = 10;
      setTotalPages(Math.ceil(data.count / itemsPerPage));
    }
  }, [data]);

  const deleteAssetMutation = useMutation({
    mutationFn: async (assetId: number) => {
      const token = localStorage.getItem("accessToken");
      await axios.delete(`${BASE_URL}${assetId}/`, {
        headers: {
          Authorization: `JWT ${token}`,
        },
      });
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
        queryKey: [
          "assets",
          nextPage,
          searchQuery,
          showAvailable,
          showDeprecated,
        ],
        queryFn: () =>
          fetchAssets(nextPage, searchQuery, showAvailable, showDeprecated),
      });
    }
  }, [currentPage, queryClient, totalPages, searchQuery, showAvailable, showDeprecated]);

  if (isLoading) return <SkeletonLoader />;
  if (error)
    return <p className="text-red-600">Error: {(error as Error).message}</p>;

  const assets = data?.results?.assets || [];
  const hasNextPage = !!data?.next;
  const hasPreviousPage = !!data?.previous;

  return (
    <div className="relative">
      <div
        className={`overflow-x-auto pb-6 ${isModalOpen || isTableModalOpen ? "blur-md" : ""}`}
      >
        <table className="min-w-full bg-white shadow-md rounded-lg overflow-hidden text-xs sm:text-sm">
          <thead className="bg-blue-400 text-white">
            <tr>
              {headers.map((header, index) => (
                <th
                  key={header}
                  className={`py-2 px-2 sm:py-4 sm:px-4 text-left font-semibold ${index === 2 ? 'hidden sm:table-cell' : ''}`}
                >
                  {header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {assets.length === 0 ? (
              <tr>
                <td colSpan={headers.length} className="p-0">
                  <div className="flex flex-col items-center justify-center py-6 bg-white rounded-lg border border-gray-200 shadow-sm m-2">
                    <div className="flex items-center justify-center w-16 h-16 rounded-full bg-yellow-50 mb-4">
                      {/* Building icon */}
                      <svg className="w-8 h-8 text-yellow-400" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                        <rect x="3" y="7" width="18" height="13" rx="2" stroke="currentColor" strokeWidth="2" fill="none" />
                        <path d="M9 21V7M15 21V7M3 7h18" stroke="currentColor" strokeWidth="2" />
                      </svg>
                    </div>
                    <h2 className="text-lg font-semibold text-gray-800 mb-1">No assets found</h2>
                    <p className="text-gray-500 mb-6 text-center max-w-xs">All your assets will show up here. Add a new asset to get started.</p>
                  </div>
                </td>
              </tr>
            ) : (
              assets.map((asset) => (
                <tr
                  key={asset.id}
                  className="hover:bg-gray-100"
                >
                  <td className="py-2 px-2 sm:py-5 sm:px-4 border-b border-gray-200 text-xs sm:text-sm text-gray-700 max-w-[12ch] truncate">
                    {asset.name}
                  </td>
                  <td className="py-2 px-2 sm:py-5 sm:px-4 border-b border-gray-200 text-xs sm:text-sm text-gray-700">
                    ₦ {new Intl.NumberFormat('en-NG', { useGrouping: true }).format(asset.value)}
                  </td>
                  <td className="py-2 px-2 sm:py-5 sm:px-4 border-b border-gray-200 text-xs sm:text-sm text-gray-700 hidden sm:table-cell">
                    {asset.expected_lifespan}
                  </td>
                  <td className="py-2 px-2 sm:py-5 sm:px-4 border-b border-gray-200 text-xs sm:text-sm text-gray-700">
                    <span
                      className={`inline-flex items-center px-1.5 py-0.5 sm:px-2.5 rounded-full text-xs font-medium`}
                    >
                      {asset.is_still_available ? "Available" : "Unavailable"}
                    </span>
                  </td>
                  <td className="py-2 px-2 sm:py-5 sm:px-4 border-b border-gray-200 text-xs sm:text-sm text-gray-700">
                    <button
                      onClick={() => handleRowClick(asset)}
                      className="px-2 py-1 sm:px-3 sm:py-1 text-blue-400 border-2 border-blue-400 rounded text-xs"
                    >
                      View
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      <div className="flex justify-center items-center mt-2 mb-2 gap-2">
        <button
          onClick={() => handlePageChange(1)}
          disabled={!hasPreviousPage}
          className="px-3 py-1 rounded bg-blue-400 text-white disabled:bg-gray-300"
        >
          <FontAwesomeIcon icon={faAnglesLeft} />
        </button>
        <button
          onClick={() => handlePageChange(currentPage - 1)}
          disabled={!hasPreviousPage}
          className="px-3 py-1 rounded bg-blue-400 text-white disabled:bg-gray-300"
        >
          <FontAwesomeIcon icon={faArrowLeft} />
        </button>
        <span className="mx-4 text-md ">Page {currentPage} of {totalPages}</span>
        <button
          onClick={() => handlePageChange(currentPage + 1)}
          disabled={!hasNextPage}
          className="px-3 py-1 rounded bg-blue-400 text-white disabled:bg-gray-300"
        >
          <FontAwesomeIcon icon={faArrowRight} />
        </button>
        <button
          onClick={() => handlePageChange(totalPages)}
          disabled={!hasNextPage}
          className="px-3 py-1 rounded bg-blue-400 text-white disabled:bg-gray-300"
        >
          <FontAwesomeIcon icon={faAnglesRight} />
        </button>
      </div>

      <Modals
        selectedAsset={selectedAsset}
        isModalOpen={isModalOpen}
        setIsModalOpen={setIsModalOpen}
        isDeleteDialogOpen={isDeleteDialogOpen}
        setIsDeleteDialogOpen={setIsDeleteDialogOpen}
        handleDelete={handleDelete}
        confirmDelete={confirmDelete}
        isCEO={isCEO}
        isDeleting={deleteAssetMutation.isPending}
      />
    </div>
  );
};

export default AssetsTable;
