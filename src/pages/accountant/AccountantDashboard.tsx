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
import Header from "../admin/dashboard/_components/Header";
import SkeletonLoader from "../admin/dashboard/_components/SkeletonLoader";
import AdminDashboardCard from "../admin/dashboard/AdminDashboardCard";
import React from "react";
import GlobalLayout from "../../components/GlobalLayout";
import { getSidebarForRole } from "../../utils/data-json";

const fetchFinancialData = async () => {
  const accessToken = localStorage.getItem("accessToken");
  const { data } = await axios.get(
    "https://backend.kidsdesigncompany.com/api/accountant-dashboard/",
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
    'sales_count',
  ];
  if (excluded.includes(key.toLowerCase())) return false;
  return /amount|income|profit|paid|value|expenses|cost|sales|pay|assets|shop/i.test(key);
};

const AccountantDashboard = () => {
  const { data, isLoading, error } = useQuery({
    queryKey: ["financialData"],
    queryFn: fetchFinancialData,
  });
  const role = typeof window !== 'undefined' ? localStorage.getItem('user_role') : null;
  const sidebar = getSidebarForRole(role);

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
    ? Object.entries(data.workers)
        .filter(([key]) => !['contractors_count', 'salary_workers_count', 'all_contractors_count'].includes(key))
        .map(([key, value]) => ({
        key: `workers-${key}`,
        title: key.replace(/_/g, " "),
        value: Number(value) || 0,
        currency: isMonetary(key) ? "₦ " : undefined,
      }))
    : [];
  const paidCards = data?.paid
    ? Object.entries(data.paid)
        .filter(([key]) => !['weekly_total_paid'].includes(key))
        .map(([key, value]) => ({
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
  ].sort((a, b) => {
    // Priority items that should appear first
    const priorityItems = [
      'yearly total paid',
      'active salary workers count',
      'all active contractors count',
      'salary',
      'active',
      'contractors'
    ];
    
    const aTitle = a.title.toLowerCase();
    const bTitle = b.title.toLowerCase();
    
    const aIsPriority = priorityItems.some(item => aTitle.includes(item));
    const bIsPriority = priorityItems.some(item => bTitle.includes(item));
    
    // Special case: yearly total paid should come before total expenses
    if (aTitle.includes('yearly total paid') && bTitle.includes('total expenses')) return -1;
    if (bTitle.includes('yearly total paid') && aTitle.includes('total expenses')) return 1;
    
    if (aIsPriority && !bIsPriority) return -1;
    if (!aIsPriority && bIsPriority) return 1;
    return 0;
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
  const monthlyExpenseTrend = data?.monthly_expense_trend || [];
  const topCategories = data?.top_categories || [];

  const colors = ["#8884d8", "#82ca9d", "#ffc658", "#ff7300", "#ff0000"];

  return (
    <GlobalLayout data={sidebar}>
      <div className="p-6 space-y-6">
        {/* <Header /> */}

        {/* Card grid for all data */}
        <div className="mb-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-5 p-2">
            {visibleCards.map(card => (
              <AdminDashboardCard key={card.key} title={card.title} value={card.value} currency={card.currency} />
            ))}
          </div>
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
          {/* Monthly Expense Trend */}
          <div>
            <h2 className="text-xl font-semibold mb-4">
              Monthly Expense Trend
            </h2>
            <ResponsiveContainer width="100%" height={350}>
              <LineChart data={monthlyExpenseTrend} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line type="monotone" dataKey="amount" stroke="#8884d8" activeDot={{ r: 8 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Top Categories Bar Chart */}
        <div>
          <h2 className="text-xl font-semibold mb-4">Top Categories</h2>
          <ResponsiveContainer width="100%" height={350}>
            <BarChart data={topCategories} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="category" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="amount" fill="#82ca9d" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </GlobalLayout>
  );
};

export default AccountantDashboard; 