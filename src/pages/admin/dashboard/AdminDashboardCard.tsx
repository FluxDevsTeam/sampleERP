import React from "react";

interface AdminDashboardCardProps {
  title: string;
  value: number;
  currency?: string;
}

const AdminDashboardCard: React.FC<AdminDashboardCardProps> = ({ title, value, currency }) => {
  return (
    <div className="bg-white shadow-md rounded-lg p-2 sm:p-3 md:p-4 min-w-[120px] sm:min-w-[140px] md:min-w-[160px] max-w-[200px] sm:max-w-[240px] md:max-w-[260px] mb-2 flex flex-col items-center justify-center h-[80px] sm:h-[90px] md:h-[100px]">
      <span className="text-xs sm:text-sm md:text-base text-gray-500 font-semibold text-center mb-1 sm:mb-2 max-w-[160px] sm:max-w-[180px] md:max-w-[200px] leading-tight" title={title}>{title}</span>
      <span className="font-extrabold text-blue-400 text-sm sm:text-base md:text-lg pt-1 sm:pt-2 text-center">
        {currency}{value.toLocaleString()}
      </span>
    </div>
  );
};

export default AdminDashboardCard; 