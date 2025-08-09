import React, { useEffect, useRef, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import EditIncomeModal from "./EditIncomeModal";
import AddIncomeModal from "./AddIncomeModal";
import SkeletonLoader from "@/pages/admin/expenses/_components/SkeletonLoader";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faChevronDown, faChevronUp } from "@fortawesome/free-solid-svg-icons";

interface IncomeCategory { id: string; name: string; }

interface IncomeEntryApi {
  id?: number | string;
  uuid?: string;
  pk?: number | string;
  name: string;
  category: string | { name: string } | null; // supports uuid or object with name
  amount: string;
  cash: boolean;
  date: string;
}

interface DailyDataApi {
  date: string;
  entries: IncomeEntryApi[];
  daily_total?: number;
}

interface IncomeResponse {
  monthly_total: number;
  current_month_cash_total: number;
  current_month_bank_total: number;
  cash_at_hand: number;
  money_in_bank: number;
  daily_data: DailyDataApi[];
}

const fetchIncome = async (year: number | "", month: number | "", day: number | ""): Promise<IncomeResponse> => {
  const accessToken = localStorage.getItem("accessToken");
  const params = new URLSearchParams();
  if (year) params.append("year", String(year));
  if (month) params.append("month", String(month));
  if (day) params.append("day", String(day));
  const { data } = await axios.get<IncomeResponse>(`https://backend.kidsdesigncompany.com/api/income/?${params.toString()}`, {
    headers: { Authorization: `JWT ${accessToken}` },
  });
  return data;
};

const fetchIncomeCategoriesMap = async (): Promise<Record<string, IncomeCategory>> => {
  const token = localStorage.getItem("accessToken");
  const { data } = await axios.get<IncomeCategory[]>(`https://backend.kidsdesigncompany.com/api/income-category/`, {
    headers: { Authorization: `JWT ${token}` },
  });
  const map: Record<string, IncomeCategory> = {};
  data.forEach((c) => { map[c.id] = c; });
  return map;
};

interface IncomeTableProps { isTableModalOpen: boolean; }

