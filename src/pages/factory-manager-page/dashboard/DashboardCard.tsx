import React from "react";

interface DashboardCardProps {
  title: string;
  value: number;
  currency?: string;
}

const DashboardCard: React.FC<DashboardCardProps> = ({ title, value, currency }) => {
  // Format the value with thousand separators, handling null or undefined values
  const formattedValue = (value ?? 0).toLocaleString();
  return (
    <div className="relative flex flex-col justify-between rounded-lg border border-gray-200 bg-white p-4 shadow-md transition-all duration-300 hover:shadow-lg sm:p-6">
      <p className="mb-2 text-sm font-medium text-gray-500 sm:text-base">{title}</p>
      <h2 className="text-xl font-bold text-blue-600 sm:text-2xl">
        {currency}{formattedValue}
      </h2>
    </div>
  );
};

export default DashboardCard;