import React, { useState } from "react";
import { useQuery, useQueryClient, useMutation } from "@tanstack/react-query";
import axios from "axios";
import AddPaymentModal from "./AddPaymentModal";
import { toast } from "sonner";
import SkeletonLoader from "./SkeletonLoader";
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
import EditPaymentModal from "./EditPaymentModal";

interface Entry {
  id: number;
  amount: string;
  date: string;
  salary: number;
  contract: number;
}

interface DailyData {
  date: string;
  entries: Entry[];
  daily_total: number;
}

interface PaidData {
  monthly_total: number;
  weekly_total: number;
  daily_data: DailyData[];
}

const fetchPaid = async (): Promise<PaidData> => {
  const access_token = localStorage.getItem("access_token");
  const { data } = await axios.get<PaidData>(
    "https://backend.kidsdesigncompany.com/api/paid/",
    {
      headers: {
        Authorization: `JWT ${access_token}`
      }
    }
  );
  return data;
};

const PaidTable: React.FC = () => {
  const { data, isLoading, error } = useQuery<PaidData>({ queryKey: ["paid"], queryFn: fetchPaid });
  const [collapsed, setCollapsed] = useState<{ [key: string]: boolean }>({});
  const queryClient = useQueryClient();

  // States for modals and selected entry
  const [selectedEntry, setSelectedEntry] = useState<Entry | null>(null);
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  const deletePaidMutation = useMutation({
    mutationFn: async (entryId: number) => {
      const access_token = localStorage.getItem("access_token");
      await axios.delete(
        `https://backend.kidsdesigncompany.com/api/paid/${entryId}/`,
        {
          headers: {
            Authorization: `JWT ${access_token}`
          }
        }
      );
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["paid"] });
      setIsDeleteDialogOpen(false);
      setIsDetailsModalOpen(false);
      toast.success("Payment deleted successfully!");
    },
  });

  // Handle row click to show details modal
  const handleRowClick = (entry: Entry) => {
    setSelectedEntry(entry);
    setIsDetailsModalOpen(true);
  };

  // Handle edit button click
  const handleEdit = () => {
    setIsDetailsModalOpen(false);
    setIsEditModalOpen(true);
  };

  // Handle delete button click
  const handleDelete = () => {
    setIsDeleteDialogOpen(true);
  };

  // Confirm delete
  const confirmDelete = () => {
    if (selectedEntry?.id) {
      deletePaidMutation.mutate(selectedEntry.id);
    }
  };

  // Handle successful edit
  const handleEditSuccess = () => {
    setIsEditModalOpen(false);
    setIsDetailsModalOpen(false);
  };

  const toggleCollapse = (date: string) => {
    setCollapsed((prev) => ({ ...prev, [date]: !prev[date] }));
  };

  if (isLoading) return <SkeletonLoader />;
  if (error) return <p className="text-red-600">Error: {(error as Error).message}</p>;

  return (
    <div className="p-6 flex flex-col h-full bg-white">
      <div className="flex justify-between items-center mb-6">
        <div
          onClick={() => setIsAddModalOpen(true)}
          className="cursor-pointer bg-blue-600 text-white px-6 py-3 rounded-lg shadow-md hover:text-white hover:bg-blue-400 transition duration-300"
        >
          Add Payment
        </div>
      </div>

      <div className="flex-1 overflow-auto rounded-lg shadow-sm border border-gray-200">
        <table className="min-w-full bg-white">
          <thead className="bg-gray-400">
            <tr>
              <th className="px-6 py-4 text-left text-sm font-semibold text-neutral-900 uppercase">Date</th>
              <th className="px-6 py-4 text-left text-sm font-semibold text-neutral-900 uppercase">Amount</th>
              <th className="px-6 py-4 text-left text-sm font-semibold text-neutral-900 uppercase">Salary</th>
              <th className="px-6 py-4 text-left text-sm font-semibold text-neutral-900 uppercase">Contract</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {data?.daily_data.map((day) => (
              <React.Fragment key={day.date}>
                <tr
                  className="bg-gray-100 cursor-pointer"
                  onClick={() => toggleCollapse(day.date)}
                >
                  <td className="px-6 py-4 text-sm font-semibold text-neutral-900 uppercase" colSpan={4}>
                    <div className="flex justify-between w-full">
                      <span>{day.date}</span>
                      <span>(Total: {day.daily_total})</span>
                    </div>
                  </td>
                </tr>

                {!collapsed[day.date] &&
                  day.entries.map((entry) => (
                    <tr
                      key={entry.id}
                      className="hover:bg-gray-50 transition duration-150 ease-in-out cursor-pointer"
                      onClick={() => handleRowClick(entry)}
                    >
                      <td className="px-6 py-4 text-sm text-neutral-700">{new Date(day.date).toLocaleDateString()}</td>
                      <td className="px-6 py-4 text-sm text-neutral-700">{entry.amount}</td>
                      <td className="px-6 py-4 text-sm text-neutral-700">{entry.salary}</td>
                      <td className="px-6 py-4 text-sm text-neutral-700">{entry.contract}</td>
                    </tr>
                  ))}
              </React.Fragment>
            ))}
          </tbody>
        </table>
      </div>

      <AddPaymentModal
        open={isAddModalOpen}
        onOpenChange={setIsAddModalOpen}
      />

      {/* Details Modal */}
      <Dialog open={isDetailsModalOpen} onOpenChange={setIsDetailsModalOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Payment Details</DialogTitle>
            <DialogDescription>View details for the selected payment.</DialogDescription>
          </DialogHeader>

          {selectedEntry && (
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-3 items-center gap-4">
                <span className="font-medium">Amount:</span>
                <span className="col-span-2">{selectedEntry.amount}</span>
              </div>
              <div className="grid grid-cols-3 items-center gap-4">
                <span className="font-medium">Date:</span>
                <span className="col-span-2">{new Date(selectedEntry.date).toLocaleDateString()}</span>
              </div>
              <div className="grid grid-cols-3 items-center gap-4">
                <span className="font-medium">Salary ID:</span>
                <span className="col-span-2">{selectedEntry.salary}</span>
              </div>
              <div className="grid grid-cols-3 items-center gap-4">
                <span className="font-medium">Contract ID:</span>
                <span className="col-span-2">{selectedEntry.contract}</span>
              </div>
            </div>
          )}

          <DialogFooter>
            <div className="flex justify-around items-center w-full">
              <Button variant="outline" onClick={() => setIsDetailsModalOpen(false)}>
                Close
              </Button>
              <Button variant="outline" onClick={handleEdit}>
                Edit
              </Button>
              <Button variant="destructive" onClick={handleDelete}>
                Delete
              </Button>
            </div>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit Payment Modal */}
      {selectedEntry && (
        <EditPaymentModal
          id={selectedEntry.id.toString()}
          open={isEditModalOpen}
          onOpenChange={setIsEditModalOpen}
          onSuccess={handleEditSuccess}
        />
      )}

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. It will permanently delete the payment.
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

export default PaidTable;