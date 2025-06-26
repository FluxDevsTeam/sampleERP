interface ExpensesDataProps {
  info: string;
  digits: number;
  currency?: string;
}

const ExpensesData = (ExpensesData: ExpensesDataProps) => {
  const formattedDigits = (ExpensesData.digits ?? 0).toLocaleString();

  return (
    <div>
      <div className="bg-white rounded pl-4 py-5 shadow grid items-center h-full">
        <p
          style={{ fontSize: "clamp(10px, 3vw, 20px)" }}
          className="text-blue-400 font-bold"
        >
          {ExpensesData.info}
        </p>
        <p
          style={{ fontSize: "clamp(10px, 3vw, 24px)" }}
          className="font-medium "
        >
          {ExpensesData.currency? `${ExpensesData.currency} ` : ''}{formattedDigits}
        </p>
      </div>
    </div>
  );
};

export default ExpensesData; 