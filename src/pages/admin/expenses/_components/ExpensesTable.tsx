import React, { useState } from "react";
import { useQuery, useQueryClient, useMutation } from "@tanstack/react-query";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
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

interface ExpenseCategory {
  id: number;
  name: string;
}

interface LinkedProject {
  id: number;
  name: string;
}

interface SoldItem {
  id: number;
  quantity: string;
  cost_price: string;
  selling_price: string;
  total_price: number;
}

interface Entry {
  id: number;
  name: string;
  expense_category: ExpenseCategory | null;
  description: string;
  linked_project: LinkedProject | null;
  sold_item: SoldItem | null;
  amount: string;
  quantity: string;
  date: string;
}

interface DailyData {
  date: string;
  entries: Entry[];
  daily_total: number;
}

interface ExpensesData {
  monthly_total: number;
  weekly_total: number;
  daily_total: number;
  monthly_project_expenses_total: number;
  monthly_shop_expenses_total: number;
  daily_data: DailyData[];
}

const fetchExpenses = async (): Promise<ExpensesData> => {
  const access_token = localStorage.getItem("access_token");
  const { data } = await axios.get<ExpensesData>(
    "https://backend.kidsdesigncompany.com/api/expense/",
    {
      headers: {
        Authorization: `JWT ${access_token}`
      }
    }
  );
  return data;
};

