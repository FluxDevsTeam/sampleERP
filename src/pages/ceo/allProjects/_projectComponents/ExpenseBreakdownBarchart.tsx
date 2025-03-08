import { BarChart, Bar, ResponsiveContainer, XAxis, YAxis, Tooltip, Cell } from "recharts";
import { useQuery } from "@tanstack/react-query";
import { fetchCeoDashboard } from "../projectApi/fetchCeoDashboard";

const ExpenseBreakdownBarchart = () => {
  const { data, isLoading, error } = useQuery({
    queryKey: ["Chart"],
    queryFn: fetchCeoDashboard,
  });

  // Extracting expense breakdown data
  const expenseData = data?.expense_breakdown || {};

  // Transforming expense data into an array for Recharts
  const chartData = Object.entries(expenseData)
    .filter(([key]) => key !== "operational_ratio") // Removing the ratio (not needed in bar chart)
    .map(([category, amount]) => ({
      name: category.replace(/_/g, " "), // Convert underscores to spaces
      expense: amount, // Bar height
    }));

  const COLORS = ["#343C6A", "#FC7900", "#1814F3", "#0178A3", "#5B8C5A"];

  if (isLoading) return <p>Loading...</p>;
  if (error) return <p>Error: {(error as Error).message}</p>;

  return (
    <div className="">
      <p className="text-3xl font-bold text-black lg:pt-0 pt-6">Expense Breakdown</p>
      <ResponsiveContainer width="100%" height={350}>
        <BarChart data={chartData} className="bg-white my-6 border rounded-lg py-4">
          <XAxis dataKey="name" tick={{ fontSize: 12 }} angle={-25} textAnchor="end" />
          <YAxis />
          <Tooltip />
          <Bar dataKey="expense">
            {chartData.map((_, index) => (
              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default ExpenseBreakdownBarchart;
