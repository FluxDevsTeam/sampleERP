import { useState, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useSearchParams } from "react-router-dom";
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
  fetchSalaryWorkers,
  fetchContractors,
  deleteWorker,
  SalaryWorker,
  Contractor,
  PaginatedSalaryWorkersResponse,
  PaginatedContractorsResponse
} from "../../../../utils/jsonDataService";

interface WorkersTableProps {
  headers: string[];
  searchQuery: string;
  statusFilter: string | undefined;
  isTableModalOpen: boolean;
}

const WorkersTable = ({
  headers,
  searchQuery,
  statusFilter,
  isTableModalOpen,
}: WorkersTableProps) => {
  const queryClient = useQueryClient();
  const [searchParams, setSearchParams] = useSearchParams();
  const currentUserRole = localStorage.getItem("user_role");
  const isCEO = currentUserRole === "ceo";

  const currentPage = parseInt(searchParams.get("page") || "1", 10);
  const [selectedWorker, setSelectedWorker] = useState<SalaryWorker | Contractor | null>(null);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [totalPages, setTotalPages] = useState(1);

  // Choose which data to fetch based on worker type (salary or contractor)
  // For demonstration, let's fetch salary workers by default
  const { data, isLoading, error } = useQuery<PaginatedSalaryWorkersResponse>({
    queryKey: ["salary-workers", currentPage, searchQuery, statusFilter],
    queryFn: () => fetchSalaryWorkers(currentPage, searchQuery, statusFilter),
  });

  useEffect(() => {
    if (data?.count) {
      const itemsPerPage = 10;
      setTotalPages(Math.ceil(data.count / itemsPerPage));
    }
  }, [data]);

  const deleteWorkerMutation = useMutation({
    mutationFn: async ({ id, type }: { id: number; type: 'salary' | 'contractor' }) => {
      await deleteWorker(id, type);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["workers"] });
      setIsDeleteDialogOpen(false);
      setIsViewModalOpen(false);
      toast.success("Worker deleted successfully!");
    },
    onError: (error) => {
      console.error("Delete error:", error);
      toast.error("Failed to delete worker. Please try again.");
    },
  });

  const handleRowClick = (worker: SalaryWorker | Contractor) => {
    setSelectedWorker(worker);
    setIsViewModalOpen(true);
  };

  const handleDelete = () => {
    setIsDeleteDialogOpen(true);
  };

  const confirmDelete = () => {
    if (selectedWorker?.id) {
      // Determine type based on properties unique to SalaryWorker or Contractor
      const type: 'salary' | 'contractor' = ('salary_amount' in selectedWorker) ? 'salary' : 'contractor';
      deleteWorkerMutation.mutate({ id: selectedWorker.id, type });
    }
  };

  const handlePageChange = (newPage: number) => {
    setSearchParams({ page: newPage.toString() });
  };

  useEffect(() => {
    if (currentPage < totalPages) {
      const nextPage = currentPage + 1;
      queryClient.prefetchQuery({
        queryKey: ["salary-workers", nextPage, searchQuery, statusFilter],
        queryFn: () => fetchSalaryWorkers(nextPage, searchQuery, statusFilter),
      });
    }
  }, [currentPage, queryClient, totalPages, searchQuery, statusFilter]);

  if (isLoading) return <SkeletonLoader />;
  if (error)
    return <p className="text-red-600">Error: {(error as Error).message}</p>;

  const workers = data?.results || [];
  const hasNextPage = !!data?.next;
  const hasPreviousPage = !!data?.previous;

  const formatNumber = (num: number) => {
    return new Intl.NumberFormat('en-NG', { useGrouping: true }).format(num);
  };

  return (
    <div className="relative">
      <div
        className={`overflow-x-auto pb-6 ${isViewModalOpen || isTableModalOpen || isDeleteDialogOpen ? "blur-md" : ""}`}
      >
        <table className="min-w-full bg-white shadow-md rounded-lg overflow-hidden">
          <thead className="bg-blue-400 text-white">
            <tr>
              {headers.map((header, index) => (
                <th
                  key={header}
                  className={`py-3 px-2 sm:py-4 sm:px-4 text-left text-xs sm:text-sm font-semibold ${
                    index === 3 ? 'hidden sm:table-cell' : '' // Hide salary amount on mobile
                  } ${
                    index === 4 ? 'hidden md:table-cell' : '' // Hide contract value on mobile/tablet
                  }`}
                >
                  {header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="">
            {workers.length === 0 ? (
              <tr>
                <td colSpan={headers.length} className="text-center py-6 text-gray-500 text-sm">
                  No workers found.
                </td>
              </tr>
            ) : (
              workers.map((worker) => (
                <tr
                  key={worker.id}
                  className="hover:bg-gray-100"
                >
                  <td className="py-3 px-2 sm:py-5 sm:px-4 border-b border-gray-200 text-xs sm:text-sm text-gray-700">
                    {worker.name}
                  </td>
                  <td className="py-3 px-2 sm:py-5 sm:px-4 border-b border-gray-200 text-xs sm:text-sm text-gray-700">
                    {worker.status}
                  </td>
                  <td className="py-3 px-2 sm:py-5 sm:px-4 border-b border-gray-200 text-xs sm:text-sm text-gray-700">
                    {new Date(worker.start_date).toLocaleDateString()}
                  </td>
                  <td className="py-3 px-2 sm:py-5 sm:px-4 border-b border-gray-200 text-xs sm:text-sm text-gray-700 hidden sm:table-cell">
                    {'salary_amount' in worker ? `₦ ${formatNumber(worker.salary_amount)}` : 'N/A'}
                  </td>
                  <td className="py-3 px-2 sm:py-5 sm:px-4 border-b border-gray-200 text-xs sm:text-sm text-gray-700 hidden md:table-cell">
                    {'contract_value' in worker ? `₦ ${formatNumber(worker.contract_value)}` : 'N/A'}
                  </td>
                  <td className="py-3 px-2 sm:py-5 sm:px-4 border-b border-gray-200 text-xs sm:text-sm text-gray-700">
                    <button
                      onClick={() => handleRowClick(worker)}
                      className="px-2 py-1 sm:px-3 sm:py-1 text-blue-400 border-2 border-blue-400 rounded text-xs sm:text-sm"
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

      <div className="flex justify-center items-center mb-28 gap-2">
        <PaginationComponent
          currentPage={currentPage}
          totalPages={totalPages}
          hasNextPage={hasNextPage}
          hasPreviousPage={hasPreviousPage}
          handlePageChange={handlePageChange}
        />
      </div>

      {/* View Worker Modal */}
      <Dialog open={isViewModalOpen} onOpenChange={setIsViewModalOpen}>
        <DialogContent className="w-[95vw] max-w-md mx-auto p-4 sm:p-6">
          <DialogHeader>
            <DialogTitle className="text-lg sm:text-xl">Worker Details</DialogTitle>
            <DialogDescription className="text-sm">View details for the selected worker.</DialogDescription>
          </DialogHeader>

          {selectedWorker && (
            <div className="grid gap-3 sm:gap-4 py-3 sm:py-4">
              <div className="grid grid-cols-1 sm:grid-cols-3 items-start sm:items-center gap-2 sm:gap-4">
                <span className="font-medium text-sm sm:text-base">Name:</span>
                <span className="col-span-1 sm:col-span-2 text-sm sm:text-base">{selectedWorker.name}</span>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-3 items-start sm:items-center gap-2 sm:gap-4">
                <span className="font-medium text-sm sm:text-base">Status:</span>
                <span className="col-span-1 sm:col-span-2 text-sm sm:text-base">{selectedWorker.status}</span>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-3 items-start sm:items-center gap-2 sm:gap-4">
                <span className="font-medium text-sm sm:text-base">Start Date:</span>
                <span className="col-span-1 sm:col-span-2 text-sm sm:text-base">{new Date(selectedWorker.start_date).toLocaleDateString()}</span>
              </div>
              {'end_date' in selectedWorker && selectedWorker.end_date && (
                <div className="grid grid-cols-1 sm:grid-cols-3 items-start sm:items-center gap-2 sm:gap-4">
                  <span className="font-medium text-sm sm:text-base">End Date:</span>
                  <span className="col-span-1 sm:col-span-2 text-sm sm:text-base">{new Date(selectedWorker.end_date).toLocaleDateString()}</span>
                </div>
              )}
              {'salary_amount' in selectedWorker && (
                <div className="grid grid-cols-1 sm:grid-cols-3 items-start sm:items-center gap-2 sm:gap-4">
                  <span className="font-medium text-sm sm:text-base">Salary Amount:</span>
                  <span className="col-span-1 sm:col-span-2 text-sm sm:text-base">₦ {formatNumber(selectedWorker.salary_amount)}</span>
                </div>
              )}
              {'position' in selectedWorker && (
                <div className="grid grid-cols-1 sm:grid-cols-3 items-start sm:items-center gap-2 sm:gap-4">
                  <span className="font-medium text-sm sm:text-base">Position:</span>
                  <span className="col-span-1 sm:col-span-2 text-sm sm:text-base">{selectedWorker.position}</span>
                </div>
              )}
              {'contract_value' in selectedWorker && (
                <div className="grid grid-cols-1 sm:grid-cols-3 items-start sm:items-center gap-2 sm:gap-4">
                  <span className="font-medium text-sm sm:text-base">Contract Value:</span>
                  <span className="col-span-1 sm:col-span-2 text-sm sm:text-base">₦ {formatNumber(selectedWorker.contract_value)}</span>
                </div>
              )}
              {'contract_type' in selectedWorker && (
                <div className="grid grid-cols-1 sm:grid-cols-3 items-start sm:items-center gap-2 sm:gap-4">
                  <span className="font-medium text-sm sm:text-base">Contract Type:</span>
                  <span className="col-span-1 sm:col-span-2 text-sm sm:text-base">{selectedWorker.contract_type}</span>
                </div>
              )}
            </div>
          )}

          <DialogFooter>
            <div className="flex flex-col sm:flex-row justify-around items-center w-full gap-2 sm:gap-0">
              <Button variant="outline" onClick={() => setIsViewModalOpen(false)} className="w-full sm:w-auto text-sm">
                Close
              </Button>
                <Button variant="destructive" onClick={handleDelete} disabled={deleteWorkerMutation.isPending} className="w-full sm:w-auto text-sm">
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
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. It will permanently delete the worker.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={confirmDelete}>Confirm</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default WorkersTable; 