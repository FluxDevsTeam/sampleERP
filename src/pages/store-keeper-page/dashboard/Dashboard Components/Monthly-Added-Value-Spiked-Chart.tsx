import { useState } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
} from "recharts";
import dashboardDataJson from "@/data/store-keeper-page/dashboard/storekeeper-dashboard.json";

const colors = [
  "#0088FE",
  "#00C49F",
  "#FFBB28",
  "#FF8042",
  "red",
  "pink",
  "brown",
  "cyan",
  "green",
  "indigo",
  "violet",
];

// Format number with naira sign and commas
const formatNaira = (value: number) => `₦${value.toLocaleString()}`;

// Format number with naira sign and compact notation (k/m)
const formatNairaCompact = (value: number) => {
  if (value >= 1_000_000) {
    return `₦${(value / 1_000_000).toFixed(1).replace(/\.0$/, '')}m`;
  } else if (value >= 1_000) {
    return `₦${(value / 1_000).toFixed(1).replace(/\.0$/, '')}k`;
  }
  return `₦${value.toLocaleString()}`;
};

const MonthlyAddedValueSpikedChart = () => {
  const data = dashboardDataJson.removedAmountMonthly.map((item) => ({
    month: item.month,
    value: item.total,
  }));

  const getPath = (x: number, y: number, width: number, height: number) => {
    return `M${x},${y + height}C${x + width / 3},${y + height} ${x + width / 2},${y + height / 3}
    ${x + width / 2}, ${y}
    C${x + width / 2},${y + height / 3} ${x + (2 * width) / 3},${y + height} ${x + width}, ${y + height}
    Z`;
  };

  interface TriangleBarProps {
    fill?: string;
    x?: number;
    y?: number;
    width?: number;
    height?: number;
  }

  const TriangleBar = (props: TriangleBarProps) => {
    const { fill, x = 0, y = 0, width = 0, height = 0 } = props;
    return <path d={getPath(x, y, width, height)} stroke="none" fill={fill} />;
  };

  // Custom label for bars using compact notation
  const BarValueLabel = (props: any) => {
    const { x, y, width, value } = props;
    return (
      <text x={x + width / 2} y={y - 8} fill="#222" textAnchor="middle" fontSize={13} fontWeight="bold">
        {formatNairaCompact(value)}
      </text>
    );
  };

  return (
    <div>
      <h1 className="ml-5" style={{ fontSize: "clamp(12px, 2vw, 16px)" }}>
        Removed Amount Monthly
      </h1>
      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={data} margin={{ left: 0, right: 14, top: 10, bottom: 9 }}>
          <defs>
            <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
              <stop offset="10%" stopColor="gray" stopOpacity={1} />
              <stop offset="90%" stopColor="blue" stopOpacity={0.2} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="month" />
          <YAxis tickFormatter={formatNairaCompact} width={64} />
          <Tooltip formatter={(value: number) => formatNairaCompact(value)} />
          <Bar dataKey="value" stroke="#0178a3" fillOpacity={1} fill="url(#colorValue)" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default MonthlyAddedValueSpikedChart;