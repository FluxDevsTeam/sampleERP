import expensesData from "@/data/admin/expenses/expenses.json";

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
  return { assets: [] }; // Placeholder, as no asset data is provided
};

export interface ExpenseSummary {
  monthly_total: number;
  monthly_project_expenses_total: number;
  monthly_shop_expenses_total: number;
  daily_data: any[];
  current_month_product_total: number;
}

export const fetchExpenseSummary = async (): Promise<ExpenseSummary> => {
  return {
    monthly_total: expensesData.monthly_total,
    monthly_project_expenses_total: expensesData.monthly_project_expenses_total,
    monthly_shop_expenses_total: expensesData.monthly_shop_expenses_total,
    current_month_product_total: expensesData.current_month_product_total,
    daily_data: expensesData.daily_data,
  };
};