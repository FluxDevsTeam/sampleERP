

import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
  } from "recharts";
  import { useQuery } from "@tanstack/react-query";
  import { fetchCeoDashboard } from "../projectApi/fetchCeoDashboard";
  
  const KeyMetricsChart = () => {
    const { data, isLoading, error } = useQuery({
      queryKey: ["KeyMetrics"],
      queryFn: fetchCeoDashboard,
    });
  
    // Extract key metrics data from API response
    const keyMetrics = data?.key_metrics || {};
  
    // Transform API data into chart format
    const chartData = [
      { name: "Total Income", value: keyMetrics.total_income },
      { name: "Total Expenses", value: keyMetrics.total_expenses },
      { name: "Net Profit", value: keyMetrics.net_profit },
      { name: "Gross Profit", value: keyMetrics.gross_profit },
      { name: "Assets Value", value: keyMetrics.current_assets_value },
      { name: "Inventory Value", value: keyMetrics.inventory_value },
    ];
  
    if (isLoading) return <p>Loading...</p>;
    if (error) return <p>Error: {(error as Error).message}</p>;
  
    return (
      <div className="my-4 p-6">
        <p className="text-3xl font-bold text-black mb-4">Key  Metrics</p>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={chartData} className="bg-white py-5">
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" tick={{ fontSize: 12 }} angle={-20} textAnchor="end" />
            <YAxis />
            <Tooltip />
            <Bar dataKey="value" fill="#8884d8" barSize={50} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    );
  };
  
  export default KeyMetricsChart;
  