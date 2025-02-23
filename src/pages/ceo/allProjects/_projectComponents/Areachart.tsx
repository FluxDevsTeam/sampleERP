import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { useQuery } from "@tanstack/react-query";
import { fetchCeoDashboard } from "../projectApi/fetchCeoDashboard";

const Areachart = () => {
  const { data, isLoading, error } = useQuery({
    queryKey: ["Chart"],
    queryFn: fetchCeoDashboard,
  });

  // Extracting income data from API response
  const incomeData = data?.monthly_trends?.income || [];

  // Transforming API data to match the required format
  const chartData = incomeData.map((item) => ({
    month: item.month, // Keeping months as they are
    value: item.total, // Using "total" as the value
  }));

  if (isLoading) return <p>Loading...</p>;
  if (error) return <p>Error: {(error as Error).message}</p>;

  return (
    <div className="my-4 p-6">
      <p className="text-3xl font-bold text-black mb-4">Monthly Income Trends</p>
      <ResponsiveContainer width="100%" height={300}>
        <AreaChart data={chartData} className="bg-white py-5">
          <defs>
            <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#8884d8" stopOpacity={0.8} />
              <stop offset="95%" stopColor="#8884d8" stopOpacity={0} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="month" tick={{ fontSize: 12 }} angle={-30} textAnchor="end" />
          <YAxis />
          <Tooltip />
          <Area
            type="monotone"
            dataKey="value"
            stroke="#8884d8"
            fillOpacity={1}
            fill="url(#colorValue)"
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
};

export default Areachart;
