import React, { useState } from "react";
import axios from "axios";
import { useQuery } from "@tanstack/react-query";
import { MdArrowOutward, MdExpandMore, MdExpandLess } from "react-icons/md";
import Frame180 from "../../../../assets/images/Frame180.png";

// Create an Axios instance with default headers
const api = axios.create({
  baseURL: "https://backend.kidsdesigncompany.com/api/",
  headers: {
    "Content-Type": "application/json",
  },
});

// Add a request interceptor to include the token
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("accessToken");
  if (token) {
    config.headers.Authorization = `JWT ${token}`;
  }
  return config;
});

interface CEODashboardData {
  income_breakdown_year: {
    projects: number;
    no_shop_projects: number;
    shop_sales: number;
    non_project_shop_sales: number;
    percentage_projects: number;
    percentage_shop: number;
  };
  income_breakdown_month: {
    projects: number;
    no_shop_projects: number;
    shop_sales: number;
    non_project_shop_sales: number;
    percentage_projects: number;
    percentage_shop: number;
  };
  expense_breakdown_year: {
    salaries: number;
    contractors: number;
    raw_materials: number;
    assets: number;
    factory_expenses: number;
    other_production_expensis: number;
    monthly_sold_cost_price: number;
  };
  expense_breakdown_month: {
    salaries: number;
    contractors: number;
    raw_materials: number;
    assets: number;
    factory_expenses: number;
    other_production_expensis: number;
    monthly_sold_cost_price: number;
  };
  asset_analysis: {
    active_assets: number;
    deprecated_assets: number;
  };
  customers: {
    all_customers_count: number;
    active_customers_count: number;
    owing_customers_count: number;
    owing_customers: any[];
  };
  additional_metrics: {
    total_salary_workers: number;
    active_salary_workers: number;
    total_contractors: number;
    active_contractors: number;
    inventory_items: number;
    raw_materials_types: number;
  };
  key_metrics: {
    overhead_cost: number;
    suggested_overhead_cost: number;
    total_income_year: number;
    total_expenses_year: number;
    total_profit_year: number;
    total_income_month: number;
    total_expenses_month: number;
    profit_month: number;
    current_assets_value: number;
    inventory_value: number;
    total_store_value: number;
  };
}

// Dropdown component for reuse
const DropdownSection = ({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="mb-6 border rounded-lg shadow-md overflow-hidden">
      <div
        className="p-4 bg-gray-50 flex justify-between items-center cursor-pointer"
        onClick={() => setIsOpen(!isOpen)}
      >
        <h3 className="font-bold text-xl">{title}</h3>
        {isOpen ? <MdExpandLess size={24} /> : <MdExpandMore size={24} />}
      </div>
      {isOpen && <div className="p-4 bg-white">{children}</div>}
    </div>
  );
};

// Data card component styled like the Header component
const DataCard = ({
  label,
  value,
}: {
  label: string;
  value: number | string;
}) => (
  <div className="p-4 border rounded-lg shadow-md">
    <div className="flex justify-between items-center text-xl">
      <p>{label}</p>
      <img src={Frame180 || "/placeholder.svg"} alt="icon" />
    </div>
    <div className="flex space-x-8 text-sm">
      <span className="text-green-200">
        <MdArrowOutward />
      </span>
      <span>
        {typeof value === "number"
          ? value.toLocaleString("en-US", {
              minimumFractionDigits: 0,
              maximumFractionDigits: 2,
            })
          : value}
      </span>
    </div>
  </div>
);

// Fetch CEO dashboard data
const fetchCEODashboard = async (): Promise<CEODashboardData> => {
  const { data } = await api.get<CEODashboardData>("ceo-dashboard/");
  return data;
};

