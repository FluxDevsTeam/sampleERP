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

const KeyMetricsChart = () => {
  // Key metrics data inside the component
  const keyMetricsData = [
    { name: "Total Income", value: 4255000.0 },
    { name: "Total Expenses", value: 720000.0 },
    { name: "Net Profit", value: 3535000.0 },
    { name: "Gross Profit", value: 4015000.0 },
    { name: "Current Assets", value: 180000.0 },
    { name: "Inventory Value", value: 621000.0 },
  ];

  return (
    <div className="bg-white p-4 rounded-lg shadow-md">
      <p className="text-xl font-bold mb-2">Financial Overview</p>
      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={keyMetricsData}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="name" angle={-15} textAnchor="end" />
          <YAxis />
          <Tooltip />
          <Legend />
          <Bar dataKey="value" fill="#0088FE" name="Amount" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default KeyMetricsChart;
