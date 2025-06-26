import { useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { fetchWorkersSummary, WorkersSummary } from "./_api/apiService";
import WorkersTable from "./_components/WorkersTable";
import WorkersData from "./_components/WorkersData";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faPlus,
} from "@fortawesome/free-solid-svg-icons";

const Workers = () => {
  document.title = "Workers - KDC Admin";
  const tableHeaders = ["Name", "Status", "Start Date", "Salary Amount", "Contract Value", "Details"];
  const [totalWorkersCount, setTotalWorkersCount] = useState(0);
  const [totalSalaryWorkersCount, setTotalSalaryWorkersCount] = useState(0);
  const [totalContractorsCount, setTotalContractorsCount] = useState(0);
  const [totalSalaryPaid, setTotalSalaryPaid] = useState(0);
  const [totalContractorsPaid, setTotalContractorsPaid] = useState(0);

  const [searchInput, setSearchInput] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [statusFilter, setStatusFilter] = useState<string | undefined>(undefined);
  const [isTableModalOpen, setIsTableModalOpen] = useState(false);

  const { data, isLoading, error } = useQuery<WorkersSummary, Error>({
    queryKey: ["workersSummary", searchQuery, statusFilter],
    queryFn: () => fetchWorkersSummary(),
  });

  useEffect(() => {
    if (data?.results) {
      setTotalWorkersCount(data.results.total_workers_count);
      setTotalSalaryWorkersCount(data.results.total_salary_workers_count);
      setTotalContractorsCount(data.results.total_contractors_count);
      setTotalSalaryPaid(data.results.total_salary_paid);
      setTotalContractorsPaid(data.results.total_contractors_paid);
    }
  }, [data]);

  const handleSearch = () => {
    setSearchQuery(searchInput);
  };

  const handleClear = () => {
    setSearchInput("");
    setSearchQuery("");
    setStatusFilter(undefined);
  };

  if (isLoading) return <p>Loading workers data...</p>;
  if (error) return <p>Error loading workers: {error.message}</p>;

  return (
    <div className="wrapper w-11/12 mx-auto my-2 pl-1 pt-4">
      {/* Worker Summary Cards */}
      <div
        className={`grid grid-cols-2 lg:grid-cols-4 gap-4 mb-11 ${
          isTableModalOpen ? "blur-md" : ""
        }`}
      >
        <WorkersData info="Total Workers" digits={totalWorkersCount} />
        <WorkersData info="Total Salary Workers" digits={totalSalaryWorkersCount} />
        <WorkersData info="Total Contractors" digits={totalContractorsCount} />
        <WorkersData info="Total Salary Paid" digits={totalSalaryPaid} currency="₦ " />
        <WorkersData info="Total Contractors Paid" digits={totalContractorsPaid} currency="₦ " />

      </div>

      <h1
        style={{ fontSize: "clamp(16.5px, 3vw, 30px)" }}
        className={`font-semibold py-5 mt-2 ${
          isTableModalOpen ? "blur-md" : ""
        }`}
      >
        Worker Details
      </h1>

      <div
        className={`flex justify-between items-center my-6 ${
          isTableModalOpen ? "blur-md" : ""
        }`}
      >
        {/* Left-aligned group: Search Bar and Filters */}
        <div className="flex items-center gap-x-4">
          {/* Search Bar */}
          <div className="flex items-center gap-x-2 flex-grow">
            <input
              type="text"
              placeholder="Search for workers by name..."
              className="border p-2 rounded w-full"
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") handleSearch();
              }}
            />
            <button
              onClick={handleSearch}
              className="bg-blue-400 text-white px-4 py-2 rounded hover:bg-blue-500"
            >
              Search
            </button>
            <button
              onClick={handleClear}
              className="bg-gray-300 text-black px-4 py-2 rounded hover:bg-gray-400"
            >
              Clear
            </button>
          </div>

          {/* Filter Dropdown for Status */}
          <div className="relative">
            <button
              onClick={() => setIsFilterOpen(!isFilterOpen)}
              className="border p-2 rounded flex items-center"
            >
              {statusFilter ? `Status: ${statusFilter}` : 'Filter by Status'}
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
            {isFilterOpen && (
              <div className="absolute right-0 mt-2 w-48 bg-white border rounded-lg shadow-xl z-10">
                <div className="p-4">
                  <label className="flex items-center cursor-pointer mb-2">
                    <input
                      type="radio"
                      name="statusFilter"
                      className="form-radio h-4 w-4 text-blue-600 mr-2"
                      checked={statusFilter === 'active'}
                      onChange={() => {
                        setStatusFilter('active');
                        setIsFilterOpen(false);
                      }}
                    />
                    <span>Active</span>
                  </label>
                  <label className="flex items-center cursor-pointer mb-2">
                    <input
                      type="radio"
                      name="statusFilter"
                      className="form-radio h-4 w-4 text-blue-600 mr-2"
                      checked={statusFilter === 'inactive'}
                      onChange={() => {
                        setStatusFilter('inactive');
                        setIsFilterOpen(false);
                      }}
                    />
                    <span>Inactive</span>
                  </label>
                  <label className="flex items-center cursor-pointer mb-2">
                    <input
                      type="radio"
                      name="statusFilter"
                      className="form-radio h-4 w-4 text-blue-600 mr-2"
                      checked={statusFilter === 'on_leave'}
                      onChange={() => {
                        setStatusFilter('on_leave');
                        setIsFilterOpen(false);
                      }}
                    />
                    <span>On Leave</span>
                  </label>
                  {statusFilter && (
                    <button
                      onClick={() => {
                        setStatusFilter(undefined);
                        setIsFilterOpen(false);
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

        {/* Add Worker Button (Right-aligned) - Placeholder for now */}
        {/* <button
          onClick={() => setIsAddModalOpen(true)}
          className="bg-blue-400 text-white px-4 py-2 rounded hover:bg-blue-500"
        >
          <FontAwesomeIcon className="pr-2" icon={faPlus} />
          Add Worker
        </button> */}
      </div>

      <div
        className={`min-h-0 overflow-auto ${
          isTableModalOpen ? "blur-md" : ""
        }`}
      >
        
        <WorkersTable
          headers={tableHeaders}
          searchQuery={searchQuery}
          statusFilter={statusFilter}
          isTableModalOpen={isTableModalOpen}
        />
      </div>
    </div>
  );
};

export default Workers;