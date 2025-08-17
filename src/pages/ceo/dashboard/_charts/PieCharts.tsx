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
import React from "react";

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
        <p className="font-medium text-blue-300">{payload[0].name}</p>
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

const getPieRadii = () => {
  if (typeof window !== 'undefined') {
    if (window.innerWidth < 640) return { outer: 70, inner: 25, cx: '50%' };
    if (window.innerWidth < 1024) return { outer: 110, inner: 35, cx: '50%' };
  }
  return { outer: 80, inner: 30, cx: '50%' };
};

// Custom Legend content to wrap text and add left padding
const CustomLegend = (props: any) => {
  const { payload } = props;
  // Always remove left padding for closer alignment
  return (
    <ul className="pl-0 ml-[-8px]">
      {payload.map((entry: any, index: number) => (
        <li
          key={`item-${index}`}
          className="text-xs sm:text-sm md:text-base break-words whitespace-normal mb-1 flex items-start"
          style={{ wordBreak: 'break-word', maxWidth: window.innerWidth < 640 ? 110 : 'none' }}
        >
          <span
            className="inline-block w-2 h-2 sm:w-3 sm:h-3 aspect-square rounded-full mr-2 mt-[2px]"
            style={{ backgroundColor: entry.color }}
          ></span>
          {entry.value}
        </li>
      ))}
    </ul>
  );
};

const PieCharts = () => {
  const [yearData, setYearData] = useState<ExpenseCategory[]>([]);
  const [monthData, setMonthData] = useState<ExpenseCategory[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [yearTotal, setYearTotal] = useState<number>(0);
  const [monthTotal, setMonthTotal] = useState<number>(0);
  const [pieRadii, setPieRadii] = useState(getPieRadii());

  useEffect(() => {
    const handleResize = () => setPieRadii(getPieRadii());
    window.addEventListener('resize', handleResize);
    handleResize();
    return () => window.removeEventListener('resize', handleResize);
  }, []);

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
          let processedYearData = yearCategories
            .map((item) => ({
              ...item,
              percent: item.value / yearSum,
            }))
            .sort((a, b) => b.value - a.value); // Sort by value descending

          let processedMonthData = monthCategories
            .map((item) => ({
              ...item,
              percent: item.value / monthSum,
            }))
            .sort((a, b) => b.value - a.value); // Sort by value descending

          // Top 5 + 'Others' logic for year
          if (processedYearData.length > 5) {
            const top5 = processedYearData.slice(0, 5);
            const others = processedYearData.slice(5);
            const othersValue = others.reduce((sum, item) => sum + item.value, 0);
            const othersPercent = others.reduce((sum, item) => sum + (item.percent || 0), 0);
            top5.push({ name: 'Others', value: othersValue, percent: othersPercent });
            processedYearData = top5;
          }
          // Top 5 + 'Others' logic for month
          if (processedMonthData.length > 5) {
            const top5 = processedMonthData.slice(0, 5);
            const others = processedMonthData.slice(5);
            const othersValue = others.reduce((sum, item) => sum + item.value, 0);
            const othersPercent = others.reduce((sum, item) => sum + (item.percent || 0), 0);
            top5.push({ name: 'Others', value: othersValue, percent: othersPercent });
            processedMonthData = top5;
          }

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
    const radius = innerRadius + (outerRadius - innerRadius) * 0.6;
    const x = cx + radius * Math.cos(-midAngle * RADIAN);
    const y = cy + radius * Math.sin(-midAngle * RADIAN);

    // Only show label for segments that are large enough (more than 5%)
    return percent > 0.04 ? (
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
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-4  lg:gap-8 p-2 sm:p-4 lg:p-6">
      {/* Yearly Expenses Card */}
      <div className="bg-white rounded-xl shadow-lg overflow-hidden">
        <div className="bg-blue-50 p-2 mb-4 sm:p-4 border-b border-blue-100">
          <h2 className="text-base sm:text-lg md:text-xl font-bold text-neutral-800 text-center">
            Annual Expense Distribution
          </h2>
          <p className="text-center text-blue-600 font-medium mt-1 text-xs sm:text-sm md:text-base">
            Total: ₦ {yearTotal.toLocaleString()}
          </p>
        </div>

        <div className="p-1 sm:p-4 bg-[#f5f7fa]">
          <ResponsiveContainer width="100%" height={240} className="sm:h-[300px] md:h-[350px] lg:h-[400px]">
            <PieChart>
              <Pie
                data={yearData}
                dataKey="value"
                nameKey="name"
                cx="38%"
                cy="50%"
                outerRadius={pieRadii.outer}
                innerRadius={pieRadii.inner}
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
              <Legend content={<CustomLegend />} layout="vertical" verticalAlign="middle" align="right" />
            </PieChart>
          </ResponsiveContainer>

          {/* Top categories summary */}
          <div className="mt-2 sm:mt-4 border-t border-gray-100 pt-2 sm:pt-4">
            <h3 className="font-medium text-gray-700 mb-1 sm:mb-2 text-xs sm:text-sm md:text-base">
              Top Expense Categories
            </h3>
            <div className="space-y-1 sm:space-y-2">
              {yearData.slice(0, 3).map((category, index) => (
                <div key={index} className="flex justify-between items-center">
                  <div className="flex items-center">
                    <div
                      className="w-2 h-2 sm:w-3 sm:h-3 rounded-full mr-2"
                      style={{ backgroundColor: COLORS[index % COLORS.length] }}
                    ></div>
                    <span className="text-neutral-800 text-xs sm:text-sm md:text-base">{category.name}</span>
                  </div>
                  <span className="font-medium text-xs sm:text-sm md:text-base">
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
        <div className="bg-blue-50 p-2 sm:p-4 border-b border-blue-100">
          <h2 className="text-base sm:text-lg md:text-xl font-bold text-neutral-800 text-center">
            Monthly Expense Distribution
          </h2>
          <p className="text-center text-neutral-600 font-medium mt-1 text-xs sm:text-sm md:text-base">
            Total: ₦ {monthTotal.toLocaleString()}
          </p>
        </div>

        <div className="p-1 sm:p-4 bg-[#f5f7fa] h-full">
          <ResponsiveContainer width="100%" height={240} className="sm:h-[300px] md:h-[350px] lg:h-[400px]">
            <PieChart>
              <Pie
                data={monthData}
                dataKey="value"
                nameKey="name"
                cx="38%"
                cy="50%"
                outerRadius={pieRadii.outer}
                innerRadius={pieRadii.inner}
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
              <Legend content={<CustomLegend />} layout="vertical" verticalAlign="middle" align="right" />
            </PieChart>
          </ResponsiveContainer>

          {/* Top categories summary */}
          <div className="mt-2 sm:mt-4 border-t border-gray-100 pt-2 sm:pt-4">
            <h3 className="font-medium text-gray-700 mb-1 sm:mb-2 text-xs sm:text-sm md:text-base">
              Top Expense Categories
            </h3>
            <div className="space-y-1 sm:space-y-2">
              {monthData.slice(0, 3).map((category, index) => (
                <div key={index} className="flex justify-between items-center">
                  <div className="flex items-center">
                    <div
                      className="w-2 h-2 sm:w-3 sm:h-3 rounded-full mr-2"
                      style={{ backgroundColor: COLORS[index % COLORS.length] }}
                    ></div>
                    <span className="text-neutral-800 text-xs sm:text-sm md:text-base">{category.name}</span>
                  </div>
                  <span className="font-medium text-xs sm:text-sm md:text-base">
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
