import React from "react";

interface InventoryDataProps {
  info: string;
  digits: number;
  currency?: string;
}

const InventoryData: React.FC<InventoryDataProps> = ({
  info,
  digits,
  currency,
}) => {
  const formattedDigits = (digits ?? 0).toLocaleString();

  return (
    <div className="p-2 sm:p-4 border rounded-lg shadow-md flex flex-col items-center justify-center py-4">
      <div className="text-xs sm:text-sm lg:text-base font-medium text-center mb-2 leading-tight">
        {info}
      </div>
      <div className="text-sm sm:text-base lg:text-lg font-semibold text-blue-400 text-center">
        {currency}
        {formattedDigits}
      </div>
    </div>
  );
};

export default InventoryData;