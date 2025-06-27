import axios from "axios";

const SALARY_WORKERS_API_URL = "https://backend.kidsdesigncompany.com/api/salary-workers/";
const CONTRACTORS_API_URL = "https://backend.kidsdesigncompany.com/api/contractors/";

interface WorkerEntry {
  id: number;
  first_name: string;
  last_name: string;
  start_date: string;
  end_date?: string;
  date_joined: string;
  // Add other common worker fields here
}

export interface SalaryWorker extends WorkerEntry {
  salary: string;
  position: string;
  is_still_active: boolean;
  email?: string;
  phone_number?: string;
  address?: string;
  craft_specialty?: string;
  years_of_experience?: number;
  image?: string | null;
  agreement_form_image?: string | null;
  date_left?: string | null;
  guarantor_name?: string | null;
  guarantor_phone_number?: string | null;
  guarantor_address?: string | null;
  created_at?: string;
  updated_at?: string | null;
}

export interface Contractor extends WorkerEntry {
  contract_value: number;
  contract_type: string;
  is_still_active: boolean;
  email?: string;
  phone_number?: string;
  address?: string;
  craft_specialty?: string;
  years_of_experience?: number;
  image?: string | null;
  agreement_form_image?: string | null;
  date_left?: string | null;
  guarantor_name?: string | null;
  guarantor_phone_number?: string | null;
  guarantor_address?: string | null;
  created_at?: string;
  updated_at?: string | null;
}

export interface WorkersSummaryResults {
  salary_workers_count: number;
  active_salary_workers_count: number;
  total_salary_workers_monthly_pay: number;
  total_paid: number; // This seems to be total paid for salary workers based on the example
  all_contractors_count: number;
  all_active_contractors_count: number;
  total_contractors_monthly_pay: number;
  total_contractors_weekly_pay: number;
}

export interface WorkersSummary {
  count: number;
  next: string | null;
  previous: string | null;
  results: WorkersSummaryResults;
}

export interface PaginatedSalaryWorkersResponse {
  count: number;
  next: string | null;
  previous: string | null;
  results: { workers: SalaryWorker[] };
}

export interface PaginatedContractorsResponse {
  count: number;
  next: string | null;
  previous: string | null;
  results: { contractor: Contractor[] };
}

export const fetchWorkersSummary = async (): Promise<WorkersSummary> => {
  const accessToken = localStorage.getItem("accessToken");
  const headers = {
    Authorization: `JWT ${accessToken}`,
  };

  const [salaryWorkersResponse, contractorsResponse] = await Promise.all([
    axios.get(SALARY_WORKERS_API_URL, { headers }),
    axios.get(CONTRACTORS_API_URL, { headers }),
  ]);

  const salaryWorkersData = salaryWorkersResponse.data;
  const contractorsData = contractorsResponse.data;

  const summaryResults: WorkersSummaryResults = {
    salary_workers_count: salaryWorkersData.results.salary_workers_count,
    active_salary_workers_count: salaryWorkersData.results.active_salary_workers_count,
    total_salary_workers_monthly_pay: salaryWorkersData.results.total_salary_workers_monthly_pay,
    total_paid: salaryWorkersData.results.total_paid,
    all_contractors_count: contractorsData.results.all_contractors_count,
    all_active_contractors_count: contractorsData.results.all_active_contractors_count,
    total_contractors_monthly_pay: contractorsData.results.total_contractors_monthly_pay,
    total_contractors_weekly_pay: contractorsData.results.total_contractors_weekly_pay,
  };

  const combinedSummary: WorkersSummary = {
    count: (salaryWorkersData.count || 0) + (contractorsData.count || 0),
    next: null,
    previous: null,
    results: summaryResults,
  };

  return combinedSummary;
};

export const fetchSalaryWorkers = async (
  page = 1,
  searchQuery = "",
  statusFilter: boolean | undefined
): Promise<PaginatedSalaryWorkersResponse> => {
  const token = localStorage.getItem("accessToken");
  const params = new URLSearchParams();
  params.append("page", String(page));

  if (searchQuery) {
    params.append("search", searchQuery);
  }
  if (statusFilter !== undefined) {
    params.append("is_still_active", String(statusFilter));
  }

  const headers = {
    Authorization: `JWT ${token}`,
  };

  const response = await axios.get(`${SALARY_WORKERS_API_URL}?${params.toString()}`, { headers });
  return response.data;
};

export const fetchContractors = async (
  page = 1,
  searchQuery = "",
  statusFilter: boolean | undefined
): Promise<PaginatedContractorsResponse> => {
  const token = localStorage.getItem("accessToken");
  const params = new URLSearchParams();
  params.append("page", String(page));

  if (searchQuery) {
    params.append("search", searchQuery);
  }
  if (statusFilter !== undefined) {
    params.append("is_still_active", String(statusFilter));
  }

  const headers = {
    Authorization: `JWT ${token}`,
  };

  const response = await axios.get(`${CONTRACTORS_API_URL}?${params.toString()}`, { headers });
  return response.data;
};

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