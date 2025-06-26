import axios from "axios";

const WORKERS_API_URL = "https://backend.kidsdesigncompany.com/api/worker/";
const SALARY_WORKERS_API_URL = "https://backend.kidsdesigncompany.com/api/salary-worker/";
const CONTRACTORS_API_URL = "https://backend.kidsdesigncompany.com/api/contractor/";

interface WorkerEntry {
  id: number;
  name: string;
  status: string; // e.g., 'active', 'inactive', 'on_leave'
  start_date: string;
  end_date?: string;
  // Add other common worker fields here
}

export interface SalaryWorker extends WorkerEntry {
  salary_amount: number;
  position: string;
}

export interface Contractor extends WorkerEntry {
  contract_value: number;
  contract_type: string;
}

interface WorkersSummaryResults {
  total_workers_count: number;
  total_salary_workers_count: number;
  total_contractors_count: number;
  total_salary_paid: number; // Assuming this is part of the summary
  total_contractors_paid: number; // Assuming this is part of the summary
}

export interface WorkersSummary {
  results: WorkersSummaryResults;
}

interface PaginatedWorkersResponse {
  count: number;
  next: string | null;
  previous: string | null;
  results: (SalaryWorker | Contractor)[];
}

export const fetchWorkersSummary = async (): Promise<WorkersSummary> => {
  const accessToken = localStorage.getItem("accessToken");
  const { data } = await axios.get(WORKERS_API_URL + "summary/", { // Assuming a summary endpoint
    headers: {
      Authorization: `JWT ${accessToken}`,
    },
  });
  return data;
};

export const fetchWorkers = async (
  page = 1,
  searchQuery = "",
  statusFilter: string | undefined
): Promise<PaginatedWorkersResponse> => {
  const token = localStorage.getItem("accessToken");
  const params = new URLSearchParams();
  params.append("page", String(page));

  if (searchQuery) {
    params.append("search", searchQuery);
  }
  if (statusFilter) {
    params.append("status", statusFilter);
  }

  const response = await axios.get(`${WORKERS_API_URL}?${params.toString()}`, {
    headers: {
      Authorization: `JWT ${token}`,
    },
  });
  return response.data;
};

// You might also need specific fetches if the main worker endpoint doesn't return all details
export const fetchSalaryWorkerDetails = async (id: number): Promise<SalaryWorker> => {
  const token = localStorage.getItem("accessToken");
  const { data } = await axios.get(`${SALARY_WORKERS_API_URL}${id}/`, {
    headers: {
      Authorization: `JWT ${token}`,
    },
  });
  return data;
};

export const fetchContractorDetails = async (id: number): Promise<Contractor> => {
  const token = localStorage.getItem("accessToken");
  const { data } = await axios.get(`${CONTRACTORS_API_URL}${id}/`, {
    headers: {
      Authorization: `JWT ${token}`,
    },
  });
  return data;
};

export const deleteWorker = async (id: number, type: 'salary' | 'contractor') => {
  const token = localStorage.getItem("accessToken");
  const url = type === 'salary' ? `${SALARY_WORKERS_API_URL}${id}/` : `${CONTRACTORS_API_URL}${id}/`;
  await axios.delete(url, {
    headers: {
      Authorization: `JWT ${token}`,
    },
  });
}; 