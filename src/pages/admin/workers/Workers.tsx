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
    <div className="wrapper w-11/12 mx-auto mb-2 pl-1 pt-0">
      {/* Analysis Sections Container */}
      <div
        className={`grid grid-cols-1 md:grid-cols-2 gap-4 mb-2 ${
          isTableModalOpen ? "blur-md" : ""
        }`}
      >
        {/* Salary Analysis Section */}
        <div>
          <h2 style={{ fontSize: "clamp(12.5px, 3vw, 24px)" }} className="font-medium py-2 mt-0 ">
            Salary Analysis
          </h2>
          <div
            className="grid grid-cols-2 gap-4"
          >
            <WorkersData info="Total Salary Workers" digits={totalSalaryWorkersCount} />
            <WorkersData info="Active Salary Workers" digits={activeSalaryWorkersCount} />
            <WorkersData info="Monthly Salary" digits={totalSalaryWorkersMonthlyPay} currency="₦ " />
            <WorkersData info="Total Salary Paid" digits={totalSalaryPaidSummary} currency="₦ " />
          </div>
        </div>

        {/* Contractor Analysis Section */}
        <div>
          <h2 style={{ fontSize: "clamp(12.5px, 3vw, 24px)" }} className="font-medium py-2 mt-0 ">
            Contractor Analysis
          </h2>
          <div
            className="grid grid-cols-2 gap-4"
          >
            <WorkersData info="Total Contractors" digits={totalContractorsCount} />
            <WorkersData info="Active Contractors" digits={allActiveContractorsCount} />
            <WorkersData info="Monthly Pay" digits={totalContractorsMonthlyPay} currency="₦ " />
            <WorkersData info="Weekly Pay" digits={totalContractorsWeeklyPay} currency="₦ " />
          </div>
        </div>
      </div>

      {/* Salary Worker Section */}
      <h1
        style={{ fontSize: "clamp(12.5px, 3vw, 24px)" }}
        className={`font-semibold py-1 mt-0 ${
          isTableModalOpen ? "blur-md" : ""
        }`}
      >
        Salary Worker Details
      </h1>

      <div
        className={`flex justify-between items-center mb-3 ${
          isTableModalOpen ? "blur-md" : ""
        }`}
      >
        {/* Add Salary Worker Button */}
        <button
          onClick={() => navigate("/admin/add-worker")}
          className="px-4 py-2 bg-blue-400 text-white rounded hover:bg-blue-500 transition-colors flex items-center gap-2"
        >
          <FontAwesomeIcon icon={faPlus} />
          Add Salary Worker
        </button>
        {/* Left-aligned group: Search Bar and Filters for Salary Workers */}
        <div className="flex items-center gap-x-4">
          {/* Search Bar */}
          <div className="flex items-center gap-x-2">
            <input
              type="text"
              placeholder="Search for salary workers..."
              className="border p-2 rounded w-full"
              value={salarySearchInput}
              onChange={(e) => setSalarySearchInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") handleSalarySearch();
              }}
            />
            <button
              onClick={handleSalarySearch}
              className="bg-blue-400 text-white px-4 py-2 rounded hover:bg-blue-500"
            >
              Search
            </button>
            <button
              onClick={handleSalaryClear}
              className="bg-gray-300 text-black px-4 py-2 rounded hover:bg-gray-400"
            >
              Clear
            </button>
          </div>

          {/* Filter Dropdown for Status */}
          <div className="relative">
            <button
              onClick={() => setIsSalaryFilterOpen(!isSalaryFilterOpen)}
              className="border p-2 rounded flex items-center"
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
              <div className="absolute right-0 mt-2 w-48 bg-white border rounded-lg shadow-xl z-10">
                <div className="p-4">
                  <label className="flex items-center cursor-pointer mb-2">
                    <input
                      type="radio"
                      name="salaryStatusFilter"
                      className="form-radio h-4 w-4 text-blue-600 mr-2"
                      checked={salaryStatusFilter === true}
                      onChange={() => {
                        setSalaryStatusFilter(true);
                        setIsSalaryFilterOpen(false);
                      }}
                    />
                    <span>Active</span>
                  </label>
                  <label className="flex items-center cursor-pointer mb-2">
                    <input
                      type="radio"
                      name="salaryStatusFilter"
                      className="form-radio h-4 w-4 text-blue-600 mr-2"
                      checked={salaryStatusFilter === false}
                      onChange={() => {
                        setSalaryStatusFilter(false);
                        setIsSalaryFilterOpen(false);
                      }}
                    />
                    <span>Not Active</span>
                  </label>
                  {/* Removed On Leave option */}
                  {salaryStatusFilter !== undefined && (
                    <button
                      onClick={() => {
                        setSalaryStatusFilter(undefined);
                        setIsSalaryFilterOpen(false);
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

      {/* Contractor Section */}
      <h1
        style={{ fontSize: "clamp(12.5px, 3vw, 24px)" }}
        className={`font-semibold py-1 mt-0 border-t border-gray-500 pt-3 mb-0 ${
          isTableModalOpen ? "blur-md" : ""
        }`}
      >
        Contractor Details
      </h1>

      <div
        className={`flex justify-between items-center mt-3 mb-6 pt-3 ${
          isTableModalOpen ? "blur-md" : ""
        }`}
      >
        {/* Add Contractor Button */}
        <button
          onClick={() => navigate("/admin/add-contractor")}
          className="px-4 py-2 bg-blue-400 text-white rounded hover:bg-blue-500 transition-colors flex items-center gap-2"
        >
          <FontAwesomeIcon icon={faPlus} />
          Add Contractor
        </button>
        {/* Left-aligned group: Search Bar and Filters for Contractors */}
        <div className="flex items-center gap-x-4">
          {/* Search Bar */}
          <div className="flex items-center gap-x-2">
            <input
              type="text"
              placeholder="Search for contractors by name..."
              className="border p-2 rounded w-full"
              value={contractorSearchInput}
              onChange={(e) => setContractorSearchInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") handleContractorSearch();
              }}
            />
            <button
              onClick={handleContractorSearch}
              className="bg-blue-400 text-white px-4 py-2 rounded hover:bg-blue-500"
            >
              Search
            </button>
            <button
              onClick={handleContractorClear}
              className="bg-gray-300 text-black px-4 py-2 rounded hover:bg-gray-400"
            >
              Clear
            </button>
          </div>

          {/* Filter Dropdown for Status */}
          <div className="relative">
            <button
              onClick={() => setIsContractorFilterOpen(!isContractorFilterOpen)}
              className="border p-2 rounded flex items-center"
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