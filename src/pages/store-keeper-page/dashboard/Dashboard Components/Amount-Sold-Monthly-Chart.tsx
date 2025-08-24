import { useState } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import dashboardDataJson from "@/data/store-keeper-page/dashboard/storekeeper-dashboard.json";

// Format number with naira sign and commas
const formatNairaCompact = (value: number) =>
  `\u20a6${new Intl.NumberFormat('en-US', { notation: 'compact', compactDisplay: 'short' }).format(value)}`;

const AmountSoldMonthlyBarChart = () => {
  const data = dashboardDataJson.addedAmountMonthly.map((item) => ({
    month: item.month,
    value: item.total,
  }));

  return (
    <div>
      <h1 className="ml-5" style={{ fontSize: "clamp(12px, 2vw, 16px)" }}>
        Added Amount Monthly
      </h1>
      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={data} margin={{ left: 0, right: 14, top: 10, bottom: 9 }}>
          <defs>
            <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
              <stop offset="10%" stopColor="#5D8AA8" stopOpacity={0.8} /> {/* Softer blue */}
              <stop offset="90%" stopColor="#B0E0E6" stopOpacity={0.3} /> {/* Powder blue */}
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="month" />
          <YAxis tickFormatter={formatNairaCompact} width={64} />
          <Tooltip formatter={(value: number) => formatNairaCompact(value)} />
          <Bar 
            dataKey="value" 
            stroke="#0178a3" 
            fillOpacity={1} 
            fill="url(#colorValue)" 
            radius={[4, 4, 0, 0]} // Optional: adds slight rounded corners to bars
          />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default AmountSoldMonthlyBarChart;