interface IncomeDataProps {
  info: string;
  digits: number;
  currency?: string;
  icon?: React.ReactNode;
}

const IncomeData = (props: IncomeDataProps) => {
  const formattedDigits = (props.digits ?? 0).toLocaleString();

  return (
    <div>
      <div className="bg-white rounded pl-4 py-5 shadow grid items-center h-full">
        <div className="flex items-center gap-2">
          {props.icon ? (
            <span className="text-blue-400 text-lg max-sm:text-sm lg:text-sm">{props.icon}</span>
          ) : null}
          <p className="text-blue-400 font-bold max-sm:text-sm text-lg  lg:text-base">
            {props.info}
          </p>
        </div>
        <p className="font-medium text-xl max-sm:text-sm lg:text-lg">
          {props.currency ? `${props.currency} ` : ""}
          {formattedDigits}
        </p>
      </div>
    </div>
  );
};

export default IncomeData;


