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
      style={{
        backgroundColor: "#f5f7fa",
        borderRadius: "12px",
        boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)",
        padding: "25px",
        width: "100%",
        marginBottom: "30px",
        transition: "transform 0.3s ease",
      }}
    >
      <h3
        style={{
          fontSize: "1.25rem",
          fontWeight: "600",
          marginBottom: "20px",
          color: "#2c3e50",
          textAlign: "center",
        }}
      >
        {title}
      </h3>
      <div style={{ height: "300px" }}>
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart
            data={data}
            margin={{ top: 10, right: 30, left: 20, bottom: 30 }}
          >
            <defs>
              <linearGradient id={id} x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor={color} stopOpacity={0.8} />
                <stop offset="95%" stopColor={color} stopOpacity={0} />
              </linearGradient>
            </defs>
            <XAxis
              dataKey="month"
              tick={{ fontSize: "12px" }}
              angle={-30}
              dy={10} // Adjusts vertical position of labels
              height={50} // Gives more space for angled labels
            />
            <YAxis
              tick={{ fontSize: "10px" }}
              tickFormatter={(value: number) => `NGN${value}`}
            />
            <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
            <Tooltip
              formatter={(value: number) => [
                `$${value}`,
                title.replace("Monthly ", ""),
              ]}
              contentStyle={{
                backgroundColor: "#f5f7fa",
                border: "none",
                borderRadius: "8px",
                boxShadow: "0 2px 10px rgba(0, 0, 0, 0.1)",
                padding: "12px",
              }}
            />
            <Area
              type="monotone"
              dataKey="total"
              stroke={color}
              strokeWidth={2}
              fillOpacity={1}
              fill={`url(#${id})`}
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
        padding: "30px",
        width: "100%",
      }}
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
