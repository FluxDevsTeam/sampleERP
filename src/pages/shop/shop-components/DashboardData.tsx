

interface DashboardDataProps {
  info: string;
  digits: number;
  trend: string;
}

const DashboardData = (dashboardData: DashboardDataProps) => {
  return (
    
    <div>
      <div className="bg-white rounded pl-6 py-5 shadow grid items-center h-full">
        <p
          style={{ fontSize: "clamp(14px, 3vw, 28px)" }}
          className="text-blue-400 font-bold"
        >
          {dashboardData.info}
        </p>
        <p
          style={{ fontSize: "clamp(14px, 3vw, 32px)" }}
          className="font-black"
        >
          {dashboardData.digits}
        </p>
        <p className="text-xs">Trend: {dashboardData.trend}</p>
      </div>
    </div>
  );
};

export default DashboardData;
