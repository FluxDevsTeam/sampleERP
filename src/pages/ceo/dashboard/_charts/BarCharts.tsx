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
interface IncomeExpenseData {
  month: string;
  total: number;
}

interface MonthlyTrendsData {
  income: IncomeExpenseData[];
  expenses: IncomeExpenseData[];
}

// Define interface for the API response
interface ApiResponse {
  monthly_trends: MonthlyTrendsData;
}

// Define custom tooltip prop types
interface CustomTooltipProps {
  active?: boolean;
  payload?: any[];
  label?: string;
}

const MonthlyTrendsCharts = () => {
  const [data, setData] = useState<MonthlyTrendsData | null>(null);
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
        setData(result.monthly_trends);
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

  if (error && !data) {
    return <div className="text-red-600 p-8">Error: {error}</div>;
  }

  if (!data) return <div className="text-red-600 p-8">No data available</div>;

  // Prepare grouped data for recharts
  const months = data.income.map((item) => item.month);
  const groupedData = months.map((month, idx) => ({
    month,
    income: data.income[idx]?.total || 0,
    expenses: data.expenses[idx]?.total || 0,
  }));

  return (
    <div className="w-full px-4">
      <div className="flex flex-col w-full">
        <div className="flex-1 bg-gradient-to-br from-[#e0f2ff] to-[#f5f7fa] rounded-2xl shadow-2xl p-8 border border-blue-100 relative overflow-hidden">
          <h2 className="text-2xl font-bold mb-6 text-blue-700 text-center tracking-wide z-10">Monthly Income & Expenses</h2>
          <ResponsiveContainer width="100%" height={440}>
            <BarChart
              data={groupedData}
              margin={{ top: 30, right: 40, left: 40, bottom: 80 }}
              barCategoryGap={24}
              barGap={0}
            >
              <CartesianGrid strokeDasharray="6 6" stroke="#e0e7ef" />
              <XAxis
                dataKey="month"
                angle={-30}
                textAnchor="end"
                height={90}
                tick={{ fontSize: 16, fontWeight: 600, fill: '#374151' }}
                axisLine={{ stroke: '#b3c2d1', strokeWidth: 2 }}
              />
              <YAxis
                tickFormatter={(value) => `₦${value.toLocaleString()}`}
                tick={{ fontSize: 16, fontWeight: 600, fill: '#374151' }}
                axisLine={{ stroke: '#b3c2d1', strokeWidth: 2 }}
                width={90}
              />
              <Tooltip
                wrapperStyle={{ borderRadius: 14, boxShadow: '0 4px 16px rgba(0,0,0,0.10)' }}
                cursor={{ fill: '#e0f2fe', opacity: 0.2 }}
                formatter={(value: number, name: string) => [`₦${value.toLocaleString()}`, name === 'income' ? 'Income' : 'Expenses']}
              />
              <Legend
                iconType="circle"
                wrapperStyle={{ fontSize: 16, fontWeight: 700, color: '#2563eb', paddingBottom: 12 }}
              />
              <Bar dataKey="income" name="Income" fill="url(#incomeGradient)" barSize={40} radius={0} isAnimationActive={true} />
              <Bar dataKey="expenses" name="Expenses" fill="url(#expensesGradient)" barSize={40} radius={0} isAnimationActive={true} />
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
