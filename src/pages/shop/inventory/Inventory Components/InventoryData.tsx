

interface InventoryDataProps {
  info: string;
  digits: number;
  currency?: string;
}

const InventoryData = (InventoryData: InventoryDataProps) => {
  // Format the digits with thousand separators, handling null or undefined values
  const formattedDigits = (InventoryData.digits ?? 0).toLocaleString();

  return (
    <div>
      <div className="bg-white rounded pl-6 py-5 shadow grid items-center h-full">
        <p
          style={{ fontSize: "clamp(14px, 3vw, 28px)" }}
          className="text-blue-400 font-bold"
        >
          {InventoryData.info}
        </p>
        <p
          style={{ fontSize: "clamp(14px, 3vw, 32px)" }}
          className="font-black"
        >
          {InventoryData.currency}{formattedDigits}
        </p>
      </div>
    </div>
  );
};

export default InventoryData;
