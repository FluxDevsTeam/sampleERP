import { MdArrowOutward } from "react-icons/md";
import Frame180 from "../../../../assets/images/Frame180.png";

interface SalaryWorkersSummary {
  count: number;
  next: string | null;
  previous: string | null;
  results: {
    salary_workers_count: number;
    active_salary_workers_count: number;
    total_salary_workers_monthly_pay: number;
    total_paid: number;
  };
}

interface SalaryWorkersHeaderProps {
  data: SalaryWorkersSummary;
}

const SalaryWorkersHeader = ({ data }: SalaryWorkersHeaderProps) => {
  const summaryItems = [
    { label: "Total Salary Workers", value:`NGN ${data.results.salary_workers_count }`},
    { label: "Active Salary Workers", value:`NGN ${data.results.active_salary_workers_count }`},
    { label: "Total Monthly Pay", value: `NGN ${data.results.total_salary_workers_monthly_pay}` },
    { label: "Total Paid", value: `NGN ${data.results.total_paid}` },
  ];

  return (
    <div className="p-6">
      <p className="md:text-3xl text-black font-bold py-6">Salary Workers Overview</p>

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

export default SalaryWorkersHeader;