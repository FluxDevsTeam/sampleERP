

interface InventoryDataProps {
  info: string;
  digits: number;
  currency?: string;
  trend?: string;
}

const InventoryData = (InventoryData: InventoryDataProps) => {
  const formattedDigits = (InventoryData.digits ?? 0).toLocaleString();

  return (
    <div>
      <div className="bg-white rounded pl-4 py-5 shadow grid items-center h-full">
        <p
          style={{ fontSize: "clamp(10px, 3vw, 20px)" }}
          className="text-blue-400 font-bold"
        >
          {InventoryData.info}
        </p>
        <p
          style={{ fontSize: "clamp(10px, 3vw, 24px)" }}
          className="font-medium "
        >
          {InventoryData.currency? `${InventoryData.currency} ` : ''}{formattedDigits}
        </p>
      </div>
    </div>
  );
};

export default InventoryData;
