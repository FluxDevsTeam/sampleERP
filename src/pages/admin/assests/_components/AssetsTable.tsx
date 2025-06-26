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
        <table className="min-w-full bg-white shadow-md rounded-lg overflow-hidden">
          <thead className="bg-blue-400 text-white">
            <tr>
              {headers.map((header) => (
                <th
                  key={header}
                  className="py-4 px-4 text-left text-sm font-semibold"
                >
                  {header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="">
            {assets.map((asset) => (
              <tr
                key={asset.id}
                className="hover:bg-gray-100"
              >
                <td className="py-5 px-4 border-b border-gray-200 text-sm text-gray-700">
                  {asset.name}
                </td>
                <td className="py-5 px-4 border-b border-gray-200 text-sm text-gray-700">
                  ₦ {new Intl.NumberFormat('en-NG', { useGrouping: true }).format(asset.value)}
                </td>
                <td className="py-5 px-4 border-b border-gray-200 text-sm text-gray-700">
                  {asset.expected_lifespan}
                </td>
                <td className="py-5 px-4 border-b border-gray-200 text-sm text-gray-700">
                  <span
                    className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium`}
                  >
                    {asset.is_still_available ? "Yes" : "No"}
                  </span>
                </td>
                <td className="py-5 px-4 border-b border-gray-200 text-sm text-gray-700">
                  <button
                    onClick={() => handleRowClick(asset)}
                    className="px-3 py-1 text-blue-400 border-2 border-blue-400 rounded"
                  >
                    View
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="flex justify-center items-center mb-28 gap-2">
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
        handleDelete={handleDelete}
        isDeleteDialogOpen={isDeleteDialogOpen}
        setIsDeleteDialogOpen={setIsDeleteDialogOpen}
        confirmDelete={confirmDelete}
        isCEO={isCEO}
      />
    </div>
  );
};

export default AssetsTable;