// Key metrics component
const KeyMetrics = ({ data }: { data: CEODashboardData }) => {
  return (
    <DropdownSection title="Key Business Metrics">
      <div className="md:grid md:grid-cols-4 grid grid-cols-1 md:gap-4 gap-4">
        <DataCard
          label="Total Income (Year)"
          value={data.key_metrics.total_income_year}
        />
        <DataCard
          label="Total Expenses (Year)"
          value={data.key_metrics.total_expenses_year}
        />
        <DataCard
          label="Total Profit (Year)"
          value={data.key_metrics.total_profit_year}
        />
        <DataCard
          label="Overhead Cost"
          value={data.key_metrics.overhead_cost}
        />
      </div>
      <div className="md:grid md:grid-cols-4 grid grid-cols-1 md:gap-4 gap-4 mt-4">
        <DataCard
          label="Total Income (Month)"
          value={data.key_metrics.total_income_month}
        />
        <DataCard
          label="Total Expenses (Month)"
          value={data.key_metrics.total_expenses_month}
        />
        <DataCard
          label="Profit (Month)"
          value={data.key_metrics.profit_month}
        />
        <DataCard
          label="Suggested Overhead"
          value={data.key_metrics.suggested_overhead_cost}
        />
      </div>
      <div className="md:grid md:grid-cols-3 grid grid-cols-1 md:gap-4 gap-4 mt-4">
        <DataCard
          label="Current Assets Value"
          value={data.key_metrics.current_assets_value}
        />
        <DataCard
          label="Inventory Value"
          value={data.key_metrics.inventory_value}
        />
        <DataCard
          label="Total Store Value"
          value={data.key_metrics.total_store_value}
        />
      </div>
    </DropdownSection>
  );
};

// Income breakdown component
const IncomeBreakdown = ({ data }: { data: CEODashboardData }) => {
  return (
    <>
      <DropdownSection title="Monthly Income Breakdown">
        <div className="md:grid md:grid-cols-4 grid grid-cols-1 md:gap-4 gap-4">
          <DataCard
            label="Projects"
            value={data.income_breakdown_month.projects}
          />
          <DataCard
            label="Non-Shop Projects"
            value={data.income_breakdown_month.no_shop_projects}
          />
          <DataCard
            label="Shop Sales"
            value={data.income_breakdown_month.shop_sales}
          />
          <DataCard
            label="Non-Project Shop"
            value={data.income_breakdown_month.non_project_shop_sales}
          />
        </div>
        <div className="md:grid md:grid-cols-2 grid grid-cols-1 md:gap-4 gap-4 mt-4">
          <DataCard
            label="Projects %"
            value={`${data.income_breakdown_month.percentage_projects}%`}
          />
          <DataCard
            label="Shop %"
            value={`${data.income_breakdown_month.percentage_shop}%`}
          />
        </div>
      </DropdownSection>

      <DropdownSection title="Yearly Income Breakdown">
        <div className="md:grid md:grid-cols-4 grid grid-cols-1 md:gap-4 gap-4">
          <DataCard
            label="Projects"
            value={data.income_breakdown_year.projects}
          />
          <DataCard
            label="Non-Shop Projects"
            value={data.income_breakdown_year.no_shop_projects}
          />
          <DataCard
            label="Shop Sales"
            value={data.income_breakdown_year.shop_sales}
          />
          <DataCard
            label="Non-Project Shop"
            value={data.income_breakdown_year.non_project_shop_sales}
          />
        </div>
        <div className="md:grid md:grid-cols-2 grid grid-cols-1 md:gap-4 gap-4 mt-4">
          <DataCard
            label="Projects %"
            value={`${data.income_breakdown_year.percentage_projects}%`}
          />
          <DataCard
            label="Shop %"
            value={`${data.income_breakdown_year.percentage_shop}%`}
          />
        </div>
      </DropdownSection>
    </>
  );
};

