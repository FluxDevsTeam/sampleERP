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
} from "@fortawesome/free-solid-svg-icons";
import { useNavigate } from "react-router-dom";
import Modal from "../../Modal";

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

interface ApiResponse {
  daily_data: DailyData[];
  monthly_total: number;
}

interface SelectedSale {
  id: number;
  name: string;
}

const SoldTable: React.FC = () => {
  document.title = "Sold Items - KDC Admin";
  const months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

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
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);


  const fetchItems = async (filterYear?: number | string, filterMonth?: number | string, filterDay?: number | string) => {
    try {
      setLoading(true);
      let url = "https://backend.kidsdesigncompany.com/api/sold/?";
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

      setSoldData(data.daily_data);
      setMonthlyTotal(data.monthly_total);

      if (data.daily_data && data.daily_data.length > 0) {
        setOpenDates({ [data.daily_data[0].date]: true });
      } else {
        setOpenDates({});
      }
    } catch (error) {
      console.error("Error fetching sold items:", error);
    } finally {
      setLoading(false);
    }
  };

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
      const response = await fetch(
        `https://backend.kidsdesigncompany.com/api/sold/${id}/`,
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
          message: "Sale record deleted successfully",
          type: "success",
        });
      } else {
        throw new Error("Failed to delete sale record");
      }
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
    setSelectedSale({ id, name: selectedSale?.name || "" });
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
    <div className="relative">
      <div className="overflow-x-auto pb-8">
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
        ) : soldData.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-6 bg-white rounded-lg border border-gray-200 shadow-sm mb-10">
            <div className="flex items-center justify-center w-16 h-16 rounded-full bg-pink-50 mb-4">
              {/* Shopping bag icon */}
              <svg className="w-8 h-8 text-pink-400" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <path d="M5 8h14l-1.68 9.39A2 2 0 0 1 15.35 19H8.65a2 2 0 0 1-1.97-1.61L5 8zm2-3a3 3 0 0 1 6 0" stroke="currentColor" strokeWidth="2" fill="none" />
              </svg>
            </div>
            <h2 className="text-lg font-semibold text-gray-800 mb-1">No sold items</h2>
            <p className="text-gray-500 mb-6 text-center max-w-xs">All your sold items will show up here. Add a new sale to get started.</p>
          </div>
        ) : (
          <div className="space-y-6 ">
            <div className="flex justify-between items-center mb-4">
              <button
                onClick={() => navigate("/shop/add-new-sold-item")}
                className="px-4 py-2 bg-blue-400 text-white rounded hover:bg-blue-500 transition-colors"
              >
                <FontAwesomeIcon className="pr-2" icon={faPlus} />
                Record Sale
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

            {soldData.map((dayData) => (
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
                  <p
                    className="font-bold"
                    style={{ fontSize: "clamp(13.5px, 3vw, 15px)" }}
                  >
                    Total: ₦{formatNumber(dayData.daily_total)}
                  </p>
                </div>

                {openDates[dayData.date] && (
                  //////// Table
                  <div className="overflow-x-auto">
                    <table className="min-w-full bg-white shadow-md rounded-lg overflow-hidden text-xs sm:text-sm">
                      <thead>
                        <tr className="bg-blue-400 text-white">
                          {/* Adjust headers: hide less important columns on mobile */}
                          <th className="py-2 px-2 sm:py-4 sm:px-4 text-left font-semibold">Date</th>
                          <th className="py-2 px-2 sm:py-4 sm:px-4 text-left font-semibold">Name</th>
                          <th className="py-2 px-2 sm:py-4 sm:px-4 text-left font-semibold hidden sm:table-cell">Quantity</th>
                          <th className="py-2 px-2 sm:py-4 sm:px-4 text-left font-semibold hidden sm:table-cell">Sold To</th>
                          <th className="py-2 px-2 sm:py-4 sm:px-4 text-left font-semibold hidden sm:table-cell">Profit</th>
                          <th className="py-2 px-2 sm:py-4 sm:px-4 text-left font-semibold">Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {dayData.entries.map((entry) => (
                          <tr key={entry.id} className="hover:bg-gray-50">
                            <td className="px-2 sm:px-4 py-2 sm:py-3 text-xs sm:text-sm">
                              {formatDate(entry.date)}
                            </td>
                            <td className="px-2 sm:px-4 py-2 sm:py-3 text-xs sm:text-sm">
                              {entry.name}
                            </td>
                            <td className="px-2 sm:px-4 py-2 sm:py-3 text-xs sm:text-sm hidden sm:table-cell">
                              {formatNumber(entry.quantity)}
                            </td>
                            <td className="px-2 sm:px-4 py-2 sm:py-3 text-xs sm:text-sm hidden sm:table-cell">
                              {entry.sold_to?.name || "—"}
                            </td>
                            <td className="px-2 sm:px-4 py-2 sm:py-3 text-xs sm:text-sm hidden sm:table-cell">
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

      {/* delete and edit options modal */}
      {showModal && selectedSale && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg p-4 sm:p-6 w-full max-w-sm">
            <div className="flex justify-between items-center">
              <h3 className="text-base sm:text-lg mb-3 sm:mb-4 font-medium">
                <span className="font-semibold text-blue-20">
                  {selectedSale.name}
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
                  navigate(`/shop/edit-sold-item/${selectedSale.id}`)
                }
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

      {/* confirmation modal */}
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

      {showDetailsModal && selectedItem && (
        <div className={`fixed inset-0 flex items-center justify-center z-100 p-4 ${
          confirmDelete ? "blur-sm" : ""
        }`}>
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

            <div className="space-y-2 sm:space-y-3">
              <p className="text-xs sm:text-sm">
                <span className="font-semibold">Item Category:</span>{" "}
                {selectedItem.item_sold?.inventory_category.name}
              </p>
              <p className="text-xs sm:text-sm">
                <span className="font-semibold">Date:</span>{" "}
                {formatDate(selectedItem.date)}
              </p>
              <p className="text-xs sm:text-sm">
                <span className="font-semibold">Dimensions:</span>{" "}
                {selectedItem.item_sold?.dimensions}
              </p>
              <p className="text-xs sm:text-sm">
                <span className="font-semibold">Quantity:</span>{" "}
                {formatNumber(selectedItem.quantity)}
              </p>
              <p className="text-xs sm:text-sm">
                <span className="font-semibold">Project:</span>{" "}
                {selectedItem.linked_project?.name || "—"}
              </p>
              <p className="text-xs sm:text-sm">
                <span className="font-semibold">Customer:</span>{" "}
                {selectedItem.sold_to?.name || "—"}
              </p>
              <p className="text-xs sm:text-sm">
                <span className="font-semibold">Logistics:</span>{" "}
                {selectedItem.logistics ? `₦${formatNumber(selectedItem.logistics)}` : "—"}
              </p>
              <p className="text-xs sm:text-sm">
                <span className="font-semibold">Cost Price:</span> ₦
                {formatNumber(selectedItem.cost_price)}
              </p>
              <p className="text-xs sm:text-sm">
                <span className="font-semibold">Selling Price:</span> ₦
                {formatNumber(selectedItem.selling_price)}
              </p>
              {/* <p className="text-xs sm:text-sm">
                <span className="font-semibold">Total Price:</span> ₦
                {formatNumber(selectedItem.total_price)}
              </p> */}
              <p className="text-xs sm:text-sm">
                <span className="font-semibold">Profit:</span> ₦
                {formatNumber(selectedItem.profit)}
              </p>
            </div>
            {userRole === 'ceo' && (
              <div className="mt-3 sm:mt-4 space-y-2 sm:space-y-0 sm:space-x-2 flex flex-col sm:flex-row">
                <button
                  onClick={() =>
                    navigate(`/shop/edit-sold-item/${selectedItem.id}`)
                  }
                  className="pt-1.5 sm:pt-2 pr-2 sm:pr-3 p-1.5 sm:p-2 text-blue-400 rounded-lg border-2 border-blue-400 font-bold text-xs sm:text-sm"
                >
                  <FontAwesomeIcon className="pr-1 text-blue-400" icon={faPencil} />
                  Edit details
                </button>
                <button
                  onClick={() => confirmDeleteSale(selectedItem.id)}
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

export default SoldTable;
