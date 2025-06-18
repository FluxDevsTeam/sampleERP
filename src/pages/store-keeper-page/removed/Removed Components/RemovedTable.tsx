import { useEffect, useState } from "react";
import { ThreeDots } from "react-loader-spinner";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faPlus,
  faChevronDown,
  faTrash,
  faXmark,
  faPen,
} from "@fortawesome/free-solid-svg-icons";
import { useNavigate } from "react-router-dom";
import Modal from "@/pages/shop/Modal";
// import reac

const RemovedTable: React.FC = () => {
  document.title = "Removed Items | Kids Design Company";
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);

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

  const fetchItems = async () => {
    try {
      setLoading(true);
      const response = await fetch(
        "https://backend.kidsdesigncompany.com/api/removed/", {
          method: "GET",
          headers: {
            Authorization: `JWT ${localStorage.getItem("accessToken")}`,
          },
        }
      );

      const logData = await response.json();
      console.log(logData);

      if (!response.ok) {
        throw new Error("Iyegere bro, Network response was not ok");
      }

      setRemovedData(logData);
    } catch (error) {
      console.error("iyegs, this is the error", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchItems();
  }, []);

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
    }
  };

  const toggleDate = (e: any) => {
    const target = e.currentTarget.nextSibling;
    if (target) {
      target.classList.toggle("hidden");
      target.classList.toggle("fade-in");
    }
  };

  const handleDeleteClick = (id: number) => {
    // the id of the item to be deleted is stored in the params of this function. the id stored in the params is got from the entry.id(the last table data in our table)
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
              onClick={() => navigate("/store-keeper/add-removed")}
              className="mb-4 px-4 py-2 bg-blue-400 text-white rounded mr-2 hover:bg-blue-500 transition-colors"
            >
              <FontAwesomeIcon className="pr-2" icon={faPlus} />
              Record
            </button>

            {removedData?.daily_data?.map((dayData: any) => (
              <div
                key={dayData.date}
                className="bg-white shadow-md rounded-lg overflow-auto"
              >
                <div
                  className="bg-white text-blue-20 px-4 py-2 border-b flex justify-between items-center cursor-pointer hover:bg-slate-300 hover:text-blue-20 w-full"
                  onClick={toggleDate}
                >
                  <div className="flex items-center space-x-2">
                    <FontAwesomeIcon icon={faChevronDown} />
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
                    Total: ₦{dayData?.daily_total}
                  </p>
                </div>

                {dayData.date && (
                  //////// Table
                  <table className="removed-table min-w-full overflow-auto hidden">
                    {/* Table headers */}
                    <thead className="bg-gray-800">
                      <tr>
                        <th className="px-4 py-3 text-left text-xs font-bold text-blue-400">
                          Name
                        </th>
                        <th className="px-4 py-3 text-left text-xs font-bold text-blue-400">
                          Quantity
                        </th>
                        <th className="px-4 py-3 text-left text-xs font-bold text-blue-400">
                          Price
                        </th>
                        <th className="px-4 py-3 text-left text-xs font-bold text-blue-400">
                          Selling Price
                        </th>
                        <th className="px-4 py-3 text-left text-xs font-bold text-blue-400">
                          Product used
                        </th>
                        <th className="px-4 py-3 text-left text-xs font-bold text-blue-400">
                          Progress
                        </th>
                        <th className="px-4 py-3 text-left text-xs font-bold text-blue-400">
                          Associated raw material
                        </th>
                        <th className="px-4 py-3 text-left text-xs font-bold text-blue-400">
                          Unit
                        </th>
                        <th className="px-4 py-3 text-left text-xs font-bold text-blue-400"></th>
                      </tr>
                    </thead>

                    {/* Table body */}
                    <tbody className="divide-y divide-gray-200">
                      {dayData.entries.map((entry: any) => (
                        <tr key={entry.id} className="hover:bg-gray-50">
                          <td className="px-4 py-3 text-sm cursor-pointer hover:text-blue-600">
                            {entry.name}
                            {/* {console.log(entry.name)} */}
                          </td>
                          <td className="px-4 py-3 text-sm">
                            {entry.quantity}
                          </td>
                          <td className="px-4 py-3 text-sm">
                            {entry.price || "—"}
                          </td>
                          <td className="px-4 py-3 text-sm">
                            ₦{entry.product_its_used?.selling_price}
                          </td>
                          <td className="px-4 py-3 text-sm">
                            {entry.product_its_used.name || "—"}
                          </td>
                          <td className="px-4 py-3 text-sm">
                            {entry.product_its_used.progress}%
                          </td>
                          <td className="px-4 py-3 text-sm">
                            {entry.raw_material?.name || "—"}
                            {/* {console.log(entry.raw_material?.name)} */}
                          </td>
                          <td className="px-4 py-3 text-sm text-blue-600">
                            {entry.raw_material?.unit || "—"}
                          </td>
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
            <p>Are you sure you want to delete this item?</p>
            <div className="space-y-3 mt-4">
              <button
                onClick={handleDelete}
                className="w-full py-2 px-4 bg-red-500 text-white rounded hover:bg-red-600 transition-colors"
              >
                Confirm
              </button>
              <button
                onClick={() => setConfirmDelete(false)}
                className="w-full py-2 px-4 bg-gray-300 text-black rounded hover:bg-gray-400 transition-colors"
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
