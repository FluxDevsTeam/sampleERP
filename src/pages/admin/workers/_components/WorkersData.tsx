interface WorkersDataProps {
  info: string;
  digits: number;
  currency?: string;
  trend?: string;
}

const WorkersData = (WorkersData: WorkersDataProps) => {
  const formattedDigits = (WorkersData.digits ?? 0).toLocaleString('en-NG');

  return (
    <div>
      <div className="bg-white rounded pl-4 py-2 sm:py-5 shadow grid items-center h-full">
        <p
          className="text-blue-400 font-bold text-xs"
        >
          {WorkersData.info}
        </p>
        <p
          className="font-medium text-base"
        >
          {WorkersData.currency? `${WorkersData.currency} ` : ''}{formattedDigits}
        </p>
      </div>
    </div>
  );
};

export default WorkersData; 