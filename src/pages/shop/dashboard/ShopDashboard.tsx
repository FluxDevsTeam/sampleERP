import DashboardData from "./Dashboard Components/DashboardData";
import AmountSoldMonthlyBarChart from "./Dashboard Components/Amount-Sold-Monthly-Chart";
import MonthlyAddedValueSpikedChart from "./Dashboard Components/Monthly-Added-Value-Spiked-Chart";
import MonthlyProfitChart from "./Dashboard Components/Monthly-Profit-Chart";
import CategoryTable from "./Dashboard Components/CategoryTable";
import { useEffect, useState } from "react";

const ShopDashboard = () => {
  document.title = "Dashboard - KDC Admin";

  const categoryTableHeaders = [
    "Category",
    "Total Cost Value",
    "Total Stock Value",
    "Total Profit",
  ];

    const [dashboardData, setDashboardData] = useState<any>(null);
  

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

        setDashboardData(logData);
      } catch (error) {
        console.error("Error fetching dashboard:", error);
      }
    }

    fetchStockInfo();
  }, []);

  return (
    <div className="w-full sm:w-11/12 mx-auto mt-3 sm:mt-6 pl-1 pt-2">
      <div className="mb-8 sm:mb-16">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-2 sm:gap-3 mb-12 sm:mb-20">
          <DashboardData
            info="Monthly Stock Added"
            digits={dashboardData?.total_added_this_month}
            currency="₦ "
          ></DashboardData>
          <DashboardData
            info="Total Cost Value"
            digits={dashboardData?.total_cost_value}
            currency="₦ "
          ></DashboardData>
          <DashboardData
            info="Total Profit Potential"
            digits={dashboardData?.total_profit_potential}
            currency="₦ "
          ></DashboardData>
          <DashboardData
            info="Total Profit this month"
            digits={dashboardData?.total_profit_this_month}
            currency="₦ "
          ></DashboardData>
          <DashboardData
            info="Total shop value"
            digits={dashboardData?.total_shop_value}
            currency="₦ "
          ></DashboardData>
          <DashboardData
            info="Total sold this month"
            digits={dashboardData?.total_sold_this_month}
            currency="₦ "
          ></DashboardData>
          <DashboardData
            info="Yearly added value"
            digits={dashboardData?.yearly_added_value}
            currency="₦ "
          ></DashboardData>
          <DashboardData
            info="Yearly profit"
            digits={dashboardData?.yearly_profit}
            currency="₦ "
          ></DashboardData>
        </div>

        <div className="grid gap-6 sm:gap-10 md:grid-cols-2 items-center rounded-sm mb-6 sm:mb-9">
          <AmountSoldMonthlyBarChart></AmountSoldMonthlyBarChart>
          <MonthlyAddedValueSpikedChart></MonthlyAddedValueSpikedChart>
        </div>


        <MonthlyProfitChart></MonthlyProfitChart>
      </div>

      <h1
        style={{ fontSize: "clamp(16.5px, 3vw, 27px)" }}
        className="font-semibold mb-3 sm:mb-5"
      >
        Categories
      </h1>
      <CategoryTable headers={categoryTableHeaders} />
    </div>
  );
};

export default ShopDashboard;
