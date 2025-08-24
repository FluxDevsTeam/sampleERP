import React, { useEffect, useState, useRef } from "react";
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
import InventoryData from "@/pages/shop/inventory/Inventory Components/InventoryData";
import rawMaterialsData from "@/data/store-keeper-page/raw-materials/raw-materials.json";

interface TableData {
  Name: string;
  Category: string;
  Quantity: string | number;
  price: number;
  Details: JSX.Element;
  [key: string]: string | number | JSX.Element;
}

const RawMaterials: React.FC = () => {
  document.title = "Items - Inventory Admin";
  const navigate = useNavigate();
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const openProductId = searchParams.get("openProduct");

  const [totalStockValue] = useState(rawMaterialsData.results.total_stock_value);
  const [totalStoreCount] = useState(rawMaterialsData.results.total_store_count);
  const [tableData, setTableData] = useState<TableData[]>([]);
  const [rawMaterials, setRawMaterials] = useState(rawMaterialsData.results.items);
  const [filteredMaterials, setFilteredMaterials] = useState(rawMaterialsData.results.items);
  const [loading, setLoading] = useState<boolean>(false);
  const [showModal, setShowModal] = useState<boolean>(false);
  const [selectedProduct, setSelectedProduct] = useState<any | null>(null);
  const [showImagePreview, setShowImagePreview] = useState<boolean>(false);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;
  const [modalConfig, setModalConfig] = useState({
    isOpen: false,
    title: "",
    message: "",
    type: "success" as "success" | "error",
  });
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchInput, setSearchInput] = useState("");
  const [searchLoading, setSearchLoading] = useState(false);
  const [archived, setArchived] = useState(false);
  const [emptyStock, setEmptyStock] = useState(false);
  const [lowStock, setLowStock] = useState(false);
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const filterRef = useRef<HTMLDivElement>(null);

  const handleSearch = async () => {
    setSearchLoading(true);
    try {
      setSearchQuery(searchInput);
      setCurrentPage(1);
    } finally {
      setSearchLoading(false);
    }
  };

  const handleClear = async () => {
    setSearchLoading(true);
    try {
      setSearchInput("");
      setSearchQuery("");
      setCurrentPage(1);
      setArchived(false);
      setEmptyStock(false);
      setLowStock(false);
    } finally {
      setSearchLoading(false);
    }
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (filterRef.current && !filterRef.current.contains(event.target as Node)) {
        setIsFilterOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isFilterOpen]);

  const fetchRMInfo = () => {
    setLoading(true);
    const filtered = rawMaterialsData.results.items.filter((item: any) => {
      const matchesSearch = searchQuery
        ? item.name.toLowerCase().includes(searchQuery.toLowerCase())
        : true;
      const matchesArchived = archived ? item.archived : true;
      const matchesEmptyStock = emptyStock ? item.quantity === 0 : true;
      const matchesLowStock = lowStock ? item.quantity > 0 && item.quantity < 100 : true;
      return matchesSearch && matchesArchived && matchesEmptyStock && matchesLowStock;
    });

    const updatedTableData: TableData[] = filtered.map((item: any) => ({
      Name: item.name,
      Category: item.store_category?.name || "No category",
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
    }));

    setTableData(updatedTableData);
    setFilteredMaterials(filtered);
    setCurrentItems(updatedTableData.slice(0, itemsPerPage));
    setTotalPages(Math.ceil(filtered.length / itemsPerPage));
    setCount(filtered.length);
    setLoading(false);
  };

  useEffect(() => {
    fetchRMInfo();
    if (openProductId) {
      const product = rawMaterialsData.results.items.find(
        (item: any) => item.id.toString() === openProductId
      );
      if (product) {
        handleViewDetails(product);
      }
    }
  }, [openProductId, searchQuery, archived, emptyStock, lowStock]);

  useEffect(() => {
    if (showModal || showImagePreview) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [showModal, showImagePreview]);

  const handleViewDetails = (product: any) => {
    setSelectedProduct(product);
    setShowModal(true);
  };

  const deleteItem = () => {
    if (selectedProduct) {
      setTimeout(() => {
        setRawMaterials((prev) => prev.filter((item) => item.id !== selectedProduct.id));
        setFilteredMaterials((prev) => prev.filter((item) => item.id !== selectedProduct.id));
        setModalConfig({
          isOpen: true,
          title: "Success",
          message: "Item deleted successfully!",
          type: "success",
        });
        setShowModal(false);
        setConfirmDelete(false);
        fetchRMInfo();
      }, 1000);
    }
  };

  const editItem = () => {
    if (selectedProduct) {
      navigate(`/store-keeper/edit-raw-material/${selectedProduct.id}`);
    }
  };

  const handleCloseModal = () => {
    setModalConfig({ ...modalConfig, isOpen: false });
  };

  const confirmDeleteItem = () => {
    setConfirmDelete(true);
  };

  const handleConfirmDelete = async (e: React.MouseEvent<HTMLButtonElement>) => {
    const button = e.currentTarget;
    button.disabled = true;
    setTimeout(() => {
      button.disabled = false;
    }, 3000);
    await deleteItem();
  };

  const formatNumber = (number: number | string | undefined | null) => {
    if (number === undefined || number === null || number === "") {
      return "0";
    }
    const num = typeof number === "string" ? parseFloat(number.replace(/,/g, '')) : number;
    if (isNaN(num)) {
      return String(number);
    }
    return num.toLocaleString("en-US", { maximumFractionDigits: 2 });
  };

  const [currentItems, setCurrentItems] = useState<TableData[]>([]);
  const [totalPages, setTotalPages] = useState(1);
  const [count, setCount] = useState(0);

  const handlePageChange = (pageNumber: number) => {
    if (pageNumber < 1 || pageNumber > totalPages) return;
    setCurrentPage(pageNumber);
    const indexOfLastItem = pageNumber * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    setCurrentItems(tableData.slice(indexOfFirstItem, indexOfLastItem));
  };

  return (
    <div className="wrapper w-full mx-auto mt-0 pl-1 mb-20 md:mb-4 pt-2">
      <div className="grid grid-cols-2 gap-2 md:gap-4 mb-4">
        <InventoryData info="Total Item Count" digits={totalStoreCount} />
        <InventoryData info="Total Inventory Value" digits={totalStockValue} currency="₦" />
      </div>

      <div className="relative">
        <div className="grid grid-cols-2 items-center mb-4">
          <h1 style={{ fontSize: "clamp(16.5px, 3vw, 30px)" }} className="font-semibold py-0 mt-0">
            Items
          </h1>
          <div className="flex justify-end">
            <button
              onClick={() => navigate("/store-keeper/add-raw-material")}
              className="px-4 py-2 bg-blue-400 text-white rounded mr-2 hover:bg-blue-500 transition-colors"
            >
              <FontAwesomeIcon className="pr-2" icon={faPlus} />
              Add Item
            </button>
          </div>
        </div>

        <div className="flex justify-between items-center mb-4">
          <div className="flex items-center gap-x-2 w-1/2">
            <input
              type="text"
              placeholder="Search for items..."
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
          <div className="relative" ref={filterRef}>
            <button
              onClick={() => setIsFilterOpen(!isFilterOpen)}
              className="border p-2 rounded flex items-center"
            >
              Filters
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
              />
            </div>
          ) : (
            currentItems.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-6 bg-white rounded-lg border border-gray-200 shadow-sm mb-2">
                <div className="flex items-center justify-center w-16 h-16 rounded-full bg-blue-50 mb-4">
                  <svg className="w-8 h-8 text-blue-400" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 17v-2a2 2 0 012-2h2a2 2 0 012 2v2m-6 4h6a2 2 0 002-2V7a2 2 0 00-2-2h-1V3.5a1.5 1.5 0 00-3 0V5H9a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                </div>
                <h2 className="text-lg font-semibold text-gray-800 mb-1">No items found</h2>
                <p className="text-gray-500 mb-6 text-center max-w-xs">All your items will show up here. Start by adding a new item.</p>
              </div>
            ) : (
              <div>
                <table className="min-w-full bg-white shadow-md rounded-none overflow-hidden text-xs sm:text-sm">
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
                        <td className="py-2 px-2 sm:py-4 sm:px-4 border-b border-gray-200 text-sm text-gray-700">{formatNumber(row.Quantity)}</td>
                        <td className="py-2 px-2 sm:py-4 sm:px-4 border-b border-gray-200 text-sm text-gray-700 hidden md:table-cell">₦ {formatNumber(row.price)}</td>
                        <td className="py-2 px-2 sm:py-4 sm:px-4 border-b border-gray-200 text-sm text-gray-700 hidden md:table-cell">₦ {formatNumber(Number(row.price) * Number(row.Quantity.toString().replace(/,/g, '')))}</td>
                        <td className="py-2 px-2 sm:py-4 sm:px-4 border-b border-gray-200 text-sm text-gray-700">{row.Details}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )
          )}
        </div>

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

        {showModal && selectedProduct && (
          <div className={`fixed inset-0 flex items-center justify-center z-[100] ${confirmDelete ? "blur-sm" : ""} ${showImagePreview ? "blur-sm" : ""}`}>
            <div className="absolute inset-0 bg-black opacity-50" onClick={() => setShowModal(false)}></div>
            <div className="w-[95vw] max-w-2xl mx-auto p-4 sm:p-6 bg-white border border-gray-200 rounded-lg shadow-lg relative z-10 overflow-y-auto" style={{ maxHeight: '80vh' }}>
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-lg sm:text-xl font-bold text-black">{selectedProduct.name}</h2>
                <button onClick={() => setShowModal(false)} className="text-gray-500 hover:text-gray-700 focus:outline-none text-2xl font-bold" aria-label="Close">×</button>
              </div>
              {selectedProduct.image && (
                <Whisper followCursor speaker={<Tooltip>Click for full view</Tooltip>}>
                  <img src={selectedProduct.image} alt={selectedProduct.name} className="block w-24 h-24 object-contain mb-4 cursor-pointer border border-gray-200 rounded" onClick={() => setShowImagePreview(true)} />
                </Whisper>
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
                <button onClick={editItem} className="w-full py-2 px-4 bg-blue-400 text-white rounded hover:bg-blue-500 transition-colors text-sm">
                  <FontAwesomeIcon className="pr-1" icon={faPencil} /> Edit
                </button>
                <button onClick={confirmDeleteItem} className="w-full py-2 px-4 bg-red-500 text-white rounded hover:bg-red-600 transition-colors text-sm">
                  <FontAwesomeIcon className="pr-1" icon={faTrash} /> Delete
                </button>
              </div>
            </div>
          </div>
        )}

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

        {showImagePreview && selectedProduct && (
          <div
            className="fixed inset-0 bg-opacity-90 flex items-center justify-center z-[200] p-4"
            onClick={() => setShowImagePreview(false)}
          >
            <div className="relative max-w-4xl mx-4 rounded-lg shadow-lg">
              <img
                className="max-h-[90vh] w-auto object-contain"
                src={selectedProduct.image}
                alt="item image"
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
  );
};

export default RawMaterials;