import { useState, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useSearchParams } from "react-router-dom";
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
  fetchWorkers,
  deleteWorker,
  SalaryWorker,
  Contractor,
  PaginatedWorkersResponse,
} from "../_api/apiService";

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

  const { data, isLoading, error } = useQuery<PaginatedWorkersResponse>({ 
    queryKey: ["workers", currentPage, searchQuery, statusFilter],
    queryFn: () => fetchWorkers(currentPage, searchQuery, statusFilter),
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
        queryKey: [
          "workers",
          nextPage,
          searchQuery,
          statusFilter,
        ],
        queryFn: () =>
          fetchWorkers(nextPage, searchQuery, statusFilter),
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
            {workers.map((worker) => (
              <tr
                key={worker.id}
                className="hover:bg-gray-100"
              >
                <td className="py-5 px-4 border-b border-gray-200 text-sm text-gray-700">
                  {worker.name}
                </td>
                <td className="py-5 px-4 border-b border-gray-200 text-sm text-gray-700">
                  {worker.status}
                </td>
                <td className="py-5 px-4 border-b border-gray-200 text-sm text-gray-700">
                  {new Date(worker.start_date).toLocaleDateString()}
                </td>
                <td className="py-5 px-4 border-b border-gray-200 text-sm text-gray-700">
                  {'salary_amount' in worker ? `₦ ${formatNumber(worker.salary_amount)}` : 'N/A'}
                </td>
                <td className="py-5 px-4 border-b border-gray-200 text-sm text-gray-700">
                  {'contract_value' in worker ? `₦ ${formatNumber(worker.contract_value)}` : 'N/A'}
                </td>
                <td className="py-5 px-4 border-b border-gray-200 text-sm text-gray-700">
                  <button
                    onClick={() => handleRowClick(worker)}
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

      {/* View Worker Modal */}
      <Dialog open={isViewModalOpen} onOpenChange={setIsViewModalOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Worker Details</DialogTitle>
            <DialogDescription>View details for the selected worker.</DialogDescription>
          </DialogHeader>

          {selectedWorker && (
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-3 items-center gap-4">
                <span className="font-medium">Name:</span>
                <span className="col-span-2">{selectedWorker.name}</span>
              </div>
              <div className="grid grid-cols-3 items-center gap-4">
                <span className="font-medium">Status:</span>
                <span className="col-span-2">{selectedWorker.status}</span>
              </div>
              <div className="grid grid-cols-3 items-center gap-4">
                <span className="font-medium">Start Date:</span>
                <span className="col-span-2">{new Date(selectedWorker.start_date).toLocaleDateString()}</span>
              </div>
              {'end_date' in selectedWorker && selectedWorker.end_date && (
                <div className="grid grid-cols-3 items-center gap-4">
                  <span className="font-medium">End Date:</span>
                  <span className="col-span-2">{new Date(selectedWorker.end_date).toLocaleDateString()}</span>
                </div>
              )}
              {'salary_amount' in selectedWorker && (
                <div className="grid grid-cols-3 items-center gap-4">
                  <span className="font-medium">Salary Amount:</span>
                  <span className="col-span-2">₦ {formatNumber(selectedWorker.salary_amount)}</span>
                </div>
              )}
              {'position' in selectedWorker && (
                <div className="grid grid-cols-3 items-center gap-4">
                  <span className="font-medium">Position:</span>
                  <span className="col-span-2">{selectedWorker.position}</span>
                </div>
              )}
              {'contract_value' in selectedWorker && (
                <div className="grid grid-cols-3 items-center gap-4">
                  <span className="font-medium">Contract Value:</span>
                  <span className="col-span-2">₦ {formatNumber(selectedWorker.contract_value)}</span>
                </div>
              )}
              {'contract_type' in selectedWorker && (
                <div className="grid grid-cols-3 items-center gap-4">
                  <span className="font-medium">Contract Type:</span>
                  <span className="col-span-2">{selectedWorker.contract_type}</span>
                </div>
              )}
            </div>
          )}

          <DialogFooter>
            <div className="flex justify-around items-center w-full">
              <Button variant="outline" onClick={() => setIsViewModalOpen(false)}>
                Close
              </Button>
              {isCEO && (
                <Button variant="destructive" onClick={handleDelete} disabled={deleteWorkerMutation.isPending}>
                  Delete
                </Button>
              )}
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