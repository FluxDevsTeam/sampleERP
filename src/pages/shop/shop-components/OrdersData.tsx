// import React from 'react';

interface OrdersDataProps {
  info: string;
  digits: number;
//   chart?: React.ReactNode;
}

const OrdersData = (ordersData: OrdersDataProps) => {
  return (
    <div className="bg-white shadow-2xl grid items-center py-6 pl-3">
      <p className="text-xs font-medium">{ordersData.info}</p>
      <h2 className="text-blue-400 font-bold text-2xl">{ordersData.digits}</h2>
      {/* {ordersData.chart && <div className="mt-4" style={{ maxWidth: '850px' }}>{ordersData.chart}</div>} */}
    </div>
  );
};

export default OrdersData;
1