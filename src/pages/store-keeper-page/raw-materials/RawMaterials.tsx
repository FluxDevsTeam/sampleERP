import InventoryData from "@/pages/shop/inventory/Inventory Components/InventoryData";
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
  
  // Add filter state
  const [archived, setArchived] = useState(false);
  const [emptyStock, setEmptyStock] = useState(false);
  const [lowStock, setLowStock] = useState(false);
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const filterRef = useRef<HTMLDivElement>(null);

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
      // Clear filters too
      setArchived(false);
      setEmptyStock(false);
      setLowStock(false);
    } finally {
      setSearchLoading(false);
    }
  };

  // Add click outside handler for filter dropdown
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

  const fetchRMInfo = async () => {
    setLoading(true);
    try {
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
            price: item.price,
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
  }, [openProductId, searchQuery, archived, emptyStock, lowStock, location.search]); // Added filter states to trigger refresh

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

  const formatNumber = (num: number | string) => {
    if (num === undefined || num === null) return '-';
    return Number(num).toLocaleString();
  };

  return (
    <>
      <div className={`wrapper w-11/12 mx-auto mb-0 mt-0 pl-1 pb-12 pt-2`}>
        {/* <h1
          className={`${showImagePreview ? "blur-sm" : ""} ${
            showModal ? "blur-md" : ""
          }`}
          style={{ fontSize: "clamp(16.5px, 3vw, 30px)" }}
        >
          Raw Material Summary
        </h1> */}
        <div
          className={`grid grid-cols-2  gap-2 md:gap-4 mb-4 ${
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
          <div className="grid grid-cols-2 items-center mb-4">
            <h1
              style={{ fontSize: "clamp(16.5px, 3vw, 30px)" }}
              className="font-semibold py-0 mt-0"
            >
              Raw Materials
            </h1>
            <div className="flex justify-end">
              <button
                onClick={() => navigate("/store-keeper/add-raw-material")}
                className="px-4 py-2 bg-blue-400 text-white rounded mr-2 hover:bg-blue-500 transition-colors"
              >
                <FontAwesomeIcon className="pr-2" icon={faPlus} />
                Add Material
              </button>
            </div>
          </div>

          {/* Search and Filter Bar */}
          <div className="flex justify-between items-center mb-4">
            {/* Search Bar */}
            <div className="flex items-center gap-x-2 w-1/2">
              <input
                type="text"
                placeholder="Search for raw materials..."
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
                <FontAwesomeIcon icon={faSearch} className="inline md:hidden" />
                <span className="hidden md:inline">Search</span>
              </button>
              <button
                onClick={handleClear}
                className="bg-gray-300 text-black px-4 py-2 rounded hover:bg-gray-400 flex items-center justify-center"
              >
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
                  <h2 className="text-lg font-semibold text-gray-800 mb-1">No raw materials found</h2>
                  <p className="text-gray-500 mb-6 text-center max-w-xs">All your raw materials will show up here. Start by adding a new raw material.</p>
                </div>
              ) : (
                <div>
                  <table className="min-w-full bg-white shadow-md rounded-lg overflow-hidden text-xs sm:text-sm">
                    <thead>
                      <tr className="bg-blue-400 text-white">
                        <th className="py-2 px-2 sm:py-4 sm:px-4 text-left font-semibold">Name</th>
                        <th className="py-2 px-2 sm:py-4 sm:px-4 text-left font-semibold hidden sm:table-cell">Category</th>
                        <th className="py-2 px-2 sm:py-4 sm:px-4 text-left font-semibold">Quantity</th>
                        <th className="py-2 px-2 sm:py-4 sm:px-4 text-left font-semibold hidden md:table-cell">Price</th>
                        <th className="py-2 px-2 sm:py-4 sm:px-4 text-left font-semibold hidden md:table-cell">Total Value</th>
                        <th className="py-2 px-2 sm:py-4 sm:px-4 text-left font-semibold">Details</th>
                      </tr>
                    </thead>
                    <tbody>
                      {currentItems.map((row, index) => (
                        <tr key={index} className="hover:bg-gray-100">
                          <td className="py-2 px-2 sm:py-4 sm:px-4 border-b border-gray-200 text-sm text-gray-700">{row.Name}</td>
                          <td className="py-2 px-2 sm:py-4 sm:px-4 border-b border-gray-200 text-sm text-gray-700 hidden sm:table-cell">{row.Category}</td>
                          <td className="py-2 px-2 sm:py-4 sm:px-4 border-b border-gray-200 text-sm text-gray-700">{row.Quantity}</td>
                          <td className="py-2 px-2 sm:py-4 sm:px-4 border-b border-gray-200 text-sm text-gray-700 hidden md:table-cell">₦ {formatNumber(typeof row.price === 'number' || typeof row.price === 'string' ? row.price : 0)}</td>
                          <td className="py-2 px-2 sm:py-4 sm:px-4 border-b border-gray-200 text-sm text-gray-700 hidden md:table-cell">₦ {formatNumber((Number(typeof row.price === 'number' || typeof row.price === 'string' ? row.price : 0) * Number(typeof row.Quantity === 'number' || typeof row.Quantity === 'string' ? row.Quantity.toString().replace(/,/g, '') : 0)))}</td>
                          <td className="py-2 px-2 sm:py-4 sm:px-4 border-b border-gray-200 text-sm text-gray-700">{row.Details}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )
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
            <div className={`fixed inset-0 flex items-center justify-center z-[100] ${confirmDelete ? "blur-sm" : ""} ${showImagePreview ? "blur-sm" : ""}`}> 
              <div className="absolute inset-0 bg-black opacity-50" onClick={() => setShowModal(false)}></div>
              <div className="w-[95vw] max-w-2xl mx-auto p-4 sm:p-6 bg-white border border-gray-200 rounded-lg shadow-lg relative z-10 overflow-y-auto" style={{ maxHeight: '80vh' }}>
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-lg sm:text-xl font-bold text-black">{selectedProduct.name}</h2>
                  <button onClick={() => setShowModal(false)} className="text-gray-500 hover:text-gray-700 focus:outline-none text-2xl font-bold" aria-label="Close">×</button>
                </div>
                {!showImagePreview && selectedProduct.image && (
                  <Whisper followCursor speaker={<Tooltip>Click for full view</Tooltip>}>
                    <img src={selectedProduct.image} alt={selectedProduct.name} className="block w-24 h-24 object-contain mb-4 cursor-pointer border border-gray-200 rounded" onClick={() => setShowImagePreview(true)} />
                  </Whisper>
                )}
                {showImagePreview && selectedProduct.image && (
                  <img src={selectedProduct.image} alt={selectedProduct.name} className="block w-24 h-24 object-contain mb-4 cursor-pointer border border-gray-200 rounded" onClick={() => setShowImagePreview(true)} />
                )}
                <div className="grid grid-cols-2 gap-4 bg-white border border-gray-100 rounded-lg p-4 mb-4 shadow">
                  <div className="flex flex-col gap-1">
                    <span className="text-xs font-semibold text-black uppercase">Category</span>
                    <span className="text-base font-bold text-black">{selectedProduct.store_category?.name || "No category"}</span>
                  </div>
                  <div className="flex flex-col gap-1 col-span-2 sm:col-span-2">
                    <span className="text-xs font-semibold text-black uppercase">Description</span>
                    <span className="text-base font-bold text-black">{selectedProduct.description || "No description"}</span>
                  </div>
                  <div className="flex flex-col gap-1">
                    <span className="text-xs font-semibold text-black uppercase">Quantity</span>
                    <span className="text-base font-bold text-black">{formatNumber(selectedProduct.quantity)}</span>
                  </div>
                  <div className="flex flex-col gap-1">
                    <span className="text-xs font-semibold text-black uppercase">Unit</span>
                    <span className="text-base font-bold text-black">{selectedProduct.unit}</span>
                  </div>
                  <div className="flex flex-col gap-1">
                    <span className="text-xs font-semibold text-black uppercase">Price</span>
                    <span className="text-base font-bold text-black">₦ {formatNumber(selectedProduct.price)}</span>
                  </div>
                  <div className="flex flex-col gap-1">
                    <span className="text-xs font-semibold text-black uppercase">Total Value</span>
                    <span className="text-base font-bold text-black">₦ {formatNumber(Number(selectedProduct.price) * Number(selectedProduct.quantity))}</span>
                  </div>
                  <div className="flex flex-col gap-1">
                    <span className="text-xs font-semibold text-black uppercase">Archived</span>
                    <span className="text-base font-bold text-black">{selectedProduct.archived ? "Yes" : "No"}</span>
                  </div>
                </div>
                <div className="grid grid-cols-3 gap-2 w-full mt-2">
                  <button onClick={() => setShowModal(false)} className="w-full py-2 px-4 bg-gray-300 text-black rounded hover:bg-gray-400 transition-colors text-sm">Close</button>
                {userRole === "ceo" && (
                    <button onClick={editItem} className="w-full py-2 px-4 bg-blue-400 text-white rounded hover:bg-blue-500 transition-colors text-sm">
                      <FontAwesomeIcon className="pr-1" icon={faPencil} /> Edit
                    </button>
                  )}
                  {userRole === "ceo" && (
                    <button onClick={confirmDeleteItem} className="w-full py-2 px-4 bg-red-500 text-white rounded hover:bg-red-600 transition-colors text-sm">
                      <FontAwesomeIcon className="pr-1" icon={faTrash} /> Delete
                    </button>
                  )}
                  </div>
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
