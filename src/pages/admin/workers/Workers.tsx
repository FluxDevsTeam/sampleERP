import { useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { fetchWorkersSummary, WorkersSummary } from "./_api/apiService";
import SalaryWorkersTable from "./_components/SalaryWorkersTable";
import ContractorsTable from "./_components/ContractorsTable";
import WorkersData from "./_components/WorkersData";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faPlus,
} from "@fortawesome/free-solid-svg-icons";
import { useNavigate } from "react-router-dom";

const Workers = () => {
  document.title = "Workers - KDC Admin";
  const salaryTableHeaders = ["First Name", "Last Name", "Status", "Date Joined", "Salary Amount", "Details", "Record"];
  const contractorTableHeaders = ["First Name", "Last Name", "Status", "Date Joined", "Details", "Record"];

  const [totalSalaryWorkersCount, setTotalSalaryWorkersCount] = useState(0);
  const [totalContractorsCount, setTotalContractorsCount] = useState(0);
  const [totalSalaryPaid, setTotalSalaryPaid] = useState(0);
  const [totalContractorsPaid, setTotalContractorsPaid] = useState(0);

  // New state variables for detailed salary worker summary
  const [activeSalaryWorkersCount, setActiveSalaryWorkersCount] = useState(0);
  const [totalSalaryWorkersMonthlyPay, setTotalSalaryWorkersMonthlyPay] = useState(0);
  const [totalSalaryPaidSummary, setTotalSalaryPaidSummary] = useState(0); // Renamed to avoid conflict

  // New state variables for detailed contractor summary
  const [allContractorsCount, setAllContractorsCount] = useState(0);
  const [allActiveContractorsCount, setAllActiveContractorsCount] = useState(0);
  const [totalContractorsMonthlyPay, setTotalContractorsMonthlyPay] = useState(0);
  const [totalContractorsWeeklyPay, setTotalContractorsWeeklyPay] = useState(0);

  // State for Salary Workers search and filter
  const [salarySearchInput, setSalarySearchInput] = useState("");
  const [salarySearchQuery, setSalarySearchQuery] = useState("");
  const [isSalaryFilterOpen, setIsSalaryFilterOpen] = useState(false);
  const [salaryStatusFilter, setSalaryStatusFilter] = useState<boolean | undefined>(undefined);

  // State for Contractors search and filter
  const [contractorSearchInput, setContractorSearchInput] = useState("");
  const [contractorSearchQuery, setContractorSearchQuery] = useState("");
  const [isContractorFilterOpen, setIsContractorFilterOpen] = useState(false);
  const [contractorStatusFilter, setContractorStatusFilter] = useState<boolean | undefined>(undefined);

  const [isTableModalOpen, setIsTableModalOpen] = useState(false); // This likely controls blur for any open modal

  const navigate = useNavigate();

  const { data, isLoading, error } = useQuery<WorkersSummary, Error>({
    queryKey: ["workersSummary"],
    queryFn: () => fetchWorkersSummary(),
  });

  useEffect(() => {
    if (data?.results) {
      setTotalSalaryWorkersCount(data.results.salary_workers_count);
      setTotalContractorsCount(data.results.all_contractors_count);
      setTotalSalaryPaid(data.results.total_paid);
      setTotalContractorsPaid(data.results.total_contractors_weekly_pay + data.results.total_contractors_monthly_pay);

      // Set new state variables for salary worker summary
      setActiveSalaryWorkersCount(data.results.active_salary_workers_count);
      setTotalSalaryWorkersMonthlyPay(data.results.total_salary_workers_monthly_pay);
      setTotalSalaryPaidSummary(data.results.total_paid); // Populate totalSalaryPaidSummary

      // Set new state variables for contractor summary
      setAllContractorsCount(data.results.all_contractors_count);
      setAllActiveContractorsCount(data.results.all_active_contractors_count);
      setTotalContractorsMonthlyPay(data.results.total_contractors_monthly_pay);
      setTotalContractorsWeeklyPay(data.results.total_contractors_weekly_pay);
    }
  }, [data]);

  // Handlers for Salary Workers
  const handleSalarySearch = () => {
    setSalarySearchQuery(salarySearchInput);
  };

  const handleSalaryClear = () => {
    setSalarySearchInput("");
    setSalarySearchQuery("");
    setSalaryStatusFilter(undefined);
  };

  // Handlers for Contractors
  const handleContractorSearch = () => {
    setContractorSearchQuery(contractorSearchInput);
  };

  const handleContractorClear = () => {
    setContractorSearchInput("");
    setContractorSearchQuery("");
    setContractorStatusFilter(undefined);
  };

  if (isLoading) return <p>Loading workers data...</p>;
  if (error) return <p>Error loading workers: {error.message}</p>;

  return (
    <div className="wrapper w-full mx-auto mb-20 md:mb-2 pt-0">
      {/* Analysis Sections Container */}
      <div
        className={`grid grid-cols-1 md:grid-cols-2 gap-4 mb-2 ${
          isTableModalOpen ? "blur-md" : ""
        }`}
      >
        {/* Salary Analysis Section */}
        <div>
          <h2 className="font-medium text-blue-400 text-lg py-0 mt-0 ">
            Salary Analysis
          </h2>
          <div className="grid grid-cols-2 gap-4">
            <WorkersData info="Total Salary Workers" digits={totalSalaryWorkersCount} />
            <WorkersData info="Active Salary Workers" digits={activeSalaryWorkersCount} />
            <WorkersData info="Monthly Salary" digits={totalSalaryWorkersMonthlyPay} currency="₦ " />
            <WorkersData info="Total Salary Paid" digits={totalSalaryPaidSummary} currency="₦ " />
          </div>
        </div>
        {/* Contractor Analysis Section */}
        <div>
          <h2 className="font-medium text-lg text-blue-400 py-0 mt-0 ">
            Contractor Analysis
          </h2>
          <div className="grid grid-cols-2 gap-4">
            <WorkersData info="Total Contractors" digits={totalContractorsCount} />
            <WorkersData info="Active Contractors" digits={allActiveContractorsCount} />
            <WorkersData info="Monthly Pay" digits={totalContractorsMonthlyPay} currency="₦ " />
            <WorkersData info="Weekly Pay" digits={totalContractorsWeeklyPay} currency="₦ " />
          </div>
        </div>
      </div>

      {/* Salary Worker Section Heading and Add Button Row */}
      <div className={`flex flex-row items-center justify-between gap-2 mb-2 ${isTableModalOpen ? "blur-md" : ""}`}> 
        <h1
          style={{ fontSize: "clamp(12.5px, 3vw, 24px)" }}
          className="font-semibold py-1 mt-0"
        >
          Salary Worker Details
        </h1>
        <button
          onClick={() => navigate("/admin/add-worker")}
          className="border border-blue-400 text-blue-400 bg-transparent px-2 py-2 rounded hover:bg-blue-50 text-xs sm:text-sm transition-colors flex items-center gap-2"
        >
          <FontAwesomeIcon icon={faPlus} />
          Add Salary Worker
        </button>
      </div>

      {/* Search, Clear, Filter Row - always one line, right aligned, no wrap */}
      <div className={`w-full flex flex-row flex-nowrap justify-end items-center gap-1 mb-2 overflow-x-auto ${isTableModalOpen ? "blur-md" : ""}`}> 
        <input
          type="text"
          placeholder="Search for salary workers..."
          className="border p-2 rounded text-xs w-24 sm:w-40 md:w-56 min-w-[100px]"
          value={salarySearchInput}
          onChange={(e) => setSalarySearchInput(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") handleSalarySearch();
          }}
        />
        <button
          onClick={handleSalarySearch}
          className="border border-blue-400 text-blue-400 bg-transparent px-2 py-2 rounded hover:bg-blue-50 text-xs transition-colors min-w-[40px] flex items-center justify-center"
          aria-label="Search"
        >
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-4 h-4">
            <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-4.35-4.35m0 0A7.5 7.5 0 104.5 4.5a7.5 7.5 0 0012.15 12.15z" />
          </svg>
        </button>
        <button
          onClick={handleSalaryClear}
          className="bg-gray-300 text-black px-2 py-2  rounded hover:bg-gray-400 text-xs whitespace-nowrap min-w-[60px]"
        >
          Clear
        </button>
        <div className="relative min-w-[90px]">
          <button
            onClick={() => setIsSalaryFilterOpen(!isSalaryFilterOpen)}
            className="border p-2 rounded flex items-center text-xs whitespace-nowrap min-w-[90px]"
          >
            {salaryStatusFilter !== undefined ? `Status: ${salaryStatusFilter ? 'Active' : 'Not Active'}` : 'Filter by Status'}
            <svg
              className="w-4 h-4 ml-2"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M19 9l-7 7-7-7"
              ></path>
            </svg>
          </button>
          {isSalaryFilterOpen && (
            <div className="fixed right-0 mt-2 w-48 bg-white border rounded-lg shadow-xl z-10 origin-top-right">
              <div className="p-4">
                <label className="flex items-center cursor-pointer mb-2">
                  <input
                    type="checkbox"
                    className="form-checkbox h-5 w-5 text-blue-600 mr-2"
                    checked={salaryStatusFilter === true}
                    onChange={() => setSalaryStatusFilter(salaryStatusFilter === true ? undefined : true)}
                  />
                  <span>Active</span>
                </label>
                <label className="flex items-center cursor-pointer mb-2">
                  <input
                    type="checkbox"
                    className="form-checkbox h-5 w-5 text-blue-600 mr-2"
                    checked={salaryStatusFilter === false}
                    onChange={() => setSalaryStatusFilter(salaryStatusFilter === false ? undefined : false)}
                  />
                  <span>Not Active</span>
                </label>
              </div>
            </div>
          )}
        </div>
      </div>

      <div
        className={`min-h-0 overflow-auto ${
          isTableModalOpen ? "blur-md" : ""
        }`}
      >
        <SalaryWorkersTable
          headers={salaryTableHeaders}
          searchQuery={salarySearchQuery}
          statusFilter={salaryStatusFilter}
          isTableModalOpen={isTableModalOpen}
        />
      </div>

      {/* Contractor Section Heading and Add Button Row */}
      <div className={`flex flex-row items-center justify-between gap-2 mb-2 mt pt-3 border-t border-gray-500 ${isTableModalOpen ? "blur-md" : ""}`}> 
        <h1
          style={{ fontSize: "clamp(12.5px, 3vw, 24px)" }}
          className="font-semibold py-1 mt-0 mb-0"
        >
          Contractor Details
        </h1>
        <button
          onClick={() => navigate("/admin/add-contractor")}
          className="border border-blue-400 text-blue-400 bg-transparent px-2 py-2 rounded hover:bg-blue-50 text-xs sm:text-sm transition-colors flex items-center gap-2"
        >
          <FontAwesomeIcon icon={faPlus} />
          Add Contractor
        </button>
      </div>

      {/* Contractor Search, Clear, Filter Row - always one line, right aligned, no wrap */}
      <div className={`w-full flex flex-row flex-nowrap justify-end items-center gap-1 mb-2 overflow-x-auto ${isTableModalOpen ? "blur-md" : ""}`}> 
        <input
          type="text"
          placeholder="Search for contractors by name..."
          className="border p-2 rounded text-xs w-32 sm:w-40 md:w-56 min-w-[100px]"
          value={contractorSearchInput}
          onChange={(e) => setContractorSearchInput(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") handleContractorSearch();
          }}
        />
        <button
          onClick={handleContractorSearch}
          className="border border-blue-400 text-blue-400 bg-transparent px-2 py-2 rounded hover:bg-blue-50 text-xs transition-colors min-w-[40px] flex items-center justify-center"
          aria-label="Search"
        >
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-4 h-4">
            <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-4.35-4.35m0 0A7.5 7.5 0 104.5 4.5a7.5 7.5 0 0012.15 12.15z" />
          </svg>
        </button>
        <button
          onClick={handleContractorClear}
          className="bg-gray-300 text-black px-2 py-2 rounded hover:bg-gray-400 text-xs whitespace-nowrap min-w-[60px]"
        >
          Clear
        </button>
        <div className="relative min-w-[90px]">
          <button
            onClick={() => setIsContractorFilterOpen(!isContractorFilterOpen)}
            className="border p-2 rounded flex items-center text-xs whitespace-nowrap min-w-[90px]"
          >
            {contractorStatusFilter !== undefined ? `Status: ${contractorStatusFilter ? 'Active' : 'Not Active'}` : 'Filter by Status'}
            <svg
              className="w-4 h-4 ml-2"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M19 9l-7 7-7-7"
              ></path>
            </svg>
          </button>
          {isContractorFilterOpen && (
            <div className="absolute right-0 mt-2 w-48 bg-white border rounded-lg shadow-xl z-10">
              <div className="p-4">
                <label className="flex items-center cursor-pointer mb-2">
                  <input
                    type="radio"
                    name="contractorStatusFilter"
                    className="form-radio h-4 w-4 text-blue-600 mr-2"
                    checked={contractorStatusFilter === true}
                    onChange={() => {
                      setContractorStatusFilter(true);
                      setIsContractorFilterOpen(false);
                    }}
                  />
                  <span>Active</span>
                </label>
                <label className="flex items-center cursor-pointer mb-2">
                  <input
                    type="radio"
                    name="contractorStatusFilter"
                    className="form-radio h-4 w-4 text-blue-600 mr-2"
                    checked={contractorStatusFilter === false}
                    onChange={() => {
                      setContractorStatusFilter(false);
                      setIsContractorFilterOpen(false);
                    }}
                  />
                  <span>Not Active</span>
                </label>
                {/* Removed On Leave option */}
                {contractorStatusFilter !== undefined && (
                  <button
                    onClick={() => {
                      setContractorStatusFilter(undefined);
                      setIsContractorFilterOpen(false);
                    }}
                    className="text-red-500 mt-2 block"
                  >
                    Clear Filter
                  </button>
                )}
              </div>
            </div>
          )}
        </div>
      </div>

      <div
        className={`min-h-0 overflow-auto ${isTableModalOpen ? "blur-md" : ""}`}
      >
        <ContractorsTable
          headers={contractorTableHeaders}
          searchQuery={contractorSearchQuery}
          statusFilter={contractorStatusFilter}
          isTableModalOpen={isTableModalOpen}
        />
      </div>
    </div>
  );
};

export default Workers;