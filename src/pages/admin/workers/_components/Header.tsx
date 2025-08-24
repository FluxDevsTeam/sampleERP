import { useQuery } from "@tanstack/react-query";
import SalaryWorkersHeader from "./SalaryWorkersHeader";
import ContractorHeader from "./ContractorHeader";
import { getSalaryWorkersSummary, getContractorsSummary } from "@/utils/jsonDataService";

// ...existing code...

// ...existing code...

const Header = () => {
  // Fetch salary workers summary from local JSON
  const {
    data: salaryWorkersData,
    isLoading: isSalaryWorkersLoading,
    error: salaryWorkersError,
  } = useQuery({
    queryKey: ["SalaryWorkersSummary"],
    queryFn: getSalaryWorkersSummary,
  });

  // Fetch contractors summary from local JSON
  const {
    data: contractorsData,
    isLoading: isContractorsLoading,
    error: contractorsError,
  } = useQuery({
    queryKey: ["ContractorsSummary"],
    queryFn: getContractorsSummary,
  });

  if (isSalaryWorkersLoading || isContractorsLoading) {
    return <p>Loading...</p>;
  }

  if (salaryWorkersError || contractorsError) {
    return (
      <p>Error: {salaryWorkersError?.message || contractorsError?.message}</p>
    );
  }

  // Ensure data is defined before rendering child components
  if (!salaryWorkersData || !contractorsData) {
    return <p>No data available</p>;
  }

  return (
    <div className="flex flex-col">
      <SalaryWorkersHeader data={salaryWorkersData} />
      <ContractorHeader data={contractorsData} />
    </div>
  );
};

export default Header;
