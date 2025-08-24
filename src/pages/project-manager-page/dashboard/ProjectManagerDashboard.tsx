import { useState } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
} from "recharts";
import { MdExpandMore, MdExpandLess } from "react-icons/md";
import { CustomTooltip } from "../../../components/CustomChartComponents";
import ProjectDashboardCard from "./ProjectDashboardCard";
import dashboardData from "../../../data/project-manager-page/dashboard/dashboardData.json";

const ProjectManagerDashboard = () => {
  document.title = "Project Dashboard - Admin";

  const [apiData, setApiData] = useState<any | null>(dashboardData);
  const [loading, setLoading] = useState(false); // Set to false since no API call
  const [error, setError] = useState<string | null>(null);
  const [openSection, setOpenSection] = useState<"breakdownMetrics" | "expenseAndKeyMetrics">("breakdownMetrics");

  // Helper: Format number with naira sign and commas for cards (no k, m, b)
  const formatNaira = (value: number) => {
    const sign = value < 0 ? "-" : "";
    return `${sign}₦${Math.abs(value).toLocaleString("en-NG")}`;
  };

  // Helper: Format number with naira sign and compact k, m, b for charts
  const formatNairaCompact = (value: number) => {
    const absValue = Math.abs(value);
    const sign = value < 0 ? "-" : "";
    if (absValue >= 1_000_000_000) {
      return `${sign}₦${(absValue / 1_000_000_000).toFixed(1).replace(/\.0$/, "")}b`;
    } else if (absValue >= 1_000_000) {
      return `${sign}₦${(absValue / 1_000_000).toFixed(1).replace(/\.0$/, "")}m`;
    } else if (absValue >= 1_000) {
      return `${sign}₦${(absValue / 1_000).toFixed(1).replace(/\.0$/, "")}k`;
    }
    return `${sign}₦${absValue.toLocaleString("en-NG")}`;
  };

  // Helper to determine if a key is monetary
  const isMonetary = (key: string) => {
    const excluded = [
      "projects_count_year",
      "projects_count_month",
      "percentage_projects",
      "percentage_shop",
      "all_customers_count",
      "active_customers_count",
      "owing_customers_count",
      "active_employees",
      "average_project_duration_days",
      "customer_satisfaction_rate",
      "on_time_delivery_rate",
      "net_profit_margin",
      "employee_productivity_rate",
      "inventory_turnover",
      "customer_retention_rate",
      "project_success_rate",
      "monthly_growth_rate",
      "client_referral_rate",
      "operational_efficiency",
      "budget_adherence_rate"
    ];
    if (key.toLowerCase() === "other_production_expensis") return true;
    if (excluded.includes(key.toLowerCase())) return false;
    return /amount|income|profit|expenses|cost|price|total|contractors|overhead|materials|sold|value|pay|shop|revenue/i.test(
      key
    );
  };

  // Helper to filter out percentage cards
  const isPercentageKey = (key: string) =>
    ["percentage_projects", "percentage_shop"].includes(key.toLowerCase());

  // Card name mapping for user-friendly display with shortened names
  const cardNameMap: Record<string, string> = {
    projects_count_year: "Project Count (Yr)",
    total_projects_income_year: "Tot. Proj. Rev. (Yr)",
    no_shop_projects_year: "Non-Shp. Rev. (Yr)",
    project_shop_income_year: "Shp. Rev. (Yr)",
    project_expenses_year: "Proj. Exp. (Yr)",
    profit_year: "Profit (Yr)",
    projects_count_month: "Project Count (Mo)",
    total_projects_income_month: "Tot. Proj. Rev. (Mo)",
    no_shop_projects_month: "Non-Shp. Rev. (Mo)",
    project_shop_income_month: "Shp. Rev. (Mo)",
    project_expenses_month: "Proj. Exp. (Mo)",
    profit_month: "Profit (Mo)",
    contractors: "Contractors (Mo)",
    raw_materials: "Raw Materials (Mo)",
    overhead: "Overhead (Mo)",
    factory_expenses: "Factory Exp. (Mo)",
    other_production_expensis: "Other Prod. Exp. (Mo)",
    sold_cost: "Sold Cost (Mo)",
    yearly_sold_cost_price: "Sold Cost Prc. (Yr)",
    total_project_expenses_year: "Tot. Proj. Exp. (Yr)",
    monthly_sold_cost_price: "Sold Cost Prc. (Mo)",
    total_project_expenses_month: "Tot. Proj. Exp. (Mo)",
    overhead_cost: "Overhead Cost",
    all_customers_count: "All Customers",
    active_customers_count: "Active Customers",
    owing_customers_count: "Owing Customers",
    active_employees: "Active Employees",
    total_projects_completed: "Tot. Proj. Completed",
    average_project_duration_days: "Avg. Proj. Duration (Days)",
    customer_satisfaction_rate: "Cust. Satisfaction",
    on_time_delivery_rate: "On-Time Delivery",
    total_revenue: "Total Revenue",
    net_profit_margin: "Net Profit Margin",
    employee_productivity_rate: "Emp. Productivity",
    inventory_turnover: "Inventory Turnover",
    average_contract_value: "Avg. Contract Value",
    customer_retention_rate: "Cust. Retention",
    project_success_rate: "Proj. Success Rate",
    cost_per_project: "Cost per Project",
    revenue_per_employee: "Rev. per Employee",
    monthly_growth_rate: "Monthly Growth",
    client_referral_rate: "Client Referrals",
    operational_efficiency: "Op. Efficiency",
    budget_adherence_rate: "Budget Adherence"
  };

  // Card data
  const yearlyBreakdownCards = apiData?.breakdown_year
    ? Object.entries(apiData.breakdown_year)
        .filter(([key]) => !isPercentageKey(key))
        .map(([key, value]) => ({
          key: `breakdownYear-${key}`,
          title: cardNameMap[key] || key.replace(/_/g, " ").replace(/\b\w/g, (c) => c.toUpperCase()),
          value: value,
        }))
    : [];

  const monthlyBreakdownCards = apiData?.breakdown_month
    ? Object.entries(apiData.breakdown_month)
        .filter(([key]) => !isPercentageKey(key))
        .map(([key, value]) => ({
          key: `breakdownMonth-${key}`,
          title: cardNameMap[key] || key.replace(/_/g, " ").replace(/\b\w/g, (c) => c.toUpperCase()),
          value: value,
        }))
    : [];

  const yearlyExpenseCards = apiData?.expense_breakdown_year
    ? Object.entries(apiData.expense_breakdown_year).map(([key, value]) => ({
        key: `expenseBreakdownYear-${key}`,
        title: cardNameMap[key] || key.replace(/_/g, " ").replace(/\b\w/g, (c) => c.toUpperCase()),
        value: value,
      }))
    : [];

  const monthlyExpenseCards = apiData?.expense_breakdown_month
    ? Object.entries(apiData.expense_breakdown_month).map(([key, value]) => ({
        key: `expenseBreakdownMonth-${key}`,
        title: cardNameMap[key] || key.replace(/_/g, " ").replace(/\b\w/g, (c) => c.toUpperCase()),
        value: value,
      }))
    : [];

  const keyMetricsCards = apiData?.key_metrics
    ? Object.entries(apiData.key_metrics).map(([key, value]) => ({
        key: `keyMetrics-${key}`,
        title: cardNameMap[key] || key.replace(/_/g, " ").replace(/\b\w/g, (c) => c.toUpperCase()),
        value: value,
      }))
    : [];

  const customerMetricsCards = apiData?.customers
    ? Object.entries(apiData.customers)
        .filter(([key]) => key !== "owing_customers")
        .map(([key, value]) => ({
          key: `customers-${key}`,
          title: cardNameMap[key] || key.replace(/_/g, " ").replace(/\b\w/g, (c) => c.toUpperCase()),
          value: value,
        }))
    : [];

  const additionalMetricsCards = apiData?.additional_metrics
    ? Object.entries(apiData.additional_metrics).map(([key, value]) => ({
        key: `additionalMetrics-${key}`,
        title: cardNameMap[key] || key.replace(/_/g, " ").replace(/\b\w/g, (c) => c.toUpperCase()),
        value: value,
      }))
    : [];

  // Group cards into two groups for collapsible sections
  const breakdownMetricsCards = [...yearlyBreakdownCards, ...monthlyBreakdownCards];
  const expenseAndKeyMetricsCards = [
    ...yearlyExpenseCards,
    ...monthlyExpenseCards,
    ...keyMetricsCards,
    ...customerMetricsCards,
    ...additionalMetricsCards,
  ];

  const handleSectionClick = (section: typeof openSection) => {
    setOpenSection(section);
  };

  if (loading) {
    return (
      <div className="container mx-auto p-4">
        <div className="animate-pulse space-y-4">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="h-24 bg-gray-200"></div>
          ))}
        </div>
      </div>
    );
  }

  if (error) return <div className="text-red-500">{error}</div>;

  // Chart data
  const incomeData = apiData?.monthly_income_trend || [];
  const expensesData = apiData?.monthly_expense_trend || [];
  const profitData = apiData?.monthly_profit_trend || [];

  return (
    <div className="relative z-10 sm:p-3 lg:p-4 w-full min-w-0 mb-20 md:mb-2">
      {/* Collapsible Section Headers Row */}
      <div className="grid grid-cols-2 md:grid-cols-2 lg:flex gap-2 mb-3 px-0 py-1 w-full min-w-0">
        <button
          className={`w-full flex-1 flex-shrink min-w-0 flex items-center justify-between px-2 py-6 rounded-lg shadow bg-blue-50/60 hover:bg-blue-100 transition font-semibold text-blue-700 text-[11px] sm:text-xs ${
            openSection === "breakdownMetrics" ? "ring-2 ring-blue-400" : ""
          }`}
          onClick={() => handleSectionClick("breakdownMetrics")}
        >
          <span className="truncate text-left flex-1">Breakdown Metrics</span>
          <span className="flex items-center justify-end">
            {openSection === "breakdownMetrics" ? <MdExpandLess size={18} /> : <MdExpandMore size={18} />}
          </span>
        </button>
        <button
          className={`w-full flex-1 flex-shrink min-w-0 flex items-center justify-between px-2 py-6 rounded-lg shadow bg-teal-50/60 hover:bg-teal-100 transition font-semibold text-teal-700 text-[11px] sm:text-xs ${
            openSection === "expenseAndKeyMetrics" ? "ring-2 ring-teal-400" : ""
          }`}
          onClick={() => handleSectionClick("expenseAndKeyMetrics")}
        >
          <span className="truncate text-left flex-1">Expense & Key Metrics</span>
          <span className="flex items-center justify-end">
            {openSection === "expenseAndKeyMetrics" ? <MdExpandLess size={18} /> : <MdExpandMore size={18} />}
          </span>
        </button>
      </div>

      {/* Collapsible Section Content */}
      {openSection === "breakdownMetrics" && (
        <section className="mb-6 sm:mb-8 bg-blue-50/60 rounded-2xl shadow p-1 sm:p-4 lg:p-6">
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-3 xl:grid-cols-6 gap-2 sm:gap-3 lg:gap-4">
            {breakdownMetricsCards.map((card) => (
              <ProjectDashboardCard
                key={card.key}
                label={card.title}
                value={card.value}
                isMonetary={isMonetary(card.key.split("-")[1])}
              />
            ))}
          </div>
        </section>
      )}

      {openSection === "expenseAndKeyMetrics" && (
        <section className="mb-6 sm:mb-8 bg-teal-50/60 shadow p-1 sm:p-4 lg:p-6">
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-3 xl:grid-cols-6 gap-2 sm:gap-3 lg:gap-4">
            {expenseAndKeyMetricsCards.map((card) => (
              <ProjectDashboardCard
                key={card.key}
                label={card.title}
                value={card.value}
                isMonetary={isMonetary(card.key.split("-")[1])}
              />
            ))}
          </div>
        </section>
      )}

      <div className="p-2 sm:p-4">
        <div className="w-full grid grid-cols-1 lg:grid-cols-2 gap-4 bg-gray-50">
          {/* Income Chart */}
          <div className="bg-white shadow-md border border-gray-200">
            <h2 className="text-xl font-semibold mb-4 ml-6 mt-1 text-gray-700">Monthly Revenue Trend</h2>
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
                  <Tooltip formatter={(value: number) => formatNairaCompact(value)} content={<CustomTooltip />} cursor={{ fill: "rgba(240, 240, 240, 0.5)" }} />
                  <Bar dataKey="total_income" fill="url(#incomeGradient)" name="Total Revenue" barSize={20} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Expenses Chart */}
          <div className="bg-white shadow-md border border-gray-200">
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
                  <Tooltip formatter={(value: number) => formatNairaCompact(value)} content={<CustomTooltip />} cursor={{ fill: "rgba(240, 240, 240, 0.5)" }} />
                  <Bar dataKey="total_expenses" fill="url(#expenseGradient)" name="Total Expenses" barSize={20} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Profit Chart */}
          <div className="bg-white shadow-md border lg:col-span-2 border-gray-200">
            <h2 className="text-xl font-semibold mb-4 ml-6 mt-1 text-gray-700">Monthly Profit Trend</h2>
            <div className="h-[260px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={profitData} margin={{ top: 5, right: 10, left: 0, bottom: 5 }} barGap={5}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} />
                  <XAxis dataKey="month" tick={{ fontSize: 12 }} />
                  <YAxis tickFormatter={formatNairaCompact} tick={{ fontSize: 12 }} width={80} />
                  <Tooltip formatter={(value: number) => formatNairaCompact(value)} content={<CustomTooltip />} cursor={{ fill: "rgba(240, 240, 240, 0.5)" }} />
                  <Bar dataKey="profit" fill="#4CAF50" barSize={40} />
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