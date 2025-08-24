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
  faFilter,
} from "@fortawesome/free-solid-svg-icons";
import { useNavigate } from "react-router-dom";
import Modal from "@/pages/shop/Modal";
import removedData from "@/data/store-keeper-page/removed/removed.json";

const RemovedTable: React.FC = () => {
  document.title = "Removed Items - Inventory Admin";
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [filterLoading, setFilterLoading] = useState(false);
  const [removedDataState, setRemovedData] = useState<{ daily_data: any[] }>({
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

  useEffect(() => {
    const fetchItems = () => {
      setLoading(true);
      let filteredData = { ...removedData };
      if (year || month || day) {
        const filteredDailyData = removedData.daily_data.filter((dayData) => {
          const date = new Date(dayData.date);
          const matchesYear = year ? date.getFullYear().toString() === year : true;
          const matchesMonth = month ? (date.getMonth() + 1).toString() === month : true;
          const matchesDay = day ? date.getDate().toString() === day : true;
          return matchesYear && matchesMonth && matchesDay;
        });
        filteredData = { ...removedData, daily_data: filteredDailyData };
      }
      setRemovedData(filteredData);
      if (filteredData.daily_data && filteredData.daily_data.length > 0) {
        setOpenSections([filteredData.daily_data[0].date]);
      }
      setLoading(false);
    };

    fetchItems();

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
  }, [year, month, day]);

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

  const formatNumber = (number: number | string | undefined | null) => {
    if (number === undefined || number === null || number === "") {
      return "0";
    }
    const num = typeof number === "string" ? parseFloat(number.replace(/,/g, '')) : number;
    if (isNaN(num)) {
      return String(number);
    }
    if (Number.isFinite(num) && Math.floor(num) === num) {
      return num.toLocaleString("en-US", { maximumFractionDigits: 0 });
    }
    return num.toLocaleString("en-US", { maximumFractionDigits: 2 });
  };

  const handleFilter = async () => {
    setFilterLoading(true);
    setTimeout(() => {
      setFilterLoading(false);
    }, 500);
  };

  const handleClear = async () => {
    setFilterLoading(true);
    setYear('');
    setMonth('');
    setDay('');
    setTimeout(() => {
      setFilterLoading(false);
    }, 500);
  };

  const handleCloseModal = () => {
    setModalConfig({ ...modalConfig, isOpen: false });
    if (modalConfig.type === "success") {
      setRemovedData(removedData); // Simulate refresh
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
      setTimeout(() => {
        setModalConfig({
          isOpen: true,
          title: "Success",
          message: "Item deleted successfully",
          type: "success",
        });
        setConfirmDelete(false);
        setRemovedData(removedData); // Simulate refresh
      }, 1000);
    } catch (error) {
      setModalConfig({
        isOpen: true,
        title: "Error",
        message: "Failed to delete record",
        type: "error",
      });
      setConfirmDelete(false);
    }
  };

  const handleEdit = (id: number) => {
    navigate(`/store-keeper/edit-removed/${id}`);
  };

  return (
    <div className="p-2">
      <div className="flex flex-row justify-between items-center mb-2 sm:mb-4 gap-3 sm:gap-0">
        <h1
          style={{ fontSize: "clamp(16.5px, 3vw, 30px)" }}
          className="font-semibold py-3 sm:py-5 mt-2 sm:mt-0"
        >
          Removed Items
        </h1>
        <button
          onClick={() => navigate("/store-keeper/add-removed")}
          className="px-3 max-sm:px-2 py-1 md:py-2 max-md:px-0 border border-blue-400 text-blue-400 rounded hover:bg-blue-400 hover:text-white transition-colors text-sm sm:text-base w-auto outline-none focus:ring-2 focus:ring-blue-200"
        >
          <FontAwesomeIcon className="pr-2" icon={faPlus} />
          Remove Item
        </button>
      </div>
      <div className="flex w-full justify-end mb-4">
        <div className="flex flex-wrap items-center gap-2">
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
                  return <li key={i} onClick={() => { setYear(y.toString()); setIsYearOpen(false); }} className="p-1.5 sm:p-2 hover:bg-gray-200 cursor-pointer text-xs sm:text-sm">{y}</li>
                })}
              </ul>
            )}
          </div>
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
          <div className="relative w-20 sm:w-24 max-sm:w-14" ref={dayRef}>
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
          {removedDataState?.daily_data?.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-6 bg-white rounded-lg border border-gray-200 shadow-sm mb-10">
              <div className="flex items-center justify-center w-16 h-16 rounded-full bg-blue-50 mb-4">
                <svg className="w-8 h-8 text-blue-400" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 17v-2a2 2 0 012-2h2a2 2 0 012 2v2m-6 4h6a2 2 0 002-2V7a2 2 0 00-2-2h-1V3.5a1.5 1.5 0 00-3 0V5H9a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              </div>
              <h2 className="text-lg font-semibold text-gray-800 mb-1">No removed items found</h2>
              <p className="text-gray-500 mb-6 text-center max-w-xs">All removed items will show up here. Start by removing an item.</p>
            </div>
          ) : (
            removedDataState?.daily_data?.map((dayData: any) => (
              <div key={dayData.date} className="bg-white shadow-md rounded-none overflow-hidden">
                <div
                  className="bg-white text-blue-20 px-3 sm:px-4 py-2 border-b flex flex-row justify-between items-center cursor-pointer hover:bg-slate-200 gap-2 max-md:text-xs"
                  onClick={() => toggleDate(dayData.date)}
                >
                  <div className="flex items-center space-x-2">
                    <FontAwesomeIcon
                      icon={openSections.includes(dayData.date) ? faChevronUp : faChevronDown}
                      className="text-blue-400 max-md:text-xs"
                    />
                    <h2 className="text-base sm:text-lg font-semibold text-gray-700">
                      {formatDate(dayData.date)}
                    </h2>
                  </div>
                  <div className="text-left sm:text-right">
                    <p className="text-base sm:text-lg font-bold text-gray-700 max-md:text-xs">
                      Total: {formatCurrency(dayData.daily_total)}
                    </p>
                  </div>
                </div>
                {openSections.includes(dayData.date) && (
                  <div className="transition-max-height duration-500 ease-in-out overflow-hidden">
                    <div className="p-2 sm:p-4 overflow-x-auto">
                      <table className="min-w-full divide-y divide-gray-200 table-fixed">
                        <thead className="bg-gray-50">
                          <tr>
                            <th className="px-2 sm:px-4 py-2 sm:py-3 text-left text-xs font-bold text-blue-400 w-1/5">Name</th>
                            <th className="px-2 sm:px-4 py-2 sm:py-3 text-left text-xs font-bold text-blue-400 w-1/5">Qty</th>
                            <th className="px-2 sm:px-4 py-2 sm:py-3 text-left text-xs font-bold text-blue-400 max-md:table-cell hidden w-1/5">Product</th>
                            <th className="px-2 sm:px-4 py-2 sm:py-3 text-left text-xs font-bold text-blue-400 hidden sm:table-cell w-1/5">Cost/Unit</th>
                            <th className="px-2 sm:px-4 py-2 sm:py-3 text-left text-xs font-bold text-blue-400 hidden sm:table-cell w-1/5">Total</th>
                            <th className="px-2 sm:px-4 py-2 sm:py-3 text-left text-xs font-bold text-blue-400 hidden md:table-cell w-1/5">Product</th>
                            <th className="px-2 sm:px-4 py-2 sm:py-3 text-left text-xs font-bold text-blue-400 w-1/6">Actions</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200">
                          {dayData.entries.length === 0 ? (
                            <tr>
                              <td colSpan={7} className="text-center py-6 text-gray-500">
                                No removed items for this day.
                              </td>
                            </tr>
                          ) : (
                            dayData.entries.map((entry: any) => (
                              <tr key={entry.id} className="hover:bg-gray-50">
                                <td className="px-2 sm:px-4 py-2 sm:py-3 text-xs sm:text-sm cursor-pointer hover:text-blue-600 w-1/5">{entry.name}</td>
                                <td className="px-2 sm:px-4 py-2 sm:py-3 text-xs sm:text-sm w-1/5">{formatNumber(entry.quantity)}</td>
                                <td className="px-2 sm:px-4 py-2 sm:py-3 text-xs sm:text-sm max-md:table-cell hidden w-1/5">{entry.product_its_used?.name || "—"}</td>
                                <td className="px-2 sm:px-4 py-2 sm:py-3 text-xs sm:text-sm hidden sm:table-cell w-1/5">{formatCurrency(entry.price)}</td>
                                <td className="px-2 sm:px-4 py-2 sm:py-3 text-xs sm:text-sm hidden sm:table-cell w-1/5">{formatCurrency(parseFloat(entry.price) * parseFloat(entry.quantity))}</td>
                                <td className="px-2 sm:px-4 py-2 sm:py-3 text-xs sm:text-sm hidden md:table-cell w-1/5">{entry.product_its_used?.name || "—"}</td>
                                <td className="flex justify-evenly px-2 sm:px-4 py-2 sm:py-3 text-xs sm:text-sm text-blue-600">
                                  <FontAwesomeIcon onClick={() => handleEdit(entry.id)} className="pr-1 sm:pr-2 cursor-pointer hover:text-blue-500" icon={faPen} />
                                  <FontAwesomeIcon onClick={() => handleDeleteClick(entry.id)} className="cursor-pointer text-red-400" icon={faTrash} />
                                </td>
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
                size="2x"
                className="font-bold text-2xl text-gray-700 hover:text-red-500 transition-colors"
                onClick={() => setConfirmDelete(false)}
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