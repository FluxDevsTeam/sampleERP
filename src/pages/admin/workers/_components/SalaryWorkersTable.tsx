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
  fetchSalaryWorkers,
  deleteWorker,
  SalaryWorker,
  PaginatedSalaryWorkersResponse,
} from "../_api/apiService";
// import EditSalaryWorkerModal from "../_pages/_salaryWorkers/EditSalaryWorker"; // No longer needed


interface SalaryWorkersTableProps {
  headers: string[];
  searchQuery: string;
  statusFilter: boolean | undefined;
  isTableModalOpen: boolean;
}

const SalaryWorkersTable = ({
  headers,
  searchQuery,
  statusFilter,
  isTableModalOpen,
}: SalaryWorkersTableProps) => {
  const queryClient = useQueryClient();
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();
  const currentUserRole = localStorage.getItem("user_role");
  const isCEO = currentUserRole === "ceo";

  const currentPage = parseInt(searchParams.get("page") || "1", 10);
  const [selectedWorker, setSelectedWorker] = useState<SalaryWorker | null>(null);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  // const [isEditModalOpen, setIsEditModalOpen] = useState(false); // No longer needed
  const [totalPages, setTotalPages] = useState(1);
  const [previewImage, setPreviewImage] = useState<string | null>(null);

  const { data, isLoading, error } = useQuery<PaginatedSalaryWorkersResponse>({ 
    queryKey: ["salaryWorkers", currentPage, searchQuery, statusFilter], // Specific query key
    queryFn: () => fetchSalaryWorkers(currentPage, searchQuery, statusFilter),
  });

  useEffect(() => {
    if (data?.count) {
      const itemsPerPage = 10;
      setTotalPages(Math.ceil(data.count / itemsPerPage));
    }
  }, [data]);

  const deleteWorkerMutation = useMutation({
    mutationFn: async (id: number) => { // Removed type as it's specific to salary now
      await deleteWorker(id, 'salary'); // Always delete as salary worker
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["salaryWorkers"] }); // Invalidate specific query
      setIsDeleteDialogOpen(false);
      setIsViewModalOpen(false);
      toast.success("Salary worker deleted successfully!");
    },
    onError: (error) => {
      console.error("Delete error:", error);
      toast.error("Failed to delete salary worker. Please try again.");
    },
  });

  const handleRowClick = (worker: SalaryWorker) => {
    setSelectedWorker(worker);
    setIsViewModalOpen(true);
  };

  const handleDelete = () => {
    setIsDeleteDialogOpen(true);
  };

  const handleEdit = () => {
    if (selectedWorker?.id) {
      setIsViewModalOpen(false);
      navigate(`/admin/edit-worker/${selectedWorker.id}`);
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
          "salaryWorkers",
          nextPage,
          searchQuery,
          statusFilter,
        ],
        queryFn: () =>
          fetchSalaryWorkers(nextPage, searchQuery, statusFilter),
      });
    }
  }, [currentPage, queryClient, totalPages, searchQuery, statusFilter]);

  if (isLoading) return <SkeletonLoader />;
  if (error)
    return <p className="text-red-600">Error: {(error as Error).message}</p>;

  const workers: SalaryWorker[] = data?.results?.workers || [];
  const hasNextPage = !!data?.next;
  const hasPreviousPage = !!data?.previous;

  const formatNumber = (num: number) => {
    return new Intl.NumberFormat('en-NG', { useGrouping: true }).format(num);
  };

  return (
    <div className="relative">
      {/* Removed the 'Add Salary Worker' button from here */}
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
            {workers.length === 0 ? (
              <tr>
                <td colSpan={headers.length} className="text-center py-4">
                  No salary workers found.
                </td>
              </tr>
            ) : (
              workers.map((worker: SalaryWorker) => (
                <tr
                  key={worker.id}
                  className="hover:bg-gray-100"
                >
                  <td className="py-5 px-4 border-b border-gray-200 text-sm text-gray-700">
                    {worker.first_name}
                  </td>
                  <td className="py-5 px-4 border-b border-gray-200 text-sm text-gray-700">
                    {worker.last_name}
                  </td>
                  <td className="py-5 px-4 border-b border-gray-200 text-sm text-gray-700">
                    {worker.is_still_active ? 'Active' : 'Not Active'}
                  </td>
                  <td className="py-5 px-4 border-b border-gray-200 text-sm text-gray-700">
                    {new Date(worker.date_joined).toLocaleDateString()}
                  </td>
                  <td className="py-5 px-4 border-b border-gray-200 text-sm text-gray-700">
                    {`₦ ${formatNumber(parseFloat(worker.salary ?? '0'))}`}
                  </td>
                  <td className="py-4 px-4 border-b border-gray-200 text-sm text-gray-700">
                    <button
                      onClick={() => handleRowClick(worker)}
                      className="px-3 py-1 text-blue-400 border-2 border-blue-400 rounded"
                    >
                      View
                    </button>
                  </td>
                  <td className="py-4 px-4 border-b border-gray-200 text-sm text-gray-700">
                    <button
                      onClick={() => navigate(`/admin/salary-workers/${worker.id}/records`)}
                      className="px-3 py-1 text-green-400 border-2 border-green-400 rounded hover:bg-green-300 hover:text-white transition-colors"
                    >
                      Record
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

      {/* View Salary Worker Modal */}
      <Dialog open={isViewModalOpen} onOpenChange={setIsViewModalOpen}>
        <DialogContent className="sm:max-w-2xl max-w-2xl">
          <DialogHeader>
            <DialogTitle>Salary Worker Details</DialogTitle>
            <DialogDescription>View all details for the selected salary worker.</DialogDescription>
          </DialogHeader>

          {selectedWorker && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 py-4">
              {/* LEFT COLUMN */}
              <div className="flex flex-col gap-4">
                <div><span className="font-medium">First Name:</span> <span className="ml-2">{selectedWorker.first_name}</span></div>
                <div><span className="font-medium">Last Name:</span> <span className="ml-2">{selectedWorker.last_name}</span></div>
                <div><span className="font-medium">Email:</span> <span className="ml-2">{selectedWorker.email || 'N/A'}</span></div>
                <div><span className="font-medium">Phone Number:</span> <span className="ml-2">{selectedWorker.phone_number || 'N/A'}</span></div>
                <div><span className="font-medium">Address:</span> <span className="ml-2">{selectedWorker.address || 'N/A'}</span></div>
                <div><span className="font-medium">Craft Specialty:</span> <span className="ml-2">{selectedWorker.craft_specialty || 'N/A'}</span></div>
                <div><span className="font-medium">Years of Experience:</span> <span className="ml-2">{selectedWorker.years_of_experience ?? 'N/A'}</span></div>
                <div>
                  <span className="font-medium">Image:</span>
                  <span className="ml-2">
                    {selectedWorker.image ? (
                      <img
                        src={selectedWorker.image}
                        alt="Worker"
                        className="h-16 w-16 object-cover rounded cursor-pointer border border-gray-300"
                        onClick={() => setPreviewImage(selectedWorker.image!)}
                      />
                    ) : 'No image'}
                  </span>
                </div>
              </div>
              {/* RIGHT COLUMN */}
              <div className="flex flex-col gap-4">
                <div><span className="font-medium">Status:</span> <span className="ml-2 capitalize">{selectedWorker.is_still_active ? 'Active' : 'Not Active'}</span></div>
                <div><span className="font-medium">Date Joined:</span> <span className="ml-2">{selectedWorker.date_joined ? new Date(selectedWorker.date_joined).toLocaleDateString() : 'N/A'}</span></div>
                <div><span className="font-medium">Date Left:</span> <span className="ml-2">{selectedWorker.date_left ? new Date(selectedWorker.date_left).toLocaleDateString() : 'N/A'}</span></div>
                <div><span className="font-medium">Salary Amount:</span> <span className="ml-2">₦ {formatNumber(parseFloat(selectedWorker.salary ?? '0'))}</span></div>
                <div><span className="font-medium">Guarantor Name:</span> <span className="ml-2">{selectedWorker.guarantor_name || 'N/A'}</span></div>
                <div><span className="font-medium">Guarantor Phone Number:</span> <span className="ml-2">{selectedWorker.guarantor_phone_number || 'N/A'}</span></div>
                <div><span className="font-medium">Guarantor Address:</span> <span className="ml-2">{selectedWorker.guarantor_address || 'N/A'}</span></div>
                <div>
                  <span className="font-medium">Agreement Form Image:</span>
                  <span className="ml-2">
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
            </div>
          )}

          <DialogFooter>
            <div className="flex justify-around items-center w-full">
              {isCEO && (
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
            </div>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      {/* Edit Salary Worker Modal */}
      {/* This modal is no longer needed as edit navigates to a new page */}
      {/*
      {selectedWorker && (
        <EditSalaryWorkerModal
          isOpen={isEditModalOpen}
          onClose={() => setIsEditModalOpen(false)}
          workerData={selectedWorker}
        />
      )}
      */}

      {/* Delete Confirmation Dialog */}
      <AlertDialog
        open={isDeleteDialogOpen}
        onOpenChange={setIsDeleteDialogOpen}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the
              salary worker from our servers.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={confirmDelete}>
              Continue
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

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

export default SalaryWorkersTable;