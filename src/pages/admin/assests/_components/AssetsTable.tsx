// src/pages/admin/assets/_components/AssetsTable.tsx
import { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { toast } from "sonner";
import PaginationComponent from "./Pagination";
import Modals from "./Modal";
import SkeletonLoader from "./SkeletonLoader";
import { Asset } from "../_api/apiService";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faAnglesLeft, faAnglesRight, faArrowLeft, faArrowRight } from "@fortawesome/free-solid-svg-icons";
import { Button } from "@/components/ui/button";
import assetsData from "@/data/admin/assets/assets.json";

interface AssetsTableProps {
  headers: string[];
  searchQuery: string;
  showAvailable: boolean;
  showDeprecated: boolean;
  isTableModalOpen: boolean;
  setIsTableModalOpen: (open: boolean) => void;
}

interface PaginatedAssetsResponse {
  count: number;
  next: string | null;
  previous: string | null;
  results: {
    assets: Asset[];
  };
}

const AssetsTable = ({
  headers,
  searchQuery,
  showAvailable,
  showDeprecated,
  isTableModalOpen,
  setIsTableModalOpen,
}: AssetsTableProps) => {
  const [searchParams, setSearchParams] = useSearchParams();
  const currentUserRole = localStorage.getItem("user_role");
  const isCEO = currentUserRole === "ceo";
  const currentPage = parseInt(searchParams.get("page") || "1", 10);
  const [selectedAsset, setSelectedAsset] = useState<Asset | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [totalPages, setTotalPages] = useState(1);
  const [data, setData] = useState<PaginatedAssetsResponse | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setIsLoading(true);
    let filteredAssets = assetsData.results.assets;
    if (searchQuery) {
      filteredAssets = filteredAssets.filter((asset) =>
        asset.name.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }
    if (showAvailable && !showDeprecated) {
      filteredAssets = filteredAssets.filter((asset) => asset.is_still_available);
    } else if (showDeprecated && !showAvailable) {
      filteredAssets = filteredAssets.filter((asset) => !asset.is_still_available);
    }

    const itemsPerPage = 10;
    const startIndex = (currentPage - 1) * itemsPerPage;
    const paginatedAssets = filteredAssets.slice(startIndex, startIndex + itemsPerPage);

    setData({
      count: filteredAssets.length,
      next: startIndex + itemsPerPage < filteredAssets.length ? "next" : null,
      previous: startIndex > 0 ? "prev" : null,
      results: { assets: paginatedAssets },
    });
    setTotalPages(Math.ceil(filteredAssets.length / itemsPerPage));
    setIsLoading(false);
  }, [currentPage, searchQuery, showAvailable, showDeprecated]);

  const handleRowClick = (asset: Asset) => {
    setSelectedAsset(asset);
    setIsModalOpen(true);
    setIsTableModalOpen(true);
  };

  const handleDelete = () => {
    setIsDeleteDialogOpen(true);
  };

  const confirmDelete = () => {
    toast.error("Delete asset functionality is disabled in static mode.");
    setIsDeleteDialogOpen(false);
    setIsModalOpen(false);
    setSelectedAsset(null);
    setIsTableModalOpen(false);
  };

  const handlePageChange = (newPage: number) => {
    setSearchParams({ page: newPage.toString() });
  };

  if (isLoading) return <SkeletonLoader />;
  if (error) return <p className="text-red-600">Error: {error}</p>;

  const assets = data?.results?.assets || [];
  const hasNextPage = !!data?.next;
  const hasPreviousPage = !!data?.previous;

  return (
    <div className="relative">
      <div
        className={`overflow-x-auto pb-6 ${isModalOpen || isTableModalOpen ? "blur-md" : ""}`}
      >
        <table className="min-w-full bg-white shadow-md overflow-hidden text-xs sm:text-sm">
          <thead className="bg-blue-400 text-white">
            <tr>
              {headers.map((header, index) => (
                <th
                  key={header}
                  className={`py-2 px-2 sm:py-4 sm:px-4 text-left font-semibold ${index === 2 ? "hidden sm:table-cell" : ""}`}
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
                      <svg
                        className="w-8 h-8 text-yellow-400"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        viewBox="0 0 24 24"
                      >
                        <rect x="3" y="7" width="18" height="13" rx="2" stroke="currentColor" strokeWidth="2" fill="none" />
                        <path d="M9 21V7M15 21V7M3 7h18" stroke="currentColor" strokeWidth="2" />
                      </svg>
                    </div>
                    <h2 className="text-lg font-semibold text-gray-800 mb-1">No assets found</h2>
                    <p className="text-gray-500 mb-6 text-center max-w-xs">
                      All your assets will show up here. Add a new asset to get started.
                    </p>
                    <Button onClick={() => setIsTableModalOpen(true)}>Add Asset</Button>
                  </div>
                </td>
              </tr>
            ) : (
              assets.map((asset) => (
                <tr key={asset.id} className="hover:bg-gray-100">
                  <td className="py-2 px-2 sm:py-5 sm:px-4 border-b border-gray-200 text-xs sm:text-sm text-gray-700 max-w-[12ch] truncate">
                    {asset.name}
                  </td>
                  <td className="py-2 px-2 sm:py-5 sm:px-4 border-b border-gray-200 text-xs sm:text-sm text-gray-700">
                    ₦ {new Intl.NumberFormat("en-NG", { useGrouping: true }).format(asset.value)}
                  </td>
                  <td className="py-2 px-2 sm:py-5 sm:px-4 border-b border-gray-200 text-xs sm:text-sm text-gray-700 hidden sm:table-cell">
                    {asset.expected_lifespan}
                  </td>
                  <td className="py-2 px-2 sm:py-5 sm:px-4 border-b border-gray-200 text-xs sm:text-sm text-gray-700">
                    <span className="inline-flex items-center px-1.5 py-0.5 sm:px-2.5 rounded-full text-xs font-medium">
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
        <span className="mx-4 text-md">Page {currentPage} of {totalPages}</span>
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
        onModalStateChange={(isOpen) => {setIsTableModalOpen(isOpen);}}
      />
    </div>
  );
};

export default AssetsTable;