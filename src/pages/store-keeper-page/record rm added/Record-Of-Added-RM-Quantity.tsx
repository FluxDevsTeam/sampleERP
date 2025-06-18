import React from "react";
import RecordRemovedTable from "./record rm added components/RecordRMAddedTable";
import InventoryData from "@/pages/shop/inventory/Inventory Components/InventoryData";
import { useState, useEffect } from "react";

const RecordOfRMAdded: React.FC = () => {
  document.title = "Record Removed | Kids Design Company";

  const [boxData, setBoxData] = useState<any>([]);

  useEffect(() => {
    async function fetchStockInfo() {
      // INVENTORY ITEM
      try {
        const response = await fetch(
          "https://backend.kidsdesigncompany.com/api/add-raw-materials/", {
            method: "GET",
            headers: {
              Authorization: `JWT ${localStorage.getItem("accessToken")}`,
            },
          }
        );

        if (!response.ok) {
          throw new Error("iyegs failed");
        }

        const logData = await response.json();
        console.log(logData);

        setBoxData(logData);
      } catch (error) {
        console.error("Error fetching items:", error);
      }
    }

    fetchStockInfo();
  }, []);

  return (
    <div className="wrapper w-11/12 mx-auto my-0 pl-1 pt-2">
      <h1
        style={{ fontSize: "clamp(16.5px, 3vw, 30px)" }}
        className="font-semibold py-5 mt-2"
      >
        Raw Materials Added Summary
      </h1>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-11">
        <InventoryData
          info="Yearly Added Stock"
          digits={boxData.yearly_added_material_count}
          trend="up"
        ></InventoryData>
        <InventoryData
          info="Yearly Added Total Cost Price"
          digits={boxData.yearly_added_total_cost}
          trend="up"
        ></InventoryData>
        <InventoryData
          info="Monthly Added Stock"
          digits={boxData.monthly_added_material_count}
          trend="up"
        ></InventoryData>
        <InventoryData
          info="Monthly Added Total Cost Price"
          digits={boxData.monthly_added_total_cost}
          trend="up"
        ></InventoryData>
        <InventoryData
          info="Monthly Added Toutal Cost"
          digits={boxData.monthly_added_total_cost}
          trend="up"
        ></InventoryData>
      </div>

      <h1
        className="font-semibold py-5 mt-2"
        style={{ fontSize: "clamp(16.5px, 3vw, 30px)" }}
      >
        Addition to raw materials
      </h1>
      <RecordRemovedTable />
    </div>
  );
};

export default RecordOfRMAdded;
