import { useEffect, useState, useRef } from "react";
import { ThreeDots } from "react-loader-spinner";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faPlus,
  faChevronDown,
  faChevronUp,
  faTrash,
  faPencil,
  faXmark,
  faFilter,
} from "@fortawesome/free-solid-svg-icons";
import { useNavigate } from "react-router-dom";
import Modal from "../../Modal";
import soldDataJson from "@/data/shop/sold/sold.json";

interface SoldEntry {
  id: number;
  quantity: string;
  date: string;
  sold_to: { id: number; name: string };
  item_sold: {
    id: number;
    dimensions: string;
    inventory_category: { id: number; name: string };
  };
  linked_project: { id: number; name: string };
  name: string;
  logistics: string;
  cost_price: string;
  selling_price: string;
  total_price: number;
  profit: number;
}

interface DailyData {
  date: string;
  entries: SoldEntry[];
  daily_total: number;
}

interface SelectedSale {
  id: number;
  name: string;
}

const SoldTable: React.FC = () => {
  document.title = "Sold Items - Admin Dashboard";
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

  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [soldData, setSoldData] = useState<DailyData[]>([]);
  const [monthlyTotal, setMonthlyTotal] = useState(0);
  const [openDates, setOpenDates] = useState<{ [key: string]: boolean }>({});
  const [showModal, setShowModal] = useState(false);
  const [selectedSale, setSelectedSale] = useState<SelectedSale | null>(null);
  const [modalConfig, setModalConfig] = useState({
    isOpen: false,
    title: "",
    message: "",
    type: "success" as "success" | "error",
  });
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [selectedItem, setSelectedItem] = useState<SoldEntry | null>(null);
  const [year, setYear] = useState<number | string>("");
  const [month, setMonth] = useState<number | string>("");
  const [day, setDay] = useState<number | string>("");
  const [userRole, setUserRole] = useState<string | null>(null);
  const [filterLoading, setFilterLoading] = useState(false);

  useEffect(() => {
    const role = localStorage.getItem("user_role");
    setUserRole(role);
  }, []);

  const formatNumber = (number: number | string | undefined | null) => {
    if (number === undefined || number === null || number === "") {
      return "0";
    }
    const num = typeof number === "string" ? parseFloat(number) : number;
    if (isNaN(num)) {
      return String(number);
    }
    return num.toLocaleString("en-US");
  };

  const [isYearOpen, setIsYearOpen] = useState(false);
  const [isMonthOpen, setIsMonthOpen] = useState(false);
  const [isDayOpen, setIsDayOpen] = useState(false);

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

  const fetchItems = () => {
    try {
      setLoading(true);
      let filteredData = soldDataJson.daily_data;

      if (year) {
        filteredData = filteredData.filter((day) =>
          new Date(day.date).getFullYear() === Number(year)
        );
      }
      if (month) {
        filteredData = filteredData.filter(
          (day) => new Date(day.date).getMonth() + 1 === Number(month)
        );
      }
      if (day) {
        filteredData = filteredData.filter(
          (day) => new Date(day.date).getDate() === Number(day)
        );
      }

      setSoldData(filteredData);
      setMonthlyTotal(soldDataJson.monthly_total || 0);

      if (filteredData.length > 0) {
        setOpenDates({ [filteredData[0].date]: true });
      } else {
        setOpenDates({});
      }
    } catch (error) {
      console.error("Error processing sold items:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleFilter = () => {
    setFilterLoading(true);
    fetchItems();
    setFilterLoading(false);
  };

  const handleClear = () => {
    setFilterLoading(true);
    setYear("");
    setMonth("");
    setDay("");
    fetchItems();
    setFilterLoading(false);
  };

  useEffect(() => {
    fetchItems();
  }, []);

  const toggleDate = (date: string) => {
    setOpenDates((prev) => ({
      ...prev,
      [date]: !prev[date],
    }));
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const handleCloseModal = () => {
    setModalConfig({ ...modalConfig, isOpen: false });
    if (modalConfig.type === "success") {
      fetchItems();
      setShowModal(false);
    }
  };

  const handleDelete = async (id: number) => {
    try {
      // Simulate deletion by filtering out the item
      const updatedData = {
        ...soldDataJson,
        daily_data: soldDataJson.daily_data.map((day) => ({
          ...day,
          entries: day.entries.filter((entry) => entry.id !== id),
        })),
      };
      console.log("Simulated DELETE with ID:", id);
      setModalConfig({
        isOpen: true,
        title: "Success",
        message: "Sale record deleted successfully",
        type: "success",
      });
    } catch (error) {
      console.error("Error deleting sale record:", error);
      setModalConfig({
        isOpen: true,
        title: "Error",
        message: "Failed to delete sale record.",
        type: "error",
      });
    }
  };

  const confirmDeleteSale = (id: number) => {
    setConfirmDelete(true);
    setSelectedSale({ id, name: selectedItem?.name || "" });
  };

  const handleConfirmDelete = async () => {
    setDeleteLoading(true);
    if (selectedSale) {
      await handleDelete(selectedSale.id);
      setConfirmDelete(false);
      setShowDetailsModal(false);
    }
    setDeleteLoading(false);
  };

  const handleViewDetails = (entry: SoldEntry) => {
    setSelectedItem(entry);
    setShowDetailsModal(true);
  };

  return (
    <div className="">
      <div className="flex flex-row justify-between items-center mb-2 sm:mb-4 gap-3 sm:gap-0">
        <h1
          style={{ fontSize: "clamp(16.5px, 3vw, 30px)" }}
          className="font-semibold py-3 sm:py-5 mt-2 sm:mt-0"
        >
          Sold Items
        </h1>
        <button
          onClick={() => navigate("/shop/add-new-sold-item")}
          className="px-3 max-sm:px-2 py-1 md:py-2 max-md:px-0 border border-blue-400 text-blue-400 rounded hover:bg-blue-400 hover:text-white transition-colors text-sm sm:text-base w-auto outline-none focus:ring-2 focus:ring-blue-200"
        >
          <FontAwesomeIcon className="pr-2" icon={faPlus} />
          Record Sale
        </button>
      </div>
      <div className="flex w-full justify-end mb-4">
        <div className="flex flex-wrap items-center gap-2">
          <div className="relative w-20 sm:w-24 max-sm:w-14" ref={yearRef}>
            <button
              onClick={() => setIsYearOpen(!isYearOpen)}
              className="p-1.5 sm:p-2 border rounded w-full text-left flex justify-between items-center text-xs sm:text-sm"
            >
              <span>{year || "Year"}</span>
              <FontAwesomeIcon
                icon={isYearOpen ? faChevronUp : faChevronDown}
                className="text-xs"
              />
            </button>
            {isYearOpen && (
              <ul className="absolute z-10 w-full bg-white border rounded mt-1 max-h-40 overflow-y-auto">
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
          <div className="relative w-24 sm:w-32" ref={monthRef}>
            <button
              onClick={() => setIsMonthOpen(!isMonthOpen)}
              className="p-1.5 sm:p-2 border rounded w-full text-left flex justify-between items-center text-xs sm:text-sm"
            >
              <span>{month ? months[Number(month) - 1] : "Month"}</span>
              <FontAwesomeIcon
                icon={isMonthOpen ? faChevronUp : faChevronDown}
                className="text-xs"
              />
            </button>
            {isMonthOpen && (
              <ul className="absolute z-10 w-full bg-white border rounded mt-1 max-h-40 overflow-y-auto">
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
          <div className="relative w-20 sm:w-24 max-sm:w-14" ref={dayRef}>
            <button
              onClick={() => setIsDayOpen(!isDayOpen)}
              className="p-1.5 sm:p-2 border rounded w-full text-left flex justify-between items-center text-xs sm:text-sm"
            >
              <span>{day || "Day"}</span>
              <FontAwesomeIcon
                icon={isDayOpen ? faChevronUp : faChevronDown}
                className="text-xs"
              />
            </button>
            {isDayOpen && (
              <ul className="absolute z-10 w-full bg-white border rounded mt-1 max-h-40 overflow-y-auto">
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
          <div className="flex justify-center items-center h-64">
            <ThreeDots
              height="80"
              width="80"
              color="#60A5FA"
              radius="9"
              ariaLabel="three-dots-loading"
            />
          </div>
        ) : soldData.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-6 bg-white rounded-lg border border-gray-200 shadow-sm mb-10">
            <div className="flex items-center justify-center w-16 h-16 rounded-full bg-pink-50 mb-4">
              <svg
                className="w-8 h-8 text-pink-400"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                viewBox="0 0 24 24"
              >
                <path
                  d="M5 8h14l-1.68 9.39A2 2 0 0 1 15.35 19H8.65a2 2 0 0 1-1.97-1.61L5 8zm2-3a3 3 0 0 1 6 0"
                  stroke="currentColor"
                  strokeWidth="2"
                  fill="none"
                />
              </svg>
            </div>
            <h2 className="text-lg font-semibold text-gray-800 mb-1">No sold items</h2>
            <p className="text-gray-500 mb-6 text-center max-w-xs">
              All your sold items will show up here. Add a new sale to get started.
            </p>
          </div>
        ) : (
          <div className="space-y-4 sm:space-y-6">
            {soldData.map((dayData) => (
              <div
                key={dayData.date}
                className="bg-white shadow-md rounded-lg overflow-hidden"
              >
                <div
                  className="bg-white text-blue-600 px-3 sm:px-4 py-2 border-b flex flex-row justify-between items-center cursor-pointer hover:bg-slate-200 gap-2 max-md:text-xs"
                  onClick={() => toggleDate(dayData.date)}
                >
                  <div className="flex items-center space-x-2">
                    <FontAwesomeIcon
                      icon={openDates[dayData.date] ? faChevronUp : faChevronDown}
                      className="text-blue-400 max-md:text-xs"
                    />
                    <h2 className="text-base sm:text-lg font-semibold text-gray-700">
                      {formatDate(dayData.date)}
                    </h2>
                  </div>
                  <div className="text-left sm:text-right">
                    <p className="text-base sm:text-lg font-bold text-gray-700 max-md:text-xs">
                      Total: ₦{formatNumber(dayData.daily_total)}
                    </p>
                  </div>
                </div>

                {openDates[dayData.date] && (
                  <div className="overflow-x-auto">
                    <table className="min-w-full bg-white shadow-md text-xs sm:text-sm">
                      <thead>
                        <tr className="bg-blue-400 text-white">
                          <th className="py-2 px-2 sm:py-4 sm:px-4 text-left font-semibold hidden lg:table-cell">
                            Date
                          </th>
                          <th className="py-2 px-2 sm:py-4 sm:px-4 text-left font-semibold">
                            Name
                          </th>
                          <th className="py-2 px-2 sm:py-4 sm:px-4 text-left font-semibold">
                            Quantity
                          </th>
                          <th className="py-2 px-2 sm:py-4 sm:px-4 text-left font-semibold hidden md:table-cell">
                            Sold To
                          </th>
                          <th className="py-2 px-2 sm:py-4 sm:px-4 text-left font-semibold hidden md:table-cell">
                            Profit
                          </th>
                          <th className="py-2 px-2 sm:py-4 sm:px-4 text-left font-semibold">
                            Actions
                          </th>
                        </tr>
                      </thead>
                      <tbody>
                        {dayData.entries.map((entry) => (
                          <tr key={entry.id} className="hover:bg-gray-50">
                            <td className="px-2 sm:px-4 py-2 sm:py-3 text-xs sm:text-sm hidden lg:table-cell">
                              {formatDate(entry.date)}
                            </td>
                            <td className="px-2 sm:px-4 py-2 sm:py-3 text-xs sm:text-sm">
                              {entry.name || "—"}
                            </td>
                            <td className="px-2 sm:px-4 py-2 sm:py-3 text-xs sm:text-sm">
                              {formatNumber(entry.quantity)}
                            </td>
                            <td className="px-2 sm:px-4 py-2 sm:py-3 text-xs sm:text-sm hidden md:table-cell">
                              {entry.sold_to?.name || "—"}
                            </td>
                            <td className="px-2 sm:px-4 py-2 sm:py-3 text-xs sm:text-sm hidden md:table-cell">
                              ₦{formatNumber(entry.profit)}
                            </td>
                            <td className="px-2 sm:px-4 py-2 sm:py-3 text-xs sm:text-sm text-blue-400">
                              <button
                                className="px-2 sm:px-3 py-1 text-blue-400 border-2 border-blue-400 rounded text-xs sm:text-sm"
                                onClick={() => handleViewDetails(entry)}
                              >
                                View
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      {showModal && selectedSale && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg p-4 sm:p-6 w-full max-w-sm">
            <div className="flex justify-between items-center">
              <h3 className="text-base sm:text-lg mb-3 sm:mb-4 font-medium">
                <span className="font-semibold text-blue-600">
                  {selectedSale.name || "—"}
                </span>
              </h3>
              <FontAwesomeIcon
                icon={faXmark}
                size="2x"
                className="font-bold text-2xl text-gray-700 hover:text-red-500 transition-colors"
                onClick={() => setShowModal(false)}
              />
            </div>
            <div className="space-y-2 sm:space-y-3">
              <button
                onClick={() => navigate(`/shop/edit-sold-item/${selectedSale.id}`)}
                className="w-full py-2 px-4 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors flex items-center justify-center text-sm sm:text-base"
              >
                <FontAwesomeIcon icon={faPencil} className="mr-2" />
                Edit Sale Record
              </button>
              <button
                onClick={() => confirmDeleteSale(selectedSale.id)}
                className="w-full py-2 px-4 bg-red-500 text-white rounded hover:bg-red-600 transition-colors flex items-center justify-center text-sm sm:text-base"
              >
                <FontAwesomeIcon icon={faTrash} className="mr-2" />
                Delete Sale Record
              </button>
            </div>
          </div>
        </div>
      )}

      {confirmDelete && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg p-4 sm:p-6 w-full max-w-sm">
            <div className="flex justify-between items-center">
              <h3 className="text-base sm:text-lg mb-3 sm:mb-4 font-medium">
                Confirm Deletion
              </h3>
              <FontAwesomeIcon
                icon={faXmark}
                size="2x"
                className="font-bold text-2xl text-gray-700 hover:text-red-500 transition-colors"
                onClick={() => setConfirmDelete(false)}
              />
            </div>
            <p className="text-sm sm:text-base">Are you sure you want to delete this sale record?</p>
            <div className="space-y-2 sm:space-y-3 mt-3 sm:mt-4">
              <button
                onClick={handleConfirmDelete}
                disabled={deleteLoading}
                className={`w-full py-2 px-4 bg-red-500 text-white rounded hover:bg-red-600 transition-colors flex items-center justify-center text-sm sm:text-base ${
                  deleteLoading ? "opacity-50 cursor-not-allowed" : ""
                }`}
              >
                {deleteLoading ? "Deleting..." : "Confirm"}
              </button>
              <button
                onClick={() => setConfirmDelete(false)}
                className="w-full py-2 px-4 bg-gray-300 text-black rounded hover:bg-gray-400 transition-colors flex items-center justify-center text-sm sm:text-base"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {showDetailsModal && selectedItem && !confirmDelete && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center">
          <div
            className="absolute inset-0 bg-black bg-opacity-40 backdrop-blur-sm"
            onClick={() => setShowDetailsModal(false)}
          ></div>
          <div
            className="relative w-[95vw] max-w-md mx-auto p-4 sm:p-6 bg-white border border-gray-200 rounded-lg shadow-lg z-10 overflow-y-auto"
            style={{ maxHeight: "80vh" }}
          >
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg sm:text-xl font-bold text-black">
                {selectedItem.name || "—"}
              </h2>
              <button
                onClick={() => setShowDetailsModal(false)}
                className="text-gray-500 hover:text-gray-700 focus:outline-none text-2xl font-bold"
                aria-label="Close"
              >
                ×
              </button>
            </div>
            <div className="grid grid-cols-2 gap-4 bg-white border border-gray-100 rounded-lg p-4 mb-4 shadow">
              <div className="flex flex-col gap-1">
                <span className="text-xs font-semibold text-black uppercase">Category</span>
                <span className="text-base font-bold text-black">
                  {selectedItem.item_sold?.inventory_category?.name || "—"}
                </span>
              </div>
              <div className="flex flex-col gap-1">
                <span className="text-xs font-semibold text-black uppercase">Date</span>
                <span className="text-base font-bold text-black">
                  {formatDate(selectedItem.date)}
                </span>
              </div>
              <div className="flex flex-col gap-1">
                <span className="text-xs font-semibold text-black uppercase">Dimensions</span>
                <span className="text-base font-bold text-black">
                  {selectedItem.item_sold?.dimensions || "—"}
                </span>
              </div>
              <div className="flex flex-col gap-1">
                <span className="text-xs font-semibold text-black uppercase">Quantity</span>
                <span className="text-base font-bold text-black">
                  {formatNumber(selectedItem.quantity)}
                </span>
              </div>
              <div className="flex flex-col gap-1">
                <span className="text-xs font-semibold text-black uppercase">Project</span>
                <span className="text-base font-bold text-black">
                  {selectedItem.linked_project?.name || "—"}
                </span>
              </div>
              <div className="flex flex-col gap-1">
                <span className="text-xs font-semibold text-black uppercase">Customer</span>
                <span className="text-base font-bold text-black">
                  {selectedItem.sold_to?.name || "—"}
                </span>
              </div>
              <div className="flex flex-col gap-1">
                <span className="text-xs font-semibold text-black uppercase">Logistics</span>
                <span className="text-base font-bold text-black">
                  {selectedItem.logistics ? `₦${formatNumber(selectedItem.logistics)}` : "—"}
                </span>
              </div>
              <div className="flex flex-col gap-1">
                <span className="text-xs font-semibold text-black uppercase">Cost Price</span>
                <span className="text-base font-bold text-black">
                  ₦{formatNumber(selectedItem.cost_price)}
                </span>
              </div>
              <div className="flex flex-col gap-1">
                <span className="text-xs font-semibold text-black uppercase">Selling Price</span>
                <span className="text-base font-bold text-black">
                  ₦{formatNumber(selectedItem.selling_price)}
                </span>
              </div>
              <div className="flex flex-col gap-1">
                <span className="text-xs font-semibold text-black uppercase">Profit</span>
                <span className="text-base font-bold text-black">
                  ₦{formatNumber(selectedItem.profit)}
                </span>
              </div>
            </div>
            {userRole === "ceo" && (
              <div className="flex flex-row space-x-2 mb-2">
                <button
                  onClick={() => navigate(`/shop/edit-sold-item/${selectedItem.id}`)}
                  className="w-full py-2 px-4 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors flex items-center justify-center text-sm sm:text-base"
                >
                  <FontAwesomeIcon icon={faPencil} className="mr-2" />
                  Edit Sale Record
                </button>
                <button
                  onClick={() => confirmDeleteSale(selectedItem.id)}
                  className="w-full py-2 px-4 bg-red-500 text-white rounded hover:bg-red-600 transition-colors flex items-center justify-center text-sm sm:text-base"
                >
                  <FontAwesomeIcon icon={faTrash} className="mr-2" />
                  Delete Sale Record
                </button>
              </div>
            )}
            <button
              onClick={() => setShowDetailsModal(false)}
              className="w-full mt-2 py-2 px-4 bg-gray-300 text-black rounded hover:bg-gray-400 transition-colors text-sm"
            >
              Close
            </button>
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

export default SoldTable;