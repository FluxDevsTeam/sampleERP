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
    <div className="w-full sm:w-11/12 mx-auto sm:mt-6 pl-1 pt-2 mb-20">
      <div className="mb-8 sm:mb-16">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-2 sm:gap-3 mb-2 md:mb-6">
          <DashboardData
            info="Total shop value"
            digits={dashboardData?.total_shop_value}
            currency="₦ "
          />
              <DashboardData
                info="Total Cost Value"
                digits={dashboardData?.total_cost_value}
                currency="₦ "
              />
            <DashboardData
              info="Total Profit Potential"
              digits={dashboardData?.total_profit_potential}
              currency="₦ "
            />
            <DashboardData
              info="Yearly added value"
              digits={dashboardData?.yearly_added_value}
              currency="₦ "
            />
          <DashboardData
            info="Monthly Added Value"
            digits={dashboardData?.total_added_this_month}
            currency="₦ "
          />
          <DashboardData
            info="Total Monthly Sales"
            digits={dashboardData?.total_sold_this_month}
            currency="₦ "
          />
          <DashboardData
            info="Monthly Profit"
            digits={dashboardData?.total_profit_this_month}
            currency="₦ "
          />
          <DashboardData
            info="Yearly profit"
            digits={dashboardData?.yearly_profit}
            currency="₦ "
          />
        </div>

        {/* Responsive chart grid */}
        <div className="grid gap-4 md:gap-2 lg:grid-cols-2 items-center rounded-sm">
          <div className="w-full min-h-[160px] md:min-h-[300px] bg-white rounded-lg shadow p-2 overflow-x-auto">
            <AmountSoldMonthlyBarChart />
          </div>
          <div className="w-full min-h-[160px] md:min-h-[300px] bg-white rounded-lg shadow p-2 overflow-x-auto">
            <MonthlyAddedValueSpikedChart />
          </div>
        </div>
        <div className="w-full min-h-[160px] md:min-h-[300px] bg-white rounded-lg shadow p-2 overflow-x-auto">
          <MonthlyProfitChart />
        </div>
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
