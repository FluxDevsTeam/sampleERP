import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    Legend,
    ResponsiveContainer,
    PieChart,
    Pie,
    Cell,
  } from "recharts";
  import { useQuery } from "@tanstack/react-query";
  import { fetchCeoDashboard } from "../projectApi/fetchCeoDashboard";
  
  const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042"];
  
  const CategoricalDataCharts = () => {
    const { data, isLoading, error } = useQuery({
      queryKey: ["FinancialMetrics"],
      queryFn: fetchCeoDashboard,
    });
  
    // Extract categorical data
    const expenseCategories = data?.categorical_data?.expense_categories || [];
    const projectProfitability = data?.categorical_data?.project_profitability || [];
    const assetAnalysis = data?.categorical_data?.asset_analysis || {};
  
    // Transform asset data
    const assetData = [
      { name: "Active Assets", value: assetAnalysis.active_assets || 0 },
      { name: "Deprecated Assets", value: assetAnalysis.deprecated_assets || 0 },
    ];
  
    if (isLoading) return <p>Loading...</p>;
    if (error) return <p>Error: {(error as Error).message}</p>;
  
    return (

<div>
      <p className="text-3xl justify-center items-center flex font-bold">Categorical Data </p>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 my-6 p-6">
        {/* Expense Categories - Pie Chart */}
        <div className="bg-white p-4 rounded-lg shadow">
          <p className="text-xl font-bold mb-2">Expense Categories</p>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={expenseCategories}
                dataKey="value"
                nameKey="name"
                cx="50%"
                cy="50%"
                outerRadius={100}
                fill="#8884d8"
                label
              >
                {expenseCategories.map((_, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>
  
        {/* Project Profitability - Bar Chart */}
        <div className="bg-white p-4 rounded-lg shadow">
          <p className="text-xl font-bold mb-2">Project Profitability</p>
          <ResponsiveContainer width="100%" height={350}>
        <BarChart data={projectProfitability} barSize={50}>
          {/* Light grid lines for a clean look */}
          <CartesianGrid strokeDasharray="4 4" strokeOpacity={0.5} />

          {/* Styled X & Y Axes */}
          <XAxis
            dataKey="name"
            angle={-15}
            textAnchor="end"
            tick={{ fill: "#4A5568", fontSize: 14 }}
          />
          <YAxis tick={{ fill: "#4A5568", fontSize: 14 }} />

          {/* Tooltip & Legend */}
          <Tooltip contentStyle={{ backgroundColor: "#ffffff", borderRadius: "8px", padding: "10px" }} />
          <Legend wrapperStyle={{ fontSize: 14, fontWeight: "bold" }} />

          {/* Styled Bars */}
          <Bar dataKey="profit" fill="#10B981" name="Profit" radius={[8, 8, 0, 0]} />
          <Bar dataKey="total_project_cost" fill="#F59E0B" name="Project Cost" radius={[8, 8, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
        </div>
  
        {/* Asset Analysis - Pie Chart */}
        <div className="bg-white p-4 rounded-lg shadow">
          <p className="text-xl font-bold mb-2">Asset Analysis</p>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={assetData}
                dataKey="value"
                nameKey="name"
                cx="50%"
                cy="50%"
                outerRadius={100}
                fill="#82ca9d"
                label
              >
                {assetData.map((_, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>
      </div>
    );
  };
  
  export default CategoricalDataCharts;
  