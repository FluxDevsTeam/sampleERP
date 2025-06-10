import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from "recharts";

const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#A28FD0", "#FF6347"];

const PieChartComponent = ({ data }: { data: { name: string; value: number }[] }) => {
  // Calculate total value for percentage calculation
  const total = data.reduce((sum, item) => sum + item.value, 0);

  // Custom label function to show percentage
  const renderLabel = ({ name, value }: { name: string; value: number }) => {
    const percentage = ((value / total) * 100).toFixed(2); // Convert to percentage
    return `${name} (${percentage}%)`; // Display name with percentage
  };

  return (
    <div className="w-full h-[400px]">
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            outerRadius={120}
            fill="#8884d8"
            dataKey="value"
            label={renderLabel} // Use custom label function
          >
            {data.map((_, index) => (
              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
            ))}
          </Pie>
          <Tooltip />
          <Legend />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
};

export default PieChartComponent;
