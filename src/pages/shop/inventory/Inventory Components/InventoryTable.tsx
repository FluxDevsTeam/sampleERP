import React, { useEffect, useState, JSX, useRef } from "react";
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
  faMagnifyingGlass,
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

const Table: React.FC<TableProps> = ({
  headers,
  onModalChange,
}) => {
  const userRole = localStorage.getItem("user_role");
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
  const [deleteLoading, setDeleteLoading] = useState(false);

  // Add search/filter state here
  const [searchInput, setSearchInput] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [archived, setArchived] = useState(false);
  const [emptyStock, setEmptyStock] = useState(false);
  const [lowStock, setLowStock] = useState(false);
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const filterRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!isFilterOpen) return;
    function handleClickOutside(event: MouseEvent) {
      if (filterRef.current && !filterRef.current.contains(event.target as Node)) {
        setIsFilterOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isFilterOpen]);

  const handleSearch = () => {
    setSearchQuery(searchInput);
  };

  const handleClear = () => {
    setSearchInput("");
    setSearchQuery("");
    setArchived(false);
    setEmptyStock(false);
    setLowStock(false);
  };

  const fetchItems = async () => {
    try {
      setLoading(true);

      const params = new URLSearchParams();
      if (searchQuery) {
        params.append("search", searchQuery);
      }
      if (archived) {
        params.append("archived", "true");
      }
      if (emptyStock) {
        params.append("empty_stock", "true");
      }
      if (lowStock) {
        params.append("low_stock", "true");
      }

      const response = await fetch(
        `https://backend.kidsdesigncompany.com/api/inventory-item/?${params.toString()}`,
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
  }, [searchQuery, archived, emptyStock, lowStock]);

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
    setDeleteLoading(true);
    await deleteItem();
    setDeleteLoading(false);
  };

  return (
    <div className="relative">
      {/* Heading and Add Button in a two-column grid */}
      <div className="grid grid-cols-2 items-center mb-4">
        <h1
          style={{ fontSize: "clamp(16.5px, 3vw, 30px)" }}
          className="font-semibold py-0 mt-0"
        >
          Inventory Items
        </h1>
        <div className="flex justify-end">
          <button
            onClick={() => navigate("/shop/add-new-item")}
            className="px-4 py-2 bg-blue-400 text-white rounded mr-2 hover:bg-blue-500 transition-colors"
          >
            <FontAwesomeIcon className="pr-2" icon={faPlus} />
            Add Item
          </button>
        </div>
      </div>
      {/* Search and Filter Bar */}
      <div className="flex justify-between items- mb-4">
        {/* Search Bar */}
        <div className="flex items-center gap-x-2 w-1/2 ">
          <input
            type="text"
            placeholder="Search for items by name..."
            className="border p-2 rounded w-32 md:w-96"
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") handleSearch();
            }}
          />
          <button
            onClick={handleSearch}
            className="bg-blue-400 text-white px-4 py-2 rounded hover:bg-blue-500 flex items-center justify-center"
          >
            {/* Icon for mobile, text for md+ */}
            <FontAwesomeIcon icon={faMagnifyingGlass} className="inline md:hidden" />
            <span className="hidden md:inline">Search</span>
          </button>
          <button
            onClick={handleClear}
            className="bg-gray-300 text-black px-4 py-2 rounded hover:bg-gray-400 flex items-center justify-center"
          >
            {/* Icon for mobile, text for md+ */}
            <FontAwesomeIcon icon={faXmark} className="inline md:hidden" />
            <span className="hidden md:inline">Clear</span>
          </button>
        </div>
        {/* Filter Dropdown */}
        <div className="relative" ref={filterRef}>
          <button
            onClick={() => setIsFilterOpen(!isFilterOpen)}
            className="border p-2 rounded flex items-center"
          >
            Filters{" "}
            <svg
              className="w-4 h-4 ml-2"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M19 9l-7 7-7-7"
              ></path>
            </svg>
          </button>
          {isFilterOpen && (
            <div className="absolute right-0 mt-2 w-48 bg-white border rounded-lg shadow-xl z-10">
              <div className="p-4">
                <label className="flex items-center cursor-pointer mb-2">
                  <input
                    type="checkbox"
                    className="form-checkbox h-5 w-5 text-blue-600 mr-2"
                    checked={archived}
                    onChange={() => setArchived(!archived)}
                  />
                  <span>Archived</span>
                </label>
                <label className="flex items-center cursor-pointer mb-2">
                  <input
                    type="checkbox"
                    className="form-checkbox h-5 w-5 text-blue-600 mr-2"
                    checked={emptyStock}
                    onChange={() => setEmptyStock(!emptyStock)}
                  />
                  <span>Empty Stock</span>
                </label>
                <label className="flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    className="form-checkbox h-5 w-5 text-blue-600 mr-2"
                    checked={lowStock}
                    onChange={() => setLowStock(!lowStock)}
                  />
                  <span>Low Stock</span>
                </label>
              </div>
            </div>
          )}
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
              ariaLabel="three-dots-loading"
              wrapperStyle={{}}
              wrapperClass=""
            />
          </div>
        ) : (
          currentItems.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-6 bg-white rounded-lg border border-gray-200 shadow-sm mb-10">
              <div className="flex items-center justify-center w-16 h-16 rounded-full bg-blue-50 mb-4">
                <svg className="w-8 h-8 text-blue-400" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 17v-2a2 2 0 012-2h2a2 2 0 012 2v2m-6 4h6a2 2 0 002-2V7a2 2 0 00-2-2h-1V3.5a1.5 1.5 0 00-3 0V5H9a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              </div>
              <h2 className="text-lg font-semibold text-gray-800 mb-1">No inventory items found</h2>
              <p className="text-gray-500 mb-6 text-center max-w-xs">All your inventory items will show up here. Start by adding a new item.</p>
            </div>
          ) : (
            <div>
              <table className="min-w-full bg-white shadow-md rounded-lg overflow-hidden text-xs sm:text-sm">
                <thead>
                  <tr className="bg-blue-400 text-white">
                    <th className="py-2 px-2 sm:py-4 sm:px-4 text-left font-semibold">Product</th>
                    <th className="py-2 px-2 sm:py-4 sm:px-4 text-left font-semibold hidden sm:table-cell">Category</th>
                    <th className="py-2 px-2 sm:py-4 sm:px-4 text-left font-semibold">Stock</th>
                    <th className="py-2 px-2 sm:py-4 sm:px-4 text-left font-semibold">Details</th>
                  </tr>
                </thead>
                <tbody>
                  {currentItems.map((row, index) => (
                    <tr key={index} className="hover:bg-gray-100">
                      <td className="py-2 px-2 sm:py-4 sm:px-4 border-b border-gray-200 text-sm text-gray-700">
                        {row.Product}
                      </td>
                      <td className="py-2 px-2 sm:py-4 sm:px-4 border-b border-gray-200 text-sm text-gray-700 hidden sm:table-cell">
                        {row.Category}
                      </td>
                      <td className="py-2 px-2 sm:py-4 sm:px-4 border-b border-gray-200 text-sm text-gray-700">
                        {row["Stock Status"]}
                      </td>
                      <td className="py-2 px-2 sm:py-4 sm:px-4 border-b border-gray-200 text-sm text-gray-700">
                        {row.Details}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )
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
          <div className="w-[95vw] max-w-md mx-auto p-4 sm:p-6 bg-white border border-gray-200 rounded-lg shadow-lg relative z-10" style={{ maxHeight: '80vh', overflowY: 'auto' }}>
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg sm:text-xl font-bold text-black">{selectedProduct.name}</h2>
              <button
                onClick={() => setShowModal(false)}
                className="text-gray-500 hover:text-gray-700 focus:outline-none text-2xl font-bold"
                aria-label="Close"
              >
                ×
              </button>
            </div>
            {!showImagePreview && selectedProduct.image && (
              <Whisper followCursor speaker={<Tooltip>Click for full view</Tooltip>}>
                <img
                  src={selectedProduct.image}
                  alt={selectedProduct.name}
                  className="block w-24 h-24 object-contain mb-4 cursor-pointer border border-gray-200 rounded"
                  onClick={() => setShowImagePreview(true)}
                />
              </Whisper>
            )}
            {showImagePreview && selectedProduct.image && (
              <img
                src={selectedProduct.image}
                alt={selectedProduct.name}
                className="block w-24 h-24 object-contain mb-4 cursor-pointer border border-gray-200 rounded"
                onClick={() => setShowImagePreview(true)}
              />
            )}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 bg-white border border-gray-100 rounded-lg p-4 mb-4 shadow">
              <div className="flex flex-col gap-1">
                <span className="text-xs font-semibold text-black uppercase">Category</span>
                <span className="text-base font-bold text-black">{selectedProduct.inventory_category?.name || "No category"}</span>
              </div>
              <div className="flex flex-col gap-1">
                <span className="text-xs font-semibold text-black uppercase">Stock</span>
                <span className="text-base font-bold text-black">{selectedProduct.stock ?? selectedProduct.quantity ?? '—'}</span>
              </div>
              <div className="flex flex-col gap-1 col-span-1 sm:col-span-2">
                <span className="text-xs font-semibold text-black uppercase">Description</span>
                <span className="text-base font-bold text-black">{selectedProduct.description || "No description"}</span>
              </div>
              <div className="flex flex-col gap-1">
                <span className="text-xs font-semibold text-black uppercase">Dimensions</span>
                <span className="text-base font-bold text-black">{selectedProduct.dimensions} cm</span>
              </div>
              <div className="flex flex-col gap-1">
                <span className="text-xs font-semibold text-black uppercase">Cost Price</span>
                <span className="text-base font-bold text-black">₦ {selectedProduct.cost_price}</span>
              </div>
              <div className="flex flex-col gap-1">
                <span className="text-xs font-semibold text-black uppercase">Selling Price</span>
                <span className="text-base font-bold text-black">₦ {selectedProduct.selling_price}</span>
              </div>
              <div className="flex flex-col gap-1">
                <span className="text-xs font-semibold text-black uppercase">Profit per item</span>
                <span className="text-base font-bold text-black">₦ {selectedProduct.profit_per_item}</span>
              </div>
              <div className="flex flex-col gap-1">
                <span className="text-xs font-semibold text-black uppercase">Total Price</span>
                <span className="text-base font-bold text-black">₦ {selectedProduct.total_price}</span>
              </div>
            </div>
            <div className="grid grid-cols-3 gap-2 w-full mt-2">
              <button
                onClick={() => setShowModal(false)}
                className="w-full py-2 px-4 bg-gray-300 text-black rounded hover:bg-gray-400 transition-colors text-sm"
              >
                Close
              </button>
              {userRole === "ceo" && (
                <button
                  onClick={editItem}
                  className="w-full py-2 px-4 bg-blue-400 text-white rounded hover:bg-blue-500 transition-colors text-sm"
                >
                  <FontAwesomeIcon className="pr-1" icon={faPencil} /> Edit
                </button>
              )}
              {userRole === "ceo" && (
                <button
                  onClick={confirmDeleteItem}
                  className="w-full py-2 px-4 bg-red-500 text-white rounded hover:bg-red-600 transition-colors text-sm"
                >
                  <FontAwesomeIcon className="pr-1" icon={faTrash} /> Delete
                </button>
              )}
            </div>
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
                disabled={deleteLoading}
                className={`w-full py-2 px-4 bg-red-500 text-white rounded hover:bg-red-600 transition-colors flex items-center justify-center ${
                  deleteLoading ? "opacity-50 cursor-not-allowed" : ""
                }`}
              >
                {deleteLoading ? "Deleting..." : "Confirm"}
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
