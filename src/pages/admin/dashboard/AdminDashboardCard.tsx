import React from "react";

interface AdminDashboardCardProps {
  title: string;
  value: number;
  currency?: string;
}

const AdminDashboardCard: React.FC<AdminDashboardCardProps> = ({ title, value, currency }) => {
  // Format the value with thousand separators, handling null or undefined values
  const formattedValue = (value ?? 0).toLocaleString();
  return (
    <div className="p-2 sm:p-4 border rounded-lg shadow-md flex flex-col items-center justify-center py-4">
      <div className="text-xs sm:text-sm lg:text-base font-medium text-center mb-2 leading-tight">{title}</div>
      <div className="text-sm sm:text-base lg:text-lg font-semibold text-blue-400 text-center">
        {currency}{formattedValue}
      </div>
    </div>
  );
};

export default AdminDashboardCard;

