import React, { useState, useRef, useEffect } from "react";
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
import { faChevronDown, faChevronUp } from "@fortawesome/free-solid-svg-icons";
import AddExpenseModal from "./AddExpenseModal";
import expensesData from "@/data/admin/expenses/expenses.json";

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

interface LinkedProduct {
  id: number;
  name: string;
}

interface Entry {
  id: number;
  name: string;
  expense_category: ExpenseCategory | null;
  description: string;
  linked_project: LinkedProject | null;
  sold_item: SoldItem | null;
  linked_product: LinkedProduct | null;
  amount: string;
  quantity: string | null;
  payment_method?: string;
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
  current_month_product_total: number;
  daily_data: DailyData[];
}

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
  product?: {
    id: number;
    name: string;
  };
  date?: string;
  payment_method?: string;
}

interface ExpensesTableProps {
  isTableModalOpen: boolean;
}

// Utility function to convert Entry to Expense
const entryToExpense = (entry: Entry): Expense => ({
  id: entry.id,
  name: entry.name,
  description: entry.description,
  amount: Number(entry.amount) || 0,
  quantity: Number(entry.quantity) || 0,
  category: entry.expense_category,
  project: entry.linked_project,
  shop: entry.sold_item,
  product: entry.linked_product,
  date: entry.date,
  payment_method: entry.payment_method,
});

