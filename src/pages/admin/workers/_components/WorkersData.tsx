interface WorkersDataProps {
  info: string;
  digits: number;
  currency?: string;
  trend?: string;
}

const WorkersData = (WorkersData: WorkersDataProps) => {
  const formattedDigits = (WorkersData.digits ?? 0).toLocaleString('en-NG');

  return (
    <div className="p-2 sm:p-4 border rounded-lg shadow-md flex flex-col items-center justify-center py-4">
      <div className="text-xs sm:text-sm lg:text-base font-medium text-center mb-2 leading-tight">{WorkersData.info}</div>
      <div className="text-sm sm:text-base lg:text-lg font-semibold text-blue-400 text-center">
        {WorkersData.currency}{formattedDigits}
      </div>
    </div>
  );
};

export default WorkersData;