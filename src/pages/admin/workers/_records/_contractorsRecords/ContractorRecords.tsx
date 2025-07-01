import { useState, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useParams, useSearchParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import AddRecordPopup from "./AddContractorsPopUp";
import EditRecordPopup from "./EditContractorsPopUp";
import PaginationComponent from "../../_components/Pagination";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowLeft } from "@fortawesome/free-solid-svg-icons";
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

interface ContractorRecord {
  id: number;
  report: string;
  date: string;
  worker: {
    id: number;
    first_name: string;
    last_name: string;
  };
}

interface PaginatedRecordsResponse {
  count: number;
  next: string | null;
  previous: string | null;
  results: ContractorRecord[];
}

const ContractorRecords = () => {
  const { id } = useParams<{ id: string }>();
  const [searchParams, setSearchParams] = useSearchParams();
  const queryClient = useQueryClient();
  const [isAddPopupOpen, setIsAddPopupOpen] = useState(false);
  const [isEditPopupOpen, setIsEditPopupOpen] = useState(false);
  const [selectedRecord, setSelectedRecord] = useState<ContractorRecord | null>(
    null
  );
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [recordToDelete, setRecordToDelete] = useState<number | null>(null);
  const navigate = useNavigate();

  // Get user role for access control
  const currentUserRole = localStorage.getItem("user_role");
  const isCEO = currentUserRole === "ceo";

  // Pagination state
  const currentPage = parseInt(searchParams.get("page") || "1", 10);
  const [totalPages, setTotalPages] = useState(1);

  const fetchRecords = async () => {
    const token = localStorage.getItem("accessToken");
    const response = await axios.get(
      `https://backend.kidsdesigncompany.com/api/contractors/${id}/record/?page=${currentPage}`,
      {
        headers: {
          Authorization: `JWT ${token}`,
        },
      }
    );
    return response.data;
  };

  const {
    data: recordsData,
    isLoading,
    error,
  } = useQuery<PaginatedRecordsResponse>({
    queryKey: ["contractor-records", id, currentPage],
    queryFn: fetchRecords,
  });

  // Update total pages when data changes
  useEffect(() => {
    if (recordsData?.count) {
      const itemsPerPage = 10;
      setTotalPages(Math.ceil(recordsData.count / itemsPerPage));
    }
  }, [recordsData]);

  const deleteRecordMutation = useMutation({
    mutationFn: async (recordId: number) => {
      const token = localStorage.getItem("accessToken");
      await axios.delete(
        `https://backend.kidsdesigncompany.com/api/contractors/${id}/record/${recordId}/`,
        {
          headers: {
            Authorization: `JWT ${token}`,
          },
        }
      );
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["contractor-records", id, currentPage] });
      toast.success("Record deleted successfully!");
      setIsDeleteDialogOpen(false);
    },
    onError: () => {
      toast.error("Failed to delete record. Please try again.");
    },
  });

  const handleDeleteRecord = (recordId: number) => {
    setRecordToDelete(recordId);
    setIsDeleteDialogOpen(true);
  };

  const confirmDelete = () => {
    if (recordToDelete !== null) {
      deleteRecordMutation.mutate(recordToDelete);
    }
  };

  const handleEditRecord = (record: ContractorRecord) => {
    setSelectedRecord(record);
    setIsEditPopupOpen(true);
  };

  const handlePageChange = (newPage: number) => {
    setSearchParams({ page: newPage.toString() });
  };

  if (isLoading) return <p>Loading records...</p>;
  if (error) return <p>Error loading records: {(error as Error).message}</p>;

  const records = recordsData?.results || [];
  const hasNextPage = !!recordsData?.next;
  const hasPreviousPage = !!recordsData?.previous;

  return (
    <div className="container mx-auto p-4">
      <div className="max-w-md mx-auto font-bold md:text-3xl p-4">
        Contractor Records
      </div>
      <div className="flex justify-between items-center">
        <Button onClick={() => navigate(-1)} variant="outline" className="flex items-center gap-2">
          <FontAwesomeIcon icon={faArrowLeft} />
          Back
        </Button>
        <Button onClick={() => setIsAddPopupOpen(true)}>Add Record</Button>
      </div>

      <div className="mt-4">
        {records.length === 0 ? (
          <div className="text-center py-8">
            <p className="text-gray-500 text-lg">No records found for this contractor.</p>
            <p className="text-gray-400 text-sm mt-2">Click "Add Record" to create the first record.</p>
          </div>
        ) : (
          records.map((record: ContractorRecord) => (
            <Card
              key={record.id}
              className="mb-4 mb-4 shadow-md hover:shadow-lg transition-shadow duration-200"
            >
              <CardContent className="p-4 space-y-5">
                <p className="text-sm text-gray-500">
                  Contractor:{" "}
                  {`${record.worker.first_name} ${record.worker.last_name}`}
                </p>
                <p className="font-medium">Report: {record.report}</p>
                <p className="text-sm text-gray-500">Date: {record.date}</p>
              </CardContent>
              <CardFooter className="flex justify-end gap-2">
                {isCEO && (
                  <>
                    <Button
                      variant="outline"
                      onClick={() => handleEditRecord(record)}
                    >
                      Edit
                    </Button>
                    <Button
                      variant="destructive"
                      onClick={() => handleDeleteRecord(record.id)}
                      disabled={deleteRecordMutation.isPending}
                    >
                      Delete
                    </Button>
                  </>
                )}
              </CardFooter>
            </Card>
          ))
        )}
      </div>

      {/* Pagination */}
      {records.length > 0 && (
        <div className="flex justify-center items-center mt-6 mb-28 gap-2">
          <PaginationComponent
            currentPage={currentPage}
            totalPages={totalPages}
            hasNextPage={hasNextPage}
            hasPreviousPage={hasPreviousPage}
            handlePageChange={handlePageChange}
          />
        </div>
      )}

      {/* Add Record Popup */}
      <AddRecordPopup
        isOpen={isAddPopupOpen}
        onClose={() => setIsAddPopupOpen(false)}
        contractorId={id!}
      />

      {/* Edit Record Popup */}
      {selectedRecord && (
        <EditRecordPopup
          key={selectedRecord.id} // Force re-render
          isOpen={isEditPopupOpen}
          onClose={() => {
            setIsEditPopupOpen(false);
            setSelectedRecord(null); // Reset selected record
          }}
          contractorId={id!}
          record={selectedRecord}
        />
      )}

      {/* Delete Confirmation Popup */}
      <AlertDialog
        open={isDeleteDialogOpen}
        onOpenChange={setIsDeleteDialogOpen}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. It will permanently delete the
              record.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => setIsDeleteDialogOpen(false)}>
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction onClick={confirmDelete}>
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default ContractorRecords;
