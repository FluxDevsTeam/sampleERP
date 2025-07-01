import React from "react";

interface AdminDashboardCardProps {
  title: string;
  value: number;
  currency?: string;
}

const AdminDashboardCard: React.FC<AdminDashboardCardProps> = ({ title, value, currency }) => {
  return (
    <div className="bg-white shadow-md rounded-lg p-2 min-w-[160px] max-w-[260px] mb-2 flex flex-col items-center">
      <span className="text-base md:text-md text-gray-500 font-semibold text-center mb-2 max-w-[200px]" title={title}>{title}</span>
      <span className="font-extrabold text-blue-400 text-lg pt-2 md:text-md">
        {currency}{value.toLocaleString()}
      </span>
    </div>
  );
};

export default AdminDashboardCard; 