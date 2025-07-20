import InventoryData from "@/pages/shop/inventory/Inventory Components/InventoryData";
import RemovedTable from "./Removed Components/RemovedTable";

import { useState, useEffect } from "react";

export const Removed = () => {
  const [thisMonthRemovedCount, setThisMonthRemovedCount] = useState(0);
  const [thisMonthRemoved, setThisMonthRemoved] = useState(0);

  useEffect(() => {
    async function fetchStockInfo() {
      try {
        const response = await fetch(
          "https://backend.kidsdesigncompany.com/api/removed/",
          {
            method: "GET",
            headers: {
              Authorization: `JWT ${localStorage.getItem("accessToken")}`,
              "Content-Type": "application/json",
            },
          }
        );

        if (!response.ok) {
          throw new Error("Failed to fetch removed items data");
        }

        const logData = await response.json();
        console.log("Fetched removed items data:", logData);
        setThisMonthRemovedCount(logData.this_month_removed_count);
        setThisMonthRemoved(logData.this_month_removed);
      } catch (error) {
        console.error("Error fetching items:", error);
      }
    }

    fetchStockInfo();
  }, []);

  return (
    <div className="wrapper w-full mx-auto my-0 mb-20 md:mb-4 pt-2">
      <div className="grid grid-cols-2  gap-2 md:gap-10 mb-4 mt-4">
        <InventoryData
          info="This Month's Removed Count"
          digits={thisMonthRemovedCount}
        ></InventoryData>
        <InventoryData
          info="This Month's Removed"
          digits={thisMonthRemoved}
          currency="₦"
        ></InventoryData>
      </div>

      <div>
        {/* Removed the heading from here, only render RemovedTable */}
        <RemovedTable />
      </div>
    </div>
  );
};

export default Removed;
