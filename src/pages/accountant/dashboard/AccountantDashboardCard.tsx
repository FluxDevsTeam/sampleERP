import React from "react";

interface AccountantDashboardCardProps {
  title: string;
  value: number;
  currency?: string;
}

const AccountantDashboardCard: React.FC<AccountantDashboardCardProps> = ({ title, value, currency }) => {
  // Format the value with thousand separators, handling null or undefined values
  const formattedValue = (value ?? 0).toLocaleString();
  return (
    <div className="bg-white shadow-2xl grid items-center max-sm:py-1 sm:py-6 pl-2 sm:pl-3">
      <p className="text-xs font-semibold" style={{ fontSize: "clamp(12px, 3vw, 16px)" }}>{title}</p>
      <h2 className="text-blue-400 font-bold" style={{ fontSize: "clamp(10px, 3vw, 23px)" }}>
        {currency}{formattedValue}
      </h2>
    </div>
  );
};

export default AccountantDashboardCard; 