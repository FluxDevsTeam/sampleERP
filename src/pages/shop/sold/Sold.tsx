import InventoryData from "../inventory/Inventory Components/InventoryData";
import SoldTable from "./Sold Components/SoldTable";

import {useState, useEffect} from "react";

export const Sold = () => {

  const [thisMonthNonProjectSales, setThisMonthNonProjectSales] = useState(0);
  const [thisMonthProfit, setThisMonthProfit] = useState(0);
  const [thisMonthProjectSales, setThisMonthProjectSales] = useState(0);
  const [thisMonthSales, setThisMonthSales] = useState(0);
  const [thisMonthSalesCount, setThisMonthSalesCount] = useState(0);


  useEffect(() => {
      async function fetchStockInfo() {
        // INVENTORY ITEM
        try {
          const response = await fetch(
            "https://backend.kidsdesigncompany.com/api/sold/", {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              Authorization: `JWT ${localStorage.getItem("accessToken")}`,
            }
          }
          );

          if (!response.ok) {
            throw new Error("iyegs failed");
          }
  
          const logData = await response.json();
          console.log(logData);
  
          setThisMonthNonProjectSales(logData.this_month_non_project_sales);
          setThisMonthProfit(logData.this_month_profit);
          setThisMonthProjectSales(logData.this_month_project_sales);
          setThisMonthSales(logData.this_month_sales);
          setThisMonthSalesCount(logData.this_month_sales_count);

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
    <div className="wrapper w-11/12 mx-auto my-0 pl-1 pt-2">
      {/* <h1
        style={{ fontSize: "clamp(16.5px, 3vw, 30px)" }}
        className="font-semibold py-5 md:py-0 mt-2"
      >
        Sold Summary
      </h1> */}
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-4 mb-2  mt-4">
      <InventoryData info="Count of this month sales" digits={thisMonthSalesCount}></InventoryData>
        <InventoryData info="Non project sales this month" digits={thisMonthNonProjectSales} currency="₦ "></InventoryData>
        <InventoryData info="Project sales for this month" digits={thisMonthProjectSales} currency="₦ "></InventoryData>
        <InventoryData info="This month sales" digits={thisMonthSales} currency="₦ "></InventoryData>
        <InventoryData info="This month profit" digits={thisMonthProfit} currency="₦ "></InventoryData>
      </div>

      <div>
        <h1
          style={{ fontSize: "clamp(16.5px, 3vw, 30px)" }}
          className="font-semibold py-5 mt-2"
        >
          Sold Items
        </h1>
        <SoldTable />
      </div>
    </div>
  );
};

export default Sold;

