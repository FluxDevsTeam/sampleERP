import React, { useEffect, useState, useRef } from "react";
import { ThreeDots } from "react-loader-spinner";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faChevronDown,
  faChevronUp,
  faPen,
  faTrash,
  faPlus,
  faXmark,
  faFilter,
} from "@fortawesome/free-solid-svg-icons";
import Modal from "@/pages/shop/Modal";
import { useNavigate } from "react-router-dom";

interface Material {
  id: number;
  name: string;
  unit: string;
}

interface MaterialEntry {
  id: number;
  material: Material | null;
  quantity: string;
  cost_price: string;
  date: string;
}

interface DailyData {
  date: string;
  entries: MaterialEntry[];
  daily_added_cost_total: number;
}

interface ApiResponse {
  yearly_added_material_count: number;
  yearly_added_total_cost: number;
  monthly_added_material_count: number;
  monthly_added_total_cost: number;
  daily_data: DailyData[];
  yearly_total: number;
}

const RecordRemovedTable: React.FC = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [filterLoading, setFilterLoading] = useState(false);
  const [materialData, setMaterialData] = useState<ApiResponse | null>(null);
  const [openDates, setOpenDates] = useState<{ [key: string]: boolean }>({});
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [selectedItem, setSelectedItem] = useState<number | null>(null);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [userRole, setUserRole] = useState<string | null>(null);
  const [year, setYear] = useState<number | string>("");
  const [month, setMonth] = useState<number | string>("");
  const [day, setDay] = useState<number | string>("");
  const [isYearOpen, setIsYearOpen] = useState(false);
  const [isMonthOpen, setIsMonthOpen] = useState(false);
  const [isDayOpen, setIsDayOpen] = useState(false);
  const [selectedEntry, setSelectedEntry] = useState<MaterialEntry | null>(null);

  const yearRef = useRef<HTMLDivElement>(null);
  const monthRef = useRef<HTMLDivElement>(null);
  const dayRef = useRef<HTMLDivElement>(null);

  const months = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];
  const [modalConfig, setModalConfig] = useState({
    isOpen: false,
    title: "",
    message: "",
    type: "success" as "success" | "error",
  });

  useEffect(() => {
    const role = localStorage.getItem("user_role");
    setUserRole(role);
    fetchData();

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

  const fetchData = async (filterYear?: number | string, filterMonth?: number | string, filterDay?: number | string) => {
    try {
      setLoading(true);
      let url = "https://backend.kidsdesigncompany.com/api/add-raw-materials/?";
      if (filterYear) url += `year=${filterYear}&`;
      if (filterMonth) url += `month=${filterMonth}&`;
      if (filterDay) url += `day=${filterDay}`;
      const response = await fetch(url, {
          method: "GET",
          headers: {
            Authorization: `JWT ${localStorage.getItem("accessToken")}`,
            "Content-Type": "application/json",
          },
        }
      );
      if (!response.ok) throw new Error("Failed to fetch data");
      const data = await response.json();
      setMaterialData(data);
      
      // Open the first date by default if there is data
      if (data.daily_data && data.daily_data.length > 0) {
        setOpenDates(prev => ({
          ...prev,
          [data.daily_data[0].date]: true
        }));
      }
    } catch (error) {
      console.error("Error:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleFilter = async () => {
    setFilterLoading(true);
    try {
      await fetchData(year, month, day);
    } finally {
      setFilterLoading(false);
    }
  };

  const handleClear = async () => {
    setFilterLoading(true);
    setYear("");
    setMonth("");
    setDay("");
    try {
      await fetchData();
    } finally {
      setFilterLoading(false);
    }
  };

  const toggleDate = (date: string) => {
    setOpenDates((prev) => ({ ...prev, [date]: !prev[date] }));
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const handleEdit = (id: number) => {
    navigate(`/store-keeper/edit-record-removed/${id}`);
  };

  const handleDeleteClick = (id: number) => {
    setSelectedItem(id);
    setConfirmDelete(true);
  };

  const handleDelete = async () => {
    if (!selectedItem) return;

    setDeleteLoading(true);
    try {
      const response = await fetch(
        `https://backend.kidsdesigncompany.com/api/add-raw-materials/${selectedItem}/`,
        {
          method: "DELETE",
          headers: {
            Authorization: `JWT ${localStorage.getItem("accessToken")}`,
          },
        }
      );

      if (!response.ok) {
        throw new Error("Failed to delete item");
      }

      setModalConfig({
        isOpen: true,
        title: "Success",
        message: "Item deleted successfully",
        type: "success",
      });
      // Redirect to the main record page after delete
      window.location.href = '/store-keeper/record-rm-added';
    } catch (error) {
      setModalConfig({
        isOpen: true,
        title: "Error",
        message: "Failed to delete item",
        type: "error",
      });
    } finally {
      setDeleteLoading(false);
      setConfirmDelete(false);
      setSelectedItem(null);
    }
  };

  const handleCloseModal = () => {
    setModalConfig({ ...modalConfig, isOpen: false });
  };

  return (
    <div className="">
      {/* Heading and Add Record button in the same row */}
      <div className="flex flex-row justify-between items-center mb-2 sm:mb-4 gap-3 sm:gap-0">
        <h1
          style={{ fontSize: "clamp(16.5px, 3vw, 30px)" }}
          className="font-semibold py-3 sm:py-5 mt-2 sm:mt-0"
        >
          Added Raw Materials
        </h1>
      <button
          onClick={() => navigate("/store-keeper/add-record-removed")}
          className="px-3 max-sm:px-2 py-1 md:py-2 max-md:px-0 border border-blue-400 text-blue-400 rounded hover:bg-blue-400 hover:text-white transition-colors text-sm sm:text-base w-auto outline-none focus:ring-2 focus:ring-blue-200"
        >
          <FontAwesomeIcon className="pr-2" icon={faPlus} />
          Add Record
        </button>
      </div>
      {/* Filter controls below and right-aligned */}
      <div className="flex w-full justify-end mb-4">
        <div className="flex flex-wrap items-center gap-2">
          {/* Year Dropdown */}
          <div className="relative w-20 sm:w-24 max-sm:w-14" ref={yearRef}>
            <button onClick={() => setIsYearOpen(!isYearOpen)} className="p-1.5 sm:p-2 border rounded w-full text-left flex justify-between items-center text-xs sm:text-sm">
              <span>{year || 'Year'}</span>
              <FontAwesomeIcon icon={isYearOpen ? faChevronUp : faChevronDown} className="text-xs" />
            </button>
            {isYearOpen && (
              <ul className="absolute z-10 w-full bg-white border rounded mt-1 max-h-40 overflow-y-auto">
                <li onClick={() => { setYear(''); setIsYearOpen(false); }} className="p-1.5 sm:p-2 hover:bg-gray-200 cursor-pointer text-xs sm:text-sm">Year</li>
                {[...Array(10)].map((_, i) => {
                  const y = new Date().getFullYear() - i;
                  return <li key={i} onClick={() => { setYear(y); setIsYearOpen(false); }} className="p-1.5 sm:p-2 hover:bg-gray-200 cursor-pointer text-xs sm:text-sm">{y}</li>
                })}
                </ul>
            )}
          </div>
          {/* Month Dropdown */}
          <div className="relative w-24 sm:w-32" ref={monthRef}>
            <button onClick={() => setIsMonthOpen(!isMonthOpen)} className="p-1.5 sm:p-2 border rounded w-full text-left flex justify-between items-center text-xs sm:text-sm">
              <span>{month ? months[Number(month) - 1] : 'Month'}</span>
              <FontAwesomeIcon icon={isMonthOpen ? faChevronUp : faChevronDown} className="text-xs" />
            </button>
            {isMonthOpen && (
              <ul className="absolute z-10 w-full bg-white border rounded mt-1 max-h-40 overflow-y-auto">
                <li onClick={() => { setMonth(''); setIsMonthOpen(false); }} className="p-1.5 sm:p-2 hover:bg-gray-200 cursor-pointer text-xs sm:text-sm">Month</li>
                  {months.map((m, i) => (
                  <li key={i} onClick={() => { setMonth(i + 1); setIsMonthOpen(false); }} className="p-1.5 sm:p-2 hover:bg-gray-200 cursor-pointer text-xs sm:text-sm">{m}</li>
                  ))}
                </ul>
            )}
          </div>
          {/* Day Dropdown */}
          <div className="relative w-20 sm:w-24 max-sm:w-14" ref={dayRef}>
            <button onClick={() => setIsDayOpen(!isDayOpen)} className="p-1.5 sm:p-2 border rounded w-full text-left flex justify-between items-center text-xs sm:text-sm">
              <span>{day || 'Day'}</span>
              <FontAwesomeIcon icon={isDayOpen ? faChevronUp : faChevronDown} className="text-xs" />
            </button>
            {isDayOpen && (
              <ul className="absolute z-10 w-full bg-white border rounded mt-1 max-h-40 overflow-y-auto">
                <li onClick={() => { setDay(''); setIsDayOpen(false); }} className="p-1.5 sm:p-2 hover:bg-gray-200 cursor-pointer text-xs sm:text-sm">Day</li>
                {[...Array(31)].map((_, i) => (
                  <li key={i} onClick={() => { setDay(i + 1); setIsDayOpen(false); }} className="p-1.5 sm:p-2 hover:bg-gray-200 cursor-pointer text-xs sm:text-sm">{i + 1}</li>
                  ))}
                </ul>
            )}
          </div>
          <button 
            onClick={handleFilter} 
            disabled={filterLoading}
            className={`p-1.5 sm:p-2 border border-blue-400 text-blue-400 rounded hover:bg-blue-400 hover:text-white transition-colors text-xs sm:text-sm outline-none focus:ring-2 focus:ring-blue-200 flex items-center justify-center ${
              filterLoading ? "opacity-50 cursor-not-allowed" : ""
            }`}
          >
            <span className="sm:hidden">
              <FontAwesomeIcon icon={faFilter} />
            </span>
            <span className="hidden sm:inline">{filterLoading ? "Filtering..." : "Filter"}</span>
          </button>
          <button 
            onClick={handleClear} 
            disabled={filterLoading}
            className={`p-1.5 sm:p-2 border border-gray-300 text-gray-700 rounded hover:bg-gray-300 hover:text-black transition-colors text-xs sm:text-sm outline-none focus:ring-2 focus:ring-blue-200 flex items-center justify-center ${
              filterLoading ? "opacity-50 cursor-not-allowed" : ""
            }`}
          >
            <span className="sm:hidden">
              <FontAwesomeIcon icon={faXmark} />
            </span>
            <span className="hidden sm:inline">{filterLoading ? "Clearing..." : "Clear"}</span>
          </button>
        </div>
      </div>
      
      <div className="overflow-x-auto pb-8">
        {loading ? (
          <div className="w-1/5 mx-auto">
            <ThreeDots
              visible={true}
              height="80"
              width="80"
              color="#60A5FA"
              radius="9"
            />
          </div>
        ) : materialData?.daily_data && materialData.daily_data.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-6 bg-white rounded-lg border border-gray-200 shadow-sm mb-10">
            <div className="flex items-center justify-center w-16 h-16 rounded-full bg-green-50 mb-4">
              {/* Box icon */}
              <svg className="w-8 h-8 text-green-400" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <rect x="3" y="7" width="18" height="13" rx="2" stroke="currentColor" strokeWidth="2" fill="none" />
                <path d="M16 3v4M8 3v4M3 7h18" stroke="currentColor" strokeWidth="2" />
              </svg>
            </div>
            <h2 className="text-lg font-semibold text-gray-800 mb-1">No raw material records</h2>
            <p className="text-gray-500 mb-6 text-center max-w-xs">All your added raw material records will show up here. Add a new record to get started.</p>
          </div>
        ) : (
          <div className="space-y-6">
            {/* <button
              onClick={() => navigate("/store-keeper/add-to-raw-material")}
              className="mb-4 px-4 py-2 bg-blue-400 text-white rounded mr-2 hover:bg-blue-500 transition-colors"
            >
              <FontAwesomeIcon className="pr-2" icon={faPlus} />
              Add Raw Material
            </button> */}
            {/* Daily Data Tables */}
            {materialData?.daily_data.map((dayData) => (
              <div
                key={dayData.date}
                className="bg-white shadow-md rounded-lg overflow-auto"
              >
                <div
                  className="bg-white text-blue-20 px-4 py-2 border-b flex justify-between items-center cursor-pointer hover:bg-slate-300 hover:text-blue-20 w-full"
                  onClick={() => toggleDate(dayData.date)}
                >
                  <div className="flex items-center space-x-2">
                    <FontAwesomeIcon
                      icon={
                        openDates[dayData.date] ? faChevronUp : faChevronDown
                      }
                    />
                    <h3
                      className="text-lg font-semibold"
                      style={{ fontSize: "clamp(13.5px, 3vw, 15px)" }}
                    >
                      {formatDate(dayData.date)}
                    </h3>
                  </div>
                  <p className="font-bold text-blue-20">
                    Total: ₦{dayData.daily_added_cost_total.toLocaleString()}
                  </p>
                </div>

                {openDates[dayData.date] && (
                  <table className="min-w-full overflow-auto">
                    <thead className="bg-blue-20 text-white">
                      <tr>
                        <th className="px-4 py-3 text-left text-xs font-bold hidden sm:table-cell">Date</th>
                        <th className="px-4 py-3 text-left text-xs font-bold">Material</th>
                        <th className="px-4 py-3 text-left text-xs font-bold">Quantity</th>
                        <th className="px-4 py-3 text-left text-xs font-bold">Details</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                      {dayData.entries.map((entry) => (
                        <tr key={entry.id} className="hover:bg-gray-50">
                          <td className="px-4 py-3 text-sm hidden sm:table-cell">{entry.date ? new Date(entry.date).toLocaleDateString() : "-"}</td>
                          <td className="px-4 py-3 text-sm">{entry.material?.name || "N/A"}</td>
                          <td className="px-4 py-3 text-sm">{entry.quantity}</td>
                          <td className="px-4 py-3 text-sm text-blue-600">
                            <button
                              className="px-2 py-1 border border-blue-400 text-blue-400 bg-white rounded hover:bg-blue-50 text-xs sm:text-sm"
                              onClick={() => setSelectedEntry(entry)}
                            >
                              Details
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Add confirmation modal */}
      {selectedEntry && !confirmDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black bg-opacity-40 backdrop-blur-sm" onClick={() => setSelectedEntry(null)}></div>
          <div className="relative z-10 bg-white rounded-xl p-6 sm:p-8 max-w-md w-full mx-2 border-2 border-black-200 shadow-2xl">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl sm:text-2xl font-bold text-blue-400">Raw Material Details</h2>
              <button
                onClick={() => setSelectedEntry(null)}
                className="text-black-400 hover:text-blue-400 focus:outline-none text-2xl font-bold"
                aria-label="Close"
              >
                &times;
              </button>
            </div>
            <div className="grid gap-y-2 gap-x-4 grid-cols-2">
              <div className="font-semibold text-black">Material:</div>
              <div className="text-black">{selectedEntry.material?.name || 'N/A'}</div>
              <div className="font-semibold text-black">Quantity:</div>
              <div className="text-black">{selectedEntry.quantity}</div>
              <div className="font-semibold text-black">Date:</div>
              <div className="text-black">{selectedEntry.date ? new Date(selectedEntry.date).toLocaleDateString() : '-'}</div>
              <div className="font-semibold text-black">Cost Price:</div>
              <div className="text-black">₦{selectedEntry.cost_price}</div>
              <div className="font-semibold text-black">Unit:</div>
              <div className="text-black">{selectedEntry.material?.unit || 'N/A'}</div>
            </div>
            <div className="flex flex-row justify-end gap-2 mt-6 w-full">
              {userRole === 'ceo' && (
                <>
                  <button
                    onClick={() => handleEdit(selectedEntry.id)}
                    className="w-full sm:w-auto py-2 px-4 border-2 border-blue-400 text-blue-400 rounded-lg font-semibold transition-colors hover:bg-blue-400 hover:text-white focus:ring-2 focus:ring-blue-200 text-sm"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => {
                      setSelectedItem(selectedEntry.id);
                      setConfirmDelete(true);
                    }}
                    className="w-full sm:w-auto py-2 px-4 border-2 border-red-400 text-red-400 rounded-lg font-semibold transition-colors hover:bg-red-400 hover:text-white focus:ring-2 focus:ring-red-200 text-sm"
                  >
                    Delete
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      )}
      {confirmDelete && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center">
          <div className="bg-black bg-opacity-50 absolute inset-0" />
          <div className="bg-white rounded-lg p-6 w-96 z-[101]">
            <h3 className="text-lg font-medium mb-4">Confirm Deletion</h3>
            <p className="mb-4">Are you sure you want to delete this item?</p>
            <div className="flex justify-end space-x-3">
              <button
                onClick={() => setConfirmDelete(false)}
                className="px-4 py-2 bg-gray-300 text-gray-700 rounded hover:bg-gray-400"
                disabled={deleteLoading}
              >
                {deleteLoading ? 'Please wait...' : 'Cancel'}
              </button>
              <button
                onClick={handleDelete}
                className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
                disabled={deleteLoading}
              >
                {deleteLoading ? 'Deleting...' : 'Delete'}
              </button>
            </div>
          </div>
        </div>
      )}

      <Modal
        isOpen={modalConfig.isOpen}
        onClose={handleCloseModal}
        title={modalConfig.title}
        message={modalConfig.message}
        type={modalConfig.type}
      />
    </div>
  );
};

export default RecordRemovedTable;
