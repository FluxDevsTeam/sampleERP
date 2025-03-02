interface RawMaterialsDataProps {
  info: string;
  digits: number;
}

const RawMaterialsData = (rawmaterialsData: RawMaterialsDataProps) => {
  return (
    <>
      <div>
      
        <div className="bg-white rounded pl-6 py-5 shadow grid items-center h-full">
          <p
            style={{ fontSize: "clamp(14px, 3vw, 15px)" }}
            className="pb-3"
          >
            {rawmaterialsData.info}
          </p>
          <p
            style={{ fontSize: "clamp(14px, 3vw, 20px)" }}
            className="font-medium text-blue-400"
          >
            Quantity Left: {rawmaterialsData.digits}ps
          </p>
        </div>
      </div>
    </>
  );
};

export default RawMaterialsData;
