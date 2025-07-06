import React from "react";

interface DashboardCardProps {
  title: string;
  value: number;
  currency?: string;
}

const DashboardCard: React.FC<DashboardCardProps> = ({ title, value, currency }) => {
  return (
    <div className="bg-white shadow-md rounded-lg p-1.5 sm:p-2 md:p-3 min-w-[80px] sm:min-w-[100px] md:min-w-[120px] max-w-[130px] sm:max-w-[150px] mb-2 flex flex-col items-center">
      <span className="text-[7px] sm:text-[8px] md:text-[10px] lg:text-sm text-gray-500 font-semibold text-center mb-1 max-w-[70px] sm:max-w-[90px] md:max-w-[110px]" title={title}>{title}</span>
      <span className="font-extrabold text-blue-400 text-xs sm:text-sm md:text-md">
        {currency}{value.toLocaleString()}
      </span>
    </div>
  );
};

export default DashboardCard; 