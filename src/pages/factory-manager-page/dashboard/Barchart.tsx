import { useEffect, useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer, CartesianGrid } from 'recharts';
import { factoryData } from './api';
import { RoundedBar, CustomTooltip } from '../../../components/CustomChartComponents';

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

  const incomeData = monthly_income_trend.map((item: any) => ({
    name: item.month,
    Project: item.type_breakdown.project,
    Shop: item.type_breakdown.shop,
  }));

  const expenseData = monthly_expense_trend.map((item: any) => ({
    name: item.month,
    Project: item.type_breakdown.project,
    Shop: item.type_breakdown.shop,
    Others: item.type_breakdown.others,
  }));

  return (
    <div className="w-full grid grid-cols-1 lg:grid-cols-2 gap-8 p-4 bg-gray-50">
      <div className="bg-white p-6 rounded-lg shadow-md border border-gray-200">
        <h2 className="text-xl font-semibold mb-4 text-gray-700">Monthly Income Trend</h2>
        <div className="h-[350px]">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={incomeData} margin={{ top: 5, right: 20, left: 20, bottom: 5 }} barGap={5}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} />
              <XAxis dataKey="name" tick={{ fontSize: 12 }} />
              <YAxis tickFormatter={(value) => new Intl.NumberFormat('en-US', { notation: 'compact', compactDisplay: 'short' }).format(value as number)} tick={{ fontSize: 12 }} />
              <Tooltip content={<CustomTooltip />} cursor={{fill: 'rgba(240, 240, 240, 0.5)'}} />
              <Legend iconType="circle" iconSize={10} />
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
              <YAxis tickFormatter={(value) => new Intl.NumberFormat('en-US', { notation: 'compact', compactDisplay: 'short' }).format(value as number)} tick={{ fontSize: 12 }} />
              <Tooltip content={<CustomTooltip />} cursor={{fill: 'rgba(240, 240, 240, 0.5)'}} />
              <Legend iconType="circle" iconSize={10} />
              <Bar dataKey="Project" shape={<RoundedBar />} fill="#F5A623" />
              <Bar dataKey="Shop" shape={<RoundedBar />} fill="#F8E71C" />
              <Bar dataKey="Others" shape={<RoundedBar />} fill="#BD10E0" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};

export default BarChartComponent;
