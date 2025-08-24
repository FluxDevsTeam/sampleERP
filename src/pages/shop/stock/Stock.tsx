import InventoryData from "../inventory/Inventory Components/InventoryData";
import { useState, useEffect } from "react";
import StockTable from "./Stock Components/StockTable";
import stockData from "../../../data/shop/stock/stockData.json";

const Stock = () => {
  const [stockDataState, setStockData] = useState<any>(stockData);

  return (
    <div className="wrapper w-full mx-auto my-0 pl-1 mb-20 pt-2">
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-2 max-sm:gap-1 mb-0 md:mb-6 mt-2">
        <InventoryData info="Monthly Stock Additions" digits={stockDataState.monthly_added_stock_count} />
        <InventoryData info="Yearly Stock Additions" digits={stockDataState.yearly_added_stock_count} />
        <InventoryData info="Monthly Stock Value Added" digits={stockDataState.monthly_added_total_cost_price} currency="₦" />
        <InventoryData info="Yearly Stock Value Added" digits={stockDataState.yearly_added_total_cost_price} currency="₦" />
      </div>
      <div>
        <StockTable />
      </div>
    </div>
  );
};

export default Stock;