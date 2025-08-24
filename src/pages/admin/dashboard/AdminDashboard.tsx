import { useQuery } from "@tanstack/react-query";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
  CartesianGrid,
  Legend,
  ResponsiveContainer,
} from "recharts";
import Header from "./_components/Header";
import SkeletonLoader from "./_components/SkeletonLoader";
import AdminDashboardCard from "./AdminDashboardCard";
import React from "react";
import { CustomTooltip } from "../../../components/CustomChartComponents";
import adminDashboardData from "@/data/admin/dashboard/admin-dashboard.json";
import { useState, useEffect } from "react";

const fetchFinancialData = async () => {
  // Load from local storage if available, else use JSON
  const storedData = localStorage.getItem("adminDashboardData");
  return storedData ? JSON.parse(storedData) : adminDashboardData;
};

// Helper to determine if a key is monetary
const isMonetary = (key: string) => {
  const excluded = [
    'sales_count',
  ];
  if (excluded.includes(key.toLowerCase())) return false;
  return /amount|income|profit|paid|value|expenses|cost|sales|pay|assets|shop/i.test(key);
};

// Mapping for better card names
const cardNameMap: Record<string, string> = {
  yearly_total_paid: "Yearly Total Paid",
  active_salary_workers_count: "Active Salary Workers",
  all_active_contractors_count: "Active Contractors",
  total_expenses: "Total Expenses",
  total_income: "Total Income",
  total_profit: "Total Profit",
  total_assets: "Total Assets",
  total_shop_value: "Total Shop Value",
  salary: "Salary Paid",
  contractors: "Contractors Paid",
  sales_count: "Sales Count",
  "total_salary_workers_monthly_pay": "Fixed Monthly Salary",
  "total_contractors_monthly_pay": "Monthly Contractors Pay",
  "total_paid": "Monthly Salary Pay",
  // ...add more as needed
};

// Custom order for cards
const cardOrder = [
  "Total Expenses",
  "Monthly Salary Pay",
  "Monthly Contractors Pay",
  "Monthly Total Paid",
];

