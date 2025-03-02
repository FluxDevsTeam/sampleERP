import OrdersData from "./shop-components/OrdersData";
import Areachart from "./shop-components/AreaChart";
import DashboardTable from "./shop-components/DashboardTable";

const Orders = () => {
  document.title = "Orders Us";

  const tableHeaders = ["Product", "Category", "Stock Status", "Details"];

  return (
    <div className="w-11/12 mx-auto mt-6 pl-1 pt-2">
      <div className="grid gap-x-6 mb-16 items-center md:grid-cols-[40%_60%]">
        <div className="grid grid-cols-2 gap-3">
          <OrdersData info="Store Status" digits={31}></OrdersData>
          <OrdersData info="Total Sales" digits={67}></OrdersData>
          <OrdersData info="Total Profit" digits={32}></OrdersData>
          <OrdersData info="Total Sales" digits={9}></OrdersData>
          <OrdersData info="All Orders Today" digits={4}></OrdersData>
          <OrdersData info="Pending Offers" digits={12}></OrdersData>
        </div>

        <div className="grid items-center rounded-sm shadow-md py-4">
          <Areachart></Areachart>
        </div>
      </div>

      <h1
        style={{ fontSize: "clamp(16.5px, 3vw, 30px)" }}
        className="font-semibold mb-5"
      >
        Orders
      </h1>
      <DashboardTable headers={tableHeaders} />
    </div>
  );
};

export default Orders;
