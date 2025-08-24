import InventoryData from "@/pages/shop/inventory/Inventory Components/InventoryData";
import RemovedTable from "./Removed Components/RemovedTable";
import { useState, useEffect } from "react";
import removedData from "@/data/store-keeper-page/removed/removed.json";

export const Removed = () => {
  const [thisMonthRemovedCount, setThisMonthRemovedCount] = useState(0);
  const [thisMonthRemoved, setThisMonthRemoved] = useState(0);

  useEffect(() => {
    setThisMonthRemovedCount(removedData.this_month_removed_count || 0);
    setThisMonthRemoved(removedData.this_month_removed || 0);
  }, []);

  return (
    <div className="wrapper w-full mx-auto my-0 mb-20 md:mb-4 pt-2">
      <div className="grid grid-cols-2 gap-2 md:gap-10 md:mt-2">
        <InventoryData
          info="Monthly Removed Items"
          digits={thisMonthRemovedCount}
        ></InventoryData>
        <InventoryData
          info="Monthly Removed Cost"
          digits={thisMonthRemoved}
          currency="₦"
        ></InventoryData>
      </div>

      <div>
        <RemovedTable />
      </div>
    </div>
  );
};

export default Removed;