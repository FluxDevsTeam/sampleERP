import InventoryData from "./Inventory Components/InventoryData";
import Table from "./Inventory Components/InventoryTable";
import { useEffect, useState } from "react";
// import { useNavigate } from "react-router-dom";

export const Inventory = () => {
  document.title = "Inventory - KDC Admin";
  const tableHeaders = ["Product", "Category", "Stock Status", "Details"];
  const [totalCostValue, setTotalCostValue] = useState(0);
  const [totalProfit, setTotalProfit] = useState(0);
  const [totalStockCount, setTotalStockCount] = useState(0);
  const [totalStockValue, setTotalStockValue] = useState(0);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchInput, setSearchInput] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [archived, setArchived] = useState(false);
  const [emptyStock, setEmptyStock] = useState(false);
  const [lowStock, setLowStock] = useState(false);
  const [isFilterOpen, setIsFilterOpen] = useState(false);

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

  // const navigate = useNavigate();

  useEffect(() => {
    async function fetchStockInfo() {
      // INVENTORY ITEM
      try {
        const response = await fetch(
          "https://backend.kidsdesigncompany.com/api/inventory-item/", {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              Authorization: `JWT ${localStorage.getItem("accessToken")}`,
            }
          }
        );

        if (!response.ok) {
          throw new Error("Authentication failed");
        }

        const logData = await response.json();
        console.log(logData);

        setTotalCostValue(logData.results.total_cost_value);
        setTotalProfit(logData.results.total_profit);
        setTotalStockCount(logData.results.total_stock_count);
        setTotalStockValue(logData.results.total_stock_value);
      } catch (error) {
        console.error("Error fetching items:", error);
      }

      // INVENTORY DASHBOARD
      try {
        const response = await fetch(
          "https://backend.kidsdesigncompany.com/api/shopkeeper-dashboard/", {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              Authorization: `JWT ${localStorage.getItem("accessToken")}`,
            }
          }
        );

        if (!response.ok) {
          throw new Error("Authentication failed");
        }

        const logData = await response.json();
        console.log(logData);
      } catch (error) {
        console.error("Error fetching dashboard:", error);
      }
    }

    fetchStockInfo();
  }, []);

  return (
    <>
      <div className="wrapper w-11/12 mx-auto my-2 pl-1 pt-4">
        {/* <h1
          style={{ fontSize: "clamp(16.5px, 3vw, 30px)" }}
          className={`font-semibold py-5 mt-2 ${isModalOpen ? "blur-md" : ""}`}
        >
          Stock Summary
        </h1> */}
        <div
          className={`grid grid-cols-2 lg:grid-cols-4 gap-4 mb-11 ${
            isModalOpen ? "blur-md" : ""
          }`}
        >
          <InventoryData
            info="Total Stock Count"
            digits={totalStockCount}
          ></InventoryData>
          <InventoryData
            info="Total Cost Value"
            digits={totalCostValue}
            currency="₦ "
          ></InventoryData>
          <InventoryData
            info="Total Profit"
            digits={totalProfit}
            currency="₦ "
          ></InventoryData>
          <InventoryData
            info="Total Stock Value"
            digits={totalStockValue}
            currency="₦ "
          ></InventoryData>
        </div>

        <div className="flex justify-between items-center my-6">
          {/* Search Bar */}
          <div className="flex items-center gap-x-2 w-1/2">
            <input
              type="text"
              placeholder="Search for items by name..."
              className="border p-2 rounded w-full"
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") handleSearch();
              }}
            />
            <button
              onClick={handleSearch}
              className="bg-blue-400 text-white px-4 py-2 rounded hover:bg-blue-500"
            >
              Search
            </button>
            <button
              onClick={handleClear}
              className="bg-gray-300 text-black px-4 py-2 rounded hover:bg-gray-400"
            >
              Clear
            </button>
          </div>

          {/* Filter Dropdown */}
          <div className="relative">
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

        <div>
          <h1
            style={{ fontSize: "clamp(16.5px, 3vw, 30px)" }}
            className={`font-semibold py-5 mt-2 ${
              isModalOpen ? "blur-md" : ""
            }`}
          >
            Inventory Items
          </h1>
          <Table
            headers={tableHeaders}
            onModalChange={setIsModalOpen}
            searchQuery={searchQuery}
            archived={archived}
            emptyStock={emptyStock}
            lowStock={lowStock}
          />
        </div>
      </div>
    </>
  );
};

export default Inventory;
