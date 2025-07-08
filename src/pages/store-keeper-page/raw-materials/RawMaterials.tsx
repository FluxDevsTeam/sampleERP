import InventoryData from "@/pages/shop/inventory/Inventory Components/InventoryData";
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
  faSearch,
} from "@fortawesome/free-solid-svg-icons";
import { useNavigate, useLocation } from "react-router-dom";
import Modal from "@/pages/shop/Modal";

interface TableData {
  Name: string;
  Category: string;
  Quantity: string | number;
  Details: JSX.Element;
  [key: string]: string | number | JSX.Element;
}

export const RawMaterials: React.FC = () => {
  document.title = "RM - KDC Admin";
  const [totalStockValue, setTotalStockValue] = useState(0);
  const [totalStoreCount, setTotalStoreCount] = useState(0);

  const tableHeaders = ["Name", "Category", "Quantity", "Details"];
  const [tableData, setTableData] = useState<TableData[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [showModal, setShowModal] = useState<boolean>(false);
  const [selectedProduct, setSelectedProduct] = useState<any | null>(null);
  const [showImagePreview, setShowImagePreview] = useState<boolean>(false);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;
  const navigate = useNavigate();
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const openProductId = searchParams.get("openProduct");
  const [modalConfig, setModalConfig] = useState({
    isOpen: false,
    title: "",
    message: "",
    type: "success" as "success" | "error",
  });
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [userRole, setUserRole] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchInput, setSearchInput] = useState("");
  const [searchLoading, setSearchLoading] = useState(false);
  const [rawMaterials, setRawMaterials] = useState<any[]>([]);
  const [filteredMaterials, setFilteredMaterials] = useState<any[]>([]);

  const handleSearch = async () => {
    setSearchLoading(true);
    try {
      // Simulate search delay
      await new Promise(resolve => setTimeout(resolve, 500));
      const filtered = rawMaterials.filter((material) =>
        material.name.toLowerCase().includes(searchInput.toLowerCase())
      );
      setFilteredMaterials(filtered);
      setCurrentPage(1);
    } finally {
      setSearchLoading(false);
    }
  };

  const handleClear = async () => {
    setSearchLoading(true);
    try {
      // Simulate clear delay
      await new Promise(resolve => setTimeout(resolve, 300));
      setSearchInput("");
      setFilteredMaterials(rawMaterials);
      setCurrentPage(1);
    } finally {
      setSearchLoading(false);
    }
  };

  const fetchRMInfo = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (searchQuery) {
        params.append("search", searchQuery);
      }
      const response = await fetch(
        `https://backend.kidsdesigncompany.com/api/raw-materials/?${params.toString()}`,
        {
          method: "GET",
          headers: {
            Authorization: `JWT ${localStorage.getItem("accessToken")}`,
          },
        }
      );


      if (!response.ok) {
        throw new Error("Authentication failed");
      }

      const logData = await response.json();
      // console.log(logData);

      setTotalStockValue(logData.results.total_stock_value);
      setTotalStoreCount(logData.results.total_store_count);

      const updatedTableData: TableData[] = logData.results.items.map(
        (item: any) => {
          return {
            Name: item.name,
            Category: item.store_category?.name,
            Quantity: item.quantity ? Number(item.quantity).toLocaleString() : 0,
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
      setRawMaterials(logData.results.items);
      setFilteredMaterials(logData.results.items);
    } catch (error) {
      console.error("Error fetching items:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    setUserRole(localStorage.getItem("user_role"));
    const loadData = async () => {
      await fetchRMInfo();
      if (openProductId) {
        try {
          const response = await fetch(
            `https://backend.kidsdesigncompany.com/api/raw-materials/${openProductId}/`,
            {
              method: "GET",
              headers: {
                Authorization: `JWT ${localStorage.getItem("accessToken")}`,
              },
            }
          );
          if (response.ok) {
            const product = await response.json();
            handleViewDetails(product);
          }
        } catch (error) {
          console.error("Error fetching product details:", error);
        }
      }
    };

    loadData();
  }, [openProductId, searchQuery, location.search]); // Added location.search to trigger refresh

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
    } else {
      document.body.style.overflow = "unset";
    }

    // Cleanup function to reset overflow when component unmounts
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [showModal, showImagePreview]);

  const handleViewDetails = (product: any) => {
    setSelectedProduct(product);
    setShowModal(true);
  };

  // DELETING ITEM
  const deleteItem = async () => {
    if (selectedProduct) {
      try {
        const response = await fetch(
          `https://backend.kidsdesigncompany.com/api/raw-materials/${selectedProduct.id}/`,
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
          message: "Raw material deleted successfully!",
          type: "success",
        });
        setShowModal(false);
        setConfirmDelete(false);
        fetchRMInfo();
      } catch (error) {
        console.error("Error deleting RM:", error);
        setModalConfig({
          isOpen: true,
          title: "Error",
          message: "Failed to delete raw material",
          type: "error",
        });
      }
    }
  };

  // NAVIGATION TO EDIT PAGE
  const editItem = () => {
    if (selectedProduct) {
      navigate(`/store-keeper/edit-raw-material/${selectedProduct.id}`);
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
    <>
      <div className={`wrapper w-11/12 mx-auto mb-0 mt-7 pl-1 pt-2`}>
        {/* <h1
          className={`${showImagePreview ? "blur-sm" : ""} ${
            showModal ? "blur-md" : ""
          }`}
          style={{ fontSize: "clamp(16.5px, 3vw, 30px)" }}
        >
          Raw Material Summary
        </h1> */}
        <div
          className={`grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2 sm:gap-4 mb-4 mt-2 ${
            showImagePreview ? "blur-sm" : ""
          } ${showModal ? "blur-md" : ""}`}
        >
          <InventoryData
            info="Total Store Count"
            digits={totalStoreCount}
          ></InventoryData>
          <InventoryData
            info="Total Cost Value"
            digits={totalStockValue}
            currency="₦"
          ></InventoryData>

        </div>

        <div className="relative">
          <h1
            style={{ fontSize: "clamp(16.5px, 3vw, 30px)" }}
            className={`font-semibold py-3 sm:py-5 mt-2 ${
              showImagePreview ? "blur-sm" : ""
            } ${showModal ? "blur-md" : ""}`}
          >
            Raw Materials
          </h1>

          <div
            className={`overflow-x-auto pb-6 ${
              showImagePreview ? "blur-sm" : ""
            } ${showModal ? "blur-md" : ""}`}
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
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4 gap-3 sm:gap-0">
                  {/* Left side: Search */}
                  <div className="flex items-center w-full sm:w-auto">
                    <div className="relative flex-1 sm:flex-none">
                      <input
                        type="text"
                        placeholder="Search..."
                        value={searchInput}
                        onChange={(e) => setSearchInput(e.target.value)}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter') {
                            handleSearch();
                          }
                        }}
                        className="w-full sm:w-auto pl-3 sm:pl-4 pr-3 sm:pr-4 py-2 border rounded-l-lg focus:outline-none focus:ring-2 focus:ring-blue-400 text-sm sm:text-base"
                      />
                    </div>
                    <button
                      onClick={handleSearch}
                      disabled={searchLoading}
                      className={`px-3 sm:px-4 py-2 bg-blue-400 text-white rounded-r-lg hover:bg-blue-500 transition-colors border-l-0 text-sm sm:text-base ${
                        searchLoading ? "opacity-50 cursor-not-allowed" : ""
                      }`}
                    >
                      {searchLoading ? (
                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      ) : (
                        <FontAwesomeIcon icon={faSearch} />
                      )}
                    </button>
                    <button
                      onClick={handleClear}
                      disabled={searchLoading}
                      className={`ml-2 px-2 sm:px-3 py-2 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400 transition-colors text-sm sm:text-base ${
                        searchLoading ? "opacity-50 cursor-not-allowed" : ""
                      }`}
                    >
                      {searchLoading ? (
                        <div className="w-4 h-4 border-2 border-gray-600 border-t-transparent rounded-full animate-spin"></div>
                      ) : (
                        <FontAwesomeIcon icon={faXmark} size="2x" className="font-bold text-2xl text-gray-700 hover:text-red-500 transition-colors" />
                      )}
                    </button>
                  </div>

                  {/* Right side: Add button */}
                  <button
                    onClick={() => navigate("/store-keeper/add-raw-material")}
                    className="w-full sm:w-auto px-3 sm:px-4 py-2 bg-blue-400 text-white rounded hover:bg-blue-500 transition-colors text-sm sm:text-base"
                  >
                    <FontAwesomeIcon className="pr-1 sm:pr-2" icon={faPlus} />
                    Add Raw Material
                  </button>
                </div>
                <div className="overflow-x-auto">
                  <table className="min-w-full bg-white shadow-md rounded-lg overflow-hidden">
                    <thead>
                      <tr className="bg-blue-400 text-white">
                        {tableHeaders.map((header) => (
                          <th
                            key={header}
                            className="py-2 sm:py-4 px-2 sm:px-4 text-left text-xs sm:text-sm font-semibold"
                          >
                            {header}
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {currentItems.map((row, index) => (
                        <tr key={index} className="hover:bg-gray-100">
                          {tableHeaders.map((header) => (
                            <td
                              key={`${index}-${header}`}
                              className="py-3 sm:py-5 px-2 sm:px-4 border-b border-gray-200 text-xs sm:text-sm text-gray-700"
                            >
                              {row[header]}
                            </td>
                          ))}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </div>

          {/* Updated Pagination Controls */}
          <div className="flex justify-center items-center mb-20 sm:mb-28 gap-1 sm:gap-2">
            <button
              onClick={() => handlePageChange(1)}
              disabled={currentPage === 1}
              className="px-2 sm:px-3 py-1 rounded bg-blue-400 text-white disabled:bg-gray-300 text-xs sm:text-sm"
            >
              <FontAwesomeIcon icon={faAnglesLeft} />
            </button>
            <button
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1}
              className="px-2 sm:px-3 py-1 rounded bg-blue-400 text-white disabled:bg-gray-300 text-xs sm:text-sm"
            >
              <FontAwesomeIcon icon={faArrowLeft} />
            </button>

            <span className="mx-2 sm:mx-4 text-xs sm:text-sm">
              Page {currentPage} of {totalPages}
            </span>

            <button
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage === totalPages}
              className="px-2 sm:px-3 py-1 rounded bg-blue-400 text-white disabled:bg-gray-300 text-xs sm:text-sm"
            >
              <FontAwesomeIcon icon={faArrowRight} />
            </button>
            <button
              onClick={() => handlePageChange(totalPages)}
              disabled={currentPage === totalPages}
              className="px-2 sm:px-3 py-1 rounded bg-blue-400 text-white disabled:bg-gray-300 text-xs sm:text-sm"
            >
              <FontAwesomeIcon icon={faAnglesRight} />
            </button>
          </div>

          {/*   PRODUCT DETAILS   */}
          {showModal && selectedProduct && (
            <div
              className={`fixed inset-0 flex items-center justify-center z-[100] p-4 ${
                confirmDelete ? "blur-sm" : ""
              } ${showImagePreview ? "blur-sm" : ""}`}
            >
              <div
                className="absolute inset-0 bg-black opacity-50"
                onClick={() => setShowModal(false)}
              ></div>
              <div className="bg-white rounded-lg p-4 sm:p-6 max-w-md w-full mx-4 border-2 border-gray-800 shadow-lg relative z-10 max-h-[90vh] overflow-y-auto">
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-lg sm:text-2xl font-bold text-gray-20">
                    {selectedProduct.name}{" "}
                  </h2>
                  <button
                    onClick={() => setShowModal(false)}
                    className="text-gray-500 hover:text-gray-700 focus:outline-none text-lg sm:text-xl"
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
                <p className="text-xs sm:text-sm text-gray-20 mb-3">
                  <span className="font-semibold">Archived:</span>{" "}
                  {selectedProduct.archived ? "Yes" : "No"}
                </p>
                <p className="text-xs sm:text-sm text-gray-20 mb-3">
                  <span className="font-semibold">Category:</span>{" "}
                  {selectedProduct.store_category?.name || "No category"}
                </p>
                <p className="text-xs sm:text-sm text-gray-20 mb-3">
                  <span className="font-semibold">Description:</span>{" "}
                  {selectedProduct.description
                    ? selectedProduct.description
                    : "no description"}
                </p>
                <p className="text-xs sm:text-sm text-gray-20 mb-3">
                  <span className="font-semibold">Price:</span>{" "}
                  {selectedProduct.price
                    ? `₦${Number(selectedProduct.price).toLocaleString()}`
                    : "-"}
                </p>
                <p className="text-xs sm:text-sm text-gray-20 mb-3">
                  <span className="font-semibold">Quantity:</span>{" "}
                  {selectedProduct.quantity
                    ? Number(selectedProduct.quantity).toLocaleString()
                    : "-"}
                </p>
                <p className="text-xs sm:text-sm text-gray-20 mb-3">
                  <span className="font-semibold">Unit:</span>{" "}
                  {selectedProduct.unit ? selectedProduct.unit : "-"}
                </p>

                {userRole === "ceo" && (
                  <div className="flex flex-col sm:flex-row gap-2 sm:gap-0">
                    <button
                      onClick={editItem}
                      className="px-3 p-2 text-blue-400 rounded-lg border-2 border-blue-400 mt-4 sm:mr-2 font-bold text-sm sm:text-base"
                    >
                      <FontAwesomeIcon
                        className="text-blue-400"
                        icon={faPencil}
                      />
                      {/* Edit details */}
                    </button>
                    <button
                      onClick={confirmDeleteItem}
                      className="px-3 p-2 text-red-400 rounded-lg border-2 border-red-400 mt-2 sm:mt-4 font-bold text-sm sm:text-base"
                    >
                      <FontAwesomeIcon
                        className="text-red-400"
                        icon={faTrash}
                      />
                      {/* Delete Item */}
                    </button>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* confirmation modal */}
          {confirmDelete && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[100] p-4">
              <div className="bg-white rounded-lg p-4 sm:p-6 w-[90vw] sm:w-96 max-h-[90vh] overflow-y-auto">
                <div className="flex justify-between items-center">
                  <h3 className="text-base sm:text-lg mb-4 font-medium">Confirm Deletion</h3>
                  <FontAwesomeIcon
                    icon={faXmark}
                    size="2x"
                    className="font-bold text-2xl text-gray-700 hover:text-red-500 transition-colors"
                    onClick={() => setConfirmDelete(false)}
                  />
                </div>
                <p className="text-sm sm:text-base">Are you sure you want to delete this item?</p>
                <div className="space-y-3 mt-4">
                  <button
                    onClick={handleConfirmDelete}
                    className="w-full py-2 px-4 bg-red-500 text-white rounded hover:bg-red-600 transition-colors flex items-center justify-center text-sm sm:text-base"
                  >
                    Confirm
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

          {/*   IMAGE PREVIEW   */}
          {showImagePreview && selectedProduct && (
            <div
              className="fixed inset-0 bg-opacity-90 flex items-center justify-center z-[200] p-4"
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
      </div>
    </>
  );
};

export default RawMaterials;
