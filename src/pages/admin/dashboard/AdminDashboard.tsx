import { useQuery } from "@tanstack/react-query";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
  CartesianGrid,
  Legend,
  ResponsiveContainer,
} from "recharts";
import axios from "axios";
import Header from "./_components/Header";
import SkeletonLoader from "./_components/SkeletonLoader";

const fetchFinancialData = async () => {
  const accessToken = localStorage.getItem("accessToken");
  const { data } = await axios.get(
    "https://backend.kidsdesigncompany.com/api/admin-dashboard/",
    {
      headers: {
        Authorization: `JWT ${accessToken}`,
      },
    }
  );
  return data;
};

const AdminDashboard = () => {
  const { data, isLoading, error } = useQuery({
    queryKey: ["financialData"],
    queryFn: fetchFinancialData,
  });

  if (isLoading) return <SkeletonLoader />;
  if (error) return <p>Error loading data</p>;

  const workersData = Object.keys(data?.workers || {}).map((key) => ({
    name: key.replace(/_/g, " ").replace(/\b\w/g, (char) => char.toUpperCase()),
    count: data?.workers[key] || 0,
  }));

  const paidData = Object.keys(data?.paid || {}).map((key) => ({
    name: key.replace(/_/g, " ").replace(/\b\w/g, (char) => char.toUpperCase()),
    amount: data?.paid[key] || 0,
  }));

  const expenseCategoryBreakdown = data?.expense_category_breakdown || [];
  const monthlyExpenseTrend = data?.monthly_expense_trend || [];
  const topCategories = data?.top_categories || [];

  const colors = ["#8884d8", "#82ca9d", "#ffc658", "#ff7300", "#ff0000"];

  return (
    <div className="p-6 space-y-6">
      <Header />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Workers Data */}
        <div>
          <h2 className="text-xl font-semibold mb-4">Workers Data</h2>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={workersData} barSize={20}>
              <XAxis
                dataKey="name"
                angle={-45}
                textAnchor="end"
                height={90}
                tickFormatter={(name) =>
                  name.length > 10 ? `${name.substring(0, 10)}...` : name
                }
              />
              <YAxis />
              <Tooltip />
              <Bar dataKey="count" fill="#8884d8" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Paid Data */}
        <div>
          <h2 className="text-xl font-semibold mb-4">Paid Data</h2>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={paidData} barSize={20}>
              <XAxis
                dataKey="name"
                angle={-45}
                textAnchor="end"
                height={90}
                tickFormatter={(name) =>
                  name.length > 10 ? `${name.substring(0, 10)}...` : name
                }
              />
              <YAxis />
              <Tooltip />
              <Bar dataKey="amount" fill="#82ca9d" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Two charts in a row */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Expense Category Breakdown */}
        <div>
          <h2 className="text-xl font-semibold mb-4">
            Expense Category Breakdown
          </h2>
          <ResponsiveContainer width="100%" height={350}>
            <PieChart>
              <Pie
                data={expenseCategoryBreakdown}
                dataKey="percentage"
                nameKey="category"
                cx="50%"
                cy="50%"
                outerRadius={100}
                innerRadius={50}
                label={({ name, value }) => `${name} (${value}%)`}
              >
                {expenseCategoryBreakdown.map((_entry, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={colors[index % colors.length]}
                  />
                ))}
              </Pie>
              <Tooltip />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>

        {/* Top Categories */}
        <div>
          <h2 className="text-xl font-semibold mb-4">Top Categories</h2>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={topCategories} barSize={20}>
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="total" fill="#ff7300" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Line Chart takes Full Width */}
      <div>
        <h2 className="text-xl font-semibold mb-4">Monthly Expense Trend</h2>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={monthlyExpenseTrend}>
            <XAxis dataKey="month" />
            <YAxis />
            <CartesianGrid strokeDasharray="3 3" />
            <Tooltip />
            <Legend />
            <Line type="monotone" dataKey="total" stroke="#8884d8" />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default AdminDashboard;
