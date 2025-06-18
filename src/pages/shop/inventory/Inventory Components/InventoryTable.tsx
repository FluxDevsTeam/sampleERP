import React, { useEffect, useState, JSX } from "react";
import { ThreeDots } from "react-loader-spinner";
import { Whisper, Tooltip } from "rsuite";
import "rsuite/dist/rsuite.min.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faPencil,
  faPlus,
  faTrash,
  faArrowLeft,
  faArrowRight,
  faXmark,
  faAnglesLeft,
  faAnglesRight,
} from "@fortawesome/free-solid-svg-icons";
import { useNavigate, useLocation } from "react-router-dom";
import Modal from "../../Modal";

interface TableProps {
  headers: string[];
  onModalChange: (isOpen: boolean) => void;
}

interface TableData {
  Product: string;
  Category: string;
  "Stock Status": number;
  Details: JSX.Element;
  [key: string]: string | number | JSX.Element;
}

const Table: React.FC<TableProps> = ({ headers, onModalChange }) => {
  const [tableData, setTableData] = useState<TableData[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [showModal, setShowModal] = useState<boolean>(false);
  const [selectedProduct, setSelectedProduct] = useState<any | null>(null);
  const [showImagePreview, setShowImagePreview] = useState<boolean>(false);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;
  const location = useLocation();
  const navigate = useNavigate();
  const [modalConfig, setModalConfig] = useState({
    isOpen: false,
    title: "",
    message: "",
    type: "success" as "success" | "error",
  });
  const [confirmDelete, setConfirmDelete] = useState(false);

  const fetchItems = async () => {
    try {
      setLoading(true);
      const response = await fetch(
        `https://backend.kidsdesigncompany.com/api/inventory-item/`,
        {
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

      const data = await response.json();
      console.log("API Response:", data);

      const updatedTableData: TableData[] = data.results.items.map(
        (item: any) => {
          return {
            Product: item.name,
            Category: item.inventory_category?.name || "-",
            "Stock Status": item.stock,
            Details: (
              <button
                onClick={() => handleViewDetails(item)}
                className="px-3 py-1 text-blue-400 border-2 border-blue-400 rounded"
              >
                View
              </button>
            ),
          };
        }
      );

      setTableData(updatedTableData);
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchItems();
  }, []);

  // Calculate pagination values
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = tableData.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(tableData.length / itemsPerPage);

  const handlePageChange = (pageNumber: number) => {
    setCurrentPage(pageNumber);
  };

  useEffect(() => {
    if (showModal || showImagePreview) {
      document.body.style.overflow = "hidden";
      onModalChange(true);
    } else {
      document.body.style.overflow = "unset";
      onModalChange(false);
    }

    // Cleanup function to reset overflow when component unmounts
    return () => {
      document.body.style.overflow = "unset";
      onModalChange(false);
    };
  }, [showModal, showImagePreview, onModalChange]);

  useEffect(() => {
    // Check for returning from add contractor or add worker or addQuotation with updated product data
    if (
      (location.state?.from === "addWorker" ||
        location.state?.from === "addContractor" ||
        location.state?.from === "addQuotation" ||
        location.state?.from === "editItem" ||
        location.state?.from === "editProduct") &&
      location.state?.productData
    ) {
      setSelectedProduct(location.state.productData); // Set the updated product
      setShowModal(true); // Show the modal with the updated product data
      window.history.replaceState({}, document.title);
    }
  }, [location.state]);

  const handleViewDetails = (product: any) => {
    setSelectedProduct(product);
    setShowModal(true);
  };

  // DELETING ITEM
  const deleteItem = async () => {
    if (selectedProduct) {
      try {
        const response = await fetch(
          `https://backend.kidsdesigncompany.com/api/inventory-item/${selectedProduct.id}/`,
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
          message: "Item deleted successfully!",
          type: "success",
        });
        setShowModal(false);
        setConfirmDelete(false);
        fetchItems(); // Refresh items
      } catch (error) {
        console.error("Error deleting item:", error);
        setModalConfig({
          isOpen: true,
          title: "Error",
          message: "Failed to delete item",
          type: "error",
        });
      }
    }
  };

  // NAVIGATION TO EDIT PAGE
  const editItem = () => {
    if (selectedProduct) {
      navigate(`/shop/edit-item/${selectedProduct.id}`, {
        state: { productData: selectedProduct },
      });
    }
  };

  const handleCloseModal = () => {
    setModalConfig({ ...modalConfig, isOpen: false });
    // if (modalConfig.type === "success") {
    //   window.location.reload();
    // }
  };

  const confirmDeleteItem = () => {
    setConfirmDelete(true);
  };

  const handleConfirmDelete = async (
    e: React.MouseEvent<HTMLButtonElement>
  ) => {
    const button = e.currentTarget;
    button.disabled = true;
    setTimeout(() => {
      button.disabled = false;
    }, 3000);
    await deleteItem();
  };

  return (
    <div className="relative">
      <div
        className={`overflow-x-auto pb-6 ${showImagePreview ? "blur-sm" : ""} ${
          showModal ? "blur-md" : ""
        }`}
      >
        {loading ? (
          <div className="w-1/5 mx-auto">
            <ThreeDots
              visible={true}
              height="80"
              width="80"
              color="#60A5FA"
              radius="9"
              ariaLabel="three-dots-loading"
              wrapperStyle={{}}
              wrapperClass=""
            />
          </div>
        ) : (
          <div>
            <button
              onClick={() => navigate("/shop/add-new-item")}
              className="mb-4 px-4 py-2 bg-blue-400 text-white rounded mr-2 hover:bg-blue-500 transition-colors"
            >
              <FontAwesomeIcon className="pr-2" icon={faPlus} />
              Add Item / Category
            </button>
            <table className="min-w-full bg-white shadow-md rounded-lg overflow-hidden">
              <thead>
                <tr className="bg-blue-400 text-white">
                  {headers.map((header) => (
                    <th
                      key={header}
                      className="py-4 px-4 text-left text-sm font-semibold"
                    >
                      {header}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {currentItems.map((row, index) => (
                  <tr key={index} className="hover:bg-gray-100">
                    {headers.map((header) => (
                      <td
                        key={`${index}-${header}`}
                        className="py-5 px-4 border-b border-gray-200 text-sm text-gray-700"
                      >
                        {row[header]}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Updated Pagination Controls */}
      <div className="flex justify-center items-center mb-28 gap-2">
        <button
          onClick={() => handlePageChange(1)}
          disabled={currentPage === 1}
          className="px-3 py-1 rounded bg-blue-400 text-white disabled:bg-gray-300"
        >
          <FontAwesomeIcon icon={faAnglesLeft} />
        </button>
        <button
          onClick={() => handlePageChange(currentPage - 1)}
          disabled={currentPage === 1}
          className="px-3 py-1 rounded bg-blue-400 text-white disabled:bg-gray-300"
        >
          <FontAwesomeIcon icon={faArrowLeft} />
        </button>

        <span className="mx-4">
          Page {currentPage} of {totalPages}
        </span>

        <button
          onClick={() => handlePageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
          className="px-3 py-1 rounded bg-blue-400 text-white disabled:bg-gray-300"
        >
          <FontAwesomeIcon icon={faArrowRight} />
        </button>
        <button
          onClick={() => handlePageChange(totalPages)}
          disabled={currentPage === totalPages}
          className="px-3 py-1 rounded bg-blue-400 text-white disabled:bg-gray-300"
        >
          <FontAwesomeIcon icon={faAnglesRight} />
        </button>
      </div>

      {/*   PRODUCT DETAILS   */}
      {showModal && selectedProduct && (
        <div
          className={`fixed inset-0 flex items-center justify-center z-[100] ${
            confirmDelete ? "blur-sm" : ""
          } ${showImagePreview ? "blur-sm" : ""}`}
        >
          <div
            className="absolute inset-0 bg-black opacity-50"
            onClick={() => setShowModal(false)}
          ></div>
          <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4 border-2 border-gray-800 shadow-lg relative z-10">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-2xl font-bold text-gray-20">
                {selectedProduct.name}{" "}
              </h2>
              <button
                onClick={() => setShowModal(false)}
                className="text-gray-500 hover:text-gray-700 focus:outline-none"
              >
                ✕
              </button>
            </div>
            {!showImagePreview && (
              <Whisper
                followCursor
                speaker={<Tooltip>Click for full view</Tooltip>}
              >
                <img
                  src={selectedProduct.image}
                  alt={selectedProduct.name}
                  className="block w-1/5 h-auto mb-2 cursor-pointer"
                  onClick={() => setShowImagePreview(true)}
                />
              </Whisper>
            )}
            {/* If showImagePreview is true, render the image directly without Whisper */}
            {showImagePreview && (
              <img
                src={selectedProduct.image}
                alt={selectedProduct.name}
                className="block w-1/5 h-auto mb-2 cursor-pointer"
                onClick={() => setShowImagePreview(true)}
              />
            )}
            <div className="space-y-2"></div>
            <p className="text-sm text-gray-20 mb-3">
              <span className="font-semibold">Category:</span>{" "}
              {selectedProduct.inventory_category?.name || "No category"}
            </p>
            <p className="text-sm text-gray-20 mb-3">
              <span className="font-semibold">Description:</span>{" "}
              {selectedProduct.description
                ? selectedProduct.description
                : "no description"}
            </p>
            <p className="text-sm text-gray-20 mb-3">
              <span className="font-semibold">Dimensions:</span>{" "}
              {selectedProduct.dimensions} cm
            </p>
            <p className="text-sm text-gray-20 mb-3">
              <span className="font-semibold">Cost Price:</span> &#8358;{" "}
              {selectedProduct.cost_price}
            </p>
            <p className="text-sm text-gray-20 mb-3">
              <span className="font-semibold">Selling Price:</span> &#8358;{" "}
              {selectedProduct.selling_price}
            </p>
            <p className="text-sm text-gray-20 mb-3">
              <span className="font-semibold">Profit per item:</span> &#8358;{" "}
              {selectedProduct.profit_per_item}
            </p>
            <p className="text-sm text-gray-20 mb-3">
              <span className="font-semibold">Total Price:</span> &#8358;{" "}
              {selectedProduct.total_price}
            </p>

            <button
              onClick={editItem}
              className="pt-2 pr-3 p-2 text-blue-400 rounded-lg border-2 border-blue-400 mt-4 mr-2 font-bold"
            >
              <FontAwesomeIcon className="pr-1 text-blue-400" icon={faPencil} />
              Edit details
            </button>
            <button
              onClick={confirmDeleteItem}
              className="pt-2 pr-3 p-2 text-red-400 rounded-lg border-2 border-red-400 mt-4 font-bold"
            >
              <FontAwesomeIcon className="pr-1 text-red-400" icon={faTrash} />
              Delete Item
            </button>
          </div>
        </div>
      )}

      {/* confirmation modal */}
      {confirmDelete && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[100]">
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

      {/*   IMAGE PREVIEW   */}
      {showImagePreview && selectedProduct && (
        <div
          className="fixed inset-0 bg-opacity-90 flex items-center justify-center z-[200]"
          onClick={() => setShowImagePreview(false)}
        >
          <div className="relative max-w-4xl mx-4 rounded-lg shadow-lg">
            <img
              className="max-h-[90vh] w-auto object-contain"
              src={selectedProduct.image}
              alt="product image"
            />
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

export default Table;
