// src/pages/admin/assets/_components/AssetsData.tsx
interface AssetsDataProps {
  info: string;
  digits: number;
  currency?: string;
  trend?: string;
}

const AssetsData = (AssetsData: AssetsDataProps) => {
  const formattedDigits = (AssetsData.digits ?? 0).toLocaleString("en-NG");

  return (
    <div className="p-2 sm:p-4 border rounded-lg shadow-md flex flex-col items-center justify-center py-4">
      <div className="text-xs sm:text-sm lg:text-base font-medium text-center mb-2 leading-tight">{AssetsData.info}</div>
      <div className="text-sm sm:text-base lg:text-lg font-semibold text-blue-400 text-center">
        {AssetsData.currency}{formattedDigits}
      </div>
    </div>
  );
};

export default AssetsData;