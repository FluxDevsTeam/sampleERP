import { useEffect, useState } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  Legend,
} from "recharts";
import { Accordion } from "rsuite";
import { RoundedBar, CustomTooltip } from "../../../components/CustomChartComponents";
import DashboardCard from "../../factory-manager-page/dashboard/DashboardCard";

const ProjectManagerDashboard = () => {
  document.title = "Product Dashboard - KDC Admin";

  const [apiData, setApiData] = useState<any | null>(null);
  const [showAllCards, setShowAllCards] = useState(false);

  useEffect(() => {
    async function fetchInfo() {
      try {
        const response = await fetch(
          "https://backend.kidsdesigncompany.com/api/project-manager-dashboard/",
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              Authorization: `JWT ${localStorage.getItem("accessToken")}`,
            },
          }
        );

        if (!response.ok) {
          throw new Error("Failed to fetch dashboard data");
        }

        const logData = await response.json();
        setApiData(logData);
        console.log(logData);
      } catch (error) {
        console.error("Error fetching dashboard:", error);
        setApiData({});
      }
    }
    fetchInfo();
  }, []);

  // Helper: Format number with naira sign, commas, and compact notation (with negative handling)
  const formatNairaCompact = (value: number) => {
    const absValue = Math.abs(value);
    const sign = value < 0 ? '-' : '';
    if (absValue >= 1_000_000_000) {
      return `${sign}₦${(absValue / 1_000_000_000).toFixed(1).replace(/\.0$/, '')}b`;
    } else if (absValue >= 1_000_000) {
      return `${sign}₦${(absValue / 1_000_000).toFixed(1).replace(/\.0$/, '')}m`;
    } else if (absValue >= 1_000) {
      return `${sign}₦${(absValue / 1_000).toFixed(1).replace(/\.0$/, '')}k`;
    }
    return `${sign}₦${absValue?.toLocaleString?.() ?? absValue}`;
  };

  // Helper to determine if a key is monetary
  const isMonetary = (key: string) => {
    const excluded = [
      'projects_count_year', 'projects_count_month',
      'percentage_projects', 'percentage_shop',
    ];
    if (key.toLowerCase() === 'other_production_expensis') return true;
    if (excluded.includes(key.toLowerCase())) return false;
    return /amount|income|profit|expenses|cost|price|total|contractors|overhead|materials|sold|value|pay|shop/i.test(key);
  };

  // Helper to filter out percentage cards
  const isPercentageKey = (key: string) => ['percentage_projects', 'percentage_shop'].includes(key.toLowerCase());

  // Card name mapping for user-friendly display
  const cardNameMap: Record<string, string> = {
    // Yearly/Monthly Breakdown
    projects_count_year: "Projects (Year)",
    total_projects_income_year: "Total Project Income (Year)",
    no_shop_projects_year: "Non-Shop Project Income (Year)",
    project_shop_income_year: "Shop Project Income (Year)",
    project_expenses_year: "Project Expenses (Year)",
    profit_year: "Profit (Year)",
    projects_count_month: "Projects (Month)",
    total_projects_income_month: "Total Project Income (Month)",
    no_shop_projects_month: "Non-Shop Project Income (Month)",
    project_shop_income_month: "Shop Project Income (Month)",
    project_expenses_month: "Project Expenses (Month)",
    profit_month: "Profit (Month)",
    // Expenses
    contractors: "Contractors",
    raw_materials: "Raw Materials",
    overhead: "Overhead",
    factory_expenses: "Factory Expenses",
    other_production_expensis: "Other Production Expenses",
    sold_cost: "Sold Cost",
    yearly_sold_cost_price: "Yearly Sold Cost Price",
    total_project_expenses_year: "Total Project Expenses (Year)",
    monthly_sold_cost_price: "Monthly Sold Cost Price",
    total_project_expenses_month: "Total Project Expenses (Month)",
    // Key Metrics
    overhead_cost: "Overhead Cost",
    // Add more as needed
  };

  // Card data
  const keyMetricsCards = apiData?.key_metrics ? Object.entries(apiData.key_metrics).map(([key, value]) => ({
    key: `keyMetrics-${key}`,
    title: cardNameMap[key] || key.replace(/_/g, ' ').replace(/\b\w/g, c => c.toUpperCase()),
    value: Number(value) || 0,
    currency: isMonetary(key) ? '₦ ' : undefined
  })) : [];

  const yearlyBreakdownCards = apiData?.breakdown_year ? Object.entries(apiData.breakdown_year)
    .filter(([key]) => !isPercentageKey(key))
    .map(([key, value]) => ({
      key: `breakdownYear-${key}`,
      title: cardNameMap[key] || key.replace(/_/g, ' ').replace(/\b\w/g, c => c.toUpperCase()),
      value: Number(value) || 0,
      currency: isMonetary(key) ? '₦ ' : undefined
    })) : [];

  const monthlyBreakdownCards = apiData?.breakdown_month ? Object.entries(apiData.breakdown_month)
    .filter(([key]) => !isPercentageKey(key))
    .map(([key, value]) => ({
      key: `breakdownMonth-${key}`,
      title: cardNameMap[key] || key.replace(/_/g, ' ').replace(/\b\w/g, c => c.toUpperCase()),
      value: Number(value) || 0,
      currency: isMonetary(key) ? '₦ ' : undefined
    })) : [];

  const yearlyExpenseCards = apiData?.expense_breakdown_year ? Object.entries(apiData.expense_breakdown_year)
    .map(([key, value]) => ({
      key: `expenseBreakdownYear-${key}`,
      title: cardNameMap[key] || key.replace(/_/g, ' ').replace(/\b\w/g, c => c.toUpperCase()),
      value: Number(value) || 0,
      currency: isMonetary(key) ? '₦ ' : undefined
    })) : [];

  const monthlyExpenseCards = apiData?.expense_breakdown_month ? Object.entries(apiData.expense_breakdown_month)
    .map(([key, value]) => ({
      key: `expenseBreakdownMonth-${key}`,
      title: cardNameMap[key] || key.replace(/_/g, ' ').replace(/\b\w/g, c => c.toUpperCase()),
      value: Number(value) || 0,
      currency: isMonetary(key) ? '₦ ' : undefined
    })) : [];

  // Combine for show more/less logic
  // Number of columns in the grid (should match lg:grid-cols-6)
  const numCols = 6;
  const numRowsDefault = 2;
  const defaultVisibleCount = numCols * numRowsDefault;

  // Helper to render a group with heading, with optional slice
  const renderCardGroup = (heading: string, cards: any[], start: number, end: number) => {
    const groupCards = cards.slice(start, end);
    return groupCards.length ? (
      <div className="mb-2">
        <h4 className="text-xs font-semibold text-gray-500 pl-1 uppercase tracking-wide">{heading}</h4>
        <div className="grid grid-cols-3 md:grid-cols-3 lg:grid-cols-6 gap-3">
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

  const groups = [yearlyBreakdownCards, monthlyBreakdownCards, yearlyExpenseCards, monthlyExpenseCards, keyMetricsCards,];
  const groupNames = ['Yearly Breakdown', 'Monthly Breakdown', 'Yearly Expenses', 'Monthly Expenses','Key Metrics'];
  const groupSlices = showAllCards ? groups.map(g => [0, g.length]) : getVisibleGroupSlices(groups, defaultVisibleCount);

  // Chart data
  const incomeData = apiData?.monthly_income_trend || [];
  const expensesData = apiData?.monthly_expense_trend || [];
  const profitData = apiData?.monthly_profit_trend || [];

  return (
    <div className="w-full sm:w-11/12 mx-auto mt-3 sm:mt-6 pl-1 md-20 pt-2">
      <div className="mb-8 sm:mb-16">
        {/* Grouped card sections, only first 2 rows by default */}
        {groups.map((group, i) => renderCardGroup(groupNames[i], group, groupSlices[i][0], groupSlices[i][1]))}
        {groups.flat().length > defaultVisibleCount && (
          <div className="flex justify-center mb-4">
            <button
              className="flex items-center justify-center w-10 h-10 bg-blue-400 text-white rounded-full shadow-lg hover:bg-blue-400 transition-transform duration-200 focus:outline-none"
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

        <div className="w-full grid grid-cols-1 lg:grid-cols-2 gap-4 bg-gray-50">
          {/* Income Chart */}
          <div className="bg-white rounded-lg shadow-md border border-gray-200">
            <h2 className="text-xl font-semibold mb-4 ml-6 mt-1 text-gray-700">Monthly Income Trend</h2>
            <div className="h-[260px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={incomeData} margin={{ top: 5, right: 10, left: 0, bottom: 5 }} barGap={5}>
                  <defs>
                    <linearGradient id="incomeGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#4A90E2" stopOpacity={0.9} />
                      <stop offset="100%" stopColor="#50E3C2" stopOpacity={0.9} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} />
                  <XAxis dataKey="month" tick={{ fontSize: 12 }} />
                  <YAxis tickFormatter={formatNairaCompact} tick={{ fontSize: 12 }} width={80} />
                  <Tooltip formatter={(value: number) => formatNairaCompact(value)} content={<CustomTooltip />} cursor={{fill: 'rgba(240, 240, 240, 0.5)'}} />
                  <Bar dataKey="total_income" fill="url(#incomeGradient)" name="Total Income" barSize={20} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Expenses Chart */}
          <div className="bg-white rounded-lg shadow-md border border-gray-200">
            <h2 className="text-xl font-semibold mb-4 ml-6 mt-1 text-gray-700">Monthly Expense Trend</h2>
            <div className="h-[260px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={expensesData} margin={{ top: 5, right: 10, left: 0, bottom: 5 }} barGap={5}>
                  <defs>
                    <linearGradient id="expenseGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#F44336" stopOpacity={0.9} />
                      <stop offset="100%" stopColor="#F5A623" stopOpacity={0.9} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} />
                  <XAxis dataKey="month" tick={{ fontSize: 12 }} />
                  <YAxis tickFormatter={formatNairaCompact} tick={{ fontSize: 12 }} width={80} />
                  <Tooltip formatter={(value: number) => formatNairaCompact(value)} content={<CustomTooltip />} cursor={{fill: 'rgba(240, 240, 240, 0.5)'}} />
                  <Bar dataKey="total_expenses" fill="url(#expenseGradient)" name="Total Expenses" barSize={20} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Profit Chart */}
          <div className="bg-white rounded-lg shadow-md border lg:col-span-2 border-gray-200">
            <h2 className="text-xl font-semibold mb-4 ml-6 mt-1 text-gray-700">Monthly Profit Trend</h2>
            <div className="h-[260px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={profitData} margin={{ top: 5, right: 10, left: 0, bottom: 5 }} barGap={5}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} />
                  <XAxis dataKey="month" tick={{ fontSize: 12 }} />
                  <YAxis tickFormatter={formatNairaCompact} tick={{ fontSize: 12 }} width={80} />
                  <Tooltip formatter={(value: number) => formatNairaCompact(value)} content={<CustomTooltip />} cursor={{fill: 'rgba(240, 240, 240, 0.5)'}} />
                  <Bar 
                    dataKey="profit" 
                    fill="#4CAF50"
                    barSize={40}
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProjectManagerDashboard;