const ExpensesTable: React.FC<ExpensesTableProps> = ({ isTableModalOpen }) => {
  const [year, setYear] = useState<number | "">("");
  const [month, setMonth] = useState<number | "">("");
  const [day, setDay] = useState<number | "">("");
  const [data, setData] = useState<ExpensesData>(expensesData);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isYearOpen, setIsYearOpen] = useState(false);
  const [isMonthOpen, setIsMonthOpen] = useState(false);
  const [isDayOpen, setIsDayOpen] = useState(false);

  const [collapsed, setCollapsed] = useState<{ [key: string]: boolean }>(() => {
    const initialCollapsedState: { [key: string]: boolean } = {};
    expensesData.daily_data.forEach((day, index) => {
      initialCollapsedState[day.date] = index !== 0;
    });
    return initialCollapsedState;
  });

  const currentUserRole = localStorage.getItem("user_role");
  const isceo = currentUserRole === "ceo";

  const [selectedEntry, setSelectedEntry] = useState<Entry | null>(null);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  const months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

  const yearRef = useRef<HTMLDivElement>(null);
  const monthRef = useRef<HTMLDivElement>(null);
  const dayRef = useRef<HTMLDivElement>(null);

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
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  useEffect(() => {
    if (year || month || day) {
      const filteredData: ExpensesData = {
        ...expensesData,
        daily_data: expensesData.daily_data.filter((dayData) => {
          const date = new Date(dayData.date);
          const yearMatch = year ? date.getFullYear() === Number(year) : true;
          const monthMatch = month ? date.getMonth() + 1 === Number(month) : true;
          const dayMatch = day ? date.getDate() === Number(day) : true;
          return yearMatch && monthMatch && dayMatch;
        }),
      };
      setData(filteredData);
    } else {
      setData(expensesData);
    }
  }, [year, month, day]);

  const formatNumber = (number: number | string | undefined | null) => {
    if (number === undefined || number === null || number === "") {
      return "0";
    }
    const num = typeof number === "string" ? parseFloat(number) : number;
    if (isNaN(num)) {
      return "0";
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
    toast.error("Delete functionality is disabled in static mode.");
    setIsDeleteDialogOpen(false);
    setIsViewModalOpen(false);
    setSelectedEntry(null);
  };

  const handleEditSuccess = () => {
    toast.error("Edit functionality is disabled in static mode.");
    setIsEditModalOpen(false);
    setSelectedEntry(null);
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
  if (error) return <p className="text-red-600">Error: {error}</p>;

  return (
    <div className={`relative ${!data?.daily_data?.length ? "min-h-[300px]" : ""}`}>
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4 gap-3 sm:gap-0">
        <div className="flex flex-row flex-wrap items-center gap-2 w-full mb-4 justify-end ml-auto">
          <div className="relative w-14 sm:w-20" ref={yearRef}>
            <button
              onClick={() => setIsYearOpen(!isYearOpen)}
              className="p-1.5 sm:p-2 border rounded w-full text-left flex justify-between items-center text-xs sm:text-sm"
            >
              <span>{year || "Year"}</span>
              <FontAwesomeIcon icon={isYearOpen ? faChevronUp : faChevronDown} className="text-xs" />
            </button>
            {isYearOpen && (
              <ul className="absolute z-[9999] w-full bg-white border rounded mt-1 max-h-40 overflow-y-auto shadow-lg">
                <li
                  onClick={() => {
                    setYear("");
                    setIsYearOpen(false);
                  }}
                  className="p-1.5 sm:p-2 hover:bg-gray-200 cursor-pointer text-xs sm:text-sm"
                >
                  Year
                </li>
                {[...Array(10)].map((_, i) => {
                  const y = new Date().getFullYear() - i;
                  return (
                    <li
                      key={i}
                      onClick={() => {
                        setYear(y);
                        setIsYearOpen(false);
                      }}
                      className="p-1.5 sm:p-2 hover:bg-gray-200 cursor-pointer text-xs sm:text-sm"
                    >
                      {y}
                    </li>
                  );
                })}
              </ul>
            )}
          </div>
          <div className="relative w-20 sm:w-20" ref={monthRef}>
            <button
              onClick={() => setIsMonthOpen(!isMonthOpen)}
              className="p-1.5 sm:p-2 border rounded w-full text-left flex justify-between items-center text-xs sm:text-sm"
            >
              <span>{month ? months[Number(month) - 1] : "Month"}</span>
              <FontAwesomeIcon icon={isMonthOpen ? faChevronUp : faChevronDown} className="text-xs" />
            </button>
            {isMonthOpen && (
              <ul className="absolute z-[9999] w-full bg-white border rounded mt-1 max-h-40 overflow-y-auto shadow-lg">
                <li
                  onClick={() => {
                    setMonth("");
                    setIsMonthOpen(false);
                  }}
                  className="p-1.5 sm:p-2 hover:bg-gray-200 cursor-pointer text-xs sm:text-sm"
                >
                  Month
                </li>
                {months.map((m, i) => (
                  <li
                    key={i}
                    onClick={() => {
                      setMonth(i + 1);
                      setIsMonthOpen(false);
                    }}
                    className="p-1.5 sm:p-2 hover:bg-gray-200 cursor-pointer text-xs sm:text-sm"
                  >
                    {m}
                  </li>
                ))}
              </ul>
            )}
          </div>
          <div className="relative w-12 sm:w-20" ref={dayRef}>
            <button
              onClick={() => setIsDayOpen(!isDayOpen)}
              className="p-1.5 sm:p-2 border rounded w-full text-left flex justify-between items-center text-xs sm:text-sm"
            >
              <span>{day || "Day"}</span>
              <FontAwesomeIcon icon={isDayOpen ? faChevronUp : faChevronDown} className="text-xs" />
            </button>
            {isDayOpen && (
              <ul className="absolute z-[9999] w-full bg-white border rounded mt-1 max-h-40 overflow-y-auto shadow-lg">
                <li
                  onClick={() => {
                    setDay("");
                    setIsDayOpen(false);
                  }}
                  className="p-1.5 sm:p-2 hover:bg-gray-200 cursor-pointer text-xs sm:text-sm"
                >
                  Day
                </li>
                {[...Array(31)].map((_, i) => (
                  <li
                    key={i}
                    onClick={() => {
                      setDay(i + 1);
                      setIsDayOpen(false);
                    }}
                    className="p-1.5 sm:p-2 hover:bg-gray-200 cursor-pointer text-xs sm:text-sm"
                  >
                    {i + 1}
                  </li>
                ))}
              </ul>
            )}
          </div>
          <Button
            onClick={() => {}}
            disabled={isLoading}
            className="px-2 py-1 border border-blue-400 text-blue-400 bg-transparent rounded hover:bg-blue-50 transition-colors text-xs w-12 sm:w-auto"
          >
            Filter
          </Button>
          <Button
            onClick={() => {
              setYear("");
              setMonth("");
              setDay("");
            }}
            disabled={isLoading}
            className="px-1 md:px-2 py-1 bg-gray-400 text-white rounded hover:bg-gray-500 transition-colors text-xs w-12 sm:w-auto"
          >
            Clear
          </Button>
        </div>
      </div>
      <div
        className={`overflow-x-auto pb-8 ${
          isTableModalOpen || isViewModalOpen || isEditModalOpen || isDeleteDialogOpen || isAddModalOpen ? "blur-md" : ""
        }`}
      >
        {(!data?.daily_data || data.daily_data.length === 0) ? (
          <div className="flex flex-col items-center justify-center py-6 bg-white rounded-lg border border-gray-200 shadow-sm mb-10 m-2">
            <div className="flex items-center justify-center w-16 h-16 rounded-full bg-blue-50 mb-4">
              <svg
                className="w-8 h-8 text-blue-400"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                viewBox="0 0 24 24"
              >
                <rect x="3" y="7" width="18" height="13" rx="2" stroke="currentColor" strokeWidth="2" fill="none" />
                <path d="M9 21V7M15 21V7M3 7h18" stroke="currentColor" strokeWidth="2" />
              </svg>
            </div>
            <h2 className="text-lg font-semibold text-gray-800 mb-1">No expenses found</h2>
            <p className="text-gray-500 mb-6 text-center max-w-xs">
              All your expense records will show up here. Add a new expense to get started.
            </p>
            <Button onClick={() => setIsAddModalOpen(true)}>Add Expense</Button>
          </div>
        ) : (
          data.daily_data.map((day) => (
            <div key={day.date} className="bg-white shadow-md overflow-auto mb-6">
              <div
                className="bg-white text-blue-20 px-4 py-2 border-b flex justify-between items-center cursor-pointer hover:bg-slate-300 hover:text-blue-20 w-full"
                onClick={() => toggleCollapse(day.date)}
              >
                <div className="flex items-center space-x-2">
                  <FontAwesomeIcon icon={collapsed[day.date] ? faChevronDown : faChevronUp} />
                  <h3 className="text-lg font-semibold" style={{ fontSize: "clamp(13.5px, 3vw, 15px)" }}>
                    {formatDate(day.date)}
                  </h3>
                </div>
                <p className="font-bold" style={{ fontSize: "clamp(13.5px, 3vw, 15px)" }}>
                  Total: ₦{formatNumber(day.daily_total)}
                </p>
              </div>

              {!collapsed[day.date] && (
                <div className="overflow-x-auto">
                  <table className="min-w-full">
                    <thead className="bg-gray-800">
                      <tr>
                        <th className="px-2 sm:px-4 py-2 sm:py-3 text-left text-xs font-bold text-blue-400 hidden sm:table-cell">
                          Date
                        </th>
                        <th className="px-2 sm:px-4 py-2 sm:py-3 text-left text-xs font-bold text-blue-400">
                          Name
                        </th>
                        <th className="px-2 sm:px-4 py-2 sm:py-3 text-left text-xs font-bold text-blue-400 hidden md:table-cell">
                          Category
                        </th>
                        <th className="px-2 sm:px-4 py-2 sm:py-3 text-left text-xs font-bold text-blue-400 hidden lg:table-cell">
                          Payment
                        </th>
                        <th className="px-2 sm:px-4 py-2 sm:py-3 text-left text-xs font-bold text-blue-400 hidden lg:table-cell">
                          Project
                        </th>
                        <th className="px-2 sm:px-4 py-2 sm:py-3 text-left text-xs font-bold text-blue-400 hidden lg:table-cell">
                          Shop Item
                        </th>
                        <th className="px-2 sm:px-4 py-2 sm:py-3 text-left text-xs font-bold text-blue-400 hidden lg:table-cell">
                          Product
                        </th>
                        <th className="px-2 sm:px-4 py-2 sm:py-3 text-left text-xs font-bold text-blue-400">
                          Amount
                        </th>
                        <th className="px-2 sm:px-4 py-2 sm:py-3 text-left text-xs font-bold text-blue-400 hidden sm:table-cell">
                          Qty
                        </th>
                        <th className="px-2 sm:px-4 py-2 sm:py-3 text-left text-xs font-bold text-blue-400">
                          Details
                        </th>
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
                            <td className="px-2 sm:px-4 py-2 sm:py-3 text-xs sm:text-sm hidden sm:table-cell">
                              {new Date(entry.date).toLocaleDateString()}
                            </td>
                            <td className="px-2 sm:px-4 py-2 sm:py-3 text-xs sm:text-sm font-medium">
                              {entry.name}
                            </td>
                            <td className="px-2 sm:px-4 py-2 sm:py-3 text-xs sm:text-sm hidden md:table-cell">
                              {entry.expense_category?.name || "N/A"}
                            </td>
                            <td className="px-2 sm:px-4 py-2 sm:py-3 text-xs sm:text-sm hidden lg:table-cell">
                              {entry.payment_method || "-"}
                            </td>
                            <td className="px-2 sm:px-4 py-2 sm:py-3 text-xs sm:text-sm hidden lg:table-cell">
                              {entry.linked_project?.name || "N/A"}
                            </td>
                            <td className="px-2 sm:px-4 py-2 sm:py-3 text-xs sm:text-sm hidden lg:table-cell">
                              {entry.sold_item?.name || "N/A"}
                            </td>
                            <td className="px-2 sm:px-4 py-2 sm:py-3 text-xs sm:text-sm hidden lg:table-cell">
                              {entry.linked_product?.name || "N/A"}
                            </td>
                            <td className="px-2 sm:px-4 py-2 sm:py-3 text-xs sm:text-sm font-medium">
                              ₦ {formatNumber(entry.amount)}
                            </td>
                            <td className="px-2 sm:px-4 py-2 sm:py-3 text-xs sm:text-sm hidden sm:table-cell">
                              {entry.quantity || "-"}
                            </td>
                            <td className="px-2 sm:px-4 py-2 sm:py-3 text-xs sm:text-sm">
                              <button
                                onClick={() => handleRowClick(entry)}
                                className="px-2 sm:px-3 py-1 text-blue-400 border-2 border-blue-400 rounded text-xs sm:text-sm"
                              >
                                View
                              </button>
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          ))
        )}
      </div>

      <Dialog open={isViewModalOpen} onOpenChange={setIsViewModalOpen}>
        <DialogContent className="w-[95vw] max-w-md mx-auto p-4 sm:p-6">
          <DialogHeader>
            <DialogTitle className="text-lg sm:text-xl">Expense Details</DialogTitle>
            <DialogDescription className="text-sm">View details for the selected expense.</DialogDescription>
          </DialogHeader>

          {selectedEntry && (
            <div className="grid grid-cols-2 gap-4 bg-white border border-gray-200 rounded-lg p-4 mb-4 shadow overflow-y-auto">
              <div className="flex flex-col gap-1">
                <span className="text-xs font-semibold text-black uppercase">Name</span>
                <span className="text-base font-bold text-black">{selectedEntry.name}</span>
              </div>
              <div className="flex flex-col gap-1">
                <span className="text-xs font-semibold text-black uppercase">Amount</span>
                <span className="text-base font-bold text-black">₦ {formatNumber(selectedEntry.amount)}</span>
              </div>
              <div className="flex flex-col gap-1">
                <span className="text-xs font-semibold text-black uppercase">Quantity</span>
                <span className="text-base font-bold text-black">{selectedEntry.quantity}</span>
              </div>
              <div className="flex flex-col gap-1">
                <span className="text-xs font-semibold text-black uppercase">Category</span>
                <span className="text-base font-bold text-black">{selectedEntry.expense_category?.name || "N/A"}</span>
              </div>
              <div className="flex flex-col gap-1">
                <span className="text-xs font-semibold text-black uppercase">Payment Method</span>
                <span className="text-base font-bold text-black">{selectedEntry.payment_method || "-"}</span>
              </div>
              <div className="flex flex-col gap-1">
                <span className="text-xs font-semibold text-black uppercase">Linked Project</span>
                <span className="text-base font-bold text-black">{selectedEntry.linked_project?.name || "N/A"}</span>
              </div>
              <div className="flex flex-col gap-1">
                <span className="text-xs font-semibold text-black uppercase">Linked Product</span>
                <span className="text-base font-bold text-black">{selectedEntry.linked_product?.name || "N/A"}</span>
              </div>
              <div className="flex flex-col gap-1">
                <span className="text-xs font-semibold text-black uppercase">Sold Item</span>
                <span className="text-base font-bold text-black">{selectedEntry.sold_item?.name || "N/A"}</span>
              </div>
              <div className="flex flex-col gap-1">
                <span className="text-xs font-semibold text-black uppercase">Date</span>
                <span className="text-base font-bold text-black">
                  {new Date(selectedEntry.date || "").toLocaleDateString()}
                </span>
              </div>
            </div>
          )}

          <DialogFooter>
            <div className="grid grid-cols-3 gap-2 w-full">
              <Button variant="outline" onClick={() => setIsViewModalOpen(false)} className="w-full text-sm">
                Close
              </Button>
                <Button variant="outline" onClick={handleEdit} className="w-full text-sm">
                  Edit
                </Button>
                <Button
                  variant="destructive"
                  onClick={handleDelete}
                  className="w-full text-sm"
                >
                  Delete
                </Button>
            </div>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {selectedEntry && isEditModalOpen && (
        <EditExpenseModal
          expense={entryToExpense(selectedEntry)}
          isOpen={isEditModalOpen}
          onOpenChange={setIsEditModalOpen}
          onSuccess={handleEditSuccess}
        />
      )}

      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent className="w-[95vw] max-w-md mx-auto p-4 sm:p-6">
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

      <AddExpenseModal isOpen={isAddModalOpen} onClose={() => setIsAddModalOpen(false)} onSuccess={() => setIsAddModalOpen(false)} />
    </div>
  );
};

export default ExpensesTable;