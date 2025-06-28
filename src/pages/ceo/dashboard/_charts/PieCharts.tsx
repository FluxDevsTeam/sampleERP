import { useState, useEffect } from "react";
import axios from "axios";
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

// Define interfaces for the data structure
interface ExpenseCategory {
  name: string;
  value: number;
  percent?: number;
}

interface DashboardData {
  categorical_data_year?: {
    expense_categories: ExpenseCategory[];
  };
  categorical_data_month?: {
    expense_categories: ExpenseCategory[];
  };
}

interface CustomTooltipProps {
  active?: boolean;
  payload?: Array<{
    name: string;
    value: number;
    payload: {
      percent: number;
    };
  }>;
}

interface CustomLabelProps {
  cx: number;
  cy: number;
  midAngle: number;
  innerRadius: number;
  outerRadius: number;
  percent: number;
  name: string;
}

// Enhanced color palette with better contrast
const COLORS = [
  "#2563EB",
  "#10B981",
  "#F59E0B",
  "#EF4444",
  "#8B5CF6",
  "#EC4899",
];

// Custom tooltip component for better presentation
const CustomTooltip = ({ active, payload }: CustomTooltipProps) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white p-4 rounded-lg shadow-md border border-gray-100">
        <p className="font-medium text-gray-900">{payload[0].name}</p>
        <p className="text-lg font-bold text-blue-600">
          ₦{payload[0].value.toLocaleString()}
        </p>
        <p className="text-sm text-gray-500">
          {(payload[0].payload.percent * 100).toFixed(1)}% of total
        </p>
      </div>
    );
  }
  return null;
};

// Format large numbers to be more readable
const formatValue = (value: number): string => {
  if (value >= 1000000) {
    return `₦ ${(value / 1000000).toFixed(1)}M`;
  } else if (value >= 1000) {
    return `₦ ${(value / 1000).toFixed(1)}K`;
  }
  return `₦ ${value}`;
};

