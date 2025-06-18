import React, { useState, useEffect } from "react";
import { ThreeDots } from "react-loader-spinner";
import "rsuite/dist/rsuite.min.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faArrowLeft,
  faArrowRight,
  faAnglesLeft,
  faAnglesRight,
  faSearch,
} from "@fortawesome/free-solid-svg-icons";
import { useNavigate } from "react-router-dom";
import DashboardData from "@/pages/shop/dashboard/Dashboard Components/DashboardData";
import MonthlyAddedValueSpikedChart from "./Dashboard Components/Monthly-Added-Value-Spiked-Chart";
import AmountSoldMonthlyBarChart from "./Dashboard Components/Amount-Sold-Monthly-Chart";

interface TableData {
  Name: string;
  [key: string]: string | number;
}

const StoreKeeperDashboard: React.FC = () => {
  const navigate = useNavigate();

  const [dashboardData, setDashboardData] = useState<any>(null);

  const [tableData, setTableData] = useState<TableData[]>([]);
  const [tableDataTwo, setTableDataTwo] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [searchTermTwo, setSearchTermTwo] = useState<string>("");
  const itemsPerPage = 10;
  const accessToken = localStorage.getItem("accessToken");

  const fetchDashboardData = async () => {
    try {
      const response = await fetch(
        `https://backend.kidsdesigncompany.com/api/storekeeper-dashboard/`,
        {
          method: "GET",
          headers: {
            Authorization: `JWT ${accessToken}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (!response.ok) {
        throw new Error("iyegs, there is an error here");
      }
      const logData = await response.json();
      // console.log(logData);

      setDashboardData(logData);
    } catch (error) {
      console.error("Error fetching dashboard:", error);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchRMCategories = async () => {
    try {
      setLoading(true);
      const response = await fetch(
        `https://backend.kidsdesigncompany.com/api/raw-materials-category/`,{
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `JWT ${localStorage.getItem("accessToken")}`,
          },
        }
      );

      if (!response.ok) {
        throw new Error("failed Iyegs");
      }

      const data = await response.json();
      console.log(data);
      setTableData(data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRMCategories();
  }, []);

  const fetchShopCategoryData = async () => {
    try {
      const response = await fetch(
        `https://backend.kidsdesigncompany.com/api/storekeeper-dashboard/`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `JWT ${localStorage.getItem("accessToken")}`,
          },
        }
      );

      if (!response.ok) {
        throw new Error("error iyegs, error");
      }
      const logData = await response.json();
      // console.log(logData);
      setTableDataTwo(logData.shop_category_data);
    } catch (error) {
      console.error("Error fetching shop category data:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchShopCategoryData();
  }, []);

  // Filter data for both tables
  const filteredTableData = tableData.filter(
    (item) =>
      typeof item.name === "string" &&
      item.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const filteredTableDataTwo = tableDataTwo.filter((item) =>
    item.category.toLowerCase().includes(searchTermTwo.toLowerCase())
  );

  // Calculate pagination values
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredTableData.slice(
    indexOfFirstItem,
    indexOfLastItem
  );
  const totalPages = Math.ceil(filteredTableData.length / itemsPerPage);

  const handlePageChange = (pageNumber: number) => {
    setCurrentPage(pageNumber);
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4 sm:p-6">
      <div className="mb-16">
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3 mb-20">
          <DashboardData
            info="Amount added this month"
            digits={dashboardData?.added_amount_this_month}
          ></DashboardData>
          <DashboardData
            info="Amount added this year"
            digits={dashboardData?.added_amount_this_year}
          ></DashboardData>
          <DashboardData
            info="Removed amount year"
            digits={dashboardData?.removed_amount_year}
          ></DashboardData>
          <DashboardData
            info="Removed cost month"
            digits={dashboardData?.removed_cost_month}
          ></DashboardData>
          <DashboardData
            info="Total Raw materials"
            digits={dashboardData?.total_raw_materials}
          ></DashboardData>
          <DashboardData
            info="Total value"
            digits={dashboardData?.total_value}
          ></DashboardData>
        </div>

        <div className="grid gap-8 md:grid-cols-2 items-center rounded-sm mb-[100px] max-md:mb-[40px]">
          <AmountSoldMonthlyBarChart></AmountSoldMonthlyBarChart>
          <MonthlyAddedValueSpikedChart></MonthlyAddedValueSpikedChart>
        </div>
      </div>

      <div className="mb-6 sm:mb-8">
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-500 mb-4 mt-4 sm:mt-8">
          Shop Category Data
        </h1>
        <div className="flex flex-col sm:flex-row gap-4 sm:justify-between sm:items-center">
          <div className="relative w-full sm:w-64">
            <input
              type="text"
              placeholder="Search category..."
              className="w-full pl-10 pr-4 py-2 rounded-lg border focus:outline-none focus:border-blue-400"
              value={searchTermTwo}
              onChange={(e) => setSearchTermTwo(e.target.value)}
            />
            <FontAwesomeIcon
              icon={faSearch}
              className="absolute left-3 top-3 text-gray-400"
            />
          </div>
        </div>
      </div>

      {/* TABLE 1 */}
      {loading ? (
        <div className="flex justify-center items-center h-64">
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
        <div className="bg-white rounded-lg shadow-md overflow-x-auto mb-28 max-md:mb-16">
          <table className="min-w-full">
            <thead>
              <tr className="bg-gradient-to-r from-blue-400 to-blue-500 text-white">
                <th className="py-4 px-6 text-left text-sm font-semibold">
                  Category
                </th>
                <th className="py-4 px-6 text-left text-sm font-semibold">
                  Count
                </th>
                <th className="py-4 px-6 text-left text-sm font-semibold">
                  Total Value
                </th>
              </tr>
            </thead>
            <tbody>
              {filteredTableDataTwo.map((entry, index) => {
                return (
                  <tr key={index} className="border-b hover:bg-gray-100">
                    <td className="py-4 px-6 text-sm text-gray-700">
                      {entry.category}
                    </td>
                    <td className="py-4 px-6 text-sm text-gray-700">
                      {entry.materials_count}
                    </td>
                    <td className="py-4 px-6 text-sm text-gray-700">
                      {entry.total_materials_value}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
          <div className="flex flex-col sm:flex-row justify-between items-center px-4 sm:px-6 py-4 border-t gap-4">
            <span className="text-sm text-blue-400 text-center sm:text-left">
              Showing {indexOfFirstItem + 1} to{" "}
              {Math.min(indexOfLastItem, tableData.length)} of{" "}
              {tableData.length} entries
            </span>

            <div className="flex items-center gap-2">
              <button
                onClick={() => handlePageChange(1)}
                disabled={currentPage === 1}
                className="px-2 sm:px-3 py-1 rounded bg-blue-500 text-white disabled:bg-gray-300 hover:bg-blue-600 transition-colors text-sm"
              >
                <FontAwesomeIcon icon={faAnglesLeft} />
              </button>
              <button
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 1}
                className="px-2 sm:px-3 py-1 rounded bg-blue-500 text-white disabled:bg-gray-300 hover:bg-blue-600 transition-colors text-sm"
              >
                <FontAwesomeIcon icon={faArrowLeft} />
              </button>

              <span className="mx-4">
                Page {currentPage} of {totalPages}
              </span>

              <button
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
                className="px-2 sm:px-3 py-1 rounded bg-blue-500 text-white disabled:bg-gray-300 hover:bg-blue-600 transition-colors text-sm"
              >
                <FontAwesomeIcon icon={faArrowRight} />
              </button>
              <button
                onClick={() => handlePageChange(totalPages)}
                disabled={currentPage === totalPages}
                className="px-2 sm:px-3 py-1 rounded bg-blue-500 text-white disabled:bg-gray-300 hover:bg-blue-600 transition-colors text-sm"
              >
                <FontAwesomeIcon icon={faAnglesRight} />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* TABLE 2 */}
      {/* Header Section */}
      <div className="mb-6 sm:mb-8">
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-500 mb-4 mt-4 sm:mt-8">
          Raw Materials Categories Management
        </h1>
        <div className="flex flex-col sm:flex-row gap-4 sm:justify-between sm:items-center">
          <div className="relative w-full sm:w-64">
            <input
              type="text"
              placeholder="Search category..."
              className="w-full pl-10 pr-4 py-2 rounded-lg border focus:outline-none focus:border-blue-400"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <FontAwesomeIcon
              icon={faSearch}
              className="absolute left-3 top-3 text-gray-400"
            />
          </div>
          <button
            onClick={() => navigate("/store-keeper/add-raw-material-category")}
            className="w-fit sm:w-auto bg-blue-400 text-white px-4 py-2 rounded-lg hover:bg-blue-600"
          >
            Add New Category
          </button>
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center items-center h-64">
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
        <div className="bg-white rounded-lg shadow-md overflow-x-auto">
          <table className="min-w-full">
            <thead>
              <tr className="bg-gradient-to-r from-blue-400 to-blue-500 text-white">
                <th className="py-4 px-6 text-left text-sm font-semibold">
                  Name
                </th>
              </tr>
            </thead>
            <tbody>
              {currentItems.map((useful) => {
                return (
                  <tr key={useful.id}>
                    <td className="py-4 px-6 text-sm font-medium text-gray-700 border-b">
                      {useful.name}
                    </td>
                  </tr>
                );
              })}
            </tbody>

          </table>
            {/* pagination stuff */}
            <div className="flex flex-col sm:flex-row justify-between items-center px-4 sm:px-6 py-4 border-t gap-4">
              <span className="text-sm text-blue-400 text-center sm:text-left">
                Showing {indexOfFirstItem + 1} to{" "}
                {Math.min(indexOfLastItem, tableData.length)} of{" "}
                {tableData.length} entries
              </span>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => handlePageChange(1)}
                  disabled={currentPage === 1}
                  className="px-2 sm:px-3 py-1 rounded bg-blue-500 text-white disabled:bg-gray-300 hover:bg-blue-600 transition-colors text-sm"
                >
                  <FontAwesomeIcon icon={faAnglesLeft} />
                </button>
                <button
                  onClick={() => handlePageChange(currentPage - 1)}
                  disabled={currentPage === 1}
                  className="px-2 sm:px-3 py-1 rounded bg-blue-500 text-white disabled:bg-gray-300 hover:bg-blue-600 transition-colors text-sm"
                >
                  <FontAwesomeIcon icon={faArrowLeft} />
                </button>

                <span className="mx-4">
                  Page {currentPage} of {totalPages}
                </span>

                <button
                  onClick={() => handlePageChange(currentPage + 1)}
                  disabled={currentPage === totalPages}
                  className="px-2 sm:px-3 py-1 rounded bg-blue-500 text-white disabled:bg-gray-300 hover:bg-blue-600 transition-colors text-sm"
                >
                  <FontAwesomeIcon icon={faArrowRight} />
                </button>
                <button
                  onClick={() => handlePageChange(totalPages)}
                  disabled={currentPage === totalPages}
                  className="px-2 sm:px-3 py-1 rounded bg-blue-500 text-white disabled:bg-gray-300 hover:bg-blue-600 transition-colors text-sm"
                >
                  <FontAwesomeIcon icon={faAnglesRight} />
                </button>
              </div>
            </div>
        </div>
      )}
    </div>
  );
};

export default StoreKeeperDashboard;
