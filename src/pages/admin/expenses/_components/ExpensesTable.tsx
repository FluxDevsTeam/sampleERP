import React, { useState } from "react";
import { useQuery, useQueryClient, useMutation } from "@tanstack/react-query";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
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

interface Entry {
  id: number;
  name: string;
  expense_category: ExpenseCategory | null;
  description: string;
  linked_project: LinkedProject | null;
  sold_item: any | null;
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
  const { data } = await axios.get<ExpensesData>("https://kidsdesigncompany.pythonanywhere.com/api/expense/");
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
      await axios.delete(`https://kidsdesigncompany.pythonanywhere.com/api/expense/${entryId}/`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["expenses"] });
      setIsDeleteDialogOpen(false);
      setIsModalOpen(false);
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
      navigate(`/admin/dashboard/edit-expense/${selectedEntry.id}`);
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

  if (isLoading) return <p>Loading...</p>;
  if (error) return <p>Error loading data</p>;

  return (
    <div className="overflow-x-auto p-4">
<Link
        to="/admin/dashboard/add-expense"
        className="bg-neutral-900 text-white px-4 py-2 rounded-md mb-4 inline-block"
      >
        Add Expense
      </Link>

      <table className="min-w-full bg-white border border-gray-300 shadow-lg rounded-lg">
        <thead>
          <tr className="bg-gray-500 text-white">
            <th className="border px-4 py-2">Date</th>
            <th className="border px-4 py-2">Sold Item</th>
            <th className="border px-4 py-2">Name</th>
            <th className="border px-4 py-2">Category</th>
            <th className="border px-4 py-2">Project</th>
            <th className="border px-4 py-2">Amount</th>
            <th className="border px-4 py-2">Quantity</th>
          </tr>
        </thead>
        <tbody>
          {data?.daily_data.map((day) => (
            <React.Fragment key={day.date}>
             <tr
  className="bg-gray-400 cursor-pointer"
  onClick={() => toggleCollapse(day.date)}
>
  <td className="border px-4 py-2 font-bold" colSpan={7}>
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
                    className="hover:bg-gray-100 cursor-pointer"
                    onClick={() => handleRowClick(entry)}
                  >
                    <td className="border px-4 py-2">{new Date(day.date).toLocaleDateString()}</td>
                    <td className="border px-4 py-2">{entry.sold_item}</td>
                    <td className="border px-4 py-2">{entry.name}</td>
                    <td className="border px-4 py-2">{entry.expense_category ? entry.expense_category.name : "N/A"}</td>
                    <td className="border px-4 py-2">{entry.linked_project ? entry.linked_project.name : "N/A"}</td>
                    <td className="border px-4 py-2">{entry.amount}</td>
                    <td className="border px-4 py-2">{entry.quantity}</td>
                  </tr>
                ))}
            </React.Fragment>
          ))}
        </tbody>
      </table>
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
                <span className="col-span-2">{selectedEntry.description}</span>
              </div>
              <div className="grid grid-cols-3 items-center gap-4">
                <span className="font-medium">Project:</span>
                <span className="col-span-2">{selectedEntry.linked_project ? selectedEntry.linked_project.name : "N/A"}</span>
              </div>
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

          <DialogFooter className="flex justify-between sm:justify-between">
            <Button variant="outline" onClick={() => setIsModalOpen(false)}>
              Close
            </Button>
            <div className="flex gap-2">
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
            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the expense and remove the data from the server.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={confirmDelete} className="bg-red-600 hover:bg-red-700">
              {deleteExpenseMutation.isPending ? "Deleting..." : "Delete"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default ExpensesTable