// import React from 'react';

interface DashboardDataProps {
  info: string;
  digits: number;
  //   chart?: React.ReactNode;
}

const DashboardData = (DashboardData: DashboardDataProps) => {
  return (
    <div className="bg-white shadow-2xl grid items-center py-6 pl-3">
      <p className="text-xs font-semibold"
        style={{ fontSize: "clamp(12px, 3vw, 16px)" }}
        >{DashboardData.info}</p>
      <h2
        className="text-blue-400 font-bold"
        style={{ fontSize: "clamp(10px, 3vw, 23px)" }}
      >
        {DashboardData.digits}
      </h2>
      {/* {DashboardData.chart && <div className="mt-4" style={{ maxWidth: '850px' }}>{DashboardData.chart}</div>} */}
    </div>
  );
};

export default DashboardData;
1;
