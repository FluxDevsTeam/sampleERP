import DashboardData from "./shop-components/Dashboard Components/DashboardData";
import AmountSoldMonthlyBarChart from "./shop-components/Dashboard Components/Amount-Sold-Monthly-Chart";
import MonthlyAddedValueSpikedChart from "./shop-components/Dashboard Components/Monthly-Added-Value-Spiked-Chart";
import MonthlyProfitChart from "./shop-components/Dashboard Components/Monthly-Profit-Chart";
// import Table from "./shop-components/Inventory Item Components/InventoryTable";
import CategoryTable from "./shop-components/Dashboard Components/CategoryTable";
import { useEffect, useState } from "react";

const Dashboard = () => {
  document.title = "Dashboard - KDC Admin";

  const categoryTableHeaders = [
    "Category",
    "Total Cost Value",
    "Total Profit",
    "Total Stock Value",
  ];

  const [totalCostValue, setTotalCostValue] = useState(0);
  const [monthlyStock, setMonthlyStock] = useState(0);
  const [totalProfitPotential, setTotalProfitPotential] = useState(0);
  const [profitThisMonth, setProfitThisMonth] = useState(0);
  const [totalShopValue, setTotalShopValue] = useState(0);
  const [totalSoldThisMonth, setTotalSoldThisMonth] = useState(0);
  const [yearlyAddedValue, setYearlyAddedValue] = useState(0);
  const [yearlyProfit, setYearlyProfit] = useState(0);

  useEffect(() => {
    async function fetchStockInfo() {
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

        setMonthlyStock(logData.total_added_this_month);
        setTotalCostValue(logData.total_cost_value);
        setTotalProfitPotential(logData.total_profit_potential);
        setProfitThisMonth(logData.total_profit_this_month);
        setTotalShopValue(logData.total_shop_value);
        setTotalSoldThisMonth(logData.total_sold_this_month);
        setYearlyAddedValue(logData.yearly_added_value);
        setYearlyProfit(logData.yearly_profit);
      } catch (error) {
        console.error("Error fetching dashboard:", error);
      }
    }

    fetchStockInfo();
  }, []);

  return (
    <div className="w-11/12 mx-auto mt-6 pl-1 pt-2">
      <div className="mb-16">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-20">
          <DashboardData
            info="Monthly Stock Added"
            digits={monthlyStock}
          ></DashboardData>
          <DashboardData
            info="Total Cost Value"
            digits={totalCostValue}
          ></DashboardData>
          <DashboardData
            info="Total Profit Potential"
            digits={totalProfitPotential}
          ></DashboardData>
          <DashboardData
            info="Total Profit this month"
            digits={profitThisMonth}
          ></DashboardData>
          <DashboardData
            info="Total shop value"
            digits={totalShopValue}
          ></DashboardData>
          <DashboardData
            info="Total sold this month"
            digits={totalSoldThisMonth}
          ></DashboardData>
          <DashboardData
            info="Yearly added value"
            digits={yearlyAddedValue}
          ></DashboardData>
          <DashboardData
            info="Yearly profit"
            digits={yearlyProfit}
          ></DashboardData>
        </div>

        <div className="grid gap-10 md:grid-cols-2 items-center rounded-sm mb-9">
          <AmountSoldMonthlyBarChart></AmountSoldMonthlyBarChart>
          <MonthlyAddedValueSpikedChart></MonthlyAddedValueSpikedChart>
        </div>


        <MonthlyProfitChart></MonthlyProfitChart>
      </div>

      <h1
        style={{ fontSize: "clamp(16.5px, 3vw, 27px)" }}
        className="font-semibold mb-5"
      >
        Categories
      </h1>
      <CategoryTable headers={categoryTableHeaders} />
    </div>
  );
};

export default Dashboard;
