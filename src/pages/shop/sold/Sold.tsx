import { useState, useEffect } from "react";
import SoldTable from "./Sold Components/SoldTable";
import soldDataJson from "@/data/shop/sold/sold.json"; // Import JSON
import InventoryData from "../inventory/Inventory Components/InventoryData";

export const Sold = () => {
  const [thisMonthNonProjectSales, setThisMonthNonProjectSales] = useState(0);
  const [thisMonthProfit, setThisMonthProfit] = useState(0);
  const [thisMonthProjectSales, setThisMonthProjectSales] = useState(0);
  const [thisMonthSales, setThisMonthSales] = useState(0);
  const [thisMonthSalesCount, setThisMonthSalesCount] = useState(0);
  const [thisYearSoldCount, setThisYearSoldCount] = useState(0);
  const [thisYearSales, setThisYearSales] = useState(0);

  useEffect(() => {
    // Simulate fetching stock info from JSON
    try {
      const data = soldDataJson; // Use JSON data
      setThisMonthNonProjectSales(data.this_month_non_project_sales || 0);
      setThisMonthProfit(data.this_month_profit || 0);
      setThisMonthProjectSales(data.this_month_project_sales || 0);
      setThisMonthSales(data.this_month_sales || 0);
      setThisMonthSalesCount(data.this_month_sales_count || 0);
      setThisYearSoldCount(data.this_year_sold_count || 0);
      setThisYearSales(data.this_year_sales || 0);
    } catch (error) {
      console.error("Error processing sold data:", error);
    }
  }, []);

  return (
    <div className="wrapper w-full mx-auto my-0 pl-1 mb-20 pt-2">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-2 max-sm:gap-1 mb-0 md:mb-6 md:mt-2">
        <InventoryData info="Yearly Sales Count" digits={thisYearSoldCount} />
        <InventoryData info="Monthly Sales Count" digits={thisMonthSalesCount} />
        <InventoryData info="Yearly Sales" digits={thisYearSales} currency="₦ " />
        <InventoryData info="Monthly Sales" digits={thisMonthSales} currency="₦ " />
      </div>
      <div>
        <SoldTable />
      </div>
    </div>
  );
};

export default Sold;