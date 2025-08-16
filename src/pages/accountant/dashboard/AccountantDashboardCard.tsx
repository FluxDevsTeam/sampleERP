import React from 'react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';
import { CustomTooltip } from '../../../components/CustomChartComponents';

interface AccountantDashboardCardProps {
  title: string;
  value: number;
  currency?: string;
  chartData?: Array<{ name: string; value: number }>;
  gradientId: string;
  gradientColors: { start: string; end: string };
}

const AccountantDashboardCard: React.FC<AccountantDashboardCardProps> = ({
  title,
  value,
  currency,
  chartData,
  gradientId,
  gradientColors,
}) => {
  const formattedValue = (value ?? 0).toLocaleString();

  const formatCurrency = (val: number) => `${currency}${val.toLocaleString()}`;

  return (
    <div className="p-2 sm:p-4 border rounded-lg shadow-md flex flex-col items-center justify-center py-4">
      <div className="text-xs sm:text-sm lg:text-base font-medium text-center mb-2 leading-tight">{title}</div>
      <div className="text-sm sm:text-base lg:text-lg font-semibold text-blue-400 text-center mb-4">
        {currency}{formattedValue}
      </div>
      {chartData && chartData.length > 0 && (
        <ResponsiveContainer width="100%" height={150}>
          <BarChart data={chartData} margin={{ top: 5, right: 10, left: 0, bottom: 5 }} barGap={5}>
            <defs>
              <linearGradient id={gradientId} x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor={gradientColors.start} stopOpacity={0.9} />
                <stop offset="100%" stopColor={gradientColors.end} stopOpacity={0.9} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" vertical={false} />
            <XAxis dataKey="name" tick={{ fontSize: 10 }} />
            <YAxis tick={{ fontSize: 10 }} tickFormatter={formatCurrency} />
            <Tooltip cursor={{ fill: "rgba(240, 240, 240, 0.5)" }} content={<CustomTooltip />} formatter={(val: number) => formatCurrency(val)} />
            <Bar dataKey="value" fill={`url(#${gradientId})`} barSize={10} />
          </BarChart>
        </ResponsiveContainer>
      )}
    </div>
  );
};

export default AccountantDashboardCard;