interface IncomeDataProps {
  info: string;
  digits: number;
  currency?: string;
  icon?: React.ReactNode;
}

const IncomeData = (props: IncomeDataProps) => {
  const formattedDigits = (props.digits ?? 0).toLocaleString();

  return (
    <div className="p-2 sm:p-4 border rounded-lg shadow-md flex flex-col items-center justify-center py-4">
      <div className="text-xs sm:text-sm lg:text-base font-medium text-center mb-2 leading-tight flex items-center gap-2">
        {props.icon ? (
          <span className="text-blue-400 text-lg max-sm:text-sm lg:text-sm">{props.icon}</span>
        ) : null}
        {props.info}
      </div>
      <div className="text-sm sm:text-base lg:text-lg font-semibold text-blue-400 text-center">
        {props.currency ? `${props.currency} ` : ""}
        {formattedDigits}
      </div>
    </div>
  );
};

export default IncomeData;


