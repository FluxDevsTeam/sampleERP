import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useParams } from "react-router-dom";
import axios from "axios";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter} from "@/components/ui/card";
import AddRecordPopup from "./AddRecordPopUp";
import EditRecordPopup from "./EditRecordPopUp";
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

interface SalaryWorkerRecord {
  id: number;
  report: string;
  date: string;
  worker: {
    id: number;
    first_name: string;
    last_name: string;
  };
}

const SalaryWorkerRecords = () => {
  const { id } = useParams<{ id: string }>();
  const queryClient = useQueryClient();
  const [isAddPopupOpen, setIsAddPopupOpen] = useState(false);
  const [isEditPopupOpen, setIsEditPopupOpen] = useState(false);
  const [selectedRecord, setSelectedRecord] = useState<SalaryWorkerRecord | null>(null);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false); // State for delete confirmation popup
  const [recordToDelete, setRecordToDelete] = useState<number | null>(null); // Track which record to delete

  const fetchRecords = async () => {
    const response = await axios.get(
      `https://kidsdesigncompany.pythonanywhere.com/api/salary-workers/${id}/record/`
    );
    return response.data.results;
  };

  const { data: records, isLoading, error } = useQuery({
    queryKey: ["salary-worker-records", id],
    queryFn: fetchRecords,
  });

  const deleteRecordMutation = useMutation({
    mutationFn: async (recordId: number) => {
      await axios.delete(
        `https://kidsdesigncompany.pythonanywhere.com/api/salary-workers/${id}/record/${recordId}/`
      );
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["salary-worker-records", id] });
      toast.success("Record deleted successfully!");
      setIsDeleteDialogOpen(false); // Close the confirmation popup
    },
    onError: () => {
      toast.error("Failed to delete record. Please try again.");
    },
  });

  const handleDeleteRecord = (recordId: number) => {
    setRecordToDelete(recordId); // Set the record to delete
    setIsDeleteDialogOpen(true); // Open the confirmation popup
  };

  const confirmDelete = () => {
    if (recordToDelete !== null) {
      deleteRecordMutation.mutate(recordToDelete); // Perform the deletion
    }
  };

  const handleEditRecord = (record: SalaryWorkerRecord) => {
    setSelectedRecord(record);
    setIsEditPopupOpen(true);
  };

  if (isLoading) return <p>Loading records...</p>;
  if (error) return <p>Error loading records: {(error as Error).message}</p>;

  return (
    <div className="container mx-auto p-4">
      
      <div className="max-w-md mx-auto font-bold text-2xl p-4">  Salary Wokers Records</div>
      <Button onClick={() => setIsAddPopupOpen(true)} className="mt-4">
        Add Record
      </Button>

      <div className="mt-4">
        {records?.map((record: SalaryWorkerRecord) => (
          <Card key={record.id} className="mb-4 shadow-md hover:shadow-lg transition-shadow duration-200">
            <CardContent className="p-4 ">
              <p className="text-sm text-gray-500">
                Name: {`${record.worker.first_name} ${record.worker.last_name}`}
              </p>
              <p className="font-medium">Report: {record.report}</p>
              <p className="text-sm text-gray-500">Date: {record.date}</p>
            </CardContent>
            <CardFooter className="flex justify-end gap-2">
              <Button variant="outline" onClick={() => handleEditRecord(record)}>
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
        salaryWorkerId={id!}
      />

      {/* Edit Record Popup */}
      {selectedRecord && (
        <EditRecordPopup
          isOpen={isEditPopupOpen}
          onClose={() => setIsEditPopupOpen(false)}
          salaryWorkerId={id!}
          record={selectedRecord}
        />
      )}

      {/* Delete Confirmation Popup */}
      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. It will permanently delete the record.
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

export default SalaryWorkerRecords;