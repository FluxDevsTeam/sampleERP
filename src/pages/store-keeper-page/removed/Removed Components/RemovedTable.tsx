import { useEffect, useState, useRef } from "react";
import { ThreeDots } from "react-loader-spinner";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faPlus,
  faChevronDown,
  faChevronUp,
  faTrash,
  faXmark,
  faPen,
} from "@fortawesome/free-solid-svg-icons";
import { useNavigate } from "react-router-dom";
import Modal from "@/pages/shop/Modal";

const RemovedTable: React.FC = () => {
  document.title = "Removed Items | Kids Design Company";
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [filterLoading, setFilterLoading] = useState(false);

  const [removedData, setRemovedData] = useState<{ daily_data: any[] }>({
    daily_data: [],
  });
  const [modalConfig, setModalConfig] = useState({
    isOpen: false,
    title: "",
    message: "",
    type: "success" as "success" | "error",
  });

  const [selectedItemId, setSelectedItemId] = useState<number | null>(null);
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [openSections, setOpenSections] = useState<string[]>([]);
  const [userRole, setUserRole] = useState<string | null>(null);
  const [year, setYear] = useState<string>("");
  const [month, setMonth] = useState<string>("");
  const [day, setDay] = useState<string>("");
  const [isYearOpen, setIsYearOpen] = useState(false);
  const [isMonthOpen, setIsMonthOpen] = useState(false);
  const [isDayOpen, setIsDayOpen] = useState(false);

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

  const fetchItems = async (filterYear?: string, filterMonth?: string, filterDay?: string) => {
    try {
      setLoading(true);
      let url = "https://backend.kidsdesigncompany.com/api/removed/?";
      if (filterYear) url += `year=${filterYear}&`;
      if (filterMonth) url += `month=${filterMonth}&`;
      if (filterDay) url += `day=${filterDay}`;
      const response = await fetch(url, {
        method: "GET",
        headers: {
          Authorization: `JWT ${localStorage.getItem("accessToken")}`,
        },
      });

      const logData = await response.json();

      if (!response.ok) {
        throw new Error("Network response was not ok");
      }

      setRemovedData(logData);

      if (logData.daily_data && logData.daily_data.length > 0) {
        setOpenSections([logData.daily_data[0].date]);
      }
    } catch (error) {
      console.error("Error fetching items:", error);
    } finally {
      setLoading(false);
    }
  };

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

  useEffect(() => {
    const role = localStorage.getItem("user_role");
    setUserRole(role);
    fetchItems();
  }, []);

  const formatCurrency = (amount: number | string | null | undefined) => {
    if (amount === null || amount === undefined || amount === '') {
      return "—";
    }
    const numericAmount = typeof amount === 'string' ? parseFloat(amount) : amount;
    if (isNaN(numericAmount)) {
      return "—";
    }
    return `₦${numericAmount.toLocaleString()}`;
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const handleFilter = async () => {
    setFilterLoading(true);
    try {
      await fetchItems(year, month, day);
    } finally {
      setFilterLoading(false);
    }
  };

  const handleClear = async () => {
    setFilterLoading(true);
    setYear('');
    setMonth('');
    setDay('');
    try {
      await fetchItems();
    } finally {
      setFilterLoading(false);
    }
  };

  const handleCloseModal = () => {
    setModalConfig({ ...modalConfig, isOpen: false });
    if (modalConfig.type === "success") {
      fetchItems();
    }
  };

  const toggleDate = (date: string) => {
    setOpenSections((prevOpenSections) => {
      if (prevOpenSections.includes(date)) {
        return prevOpenSections.filter((d) => d !== date);
      } else {
        return [...prevOpenSections, date];
      }
    });
  };

  const handleDeleteClick = (id: number) => {
    setSelectedItemId(id);
    setConfirmDelete(true);
  };

  const handleDelete = async () => {
    try {
      const response = await fetch(
        `https://backend.kidsdesigncompany.com/api/removed/${selectedItemId}/`,
        {
          method: "DELETE",
          headers: {
            Authorization: `JWT ${localStorage.getItem("accessToken")}`,
          },
        }
      );

      if (response.ok) {
        setModalConfig({
          isOpen: true,
          title: "Success",
          message: "Item deleted successfully",
          type: "success",
        });
        setConfirmDelete(false);
        fetchItems(); // Refresh the list after deletion
      } else {
        throw new Error("Failed to delete item");
      }
    } catch (error) {
      console.error(error);
      setModalConfig({
        isOpen: true,
        title: "Error",
        message: "Failed to delete record",
        type: "error",
      });
    }
  };

  const handleEdit = (id: number) => {
    navigate(`/store-keeper/edit-removed/${id}`);
  };

  return (
    <div className="p-2 sm:p-4 md:p-8">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4 sm:mb-8 gap-3 sm:gap-0">
        <button
          onClick={() => navigate("/store-keeper/add-removed")}
          className="px-3 sm:px-4 py-2 bg-blue-400 text-white rounded hover:bg-blue-500 transition-colors text-sm sm:text-base w-full sm:w-auto"
        >
          <FontAwesomeIcon className="pr-2" icon={faPlus} />
          Remove Item
        </button>
        <div className="flex flex-wrap items-center gap-2 w-full sm:w-auto">
          {/* Year Dropdown */}
          <div className="relative w-20 sm:w-24" ref={yearRef}>
            <button onClick={() => setIsYearOpen(!isYearOpen)} className="p-1.5 sm:p-2 border rounded w-full text-left flex justify-between items-center text-xs sm:text-sm">
              <span>{year || 'Year'}</span>
              <FontAwesomeIcon icon={isYearOpen ? faChevronUp : faChevronDown} className="text-xs" />
            </button>
            {isYearOpen && (
              <ul className="absolute z-10 w-full bg-white border rounded mt-1 max-h-40 overflow-y-auto">
                <li onClick={() => { setYear(''); setIsYearOpen(false); }} className="p-1.5 sm:p-2 hover:bg-gray-200 cursor-pointer text-xs sm:text-sm">Year</li>
                {[...Array(10)].map((_, i) => {
                  const y = new Date().getFullYear() - i;
                  return <li key={i} onClick={() => { setYear(y.toString()); setIsYearOpen(false); }} className="p-1.5 sm:p-2 hover:bg-gray-200 cursor-pointer text-xs sm:text-sm">{y}</li>
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
                  <li key={i} onClick={() => { setMonth((i + 1).toString()); setIsMonthOpen(false); }} className="p-1.5 sm:p-2 hover:bg-gray-200 cursor-pointer text-xs sm:text-sm">{m}</li>
                ))}
              </ul>
            )}
          </div>
          {/* Day Dropdown */}
          <div className="relative w-20 sm:w-24" ref={dayRef}>
            <button onClick={() => setIsDayOpen(!isDayOpen)} className="p-1.5 sm:p-2 border rounded w-full text-left flex justify-between items-center text-xs sm:text-sm">
              <span>{day || 'Day'}</span>
              <FontAwesomeIcon icon={isDayOpen ? faChevronUp : faChevronDown} className="text-xs" />
            </button>
            {isDayOpen && (
              <ul className="absolute z-10 w-full bg-white border rounded mt-1 max-h-40 overflow-y-auto">
                <li onClick={() => { setDay(''); setIsDayOpen(false); }} className="p-1.5 sm:p-2 hover:bg-gray-200 cursor-pointer text-xs sm:text-sm">Day</li>
                {[...Array(31)].map((_, i) => (
                  <li key={i} onClick={() => { setDay((i + 1).toString()); setIsDayOpen(false); }} className="p-1.5 sm:p-2 hover:bg-gray-200 cursor-pointer text-xs sm:text-sm">{i + 1}</li>
                ))}
              </ul>
            )}
          </div>
          <button 
            onClick={handleFilter} 
            disabled={filterLoading}
            className={`p-1.5 sm:p-2 bg-blue-400 text-white rounded hover:bg-blue-500 text-xs sm:text-sm ${
              filterLoading ? "opacity-50 cursor-not-allowed" : ""
            }`}
          >
            {filterLoading ? "Filtering..." : "Filter"}
          </button>
          <button 
            onClick={handleClear} 
            disabled={filterLoading}
            className={`p-1.5 sm:p-2 bg-gray-300 text-gray-700 rounded hover:bg-gray-400 text-xs sm:text-sm ${
              filterLoading ? "opacity-50 cursor-not-allowed" : ""
            }`}
          >
            {filterLoading ? "Clearing..." : "Clear"}
          </button>
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center items-center h-64">
          <ThreeDots
            height="80"
            width="80"
            color="#60A5FA"
            radius="9"
            ariaLabel="three-dots-loading"
          />
        </div>
      ) : (
        <div className="space-y-4 sm:space-y-6">
          {removedData?.daily_data?.length === 0 ? (
            <div className="text-center text-gray-500 py-8">No removed items found.</div>
          ) : (
            removedData?.daily_data?.map((dayData: any) => (
              <div key={dayData.date} className="bg-white shadow-md rounded-lg overflow-hidden">
                <div
                  className="bg-white text-blue-20 px-3 sm:px-4 py-2 border-b flex flex-col sm:flex-row sm:justify-between sm:items-center cursor-pointer hover:bg-slate-200 gap-2"
                  onClick={() => toggleDate(dayData.date)}
                >
                  <div className="flex items-center space-x-2">
                    <FontAwesomeIcon
                      icon={openSections.includes(dayData.date) ? faChevronUp : faChevronDown}
                      className="text-blue-400"
                    />
                    <h2 className="text-base sm:text-lg font-semibold text-gray-700">
                      {formatDate(dayData.date)}
                    </h2>
                  </div>
                  <div className="text-left sm:text-right">
                    <p className="text-base sm:text-lg font-bold text-gray-700">
                      Total: {formatCurrency(dayData.daily_total)}
                    </p>
                  </div>
                </div>
                {openSections.includes(dayData.date) && (
                  <div className="transition-max-height duration-500 ease-in-out overflow-hidden">
                    <div className="p-2 sm:p-4 overflow-x-auto">
                      <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                          <tr>
                            <th className="px-2 sm:px-4 py-2 sm:py-3 text-left text-xs font-bold text-blue-400">Name</th>
                            <th className="px-2 sm:px-4 py-2 sm:py-3 text-left text-xs font-bold text-blue-400">Qty</th>
                            <th className="px-2 sm:px-4 py-2 sm:py-3 text-left text-xs font-bold text-blue-400 hidden sm:table-cell">Cost/Unit</th>
                            <th className="px-2 sm:px-4 py-2 sm:py-3 text-left text-xs font-bold text-blue-400">Total</th>
                            <th className="px-2 sm:px-4 py-2 sm:py-3 text-left text-xs font-bold text-blue-400 hidden md:table-cell">Product</th>
                            <th className="px-2 sm:px-4 py-2 sm:py-3 text-left text-xs font-bold text-blue-400 hidden lg:table-cell">Progress</th>
                            {userRole === 'ceo' && <th className="px-2 sm:px-4 py-2 sm:py-3 text-left text-xs font-bold text-blue-400">Actions</th>}
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200">
                          {dayData.entries.length === 0 ? (
                            <tr>
                              <td colSpan={userRole === 'ceo' ? 7 : 6} className="text-center py-6 text-gray-500">
                                No removed items for this day.
                              </td>
                            </tr>
                          ) : (
                            dayData.entries.map((entry: any) => (
                              <tr key={entry.id} className="hover:bg-gray-50">
                                <td className="px-2 sm:px-4 py-2 sm:py-3 text-xs sm:text-sm cursor-pointer hover:text-blue-600">{entry.name}</td>
                                <td className="px-2 sm:px-4 py-2 sm:py-3 text-xs sm:text-sm">{entry.quantity}</td>
                                <td className="px-2 sm:px-4 py-2 sm:py-3 text-xs sm:text-sm hidden sm:table-cell">{formatCurrency(entry.price)}</td>
                                <td className="px-2 sm:px-4 py-2 sm:py-3 text-xs sm:text-sm">{formatCurrency(parseFloat(entry.price) * parseFloat(entry.quantity))}</td>
                                <td className="px-2 sm:px-4 py-2 sm:py-3 text-xs sm:text-sm hidden md:table-cell">{entry.product_its_used.name || "—"}</td>
                                <td className="px-2 sm:px-4 py-2 sm:py-3 text-xs sm:text-sm hidden lg:table-cell">{entry.product_its_used.progress}%</td>
                                {userRole === 'ceo' && (
                                  <td className="flex justify-evenly px-2 sm:px-4 py-2 sm:py-3 text-xs sm:text-sm text-blue-600">
                                    <>
                                      <FontAwesomeIcon onClick={() => handleEdit(entry.id)} className="pr-1 sm:pr-2 cursor-pointer hover:text-blue-500" icon={faPen} />
                                      <FontAwesomeIcon onClick={() => handleDeleteClick(entry.id)} className="cursor-pointer text-red-400" icon={faTrash} />
                                    </>
                                  </td>
                                )}
                              </tr>
                            ))
                          )}
                        </tbody>
                      </table>
                    </div>
                  </div>
                )}

              </div>
            ))
          )}
        </div>
      )}

      {confirmDelete && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg p-4 sm:p-6 w-full max-w-sm">
            <div className="flex justify-between items-center">
              <h3 className="text-base sm:text-lg mb-3 sm:mb-4 font-medium">Confirm Deletion</h3>
              <FontAwesomeIcon
                icon={faXmark}
                onClick={() => setConfirmDelete(false)}
                className="cursor-pointer"
              />
            </div>
            <p className="text-sm sm:text-base">Are you sure you want to delete this item?</p>
            <div className="space-y-2 sm:space-y-3 mt-3 sm:mt-4">
              <button
                onClick={handleDelete}
                className="w-full py-2 px-4 bg-red-500 text-white rounded hover:bg-red-600 transition-colors text-sm sm:text-base"
              >
                Confirm
              </button>
              <button
                onClick={() => setConfirmDelete(false)}
                className="w-full py-2 px-4 bg-gray-300 text-black rounded hover:bg-gray-400 transition-colors text-sm sm:text-base"
              >
                Cancel
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

export default RemovedTable;
