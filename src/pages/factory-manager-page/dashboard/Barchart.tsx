import { useEffect, useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer, CartesianGrid } from 'recharts';
import { factoryData } from './api';
import { RoundedBar, CustomTooltip } from '../../../components/CustomChartComponents';

// Format number with naira sign and commas
const formatNaira = (value: number) => `₦${value.toLocaleString()}`;

const BarChartComponent = () => {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const result = await factoryData();
        setData(result);
      } catch (err) {
        setError('Failed to fetch data');
      }
      setLoading(false);
    };

    fetchData();
  }, []);

  if (loading) {
    return <div className="text-center p-10 font-semibold">Loading charts...</div>;
  }

  if (error) {
    return <div className="text-center p-10 text-red-500 font-semibold">{error}</div>;
  }

  const { monthly_income_trend, monthly_expense_trend } = data;
  const { monthly_profit_trend } = data;

  const incomeData = (monthly_income_trend || []).map((item: any) => ({
    name: item.month,
    TotalIncome: item.total_income ?? 0,
    Project: item.type_breakdown?.project ?? 0,
    Shop: item.type_breakdown?.shop ?? 0,
  }));

  const expenseData = (monthly_expense_trend || []).map((item: any) => ({
    name: item.month,
    TotalExpenses: item.total_expenses ?? 0,
    Project: item.type_breakdown?.project ?? 0,
    Shop: item.type_breakdown?.shop ?? 0,
    Others: item.type_breakdown?.others ?? 0,
  }));

  const profitData = (monthly_profit_trend || []).map((item: any) => ({
    name: item.month,
    Profit: item.profit ?? 0,
  }));

  return (
    <div className="w-full grid grid-cols-1 lg:grid-cols-3 gap-4 p-4 bg-gray-50">
      <div className="bg-white p-6 rounded-lg shadow-md border border-gray-200">
        <h2 className="text-xl font-semibold mb-4 text-gray-700">Monthly Income Trend</h2>
        <div className="h-[350px]">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={incomeData} margin={{ top: 5, right: 20, left: 20, bottom: 5 }} barGap={5}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} />
              <XAxis dataKey="name" tick={{ fontSize: 12 }} />
              <YAxis tickFormatter={formatNaira} tick={{ fontSize: 12 }} width={80} />
              <Tooltip content={<CustomTooltip />} cursor={{fill: 'rgba(240, 240, 240, 0.5)'}} />
              <Legend iconType="circle" iconSize={10} />
              <Bar dataKey="TotalIncome" fill="#4A90E2" name="Total Income" />
              <Bar dataKey="Project" shape={<RoundedBar />} fill="#4A90E2" />
              <Bar dataKey="Shop" shape={<RoundedBar />} fill="#50E3C2" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="bg-white p-6 rounded-lg shadow-md border border-gray-200">
        <h2 className="text-xl font-semibold mb-4 text-gray-700">Monthly Expense Trend</h2>
        <div className="h-[350px]">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={expenseData} margin={{ top: 5, right: 20, left: 20, bottom: 5 }} barGap={5}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} />
              <XAxis dataKey="name" tick={{ fontSize: 12 }} />
              <YAxis tickFormatter={formatNaira} tick={{ fontSize: 12 }} width={80} />
              <Tooltip content={<CustomTooltip />} cursor={{fill: 'rgba(240, 240, 240, 0.5)'}} />
              <Legend iconType="circle" iconSize={10} />
              <Bar dataKey="TotalExpenses" fill="#F44336" name="Total Expenses" />
              <Bar dataKey="Project" shape={<RoundedBar />} fill="#F5A623" />
              <Bar dataKey="Shop" shape={<RoundedBar />} fill="#F8E71C" />
              <Bar dataKey="Others" shape={<RoundedBar />} fill="#BD10E0" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="bg-white p-6 rounded-lg shadow-md border border-gray-200">
        <h2 className="text-xl font-semibold mb-4 text-gray-700">Monthly Profit Trend</h2>
        <div className="h-[350px]">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={profitData} margin={{ top: 5, right: 20, left: 20, bottom: 5 }} barGap={5}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} />
              <XAxis dataKey="name" tick={{ fontSize: 12 }} />
              <YAxis tickFormatter={formatNaira} tick={{ fontSize: 12 }} width={80} />
              <Tooltip content={<CustomTooltip />} cursor={{fill: 'rgba(240, 240, 240, 0.5)'}} />
              <Legend iconType="circle" iconSize={10} />
              <Bar 
                dataKey="Profit" 
                shape={<RoundedBar />} 
                fill={(entry: any) => entry.Profit >= 0 ? "#4CAF50" : "#F44336"}
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};

export default BarChartComponent;
