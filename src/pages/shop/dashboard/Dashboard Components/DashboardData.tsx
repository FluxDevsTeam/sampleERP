// import React from 'react';

interface DashboardDataProps {
  info: string;
  digits: number;
  currency?: string;
  //   chart?: React.ReactNode;
}

const DashboardData = (DashboardData: DashboardDataProps) => {
  // Format the digits with thousand separators, handling null or undefined values
  const formattedDigits = (DashboardData.digits ?? 0).toLocaleString();
  return (
    <div className="p-2 sm:p-4 border rounded-lg shadow-md flex flex-col items-center justify-center py-4">
      <div className="text-xs sm:text-sm lg:text-base font-medium text-center mb-2 leading-tight">{DashboardData.info}</div>
      <div className="text-sm sm:text-base lg:text-lg font-semibold text-blue-400 text-center">
        {DashboardData.currency}{formattedDigits}
      </div>
    </div>
  );
};

export default DashboardData;
1;
