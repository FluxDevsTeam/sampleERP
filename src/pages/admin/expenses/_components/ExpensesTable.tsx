import React, { useState, useRef, useEffect } from "react";
import { useQuery, useQueryClient, useMutation } from "@tanstack/react-query";
import axios from "axios";
import { toast } from "sonner";
import SkeletonLoader from "./SkeletonLoader";
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
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faChevronDown,
  faChevronUp,
  faPlus,
} from "@fortawesome/free-solid-svg-icons";
import AddExpenseModal from "./AddExpenseModal";

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
  daily_total?: number;
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

interface ExpensesTableProps {
  isTableModalOpen: boolean;
}

const fetchExpenses = async (year: number | '', month: number | '', day: number | ''): Promise<ExpensesData> => {
  const accessToken = localStorage.getItem("accessToken");
  const params = new URLSearchParams();

  if (year) {
    params.append("year", String(year));
  }
  if (month) {
    params.append("month", String(month));
  }
  if (day) {
    params.append("day", String(day));
  }

  const { data } = await axios.get<ExpensesData>(
    `https://backend.kidsdesigncompany.com/api/expense/?${params.toString()}`,
    {
      headers: {
        Authorization: `JWT ${accessToken}`,
      },
    }
  );
  return data;
};

const ExpensesTable: React.FC<ExpensesTableProps> = ({
  isTableModalOpen,
}) => {
  const [year, setYear] = useState<number | ''>( '');
  const [month, setMonth] = useState<number | ''>( '');
  const [day, setDay] = useState<number | ''>( '');

  const { data, isLoading, error } = useQuery<ExpensesData>({
    queryKey: ["expenses", year, month, day],
    queryFn: () => fetchExpenses(year, month, day),
  });

  const [collapsed, setCollapsed] = useState<{ [key: string]: boolean }>(() => {
    const initialCollapsedState: { [key: string]: boolean } = {};
    if (data?.daily_data && data.daily_data.length > 0) {
      data.daily_data.forEach((day, index) => {
        initialCollapsedState[day.date] = index !== 0;
      });
    }
    return initialCollapsedState;
  });
  const queryClient = useQueryClient();
  const currentUserRole = localStorage.getItem("user_role");
  const isceo = currentUserRole === "ceo";

  // Modal states
  const [selectedEntry, setSelectedEntry] = useState<Entry | null>(null);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  const months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

  // Dropdown visibility states
  const [isYearOpen, setIsYearOpen] = useState(false);
  const [isMonthOpen, setIsMonthOpen] = useState(false);
  const [isDayOpen, setIsDayOpen] = useState(false);

  // Refs for click-outside detection
  const yearRef = useRef<HTMLDivElement>(null);
  const monthRef = useRef<HTMLDivElement>(null);
  const dayRef = useRef<HTMLDivElement>(null);

  // Effect for handling click outside dropdowns
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (yearRef.current && !yearRef.current.contains(event.target as Node)) {
        setIsYearOpen(false);
      }
      if (monthRef.current && !monthRef.current.contains(event.target as Node)) {
        setIsMonthOpen(false);
      }
      if (dayRef.current && !dayRef.current.contains(event.target as Node)) {
        setIsDayOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  // Helper to format numbers with Naira sign
  const formatNumber = (number: number | string | undefined | null) => {
    if (number === undefined || number === null || number === "") {
      return "0";
    }
    const num = typeof number === "string" ? parseFloat(number) : number;
    if (isNaN(num)) {
      return "0"; // Return "0" for NaN values
    }
    return num.toLocaleString("en-NG");
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

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
    setIsDeleteDialogOpen(false);
    setSelectedEntry(null);
  };

  if (isLoading) return <SkeletonLoader />;
  if (error)
    return <p className="text-red-600">Error: {(error as Error).message}</p>;

  return (
    <div className={`relative ${!data?.daily_data?.length ? 'min-h-[300px]' : ''}`}>
      <div className="flex justify-between items-center mb-4">
        {/* Add Expense Button (Left-aligned) */}
        <button
          onClick={() => setIsAddModalOpen(true)}
          className="bg-blue-400 text-white px-4 py-2 rounded hover:bg-blue-500"
        >
          <FontAwesomeIcon className="pr-2" icon={faPlus} />
          Add Expense
        </button>
        <div className="flex items-center space-x-2">
          {/* Year Dropdown */}
          <div className="relative w-24" ref={yearRef}>
            <button
              onClick={() => setIsYearOpen(!isYearOpen)}
              className="p-2 border rounded w-full text-left flex justify-between items-center"
            >
              <span>{year || 'Year'}</span>
              <FontAwesomeIcon icon={isYearOpen ? faChevronUp : faChevronDown} />
            </button>
            {isYearOpen && (
              <ul className="absolute z-[9999] w-full bg-white border rounded mt-1 max-h-40 overflow-y-auto shadow-lg">
                <li onClick={() => { setYear(''); setIsYearOpen(false); }} className="p-2 hover:bg-gray-200 cursor-pointer">Year</li>
                {[...Array(10)].map((_, i) => {
                  const y = new Date().getFullYear() - i;
                  return (
                    <li key={i} onClick={() => { setYear(y); setIsYearOpen(false); }} className="p-2 hover:bg-gray-200 cursor-pointer">
                      {y}
                    </li>
                  );
                })}
              </ul>
            )}
          </div>
          {/* Month Dropdown */}
          <div className="relative w-32" ref={monthRef}>
            <button
              onClick={() => setIsMonthOpen(!isMonthOpen)}
              className="p-2 border rounded w-full text-left flex justify-between items-center"
            >
              <span>{month ? months[Number(month) - 1] : 'Month'}</span>
              <FontAwesomeIcon icon={isMonthOpen ? faChevronUp : faChevronDown} />
            </button>
            {isMonthOpen && (
              <ul className="absolute z-[9999] w-full bg-white border rounded mt-1 max-h-40 overflow-y-auto shadow-lg">
                <li onClick={() => { setMonth(''); setIsMonthOpen(false); }} className="p-2 hover:bg-gray-200 cursor-pointer">Month</li>
                {months.map((m, i) => (
                  <li key={i} onClick={() => { setMonth(i + 1); setIsMonthOpen(false); }} className="p-2 hover:bg-gray-200 cursor-pointer">
                    {m}
                  </li>
                ))}
              </ul>
            )}
          </div>
          {/* Day Dropdown */}
          <div className="relative w-24" ref={dayRef}>
            <button
              onClick={() => setIsDayOpen(!isDayOpen)}
              className="p-2 border rounded w-full text-left flex justify-between items-center"
            >
              <span>{day || 'Day'}</span>
              <FontAwesomeIcon icon={isDayOpen ? faChevronUp : faChevronDown} />
            </button>
            {isDayOpen && (
              <ul className="absolute z-[9999] w-full bg-white border rounded mt-1 max-h-40 overflow-y-auto shadow-lg">
                <li onClick={() => { setDay(''); setIsDayOpen(false); }} className="p-2 hover:bg-gray-200 cursor-pointer">Day</li>
                {[...Array(31)].map((_, i) => (
                  <li key={i} onClick={() => { setDay(i + 1); setIsDayOpen(false); }} className="p-2 hover:bg-gray-200 cursor-pointer">
                    {i + 1}
                  </li>
                ))}
              </ul>
            )}
          </div>
          <Button onClick={() => queryClient.invalidateQueries({ queryKey: ["expenses"] })} disabled={isLoading} className="px-4 py-2 bg-blue-400 text-white rounded hover:bg-blue-500 transition-colors">Filter</Button>
          <Button onClick={() => { setYear(''); setMonth(''); setDay(''); queryClient.invalidateQueries({ queryKey: ["expenses"] }); }} disabled={isLoading} className="px-4 py-2 bg-gray-400 text-white rounded hover:bg-gray-500 transition-colors">Clear</Button>
        </div>
      </div>
      <div className={`overflow-x-auto pb-8 ${isTableModalOpen || isViewModalOpen || isEditModalOpen || isDeleteDialogOpen || isAddModalOpen ? 'blur-md' : ''}`}>
        {(!data?.daily_data || data.daily_data.length === 0) ? (
          <div className="text-center text-gray-500 py-8">No expenses found.</div>
        ) : (
          data.daily_data.map((day) => (
            <div
              key={day.date}
              className="bg-white shadow-md rounded-lg overflow-auto mb-6"
            >
              <div
                className="bg-white text-blue-20 px-4 py-2 border-b flex justify-between items-center cursor-pointer hover:bg-slate-300 hover:text-blue-20 w-full"
                onClick={() => toggleCollapse(day.date)}
              >
                <div className="flex items-center space-x-2">
                  <FontAwesomeIcon
                    icon={collapsed[day.date] ? faChevronDown : faChevronUp}
                  />
                  <h3
                    className="text-lg font-semibold"
                    style={{ fontSize: "clamp(13.5px, 3vw, 15px)" }}
                  >
                    {formatDate(day.date)}
                  </h3>
                </div>
                <p
                  className="font-bold"
                  style={{ fontSize: "clamp(13.5px, 3vw, 15px)" }}
                >
                  Total: ₦{formatNumber(day.daily_total)}
                </p>
              </div>

              {!collapsed[day.date] && (
                <table className="min-w-full overflow-auto">
                  <thead className="bg-gray-800">
                    <tr>
                      <th className="px-4 py-3 text-left text-xs font-bold text-blue-400">Date</th>
                      <th className="px-4 py-3 text-left text-xs font-bold text-blue-400">Name</th>
                      <th className="px-4 py-3 text-left text-xs font-bold text-blue-400">Category</th>
                      <th className="px-4 py-3 text-left text-xs font-bold text-blue-400">Linked Project</th>
                      <th className="px-4 py-3 text-left text-xs font-bold text-blue-400">Linked Shop Item</th>
                      <th className="px-4 py-3 text-left text-xs font-bold text-blue-400">Amount</th>
                      <th className="px-4 py-3 text-left text-xs font-bold text-blue-400">Quantity</th>
                      <th className="px-4 py-3 text-left text-xs font-bold text-blue-400">Details</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {day.entries.length === 0 ? (
                      <tr>
                        <td colSpan={8} className="text-center py-6 text-gray-500">
                          No expenses for this day.
                        </td>
                      </tr>
                    ) : (
                      day.entries.map((entry) => (
                        <tr key={entry.id} className="hover:bg-gray-50">
                          <td className="px-4 py-3 text-sm">{new Date(entry.date).toLocaleDateString()}</td>
                          <td className="px-4 py-3 text-sm font-medium">{entry.name}</td>
                          <td className="px-4 py-3 text-sm">{entry.expense_category?.name || "N/A"}</td>
                          <td className="px-4 py-3 text-sm">{entry.linked_project?.name || "N/A"}</td>
                          <td className="px-4 py-3 text-sm">{entry.sold_item?.name || "N/A"}</td>
                          <td className="px-4 py-3 text-sm font-medium">₦ {formatNumber(entry.amount)}</td>
                          <td className="px-4 py-3 text-sm">{entry.quantity}</td>
                          <td className="px-4 py-3 text-sm">
                            <button
                              onClick={() => handleRowClick(entry)}
                              className="px-3 py-1 text-blue-400 border-2 border-blue-400 rounded"
                            >
                              View
                            </button>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              )}
            </div>
          ))
        )}
      </div>

      {/* View Expense Modal */}
      <Dialog open={isViewModalOpen} onOpenChange={setIsViewModalOpen}>
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
                <span className="font-medium">Amount:</span>
                <span className="col-span-2">₦ {formatNumber(selectedEntry.amount)}</span>
              </div>
              <div className="grid grid-cols-3 items-center gap-4">
                <span className="font-medium">Quantity:</span>
                <span className="col-span-2">{selectedEntry.quantity}</span>
              </div>
              <div className="grid grid-cols-3 items-center gap-4">
                <span className="font-medium">Category:</span>
                <span className="col-span-2">{selectedEntry.expense_category?.name || "N/A"}</span>
              </div>
              <div className="grid grid-cols-3 items-center gap-4">
                <span className="font-medium">Linked Project:</span>
                <span className="col-span-2">{selectedEntry.linked_project?.name || "N/A"}</span>
              </div>
              <div className="grid grid-cols-3 items-center gap-4">
                <span className="font-medium">Sold Item:</span>
                <span className="col-span-2">{selectedEntry.sold_item?.name || "N/A"}</span>
              </div>
              <div className="grid grid-cols-3 items-center gap-4">
                <span className="font-medium">Date:</span>
                <span className="col-span-2">{new Date(selectedEntry.date).toLocaleDateString()}</span>
              </div>
            </div>
          )}

          <DialogFooter>
            <div className="flex justify-around items-center w-full">
              <Button variant="outline" onClick={() => setIsViewModalOpen(false)}>
                Close
              </Button>
              {isceo && (
                <Button variant="outline" onClick={handleEdit}>
                  Edit
                </Button>
              )}
              {isceo && (
                <Button variant="destructive" onClick={handleDelete} disabled={deleteExpenseMutation.isPending}>
                  Delete
                </Button>
              )}
            </div>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit Expense Modal */}
      {selectedEntry && isEditModalOpen && (
        <EditExpenseModal
          expense={entryToExpense(selectedEntry)}
          isOpen={isEditModalOpen}
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
              This action cannot be undone. It will permanently delete the expense.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={confirmDelete}>Confirm</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <AddExpenseModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
      />
    </div>
  );
};

export default ExpensesTable;
