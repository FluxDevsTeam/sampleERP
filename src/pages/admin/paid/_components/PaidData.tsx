interface PaidDataProps {
  info: string;
  digits: number;
  currency?: string;
}

const PaidData = (PaidData: PaidDataProps) => {
  const formattedDigits = (PaidData.digits ?? 0).toLocaleString();

  return (
    <div className="p-2 sm:p-4 border rounded-lg shadow-md flex flex-col items-center justify-center py-4">
      <div className="text-xs sm:text-sm lg:text-base font-medium text-center mb-2 leading-tight">{PaidData.info}</div>
      <div className="text-sm sm:text-base lg:text-lg font-semibold text-blue-400 text-center">
        {PaidData.currency ? `${PaidData.currency.replace(/\u20a6|\u20A6|\u20A6|\u20a6/g, '₦')}` : ''}{formattedDigits}
      </div>
    </div>
  );
};

export default PaidData;