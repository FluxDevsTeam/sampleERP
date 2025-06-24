

interface InventoryDataProps {
  info: string;
  digits: number;
  trend: string;
}

const InventoryData = (InventoryData: InventoryDataProps) => {
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
          {InventoryData.digits}
        </p>
      </div>
    </div>
  );
};

export default InventoryData;
