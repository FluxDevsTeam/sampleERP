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
    <div className="bg-white shadow-2xl grid items-center py-6 pl-3">
      <p className="text-xs font-semibold"
        style={{ fontSize: "clamp(12px, 3vw, 16px)" }}
        >{DashboardData.info}</p>
      <h2
        className="text-blue-400 font-bold"
        style={{ fontSize: "clamp(10px, 3vw, 23px)" }}
      >
        {DashboardData.currency}{formattedDigits}
      </h2>
    </div>
  );
};

export default DashboardData;
1;
