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
      <div className="bg-white rounded pl-4 py-5 shadow grid items-center h-full">
        <p
          style={{ fontSize: "clamp(10px, 3vw, 20px)" }}
          className="text-blue-400 font-bold"
        >
          {WorkersData.info}
        </p>
        <p
          style={{ fontSize: "clamp(10px, 3vw, 24px)" }}
          className="font-medium "
        >
          {WorkersData.currency? `${WorkersData.currency} ` : ''}{formattedDigits}
        </p>
      </div>
    </div>
  );
};

export default WorkersData; 