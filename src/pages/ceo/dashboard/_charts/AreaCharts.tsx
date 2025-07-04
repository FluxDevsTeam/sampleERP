import { useState, useEffect } from "react";
import axios from "axios";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

// Define interfaces for the data structure
interface ProfitData {
  month: string;
  total: number;
}

interface DashboardData {
  monthly_trends?: {
    profit: ProfitData[];
  };
}

interface ChartProps {
  data: ProfitData[];
  title: string;
  color: string;
  id: string;
}

const AreaChartComponent = () => {
  const [profitData, setProfitData] = useState<ProfitData[]>([]);

  useEffect(() => {
    const fetchData = async () => {
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

        if (data?.monthly_trends) {
          setProfitData(data.monthly_trends.profit);
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, []);

  const renderChart = ({ data, title, color, id }: ChartProps) => (
    <div
      className="backdrop-blur-md bg-white/60 border border-blue-200 rounded-3xl shadow-2xl p-4 sm:p-6 lg:p-10 relative overflow-hidden w-full"
      style={{ boxShadow: '0 8px 32px 0 rgba(31, 38, 135, 0.18)', marginBottom: 20 }}
    >
      <div className="absolute inset-0 pointer-events-none" style={{background: 'linear-gradient(135deg, rgba(59,130,246,0.10) 0%, rgba(168,85,247,0.10) 100%)'}}></div>
      <h3 className="text-xl sm:text-2xl lg:text-3xl font-extrabold mb-4 sm:mb-6 lg:mb-8 text-blue-700 text-center tracking-wide relative z-10">{title}</h3>
      <div style={{ height: "280px" }} className="relative z-10 sm:h-[320px] lg:h-[380px]">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart
            data={data}
            margin={{ top: 20, right: 40, left: 40, bottom: 40 }}
          >
            <defs>
              <linearGradient id={id} x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#6366f1" stopOpacity={0.9} />
                <stop offset="60%" stopColor="#818cf8" stopOpacity={0.5} />
                <stop offset="95%" stopColor="#a5b4fc" stopOpacity={0.1} />
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
              tickFormatter={(value: number) => `₦${value.toLocaleString()}`}
              axisLine={{ stroke: '#6366f1', strokeWidth: 2 }}
              width={80}
            />
            <CartesianGrid strokeDasharray="6 6" stroke="#e0e7ef" />
            <Tooltip
              formatter={(value: number) => [`₦${value.toLocaleString()}`, title.replace("Monthly ", "")]}
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
              dataKey="total"
              stroke="#6366f1"
              strokeWidth={4}
              fillOpacity={1}
              fill={`url(#${id})`}
              activeDot={{ r: 8, fill: '#6366f1', stroke: '#fff', strokeWidth: 3 }}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: "20px",
        padding: "15px",
        width: "100%",
      }}
      className="sm:gap-6 sm:p-6 lg:p-8"
    >
      {renderChart({
        data: profitData,
        title: "Monthly Profit Trend",
        color: "#0088FE",
        id: "profitGradient",
      })}
    </div>
  );
};

export default AreaChartComponent;
