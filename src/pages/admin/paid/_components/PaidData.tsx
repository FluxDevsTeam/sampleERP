interface PaidDataProps {
  info: string;
  digits: number;
  currency?: string;
}

const PaidData = (PaidData: PaidDataProps) => {
  const formattedDigits = (PaidData.digits ?? 0).toLocaleString();

  return (
    <div>
      <div className="bg-white rounded pl-4 py-5 shadow grid items-center h-full">
        <p
          style={{ fontSize: "clamp(10px, 3vw, 20px)" }}
          className="text-blue-400 font-bold"
        >
          {PaidData.info}
        </p>
        <p
          style={{ fontSize: "clamp(10px, 3vw, 24px)" }}
          className="font-medium "
        >
          {PaidData.currency? `${PaidData.currency} ` : ''}{formattedDigits}
        </p>
      </div>
    </div>
  );
};

export default PaidData; 