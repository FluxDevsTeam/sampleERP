import { useState, useEffect } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

// Define interfaces for the data structure
interface IncomeExpenseData {
  month: string;
  total: number;
}

interface MonthlyTrendsData {
  income: IncomeExpenseData[];
  expenses: IncomeExpenseData[];
}

// Define interface for the API response
interface ApiResponse {
  monthly_trends: MonthlyTrendsData;
}

// Define custom tooltip prop types
interface CustomTooltipProps {
  active?: boolean;
  payload?: any[];
  label?: string;
}

const MonthlyTrendsCharts = () => {
  const [data, setData] = useState<MonthlyTrendsData | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch('https://backend.kidsdesigncompany.com/api/ceo-dashboard/');
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        const result: ApiResponse = await response.json();
        setData(result.monthly_trends);
        setLoading(false);
      } catch (err) {
        setError('Failed to fetch data');
        setLoading(false);
        // Use sample data if fetch fails
      }
    };

    fetchData();
  }, []);

  // Format large numbers with commas
  const formatCurrency = (value: number): string => {
    return `$${value.toLocaleString()}`;
  };

  // Custom tooltip to display formatted values
  const CustomTooltip = ({ active, payload, label }: CustomTooltipProps) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-4 border border-gray-200 shadow-md rounded">
          <p className="font-bold">{label}</p>
          <p className="text-green-600">{`Income: ${formatCurrency(payload[0].value)}`}</p>
        </div>
      );
    }
    return null;
  };

  const CustomExpensesTooltip = ({ active, payload, label }: CustomTooltipProps) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-4 border border-gray-200 shadow-md rounded">
          <p className="font-bold">{label}</p>
          <p className="text-red-600">{`Expenses: ${formatCurrency(payload[0].value)}`}</p>
        </div>
      );
    }
    return null;
  };

  if (loading) {
    return <div className="text-center p-8">Loading dashboard data...</div>;
  }

  if (error && !data) {
    return <div className="text-red-600 p-8">Error: {error}</div>;
  }

  return (
    <div className="space-y-8 p-4">
      <h1 className="text-2xl font-bold text-center mb-8">Financial Dashboard - Monthly Trends</h1>
      
      {/* Income Chart */}
      <div 
        style={{
          backgroundColor: "#f5f7fa",
          borderRadius: "12px",
          boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)",
          padding: "25px",
          width: "100%",
          marginBottom: "30px",
          transition: "transform 0.3s ease",
        }}
      >
        <h2 
          style={{
            fontSize: "1.25rem",
            fontWeight: "600",
            marginBottom: "20px",
            color: "#4CAF50",
            textAlign: "center"
          }}
        >Monthly Income</h2>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart
            data={data?.income || []}
            margin={{ top: 20, right: 30, left: 30, bottom: 60 }}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis 
              dataKey="month" 
              angle={-45} 
              textAnchor="end" 
              height={70} 
              tick={{ fontSize: 12 }}
            />
            <YAxis 
              tickFormatter={(value) => `NGN${value.toLocaleString()}`}
              tick={{ fontSize: 12 }}
            />
            <Tooltip content={<CustomTooltip />} />
            <Legend />
            <Bar dataKey="total" name="Income" fill="#4CAF50" />
          </BarChart>
        </ResponsiveContainer>
      </div>
      
      {/* Expenses Chart */}
      <div 
        style={{
          backgroundColor: "#f5f7fa",
          borderRadius: "12px",
          boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)",
          padding: "25px",
          width: "100%",
          marginBottom: "30px",
          transition: "transform 0.3s ease",
        }}
      >
        <h2 
          style={{
            fontSize: "1.25rem",
            fontWeight: "600",
            marginBottom: "20px",
            color: "#F44336",
            textAlign: "center"
          }}
        >Monthly Expenses</h2>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart
            data={data?.expenses || []}
            margin={{ top: 20, right: 30, left: 30, bottom: 60 }}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis 
              dataKey="month" 
              angle={-45} 
              textAnchor="end" 
              height={70} 
              tick={{ fontSize: 12 }}
            />
            <YAxis 
              tickFormatter={(value) => `NGN${value.toLocaleString()}`}
              tick={{ fontSize: 12 }}
            />
            <Tooltip content={<CustomExpensesTooltip />} />
            <Legend />
            <Bar dataKey="total" name="Expenses" fill="#F44336" />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default MonthlyTrendsCharts;