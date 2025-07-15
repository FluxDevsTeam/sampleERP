import { useEffect, useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer, CartesianGrid } from 'recharts';
import { factoryData } from './api';
import { RoundedBar, CustomTooltip } from '../../../components/CustomChartComponents';

// Format number with naira sign, commas, and compact notation
const formatNairaCompact = (value: number) => {
  const absValue = Math.abs(value);
  const sign = value < 0 ? '-' : '';
  if (absValue >= 1_000_000) {
    return `${sign}₦${(absValue / 1_000_000).toFixed(1).replace(/\.0$/, '')}m`;
  } else if (absValue >= 1_000) {
    return `${sign}₦${(absValue / 1_000).toFixed(1).replace(/\.0$/, '')}k`;
  }
  return `${sign}₦${absValue.toLocaleString()}`;
};

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
    <div className="w-full grid grid-cols-1 lg:grid-cols-2 gap-4 bg-gray-50">
      <div className="bg-white rounded-lg shadow-md border border-gray-200">
        <h2 className="text-xl font-semibold mb-4 ml-6 mt-1 text-gray-700">Monthly Income Trend</h2>
        <div className="h-[260px]">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={incomeData} margin={{ top: 5, right: 10, left: 0, bottom: 5 }} barGap={5}>
              <defs>
                <linearGradient id="incomeGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#4A90E2" stopOpacity={0.9} />
                  <stop offset="100%" stopColor="#50E3C2" stopOpacity={0.9} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" vertical={false} />
              <XAxis dataKey="name" tick={{ fontSize: 12 }} />
              <YAxis tickFormatter={formatNairaCompact} tick={{ fontSize: 12 }} width={80} />
              <Tooltip formatter={(value: number) => formatNairaCompact(value)} content={<CustomTooltip />} cursor={{fill: 'rgba(240, 240, 240, 0.5)'}} />
              {/* <Legend iconType="circle" iconSize={10} /> */}
              <Bar dataKey="TotalIncome" fill="url(#incomeGradient)" name="Total Income" barSize={20} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-md border border-gray-200">
        <h2 className="text-xl font-semibold mb-4 ml-6 mt-1 text-gray-700">Monthly Expense Trend</h2>
        <div className="h-[260px]">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={expenseData} margin={{ top: 5, right: 10, left: 0, bottom: 5 }} barGap={5}>
              <defs>
                <linearGradient id="expenseGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#F44336" stopOpacity={0.9} />
                  <stop offset="100%" stopColor="#F5A623" stopOpacity={0.9} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" vertical={false} />
              <XAxis dataKey="name" tick={{ fontSize: 12 }} />
              <YAxis tickFormatter={formatNairaCompact} tick={{ fontSize: 12 }} width={80} />
              <Tooltip formatter={(value: number) => formatNairaCompact(value)} content={<CustomTooltip />} cursor={{fill: 'rgba(240, 240, 240, 0.5)'}} />
              {/* <Legend iconType="circle" iconSize={10} /> */}
              <Bar dataKey="TotalExpenses" fill="url(#expenseGradient)" name="Total Expenses" barSize={20} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-md border lg:col-span-2 border-gray-200">
        <h2 className="text-xl font-semibold mb-4 ml-6 mt-1 text-gray-700">Monthly Profit Trend</h2>
        <div className="h-[260px]">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={profitData} margin={{ top: 5, right: 10, left: 0, bottom: 5 }} barGap={5}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} />
              <XAxis dataKey="name" tick={{ fontSize: 12 }} />
              <YAxis tickFormatter={formatNairaCompact} tick={{ fontSize: 12 }} width={80} />
              <Tooltip formatter={(value: number) => formatNairaCompact(value)} content={<CustomTooltip />} cursor={{fill: 'rgba(240, 240, 240, 0.5)'}} />
              {/* <Legend iconType="circle" iconSize={10} /> */}
              <Bar 
                dataKey="Profit" 
                fill="#4CAF50"
                barSize={40}
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};

export default BarChartComponent;
