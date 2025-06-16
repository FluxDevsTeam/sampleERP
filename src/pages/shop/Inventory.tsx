import InventoryData from "./shop-components/Inventory Item Components/InventoryData";
import Table from "./shop-components/Inventory Item Components/InventoryTable";
import { useEffect, useState } from "react";
// import { useNavigate } from "react-router-dom";

export const Inventory = () => {

  document.title = "Inventory - KDC Admin"
  const tableHeaders = ["Product", "Category", "Stock Status", "Details"];
  const [totalCostValue, setTotalCostValue] = useState(0);
  const [totalProfit, setTotalProfit] = useState(0);
  const [totalStockCount, setTotalStockCount] = useState(0);
  const [totalStockValue, setTotalStockValue] = useState(0);

  // const navigate = useNavigate();

  useEffect(() => {
    async function fetchStockInfo() {
      // INVENTORY ITEM
      try {
        const response = await fetch(
          "https://backend.kidsdesigncompany.com/api/inventory-item/",
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              Authorization: `JWT ${localStorage.getItem("accessToken")}`,
            },
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
          "https://backend.kidsdesigncompany.com/api/shopkeeper-dashboard/",
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              Authorization: `JWT ${localStorage.getItem("accessToken")}`,
            },
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
      <div className="wrapper w-11/12 mx-auto my-0 pl-1 pt-2">
        <h1
          style={{ fontSize: "clamp(16.5px, 3vw, 30px)" }}
          className="font-semibold py-5 mt-2"
        >
          Inventory Summary
        </h1>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-11">
          <InventoryData
            info="Total Stock Count"
            digits={totalStockCount}
            trend="up"
          ></InventoryData>
          <InventoryData
            info="Total Cost Value"
            digits={totalCostValue}
            trend="up"
          ></InventoryData>
          <InventoryData
            info="Total Profit"
            digits={totalProfit}
            trend="up"
          ></InventoryData>
          <InventoryData
            info="Total Stock Value"
            digits={totalStockValue}
            trend="up"
          ></InventoryData>
        </div>

        <div>
          <h1
            style={{ fontSize: "clamp(16.5px, 3vw, 30px)" }}
            className="font-semibold py-5 mt-2"
          >
            Inventory Items
          </h1>
          <Table headers={tableHeaders} />
        </div>
      </div>
    </>
  );
};

export default Inventory;
