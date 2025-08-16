import React from "react";

interface ProjectDashboardCardProps {
  label: string;
  value: number | string;
  isMonetary: boolean;
}

const NO_NAIRA_LABELS = [
  "Projects (Year)",
  "Projects (Month)",
  "Percentage Projects",
  "Percentage Shop",
];

const ProjectDashboardCard: React.FC<ProjectDashboardCardProps> = ({ label, value, isMonetary }) => {
  const isNumber = typeof value === "number";
  const isPercent = typeof value === "string" && value.trim().endsWith("%");
  const showNaira = isNumber && isMonetary && !NO_NAIRA_LABELS.includes(label);

  // Format number with naira sign and commas (no k, m, b)
  const formatNaira = (val: number) => {
    const sign = val < 0 ? "-" : "";
    return `${sign}₦${Math.abs(val).toLocaleString("en-NG")}`;
  };

  return (
    <div className="p-1 sm:p-2 border rounded-lg shadow-md flex flex-col items-center justify-center min-h-[74px] sm:min-h-[100px]">
      <div className="text-xs sm:text-sm lg:text-base font-medium text-center mb-1 leading-tight">{label}</div>
      <div className="text-sm sm:text-base font-semibold text-blue-400 text-center">
        {showNaira && isNumber ? formatNaira(Number(value)) : isNumber ? value.toLocaleString("en-NG") : value}
      </div>
    </div>
  );
};

export default ProjectDashboardCard;