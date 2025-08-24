import React from "react";
import RecordRemovedTable from "./record rm added components/RecordRMAddedTable";
import InventoryData from "@/pages/shop/inventory/Inventory Components/InventoryData";
import { useState, useEffect } from "react";
import recordRMAddedData from "@/data/store-keeper-page/record-rm-added/record-rm-added.json";

const RecordOfRMAdded: React.FC = () => {
  document.title = "Record of Items Added - Inventory Admin";

  const [boxData, setBoxData] = useState<any>(recordRMAddedData);

  useEffect(() => {
    // Simulate fetching data
    setBoxData(recordRMAddedData);
  }, []);

  // Destructure values from boxData with fallback to 0
  const {
    yearly_added_material_count = 0,
    yearly_added_total_cost = 0,
    monthly_added_material_count = 0,
    monthly_added_total_cost = 0,
  } = boxData || {};

  return (
    <div className="wrapper w-full mx-auto my-0 mb-20 pt-2">
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-2 max-sm:gap-1 mb-0 md:mb-6 md:mt-2">
        <InventoryData info="Yearly Items Added" digits={yearly_added_material_count} trend="" />
        <InventoryData info="Monthly Items Added" digits={monthly_added_material_count} trend="" />
        <InventoryData info="Yearly Items Cost" digits={yearly_added_total_cost} currency="₦" trend="" />
        <InventoryData info="Monthly Items Cost" digits={monthly_added_total_cost} currency="₦" trend="" />
      </div>

      <div>
        <RecordRemovedTable />
      </div>
    </div>
  );
};

export default RecordOfRMAdded;