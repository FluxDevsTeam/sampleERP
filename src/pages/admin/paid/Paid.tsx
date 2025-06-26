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
    <div className="wrapper w-11/12 mx-auto my-0 pl-1 pt-2">
      <div
        className={`grid grid-cols-2 lg:grid-cols-3 gap-4 mb-2 mt-4 ${isTableModalOpen ? "blur-md" : ""}`}
      >
        <PaidData info="Total Paid" digits={totalPaid} currency="₦ " />
        <PaidData info="Salary Paid This Month" digits={totalSalaryPaid} currency="₦ " />
        <PaidData info="Contractors Paid This Month" digits={totalContractorsPaid} currency="₦ " />
      </div>

      <div>
        <h1
          style={{ fontSize: "clamp(16.5px, 3vw, 30px)" }}
          className={`font-semibold py-2 mt-2 ${isTableModalOpen ? "blur-md" : ""}`}
        >
          Paid Entries
        </h1>

        <div
          className={`${isTableModalOpen ? "blur-md" : ""}`}
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