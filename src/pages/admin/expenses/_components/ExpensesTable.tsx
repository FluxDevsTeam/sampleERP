import React, { useState } from "react";
import { useQuery, useQueryClient, useMutation } from "@tanstack/react-query";
import axios from "axios";
import { toast } from "sonner";
import SkeletonLoader from "./SkeletonLoader";
import AddExpenseModal from "./AddExpenseModal";
import EditExpenseModal from "./EditExpenseModal";
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
  name: string;
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

// Transform Entry to Expense interface for EditExpenseModal
interface Expense {
  id: number;
  name: string;
  description: string;
  amount: number;
  quantity: number;
  category?: {
    id: number;
    name: string;
  };
  project?: {
    id: number;
    name: string;
  };
  shop?: {
    id: number;
    name: string;
  };
}

const fetchExpenses = async (): Promise<ExpensesData> => {
  const accessToken = localStorage.getItem("accessToken");
  const { data } = await axios.get<ExpensesData>(
    "https://backend.kidsdesigncompany.com/api/expense/",
    {
      headers: {
        Authorization: `JWT ${accessToken}`,
      },
    }
  );
  return data;
};

const ExpensesTable: React.FC = () => {
  const { data, isLoading, error } = useQuery<ExpensesData>({
    queryKey: ["expenses"],
    queryFn: fetchExpenses,
  });

  const [collapsed, setCollapsed] = useState<{ [key: string]: boolean }>({});
  const queryClient = useQueryClient();

  // Modal states
  const [selectedEntry, setSelectedEntry] = useState<Entry | null>(null);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);

  // Delete mutation
  const deleteExpenseMutation = useMutation({
    mutationFn: async (entryId: number) => {
      const accessToken = localStorage.getItem("accessToken");
      await axios.delete(
        `https://backend.kidsdesigncompany.com/api/expense/${entryId}/`,
        {
          headers: {
            Authorization: `JWT ${accessToken}`,
          },
        }
      );
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["expenses"] });
      setIsDeleteDialogOpen(false);
      setIsViewModalOpen(false);
      setSelectedEntry(null);
      toast.success("Expense deleted successfully!");
    },
    onError: (error) => {
      console.error("Delete error:", error);
      toast.error("Failed to delete expense. Please try again.");
    },
  });

  // Transform Entry to Expense format for EditExpenseModal
  const entryToExpense = (entry: Entry): Expense => {
    return {
      id: entry.id,
      name: entry.name,
      description: entry.description,
      amount: parseFloat(entry.amount) || 0,
      quantity: parseFloat(entry.quantity) || 0,
      category: entry.expense_category
        ? {
            id: entry.expense_category.id,
            name: entry.expense_category.name,
          }
        : undefined,
      project: entry.linked_project
        ? {
            id: entry.linked_project.id,
            name: entry.linked_project.name,
          }
        : undefined,
      shop: entry.sold_item
        ? {
            id: entry.sold_item.id,
            name: entry.sold_item.name || "Shop Item",
          }
        : undefined,
    };
  };

  // Event handlers
  const handleRowClick = (entry: Entry) => {
    setSelectedEntry(entry);
    setIsViewModalOpen(true);
  };

  const handleEdit = () => {
    if (selectedEntry) {
      setIsViewModalOpen(false);
      setIsEditModalOpen(true);
    }
  };

  const handleDelete = () => {
    setIsDeleteDialogOpen(true);
  };

  const confirmDelete = () => {
    if (selectedEntry?.id) {
      deleteExpenseMutation.mutate(selectedEntry.id);
    }
  };

  const handleAddSuccess = () => {
    queryClient.invalidateQueries({ queryKey: ["expenses"] });
    toast.success("Expense added successfully!");
  };

  const handleEditSuccess = () => {
    queryClient.invalidateQueries({ queryKey: ["expenses"] });
    setIsEditModalOpen(false);
    setSelectedEntry(null);
    toast.success("Expense updated successfully!");
  };

  const toggleCollapse = (date: string) => {
    setCollapsed((prev) => ({ ...prev, [date]: !prev[date] }));
  };

  const closeAllModals = () => {
    setIsViewModalOpen(false);
    setIsEditModalOpen(false);
    setIsAddModalOpen(false);
    setIsDeleteDialogOpen(false);
    setSelectedEntry(null);
  };

  if (isLoading) return <SkeletonLoader />;
  if (error)
    return <p className="text-red-600">Error: {(error as Error).message}</p>;

  return (
    <div className="p-6 flex flex-col h-full bg-white">
      {/* Header with Add Button */}
      <div className=" mb-6">
        <Button
          onClick={() => setIsAddModalOpen(true)}
          className="bg-blue-600 text-white px-6 py-3 rounded-lg shadow-md hover:bg-blue-700 transition duration-300"
        >
          Add Expense
        </Button>
      </div>

      {/* Expenses Table */}
      <div className="flex-1 overflow-auto rounded-lg shadow-sm border border-gray-200">
        <table className="min-w-full bg-white">
          <thead className="bg-gray-100">
            <tr>
              <th className="px-6 py-4 text-left text-sm font-semibold text-neutral-900 uppercase">
                Date
              </th>
              <th className="px-6 py-4 text-left text-sm font-semibold text-neutral-900 uppercase">
                Name
              </th>
              <th className="px-6 py-4 text-left text-sm font-semibold text-neutral-900 uppercase">
                Category
              </th>
              <th className="px-6 py-4 text-left text-sm font-semibold text-neutral-900 uppercase">
                Project
              </th>
              <th className="px-6 py-4 text-left text-sm font-semibold text-neutral-900 uppercase">
                Shop Item
              </th>
              <th className="px-6 py-4 text-left text-sm font-semibold text-neutral-900 uppercase">
                Amount
              </th>
              <th className="px-6 py-4 text-left text-sm font-semibold text-neutral-900 uppercase">
                Quantity
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {data?.daily_data.map((day) => (
              <React.Fragment key={day.date}>
                <tr
                  className="bg-gray-50 cursor-pointer hover:bg-gray-100"
                  onClick={() => toggleCollapse(day.date)}
                >
                  <td
                    className="px-6 py-4 text-sm font-semibold text-neutral-900"
                    colSpan={7}
                  >
                    <div className="flex justify-between items-center w-full">
                      <span className="flex items-center">
                        <span className="mr-2">
                          {collapsed[day.date] ? "▶" : "▼"}
                        </span>
                        {new Date(day.date).toLocaleDateString("en-US", {
                          weekday: "long",
                          year: "numeric",
                          month: "long",
                          day: "numeric",
                        })}
                      </span>
                      <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-xs font-medium">
                        Total: ${day.daily_total}
                      </span>
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
                      <td className="px-6 py-4 text-sm text-neutral-700">
                        {new Date(entry.date).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4 text-sm text-neutral-700 font-medium">
                        {entry.name}
                      </td>
                      <td className="px-6 py-4 text-sm text-neutral-700">
                        {entry.expense_category ? (
                          <span className="bg-gray-100 text-gray-800 px-2 py-1 rounded-full text-xs">
                            {entry.expense_category.name}
                          </span>
                        ) : (
                          <span className="text-gray-400">N/A</span>
                        )}
                      </td>
                      <td className="px-6 py-4 text-sm text-neutral-700">
                        {entry.linked_project ? (
                          <span className="bg-green-100 text-green-800 px-2 py-1 rounded-full text-xs">
                            {entry.linked_project.name}
                          </span>
                        ) : (
                          <span className="text-gray-400">N/A</span>
                        )}
                      </td>
                      <td className="px-6 py-4 text-sm text-neutral-700">
                        {entry.sold_item ? (
                          <span className="bg-purple-100 text-purple-800 px-2 py-1 rounded-full text-xs">
                            {entry.sold_item.name ||
                              `Item #${entry.sold_item.id}`}
                          </span>
                        ) : (
                          <span className="text-gray-400">N/A</span>
                        )}
                      </td>
                      <td className="px-6 py-4 text-sm text-neutral-700 font-medium">
                        ${entry.amount}
                      </td>
                      <td className="px-6 py-4 text-sm text-neutral-700">
                        {entry.quantity}
                      </td>
                    </tr>
                  ))}
              </React.Fragment>
            ))}
          </tbody>
        </table>
      </div>

      {/* View Expense Modal */}
      <Dialog open={isViewModalOpen} onOpenChange={setIsViewModalOpen}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>Expense Details</DialogTitle>
            <DialogDescription>
              View and manage the selected expense.
            </DialogDescription>
          </DialogHeader>

          {selectedEntry && (
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-3 items-center gap-4">
                <span className="font-medium text-gray-600">Name:</span>
                <span className="col-span-2 font-medium">
                  {selectedEntry.name}
                </span>
              </div>
              <div className="grid grid-cols-3 items-center gap-4">
                <span className="font-medium text-gray-600">Category:</span>
                <span className="col-span-2">
                  {selectedEntry.expense_category
                    ? selectedEntry.expense_category.name
                    : "N/A"}
                </span>
              </div>
              <div className="grid grid-cols-3 items-center gap-4">
                <span className="font-medium text-gray-600">Description:</span>
                <span className="col-span-2">
                  {selectedEntry.description || "N/A"}
                </span>
              </div>
              <div className="grid grid-cols-3 items-center gap-4">
                <span className="font-medium text-gray-600">Project:</span>
                <span className="col-span-2">
                  {selectedEntry.linked_project
                    ? selectedEntry.linked_project.name
                    : "N/A"}
                </span>
              </div>
              {selectedEntry.sold_item && (
                <>
                  <div className="grid grid-cols-3 items-center gap-4">
                    <span className="font-medium text-gray-600">
                      Shop Item:
                    </span>
                    <span className="col-span-2">
                      {selectedEntry.sold_item.name ||
                        `Item #${selectedEntry.sold_item.id}`}
                    </span>
                  </div>
                  <div className="grid grid-cols-3 items-center gap-4">
                    <span className="font-medium text-gray-600">
                      Item Cost:
                    </span>
                    <span className="col-span-2">
                      ${selectedEntry.sold_item.cost_price}
                    </span>
                  </div>
                  <div className="grid grid-cols-3 items-center gap-4">
                    <span className="font-medium text-gray-600">
                      Selling Price:
                    </span>
                    <span className="col-span-2">
                      ${selectedEntry.sold_item.selling_price}
                    </span>
                  </div>
                </>
              )}
              <div className="grid grid-cols-3 items-center gap-4">
                <span className="font-medium text-gray-600">Amount:</span>
                <span className="col-span-2 font-bold text-green-600">
                  ${selectedEntry.amount}
                </span>
              </div>
              <div className="grid grid-cols-3 items-center gap-4">
                <span className="font-medium text-gray-600">Quantity:</span>
                <span className="col-span-2">{selectedEntry.quantity}</span>
              </div>
              <div className="grid grid-cols-3 items-center gap-4">
                <span className="font-medium text-gray-600">Date:</span>
                <span className="col-span-2">
                  {new Date(selectedEntry.date).toLocaleDateString()}
                </span>
              </div>
            </div>
          )}

          <DialogFooter>
            <div className="flex justify-between items-center w-full">
              <Button
                variant="outline"
                onClick={() => setIsViewModalOpen(false)}
              >
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
            </div>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Add Expense Modal */}
      <AddExpenseModal
        isOpen={isAddModalOpen}
        onOpenChange={setIsAddModalOpen}
        onSuccess={handleAddSuccess}
      />

      {/* Edit Expense Modal */}
      {selectedEntry && (
        <EditExpenseModal
          expenseId={selectedEntry.id.toString()}
          isOpen={isEditModalOpen}
          onOpenChange={setIsEditModalOpen}
          onSuccess={handleEditSuccess}
          initialData={entryToExpense(selectedEntry)}
        />
      )}

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
              expense
              {selectedEntry && ` "${selectedEntry.name}"`} from the system.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={confirmDelete}
              className="bg-red-600 hover:bg-red-700"
              disabled={deleteExpenseMutation.isPending}
            >
              {deleteExpenseMutation.isPending ? "Deleting..." : "Delete"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default ExpensesTable;
