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
import axios from "axios";
import Header from "./_components/Header";
import SkeletonLoader from "./_components/SkeletonLoader";
import AdminDashboardCard from "./AdminDashboardCard";
import React from "react";

const fetchFinancialData = async () => {
  const accessToken = localStorage.getItem("accessToken");
  const { data } = await axios.get(
    "https://backend.kidsdesigncompany.com/api/admin-dashboard/",
    {
      headers: {
        Authorization: `JWT ${accessToken}`,
      },
    }
  );
  return data;
};

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

const AdminDashboard = () => {
  const { data, isLoading, error } = useQuery({
    queryKey: ["financialData"],
    queryFn: fetchFinancialData,
  });

  const [showAllCards, setShowAllCards] = React.useState(false);
  const numCols = 5;
  const numRowsDefault = 2;
  const defaultVisibleCount = numCols * numRowsDefault;

  // Flatten all relevant data into a single array of cards
  const financialHealthCards = data?.financial_health
    ? Object.entries(data.financial_health).map(([key, value]) => ({
        key: `financialHealth-${key}`,
        title: key.replace(/_/g, " "),
        value: Number(value) || 0,
        currency: isMonetary(key) ? "₦ " : undefined,
      }))
    : [];
  const workersCards = data?.workers
    ? Object.entries(data.workers).map(([key, value]) => ({
        key: `workers-${key}`,
        title: key.replace(/_/g, " "),
        value: Number(value) || 0,
        currency: isMonetary(key) ? "₦ " : undefined,
      }))
    : [];
  const paidCards = data?.paid
    ? Object.entries(data.paid).map(([key, value]) => ({
        key: `paid-${key}`,
        title: key.replace(/_/g, " "),
        value: Number(value) || 0,
        currency: isMonetary(key) ? "₦ " : undefined,
      }))
    : [];

  const allCards = [
    ...financialHealthCards,
    ...workersCards,
    ...paidCards,
  ];
  const visibleCards = showAllCards ? allCards : allCards.slice(0, defaultVisibleCount);

  // Split into two categories
  const category1Cards = financialHealthCards;
  const category2Cards = [...workersCards, ...paidCards];

  // Helper to render a group with heading, with optional slice
  const renderCardGroup = (heading: string, cards: any[], start: number, end: number) => {
    const groupCards = cards.slice(start, end);
    return groupCards.length ? (
      <div className="mb-4">
        <h4 className="text-xs font-semibold text-gray-500 mb-1 pl-1 uppercase tracking-wide">{heading}</h4>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-5 p-2">
          {groupCards.map(card => (
            <AdminDashboardCard key={card.key} title={card.title} value={card.value} currency={card.currency} />
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

  // Swap the order so Workers & Paid Data comes first
  const groups = [category2Cards, category1Cards];
  const groupNames = ['Workers & Paid Data', 'Financial Health'];
  const groupSlices = showAllCards ? groups.map(g => [0, g.length]) : getVisibleGroupSlices(groups, defaultVisibleCount);

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
  const monthlyExpenseTrend = data?.monthly_expense_trend || [];
  const topCategories = data?.top_categories || [];

  const colors = ["#8884d8", "#82ca9d", "#ffc658", "#ff7300", "#ff0000"];

  return (
    <div className="p-6 space-y-6">
      {/* <Header /> */}

      {/* Card grid for all data */}
      <div className="mb-6">
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

      {/* Two charts in a row */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Expense Category Breakdown */}
        <div>
          <h2 className="text-xl font-semibold mb-4">
            Expense Category Breakdown
          </h2>
          <ResponsiveContainer width="100%" height={350}>
            <PieChart>
              <Pie
                data={expenseCategoryBreakdown}
                dataKey="percentage"
                nameKey="category"
                cx="50%"
                cy="50%"
                outerRadius={100}
                innerRadius={50}
                label={({ name, value }) => `${name} (${value}%)`}
              >
                {expenseCategoryBreakdown.map((_entry: any, index: number) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={colors[index % colors.length]}
                  />
                ))}
              </Pie>
              <Tooltip />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>

        {/* Top Categories */}
        <div>
          <h2 className="text-xl font-semibold mb-4">Top Categories</h2>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={topCategories} barSize={30}>
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="total" fill="#ff7300" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Line Chart takes Full Width */}
      <div>
        <h2 className="text-xl font-semibold mb-4">Monthly Expense Trend</h2>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={monthlyExpenseTrend}>
            <XAxis dataKey="month" />
            <YAxis />
            <CartesianGrid strokeDasharray="3 3" />
            <Tooltip />
            <Legend />
            <Bar dataKey="type_breakdown.project" fill="#82ca9d" name="Project Expenses" stackId="a" />
            <Bar dataKey="type_breakdown.shop" fill="#ffc658" name="Shop Expenses" stackId="a" />
            <Bar dataKey="type_breakdown.others" fill="#ff7300" name="Other Expenses" stackId="a" />
            {/* Optionally show total as a separate bar if needed, or rely on the sum of stacked bars */}
            {/* <Bar dataKey="total" fill="#8884d8" name="Total" /> */}
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default AdminDashboard;
