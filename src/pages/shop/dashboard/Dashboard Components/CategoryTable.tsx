import React, { useState, useEffect } from "react";
import { ThreeDots } from "react-loader-spinner";
import "rsuite/dist/rsuite.min.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faArrowLeft,
  faArrowRight,
  faAnglesLeft,
  faAnglesRight,
} from "@fortawesome/free-solid-svg-icons";

interface TableProps {
  headers: string[];
}

interface TableData {
  Category: string;
  "Total Cost Value": number;
  "Total Profit": number;
  "Total Stock Value": number;
  [key: string]: string | number;
}

// Format number with naira sign and commas
const formatNaira = (value: number | string): string => {
  if (typeof value === 'string' || value === null || value === undefined) {
    return value as string;
  }
  return `₦${value.toLocaleString()}`;
};

const CategoryTable: React.FC<TableProps> = ({ headers }) => {
  const [tableData, setTableData] = useState<TableData[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const itemsPerPage = 10;

  const fetchItems = async () => {
    try {
      setLoading(true);
      const response = await fetch(
        `https://backend.kidsdesigncompany.com/api/shopkeeper-dashboard/`,
        {
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

      const updatedTableData: TableData[] = data.shop_category_data.map(
        (item: any) => {
          return {
            Category: item.category,
            "Total Cost Value": item.total_cost_value || "-",
            "Total Profit": item.total_profit || "-",
            "Total Stock Value": item.total_stock_value || "-",
          };
        }
      );

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

  // Function to render cell content with proper formatting
  const renderCellContent = (header: string, value: string | number) => {
    if (header === "Category") {
      return value;
    }
    // Apply Naira formatting to monetary columns
    return formatNaira(value);
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
              wrapperStyle={{}}
              wrapperClass=""
            />
          </div>
        ) : (
          currentItems.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-6 bg-white rounded-lg border border-gray-200 shadow-sm mb-10">
              <div className="flex items-center justify-center w-16 h-16 rounded-full bg-blue-50 mb-4">
                {/* Folder SVG icon */}
                <svg className="w-8 h-8 text-blue-400" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                  <path d="M3 7a2 2 0 012-2h3.172a2 2 0 011.414.586l1.828 1.828A2 2 0 0012.828 8H19a2 2 0 012 2v7a2 2 0 01-2 2H5a2 2 0 01-2-2V7z" stroke="currentColor" strokeWidth="2" fill="none" />
                </svg>
              </div>
              <h2 className="text-lg font-semibold text-gray-800 mb-1">No categories found</h2>
              <p className="text-gray-500 mb-6 text-center max-w-xs">All your shop categories will show up here. Add a new category to get started.</p>
            </div>
          ) : (
            <div>
              <table className="min-w-full bg-white shadow-md rounded-lg overflow-hidden">
                <thead>
                  <tr className="bg-blue-400 text-white">
                    {headers.map((header) => (
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
                      {headers.map((header) => (
                        <td
                          key={`${index}-${header}`}
                          className="py-3 sm:py-5 px-2 sm:px-4 border-b border-gray-200 text-xs sm:text-sm text-gray-700"
                        >
                          {renderCellContent(header, row[header])}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>

              {/* Updated Pagination Controls */}
              <div className="flex justify-center items-center mt-4 gap-1 sm:gap-2">
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
            </div>
          )
        )}
      </div>
    </div>
  );
};

export default CategoryTable;
