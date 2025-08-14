import InventoryData from "../inventory/Inventory Components/InventoryData";
import SoldTable from "./Sold Components/SoldTable";

import {useState, useEffect} from "react";

export const Sold = () => {

  const [thisMonthNonProjectSales, setThisMonthNonProjectSales] = useState(0);
  const [thisMonthProfit, setThisMonthProfit] = useState(0);
  const [thisMonthProjectSales, setThisMonthProjectSales] = useState(0);
  const [thisMonthSales, setThisMonthSales] = useState(0);
  const [thisMonthSalesCount, setThisMonthSalesCount] = useState(0);
  const [thisYearSoldCount, setThisYearSoldCount] = useState(0);
  const [thisYearSales, setThisYearSales] = useState(0);


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
          setThisYearSoldCount(logData.this_year_sold_count);
          setThisYearSales(logData.this_year_sales);

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
    <div className="wrapper w-full mx-auto my-0 pl-1 mb-20 pt-2">
      <div className="grid grid-cols-2 md:grid-cols-4  gap-2 max-sm:gap-1 mb-0 md:mb-6 md:mt-2">
        <InventoryData info="Yearly Sales Count" digits={thisYearSoldCount}></InventoryData>
        <InventoryData info="Monthly Sales Count" digits={thisMonthSalesCount}></InventoryData>
        <InventoryData info="Yearly Sales" digits={thisYearSales} currency="₦ "></InventoryData>
        <InventoryData info="Monthly Sales" digits={thisMonthSales} currency="₦ "></InventoryData>
      </div>
      <div>
        <SoldTable />
      </div>
    </div>
  );
};

export default Sold;

