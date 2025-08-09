import axios from "axios";

export interface IncomeSummary {
  monthly_total: number;
  current_month_cash_total: number;
  current_month_bank_total: number;
  cash_at_hand: number;
  money_in_bank: number;
  debt: number;
  daily_data: any[];
}

const INCOME_API_URL = "https://backend.kidsdesigncompany.com/api/income/";

export const fetchIncomeSummary = async (): Promise<IncomeSummary> => {
  const accessToken = localStorage.getItem("accessToken");
  const { data } = await axios.get(INCOME_API_URL, {
    headers: {
      Authorization: `JWT ${accessToken}`,
    },
  });
  return data;
};