const IncomeTable: React.FC<IncomeTableProps> = ({ isTableModalOpen }) => {
  const [year, setYear] = useState<number | "">("");
  const [month, setMonth] = useState<number | "">("");
  const [day, setDay] = useState<number | "">("");

  const { data, isLoading, error } = useQuery<IncomeResponse>({
    queryKey: ["income", year, month, day],
    queryFn: () => fetchIncome(year, month, day),
  });

  const { data: categoryMap } = useQuery<Record<string, IncomeCategory>>({
    queryKey: ["income-categories-map"],
    queryFn: async () => {
      const map = await fetchIncomeCategoriesMap();
      return map && typeof map === 'object' ? map : {};
    },
  });

  const [collapsed, setCollapsed] = useState<Record<string, boolean>>({});
  useEffect(() => {
    if (data?.daily_data?.length) {
      const init: Record<string, boolean> = {};
      data.daily_data.forEach((d, i) => { init[d.date] = i !== 0; });
      setCollapsed(init);
    }
  }, [data?.daily_data]);

  const queryClient = useQueryClient();
  const currentUserRole = localStorage.getItem("user_role");
  const isceo = currentUserRole === "ceo";

  const [selectedEntry, setSelectedEntry] = useState<IncomeEntryApi | null>(null);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  const yearRef = useRef<HTMLDivElement>(null);
  const monthRef = useRef<HTMLDivElement>(null);
  const dayRef = useRef<HTMLDivElement>(null);
  const [isYearOpen, setIsYearOpen] = useState(false);
  const [isMonthOpen, setIsMonthOpen] = useState(false);
  const [isDayOpen, setIsDayOpen] = useState(false);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (yearRef.current && !yearRef.current.contains(event.target as Node)) setIsYearOpen(false);
      if (monthRef.current && !monthRef.current.contains(event.target as Node)) setIsMonthOpen(false);
      if (dayRef.current && !dayRef.current.contains(event.target as Node)) setIsDayOpen(false);
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const deleteExpenseMutation = useMutation({
    mutationFn: async (entryId: number | string) => {
      const accessToken = localStorage.getItem("accessToken");
      await axios.delete(
        `https://backend.kidsdesigncompany.com/api/income/${entryId}/`,
        {
          headers: {
            Authorization: `JWT ${accessToken}`,
          },
        }
      );
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["income"] });
      setIsDeleteDialogOpen(false);
      setIsViewModalOpen(false);
      setSelectedEntry(null);
      toast.success("Income deleted successfully!");
    },
    onError: (error) => {
      console.error("Delete error:", error);
      toast.error("Failed to delete income. Please try again.");
    },
  });

  const formatNumber = (n: number | string | undefined | null) => {
    if (n === undefined || n === null || n === "") return "0";
    const num = typeof n === "string" ? parseFloat(n) : n;
    if (isNaN(num)) return "0";
    return num.toLocaleString("en-NG");
  };

  const formatDate = (dateString: string) => new Date(dateString).toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric" });

  const getCategoryName = (category: IncomeEntryApi["category"]) => {
    if (!category) return "N/A";
    if (typeof category === "string") {
      return categoryMap?.[category]?.name || category;
    }
    return category.name || "N/A";
  };

  const getEntryId = (entry: IncomeEntryApi): string | null => {
    const raw = entry?.id ?? entry?.uuid ?? entry?.pk;
    if (raw == null) return null;
    return String(raw);
  };

  if (isLoading) return <SkeletonLoader />;
  if (error) return <p className="text-red-600">Error: {(error as Error).message}</p>;

  return (
    <div className={`relative ${!data?.daily_data?.length ? 'min-h-[300px]' : ''}`}>
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4 gap-3 sm:gap-0">
        <div className="flex flex-row flex-wrap items-center gap-2 w-full mb-4 justify-end ml-auto">
          <div className="relative w-14 sm:w-20" ref={yearRef}>
            <button onClick={() => setIsYearOpen(!isYearOpen)} className="p-1.5 sm:p-2 border rounded w-full text-left flex justify-between items-center text-xs sm:text-sm">
              <span>{year || 'Year'}</span>
              <FontAwesomeIcon icon={isYearOpen ? faChevronUp : faChevronDown} className="text-xs" />
            </button>
            {isYearOpen && (
              <ul className="absolute z-[9999] w-full bg-white border rounded mt-1 max-h-40 overflow-y-auto shadow-lg">
                <li onClick={() => { setYear(''); setIsYearOpen(false); }} className="p-1.5 sm:p-2 hover:bg-gray-200 cursor-pointer text-xs sm:text-sm">Year</li>
                {[...Array(10)].map((_, i) => { const y = new Date().getFullYear() - i; return (
                  <li key={i} onClick={() => { setYear(y); setIsYearOpen(false); }} className="p-1.5 sm:p-2 hover:bg-gray-200 cursor-pointer text-xs sm:text-sm">{y}</li>
                );})}
              </ul>
            )}
          </div>
          <div className="relative w-20 sm:w-20" ref={monthRef}>
            <button onClick={() => setIsMonthOpen(!isMonthOpen)} className="p-1.5 sm:p-2 border rounded w-full text-left flex justify-between items-center text-xs sm:text-sm">
              <span>{month ? ["January","February","March","April","May","June","July","August","September","October","November","December"][Number(month)-1] : 'Month'}</span>
              <FontAwesomeIcon icon={isMonthOpen ? faChevronUp : faChevronDown} className="text-xs" />
            </button>
            {isMonthOpen && (
              <ul className="absolute z-[9999] w-full bg-white border rounded mt-1 max-h-40 overflow-y-auto shadow-lg">
                <li onClick={() => { setMonth(''); setIsMonthOpen(false); }} className="p-1.5 sm:p-2 hover:bg-gray-200 cursor-pointer text-xs sm:text-sm">Month</li>
                {["January","February","March","April","May","June","July","August","September","October","November","December"].map((m, i) => (
                  <li key={i} onClick={() => { setMonth(i+1); setIsMonthOpen(false); }} className="p-1.5 sm:p-2 hover:bg-gray-200 cursor-pointer text-xs sm:text-sm">{m}</li>
                ))}
              </ul>
            )}
          </div>
          <div className="relative w-12 sm:w-20" ref={dayRef}>
            <button onClick={() => setIsDayOpen(!isDayOpen)} className="p-1.5 sm:p-2 border rounded w-full text-left flex justify-between items-center text-xs sm:text-sm">
              <span>{day || 'Day'}</span>
              <FontAwesomeIcon icon={isDayOpen ? faChevronUp : faChevronDown} className="text-xs" />
            </button>
            {isDayOpen && (
              <ul className="absolute z-[9999] w-full bg-white border rounded mt-1 max-h-40 overflow-y-auto shadow-lg">
                <li onClick={() => { setDay(''); setIsDayOpen(false); }} className="p-1.5 sm:p-2 hover:bg-gray-200 cursor-pointer text-xs sm:text-sm">Day</li>
                {[...Array(31)].map((_, i) => (
                  <li key={i} onClick={() => { setDay(i+1); setIsDayOpen(false); }} className="p-1.5 sm:p-2 hover:bg-gray-200 cursor-pointer text-xs sm:text-sm">{i+1}</li>
                ))}
              </ul>
            )}
          </div>
          <Button onClick={() => queryClient.invalidateQueries({ queryKey: ["income"] })} disabled={isLoading} className="px-2 py-1 border border-blue-400 text-blue-400 bg-transparent rounded hover:bg-blue-50 transition-colors text-xs w-12 sm:w-auto">Filter</Button>
          <Button onClick={() => { setYear(''); setMonth(''); setDay(''); queryClient.invalidateQueries({ queryKey: ["income"] }); }} disabled={isLoading} className="px-1 md:px-2 py-1 bg-gray-400 text-white rounded hover:bg-gray-500 transition-colors text-xs w-12 sm:w-auto">Clear</Button>
        </div>
      </div>

      <div className={`overflow-x-auto pb-8 ${isTableModalOpen || isViewModalOpen || isEditModalOpen || isDeleteDialogOpen || isAddModalOpen ? 'blur-md' : ''}`}>
        {(!data?.daily_data || data.daily_data.length === 0) ? (
          <div className="flex flex-col items-center justify-center py-6 bg-white rounded-lg border border-gray-200 shadow-sm mb-10 m-2">
            <div className="flex items-center justify-center w-16 h-16 rounded-full bg-blue-50 mb-4">
              <svg className="w-8 h-8 text-blue-400" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <path d="M3 10h18M3 6h18M3 14h18M3 18h18" stroke="currentColor" strokeWidth="2" />
              </svg>
            </div>
            <h2 className="text-lg font-semibold text-gray-800 mb-1">No income found</h2>
            <p className="text-gray-500 mb-6 text-center max-w-xs">All your income records will show up here. Add a new income to get started.</p>
          </div>
        ) : (
          data.daily_data.map((dayData) => (
            <div key={dayData.date} className="bg-white shadow-md rounded-lg overflow-auto mb-6">
              <div className="bg-white text-blue-20 px-4 py-2 border-b flex justify-between items-center cursor-pointer hover:bg-slate-300 hover:text-blue-20 w-full" onClick={() => setCollapsed((p) => ({ ...p, [dayData.date]: !p[dayData.date] }))}>
                <div className="flex items-center space-x-2">
                  <FontAwesomeIcon icon={collapsed[dayData.date] ? faChevronDown : faChevronUp} />
                  <h3 className="text-lg font-semibold" style={{ fontSize: "clamp(13.5px, 3vw, 15px)" }}>{formatDate(dayData.date)}</h3>
                </div>
                <p className="font-bold" style={{ fontSize: "clamp(13.5px, 3vw, 15px)" }}>Total: ₦{formatNumber(dayData.daily_total)}</p>
              </div>
              {!collapsed[dayData.date] && (
                <div className="overflow-x-auto">
                  <table className="min-w-full">
                    <thead className="bg-gray-800">
                      <tr>
                        <th className="px-2 sm:px-4 py-2 sm:py-3 text-left text-xs font-bold text-blue-400 hidden sm:table-cell">Date</th>
                        <th className="px-2 sm:px-4 py-2 sm:py-3 text-left text-xs font-bold text-blue-400">Name</th>
                        <th className="px-2 sm:px-4 py-2 sm:py-3 text-left text-xs font-bold text-blue-400 hidden md:table-cell">Category</th>
                        <th className="px-2 sm:px-4 py-2 sm:py-3 text-left text-xs font-bold text-blue-400">Amount</th>
                        <th className="px-2 sm:px-4 py-2 sm:py-3 text-left text-xs font-bold text-blue-400 hidden sm:table-cell">Method</th>
                        <th className="px-2 sm:px-4 py-2 sm:py-3 text-left text-xs font-bold text-blue-400">Details</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                      {dayData.entries.length === 0 ? (
                        <tr>
                          <td colSpan={6} className="text-center py-6 text-gray-500">No income for this day.</td>
                        </tr>
                      ) : (
                        dayData.entries.map((entry) => (
                          <tr key={getEntryId(entry) ?? `${entry.name}-${entry.date}`} className="hover:bg-gray-50">
                            <td className="px-2 sm:px-4 py-2 sm:py-3 text-xs sm:text-sm hidden sm:table-cell">{new Date(entry.date).toLocaleDateString()}</td>
                            <td className="px-2 sm:px-4 py-2 sm:py-3 text-xs sm:text-sm font-medium">{entry.name}</td>
                            <td className="px-2 sm:px-4 py-2 sm:py-3 text-xs sm:text-sm hidden md:table-cell">{getCategoryName(entry.category)}</td>
                            <td className="px-2 sm:px-4 py-2 sm:py-3 text-xs sm:text-sm font-medium">₦ {formatNumber(entry.amount)}</td>
                            <td className="px-2 sm:px-4 py-2 sm:py-3 text-xs sm:text-sm hidden sm:table-cell">{entry.cash ? "Cash" : "Bank"}</td>
                            <td className="px-2 sm:px-4 py-2 sm:py-3 text-xs sm:text-sm">
                              <button onClick={() => { 
                                const rid = getEntryId(entry);
                                if (rid) {
                                  setSelectedEntry({ ...entry, id: rid });
                                  setIsViewModalOpen(true);
                                } else {
                                  toast.error('Missing entry ID; cannot open.');
                                }
                              }} className="px-2 sm:px-3 py-1 text-blue-400 border-2 border-blue-400 rounded text-xs sm:text-sm">View</button>
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
            <DialogTitle className="text-lg sm:text-xl">Income Details</DialogTitle>
            <DialogDescription className="text-sm">View details for the selected income.</DialogDescription>
          </DialogHeader>

          {selectedEntry && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 bg-white border border-gray-200 rounded-lg p-4 mb-4 shadow">
              <div className="flex flex-col gap-1">
                <span className="text-xs font-semibold text-black uppercase">Name</span>
                <span className="text-base font-bold text-black">{selectedEntry.name}</span>
              </div>
              <div className="flex flex-col gap-1">
                <span className="text-xs font-semibold text-black uppercase">Amount</span>
                <span className="text-base font-bold text-black">₦ {formatNumber(selectedEntry.amount)}</span>
              </div>
              <div className="flex flex-col gap-1">
                <span className="text-xs font-semibold text-black uppercase">Method</span>
                <span className="text-base font-bold text-black">{selectedEntry.cash ? "Cash" : "Bank"}</span>
              </div>
              <div className="flex flex-col gap-1">
                <span className="text-xs font-semibold text-black uppercase">Category</span>
                <span className="text-base font-bold text-black">{getCategoryName(selectedEntry.category)}</span>
              </div>
              <div className="flex flex-col gap-1">
                <span className="text-xs font-semibold text-black uppercase">Date</span>
                <span className="text-base font-bold text-black">{new Date(selectedEntry.date || '').toLocaleDateString()}</span>
              </div>
            </div>
          )}

          <DialogFooter>
            <div className="grid grid-cols-3 gap-2 w-full">
              <Button variant="outline" onClick={() => setIsViewModalOpen(false)} className="w-full text-sm">
                Close
              </Button>
              {isceo && (
                <Button variant="outline" onClick={() => {
                  setIsViewModalOpen(false);
                  setIsEditModalOpen(true);
                }} className="w-full text-sm">
                  Edit
                </Button>
              )}
              {isceo && (
                <Button variant="destructive" onClick={() => setIsDeleteDialogOpen(true)} disabled={deleteExpenseMutation.isPending} className="w-full text-sm">
                  Delete
                </Button>
              )}
            </div>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {selectedEntry && isEditModalOpen && (
        <EditIncomeModal
          entry={selectedEntry as any}
          isOpen={isEditModalOpen}
          onOpenChange={setIsEditModalOpen}
          onSuccess={() => {
            queryClient.invalidateQueries({ queryKey: ["income"] });
            setIsEditModalOpen(false);
            setSelectedEntry(null);
            toast.success("Income updated successfully!");
          }}
        />
      )}

      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent className="w-[95vw] max-w-md mx-auto p-4 sm:p-6">
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>This action cannot be undone. It will permanently delete the income.</AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={() => {
              const rid = selectedEntry ? getEntryId(selectedEntry) : null;
              if (rid) {
                deleteExpenseMutation.mutate(rid);
              } else {
                toast.error('Missing entry id; cannot delete.');
              }
            }}>Confirm</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <AddIncomeModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
      />
    </div>
  );
};

export default IncomeTable;


