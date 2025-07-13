import InventoryData from "../inventory/Inventory Components/InventoryData";
import {useState, useEffect} from "react";
import StockTable from "./Stock Components/StockTable";

const Stock = () => {
  const [stockData, setStockData] = useState<any>([]);

    useEffect(() => {
        async function fetchStockInfo() {
          // INVENTORY ITEM
          try {
            const response = await fetch(
              "https://backend.kidsdesigncompany.com/api/add-stock/",{
              method: "GET",
              headers: {
                "Content-Type": "application/json",
                Authorization: `JWT ${localStorage.getItem("accessToken")}`,
              },
          });
    
            if (!response.ok) {
              throw new Error("iyegs failed");
            }
    
            const logData = await response.json();
            console.log(logData);

            setStockData(logData);
  
          } catch (error) {
            console.error("Error fetching items:", error);
          }
        }
    
        fetchStockInfo();
      }, []);


  return (
    <div className="wrapper w-11/12 mx-auto my-0 pl-1 mb-20 pt-2">
      {/* <h4>Stock Dashboard</h4> */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-2 max-sm:gap-1 mb-0 md:mb-6 mt-2">
        <InventoryData info="Monthly Stock Additions" digits={stockData.monthly_added_stock_count} />
        <InventoryData info="Yearly Stock Additions" digits={stockData.yearly_added_stock_count} />
        <InventoryData info="Monthly Stock Value Added" digits={stockData.monthly_added_total_cost_price} currency="₦" />
        <InventoryData info="Yearly Stock Value Added" digits={stockData.yearly_added_total_cost_price} currency="₦" />
      </div>
      <div>
        <StockTable />
      </div>
    </div>
  );
};
export default Stock;
