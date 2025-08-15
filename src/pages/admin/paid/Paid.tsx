import { useQuery } from "@tanstack/react-query";
import { fetchPaidSummary, PaidSummary } from "./_api/apiService";
import PaidTable from "./_components/PaidTable";
import PaidData from "./_components/PaidData";
import { useEffect, useState } from "react";

const Paid = () => {
  document.title = "Paid - KDC Admin";
  const [totalPaid, setTotalPaid] = useState(0);
  const [totalSalaryPaid, setTotalSalaryPaid] = useState(0);
  const [totalContractorsPaid, setTotalContractorsPaid] = useState(0);
  const [isTableModalOpen, setIsTableModalOpen] = useState(false);

  const { data, isLoading, error } = useQuery<PaidSummary, Error>({
    queryKey: ["paidSummary"],
    queryFn: fetchPaidSummary,
  });

  useEffect(() => {
    if (data) {
      setTotalPaid(data.monthly_total);
      setTotalSalaryPaid(data.salary_paid_this_month);
      setTotalContractorsPaid(data.contractors_paid_this_month);
    }
  }, [data]);

  if (isLoading) return <p>Loading paid data...</p>;
  if (error) return <p>Error loading paid: {error.message}</p>;

  return (
    <div className="wrapper w-full max-w-[98vw] sm:w-full mx-auto px-1 md:pt-2 mb-20 md:mb-4">
      <div
        className={`grid grid-cols-3 md:gap-4 gap-2 mb-2 md:mt-4 ${isTableModalOpen ? "blur-md" : ""}`}
      >
        <PaidData info="Total Paid This Month" digits={totalPaid} currency="₦ " />
        <PaidData info="Salary Paid This Month" digits={totalSalaryPaid} currency="₦ " />
        <PaidData info="Contr. Paid This Month" digits={totalContractorsPaid} currency="₦ " />
      </div>

      <div className="w-full">
        <h1
          style={{ fontSize: "clamp(16.5px, 3vw, 30px)" }}
          className={`font-semibold md:py-2 md:mt-2 mb-2 text-[18px] sm:text-[22px] md:text-[26px] lg:text-[30px] ${isTableModalOpen ? "blur-md" : ""}`}
        >
          Paid Entries
        </h1>

        <div
          className={`w-full ${isTableModalOpen ? "blur-md" : ""}`}
        >
          <PaidTable
            isTableModalOpen={isTableModalOpen}
          />
        </div>
      </div>
    </div>
  );
};

export default Paid;