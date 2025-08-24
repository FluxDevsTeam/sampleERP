import paidData from "@/data/admin/paid/paidData.json";

interface SalaryDetail {
  id: number;
  first_name: string;
  last_name: string;
  email: string;
  phone_number: string;
  address: string;
  craft_specialty: string;
  years_of_experience: number;
  image: string | null;
  agreement_form_image: string | null;
  date_joined: string;
  date_left: string | null;
  guarantor_name: string | null;
  guarantor_phone_number: string | null;
  guarantor_address: string | null;
  created_at: string;
  updated_at: string | null;
  salary: string;
  is_still_active: boolean;
}

interface ContractorDetail {
  id: number;
  first_name: string;
  last_name: string;
  email: string;
  phone_number: string;
  address: string;
  craft_specialty: string;
  years_of_experience: number;
  image: string | null;
  agreement_form_image: string | null;
  date_joined: string;
  date_left: string | null;
  guarantor_name: string | null;
  guarantor_phone_number: string | null;
  guarantor_address: string | null;
  created_at: string;
  updated_at: string | null;
  contract_value: string;
  is_still_active: boolean;
}

export interface PaidEntry {
  id: number;
  amount: string;
  date: string;
  salary_detail: SalaryDetail | null;
  contractor_detail: ContractorDetail | null;
}

export interface DailyPaidData {
  date: string;
  entries: PaidEntry[];
  daily_total?: number;
}

export interface PaidSummary {
  monthly_total: number;
  salary_paid_this_month: number;
  contractors_paid_this_month: number;
  daily_data: DailyPaidData[];
  yearly_total: number;
}

export const fetchPaidSummary = async (): Promise<PaidSummary> => {
  return paidData;
};

export const fetchPaidEntries = async (year: number | '', month: number | '', day: number | ''): Promise<PaidSummary> => {
  let filteredData = { ...paidData };

  if (year || month || day) {
    filteredData.daily_data = paidData.daily_data.filter((daily) => {
      const date = new Date(daily.date);
      const matchesYear = year ? date.getFullYear() === year : true;
      const matchesMonth = month ? date.getMonth() + 1 === month : true;
      const matchesDay = day ? date.getDate() === day : true;
      return matchesYear && matchesMonth && matchesDay;
    });

    // Recalculate totals based on filtered data
    filteredData.monthly_total = filteredData.daily_data.reduce((sum, daily) => sum + (daily.daily_total || 0), 0);
    filteredData.salary_paid_this_month = filteredData.daily_data.reduce((sum, daily) => {
      return sum + daily.entries.reduce((entrySum, entry) => {
        return entry.salary_detail ? entrySum + parseFloat(entry.amount) : entrySum;
      }, 0);
    }, 0);
    filteredData.contractors_paid_this_month = filteredData.daily_data.reduce((sum, daily) => {
      return sum + daily.entries.reduce((entrySum, entry) => {
        return entry.contractor_detail ? entrySum + parseFloat(entry.amount) : entrySum;
      }, 0);
    }, 0);
    filteredData.yearly_total = filteredData.monthly_total; // Simplified for static data
  }

  return filteredData;
};