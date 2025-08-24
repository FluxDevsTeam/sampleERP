import React, { useState } from "react";
import { ThreeDots } from "react-loader-spinner";
import "rsuite/dist/rsuite.min.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faArrowLeft,
  faArrowRight,
  faAnglesLeft,
  faAnglesRight,
  faSearch,
  faPencil,
  faTrash,
  faXmark,
} from "@fortawesome/free-solid-svg-icons";
import { useNavigate } from "react-router-dom";
import DashboardData from "@/pages/shop/dashboard/Dashboard Components/DashboardData";
import MonthlyAddedValueSpikedChart from "./Dashboard Components/Monthly-Added-Value-Spiked-Chart";
import AmountSoldMonthlyBarChart from "./Dashboard Components/Amount-Sold-Monthly-Chart";
import dashboardDataJson from "@/data/store-keeper-page/dashboard/storekeeper-dashboard.json";

interface TableData {
  id: number;
  name: string;
  materials_count: number;
  total_materials_value: number;
}

const StoreKeeperDashboard: React.FC = () => {
  const navigate = useNavigate();

  const [dashboardData] = useState(dashboardDataJson.dashboardData);
  const [tableData, setTableData] = useState<TableData[]>(dashboardDataJson.rawMaterialsCategories);
  const [loading] = useState<boolean>(false);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [categoryToDelete, setCategoryToDelete] = useState<any | null>(null);
  const [showEditModal, setShowEditModal] = useState(false);
  const [categoryToEdit, setCategoryToEdit] = useState<any | null>(null);
  const [editedCategoryName, setEditedCategoryName] = useState("");
  const [userRole] = useState<string | null>("ceo"); // Set to 'ceo' for demo purposes
  const [editLoading, setEditLoading] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const itemsPerPage = 10;

  const handleUpdateCategory = () => {
    if (!categoryToEdit) return;
    setEditLoading(true);
    // Simulate API call by updating local state
    setTimeout(() => {
      setTableData((prev) =>
        prev.map((item) =>
          item.id === categoryToEdit.id ? { ...item, name: editedCategoryName } : item
        )
      );
      closeEditModal();
      setEditLoading(false);
    }, 1000); // Simulate network delay
  };

  const openEditModal = (category: any) => {
    setCategoryToEdit(category);
    setEditedCategoryName(category.name);
    setShowEditModal(true);
  };

  const closeEditModal = () => {
    setShowEditModal(false);
    setCategoryToEdit(null);
    setEditedCategoryName("");
  };

  const openDeleteModal = (category: any) => {
    setCategoryToDelete(category);
    setShowDeleteModal(true);
  };

  const closeDeleteModal = () => {
    setCategoryToDelete(null);
    setShowDeleteModal(false);
  };

  const confirmDelete = () => {
    if (!categoryToDelete) return;
    setDeleteLoading(true);
    // Simulate API call by updating local state
    setTimeout(() => {
      setTableData((prev) => prev.filter((item) => item.id !== categoryToDelete.id));
      closeDeleteModal();
      setDeleteLoading(false);
    }, 1000); // Simulate network delay
  };

  // Filter data for the table
  const filteredTableData = tableData.filter(
    (item) =>
      typeof item.name === "string" &&
      item.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Calculate pagination values
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredTableData.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredTableData.length / itemsPerPage);

  const handlePageChange = (pageNumber: number) => {
    setCurrentPage(pageNumber);
  };

  return (
    <div className="min-h-screen bg-gray-50 p-0 sm:p-4 md:p-6 pb-20">
      <div className="mb-8 sm:mb-16">
        {/* Responsive card grid */}
        <div className="grid grid-cols-2 xs:grid-cols-2 sm:grid-cols-2 md:grid-cols-3 gap-2 sm:gap-3 mb-6 sm:mb-20">
          <DashboardData info="Total Item Types" digits={dashboardData.total_raw_materials} />
          <DashboardData info="Total Inventory Value" digits={dashboardData.total_value} currency="₦" />
          <DashboardData info="Yearly Items Added" digits={dashboardData.added_amount_this_year} currency="₦" />
          <DashboardData info="Yearly Items Used" digits={dashboardData.removed_amount_year} currency="₦" />
          <DashboardData info="Monthly Items Added" digits={dashboardData.added_amount_this_month} currency="₦" />
          <DashboardData info="Monthly Items Used" digits={dashboardData.removed_cost_month} currency="₦" />
        </div>

        {/* Responsive chart grid */}
        <div className="grid gap-4 md:gap-2 lg:grid-cols-2 items-center rounded-sm">
          <div className="w-full min-h-[160px] md:min-h-[300px] bg-white rounded-lg shadow p-2 overflow-x-auto">
            <AmountSoldMonthlyBarChart />
          </div>
          <div className="w-full min-h-[160px] md:min-h-[300px] bg-white rounded-lg shadow p-2 overflow-x-auto">
            <MonthlyAddedValueSpikedChart />
          </div>
        </div>
      </div>

      {/* Item Categories Table */}
      <div className="mb-4 sm:mb-6 md:mb-8">
        <h1 className="text-lg sm:text-2xl md:text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-blue-600 mb-3 sm:mb-4 mt-4 sm:mt-8">
          Item Categories Management
        </h1>
        <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 sm:justify-between sm:items-center">
          <div className="relative w-full sm:w-64">
            <input
              type="text"
              placeholder="Search category..."
              className="w-full pl-8 sm:pl-10 pr-3 sm:pr-4 py-2 rounded-lg border focus:outline-none focus:border-blue-400 text-sm sm:text-base"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <FontAwesomeIcon icon={faSearch} className="absolute left-2 sm:left-3 top-3 text-gray-400" />
          </div>
          <button
            onClick={() => navigate("/store-keeper/add-raw-material-category")}
            className="w-full sm:w-fit border border-blue-400 text-blue-400 bg-white px-3 sm:px-4 py-2 rounded-lg hover:bg-blue-400 hover:text-white transition text-sm sm:text-base"
          >
            + Add New Category
          </button>
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center items-center h-64">
          <ThreeDots visible={true} height="80" width="80" color="#60A5FA" radius="9" ariaLabel="three-dots-loading" />
        </div>
      ) : filteredTableData.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-6 bg-white rounded-lg border border-gray-200 shadow-sm mb-10">
          <div className="flex items-center justify-center w-16 h-16 rounded-full bg-green-50 mb-4">
            <svg className="w-8 h-8 text-green-400" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <rect x="3" y="7" width="18" height="13" rx="2" stroke="currentColor" strokeWidth="2" fill="none" />
              <path d="M16 3v4M8 3v4M3 7h18" stroke="currentColor" strokeWidth="2" />
            </svg>
          </div>
          <h2 className="text-lg font-semibold text-gray-800 mb-1">No item categories</h2>
          <p className="text-gray-500 mb-6 text-center max-w-xs">All your item categories will show up here. Add a new category to get started.</p>
        </div>
      ) : (
        <div className="bg-white shadow-md overflow-x-auto mb-20 sm:mb-28 max-md:mb-16">
          <table className="min-w-full">
            <thead>
              <tr className="bg-gradient-to-r from-blue-300 to-blue-400 text-white">
                <th className="py-2 sm:py-4 px-3 sm:px-6 text-left text-xs sm:text-sm font-semibold">Category</th>
                <th className="py-2 sm:py-4 px-3 sm:px-6 text-left text-xs sm:text-sm font-semibold">Count</th>
                <th className="py-2 sm:py-4 px-3 sm:px-6 text-left text-xs sm:text-sm font-semibold">Total Value</th>
                  <th className="py-2 sm:py-4 px-3 sm:px-6 text-left text-xs sm:text-sm font-semibold">Actions</th>
              </tr>
            </thead>
            <tbody>
              {currentItems.map((entry) => (
                <tr key={entry.id} className="border-b hover:bg-gray-100">
                  <td className="py-3 sm:py-4 px-3 sm:px-6 text-xs sm:text-sm text-gray-700">{entry.name}</td>
                  <td className="py-3 sm:py-4 px-3 sm:px-6 text-xs sm:text-sm text-gray-700">{entry.materials_count}</td>
                  <td className="py-3 sm:py-4 px-3 sm:px-6 text-xs sm:text-sm text-gray-700">
                    {typeof entry.total_materials_value === 'number' ? `₦${entry.total_materials_value.toLocaleString()}` : entry.total_materials_value}
                  </td>

                    <td className="px-2 sm:px-4 py-2 sm:py-3 text-xs sm:text-sm text-blue-600">
                      <button onClick={() => openEditModal(entry)} className="text-blue-500 hover:text-blue-700 mr-2 sm:mr-4">
                        <FontAwesomeIcon icon={faPencil} />
                      </button>
                      <button onClick={() => openDeleteModal(entry)} className="text-red-500 hover:text-red-700">
                        <FontAwesomeIcon icon={faTrash} />
                      </button>
                    </td>

                </tr>
              ))}
            </tbody>
          </table>
          <div className="flex flex-col sm:flex-row justify-between items-center px-3 sm:px-4 md:px-6 py-3 sm:py-4 border-t gap-3 sm:gap-4">
            <span className="text-xs sm:text-sm text-blue-400 text-center sm:text-left">
              Showing {indexOfFirstItem + 1} to {Math.min(indexOfLastItem, tableData.length)} of {tableData.length} entries
            </span>
            <div className="flex items-center gap-1 sm:gap-2">
              <button
                onClick={() => handlePageChange(1)}
                disabled={currentPage === 1}
                className="px-2 sm:px-3 py-1 rounded bg-blue-500 text-white disabled:bg-gray-300 hover:bg-blue-600 transition-colors text-xs sm:text-sm"
              >
                <FontAwesomeIcon icon={faAnglesLeft} />
              </button>
              <button
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 1}
                className="px-2 sm:px-3 py-1 rounded bg-blue-500 text-white disabled:bg-gray-300 hover:bg-blue-600 transition-colors text-xs sm:text-sm"
              >
                <FontAwesomeIcon icon={faArrowLeft} />
              </button>
              <span className="mx-2 sm:mx-4 text-xs sm:text-sm">Page {currentPage} of {totalPages}</span>
              <button
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
                className="px-2 sm:px-3 py-1 rounded bg-blue-500 text-white disabled:bg-gray-300 hover:bg-blue-600 transition-colors text-xs sm:text-sm"
              >
                <FontAwesomeIcon icon={faArrowRight} />
              </button>
              <button
                onClick={() => handlePageChange(totalPages)}
                disabled={currentPage === totalPages}
                className="px-2 sm:px-3 py-1 rounded bg-blue-500 text-white disabled:bg-gray-300 hover:bg-blue-600 transition-colors text-xs sm:text-sm"
              >
                <FontAwesomeIcon icon={faAnglesRight} />
              </button>
            </div>
          </div>
        </div>
      )}

      {showEditModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg p-4 sm:p-6 w-[90vw] sm:w-96 max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-base sm:text-lg font-medium">Edit Category</h3>
              <FontAwesomeIcon icon={faXmark} onClick={closeEditModal} className="cursor-pointer text-lg sm:text-xl" />
            </div>
            <div>
              <label htmlFor="categoryName" className="block text-sm font-medium text-gray-700 mb-2">
                Category Name
              </label>
              <input
                type="text"
                id="categoryName"
                value={editedCategoryName}
                onChange={(e) => setEditedCategoryName(e.target.value)}
                className="w-full pl-3 sm:pl-4 pr-3 sm:pr-4 py-2 rounded-lg border focus:outline-none focus:border-blue-400 text-sm sm:text-base"
              />
            </div>
            <div className="flex justify-end gap-3 sm:gap-4 mt-4 sm:mt-6">
              <button
                onClick={closeEditModal}
                disabled={editLoading}
                className="py-2 px-3 sm:px-4 bg-gray-300 text-black rounded hover:bg-gray-400 transition-colors disabled:opacity-50 disabled:cursor-not-allowed text-sm sm:text-base"
              >
                Cancel
              </button>
              <button
                onClick={handleUpdateCategory}
                disabled={editLoading}
                className={`py-2 px-3 sm:px-4 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors text-sm sm:text-base ${editLoading ? "opacity-50 cursor-not-allowed" : ""}`}
              >
                {editLoading ? "Saving..." : "Save Changes"}
              </button>
            </div>
          </div>
        </div>
      )}

      {showDeleteModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg p-4 sm:p-6 w-[90vw] sm:w-96 max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-base sm:text-lg font-medium">Confirm Deletion</h3>
              <FontAwesomeIcon icon={faXmark} onClick={closeDeleteModal} className="cursor-pointer text-lg sm:text-xl" />
            </div>
            <p className="text-sm sm:text-base">Are you sure you want to delete the category "{categoryToDelete?.name}"?</p>
            <div className="flex justify-end gap-3 sm:gap-4 mt-4 sm:mt-6">
              <button
                onClick={closeDeleteModal}
                disabled={deleteLoading}
                className="py-2 px-3 sm:px-4 bg-gray-300 text-black rounded hover:bg-gray-400 transition-colors disabled:opacity-50 disabled:cursor-not-allowed text-sm sm:text-base"
              >
                Cancel
              </button>
              <button
                onClick={confirmDelete}
                disabled={deleteLoading}
                className={`py-2 px-3 sm:px-4 bg-red-500 text-white rounded hover:bg-red-600 transition-colors text-sm sm:text-base ${deleteLoading ? "opacity-50 cursor-not-allowed" : ""}`}
              >
                {deleteLoading ? "Deleting..." : "Delete"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default StoreKeeperDashboard;