const AdminDashboard = () => {
  const { data, isLoading, error } = useQuery({
    queryKey: ["financialData"],
    queryFn: fetchFinancialData,
  });

  const [showAllCards, setShowAllCards] = React.useState(false);
  const numCols = 5;
  const numRowsDefault = 2;
  const defaultVisibleCount = numCols * numRowsDefault;

  // Responsive: show fewer XAxis ticks on mobile
  const isMobile = typeof window !== 'undefined' && window.innerWidth < 640;
  const isTablet = typeof window !== 'undefined' && window.innerWidth < 1024 && window.innerWidth >= 640;

  // Flatten all relevant data into a single array of cards
  const financialHealthCards = data?.financial_health
    ? Object.entries(data.financial_health).map(([key, value]) => {
        const title = cardNameMap[key] || key.replace(/_/g, " ").replace(/\b\w/g, c => c.toUpperCase());
        // Remove naira sign for Deprecated Assets and Active Assets
        if (title === "Active Assets" || title === "Deprecated Assets") {
          return null; // Exclude these cards
        }
        return {
          key: `financialHealth-${key}`,
          title,
          value: value === undefined || value === null ? 0 : Number(value),
          currency: isMonetary(key) ? "₦ " : undefined,
        };
      })
    .filter(card => card !== null)
    : [];
  const workersCards = data?.workers
    ? Object.entries(data.workers)
        .filter(([key]) => !['contractors_count', 'salary_workers_count', 'all_contractors_count', 'active_salary_workers_count', 'all_active_contractors_count', 'total_salary_workers_monthly_pay'].includes(key))
        .map(([key, value]) => ({
        key: `workers-${key}`,
        title: cardNameMap[key] || key.replace(/_/g, " ").replace(/\b\w/g, c => c.toUpperCase()),
        value: value === undefined || value === null ? 0 : Number(value),
        currency: isMonetary(key) ? "₦ " : undefined,
      }))
    : [];
  const paidCards = data?.paid
    ? Object.entries(data.paid)
        .filter(([key]) => !['weekly_total_paid', 'total_contractors_weekly_pay'].includes(key))
        .map(([key, value]) => ({
        key: `paid-${key}`,
        title: cardNameMap[key] || key.replace(/_/g, " ").replace(/\b\w/g, c => c.toUpperCase()),
        value: value === undefined || value === null ? 0 : Number(value),
        currency: isMonetary(key) ? "₦ " : undefined,
      }))
    : [];

  // Create Monthly Total Paid card as sum of Monthly Salary Pay and Monthly Contractors Pay
  const monthlySalaryPay = data?.paid?.total_paid || 0;
  const monthlyContractorsPay = data?.workers?.total_contractors_monthly_pay || 0;
  const monthlyTotalPaidCard = {
    key: "custom-monthly-total-paid",
    title: "Monthly Total Paid",
    value: Number(monthlySalaryPay) + Number(monthlyContractorsPay),
    currency: "₦ ",
  };

  // Filter to show only the specified four cards
  const allCards = [
    ...financialHealthCards,
    ...workersCards,
    ...paidCards,
    monthlyTotalPaidCard,
  ].filter(card => [
    "Total Expenses",
    "Monthly Salary Pay",
    "Monthly Contractors Pay",
    "Monthly Total Paid"
  ].includes(card.title)).sort((a, b) => {
    const aIdx = cardOrder.indexOf(a.title);
    const bIdx = cardOrder.indexOf(b.title);
    if (aIdx === -1 && bIdx === -1) return 0;
    if (aIdx === -1) return 1;
    if (bIdx === -1) return -1;
    return aIdx - bIdx;
  });
  const visibleCards = showAllCards ? allCards : allCards.slice(0, defaultVisibleCount);

  if (isLoading) return <SkeletonLoader />;
  if (error) return <p>Error loading data</p>;

  const workersData = Object.keys(data?.workers || {}).map((key) => ({
    name: key.replace(/_/g, " ").replace(/\b\w/g, (char) => char.toUpperCase()),
    count: data?.workers[key] || 0,
  }));

  const paidData = Object.keys(data?.paid || {}).map((key) => ({
    name: key.replace(/_/g, " ").replace(/\b\w/g, (char) => char.toUpperCase()),
    amount: data?.paid[key] || 0,
  }));

  const expenseCategoryBreakdown = data?.expense_category_breakdown || [];
  // Show top 5, group the rest as 'Others' (handle duplicate 'Others')
  let pieData = expenseCategoryBreakdown;
  if (expenseCategoryBreakdown.length > 5) {
    const sorted = [...expenseCategoryBreakdown].sort((a, b) => b.percentage - a.percentage);
    let top5 = sorted.slice(0, 5);
    let others = sorted.slice(5);
    // Check if 'Others' is in top5
    let othersInTop5Idx = top5.findIndex(item => item.category.toLowerCase() === 'others');
    // Sum all 'Others' in the rest
    let othersFromRest = others.filter(item => item.category.toLowerCase() === 'others');
    let nonOthersRest = others.filter(item => item.category.toLowerCase() !== 'others');
    let othersTotal = nonOthersRest.reduce((sum, item) => sum + (item.percentage || 0), 0);
    let othersLabel = 'Others';
    // If 'Others' is already in top5, merge all into it
    if (othersInTop5Idx !== -1) {
      let mergedValue = top5[othersInTop5Idx].percentage + othersTotal + othersFromRest.reduce((sum, item) => sum + (item.percentage || 0), 0);
      top5[othersInTop5Idx] = { ...top5[othersInTop5Idx], percentage: mergedValue };
    } else {
      // If 'Others' is not in top5, but present in rest, merge all as 'Other Categories'
      if (othersFromRest.length > 0) {
        othersLabel = 'Other Categories';
        othersTotal += othersFromRest.reduce((sum, item) => sum + (item.percentage || 0), 0);
      }
      if (othersTotal > 0) {
        top5.push({ category: othersLabel, percentage: othersTotal });
      }
    }
    pieData = top5;
  }
  const monthlyExpenseTrend = data?.monthly_expense_trend || [];
  const topCategories = data?.top_categories || [];

  const colors = ["#8884d8", "#82ca9d", "#ffc658", "#ff7300", "#ff0000"];

  // Format number with naira sign, commas, and compact notation
  const formatNairaCompact = (value: number) => {
    if (value >= 1_000_000) {
      return `₦${(value / 1_000_000).toFixed(1).replace(/\.0$/, '')}m`;
    } else if (value >= 1_000) {
      return `₦${(value / 1_000).toFixed(1).replace(/\.0$/, '')}k`;
    }
    return `₦${value.toLocaleString()}`;
  };

  // Custom Tooltip for PieChart to only show for top 5 + 'Others'
  const CustomPieTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const cat = payload[0]?.payload?.category;
      // Only show tooltip for categories in pieData (top 5 + 'Others')
      if (pieData.some((item: { category: string }) => item.category === cat)) {
        return (
          <div className="p-2 bg-white border border-gray-200 rounded shadow">
            <div className="font-semibold">{cat}</div>
            <div>
              {payload[0]?.value}%
            </div>
          </div>
        );
      }
    }
    return null;
  };

  // Helper to determine if a color is light or dark
  function isColorLight(hex: string) {
    // Remove # if present
    hex = hex.replace('#', '');
    // Convert to RGB
    const r = parseInt(hex.substring(0, 2), 16);
    const g = parseInt(hex.substring(2, 4), 16);
    const b = parseInt(hex.substring(4, 6), 16);
    // Perceived brightness
    return (r * 0.299 + g * 0.587 + b * 0.114) > 186;
  }

  // Custom label for Pie chart: show percentage inside the slice segment
  const PieLabel = ({ value, percent, cx, cy, midAngle, innerRadius, outerRadius, index }: { 
    value: number; 
    percent: number; 
    cx: number; 
    cy: number; 
    midAngle: number; 
    innerRadius: number; 
    outerRadius: number; 
    index: number 
  }) => {
    if (percent < 0.05) return null;
    
    // Calculate position inside the slice
    const RADIAN = Math.PI / 180;
    const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
    const x = cx + radius * Math.cos(-midAngle * RADIAN);
    const y = cy + radius * Math.sin(-midAngle * RADIAN);
    
    // Always use white for percentage text color
    return (
      <text
        x={x}
        y={y}
        textAnchor="middle"
        fontSize={window.innerWidth < 640 ? 10 : 13}
        fontWeight="bold"
        fill="#fff"
        dominantBaseline="central"
      >
        {`${Math.round(percent * 100)}%`}
      </text>
    );
  };

  // Pie legend: ensure 'Others' or 'Other Categories' is always last
  const othersLabels = ['Others', 'Other Categories'];
  const pieLegendData = [
    ...pieData.filter((entry: { category: string }) => !othersLabels.includes(entry.category)),
    ...pieData.filter((entry: { category: string }) => othersLabels.includes(entry.category)),
  ];

  return (
    <div className="sm:p-4 md:p-6 space-y-4 sm:space-y-6 mb-20">
      {/* Card grid for all data */}
      <div className="mb-10">
       <div className="grid grid-cols-2  md:grid-cols-4 gap-2 md:gap-4">
          {visibleCards.map(card => (
            <AdminDashboardCard key={card.key} title={card.title} value={card.value} currency={card.currency} />
          ))}
        </div>
        {allCards.length > defaultVisibleCount && (
          <div className="flex justify-center mb-3 sm:mb-4">
            <button
              className="flex items-center justify-center w-8 h-8 sm:w-10 sm:h-10 bg-blue-600 text-white rounded-full shadow-lg hover:bg-blue-700 transition-transform duration-200 focus:outline-none"
              onClick={() => setShowAllCards(v => !v)}
              title={showAllCards ? 'Show Less' : 'Show More'}
              aria-label={showAllCards ? 'Show Less' : 'Show More'}
            >
              <svg
                className={`w-4 h-4 sm:w-6 sm:h-6 transform transition-transform duration-300 ${showAllCards ? 'rotate-180' : ''}`}
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

      {/* Two charts in a row */}
      <div className="grid grid-cols-1 gap-4 sm:gap-6 lg:grid-cols-2">
        {/* Expense Category Breakdown */}
        <div className="bg-white rounded-lg shadow p-1 mb-4 w-full overflow-x-auto">
          <h2 className="text-base sm:text-lg ml-6 mt-2 font-semibold mb-2 4">
            Expense Category Breakdown
          </h2>
          <div className="overflow-x-auto">
          <ResponsiveContainer width="100%" height={300} className="sm:h-[350px]">
            <PieChart>
              <Pie
                  data={pieData}
                dataKey="percentage"
                nameKey="category"
                cx="50%"
                cy="50%"
                  outerRadius={120}
                  innerRadius={20}
                className="sm:outerRadius-[100px] sm:innerRadius-[50px]"
                  label={PieLabel}
                  labelLine={false}
              >
                  {pieData.map((_entry: any, index: number) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={colors[index % colors.length]}
                  />
                ))}
              </Pie>
                {/* <Tooltip content={<CustomPieTooltip />} /> */}
                <Legend 
                  layout="horizontal" 
                  verticalAlign="bottom" 
                  align="center"
                  payload={pieLegendData.map((entry: { category: string }, index: number) => ({
                    value: entry.category,
                    type: 'circle',
                    color: colors[index % colors.length]
                  }))}
                  wrapperStyle={{ 
                    fontSize: window.innerWidth < 640 ? '10px' : '12px', 
                    whiteSpace: 'pre-wrap', 
                    wordBreak: 'break-word', 
                    maxWidth: '100%',
                    paddingTop: '10px'
                  }} 
                />
            </PieChart>
          </ResponsiveContainer>
          </div>
        </div>

        {/* Top Categories */}
        <div className="bg-white rounded-lg shadow p-2 sm:p-4 mb-4 w-full overflow-x-auto">
          <h2 className="text-base sm:text-lg font-semibold mb-2 sm:mb-4">Top Categories</h2>
          <ResponsiveContainer width="100%" height={300} className="sm:h-[300px]">
            <BarChart data={topCategories} margin={{ top: 5, right: 10, left: 0, bottom: 5 }} barGap={5}>
              <defs>
                <linearGradient id="topCategoriesGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#4A90E2" stopOpacity={0.9} />
                  <stop offset="100%" stopColor="#50E3C2" stopOpacity={0.9} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" vertical={false} />
              <XAxis dataKey="name" tick={{ fontSize: 12 }} interval={0} angle={-26} textAnchor="end" height={60} tickFormatter={(value) => (value.length > 16 ? `${value.substring(0, 16)}..` : value)}/>
              <YAxis tick={{ fontSize: 12 }} tickFormatter={formatNairaCompact} width={64} />
              <Tooltip formatter={(value: number) => formatNairaCompact(value)} content={<CustomTooltip />} cursor={{ fill: "rgba(240, 240, 240, 0.5)" }} />
              <Bar dataKey="total" fill="url(#topCategoriesGradient)" name="Total" barSize={40} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Single Bar Chart for Monthly Expense Trend */}
      <div className="bg-white rounded-lg shadow p-2 sm:p-4 w-full overflow-x-auto">
        <h2 className="text-base sm:text-lg font-semibold mb-2 sm:mb-4 ml-4">Monthly Expense Trend</h2>
        <ResponsiveContainer width="100%" height={300} className="sm:h-[300px]">
          <BarChart data={monthlyExpenseTrend} margin={{ top: 5, right: 10, left: 0, bottom: 5 }} barGap={5}>
            <defs>
              <linearGradient id="monthlyExpenseGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#F44336" stopOpacity={0.9} />
                <stop offset="100%" stopColor="#F5A623" stopOpacity={0.9} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" vertical={false} />
            <XAxis dataKey="month" tick={{ fontSize: 12 }}/>
            <YAxis tick={{ fontSize: 12 }} tickFormatter={formatNairaCompact} width={64} />
            <Tooltip formatter={(value: number) => formatNairaCompact(value)} content={<CustomTooltip />} cursor={{ fill: "rgba(240, 240, 240, 0.5)" }} />
            <Bar dataKey="total_expenses" fill="url(#monthlyExpenseGradient)" name="Total Expenses" barSize={40} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default AdminDashboard;