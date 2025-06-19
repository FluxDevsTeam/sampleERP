import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useParams } from "react-router-dom";
import axios from "axios";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import AddRecordPopup from "./AddContractorsPopUp";
import EditRecordPopup from "./EditContractorsPopUp";
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

const ContractorRecords = () => {
  const { id } = useParams<{ id: string }>();
  const queryClient = useQueryClient();
  const [isAddPopupOpen, setIsAddPopupOpen] = useState(false);
  const [isEditPopupOpen, setIsEditPopupOpen] = useState(false);
  const [selectedRecord, setSelectedRecord] = useState<ContractorRecord | null>(
    null
  );
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [recordToDelete, setRecordToDelete] = useState<number | null>(null);

  const fetchRecords = async () => {
    const token = localStorage.getItem("accessToken");
    const response = await axios.get(
      `https://backend.kidsdesigncompany.com/api/contractors/${id}/record/`,
      {
        headers: {
          Authorization: `JWT ${token}`,
        },
      }
    );
    return response.data.results;
  };

  const {
    data: records,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["contractor-records", id],
    queryFn: fetchRecords,
  });

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
      queryClient.invalidateQueries({ queryKey: ["contractor-records", id] });
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

  if (isLoading) return <p>Loading records...</p>;
  if (error) return <p>Error loading records: {(error as Error).message}</p>;

  return (
    <div className="container mx-auto p-4">
      <div className="max-w-md mx-auto font-bold md:text-3xl p-4">
        Contractor Records
      </div>
      <Button onClick={() => setIsAddPopupOpen(true)}>Add Record</Button>

      <div className="mt-4">
        {records?.map((record: ContractorRecord) => (
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
              <Button
                variant="outline"
                onClick={() => handleEditRecord(record)}
              >
                Edit
              </Button>
              <Button
                variant="destructive"
                onClick={() => handleDeleteRecord(record.id)}
              >
                Delete
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>

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
