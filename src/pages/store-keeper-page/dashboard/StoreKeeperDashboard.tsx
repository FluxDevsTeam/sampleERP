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

interface TableProps {
  headers: string[];
}

interface TableData {
  Name: string;
  [key: string]: string | number;
}

const StoreKeeperDashboard: React.FC<TableProps> = ({ headers }) => {
  const navigate = useNavigate();
  const [tableData, setTableData] = useState<TableData[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [searchTerm, setSearchTerm] = useState<string>("");
  const itemsPerPage = 10;

  const fetchItems = async () => {
    try {
      setLoading(true);
      const response = await fetch(
        `https://kidsdesigncompany.pythonanywhere.com/api/raw-materials-category/`
      );

      if (!response.ok) {
        throw new Error("failed Iyegs");
      }

      const data = await response.json();
      console.log(data);

      const updatedTableData: TableData[] = data.map((item: any) => {
        return {
          Name: item.name,
        };
      });

      setTableData(updatedTableData);
    } catch (error) {
      console.error(error);
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

  const filteredItems = currentItems.filter((item) =>
    item.Name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gray-50 p-4 sm:p-6">
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
                {headers.map((header) => (
                  <th
                    key={header}
                    className="py-4 px-6 text-left text-sm font-semibold whitespace-nowrap"
                  >
                    {header}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filteredItems.map((row, index) => (
                <tr key={index} className="hover:bg-gray-50 transition-colors">
                  {headers.map((header) => (
                    <td
                      key={`${index}-${header}`}
                      className="py-4 px-6 border-b border-gray-200 text-sm text-gray-700 whitespace-nowrap"
                    >
                      {row[header]}
                    </td>
                  ))}
                </tr>
              ))}
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
    </div>
  );
};

export default StoreKeeperDashboard;
