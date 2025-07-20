/* eslint-disable @typescript-eslint/no-explicit-any */
import { factoryData } from "./api";
import { useState, useEffect } from "react";
import PieChartComponent from "./PieChart";
import BarChartComponent from "./Barchart";
import DashboardCard from "./DashboardCard";

const FactoryManagerDashboard = () => {
  const [financialHealth, setFinancialHealth] = useState<Record<string, number>>({});
  const [yearlyData, setYearlyData] = useState<Record<string, number>>({});
  const [customerData, setCustomerData] = useState<Record<string, number>>({});
  const [workerData, setWorkerData] = useState<Record<string, number>>({});
  const [paidData, setPaidData] = useState<Record<string, number>>({});
  const [expenseBreakdown, setExpenseBreakdown] = useState<{ name: string; value: number }[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showAllCards, setShowAllCards] = useState(false);

  // Number of columns in the grid (should match lg:grid-cols-6)
  const numCols = 6;
  const numRowsDefault = 2;
  const defaultVisibleCount = numCols * numRowsDefault;

  // Helper to determine if a key is monetary
  const isMonetary = (key: string) => {
    const excluded = [
      'active_assets',
      'deprecated_assets',
      'sales_count',
    ];
    if (excluded.includes(key.toLowerCase())) return false;
    return /amount|income|profit|paid|value|expenses|cost|sales|pay|assets|shop/i.test(key);
  };

  useEffect(() => {
    const fetchFactory = async () => {
      try {
        setLoading(true);
        const data = await factoryData();

        console.log("Fetched data:", data);

        if (data?.financial_health) {
          setFinancialHealth({
            Active_Assets: data.financial_health.active_assets || 0,
            Deprecated_Assets: data.financial_health.deprecated_assets || 0,
            Sales_Count: data.financial_health.sales_count_this_month || 0,
            Project_Sales: data.financial_health.total_project_sales_this_month || 0,
            Non_Project_Sales: data.financial_health.total_non_project_sales_this_month || 0,
            Shop_Items_Sold: data.financial_health.total_shop_items_sold_this_month || 0,
            Shop_Profit: data.financial_health.total_shop_profit_this_month || 0,
            Project_Count: data.financial_health.project_count_this_month || 0,
            Project_Amount: data.financial_health.total_project_amount_this_month || 0,
            Total_Income: data.financial_health.total_income_this_month || 0,
            Total_Expenses: data.financial_health.total_expenses_month || 0,
            Profit: data.financial_health.profit_month || 0,
          });
        }

        if (data?.yearly_data) {
          setYearlyData({
            Total_Expenses: data.yearly_data.total_expenses_year || 0,
            Total_Income: data.yearly_data.total_income_year || 0,
            Profit: data.yearly_data.profit_year || 0,
          });
        }

        if (data?.customers) {
          setCustomerData({
            All_Customers: data.customers.all_customers_count || 0,
            Active_Customers: data.customers.active_customers_count || 0,
            Owing_Customers: data.customers.owing_customers_count || 0
          });
        }

        if (data?.workers) {
          setWorkerData({
            Salary_Workers: data.workers.salary_workers_count || 0,
            Active_Salary_Workers: data.workers.active_salary_workers_count || 0,
            Salary_Workers_Pay: data.workers.total_salary_workers_monthly_pay || 0,
            All_Contractors: data.workers.all_contractors_count || 0,
            Active_Contractors: data.workers.all_active_contractors_count || 0,
          });
        }

        if (data?.paid) {
          setPaidData({
            Monthly_Total_Paid: data.paid.monthly_total_paid || 0,
            Weekly_Total_Paid: data.paid.weekly_total_paid || 0,
            Total_Paid: data.paid.total_paid || 0,
            Contractors_Monthly_Pay: data.paid.total_contractors_monthly_pay || 0,
            Contractors_Weekly_Pay: data.paid.total_contractors_weekly_pay || 0,
          });
        }

        if (data?.expense_category_breakdown) {
          setExpenseBreakdown(
            data.expense_category_breakdown.map((item: { category: string; total: number }) => ({
              name: item.category,
              value: item.total,
            }))
          );
        }

      } catch (err) {
        console.error("Error fetching financial data:", err);
        setError("Failed to load financial data.");
      } finally {
        setLoading(false);
      }
    };

    fetchFactory();
  }, []);

  if (loading) {
    return (
      <div className="container mx-auto p-4">
        <div className="animate-pulse space-y-4">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="h-24 bg-gray-200 rounded"></div>
          ))}
        </div>
      </div>
    );
  }

  if (error) return <div className="text-red-500">{error}</div>;

  // Grouped cards
  const financialHealthCards = Object.entries(financialHealth).map(([key, value]) => ({
    key: `financialHealth-${key}`,
    title: key.replace(/_/g, ' '),
    value,
    currency: isMonetary(key) ? '₦ ' : undefined
  }));
  const yearlyDataCards = Object.entries(yearlyData).map(([key, value]) => ({
    key: `yearlyData-${key}`,
    title: key.replace(/_/g, ' '),
    value,
    currency: isMonetary(key) ? '₦ ' : undefined
  }));
  const customerDataCards = Object.entries(customerData).map(([key, value]) => ({
    key: `customerData-${key}`,
    title: key.replace(/_/g, ' '),
    value,
    currency: isMonetary(key) ? '₦ ' : undefined
  }));
  const workerDataCards = Object.entries(workerData).map(([key, value]) => ({
    key: `workerData-${key}`,
    title: key.replace(/_/g, ' '),
    value,
    currency: isMonetary(key) ? '₦ ' : undefined
  }));
  const paidDataCards = Object.entries(paidData).map(([key, value]) => ({
    key: `paidData-${key}`,
    title: key.replace(/_/g, ' '),
    value,
    currency: isMonetary(key) ? '₦ ' : undefined
  }));

  // Combine for show more/less logic
  const allCards = [
    ...financialHealthCards,
    ...yearlyDataCards,
    ...customerDataCards,
    ...workerDataCards,
    ...paidDataCards,
  ];

  // Helper to render a group with heading, with optional slice
  const renderCardGroup = (heading: string, cards: any[], start: number, end: number) => {
    const groupCards = cards.slice(start, end);
    return groupCards.length ? (
      <div className="mb-2">
        <h4 className="text-xs font-semibold text-gray-500 mb-1 pl-1 uppercase tracking-wide">{heading}</h4>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
          {groupCards.map(card => (
            <DashboardCard key={card.key} title={card.title} value={card.value} currency={card.currency} />
          ))}
        </div>
      </div>
    ) : null;
  };

  // Helper to get visible cards per group for the first N cards
  function getVisibleGroupSlices(groups: any[][], max: number) {
    let remaining = max;
    const slices = [];
    for (const group of groups) {
      if (remaining <= 0) {
        slices.push([0, 0]);
        continue;
      }
      const take = Math.min(group.length, remaining);
      slices.push([0, take]);
      remaining -= take;
    }
    return slices;
  }

  const groups = [financialHealthCards, yearlyDataCards, customerDataCards, workerDataCards, paidDataCards];
  const groupNames = ['Financial Health', 'Yearly Data', 'Customer', 'Workers', 'Paid'];
  const groupSlices = showAllCards ? groups.map(g => [0, g.length]) : getVisibleGroupSlices(groups, defaultVisibleCount);

  return (
    <div className="mb-20 md:mb-4">
      <div className="p-2 sm:p-4 mb-20 md:mb-4">
        {/* Grouped card sections, only first 2 rows by default */}
        {groups.map((group, i) => renderCardGroup(groupNames[i], group, groupSlices[i][0], groupSlices[i][1]))}
        {allCards.length > defaultVisibleCount && (
          <div className="flex justify-center mb-4">
            <button
              className="flex items-center justify-center w-10 h-10 bg-blue-600 text-white rounded-full shadow-lg hover:bg-blue-700 transition-transform duration-200 focus:outline-none"
              onClick={() => setShowAllCards(v => !v)}
              title={showAllCards ? 'Show Less' : 'Show More'}
              aria-label={showAllCards ? 'Show Less' : 'Show More'}
            >
              <svg
                className={`w-6 h-6 transform transition-transform duration-300 ${showAllCards ? 'rotate-180' : ''}`}
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
              </svg>
            </button>
          </div>
        )}
      </div>
      <div className="p-2 sm:p-4">

        <div className="w-full min-h-[220px] sm:min-h-[350px] bg-white rounded-lg shadow p-2 sm:p-4 overflow-x-auto mb-4">
        <PieChartComponent data={expenseBreakdown} />
        </div>
        <div className="w-full min-h-[220px] sm:min-h-[350px] bg-white rounded-lg shadow p-2 sm:p-4 overflow-x-auto">
        <BarChartComponent />
        </div>
      </div>
    </div>
  );
};

export default FactoryManagerDashboard;
