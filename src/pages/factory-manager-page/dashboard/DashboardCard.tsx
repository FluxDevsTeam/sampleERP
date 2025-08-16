import React from "react";

interface DashboardCardProps {
  label: string;
  value: number | string;
}

const NO_NAIRA_LABELS = [
  "Deprecated Assets",
  "Active Assets",
  "All Customers",
  "Active Customers",
  "Owing Customers",
  "Total Workers",
  "Active Workers",
  "Total Contractors",
  "Active Contractors",
  "Inventory Items",
  "Raw Materials Count",
  "Sales Count",
  "Project Count",
];

const DashboardCard: React.FC<DashboardCardProps> = ({ label, value }) => {
  const isNumber = typeof value === "number";
  const isPercent = typeof value === "string" && value.trim().endsWith("%");
  const showNaira = isNumber && !NO_NAIRA_LABELS.includes(label);

  return (
    <div className="p-1 sm:p-2 border rounded-lg shadow-md flex flex-col items-center justify-center min-h-[74px] sm:min-h-[100px]">
      <div className="text-xs sm:text-sm lg:text-base font-medium text-center mb-1 leading-tight">{label}</div>
      <div className="text-sm sm:text-base font-semibold text-blue-400 text-center">
        {showNaira ? "₦" : ""}
        {isNumber ? value.toLocaleString("en-NG") : value}
      </div>
    </div>
  );
};

export default DashboardCard;