import React from "react";

interface DashboardCardProps {
  title: string;
  value: number;
  currency?: string;
}

const DashboardCard: React.FC<DashboardCardProps> = ({ title, value, currency }) => {
  return (
    <div className="bg-white shadow-md rounded-lg p-3 min-w-[120px] max-w-[150px] mb-2 flex flex-col items-center">
      <span className="text-[12px] md:text-sm text-gray-500 font-semibold text-center mb-1  max-w-[110px]" title={title}>{title}</span>
      <span className="font-extrabold text-blue-700 text-lg md:text-md">
        {currency}{value.toLocaleString()}
      </span>
    </div>
  );
};

export default DashboardCard; 