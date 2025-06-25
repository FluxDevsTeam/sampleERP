import React, { useEffect, useState, useRef } from "react";
import { ThreeDots } from "react-loader-spinner";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faChevronDown,
  faChevronUp,
  faPen,
  faTrash,
  faPlus,
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
  const [materialData, setMaterialData] = useState<ApiResponse | null>(null);
  const [openDates, setOpenDates] = useState<{ [key: string]: boolean }>({});
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [selectedItem, setSelectedItem] = useState<number | null>(null);
  const [userRole, setUserRole] = useState<string | null>(null);
  const [year, setYear] = useState<number | string>("");
  const [month, setMonth] = useState<number | string>("");
  const [day, setDay] = useState<number | string>("");
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

  const handleFilter = () => {
    fetchData(year, month, day);
  };

  const handleClear = () => {
    setYear("");
    setMonth("");
    setDay("");
    fetchData();
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

      fetchData(); // Refresh the data
    } catch (error) {
      setModalConfig({
        isOpen: true,
        title: "Error",
        message: "Failed to delete item",
        type: "error",
      });
    } finally {
      setConfirmDelete(false);
      setSelectedItem(null);
    }
  };

  const handleCloseModal = () => {
    setModalConfig({ ...modalConfig, isOpen: false });
  };

  return (
    <div className="relative">
      <div className="flex justify-between items-center mb-4">
      <button
          onClick={() => navigate("/store-keeper/add-to-raw-material")}
          className="bg-blue-400 text-white px-4 py-2 rounded-md hover:bg-blue-600 flex items-center"
        >
          <FontAwesomeIcon icon={faPlus} className="mr-2" />
          Add to Raw Material
        </button>

        <div className="flex items-center space-x-4">
          <div ref={yearRef} className="relative">
            <button onClick={() => setIsYearOpen(!isYearOpen)} className="bg-white border border-gray-300 rounded-md px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 flex items-center">
              {year || "Year"} <FontAwesomeIcon icon={isYearOpen ? faChevronUp : faChevronDown} className="ml-2" />
            </button>
            {isYearOpen && (
              <div className="absolute z-10 mt-1 w-full bg-white border border-gray-300 rounded-md shadow-lg">
                <ul className="max-h-60 overflow-auto">
                  {Array.from({ length: 10 }, (_, i) => new Date().getFullYear() - i).map(y => (
                    <li key={y} onClick={() => { setYear(y); setIsYearOpen(false); }} className="px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 cursor-pointer">
                      {y}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
          <div ref={monthRef} className="relative">
            <button onClick={() => setIsMonthOpen(!isMonthOpen)} className="bg-white border border-gray-300 rounded-md px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 flex items-center">
              {month ? months[Number(month) - 1] : "Month"} <FontAwesomeIcon icon={isMonthOpen ? faChevronUp : faChevronDown} className="ml-2" />
            </button>
            {isMonthOpen && (
              <div className="absolute z-10 mt-1 w-full bg-white border border-gray-300 rounded-md shadow-lg">
                <ul className="max-h-60 overflow-auto">
                  {months.map((m, i) => (
                    <li key={m} onClick={() => { setMonth(i + 1); setIsMonthOpen(false); }} className="px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 cursor-pointer">
                      {m}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
          <div ref={dayRef} className="relative">
            <button onClick={() => setIsDayOpen(!isDayOpen)} className="bg-white border border-gray-300 rounded-md px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 flex items-center">
              {day || "Day"} <FontAwesomeIcon icon={isDayOpen ? faChevronUp : faChevronDown} className="ml-2" />
            </button>
            {isDayOpen && (
              <div className="absolute z-10 mt-1 w-full bg-white border border-gray-300 rounded-md shadow-lg">
                <ul className="max-h-60 overflow-auto">
                  {Array.from({ length: 31 }, (_, i) => i + 1).map(d => (
                    <li key={d} onClick={() => { setDay(d); setIsDayOpen(false); }} className="px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 cursor-pointer">
                      {d}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
          <button onClick={handleFilter} className="bg-blue-400 text-white px-4 py-2 rounded-md hover:bg-blue-600">Filter</button>
          <button onClick={handleClear} className="bg-gray-300 text-gray-700 px-4 py-2 rounded-md hover:bg-gray-400">Clear</button>
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
        ) : (
          <div className="space-y-6">
            {/* <button
              onClick={() => navigate("/store-keeper/add-to-raw-material")}
              className="mb-4 px-4 py-2 bg-blue-400 text-white rounded mr-2 hover:bg-blue-500 transition-colors"
            >
              <FontAwesomeIcon className="pr-2" icon={faPlus} />
              Add to raw material
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
                    <thead className="bg-gray-800">
                      <tr>
                        <th className="px-4 py-3 text-left text-xs font-bold text-blue-400">
                          Material
                        </th>
                        <th className="px-4 py-3 text-left text-xs font-bold text-blue-400">
                          Quantity
                        </th>
                        <th className="px-4 py-3 text-left text-xs font-bold text-blue-400">
                          Unit
                        </th>
                        <th className="px-4 py-3 text-left text-xs font-bold text-blue-400">
                          Cost Price
                        </th>
                        {userRole === 'ceo' && <th className="px-4 py-3 text-left text-xs font-bold text-blue-400">Actions</th>}
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                      {dayData.entries.map((entry) => (
                        <tr key={entry.id} className="hover:bg-gray-50">
                          <td className="px-4 py-3 text-sm">
                            {entry.material?.name || "N/A"}
                          </td>
                          <td className="px-4 py-3 text-sm">
                            {entry.quantity}
                          </td>
                          <td className="px-4 py-3 text-sm">
                            {entry.material?.unit || "N/A"}
                          </td>
                          <td className="px-4 py-3 text-sm">
                            ₦{parseFloat(entry.cost_price).toLocaleString()}
                          </td>
                          {userRole === 'ceo' && (
                            <td className="flex justify-evenly px-4 py-3 text-sm text-blue-600">
                              <FontAwesomeIcon
                                onClick={() => handleEdit(entry.id)}
                                className="pr-2 cursor-pointer hover:text-blue-500"
                                icon={faPen}
                              />
                              <FontAwesomeIcon
                                onClick={() => handleDeleteClick(entry.id)}
                                className="cursor-pointer text-red-400"
                                icon={faTrash}
                              />
                            </td>
                          )}
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
      {confirmDelete && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-96">
            <h3 className="text-lg font-medium mb-4">Confirm Deletion</h3>
            <p className="mb-4">Are you sure you want to delete this item?</p>
            <div className="flex justify-end space-x-3">
              <button
                onClick={() => setConfirmDelete(false)}
                className="px-4 py-2 bg-gray-300 text-gray-700 rounded hover:bg-gray-400"
              >
                Cancel
              </button>
              <button
                onClick={handleDelete}
                className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
              >
                Delete
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
