import DashboardData from "./shop-components/DashboardData";
import DashboardTable from "./shop-components/DashboardTable";
import { useEffect, useState } from "react";

export const Dashboard = () => {
  const tableHeaders = ["Product", "Category", "Stock Status", "Details"];
  const [totalStock, setTotalStock] = useState(Math.floor(Math.random() * 100));
  const [totalShopValue, setTotalShopValue] = useState(Math.floor(Math.random() * 100));
  const [monthlyStock, setMonthlyStock] = useState(
    Math.floor(Math.random() * 100)
  );
  const [weeklyStock, setWeeklyStock] = useState(Math.floor(Math.random() * 100));

  useEffect(() => {
    async function fetchStockInfo() {
      // INVENTORY ITEM
      try {
        const response = await fetch(
          "https://kidsdesigncompany.pythonanywhere.com/api/inventory-item/"
        );

        const logData = await response.json();

        let logTotalStock = logData.count;
        setTotalStock(logTotalStock);

        if (!response.ok) {
          throw new Error("Iyegs man, Rest Bro");
        }
      } catch (error) {
        console.error("Error fetching categories:", error);
      }

      // INVENTORY DASHBOARD
      try {
        const response = await fetch(
          "https://kidsdesigncompany.pythonanywhere.com/api/inventory-dashboard/"
        );

        const logData = await response.json();
        console.log(logData);

        const logMonthlySales = logData.total_sold_this_month;
        setMonthlyStock(logMonthlySales);
        
      } catch (error) {}
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
        <DashboardData
        info="Total Stock"
        digits={totalStock}
        trend="up"
        ></DashboardData>
        <DashboardData
        info="Total Shop Value"
        digits={totalShopValue}
        trend="down"
        ></DashboardData>
        <DashboardData
        info="Monthly Stock Added"
        digits={monthlyStock}
        trend="up"
        ></DashboardData>
        <DashboardData
        info="Weekly Stock"
        digits={weeklyStock}
        trend="up"
        ></DashboardData>
      </div>

      <div>
        <h1
        style={{ fontSize: "clamp(16.5px, 3vw, 30px)" }}
        className="font-semibold py-5 mt-2"
        >
        Low Stock Alerts
        </h1>

        <DashboardTable headers={tableHeaders} />
      </div>
      </div>
    </>
  );
};

export default Dashboard;
