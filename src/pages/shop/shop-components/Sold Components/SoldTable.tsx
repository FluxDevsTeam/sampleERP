import { useEffect, useState } from "react";
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

  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [soldData, setSoldData] = useState<DailyData[]>([]);
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
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [selectedItem, setSelectedItem] = useState<SoldEntry | null>(null);

  const fetchItems = async () => {
    try {
      setLoading(true);
      const response = await fetch(
        "https://kidsdesigncompany.pythonanywhere.com/api/sold/"
      );

      if (!response.ok) {
        throw new Error("Failed to fetch data");
      }

      const data: ApiResponse = await response.json();
      console.log(data);

      setSoldData(data.daily_data);
    } catch (error) {
      console.error("Error fetching sold items:", error);
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

  const handleDelete = async (id: number) => {
    try {
      const response = await fetch(
        `https://kidsdesigncompany.pythonanywhere.com/api/sold/${id}/`,
        {
          method: "DELETE",
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
    if (selectedSale) {
      await handleDelete(selectedSale.id);
      setConfirmDelete(false);
      setShowDetailsModal(false);
    }
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
        ) : (
          <div className="space-y-6 ">
            <button
              onClick={() => navigate("/shop/add-new-sold-item")}
              className="mb-4 px-4 py-2 bg-blue-400 text-white rounded mr-2 hover:bg-blue-500 transition-colors"
            >
              <FontAwesomeIcon className="pr-2" icon={faPlus} />
              Record Sale
            </button>

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
                    Total: ₦{dayData.daily_total}
                  </p>
                </div>

                {openDates[dayData.date] && (
                  //////// Table
                  <table className="min-w-full overflow-auto">
                    {/* Table headers */}
                    <thead className="bg-gray-800">
                      <tr>
                        {/* <th className="px-4 py-3 text-left text-xs font-bold text-blue-400">
                          ID of sold item
                        </th> */}
                        <th className="px-4 py-3 text-left text-xs font-bold text-blue-400">
                          Name
                        </th>
                        <th className="px-4 py-3 text-left text-xs font-bold text-blue-400">
                          Quantity
                        </th>
                        <th className="px-4 py-3 text-left text-xs font-bold text-blue-400">
                          Sold To
                        </th>
                        <th className="px-4 py-3 text-left text-xs font-bold text-blue-400">
                          Logistics
                        </th>
                        <th className="px-4 py-3 text-left text-xs font-bold text-blue-400">
                          Project
                        </th>
                        <th className="px-4 py-3 text-left text-xs font-bold text-blue-400">
                          Cost Price
                        </th>
                        <th className="px-4 py-3 text-left text-xs font-bold text-blue-400">
                          Selling Price
                        </th>
                        <th className="px-4 py-3 text-left text-xs font-bold text-blue-400">
                          Total
                        </th>
                        <th className="px-4 py-3 text-left text-xs font-bold text-blue-400">
                          Profit
                        </th>
                        <th className="px-4 py-3 text-left text-xs font-bold text-blue-400"></th>
                      </tr>
                    </thead>

                    {/* Table body */}
                    <tbody className="divide-y divide-gray-200">
                      {dayData.entries.map((entry) => (
                        <tr key={entry.id} className="hover:bg-gray-50">
                          <td className="px-4 py-3 text-sm cursor-pointer hover:text-blue-600">
                            {entry.name}
                          </td>
                          <td className="px-4 py-3 text-sm">
                            {entry.quantity}
                          </td>
                          <td className="px-4 py-3 text-sm">
                            {entry.sold_to?.name || "—"}
                          </td>
                          <td className="px-4 py-3 text-sm">
                            {entry.logistics || "—"}
                          </td>
                          <td className="px-4 py-3 text-sm">
                            {entry.linked_project?.name || "—"}
                          </td>
                          <td className="px-4 py-3 text-sm">
                            ₦{entry.cost_price}
                          </td>
                          <td className="px-4 py-3 text-sm">
                            ₦{entry.selling_price}
                          </td>
                          <td className="px-4 py-3 text-sm text-blue-600">
                            ₦{entry.total_price}
                          </td>
                          <td className="px-4 py-3 text-sm text-blue-400">
                            ₦{entry.profit}
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
      {showModal && selectedSale && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-96">
            <div className="flex justify-between items-center">
              <h3 className="text-lg mb-4 font-medium">
                <span className="font-semibold  text-blue-20">
                  {selectedSale.name}
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
                  navigate(`/shop/edit-sold-item/${selectedSale.id}`)
                }
                className="w-full py-2 px-4 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors flex items-center justify-center"
              >
                <FontAwesomeIcon icon={faPencil} className="mr-2" />
                Edit Sale Record
              </button>
              <button
                onClick={() => confirmDeleteSale(selectedSale.id)}
                className="w-full py-2 px-4 bg-red-500 text-white rounded hover:bg-red-600 transition-colors flex items-center justify-center"
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
            <p>Are you sure you want to delete this sale record?</p>
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
        <div className={`fixed inset-0 flex items-center justify-center z-100 ${
          confirmDelete ? "blur-sm" : ""
        }`}>
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
                <span className="font-semibold">Item Category:</span>{" "}
                {selectedItem.item_sold?.inventory_category.name}
              </p>
              <p className="text-sm">
                <span className="font-semibold">Date:</span>{" "}
                {formatDate(selectedItem.date)}
              </p>
              <p className="text-sm">
                <span className="font-semibold">Dimensions:</span>{" "}
                {selectedItem.item_sold?.dimensions}
              </p>
              <p className="text-sm">
                <span className="font-semibold">Quantity:</span>{" "}
                {selectedItem.quantity}
              </p>
              <p className="text-sm">
                <span className="font-semibold">Project:</span>{" "}
                {selectedItem.linked_project?.name || "—"}
              </p>
              <p className="text-sm">
                <span className="font-semibold">Customer:</span>{" "}
                {selectedItem.sold_to?.name || "—"}
              </p>
              <p className="text-sm">
                <span className="font-semibold">Logistics:</span>{" "}
                {selectedItem.logistics || "—"}
              </p>
              <p className="text-sm">
                <span className="font-semibold">Cost Price:</span> ₦
                {selectedItem.cost_price}
              </p>
              <p className="text-sm">
                <span className="font-semibold">Selling Price:</span> ₦
                {selectedItem.selling_price}
              </p>
              {/* <p className="text-sm">
                <span className="font-semibold">Total Price:</span> ₦
                {selectedItem.total_price}
              </p> */}
              <p className="text-sm">
                <span className="font-semibold">Profit:</span> ₦
                {selectedItem.profit}
              </p>
            </div>
            <button
              onClick={() =>
                navigate(`/shop/edit-sold-item/${selectedItem.id}`)
              }
              className="pt-2 pr-3 p-2 text-blue-400 rounded-lg border-2 border-blue-400 mt-4 mr-2 font-bold"
            >
              <FontAwesomeIcon className="pr-1 text-blue-400" icon={faPencil} />
              Edit details
            </button>
            <button
              onClick={() => confirmDeleteSale(selectedItem.id)}
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

export default SoldTable;
