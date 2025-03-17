import { MdArrowOutward } from "react-icons/md";
import Frame180 from "../../../../assets/images/Frame180.png";

interface ContractorsSummary {
  count: number;
  next: string | null;
  previous: string | null;
  results: {
    all_contractors_count: number;
    all_active_contractors_count: number;
    total_contractors_monthly_pay: number;
    total_contractors_weekly_pay: number;
  };
}

interface ContractorHeaderProps {
  data: ContractorsSummary;
}

const ContractorHeader = ({ data }: ContractorHeaderProps) => {
  const summaryItems = [
    { label: "Total Contractors", value: data.results.all_contractors_count },
    { label: "Active Contractors", value: data.results.all_active_contractors_count },
    { label: "Total Monthly Pay", value: `NGN ${data.results.total_contractors_monthly_pay}` },
    { label: "Total Weekly Pay", value: `NGN ${data.results.total_contractors_weekly_pay}` },
  ];

  return (
    <div className="p-6">
      <p className="md:text-3xl text-black font-bold py-6">Contractors Overview</p>

      <div className="md:grid md:grid-cols-4 grid grid-cols-1 md:space-x-4 space-x-0 md:space-y-0 space-y-4">
        {summaryItems.map((item, index) => (
          <div key={index} className="p-4 border rounded-lg shadow-md">
            <div className="flex justify-between items-center text-xl">
              <p>{item.label}</p>
              <img src={Frame180 || "/placeholder.svg"} alt="icon" />
            </div>
            <div className="flex space-x-8 text-sm">
              <span className="text-green-200">
                <MdArrowOutward />
              </span>
              <span>{item.value}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ContractorHeader;