import InventoryData from "./shop-components/Inventory Item Components/InventoryData";
import SoldTable from "./shop-components/Sold Components/SoldTable";

export const Sold = () => {
  return (
    <div className="wrapper w-11/12 mx-auto my-0 pl-1 pt-2">
      <h1
        style={{ fontSize: "clamp(16.5px, 3vw, 30px)" }}
        className="font-semibold py-5 mt-2"
      >
        Sold Summary
      </h1>
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-11">
        <InventoryData info="Modric" digits={419} trend="up"></InventoryData>
        <InventoryData info="Marcelo" digits={419} trend="up"></InventoryData>
        <InventoryData info="Memphis" digits={419} trend="up"></InventoryData>
        <InventoryData info="Mbappe" digits={419} trend="up"></InventoryData>
      </div>

      <div>
        <h1
          style={{ fontSize: "clamp(16.5px, 3vw, 30px)" }}
          className="font-semibold py-5 mt-2"
        >
          Sold Items
        </h1>
        <SoldTable />
      </div>
    </div>
  );
};

export default Sold;
