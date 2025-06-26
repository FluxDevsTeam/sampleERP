import axios from "axios";

const PAID_API_URL = "https://backend.kidsdesigncompany.com/api/paid/";

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
  const accessToken = localStorage.getItem("accessToken");
  const { data } = await axios.get(PAID_API_URL, {
    headers: {
      Authorization: `JWT ${accessToken}`,
    },
  });
  return data;
};

export const fetchPaidEntries = async (year: number | '', month: number | '', day: number | ''): Promise<PaidSummary> => {
  const accessToken = localStorage.getItem("accessToken");
  const params = new URLSearchParams();

  if (year) {
    params.append("year", String(year));
  }
  if (month) {
    params.append("month", String(month));
  }
  if (day) {
    params.append("day", String(day));
  }

  const { data } = await axios.get<PaidSummary>(
    `${PAID_API_URL}?${params.toString()}`,
    {
      headers: {
        Authorization: `JWT ${accessToken}`,
      },
    }
  );
  return data;
}; 