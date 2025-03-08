import InventoryData from "./shop-components/Inventory Item Components/InventoryData";
import Table from "./shop-components/Inventory Item Components/InventoryTable";
import { useEffect, useState } from "react";
// import { useNavigate } from "react-router-dom";

export const Inventory = () => {
  const tableHeaders = ["Product", "Category", "Stock Status", "Details"];
  const [totalStock, setTotalStock] = useState(419);

  // const navigate = useNavigate();

  useEffect(() => {
    async function fetchStockInfo() {
      // INVENTORY ITEM
      try {
        const response = await fetch(
          "https://kidsdesigncompany.pythonanywhere.com/api/inventory-item/"
        );

        if (!response.ok) {
          throw new Error("Authentication failed");
        }

        const logData = await response.json();
        console.log(logData);

        setTotalStock(logData.count);
      } catch (error) {
        console.error("Error fetching items:", error);
      }

      // INVENTORY DASHBOARD
      try {
        const response = await fetch(
          "https://kidsdesigncompany.pythonanywhere.com/api/inventory-dashboard/"
        );

        if (!response.ok) {
          throw new Error("Authentication failed");
        }

        const logData = await response.json();
        console.log(logData);
      } catch (error) {
        console.error("Error fetching dashboard:", error);
      }
    }

    fetchStockInfo();
  }, []);

  return (
    <>
      <div className="wrapper w-11/12 mx-auto my-0 pl-1 pt-2">
        <h1
          style={{ fontSize: "clamp(16.5px, 3vw, 30px)" }}
          className="font-semibold py-5 mt-2"
        >
          Inventory Summary
        </h1>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-11">
          <InventoryData
            info="Total Stock"
            digits={totalStock}
            trend="up"
          ></InventoryData>
          <InventoryData
            info="Total Stock"
            digits={totalStock}
            trend="up"
          ></InventoryData>
          <InventoryData
            info="Total Stock"
            digits={totalStock}
            trend="up"
          ></InventoryData>
          <InventoryData
            info="Total Stock"
            digits={totalStock}
            trend="up"
          ></InventoryData>
        </div>

        <div>
          <h1
            style={{ fontSize: "clamp(16.5px, 3vw, 30px)" }}
            className="font-semibold py-5 mt-2"
          >
            Inventory Items
          </h1>
          <Table headers={tableHeaders} />
        </div>
      </div>
    </>
  );
};

export default Inventory;
