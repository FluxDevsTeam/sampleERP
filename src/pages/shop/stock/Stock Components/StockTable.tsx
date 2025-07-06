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
    return num.toLocaleString("en-US");
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
    <div className="relative">
      <div className={`overflow-x-auto pb-8 ${confirmDelete ? "blur-sm" : ""}`}>
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
            <div className="flex justify-between items-center mb-4">
              <button
                onClick={() => navigate("/shop/add-new-stock-item")}
                className="px-4 py-2 bg-blue-400 text-white rounded hover:bg-blue-500 transition-colors"
              >
                <FontAwesomeIcon className="pr-2" icon={faPlus} />
                Add Stock
              </button>
              <div className="flex items-center space-x-2">
                {/* Year Dropdown */}
                <div className="relative w-24" ref={yearRef}>
                  <button onClick={() => setIsYearOpen(!isYearOpen)} className="p-2 border rounded w-full text-left flex justify-between items-center">
                    <span>{year || 'Year'}</span>
                    <FontAwesomeIcon icon={isYearOpen ? faChevronUp : faChevronDown} />
                  </button>
                  {isYearOpen && (
                    <ul className="absolute z-10 w-full bg-white border rounded mt-1 max-h-40 overflow-y-auto">
                      <li onClick={() => { setYear(''); setIsYearOpen(false); }} className="p-2 hover:bg-gray-200 cursor-pointer">Year</li>
                      {[...Array(10)].map((_, i) => {
                        const y = new Date().getFullYear() - i;
                        return <li key={i} onClick={() => { setYear(y); setIsYearOpen(false); }} className="p-2 hover:bg-gray-200 cursor-pointer">{y}</li>
                      })}
                    </ul>
                  )}
                </div>
                {/* Month Dropdown */}
                <div className="relative w-32" ref={monthRef}>
                  <button onClick={() => setIsMonthOpen(!isMonthOpen)} className="p-2 border rounded w-full text-left flex justify-between items-center">
                    <span>{month ? months[Number(month) - 1] : 'Month'}</span>
                    <FontAwesomeIcon icon={isMonthOpen ? faChevronUp : faChevronDown} />
                  </button>
                  {isMonthOpen && (
                    <ul className="absolute z-10 w-full bg-white border rounded mt-1 max-h-40 overflow-y-auto">
                      <li onClick={() => { setMonth(''); setIsMonthOpen(false); }} className="p-2 hover:bg-gray-200 cursor-pointer">Month</li>
                      {months.map((m, i) => (
                        <li key={i} onClick={() => { setMonth(i + 1); setIsMonthOpen(false); }} className="p-2 hover:bg-gray-200 cursor-pointer">{m}</li>
                      ))}
                    </ul>
                  )}
                </div>
                {/* Day Dropdown */}
                <div className="relative w-24" ref={dayRef}>
                  <button onClick={() => setIsDayOpen(!isDayOpen)} className="p-2 border rounded w-full text-left flex justify-between items-center">
                    <span>{day || 'Day'}</span>
                    <FontAwesomeIcon icon={isDayOpen ? faChevronUp : faChevronDown} />
                  </button>
                  {isDayOpen && (
                    <ul className="absolute z-10 w-full bg-white border rounded mt-1 max-h-40 overflow-y-auto">
                      <li onClick={() => { setDay(''); setIsDayOpen(false); }} className="p-2 hover:bg-gray-200 cursor-pointer">Day</li>
                      {[...Array(31)].map((_, i) => (
                        <li key={i} onClick={() => { setDay(i + 1); setIsDayOpen(false); }} className="p-2 hover:bg-gray-200 cursor-pointer">{i + 1}</li>
                      ))}
                    </ul>
                  )}
                </div>
                <button
                  onClick={handleFilter}
                  disabled={filterLoading}
                  className={`px-4 py-2 bg-blue-400 text-white rounded hover:bg-blue-500 transition-colors ${
                    filterLoading ? "opacity-50 cursor-not-allowed" : ""
                  }`}
                >
                  {filterLoading ? "Filtering..." : "Filter"}
                </button>
                <button
                  onClick={handleClear}
                  disabled={filterLoading}
                  className={`px-4 py-2 bg-gray-400 text-white rounded hover:bg-gray-500 transition-colors ${
                    filterLoading ? "opacity-50 cursor-not-allowed" : ""
                  }`}
                >
                  {filterLoading ? "Clearing..." : "Clear"}
                </button>
              </div>
            </div>

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
                    <table className="min-w-full">
                      <thead className="bg-gray-800">
                        <tr>
                          <th className="px-2 sm:px-4 py-2 sm:py-3 text-left text-xs font-bold text-blue-400">
                            Name
                          </th>
                          <th className="px-2 sm:px-4 py-2 sm:py-3 text-left text-xs font-bold text-blue-400">
                            Qty
                          </th>
                          <th className="px-2 sm:px-4 py-2 sm:py-3 text-left text-xs font-bold text-blue-400 hidden sm:table-cell">
                            Cost
                          </th>
                          <th className="px-2 sm:px-4 py-2 sm:py-3 text-left text-xs font-bold text-blue-400">
                            Details
                          </th>
                          {userRole === "ceo" && (
                            <th className="px-2 sm:px-4 py-2 sm:py-3 text-left text-xs font-bold text-blue-400">
                              Actions
                            </th>
                          )}
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-200">
                        {dayData.entries.map((entry, index) => (
                          <tr key={entry.id ?? index} className="hover:bg-gray-50">
                            <td className="px-2 sm:px-4 py-2 sm:py-3 text-xs sm:text-sm cursor-pointer hover:text-blue-600">
                              {entry.name}
                            </td>
                            <td className="px-2 sm:px-4 py-2 sm:py-3 text-xs sm:text-sm">
                              {formatNumber(entry.quantity)}
                            </td>
                            <td className="px-2 sm:px-4 py-2 sm:py-3 text-xs sm:text-sm hidden sm:table-cell">
                              ₦{formatNumber(entry.cost_price)}
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
                onClick={() => setShowModal(false)}
                className="cursor-pointer"
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
                onClick={() => setConfirmDelete(false)}
                className="cursor-pointer"
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

      {showDetailsModal && selectedItem && (
        <div
          className={`fixed inset-0 flex items-center justify-center z-100 p-4 ${
            confirmDelete ? "blur-sm" : ""
          }`}
        >
          <div
            className="absolute inset-0 bg-black opacity-50"
            onClick={() => setShowDetailsModal(false)}
          ></div>
          <div className="bg-white rounded-lg p-4 sm:p-6 max-w-sm w-full mx-2 sm:mx-4 border-2 border-gray-800 shadow-lg relative z-10">
            <div className="flex justify-between items-center mb-3 sm:mb-4">
              <h2 className="text-lg sm:text-xl md:text-2xl font-bold text-gray-20">
                {selectedItem.name}
              </h2>
              <button
                onClick={() => setShowDetailsModal(false)}
                className="text-gray-500 hover:text-gray-700 focus:outline-none"
              >
                ✕
              </button>
            </div>

            {selectedItem.inventory_item.image && (
              <div className="mb-3 sm:mb-4">
                <button
                  onClick={() => setShowImage(!showImage)}
                  className="mb-2 px-3 sm:px-4 py-1.5 sm:py-2 text-blue-500 border border-blue-500 rounded hover:bg-blue-50 text-xs sm:text-sm"
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
            )}

            <div className="space-y-2 sm:space-y-3">
              <p className="text-xs sm:text-sm">
                <span className="font-semibold">Quantity:</span>{" "}
                {selectedItem.quantity}
              </p>
              <p className="text-xs sm:text-sm">
                <span className="font-semibold">Date:</span>{" "}
                {formatDate(selectedItem.date)}
              </p>
              <p className="text-xs sm:text-sm">
                <span className="font-semibold">Cost Price:</span> ₦
                {selectedItem.cost_price}
              </p>
              <p className="text-xs sm:text-sm">
                <span className="font-semibold">Inventory Category:</span>{" "}
                {selectedItem.inventory_item.inventory_category.name}
              </p>
              <p className="text-xs sm:text-sm">
                <span className="font-semibold">Dimensions:</span>{" "}
                {selectedItem.inventory_item.dimensions}
              </p>
            </div>

            {userRole === 'ceo' && (
              <div className="mt-3 sm:mt-4 space-y-2 sm:space-y-0 sm:space-x-2 flex flex-col sm:flex-row">
                <button
                  onClick={() =>
                    navigate(`/shop/edit-stock-item/${selectedItem.id}`)
                  }
                  className="pt-1.5 sm:pt-2 pr-2 sm:pr-3 p-1.5 sm:p-2 text-blue-400 rounded-lg border-2 border-blue-400 font-bold text-xs sm:text-sm"
                >
                  <FontAwesomeIcon
                    className="pr-1 text-blue-400"
                    icon={faPencil}
                  />
                  Edit details
                </button>
                <button
                  onClick={() => confirmDeleteStock(selectedItem.id)}
                  className="pt-1.5 sm:pt-2 pr-2 sm:pr-3 p-1.5 sm:p-2 text-red-400 rounded-lg border-2 border-red-400 font-bold text-xs sm:text-sm"
                >
                  <FontAwesomeIcon className="pr-1 text-red-400" icon={faTrash} />
                  Delete Item
                </button>
              </div>
            )}
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

export default StockTable;
