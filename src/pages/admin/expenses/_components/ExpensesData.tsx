interface ExpensesDataProps {
  info: string;
  digits: number;
  currency?: string;
}

const ExpensesData = (ExpensesData: ExpensesDataProps) => {
  const formattedDigits = (ExpensesData.digits ?? 0).toLocaleString();

  return (
    <div className="p-2 sm:p-4 border rounded-lg shadow-md flex flex-col items-center justify-center py-4">
      <div className="text-xs sm:text-sm lg:text-base font-medium text-center mb-2 leading-tight">{ExpensesData.info}</div>
      <div className="text-sm sm:text-base lg:text-lg font-semibold text-blue-400 text-center">
        {ExpensesData.currency}{formattedDigits}
      </div>
    </div>
  );
};

export default ExpensesData;