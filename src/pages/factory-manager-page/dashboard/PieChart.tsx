import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from "recharts";

const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#A28FD0", "#FF6347"];

const PieChartComponent = ({ data }: { data: { name: string; value: number }[] }) => {
    // If data is empty or not provided, show a skeleton loader
    if (!data || data.length === 0) {
      return (
        <div className="w-full h-[400px] bg-gray-100 rounded-lg flex items-center justify-center border-2 border-dashed border-gray-300">
          <div className="text-center">
            <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
            </svg>
            <h3 className="mt-2 text-sm font-medium text-gray-900">No data to display</h3>
            <p className="mt-1 text-sm text-gray-500">There is currently no data available for this chart.</p>
          </div>
        </div>
      );
    }
  
    // Calculate total value for percentage calculation
    const total = data.reduce((sum, item) => sum + item.value, 0);
  
    // Custom label function to show percentage
    const renderLabel = ({ name, value }: { name: string; value: number }) => {
      if (total === 0) {
        return name; // Just show name if total is zero
      }
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
