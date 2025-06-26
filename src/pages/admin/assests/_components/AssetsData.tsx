interface AssetsDataProps {
  info: string;
  digits: number;
  currency?: string;
  trend?: string;
}

const AssetsData = (AssetsData: AssetsDataProps) => {
  const formattedDigits = (AssetsData.digits ?? 0).toLocaleString('en-NG');

  return (
    <div>
      <div className="bg-white rounded pl-4 py-5 shadow grid items-center h-full">
        <p
          style={{ fontSize: "clamp(10px, 3vw, 20px)" }}
          className="text-blue-400 font-bold"
        >
          {AssetsData.info}
        </p>
        <p
          style={{ fontSize: "clamp(10px, 3vw, 24px)" }}
          className="font-medium "
        >
          {AssetsData.currency? `${AssetsData.currency} ` : ''}{formattedDigits}
        </p>
      </div>
    </div>
  );
};

export default AssetsData; 