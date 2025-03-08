import RawMaterialsData from "./shop-components/RawMaterialsData";
import DashboardTable from "./shop-components/Inventory Item Components/InventoryTable";

const RawMaterials = () => {
  document.title = "RawMaterials | Shop Keeper";

  const tableHeaders = ["Product", "Category", "Stock Status", "Details"];

  return (
    <>
      <div className="w-11/12 mx-auto my-0 pl-1 pt-2">
        <h1>should work w/ the raw marerials api</h1>
        <h1
          style={{ fontSize: "clamp(16.5px, 3vw, 30px)" }}
          className="font-semibold py-5 mt-2"
        >
          Raw Materials
        </h1>
        <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-11">
          <RawMaterialsData info="Wood" digits={1125}></RawMaterialsData>
          <RawMaterialsData info="Fabric" digits={80}></RawMaterialsData>
          <RawMaterialsData info="Metal" digits={40}></RawMaterialsData>
          <RawMaterialsData info="Hardware" digits={70}></RawMaterialsData>
        </div>

        <div>
          <DashboardTable headers={tableHeaders} />
        </div>
      </div>
    </>
  );
};

export default RawMaterials;
