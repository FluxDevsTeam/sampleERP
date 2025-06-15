import React, { useEffect, useState } from "react";
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
import Modal from "../Modal";

interface StockEntry {
  cost_price: string;
  date: string;
  id: number;
  inventory_item: {
    id: number;
    name: string;
    image: string;
  };
  name: string;
  quantity: string;
}

interface DailyData {
  date: string;
  entries: StockEntry[];
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
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [selectedItem, setSelectedItem] = useState<StockEntry | null>(null);

  const fetchItems = async () => {
    try {
      setLoading(true);
      const response = await fetch(
        "https://backend.kidsdesigncompany.com/api/add-stock/", {
          method: "GET",
          headers: {
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

  const handleConfirmDelete = async () => {
    if (selectedStock) {
      await handleDelete(selectedStock.id);
      setConfirmDelete(false);
      setShowDetailsModal(false);
    }
  };

  const handleViewDetails = (entry: StockEntry) => {
    setSelectedItem(entry);
    setShowDetailsModal(true);
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
            <button
              onClick={() => navigate("/shop/add-new-stock-item")}
              className="mb-4 px-4 py-2 bg-blue-400 text-white rounded mr-2 hover:bg-blue-500 transition-colors"
            >
              <FontAwesomeIcon className="pr-2" icon={faPlus} />
              Add Stock
            </button>

            {stockData.map((dayData) => (
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
                </div>

                {openDates[dayData.date] && (
                  <table className="min-w-full overflow-auto">
                    <thead className="bg-gray-800">
                      <tr>
                        <th className="px-4 py-3 text-left text-xs font-bold text-blue-400">
                          Name
                        </th>
                        <th className="px-4 py-3 text-left text-xs font-bold text-blue-400">
                          Quantity
                        </th>
                        <th className="px-4 py-3 text-left text-xs font-bold text-blue-400">
                          {/* Details */}
                        </th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                      {dayData.entries.map((entry, index) => (
                        <tr
                          key={entry.id ?? index}
                          className="hover:bg-gray-50"
                        >
                          <td className="px-4 py-3 text-sm cursor-pointer hover:text-blue-600">
                            {entry.name}
                          </td>
                          <td className="px-4 py-3 text-sm">
                            {entry.quantity}
                          </td>
                          <td className="px-4 py-3 text-sm text-blue-400">
                            <button
                              className="px-3 py-1 text-blue-400 border-2 border-blue-400 rounded"
                              onClick={() => handleViewDetails(entry)}
                            >
                              View
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

      {/* delete and edit options modal */}
      {showModal && selectedStock && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-96">
            <div className="flex justify-between items-center">
              <h3 className="text-lg mb-4 font-medium">
                <span className="font-semibold  text-blue-20">
                  {selectedStock.name}
                </span>
              </h3>

              <FontAwesomeIcon
                icon={faXmark}
                onClick={() => setShowModal(false)}
                className="cursor-pointer"
              />
            </div>
            <div className="space-y-3">
              <button
                onClick={() =>
                  navigate(`/shop/edit-stock-item/${selectedStock.id}`)
                }
                className="w-full py-2 px-4 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors flex items-center justify-center"
              >
                <FontAwesomeIcon icon={faPencil} className="mr-2" />
                Edit Stock Record
              </button>
              <button
                onClick={() => confirmDeleteStock(selectedStock.id)}
                className="w-full py-2 px-4 bg-red-500 text-white rounded hover:bg-red-600 transition-colors flex items-center justify-center"
              >
                <FontAwesomeIcon icon={faTrash} className="mr-2" />
                Delete Stock Record
              </button>
            </div>
          </div>
        </div>
      )}

      {confirmDelete && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-96">
            <div className="flex justify-between items-center">
              <h3 className="text-lg mb-4 font-medium">Confirm Deletion</h3>
              <FontAwesomeIcon
                icon={faXmark}
                onClick={() => setConfirmDelete(false)}
                className="cursor-pointer"
              />
            </div>
            <p>Are you sure you want to delete this stock record?</p>
            <div className="space-y-3 mt-4">
              <button
                onClick={handleConfirmDelete}
                className="w-full py-2 px-4 bg-red-500 text-white rounded hover:bg-red-600 transition-colors flex items-center justify-center"
              >
                Confirm
              </button>
              <button
                onClick={() => setConfirmDelete(false)}
                className="w-full py-2 px-4 bg-gray-300 text-black rounded hover:bg-gray-400 transition-colors flex items-center justify-center"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {showDetailsModal && selectedItem && (
        <div
          className={`fixed inset-0 flex items-center justify-center z-100 ${
            confirmDelete ? "blur-sm" : ""
          }`}
        >
          <div
            className="absolute inset-0 bg-black opacity-50"
            onClick={() => setShowDetailsModal(false)}
          ></div>
          <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4 border-2 border-gray-800 shadow-lg relative z-10">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-2xl font-bold text-gray-20">
                {selectedItem.name}
              </h2>
              <button
                onClick={() => setShowDetailsModal(false)}
                className="text-gray-500 hover:text-gray-700 focus:outline-none"
              >
                ✕
              </button>
            </div>

            <div className="space-y-3">
              <p className="text-sm">
                <span className="font-semibold">Quantity:</span>{" "}
                {selectedItem.quantity}
              </p>
              <p className="text-sm">
                <span className="font-semibold">Date:</span>{" "}
                {formatDate(selectedItem.date)}
              </p>
              <p className="text-sm">
                <span className="font-semibold">Cost Price:</span> ₦
                {selectedItem.cost_price}
              </p>
            </div>
            <button
              onClick={() =>
                navigate(`/shop/edit-stock-item/${selectedItem.id}`)
              }
              className="pt-2 pr-3 p-2 text-blue-400 rounded-lg border-2 border-blue-400 mt-4 mr-2 font-bold"
            >
              <FontAwesomeIcon className="pr-1 text-blue-400" icon={faPencil} />
              Edit details
            </button>
            <button
              onClick={() => confirmDeleteStock(selectedItem.id)}
              className="pt-2 pr-3 p-2 text-red-400 rounded-lg border-2 border-red-400 mt-4 font-bold"
            >
              <FontAwesomeIcon className="pr-1 text-red-400" icon={faTrash} />
              Delete Item
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

export default StockTable;
