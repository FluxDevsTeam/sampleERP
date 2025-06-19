import { useQuery } from "@tanstack/react-query";
import SalaryWorkersHeader from "./SalaryWorkersHeader";
import ContractorHeader from "./ContractorHeader";

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

const fetchWithAuth = async (url: string) => {
  const token = localStorage.getItem("accessToken");
  const response = await fetch(url, {
    headers: {
      Authorization: `JWT ${token}`,
      "Content-Type": "application/json",
    },
  });
  if (!response.ok) {
    throw new Error("Network response was not ok");
  }
  return response.json();
};

const fetchSalaryWorkersData = async (): Promise<SalaryWorkersSummary> => {
  return fetchWithAuth(
    "https://backend.kidsdesigncompany.com/api/salary-workers/"
  );
};

// Fetch contractors data
const fetchContractorsData = async (): Promise<ContractorsSummary> => {
  return fetchWithAuth(
    "https://backend.kidsdesigncompany.com/api/contractors/"
  );
};

const Header = () => {
  // Fetch salary workers data
  const {
    data: salaryWorkersData,
    isLoading: isSalaryWorkersLoading,
    error: salaryWorkersError,
  } = useQuery<SalaryWorkersSummary, Error>({
    queryKey: ["SalaryWorkersSummary"],
    queryFn: fetchSalaryWorkersData,
  });

  // Fetch contractors data
  const {
    data: contractorsData,
    isLoading: isContractorsLoading,
    error: contractorsError,
  } = useQuery<ContractorsSummary, Error>({
    queryKey: ["ContractorsSummary"],
    queryFn: fetchContractorsData,
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
