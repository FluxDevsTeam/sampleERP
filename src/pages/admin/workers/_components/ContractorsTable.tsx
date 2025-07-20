import { useState, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useSearchParams, useNavigate } from "react-router-dom";
import axios from "axios";
import PaginationComponent from "./Pagination";
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
import { toast } from "sonner";
import SkeletonLoader from "./SkeletonLoader";
import {
  fetchContractors, // Use the new fetchContractors function
  deleteWorker,
  Contractor,
  PaginatedContractorsResponse, // Use the new paginated response interface
} from "../_api/apiService";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowLeft, faArrowRight, faAnglesLeft, faAnglesRight } from "@fortawesome/free-solid-svg-icons";
// import EditContractorModal from "../_pages/_contractors/EditContractor"; // No longer needed

interface ContractorsTableProps {
  headers: string[];
  searchQuery: string;
  statusFilter: boolean | undefined;
  isTableModalOpen: boolean;
}

const ContractorsTable = ({
  headers,
  searchQuery,
  statusFilter,
  isTableModalOpen,
}: ContractorsTableProps) => {
  const queryClient = useQueryClient();
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();
  const currentUserRole = localStorage.getItem("user_role");
  const isceo = currentUserRole === "ceo";

  const currentPage = parseInt(searchParams.get("page") || "1", 10);
  const [selectedWorker, setSelectedWorker] = useState<Contractor | null>(null);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [totalPages, setTotalPages] = useState(1);
  const [previewImage, setPreviewImage] = useState<string | null>(null);

  const { data, isLoading, error } = useQuery<PaginatedContractorsResponse>({ 
    queryKey: ["contractors", currentPage, searchQuery, statusFilter], // Specific query key
    queryFn: () => fetchContractors(currentPage, searchQuery, statusFilter),
  });

  useEffect(() => {
    if (data?.count) {
      const itemsPerPage = 10;
      setTotalPages(Math.ceil(data.count / itemsPerPage));
    }
  }, [data]);

  const deleteWorkerMutation = useMutation({
    mutationFn: async (id: number) => { // Removed type as it's specific to contractor now
      await deleteWorker(id, 'contractor'); // Always delete as contractor worker
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["contractors"] }); // Invalidate specific query
      setIsDeleteDialogOpen(false);
      setIsViewModalOpen(false);
      toast.success("Contractor deleted successfully!");
    },
    onError: (error) => {
      console.error("Delete error:", error);
      toast.error("Failed to delete contractor. Please try again.");
    },
  });

  const handleRowClick = (worker: Contractor) => {
    setSelectedWorker(worker);
    setIsViewModalOpen(true);
  };

  const handleDelete = () => {
    setIsDeleteDialogOpen(true);
  };

  const handleEdit = () => {
    if (selectedWorker?.id) {
      setIsViewModalOpen(false);
      navigate(`/admin/edit-contractor/${selectedWorker.id}`);
    }
  };

  const confirmDelete = () => {
    if (selectedWorker?.id) {
      deleteWorkerMutation.mutate(selectedWorker.id);
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
          "contractors",
          nextPage,
          searchQuery,
          statusFilter,
        ],
        queryFn: () =>
          fetchContractors(nextPage, searchQuery, statusFilter),
      });
    }
  }, [currentPage, queryClient, totalPages, searchQuery, statusFilter]);

  if (isLoading) return <SkeletonLoader />;
  if (error)
    return <p className="text-red-600">Error: {(error as Error).message}</p>;

  const workers: Contractor[] = data?.results?.contractor || [];
  const hasNextPage = !!data?.next;
  const hasPreviousPage = !!data?.previous;

  const formatNumber = (num: number) => {
    return new Intl.NumberFormat('en-NG', { useGrouping: true }).format(num);
  };

  return (
    <div className="relative">
      <div
        className={`overflow-x-auto pb-2 md:pb-6 ${isViewModalOpen || isTableModalOpen || isDeleteDialogOpen ? "blur-md" : ""}`}
      >
        <table className="min-w-full bg-white shadow-md rounded-lg overflow-hidden text-xs sm:text-sm">
          <thead className="bg-blue-400 text-white">
            <tr>
              {headers.map((header, index) => {
                if (header === 'Details' && headers.includes('Record')) return null;
                if (header === 'Record') {
                  return [
                    <th key="Record" className={`py-2 px-2 sm:py-4 sm:px-4 text-left font-semibold hidden sm:table-cell`}>Record</th>,
                    <th key="Details" className={`py-2 px-2 sm:py-4 sm:px-4 text-left font-semibold`}>Details</th>
                  ];
                }
                if (header !== 'Details') {
                  return (
                    <th key={header} className={`py-2 px-2 sm:py-4 sm:px-4 text-left font-semibold ${index > 2 && index !== 4 ? 'hidden sm:table-cell' : ''}`}>{header}</th>
                  );
                }
                return null;
              })}
            </tr>
          </thead>
          <tbody>
            {workers.length === 0 || !Array.isArray(workers) ? (
              <tr>
                <td colSpan={headers.length} className="p-0">
                  <div className="flex flex-col items-center justify-center py-6 bg-white rounded-lg border border-gray-200 shadow-sm m-2">
                    <div className="flex items-center justify-center w-16 h-16 rounded-full bg-yellow-50 mb-4">
                      {/* User icon */}
                      <svg className="w-8 h-8 text-yellow-400" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                        <circle cx="12" cy="8" r="4" stroke="currentColor" strokeWidth="2" fill="none" />
                        <path d="M4 20c0-4 4-7 8-7s8 3 8 7" stroke="currentColor" strokeWidth="2" />
                      </svg>
                    </div>
                    <h2 className="text-lg font-semibold text-gray-800 mb-1">No contractors found</h2>
                    <p className="text-gray-500 mb-6 text-center max-w-xs">All your contractors will show up here. Add a new contractor to get started.</p>
                  </div>
                </td>
              </tr>
            ) : (
              workers.map((worker: Contractor) => (
                <tr
                  key={worker.id}
                  className="hover:bg-gray-50 cursor-pointer"
                  onClick={() => handleRowClick(worker)}
                >
                  <td className="py-2 px-2 sm:py-3 sm:px-4 border-b border-gray-200 text-xs sm:text-sm text-gray-700">
                    <span className="text-sm sm:text-base font-medium text-black break-words hyphens-auto whitespace-pre-line">{worker.first_name}</span>
                  </td>
                  <td className="py-2 px-2 sm:py-3 sm:px-4 border-b border-gray-200 text-xs sm:text-sm text-gray-700">
                    <span className="text-sm sm:text-base font-medium text-black break-words hyphens-auto whitespace-pre-line">{worker.last_name}</span>
                  </td>
                  {/* Status column always visible */}
                  <td className="py-2 px-2 sm:py-3 sm:px-4 border-b border-gray-200 text-xs sm:text-sm text-gray-700">
                    {worker.is_still_active ? 'Active' : 'Not Active'}
                  </td>
                  {/* Date Joined hidden on mobile */}
                  <td className="py-2 px-2 sm:py-3 sm:px-4 border-b border-gray-200 text-xs sm:text-sm text-gray-700 hidden sm:table-cell">
                    {new Date(worker.date_joined).toLocaleDateString()}
                  </td>
                  {/* Record column hidden on mobile - moved before Details */}
                  <td className="py-2 px-2 sm:py-3 sm:px-4 border-b border-gray-200 text-xs sm:text-sm text-gray-700 hidden sm:table-cell">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        navigate(`/admin/contractors/${worker.id}/records`);
                      }}
                      className="px-3 py-1 text-green-400 border-2 border-green-400 rounded hover:bg-green-300 hover:text-white transition-colors"
                    >
                      Record
                    </button>
                  </td>
                  {/* Details column always visible - moved after Record */}
                  <td className="py-2 px-2 sm:py-3 sm:px-4 border-b border-gray-200 text-xs sm:text-sm text-gray-700">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleRowClick(worker);
                      }}
                      className="px-3 py-1 text-blue-400 border-2 border-blue-400 rounded"
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

      <div className="flex justify-center items-center mt-2 gap-2">
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

      <Dialog open={isViewModalOpen} onOpenChange={setIsViewModalOpen}>
        <DialogContent className="sm:max-w-2xl max-w-2xl">
          <DialogHeader>
            <DialogTitle>Contractor Details</DialogTitle>
            <DialogDescription>View all details for the selected contractor.</DialogDescription>
          </DialogHeader>
          {selectedWorker && (
            <div className="grid grid-cols-2 gap-2 bg-white border border-gray-200 rounded-lg p-2 sm:p-4 mb-4 shadow max-h-[75vh] overflow-y-auto">
              <div className="flex flex-col gap-1">
                <span className="text-xs font-semibold text-black uppercase">First Name</span>
                <span className="text-sm sm:text-base font-medium text-black break-words hyphens-auto whitespace-pre-line">{selectedWorker.first_name}</span>
              </div>
              <div className="flex flex-col gap-1">
                <span className="text-xs font-semibold text-black uppercase">Last Name</span>
                <span className="text-sm sm:text-base font-medium text-black break-words hyphens-auto whitespace-pre-line">{selectedWorker.last_name}</span>
              </div>
              <div className="flex flex-col gap-1">
                <span className="text-xs font-semibold text-black uppercase">Email</span>
                <span className="text-sm sm:text-base font-medium text-black break-words hyphens-auto whitespace-pre-line">{selectedWorker.email || 'N/A'}</span>
              </div>
              <div className="flex flex-col gap-1">
                <span className="text-xs font-semibold text-black uppercase">Phone Number</span>
                <span className="text-sm sm:text-base font-medium text-black break-words hyphens-auto whitespace-pre-line">{selectedWorker.phone_number || 'N/A'}</span>
              </div>
              <div className="flex flex-col gap-1">
                <span className="text-xs font-semibold text-black uppercase">Address</span>
                <span className="text-sm sm:text-base font-medium text-black break-words hyphens-auto whitespace-pre-line">{selectedWorker.address || 'N/A'}</span>
              </div>
              <div className="flex flex-col gap-1">
                <span className="text-xs font-semibold text-black uppercase">Craft Specialty</span>
                <span className="text-sm sm:text-base font-medium text-black break-words hyphens-auto whitespace-pre-line">{selectedWorker.craft_specialty || 'N/A'}</span>
              </div>
              <div className="flex flex-col gap-1">
                <span className="text-xs font-semibold text-black uppercase">Years of Experience</span>
                <span className="text-sm sm:text-base font-medium text-black break-words hyphens-auto whitespace-pre-line">{selectedWorker.years_of_experience ?? 'N/A'}</span>
              </div>
              <div className="flex flex-col gap-1">
                <span className="text-xs font-semibold text-black uppercase">Image</span>
                <span className="text-sm sm:text-base font-medium text-black break-words hyphens-auto whitespace-pre-line">
                  {selectedWorker.image ? (
                    <img
                      src={selectedWorker.image}
                      alt="Contractor"
                      className="h-16 w-16 object-cover rounded cursor-pointer border border-gray-300"
                      onClick={() => setPreviewImage(selectedWorker.image!)}
                    />
                  ) : 'No image'}
                </span>
              </div>
              <div className="flex flex-col gap-1">
                <span className="text-xs font-semibold text-black uppercase">Status</span>
                <span className="text-sm sm:text-base font-medium text-black break-words hyphens-auto whitespace-pre-line">{selectedWorker.is_still_active ? 'Active' : 'Not Active'}</span>
              </div>
              <div className="flex flex-col gap-1">
                <span className="text-xs font-semibold text-black uppercase">Date Joined</span>
                <span className="text-sm sm:text-base font-medium text-black break-words hyphens-auto whitespace-pre-line">{selectedWorker.date_joined ? new Date(selectedWorker.date_joined).toLocaleDateString() : 'N/A'}</span>
              </div>
              <div className="flex flex-col gap-1">
                <span className="text-xs font-semibold text-black uppercase">Date Left</span>
                <span className="text-sm sm:text-base font-medium text-black break-words hyphens-auto whitespace-pre-line">{selectedWorker.date_left ? new Date(selectedWorker.date_left).toLocaleDateString() : 'N/A'}</span>
              </div>
              <div className="flex flex-col gap-1">
                <span className="text-xs font-semibold text-black uppercase">Guarantor Name</span>
                <span className="text-sm sm:text-base font-medium text-black break-words hyphens-auto whitespace-pre-line">{selectedWorker.guarantor_name || 'N/A'}</span>
              </div>
              <div className="flex flex-col gap-1">
                <span className="text-xs font-semibold text-black uppercase">Guarantor Phone Number</span>
                <span className="text-sm sm:text-base font-medium text-black break-words hyphens-auto whitespace-pre-line">{selectedWorker.guarantor_phone_number || 'N/A'}</span>
              </div>
              <div className="flex flex-col gap-1">
                <span className="text-xs font-semibold text-black uppercase">Guarantor Address</span>
                <span className="text-sm sm:text-base font-medium text-black break-words hyphens-auto whitespace-pre-line">{selectedWorker.guarantor_address || 'N/A'}</span>
              </div>
              <div className="flex flex-col gap-1">
                <span className="text-xs font-semibold text-black uppercase">Agreement Form Image</span>
                <span className="text-sm sm:text-base font-medium text-black break-words hyphens-auto whitespace-pre-line">
                  {selectedWorker.agreement_form_image ? (
                    <img
                      src={selectedWorker.agreement_form_image}
                      alt="Agreement Form"
                      className="h-16 w-16 object-cover rounded cursor-pointer border border-gray-300"
                      onClick={() => setPreviewImage(selectedWorker.agreement_form_image!)}
                    />
                  ) : 'No image'}
                </span>
              </div>
            </div>
          )}
          <DialogFooter>
            <div className="flex flex-wrap justify-around items-center w-full gap-2">
              {isceo && (
                <>
                  <Button
                    onClick={handleEdit}
                    className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-green-600 transition-colors"
                  >
                    Edit
                  </Button>
                  <Button
                    onClick={handleDelete}
                    className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 transition-colors"
                  >
                    Delete
                  </Button>
                </>
              )}
              <Button
                variant="outline"
                onClick={() => setIsViewModalOpen(false)}
              >
                Close
              </Button>
              {selectedWorker && (
                <Button
                  variant="outline"
                  onClick={() => {
                    setIsViewModalOpen(false);
                    navigate(`/admin/contractors/${selectedWorker.id}/records`);
                  }}
                >
                  Record
                </Button>
              )}
            </div>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Image Preview Dialog */}
      <Dialog open={!!previewImage} onOpenChange={() => setPreviewImage(null)}>
        <DialogContent className="max-w-3xl flex flex-col items-center">
          {previewImage && (
            <img src={previewImage} alt="Preview" className="max-h-[70vh] w-auto rounded shadow-lg" />
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ContractorsTable;