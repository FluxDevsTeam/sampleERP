import InventoryData from "./Inventory Components/InventoryData";
import Table from "./Inventory Components/InventoryTable";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import inventoryDataJson from "@/data/shop/inventory/inventory.json";

const Inventory = () => {
  document.title = "Inventory - Admin";
  const navigate = useNavigate();
  const tableHeaders = ["Product", "Category", "Stock Status", "Details"];
  const [totalCostValue, setTotalCostValue] = useState(0);
  const [totalProfit, setTotalProfit] = useState(0);
  const [totalStockCount, setTotalStockCount] = useState(0);
  const [totalStockValue, setTotalStockValue] = useState(0);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    setTotalCostValue(inventoryDataJson.metrics.total_cost_value ?? 0);
    setTotalProfit(inventoryDataJson.metrics.total_profit ?? 0);
    setTotalStockCount(inventoryDataJson.metrics.total_stock_count ?? 0);
    setTotalStockValue(inventoryDataJson.metrics.total_stock_value ?? 0);
  }, []);

  return (
    <div className="wrapper w-full mx-auto mt-2 pl-1 pt-4 mb-20">
      <div
        className={`grid grid-cols-2 lg:grid-cols-4 gap-4 mb-4 ${
          isModalOpen ? "blur-md" : ""
        }`}
      >
        <InventoryData info="Total Stock Count" digits={totalStockCount} />
        <InventoryData
          info="Total Cost Value"
          digits={totalCostValue}
          currency="₦ "
        />
        <InventoryData info="Total Profit" digits={totalProfit} currency="₦ " />
        <InventoryData
          info="Total Stock Value"
          digits={totalStockValue}
          currency="₦ "
        />
      </div>
      <Table headers={tableHeaders} onModalChange={setIsModalOpen} />
    </div>
  );
};

export default Inventory;