const ExpensesTable: React.FC = () => {
  const { data, isLoading, error } = useQuery<ExpensesData>({ queryKey: ["expenses"], queryFn: fetchExpenses });
  const [collapsed, setCollapsed] = useState<{ [key: string]: boolean }>({});
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  // States for modal and selected entry
  const [selectedEntry, setSelectedEntry] = useState<Entry | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);

  const deleteExpenseMutation = useMutation({
    mutationFn: async (entryId: number) => {
      const access_token = localStorage.getItem("access_token");
      await axios.delete(
        `https://backend.kidsdesigncompany.com/api/expense/${entryId}/`,
        {
          headers: {
            Authorization: `JWT ${access_token}`
          }
        }
      );
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["expenses"] });
      setIsDeleteDialogOpen(false);
      setIsModalOpen(false);
      toast.success("Expense deleted successfully!");
    },
  });

  // Handle row click to show modal
  const handleRowClick = (entry: Entry) => {
    setSelectedEntry(entry);
    setIsModalOpen(true);
  };

  // Handle edit button click
  const handleEdit = () => {
    if (selectedEntry?.id) {
      navigate(`/admin/edit-expense/${selectedEntry.id}`);
    }
  };

  // Handle delete button click
  const handleDelete = () => {
    setIsDeleteDialogOpen(true);
  };

  // Confirm delete
  const confirmDelete = () => {
    if (selectedEntry?.id) {
      deleteExpenseMutation.mutate(selectedEntry.id);
    }
  };

  const toggleCollapse = (date: string) => {
    setCollapsed((prev) => ({ ...prev, [date]: !prev[date] }));
  };

  if (isLoading) return <SkeletonLoader />;
  if (error) return <p className="text-red-600">Error: {(error as Error).message}</p>;

  return (
    <div className="p-6 flex flex-col h-full bg-white">
      <div className="flex justify-between items-center mb-6">
        <Link
          to="/admin/add-expense"
          className="bg-blue-600 text-white px-6 py-3 rounded-lg shadow-md hover:text-white hover:bg-blue-400  transition duration-300"
        >
          Add Expense
        </Link>
      </div>

      <div className="flex-1 overflow-auto rounded-lg shadow-sm border border-gray-200">
        <table className="min-w-full bg-white">
          <thead className="bg-gray-100">
            <tr>
              <th className="px-6 py-4 text-left text-sm font-semibold text-neutral-900 uppercase">Date</th>
              <th className="px-6 py-4 text-left text-sm font-semibold text-neutral-900 uppercase">Sold Item Price</th>
              <th className="px-6 py-4 text-left text-sm font-semibold text-neutral-900 uppercase">Name</th>
              <th className="px-6 py-4 text-left text-sm font-semibold text-neutral-900 uppercase">Category</th>
              <th className="px-6 py-4 text-left text-sm font-semibold text-neutral-900 uppercase">Project</th>
              <th className="px-6 py-4 text-left text-sm font-semibold text-neutral-900 uppercase">Amount</th>
              <th className="px-6 py-4 text-left text-sm font-semibold text-neutral-900 uppercase">Quantity</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {data?.daily_data.map((day) => (
              <React.Fragment key={day.date}>
                <tr
                  className="bg-gray-100 cursor-pointer"
                  onClick={() => toggleCollapse(day.date)}
                >
                  <td className="px-6 py-4 text-sm font-semibold text-neutral-900 uppercase" colSpan={7}>
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
                      <td className="px-6 py-4 text-sm text-neutral-700">
                        {entry.sold_item ? `$${entry.sold_item.cost_price}` : "N/A"}
                      </td>
                      <td className="px-6 py-4 text-sm text-neutral-700">{entry.name}</td>
                      <td className="px-6 py-4 text-sm text-neutral-700">
                        {entry.expense_category ? entry.expense_category.name : "N/A"}
                      </td>
                      <td className="px-6 py-4 text-sm text-neutral-700">
                        {entry.linked_project ? entry.linked_project.name : "N/A"}
                      </td>
                      <td className="px-6 py-4 text-sm text-neutral-700">{entry.amount}</td>
                      <td className="px-6 py-4 text-sm text-neutral-700">{entry.quantity}</td>
                    </tr>
                  ))}
              </React.Fragment>
            ))}
          </tbody>
        </table>
      </div>

      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Expense Details</DialogTitle>
            <DialogDescription>View details for the selected expense.</DialogDescription>
          </DialogHeader>

          {selectedEntry && (
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-3 items-center gap-4">
                <span className="font-medium">Name:</span>
                <span className="col-span-2">{selectedEntry.name}</span>
              </div>
              <div className="grid grid-cols-3 items-center gap-4">
                <span className="font-medium">Category:</span>
                <span className="col-span-2">{selectedEntry.expense_category ? selectedEntry.expense_category.name : "N/A"}</span>
              </div>
              <div className="grid grid-cols-3 items-center gap-4">
                <span className="font-medium">Description:</span>
                <span className="col-span-2">{selectedEntry.description || "N/A"}</span>
              </div>
              <div className="grid grid-cols-3 items-center gap-4">
                <span className="font-medium">Project:</span>
                <span className="col-span-2">{selectedEntry.linked_project ? selectedEntry.linked_project.name : "N/A"}</span>
              </div>
              {selectedEntry.sold_item && (
                <>
                  <div className="grid grid-cols-3 items-center gap-4">
                    <span className="font-medium">Sold Item ID:</span>
                    <span className="col-span-2">{selectedEntry.sold_item.id}</span>
                  </div>
                  <div className="grid grid-cols-3 items-center gap-4">
                    <span className="font-medium">Item Cost:</span>
                    <span className="col-span-2">${selectedEntry.sold_item.cost_price}</span>
                  </div>
                  <div className="grid grid-cols-3 items-center gap-4">
                    <span className="font-medium">Item Price:</span>
                    <span className="col-span-2">${selectedEntry.sold_item.selling_price}</span>
                  </div>
                  <div className="grid grid-cols-3 items-center gap-4">
                    <span className="font-medium">Total Price:</span>
                    <span className="col-span-2">${selectedEntry.sold_item.total_price}</span>
                  </div>
                </>
              )}
              <div className="grid grid-cols-3 items-center gap-4">
                <span className="font-medium">Amount:</span>
                <span className="col-span-2">{selectedEntry.amount}</span>
              </div>
              <div className="grid grid-cols-3 items-center gap-4">
                <span className="font-medium">Quantity:</span>
                <span className="col-span-2">{selectedEntry.quantity}</span>
              </div>
              <div className="grid grid-cols-3 items-center gap-4">
                <span className="font-medium">Date:</span>
                <span className="col-span-2">{new Date(selectedEntry.date).toLocaleDateString()}</span>
              </div>
            </div>
          )}

          <DialogFooter>
            <div className="flex justify-around items-center w-full">
              <Button variant="outline" onClick={() => setIsModalOpen(false)}>
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

      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. It will permanently delete the expense.
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

export default ExpensesTable;