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

  // Destructure values from boxData with fallback to 0
  const {
    yearly_added_material_count = 0,
    yearly_added_total_cost = 0,
    monthly_added_material_count = 0,
    monthly_added_total_cost = 0,
  } = boxData || {};

  return (
    <div className="wrapper w-full mx-auto my-0 pl-1 mb-20 pt-2">
      {/* <h4>Removed Dashboard</h4> */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-2 max-sm:gap-1 mb-0 md:mb-6 mt-2">
        <InventoryData info="Total Raw Materials Added (Year)" digits={yearly_added_material_count} trend="" />
        <InventoryData info="Total Raw Materials Added (Month)" digits={monthly_added_material_count} trend="" />
        <InventoryData info="Total Cost of Raw Materials (Year)" digits={yearly_added_total_cost} currency="₦" trend="" />
        <InventoryData info="Total Cost of Raw Materials (Month)" digits={monthly_added_total_cost} currency="₦" trend="" />
      </div>

      <div>
        <RecordRemovedTable />
      </div>
    </div>
  );
};

export default RecordOfRMAdded;
