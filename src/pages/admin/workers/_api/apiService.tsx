
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
  return getWorkersSummary();
};

export const fetchSalaryWorkers = async (
  page = 1,
  searchQuery = "",
  statusFilter: boolean | undefined
): Promise<PaginatedSalaryWorkersResponse> => {
  return getSalaryWorkers(page, searchQuery, statusFilter);
};

export const fetchContractors = async (
  page = 1,
  searchQuery = "",
  statusFilter: boolean | undefined
): Promise<PaginatedContractorsResponse> => {
  return getContractors(page, searchQuery, statusFilter);
};

export const fetchSalaryWorkerDetails = async (id: number): Promise<SalaryWorker> => {
  return getSalaryWorkerDetails(id);
};

export const fetchContractorDetails = async (id: number): Promise<Contractor> => {
  return getContractorDetails(id);
};

import { getSalaryWorkers, getContractors, getSalaryWorkerDetails, getContractorDetails, getWorkersSummary, addSalaryWorker, addContractor, updateSalaryWorker, updateContractor, deleteWorker as deleteWorkerJson } from "../../../../utils/jsonDataService";

export const deleteWorker = async (id: number, type: 'salary' | 'contractor') => {
  return deleteWorkerJson(id, type);
};