const PieCharts = () => {
  const [yearData, setYearData] = useState<ExpenseCategory[]>([]);
  const [monthData, setMonthData] = useState<ExpenseCategory[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [yearTotal, setYearTotal] = useState<number>(0);
  const [monthTotal, setMonthTotal] = useState<number>(0);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const accessToken = localStorage.getItem("accessToken");

        if (!accessToken) {
          throw new Error("Please login to access this data");
        }
        const response = await axios.get<DashboardData>(
          "https://backend.kidsdesigncompany.com/api/ceo-dashboard/",
          {
            headers: {
              Authorization: `JWT ${accessToken}`,
              "Content-Type": "application/json",
            },
          }
        );
        const data = response.data;

        if (
          data?.categorical_data_year?.expense_categories &&
          data?.categorical_data_month?.expense_categories
        ) {
          // Process data to calculate percentages and totals
          const yearCategories = data.categorical_data_year.expense_categories;
          const monthCategories =
            data.categorical_data_month.expense_categories;

          const yearSum = yearCategories.reduce(
            (sum, item) => sum + item.value,
            0
          );
          const monthSum = monthCategories.reduce(
            (sum, item) => sum + item.value,
            0
          );

          // Add percentage to each item
          const processedYearData = yearCategories
            .map((item) => ({
              ...item,
              percent: item.value / yearSum,
            }))
            .sort((a, b) => b.value - a.value); // Sort by value descending

          const processedMonthData = monthCategories
            .map((item) => ({
              ...item,
              percent: item.value / monthSum,
            }))
            .sort((a, b) => b.value - a.value); // Sort by value descending

          setYearData(processedYearData);
          setMonthData(processedMonthData);
          setYearTotal(yearSum);
          setMonthTotal(monthSum);
        }
      } catch (error) {
        console.error("Error fetching data:", error);
        setError("Failed to load expense data. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Custom label rendering
  const renderCustomizedLabel = ({
    cx,
    cy,
    midAngle,
    innerRadius,
    outerRadius,
    percent,
  }: CustomLabelProps) => {
    const RADIAN = Math.PI / 180;
    const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
    const x = cx + radius * Math.cos(-midAngle * RADIAN);
    const y = cy + radius * Math.sin(-midAngle * RADIAN);

    // Only show label for segments that are large enough (more than 5%)
    return percent > 0.05 ? (
      <text
        x={x}
        y={y}
        fill="white"
        textAnchor="middle"
        dominantBaseline="central"
        fontWeight="bold"
      >
        {(percent * 100).toFixed(0)}%
      </text>
    ) : null;
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-pulse text-blue-600">
          Loading expense data...
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 p-4 rounded-lg text-red-600 text-center">
        {error}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 p-6">
      {/* Yearly Expenses Card */}
      <div className="bg-white rounded-xl shadow-lg overflow-hidden">
        <div className="bg-blue-50 p-4 border-b border-blue-100">
          <h2 className="text-xl font-bold text-neutral-800 text-center">
            Annual Expense Distribution
          </h2>
          <p className="text-center text-blue-600 font-medium mt-1">
            Total: ₦ {yearTotal.toLocaleString()}
          </p>
        </div>

        <div className="p-4 bg-[#f5f7fa]">
          <ResponsiveContainer width="100%" height={400}>
            <PieChart>
              <Pie
                data={yearData}
                dataKey="value"
                nameKey="name"
                cx="50%"
                cy="50%"
                outerRadius={120}
                innerRadius={60}
                labelLine={false}
                label={renderCustomizedLabel}
              >
                {yearData.map((entry, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={COLORS[index % COLORS.length]}
                  />
                ))}
              </Pie>
              <Tooltip content={<CustomTooltip />} />
              <Legend layout="vertical" verticalAlign="middle" align="right" />
            </PieChart>
          </ResponsiveContainer>

          {/* Top categories summary */}
          <div className="mt-4 border-t border-gray-100 pt-4">
            <h3 className="font-medium text-gray-700 mb-2">
              Top Expense Categories
            </h3>
            <div className="space-y-2">
              {yearData.slice(0, 3).map((category, index) => (
                <div key={index} className="flex justify-between items-center">
                  <div className="flex items-center">
                    <div
                      className="w-3 h-3 rounded-full mr-2"
                      style={{ backgroundColor: COLORS[index % COLORS.length] }}
                    ></div>
                    <span className="text-neutral-800">{category.name}</span>
                  </div>
                  <span className="font-medium">
                    {formatValue(category.value)}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Monthly Expenses Card */}
      <div className="bg-white rounded-xl shadow-lg overflow-hidden">
        <div className="bg-blue-50 p-4 border-b border-blue-100">
          <h2 className="text-xl font-bold text-neutral-800 text-center">
            Monthly Expense Distribution
          </h2>
          <p className="text-center text-neutral-600 font-medium mt-1">
            Total: ₦ {monthTotal.toLocaleString()}
          </p>
        </div>

        <div className="p-4 bg-[#f5f7fa] h-full">
          <ResponsiveContainer width="100%" height={400}>
            <PieChart>
              <Pie
                data={monthData}
                dataKey="value"
                nameKey="name"
                cx="50%"
                cy="50%"
                outerRadius={120}
                innerRadius={60}
                labelLine={false}
                label={renderCustomizedLabel}
              >
                {monthData.map((entry, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={COLORS[index % COLORS.length]}
                  />
                ))}
              </Pie>
              <Tooltip content={<CustomTooltip />} />
              <Legend layout="vertical" verticalAlign="middle" align="right" />
            </PieChart>
          </ResponsiveContainer>

          {/* Top categories summary */}
          <div className="mt-4 border-t border-gray-100 pt-4">
            <h3 className="font-medium text-gray-700 mb-2">
              Top Expense Categories
            </h3>
            <div className="space-y-2">
              {monthData.slice(0, 3).map((category, index) => (
                <div key={index} className="flex justify-between items-center">
                  <div className="flex items-center">
                    <div
                      className="w-3 h-3 rounded-full mr-2"
                      style={{ backgroundColor: COLORS[index % COLORS.length] }}
                    ></div>
                    <span className="text-neutral-800">{category.name}</span>
                  </div>
                  <span className="font-medium">
                    {formatValue(category.value)}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PieCharts;
