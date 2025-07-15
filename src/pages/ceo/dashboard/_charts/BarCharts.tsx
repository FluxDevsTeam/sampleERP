import { useState, useEffect } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

// Define interfaces for the data structure
interface IncomeData { month: string; total_income: number; }
interface ExpenseData { month: string; total_expenses: number; }
interface ApiResponse {
  monthly_income_trend: IncomeData[];
  monthly_expense_trend: ExpenseData[];
}

// Define custom tooltip prop types
interface CustomTooltipProps {
  active?: boolean;
  payload?: any[];
  label?: string;
}

const MonthlyTrendsCharts = () => {
  const [incomeData, setIncomeData] = useState<IncomeData[]>([]);
  const [expenseData, setExpenseData] = useState<ExpenseData[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const accessToken = localStorage.getItem("accessToken");

        if (!accessToken) {
          throw new Error("Please login to access this data");
        }

        const response = await fetch(
          "https://backend.kidsdesigncompany.com/api/ceo-dashboard/",
          {
            headers: {
              Authorization: `JWT ${accessToken}`,
              "Content-Type": "application/json",
            },
          }
        );
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        const result: ApiResponse = await response.json();
        setIncomeData(result.monthly_income_trend || []);
        setExpenseData(result.monthly_expense_trend || []);
        setLoading(false);
      } catch (err) {
        setError("Failed to fetch data");
        setLoading(false);
        // Use sample data if fetch fails
      }
    };

    fetchData();
  }, []);

  // Format large numbers with commas
  const formatCurrency = (value: number): string => {
    return `$${value.toLocaleString()}`;
  };

  // Custom tooltip to display formatted values
  const CustomTooltip = ({ active, payload, label }: CustomTooltipProps) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-4 border border-gray-200 shadow-md rounded">
          <p className="font-bold">{label}</p>
          <p className="text-green-600">{`Income: ${formatCurrency(
            payload[0].value
          )}`}</p>
        </div>
      );
    }
    return null;
  };

  const CustomExpensesTooltip = ({
    active,
    payload,
    label,
  }: CustomTooltipProps) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-4 border border-gray-200 shadow-md rounded">
          <p className="font-bold">{label}</p>
          <p className="text-red-600">{`Expenses: ${formatCurrency(
            payload[0].value
          )}`}</p>
        </div>
      );
    }
    return null;
  };

  if (loading) {
    return <div className="text-center p-8">Loading dashboard data...</div>;
  }

  if (error && incomeData.length === 0 && expenseData.length === 0) {
    return <div className="text-red-600 p-8">Error: {error}</div>;
  }

  if (incomeData.length === 0 && expenseData.length === 0) return <div className="text-red-600 p-8">No data available</div>;

  // Prepare grouped data for recharts
  const months = incomeData.map((item) => item.month);
  const groupedData = months.map((month, idx) => ({
    month,
    income: incomeData[idx]?.total_income || 0,
    expenses: expenseData[idx]?.total_expenses || 0,
  }));

  return (
    <div className="w-full px-2 sm:px-4">
      <div className="flex flex-col w-full">
        <div className="flex-1 bg-gradient-to-br from-[#e0f2ff] to-[#f5f7fa] rounded-lg shadow-2xl p-0 border border-blue-100 relative overflow-hidden">
          <ResponsiveContainer width="100%" height={300} className="sm:h-[350px] lg:h-[440px]">
            <BarChart
              data={groupedData}
              margin={{ top: 16, right: 16, left: 0, bottom: 16 }}
              barCategoryGap={24}
              barGap={0}
            >
              <CartesianGrid strokeDasharray="6 6" stroke="#e0e7ef" />
              <XAxis
                dataKey="month"
                angle={-30}
                textAnchor="end"
                height={90}
                tick={{ fontSize: 12, fontWeight: 600, fill: '#374151' }}
                axisLine={{ stroke: '#b3c2d1', strokeWidth: 2 }}
              />
              <YAxis
                tickFormatter={(value) => `₦${value.toLocaleString()}`}
                tick={{ fontSize: 12, fontWeight: 600, fill: '#374151' }}
                axisLine={{ stroke: '#b3c2d1', strokeWidth: 2 }}
                width={70}
              />
              <Tooltip
                wrapperStyle={{ borderRadius: 14, boxShadow: '0 4px 16px rgba(0,0,0,0.10)' }}
                cursor={{ fill: '#e0f2fe', opacity: 0.2 }}
                formatter={(value: number, name: string) => [`₦${value.toLocaleString()}`, name === 'income' ? 'Income' : 'Expenses']}
              />
              <Legend
                iconType="circle"
                wrapperStyle={{ fontSize: 14, fontWeight: 700, color: '#2563eb', paddingBottom: 12 }}
              />
              <Bar dataKey="income" name="Income" fill="url(#incomeGradient)" barSize={30} radius={0} isAnimationActive={true} />
              <Bar dataKey="expenses" name="Expenses" fill="url(#expensesGradient)" barSize={30} radius={0} isAnimationActive={true} />
              <defs>
                <linearGradient id="incomeGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#2563eb" stopOpacity={0.95} />
                  <stop offset="100%" stopColor="#60a5fa" stopOpacity={0.7} />
                </linearGradient>
                <linearGradient id="expensesGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#F44336" stopOpacity={0.95} />
                  <stop offset="100%" stopColor="#fca5a5" stopOpacity={0.7} />
                </linearGradient>
              </defs>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};

export default MonthlyTrendsCharts;
