import React, { useEffect, useState, useRef } from "react";
import { ThreeDots } from "react-loader-spinner";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faPlus,
  faChevronDown,
  faChevronUp,
  faTrash,
  faPencil,
  faXmark,
} from "@fortawesome/free-solid-svg-icons";
import { useNavigate } from "react-router-dom";
import Modal from "../../Modal";

interface InventoryCategory {
  id: number;
  name: string;
}
interface StockEntry {
  cost_price: string;
  date: string;
  id: number;
  inventory_item: {
    id: number;
    name: string;
    image: string;
    dimensions: string;

    inventory_category: InventoryCategory;
  };
  name: string;
  quantity: string;
}

interface DailyData {
  date: string;
  entries: StockEntry[];
  daily_added_cost_total: number;
}

interface ApiResponse {
  daily_data: DailyData[];
}

interface SelectedStock {
  id: number;
  name: string;
}

const StockTable: React.FC = () => {
  document.title = "Stock Items - KDC Admin";

  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [stockData, setStockData] = useState<DailyData[]>([]);
  const [userRole, setUserRole] = useState<string | null>(null);
  const [openDates, setOpenDates] = useState<{ [key: string]: boolean }>({});
  const [showModal, setShowModal] = useState(false);
  const [selectedStock, setSelectedStock] = useState<SelectedStock | null>(
    null
  );
  const [modalConfig, setModalConfig] = useState({
    isOpen: false,
    title: "",
    message: "",
    type: "success" as "success" | "error",
  });
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [selectedItem, setSelectedItem] = useState<StockEntry | null>(null);
  const [showImage, setShowImage] = useState(false);
  const [year, setYear] = useState<number | string>("");
  const [month, setMonth] = useState<number | string>("");
  const [day, setDay] = useState<number | string>("");
  const [isYearOpen, setIsYearOpen] = useState(false);
  const [isMonthOpen, setIsMonthOpen] = useState(false);
  const [isDayOpen, setIsDayOpen] = useState(false);
  const [filterLoading, setFilterLoading] = useState(false);

  const yearRef = useRef<HTMLDivElement>(null);
  const monthRef = useRef<HTMLDivElement>(null);
  const dayRef = useRef<HTMLDivElement>(null);

  const months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

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


  const handleFilter = () => {
    setFilterLoading(true);
    fetchItems(year, month, day);
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

  const formatNumber = (number: number | string | undefined | null) => {
    if (number === undefined || number === null || number === "") {
      return "0";
    }
    const num = typeof number === "string" ? parseFloat(number) : number;
    if (isNaN(num)) {
      return String(number);
    }
    // If the number is a float but has no decimal part, show as integer
    if (Number.isFinite(num) && Math.floor(num) === num) {
      return num.toLocaleString("en-US", { maximumFractionDigits: 0 });
    }
    // If the number is a float with .00, show as integer
    if (Number.isFinite(num) && Number(num) % 1 === 0) {
      return num.toLocaleString("en-US", { maximumFractionDigits: 0 });
    }
    // Otherwise, show as is (with up to 2 decimals)
    return num.toLocaleString("en-US", { maximumFractionDigits: 2 });
  };

  useEffect(() => {
    const role = localStorage.getItem("user_role");
    setUserRole(role);
  }, []);

  const fetchItems = async (filterYear?: number | string, filterMonth?: number | string, filterDay?: number | string) => {
    try {
      setLoading(true);
      let url = "https://backend.kidsdesigncompany.com/api/add-stock/?";
      if (filterYear) url += `year=${filterYear}&`;
      if (filterMonth) url += `month=${filterMonth}&`;
      if (filterDay) url += `day=${filterDay}`;

      const response = await fetch(
        url,{
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `JWT ${localStorage.getItem("accessToken")}`,
          },
        }
      );

      if (!response.ok) {
        throw new Error("Failed to fetch data");
      }

      const data: ApiResponse = await response.json();
      console.log(data);

      setStockData(data.daily_data);
      if (data.daily_data && data.daily_data.length > 0) {
        setOpenDates({ [data.daily_data[0].date]: true });
      }
    } catch (error) {
      console.error("Error fetching stock items:", error);
    } finally {
      setLoading(false);
    }
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

  const handleDelete = async (stockId: number) => {
    try {
      const response = await fetch(
        `https://backend.kidsdesigncompany.com/api/add-stock/${stockId}/`,
        {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
            Authorization: `JWT ${localStorage.getItem("accessToken")}`,
          },
        }
      );

      if (response.ok) {
        setModalConfig({
          isOpen: true,
          title: "Success",
          message: "Stock record deleted successfully",
          type: "success",
        });
      } else {
        throw new Error("Failed to delete stock record");
      }
    } catch (error) {
      console.error("Error deleting stock record:", error);
      setModalConfig({
        isOpen: true,
        title: "Error",
        message: "Failed to delete stock record.",
        type: "error",
      });
    }
  };

  const confirmDeleteStock = (id: number) => {
    setConfirmDelete(true);
    setSelectedStock({ id, name: selectedStock?.name || "" });
  };

  const handleConfirmDelete = async (
    e: React.MouseEvent<HTMLButtonElement>
  ) => {
    setDeleteLoading(true);
    await handleDelete(selectedStock?.id || 0);
    setDeleteLoading(false);
  };

  const handleViewDetails = (entry: StockEntry) => {
    setSelectedItem(entry);
    setShowDetailsModal(true);
    setShowImage(false); // Reset image visibility when opening modal
  };

  return (
    <div className="">
      {/* Heading and Add Stock button in the same row */}
      <div className="flex flex-row justify-between items-center mb-2 sm:mb-4 gap-3 sm:gap-0">
        <h1
          style={{ fontSize: "clamp(16.5px, 3vw, 30px)" }}
          className="font-semibold py-3 sm:py-5 mt-2 sm:mt-0"
        >
          Stocks Added
        </h1>
        <button
          onClick={() => navigate("/shop/add-new-stock")}
          className="px-3 max-sm:px-2 py-1 md:py-2 max-md:px-0 border border-blue-400 text-blue-400 rounded hover:bg-blue-400 hover:text-white transition-colors text-sm sm:text-base w-auto outline-none focus:ring-2 focus:ring-blue-200"
        >
          <FontAwesomeIcon className="pr-2" icon={faPlus} />
          Add Stock
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
              <FontAwesomeIcon icon={faPlus} />
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

      <div className={`overflow-x-auto pb-8`}>
        {loading ? (
          <div className="w-1/5 mx-auto">
            <ThreeDots
              visible={true}
              height="80"
              width="80"
              color="#60A5FA"
              radius="9"
              ariaLabel="three-dots-loading"
            />
          </div>
        ) : (
          <div className="space-y-6 ">
            {stockData.map((dayData) => (
              <div
                key={dayData.date}
                className="bg-white shadow-md rounded-lg overflow-auto"
              >
                <div
                  className="bg-gray-100 p-4 rounded-lg cursor-pointer flex justify-between items-center"
                  onClick={() => toggleDate(dayData.date)}
                >
                  <h3 className="text-lg font-semibold">{formatDate(dayData.date)}</h3>
                  <div className="flex items-center">
                    <span className="mr-4 font-semibold text-gray-700">
                      Total: ₦{formatNumber(dayData.daily_added_cost_total)}
                    </span>
                    <FontAwesomeIcon
                      icon={openDates[dayData.date] ? faChevronUp : faChevronDown}
                    />
                  </div>
                </div>

                {openDates[dayData.date] && (
                  <div className="overflow-x-auto">
                    <table className="min-w-full bg-white shadow-md rounded-lg overflow-hidden text-xs sm:text-sm">
                      <thead>
                        <tr className="bg-blue-400 text-white">
                          {/* Name column: always visible */}
                          <th className="py-2 px-2 sm:py-4 sm:px-4 text-left font-semibold">Name</th>
                          {/* Quantity: always visible on mobile, already hidden on mobile in original, so make visible */}
                          <th className="py-2 px-2 sm:py-4 sm:px-4 text-left font-semibold">Quantity</th>
                          {/* Date: hidden on mobile, visible on desktop */}
                          <th className="py-2 px-2 sm:py-4 sm:px-4 text-left font-semibold hidden sm:table-cell">Date</th>
                          {/* Category: hidden on mobile, visible on desktop */}
                          <th className="py-2 px-2 sm:py-4 sm:px-4 text-left font-semibold hidden sm:table-cell">Category</th>
                          {/* Actions: always visible */}
                          <th className="py-2 px-2 sm:py-4 sm:px-4 text-left font-semibold">Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {dayData.entries.map((entry, index) => (
                          <tr key={entry.id ?? index} className="hover:bg-gray-50">
                            {/* Name: always visible */}
                            <td className="px-2 sm:px-4 py-2 sm:py-3 text-xs sm:text-sm">{entry.name}</td>
                            {/* Quantity: always visible */}
                            <td className="px-2 sm:px-4 py-2 sm:py-3 text-xs sm:text-sm">{formatNumber(entry.quantity)}</td>
                            {/* Date: hidden on mobile, visible on desktop */}
                            <td className="px-2 sm:px-4 py-2 sm:py-3 text-xs sm:text-sm hidden sm:table-cell">{formatDate(entry.date)}</td>
                            {/* Category: hidden on mobile, visible on desktop */}
                            <td className="px-2 sm:px-4 py-2 sm:py-3 text-xs sm:text-sm hidden sm:table-cell">{entry.inventory_item && entry.inventory_item.inventory_category ? entry.inventory_item.inventory_category.name : 'N/A'}</td>
                            {/* Actions: always visible */}
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

            {stockData.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-6 bg-white rounded-lg border border-gray-200 shadow-sm mb-10">
                <div className="flex items-center justify-center w-16 h-16 rounded-full bg-green-50 mb-4">
                  {/* Box icon */}
                  <svg className="w-8 h-8 text-green-400" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                    <rect x="3" y="7" width="18" height="13" rx="2" stroke="currentColor" strokeWidth="2" fill="none" />
                    <path d="M16 3v4M8 3v4M3 7h18" stroke="currentColor" strokeWidth="2" />
                  </svg>
                </div>
                <h2 className="text-lg font-semibold text-gray-800 mb-1">No stock items</h2>
                <p className="text-gray-500 mb-6 text-center max-w-xs">All your stock items will show up here. Add a new stock item to get started.</p>
              </div>
            ) : (
              <div className="flex justify-between items-center mt-4">
                {/* delete and edit options modal */}
                {showModal && selectedStock && (
                  <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-lg p-4 sm:p-6 w-full max-w-sm">
                      <div className="flex justify-between items-center">
                        <h3 className="text-base sm:text-lg mb-3 sm:mb-4 font-medium">
                          <span className="font-semibold text-blue-20">
                            {selectedStock.name}
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
                          onClick={() =>
                            navigate(`/shop/edit-stock-item/${selectedStock.id}`)
                          }
                          className="w-full py-2 px-4 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors flex items-center justify-center text-sm sm:text-base"
                        >
                          <FontAwesomeIcon icon={faPencil} className="mr-2" />
                          Edit Stock Record
                        </button>
                        <button
                          onClick={() => confirmDeleteStock(selectedStock.id)}
                          className="w-full py-2 px-4 bg-red-500 text-white rounded hover:bg-red-600 transition-colors flex items-center justify-center text-sm sm:text-base"
                        >
                          <FontAwesomeIcon icon={faTrash} className="mr-2" />
                          Delete Stock Record
                        </button>
                      </div>
                    </div>
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
                      <p className="text-sm sm:text-base">Are you sure you want to delete this stock record?</p>
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
                  <div className={`fixed inset-0 z-50 flex items-center justify-center p-4`}>
                    <div className="absolute inset-0 bg-black bg-opacity-40 backdrop-blur-sm" onClick={() => setShowDetailsModal(false)}></div>
                    <div className="relative z-10 bg-white rounded-xl p-6 sm:p-8 max-w-md w-full mx-2 border-2 border-black-200 shadow-2xl">
                      <div className="flex justify-between items-center mb-4">
                        <h2 className="text-xl sm:text-2xl font-bold text-blue-400">Stock Details</h2>
                        <button
                          onClick={() => setShowDetailsModal(false)}
                          className="text-black-400 hover:text-blue-400 focus:outline-none text-2xl font-bold"
                          aria-label="Close"
                        >
                          &times;
                        </button>
                      </div>
                      <div className="grid gap-y-2 gap-x-4 grid-cols-2">
                        <div className="font-semibold text-black">Name:</div>
                        <div className="text-black">{selectedItem.name}</div>
                        <div className="font-semibold text-black">Quantity:</div>
                        <div className="text-black">{selectedItem.quantity}</div>
                        <div className="font-semibold text-black">Date:</div>
                        <div className="text-black">{formatDate(selectedItem.date)}</div>
                        <div className="font-semibold text-black">Cost Price:</div>
                        <div className="text-black">₦{selectedItem.cost_price}</div>
                        <div className="font-semibold text-black">Category:</div>
                        <div className="text-black">{selectedItem.inventory_item && selectedItem.inventory_item.inventory_category ? selectedItem.inventory_item.inventory_category.name : 'N/A'}</div>
                        <div className="font-semibold text-black">Dimensions:</div>
                        <div className="text-black">{selectedItem.inventory_item && selectedItem.inventory_item.dimensions ? selectedItem.inventory_item.dimensions : 'N/A'}</div>
                        {selectedItem.inventory_item && selectedItem.inventory_item.image && (
                          <>
                            <div className="font-semibold text-black">Image:</div>
                            <div>
                          <button
                            onClick={() => setShowImage(!showImage)}
                                className="mb-2 px-3 py-1.5 text-blue-500 border border-blue-500 rounded hover:bg-blue-50 text-xs sm:text-sm"
                          >
                            {showImage ? "Hide Image" : "View Image"}
                          </button>
                          {showImage && (
                            <img
                              src={selectedItem.inventory_item.image}
                              alt={selectedItem.name}
                              className="w-full h-32 sm:h-48 object-cover rounded-lg mt-2"
                            />
                          )}
                        </div>
                          </>
                        )}
                      </div>
                      {userRole === 'ceo' && (
                        <div className="mt-6 flex flex-row gap-2">
                          <button
                            onClick={() => navigate(`/shop/edit-stock-item/${selectedItem.id}`)}
                            className="flex-1 py-2 px-4 border-2 border-blue-400 text-blue-400 rounded-lg font-semibold transition-colors hover:bg-blue-400 hover:text-white focus:ring-2 focus:ring-blue-200 text-sm"
                          >
                            <FontAwesomeIcon className="pr-1 text-blue-400" icon={faPencil} />
                            Edit details
                          </button>
                          <button
                            onClick={() => confirmDeleteStock(selectedItem.id)}
                            className="flex-1 py-2 px-4 border-2 border-red-400 text-red-400 rounded-lg font-semibold transition-colors hover:bg-red-400 hover:text-white focus:ring-2 focus:ring-red-200 text-sm"
                          >
                            <FontAwesomeIcon className="pr-1 text-red-400" icon={faTrash} />
                            Delete Item
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        )}
      </div>

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

export default StockTable;
