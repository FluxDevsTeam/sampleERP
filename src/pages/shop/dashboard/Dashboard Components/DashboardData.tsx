import React from "react";

interface DashboardDataProps {
  info: string;
  digits: number;
  currency?: string;
}

const DashboardData: React.FC<DashboardDataProps> = ({ info, digits, currency }) => {
  const formattedDigits = (digits ?? 0).toLocaleString();
  return (
    <div className="p-2 sm:p-4 border rounded-lg shadow-md flex flex-col items-center justify-center py-4">
      <div className="text-xs sm:text-sm lg:text-base font-medium text-center mb-2 leading-tight">
        {info}
      </div>
      <div className="text-sm sm:text-base lg:text-lg font-semibold text-blue-400 text-center">
        {currency}{formattedDigits}
      </div>
    </div>
  );
};

export default DashboardData;