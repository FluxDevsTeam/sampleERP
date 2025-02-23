import { PieChart, Pie, Cell, ResponsiveContainer } from "recharts";
import { useQuery } from "@tanstack/react-query";
import { fetchCeoDashboard } from "../projectApi/fetchCeoDashboard";

const IncomeBreakdownPiechart = () => {
  const { data, isLoading, error } = useQuery({
    queryKey: ["Chart"],
    queryFn: fetchCeoDashboard,
  });

  // Transform keyMetrics into an array format suitable for recharts
  const IncomeBreakdown = data?.income_breakdown|| {};
  const IncomeBreakdownArray = Object.entries(IncomeBreakdown).map(([name, value]) => ({
    name,
    value: Number(value), // Ensure it's a number
  }));

  const COLORS = ["#343C6A", "#FC7900", "#1814F3", "#0178A3"];
  const RADIAN = Math.PI / 180;

  const renderCustomizedLabel = ({
    cx,
    cy,
    midAngle,
    innerRadius,
    outerRadius,
    percent,
    name,
  }: {
    cx: number;
    cy: number;
    midAngle: number;
    innerRadius: number;
    outerRadius: number;
    percent: number;
    name: string;
  }) => {
    const radius = innerRadius + (outerRadius - innerRadius) * 0.6;
    const x = cx + radius * Math.cos(-midAngle * RADIAN);
    const y = cy + radius * Math.sin(-midAngle * RADIAN);

    return (
      <text
        x={x}
        y={y}
        fill="white"
        textAnchor="middle"
        dominantBaseline="central"
        fontSize={12}
      >
        <tspan x={x} dy="-0.5em">{name}</tspan>
        <tspan x={x} dy="1.2em">{`${(percent * 100).toFixed(0)}%`}</tspan>
      </text>
    );
  };

  if (isLoading) return <p>Loading...</p>;
  if (error) return <p>Error: {(error as Error).message}</p>;

  return (
    <div className="w-full">
      <p className="text-3xl font-bold text-black">Income Breakdown</p>

      <ResponsiveContainer width="100%" height={350}>
        <PieChart className="bg-white my-6 border rounded-lg">
          <Pie
            data={IncomeBreakdownArray}
            cx="50%"
            cy="50%"
            labelLine={false}
            label={renderCustomizedLabel}
            outerRadius={150}
            fill="#8884d8"
            dataKey="value"
          >
            {IncomeBreakdownArray.map((_, index) => (
              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
            ))}
          </Pie>
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
};

export default IncomeBreakdownPiechart;
