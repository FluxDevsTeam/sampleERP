import React, { useState, useRef, useEffect } from "react";
import { useQuery, useQueryClient, useMutation } from "@tanstack/react-query";
import axios from "axios";
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
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faChevronDown,
  faChevronUp,
} from "@fortawesome/free-solid-svg-icons";
import { fetchPaidEntries, PaidSummary, PaidEntry, DailyPaidData } from "../_api/apiService";
import AddPaidModal from "./AddPaidModal";
import EditPaidModal from "./EditPaidModal";

interface PaidTableProps {
  isTableModalOpen: boolean;
}

const PaidTable: React.FC<PaidTableProps> = ({
  isTableModalOpen,
}) => {
  const [year, setYear] = useState<number | ''>( '');
  const [month, setMonth] = useState<number | ''>( '');
  const [day, setDay] = useState<number | ''>( '');

  const { data, isLoading, error } = useQuery<PaidSummary>({ 
    queryKey: ["paid", year, month, day],
    queryFn: () => fetchPaidEntries(year, month, day),
  });

  const [collapsed, setCollapsed] = useState<{ [key: string]: boolean }>({});
  const queryClient = useQueryClient();
  const currentUserRole = localStorage.getItem("user_role");
  const isceo = currentUserRole === "ceo";

  // Modal states
  const [selectedEntry, setSelectedEntry] = useState<PaidEntry | null>(null);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

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

  // Effect to collapse all but the first item on data load
  useEffect(() => {
    if (data?.daily_data && data.daily_data.length > 0) {
      const newCollapsedState: { [key: string]: boolean } = {};
      data.daily_data.forEach((entry, index) => {
        newCollapsedState[entry.date] = (index !== 0); // Keep only the first item uncollapsed
      });
      setCollapsed(newCollapsedState);
    }
  }, [data]);

  // Ensure only the first day's table is open, others are collapsed
  useEffect(() => {
    if (data?.daily_data && data.daily_data.length > 0) {
      const initialCollapsedState: { [key: string]: boolean } = {};
      data.daily_data.forEach((day, index) => {
        initialCollapsedState[day.date] = index !== 0;
      });
      setCollapsed(initialCollapsedState);
    }
  }, [data?.daily_data]);

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

  // Delete mutation (if applicable for paid entries)
  const deletePaidEntryMutation = useMutation({
    mutationFn: async (entryId: number) => {
      const accessToken = localStorage.getItem("accessToken");
      // Replace with your actual paid entry deletion endpoint
      await axios.delete(
        `https://backend.kidsdesigncompany.com/api/paid/${entryId}/`,
        {
          headers: {
            Authorization: `JWT ${accessToken}`,
          },
        }
      );
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["paid"] });
      setIsDeleteDialogOpen(false);
      setIsViewModalOpen(false);
      setSelectedEntry(null);
      toast.success("Paid entry deleted successfully!");
    },
    onError: (error) => {
      console.error("Delete error:", error);
      toast.error("Failed to delete paid entry. Please try again.");
    },
  });

  // Event handlers
  const handleRowClick = (entry: PaidEntry) => {
    setSelectedEntry(entry);
    setIsViewModalOpen(true);
  };

  const handleDelete = () => {
    setIsDeleteDialogOpen(true);
  };

  const handleEdit = () => {
    setIsViewModalOpen(false); // Close view modal before opening edit modal
    setIsEditModalOpen(true);
  };

  const confirmDelete = () => {
    if (selectedEntry?.id) {
      deletePaidEntryMutation.mutate(selectedEntry.id);
    }
  };

  const toggleCollapse = (date: string) => {
    setCollapsed((prev) => ({ ...prev, [date]: !prev[date] }));
  };

  const closeAllModals = () => {
    setIsViewModalOpen(false);
    setIsDeleteDialogOpen(false);
    setIsEditModalOpen(false);
    setSelectedEntry(null);
  };

  if (isLoading) return <SkeletonLoader />;
  if (error)
    return <p className="text-red-600">Error: {(error as Error).message}</p>;

  return (
    <div className={`relative ${!data?.daily_data?.length ? 'min-h-[300px]' : ''}`}>
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center md:mb-4 mb-14 gap-3 sm:gap-0">
        <Button onClick={() => setIsAddModalOpen(true)} className="px-3 py-2 sm:px-4 sm:py-2 bg-blue-400 text-white rounded hover:bg-blue-500 transition-colors text-sm">
          Record Payment
        </Button>
        <div className="flex flex-wrap items-center gap-2 w-full sm:w-auto">
          {/* Year Dropdown */}
          <div className="relative w-20 sm:w-24" ref={yearRef}>
            <button
              onClick={() => setIsYearOpen(!isYearOpen)}
              className="p-1.5 sm:p-2 border rounded w-full text-left flex justify-between items-center text-xs sm:text-sm"
            >
              <span>{year || 'Year'}</span>
              <FontAwesomeIcon icon={isYearOpen ? faChevronUp : faChevronDown} className="text-xs" />
            </button>
            {isYearOpen && (
              <ul className="absolute z-[9999] w-full bg-white border rounded mt-1 max-h-40 overflow-y-auto shadow-lg">
                <li onClick={() => { setYear(''); setIsYearOpen(false); }} className="p-1.5 sm:p-2 hover:bg-gray-200 cursor-pointer text-xs sm:text-sm">Year</li>
                {[...Array(10)].map((_, i) => {
                  const y = new Date().getFullYear() - i;
                  return (
                    <li key={i} onClick={() => { setYear(y); setIsYearOpen(false); }} className="p-1.5 sm:p-2 hover:bg-gray-200 cursor-pointer text-xs sm:text-sm">
                      {y}
                    </li>
                  );
                })}
              </ul>
            )}
          </div>
          {/* Month Dropdown */}
          <div className="relative w-24 sm:w-32" ref={monthRef}>
            <button
              onClick={() => setIsMonthOpen(!isMonthOpen)}
              className="p-1.5 sm:p-2 border rounded w-full text-left flex justify-between items-center text-xs sm:text-sm"
            >
              <span>{month ? months[Number(month) - 1] : 'Month'}</span>
              <FontAwesomeIcon icon={isMonthOpen ? faChevronUp : faChevronDown} className="text-xs" />
            </button>
            {isMonthOpen && (
              <ul className="absolute z-[9999] w-full bg-white border rounded mt-1 max-h-40 overflow-y-auto shadow-lg">
                <li onClick={() => { setMonth(''); setIsMonthOpen(false); }} className="p-1.5 sm:p-2 hover:bg-gray-200 cursor-pointer text-xs sm:text-sm">Month</li>
                {months.map((m, i) => (
                  <li key={i} onClick={() => { setMonth(i + 1); setIsMonthOpen(false); }} className="p-1.5 sm:p-2 hover:bg-gray-200 cursor-pointer text-xs sm:text-sm">
                    {m}
                  </li>
                ))}
              </ul>
            )}
          </div>
          {/* Day Dropdown */}
          <div className="relative w-16 sm:w-24" ref={dayRef}>
            <button
              onClick={() => setIsDayOpen(!isDayOpen)}
              className="p-1.5 sm:p-2 border rounded w-full text-left flex justify-between items-center text-xs sm:text-sm"
            >
              <span>{day || 'Day'}</span>
              <FontAwesomeIcon icon={isDayOpen ? faChevronUp : faChevronDown} className="text-xs" />
            </button>
            {isDayOpen && (
              <ul className="absolute z-[9999] w-full bg-white border rounded mt-1 max-h-40 overflow-y-auto shadow-lg">
                <li onClick={() => { setDay(''); setIsDayOpen(false); }} className="p-1.5 sm:p-2 hover:bg-gray-200 cursor-pointer text-xs sm:text-sm">Day</li>
                {[...Array(31)].map((_, i) => (
                  <li key={i} onClick={() => { setDay(i + 1); setIsDayOpen(false); }} className="p-1.5 sm:p-2 hover:bg-gray-200 cursor-pointer text-xs sm:text-sm">
                    {i + 1}
                  </li>
                ))}
              </ul>
            )}
          </div>
          <Button onClick={() => queryClient.invalidateQueries({ queryKey: ["paid"] })} disabled={isLoading} className="px-1 py-1 md:px-4 md:py-2 bg-blue-400 text-white rounded hover:bg-blue-500 transition-colors text-xs md:text-sm">Filter</Button>
          <Button onClick={() => { setYear(''); setMonth(''); setDay(''); queryClient.invalidateQueries({ queryKey: ["paid"] }); }} disabled={isLoading} className="px-1 py-1 md:px-4 md:py-2 bg-gray-400 text-white rounded hover:bg-gray-500 transition-colors text-xs md:text-sm">Clear</Button>
        </div>
      </div>
      <div className={`overflow-x-auto pb-8 ${isTableModalOpen || isViewModalOpen || isDeleteDialogOpen ? 'blur-md' : ''}`}>
        {(!data?.daily_data || data.daily_data.length === 0) ? (
          <div className="flex flex-col items-center justify-center py-6 bg-white rounded-lg border border-gray-200 shadow-sm mb-10">
            <div className="flex items-center justify-center w-16 h-16 rounded-full bg-blue-50 mb-4">
              {/* SVG icon for receipt */}
              <svg className="w-8 h-8 text-blue-400" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 17v-2a2 2 0 012-2h2a2 2 0 012 2v2m-6 4h6a2 2 0 002-2V7a2 2 0 00-2-2h-1V3.5a1.5 1.5 0 00-3 0V5H9a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            </div>
            <h2 className="text-lg font-semibold text-gray-800 mb-1">No paid entries found</h2>
            <p className="text-gray-500 mb-6 text-center max-w-xs">All your paid entries for this month will show up here. Start by adding a new paid entry.</p>
          </div>
        ) : (
          data.daily_data.map((day) => (
            <div
              key={day.date}
              className="bg-white shadow-md rounded-lg overflow-auto mb-6"
            >
              <div
                className="bg-white text-blue-20 px-2 sm:px-4 py-2 border-b flex justify-between items-center cursor-pointer hover:bg-slate-300 hover:text-blue-20 w-full"
                onClick={() => toggleCollapse(day.date)}
              >
                <div className="flex items-center space-x-2">
                  <FontAwesomeIcon
                    icon={collapsed[day.date] ? faChevronDown : faChevronUp}
                  />
                  <h3
                    className="text-base sm:text-lg font-semibold"
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
                <div className="overflow-x-auto">
                  <table className="min-w-full text-xs sm:text-sm">
                    <thead className="bg-gray-800">
                      <tr>
                        <th className="px-2 py-2 sm:px-4 sm:py-3 text-left font-bold text-blue-400 hidden sm:table-cell">Date</th>
                        <th className="px-2 py-2 sm:px-4 sm:py-3 text-left font-bold text-blue-400">Name</th>
                        <th className="px-2 py-2 sm:px-4 sm:py-3 text-left font-bold text-blue-400">Amount</th>
                        <th className="px-2 py-2 sm:px-4 sm:py-3 text-left font-bold text-blue-400">Details</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                      {day.entries.length === 0 ? (
                        <tr>
                          <td colSpan={4} className="text-center py-6 text-gray-500 text-sm">
                            No paid entries for this day.
                          </td>
                        </tr>
                      ) : (
                        day.entries.map((entry) => {
                          const workerName = entry.salary_detail 
                            ? `${entry.salary_detail.first_name} ${entry.salary_detail.last_name}`
                            : entry.contractor_detail
                            ? `${entry.contractor_detail.first_name} ${entry.contractor_detail.last_name}`
                            : "N/A";

                          return (
                            <tr key={entry.id} className="hover:bg-gray-50">
                              <td className="px-2 py-2 sm:px-4 sm:py-3 hidden sm:table-cell">{new Date(entry.date).toLocaleDateString()}</td>
                              <td className="px-2 py-2 sm:px-4 sm:py-3 font-medium">{workerName}</td>
                              <td className="px-2 py-2 sm:px-4 sm:py-3 font-medium">₦ {formatNumber(entry.amount)}</td>
                              <td className="px-2 py-2 sm:px-4 sm:py-3">
                                <button
                                  onClick={() => handleRowClick(entry)}
                                  className="px-2 py-1 sm:px-3 sm:py-1 text-blue-400 border-2 border-blue-400 rounded text-xs sm:text-sm"
                                >
                                  View
                                </button>
                              </td>
                            </tr>
                          );
                        })
                      )}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          ))
        )}
      </div>

      {/* View Paid Entry Modal */}
      <Dialog open={isViewModalOpen} onOpenChange={setIsViewModalOpen}>
        <DialogContent className="w-[95vw] max-w-md mx-auto p-4 sm:p-6">
          <DialogHeader>
            <DialogTitle className="text-lg sm:text-xl">Paid Entry Details</DialogTitle>
            <DialogDescription className="text-sm">View details for the selected paid entry.</DialogDescription>
          </DialogHeader>

          {selectedEntry && (
            <div className="bg-white border border-gray-200 rounded-lg p-4 mb-4 shadow grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="flex flex-col gap-1">
                <span className="text-xs font-semibold text-black uppercase">Name</span>
                <span className="text-base font-bold text-black">
                  {selectedEntry.salary_detail 
                    ? `${selectedEntry.salary_detail.first_name} ${selectedEntry.salary_detail.last_name}`
                    : selectedEntry.contractor_detail
                    ? `${selectedEntry.contractor_detail.first_name} ${selectedEntry.contractor_detail.last_name}`
                    : "N/A"}
                </span>
              </div>
              <div className="flex flex-col gap-1">
                <span className="text-xs font-semibold text-black uppercase">Amount</span>
                <span className="text-base font-bold text-black">₦ {formatNumber(selectedEntry.amount)}</span>
              </div>
              <div className="flex flex-col gap-1">
                <span className="text-xs font-semibold text-black uppercase">Date</span>
                <span className="text-base font-bold text-black">{new Date(selectedEntry.date).toLocaleDateString()}</span>
              </div>
            </div>
          )}

          <DialogFooter>
            <div className="w-full grid grid-cols-3 gap-2">
              <Button variant="outline" onClick={() => setIsViewModalOpen(false)} className="w-full text-sm">
                Close
              </Button>
              {isceo ? (
                <Button variant="secondary" onClick={handleEdit} className="w-full text-sm">
                  Edit
                </Button>
              ) : <div />}
              {isceo ? (
                <Button variant="destructive" onClick={handleDelete} disabled={deletePaidEntryMutation.isPending} className="w-full text-sm">
                  Delete
                </Button>
              ) : <div />}
            </div>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. It will permanently delete the paid entry.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={confirmDelete}>Confirm</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <AddPaidModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onSuccess={() => queryClient.invalidateQueries({ queryKey: ["paid"] })}
      />

      <EditPaidModal
        isOpen={isEditModalOpen}
        onClose={() => closeAllModals()}
        onSuccess={() => queryClient.invalidateQueries({ queryKey: ["paid"] })}
        entry={selectedEntry}
      />
    </div>
  );
};

export default PaidTable;