// Expense breakdown component
const ExpenseBreakdown = ({ data }: { data: CEODashboardData }) => {
  return (
    <>
      <DropdownSection title="Monthly Expense Breakdown">
        <div className="md:grid md:grid-cols-4 grid grid-cols-1 md:gap-4 gap-4">
          <DataCard
            label="Salaries"
            value={data.expense_breakdown_month.salaries}
          />
          <DataCard
            label="Contractors"
            value={data.expense_breakdown_month.contractors}
          />
          <DataCard
            label="Raw Materials"
            value={data.expense_breakdown_month.raw_materials}
          />
          <DataCard
            label="Assets"
            value={data.expense_breakdown_month.assets}
          />
        </div>
        <div className="md:grid md:grid-cols-3 grid grid-cols-1 md:gap-4 gap-4 mt-4">
          <DataCard
            label="Factory Expenses"
            value={data.expense_breakdown_month.factory_expenses}
          />
          <DataCard
            label="Other Production"
            value={data.expense_breakdown_month.other_production_expensis}
          />
          <DataCard
            label="Cost Price"
            value={data.expense_breakdown_month.monthly_sold_cost_price}
          />
        </div>
      </DropdownSection>

      <DropdownSection title="Yearly Expense Breakdown">
        <div className="md:grid md:grid-cols-4 grid grid-cols-1 md:gap-4 gap-4">
          <DataCard
            label="Salaries"
            value={data.expense_breakdown_year.salaries}
          />
          <DataCard
            label="Contractors"
            value={data.expense_breakdown_year.contractors}
          />
          <DataCard
            label="Raw Materials"
            value={data.expense_breakdown_year.raw_materials}
          />
          <DataCard label="Assets" value={data.expense_breakdown_year.assets} />
        </div>
        <div className="md:grid md:grid-cols-3 grid grid-cols-1 md:gap-4 gap-4 mt-4">
          <DataCard
            label="Factory Expenses"
            value={data.expense_breakdown_year.factory_expenses}
          />
          <DataCard
            label="Other Production"
            value={data.expense_breakdown_year.other_production_expensis}
          />
          <DataCard
            label="Cost Price"
            value={data.expense_breakdown_year.monthly_sold_cost_price}
          />
        </div>
      </DropdownSection>
    </>
  );
};

// Asset analysis component
const AssetAnalysis = ({ data }: { data: CEODashboardData }) => {
  return (
    <DropdownSection title="Asset Analysis">
      <div className="md:grid md:grid-cols-2 grid grid-cols-1 md:gap-4 gap-4">
        <DataCard
          label="Active Assets"
          value={data.asset_analysis.active_assets}
        />
        <DataCard
          label="Deprecated Assets"
          value={data.asset_analysis.deprecated_assets}
        />
      </div>
    </DropdownSection>
  );
};

// Customer metrics component
const CustomerMetrics = ({ data }: { data: CEODashboardData }) => {
  return (
    <DropdownSection title="Customer Metrics">
      <div className="md:grid md:grid-cols-3 grid grid-cols-1 md:gap-4 gap-4">
        <DataCard
          label="All Customers"
          value={data.customers.all_customers_count}
        />
        <DataCard
          label="Active Customers"
          value={data.customers.active_customers_count}
        />
        <DataCard
          label="Owing Customers"
          value={data.customers.owing_customers_count}
        />
      </div>
    </DropdownSection>
  );
};

// Additional metrics component
const AdditionalMetrics = ({ data }: { data: CEODashboardData }) => {
  return (
    <DropdownSection title="Additional Metrics">
      <div className="md:grid md:grid-cols-3 grid grid-cols-1 md:gap-4 gap-4">
        <DataCard
          label="Total Workers"
          value={data.additional_metrics.total_salary_workers}
        />
        <DataCard
          label="Active Workers"
          value={data.additional_metrics.active_salary_workers}
        />
        <DataCard
          label="Total Contractors"
          value={data.additional_metrics.total_contractors}
        />
      </div>
      <div className="md:grid md:grid-cols-3 grid grid-cols-1 md:gap-4 gap-4 mt-4">
        <DataCard
          label="Active Contractors"
          value={data.additional_metrics.active_contractors}
        />
        <DataCard
          label="Inventory Items"
          value={data.additional_metrics.inventory_items}
        />
        <DataCard
          label="Raw Materials"
          value={data.additional_metrics.raw_materials_types}
        />
      </div>
    </DropdownSection>
  );
};

// Main CEO Dashboard component
const Header = () => {
  const { data, isLoading, error } = useQuery<CEODashboardData>({
    queryKey: ["ceo-dashboard"],
    queryFn: fetchCEODashboard,
  });

  if (isLoading) return <p className="p-6">Loading dashboard data...</p>;
  if (error)
    return (
      <p className="p-6 text-red-500">Error: {(error as Error).message}</p>
    );
  if (!data) return <p className="p-6">No dashboard data available</p>;

  return (
    <div className="p-6">
      <p className="md:text-2xl text-black font-bold py-6">Dashboard Headers</p>

      <KeyMetrics data={data} />
      <IncomeBreakdown data={data} />
      <ExpenseBreakdown data={data} />
      <AssetAnalysis data={data} />
      <CustomerMetrics data={data} />
      <AdditionalMetrics data={data} />
    </div>
  );
};

export default Header;
