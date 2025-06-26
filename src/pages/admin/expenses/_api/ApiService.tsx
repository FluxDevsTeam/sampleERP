import axios from "axios";
const BASE_URL = "https://backend.kidsdesigncompany.com/api/expense/";


export interface Asset {
    id: number;
    name: string;
    value: number;
    expected_lifespan: string;
    is_still_available: boolean;
    get_total_value: number;
  }
  
  export interface AssetsResponse {
    assets: Asset[];
  }
  


export const AssetsData = async (): Promise<AssetsResponse> => {
    const { data } = await axios.get(BASE_URL);
    return data;
  };

export interface ExpenseSummary {
  monthly_total: number;
  monthly_project_expenses_total: number;
  monthly_shop_expenses_total: number;
  daily_data: any[];
}

const EXPENSE_API_URL = "https://backend.kidsdesigncompany.com/api/expense/";

export const fetchExpenseSummary = async (): Promise<ExpenseSummary> => {
  const accessToken = localStorage.getItem("accessToken");
  const { data } = await axios.get(EXPENSE_API_URL, {
    headers: {
      Authorization: `JWT ${accessToken}`,
    },
  });
  // The API returns an object with monthly_total, monthly_project_expenses_total, etc.
  return data;
};