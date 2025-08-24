import { useState, useEffect } from "react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import ceoDashboardDataInitial from "@/data/ceo/dashboard/ceo-dashboard.json"; // Import static JSON

// Define interfaces for the data structure
interface DashboardData {
  monthly_income_trend?: { month: string; total_income: number }[];
  monthly_expense_trend?: { month: string; total_expenses: number }[];
  monthly_profit_trend?: { month: string; profit: number }[];
}

const AreaChartComponent = () => {
  const [incomeData, setIncomeData] = useState<{ month: string; total_income: number }[]>([]);
  const [expenseData, setExpenseData] = useState<{ month: string; total_expenses: number }[]>([]);
  const [profitData, setProfitData] = useState<{ month: string; profit: number }[]>([]);

  useEffect(() => {
    const fetchData = () => {
      try {
        // Load from local storage if available, else use initial JSON
        const storedData = localStorage.getItem("ceoDashboardData");
        const data: DashboardData = storedData ? JSON.parse(storedData) : ceoDashboardDataInitial;

        if (data?.monthly_income_trend) {
          setIncomeData(data.monthly_income_trend);
        }
        if (data?.monthly_expense_trend) {
          setExpenseData(data.monthly_expense_trend);
        }
        if (data?.monthly_profit_trend) {
          setProfitData(data.monthly_profit_trend);
        }
      } catch (error) {
        console.error("Error loading data:", error);
      }
    };

    fetchData();
  }, []);

  // Compact Naira formatting
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

  const renderChart = ({ data, title, color, id, dataKey }: { data: any[]; title: string; color: string; id: string; dataKey: string }) => (
    <div
      className="backdrop-blur-md bg-white/60 border border-blue-200 rounded-3xl shadow-2xl p-0 relative overflow-hidden w-full"
      style={{ boxShadow: '0 8px 32px 0 rgba(31, 38, 135, 0.18)', marginBottom: 8 }}
    >
      <div className="absolute inset-0 pointer-events-none" style={{background: 'linear-gradient(135deg, rgba(59,130,246,0.10) 0%, rgba(168,85,247,0.10) 100%)'}}></div>
      <h3 className="text-xl sm:text-2xl lg:text-3xl font-extrabold mb-4 sm:mb-6 ml-2 mt-2 lg:mb-8 text-blue-700 text-center tracking-wide relative z-10">{title}</h3>
      <div style={{ height: "280px" }} className="relative z-10 sm:h-[320px] lg:h-[380px]">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart
            data={data}
            margin={{ top: 16, right: 24, left: 0, bottom: 0 }}
          >
            <defs>
              <linearGradient id={id} x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor={color} stopOpacity={0.9} />
                <stop offset="60%" stopColor={color} stopOpacity={0.5} />
                <stop offset="95%" stopColor={color} stopOpacity={0.1} />
              </linearGradient>
            </defs>
            <XAxis
              dataKey="month"
              tick={{ fontSize: 11, fontWeight: 500, fill: '#3730a3' }}
              angle={-30}
              dy={10}
              height={60}
              axisLine={{ stroke: '#6366f1', strokeWidth: 2 }}
            />
            <YAxis
              tick={{ fontSize: 11, fontWeight: 500, fill: '#3730a3' }}
              tickFormatter={formatNairaCompact}
              axisLine={{ stroke: '#6366f1', strokeWidth: 2 }}
              width={60}
            />
            <CartesianGrid strokeDasharray="6 6" stroke="#e0e7ef" />
            <Tooltip
              formatter={(value: number) => [formatNairaCompact(value), title.replace("Monthly ", "")]}
              contentStyle={{
                background: 'rgba(255,255,255,0.95)',
                border: 'none',
                borderRadius: '16px',
                boxShadow: '0 8px 32px 0 rgba(59,130,246,0.10)',
                padding: '18px',
                fontSize: 18,
                color: '#3730a3',
                fontWeight: 700,
              }}
            />
            <Area
              type="monotone"
              dataKey={dataKey}
              stroke={color}
              strokeWidth={2}
              fillOpacity={1}
              fill={`url(#${id})`}
              activeDot={{ r: 8, fill: color, stroke: '#fff', strokeWidth: 3 }}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );

  return (
    <div
      className="flex flex-col gap-6 sm:gap-8 sm:p-6 lg:p-8 w-full"
      style={{ padding: '15px' }}
    >
      <div className="flex flex-col lg:flex-row gap-6 w-full">
        <div className="flex-1">
          {renderChart({
            data: incomeData,
            title: "Monthly Income Trend",
            color: "#10B981",
            id: "incomeGradient",
            dataKey: "total_income",
          })}
        </div>
        <div className="flex-1">
          {renderChart({
            data: expenseData,
            title: "Monthly Expense Trend",
            color: "#F59E0B",
            id: "expenseGradient",
            dataKey: "total_expenses",
          })}
        </div>
      </div>
      <div className="w-full">
        {renderChart({
          data: profitData,
          title: "Monthly Profit Trend",
          color: "#6366f1",
          id: "profitGradient",
          dataKey: "profit",
        })}
      </div>
    </div>
  );
};

export default AreaChartComponent;