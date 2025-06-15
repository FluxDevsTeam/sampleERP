import InventoryData from "./shop-components/Inventory Item Components/InventoryData";
import {useState, useEffect} from "react";
import StockTable from "./shop-components/Stock Components/StockTable";

const Stock = () => {
  const [yearlyAddedStockCount, setyearlyAddedStockCount] = useState(0);
  const [yearlyAddedTotalCostPrice, setyearlyAddedTotalCostPrice] = useState(0);
  const [monthlyAddedStockCount, setmonthlyAddedStockCount] = useState(0);
  const [monthlyAddedTotalCostPrice, setmonthlyAddedTotalCostPrice] = useState(0);
  const [dailyAddedCostTotal, setdailyAddedCostTotal] = useState(0);

    useEffect(() => {
        async function fetchStockInfo() {
          // INVENTORY ITEM
          try {
            const response = await fetch(
              "https://backend.kidsdesigncompany.com/api/add-stock/",
              {
                method: "GET",
                headers: {
                  "Content-Type": "application/json",
                  Authorization: `JWT ${localStorage.getItem("accessToken")}`,
                },
              }
            );

            if (!response.ok) {
              throw new Error("iyegs failed");
            }
    
            const logData = await response.json();
            console.log(logData);
    
            setyearlyAddedStockCount(logData.yearly_added_stock_count);
            setyearlyAddedTotalCostPrice(logData.yearly_added_total_cost_price);
            setmonthlyAddedStockCount(logData.monthly_added_stock_count);
            setmonthlyAddedTotalCostPrice(logData.monthly_added_total_cost_price);
            setdailyAddedCostTotal(logData.daily_added_cost_total);
  
          } catch (error) {
            console.error("Error fetching items:", error);
          }
        }
    
        fetchStockInfo();
      }, []);


  return (
    <div className="wrapper w-11/12 mx-auto my-0 pl-1 pt-2">
      <h1
        style={{ fontSize: "clamp(16.5px, 3vw, 30px)" }}
        className="font-semibold py-5 mt-2"
      >
        Sold Summary
      </h1>
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-11">
        <InventoryData
          info="Yearly Added Stock"
          digits={yearlyAddedStockCount}
          trend="up"
        ></InventoryData>
        <InventoryData
          info="Yearly Added Total Cost Price"
          digits={yearlyAddedTotalCostPrice}
          trend="up"
        ></InventoryData>
        <InventoryData
          info="Monthly Added Stock"
          digits={monthlyAddedStockCount}
          trend="up"
        ></InventoryData>
        <InventoryData
          info="Monthly Added Total Cost Price"
          digits={monthlyAddedTotalCostPrice}
          trend="up"
        ></InventoryData>
        <InventoryData
          info="Daily Added Cost Total"
          digits={dailyAddedCostTotal}
          trend="up"
        ></InventoryData>
      </div>

      <div>
        <h1
          style={{ fontSize: "clamp(16.5px, 3vw, 30px)" }}
          className="font-semibold py-5 mt-2"
        >
          Stocks Added
        </h1>
        <StockTable />
      </div>
    </div>
  );
};
export default Stock;
