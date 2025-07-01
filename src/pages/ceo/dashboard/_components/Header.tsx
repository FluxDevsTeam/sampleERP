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

// Data card component styled like the Header component
const DataCard = ({
  label,
  value,
}: {
  label: string;
  value: number | string;
}) => {
  // Show Naira sign only for numbers and not for percentage or string values
  const isNumber = typeof value === "number";
  const isPercent = typeof value === "string" && value.trim().endsWith("%");
  return (
    <div className="p-4 border rounded-lg shadow-md flex flex-col items-center justify-center">
      <div className="text-base font-medium text-center mb-1">{label}</div>
      <div className="text-lg font-semibold text-blue-400">
        {isNumber ? "₦" : ""}
        {isNumber ? value.toLocaleString("en-NG") : value}
    </div>
  </div>
);
};

// Fetch CEO dashboard data
const fetchCEODashboard = async (): Promise<CEODashboardData> => {
  const { data } = await api.get<CEODashboardData>("ceo-dashboard/");
  return data;
};

// Main CEO Dashboard component
const Header = () => {
  const { data, isLoading, error } = useQuery<CEODashboardData>({
    queryKey: ["ceo-dashboard"],
    queryFn: fetchCEODashboard,
  });

  // Collapsible state for each section
  const [openSection, setOpenSection] = useState<'key' | 'income' | 'expense' | 'asset' | 'customer' | 'additional'>('key');

  // Check if sidebar is open by looking for the sidebar element and its width
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  // Update sidebar state when window resizes or sidebar toggles
  React.useEffect(() => {
    const checkSidebarState = () => {
      const sidebar = document.querySelector('aside');
      if (sidebar) {
        const sidebarWidth = sidebar.offsetWidth;
        setIsSidebarOpen(sidebarWidth > 100);
      }
    };

    checkSidebarState();
    window.addEventListener('resize', checkSidebarState);
    
    // Check periodically for sidebar state changes
    const interval = setInterval(checkSidebarState, 500);
    
    return () => {
      window.removeEventListener('resize', checkSidebarState);
      clearInterval(interval);
    };
  }, []);

  const handleSectionClick = (section: typeof openSection) => {
    setOpenSection(section);
  };

  if (isLoading) return <p className="p-6">Loading dashboard data...</p>;
  if (error)
    return (
      <p className="p-6 text-red-500">Error: {(error as Error).message}</p>
    );
  if (!data) return <p className="p-6">No dashboard data available</p>;

  return (
    <div className="p-6">
      {/* Collapsible Section Headers Row */}
      <div className={`flex gap-4 mb-4 py-2  whitespace-nowrap w-full ${isSidebarOpen ? 'lg:grid lg:grid-cols-6 lg:gap-3 lg:overflow-visible' : ''}`}>
        <button className={`shrink-0 max-w-xs flex items-center justify-between ml-1 px-2 py-8 rounded-xl shadow bg-blue-50/60 hover:bg-blue-100 transition font-semibold text-blue-700 ${openSection === 'key' ? 'ring-2 ring-blue-400 rounded-full' : ''} ${isSidebarOpen ? 'lg:max-w-none' : ''}`} onClick={() => handleSectionClick('key')}>
          Key Business Metrics {openSection === 'key' ? <MdExpandLess size={22} /> : <MdExpandMore size={22} />}
        </button>
        <button className={`shrink-0 max-w-xs flex items-center justify-between px-2 py-8 rounded-xl shadow bg-green-50/60 hover:bg-green-100 transition font-semibold text-green-700 ${openSection === 'income' ? 'ring-2 ring-green-400 rounded-full' : ''} ${isSidebarOpen ? 'lg:max-w-none' : ''}`} onClick={() => handleSectionClick('income')}>
          Income Breakdown {openSection === 'income' ? <MdExpandLess size={22} /> : <MdExpandMore size={22} />}
        </button>
        <button className={`shrink-0 max-w-xs flex items-center justify-between px-2 py-8 rounded-xl shadow bg-teal-50/60 hover:bg-teal-100 transition font-semibold text-teal-700 ${openSection === 'expense' ? 'ring-2 ring-teal-400 rounded-full' : ''} ${isSidebarOpen ? 'lg:max-w-none' : ''}`} onClick={() => handleSectionClick('expense')}>
          Expense Breakdown {openSection === 'expense' ? <MdExpandLess size={22} /> : <MdExpandMore size={22} />}
        </button>
        <button className={`shrink-0 max-w-xs flex items-center justify-between px-2 py-8 rounded-xl shadow bg-purple-50/60 hover:bg-purple-100 transition font-semibold text-purple-700 ${openSection === 'asset' ? 'ring-2 ring-purple-400 rounded-full' : ''} ${isSidebarOpen ? 'lg:max-w-none' : ''}`} onClick={() => handleSectionClick('asset')}>
          Asset & Store Analysis {openSection === 'asset' ? <MdExpandLess size={22} /> : <MdExpandMore size={22} />}
        </button>
        <button className={`shrink-0 max-w-xs flex items-center justify-between px-2 py-8 rounded-xl shadow bg-yellow-50/60 hover:bg-yellow-100 transition font-semibold text-yellow-700 ${openSection === 'customer' ? 'ring-2 ring-yellow-400 rounded-full' : ''} ${isSidebarOpen ? 'lg:max-w-none' : ''}`} onClick={() => handleSectionClick('customer')}>
          Customers & Workers {openSection === 'customer' ? <MdExpandLess size={22} /> : <MdExpandMore size={22} />}
        </button>
        <button className={`shrink-0 max-w-xs flex items-center justify-between px-2 py-8 rounded-xl shadow bg-gray-50/60 hover:bg-gray-100 transition font-semibold text-gray-700 ${openSection === 'additional' ? 'ring-2 ring-gray-400 rounded-full' : ''} ${isSidebarOpen ? 'lg:max-w-none' : ''}`} onClick={() => handleSectionClick('additional')}>
          Additional Metrics {openSection === 'additional' ? <MdExpandLess size={22} /> : <MdExpandMore size={22} />}
        </button>
      </div>

      {/* Collapsible Section Content */}
      {openSection === 'key' && (
        <section className="mb-8 bg-blue-50/60 rounded-2xl shadow p-6">
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
            <DataCard label="This Year Total Income" value={data.key_metrics.total_income_year} />
            <DataCard label="This Year Total Expenses" value={data.key_metrics.total_expenses_year} />
            <DataCard label="This Year Total Profit" value={data.key_metrics.total_profit_year} />
            <DataCard label="This Month Total Income" value={data.key_metrics.total_income_month} />
            <DataCard label="This Month Total Expenses" value={data.key_metrics.total_expenses_month} />
            <DataCard label="This Month Profit" value={data.key_metrics.profit_month} />
          </div>
        </section>
      )}
      {openSection === 'income' && (
        <section className="mb-8 bg-green-50/60 rounded-2xl shadow p-6">
          <div className="mb-6">
            <h4 className="font-semibold text-green-700 mb-2">Monthly Income Breakdown</h4>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
              <DataCard label="Projects" value={data.income_breakdown_month.projects} />
              <DataCard label="Non-Shop Projects" value={data.income_breakdown_month.no_shop_projects} />
              <DataCard label="Shop Sales" value={data.income_breakdown_month.shop_sales} />
              <DataCard label="Non-Project Shop" value={data.income_breakdown_month.non_project_shop_sales} />
              <DataCard label="Projects %" value={`${data.income_breakdown_month.percentage_projects}%`} />
              <DataCard label="Shop %" value={`${data.income_breakdown_month.percentage_shop}%`} />
            </div>
          </div>
          <div>
            <h4 className="font-semibold text-green-700 mb-2">Yearly Income Breakdown</h4>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
              <DataCard label="Projects" value={data.income_breakdown_year.projects} />
              <DataCard label="Non-Shop Projects" value={data.income_breakdown_year.no_shop_projects} />
              <DataCard label="Shop Sales" value={data.income_breakdown_year.shop_sales} />
              <DataCard label="Non-Project Shop" value={data.income_breakdown_year.non_project_shop_sales} />
              <DataCard label="Projects %" value={`${data.income_breakdown_year.percentage_projects}%`} />
              <DataCard label="Shop %" value={`${data.income_breakdown_year.percentage_shop}%`} />
            </div>
          </div>
        </section>
      )}
      {openSection === 'expense' && (
        <section className="mb-8 bg-teal-50/60 rounded-2xl shadow p-6">
          <div className="mb-6">
            <h4 className="font-semibold text-teal-700 mb-2">Monthly Expense Breakdown</h4>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
              <DataCard label="Salaries" value={data.expense_breakdown_month.salaries} />
              <DataCard label="Contractors" value={data.expense_breakdown_month.contractors} />
              <DataCard label="Raw Materials" value={data.expense_breakdown_month.raw_materials} />
              <DataCard label="Assets" value={data.expense_breakdown_month.assets} />
              <DataCard label="Factory Expenses" value={data.expense_breakdown_month.factory_expenses} />
              <DataCard label="Other Production" value={data.expense_breakdown_month.other_production_expensis} />
              <DataCard label="Cost Price" value={data.expense_breakdown_month.monthly_sold_cost_price} />
            </div>
          </div>
          <div>
            <h4 className="font-semibold text-teal-700 mb-2">Yearly Expense Breakdown</h4>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
              <DataCard label="Salaries" value={data.expense_breakdown_year.salaries} />
              <DataCard label="Contractors" value={data.expense_breakdown_year.contractors} />
              <DataCard label="Raw Materials" value={data.expense_breakdown_year.raw_materials} />
              <DataCard label="Assets" value={data.expense_breakdown_year.assets} />
              <DataCard label="Factory Expenses" value={data.expense_breakdown_year.factory_expenses} />
              <DataCard label="Other Production" value={data.expense_breakdown_year.other_production_expensis} />
              <DataCard label="Cost Price" value={data.expense_breakdown_year.monthly_sold_cost_price} />
            </div>
          </div>
        </section>
      )}
      {openSection === 'asset' && (
        <section className="mb-8 bg-purple-50/60 rounded-2xl shadow p-6">
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
            <DataCard label="Active Assets" value={data.asset_analysis.active_assets} />
            <DataCard label="Deprecated Assets" value={data.asset_analysis.deprecated_assets} />
            <DataCard label="Current Assets Value" value={data.key_metrics.current_assets_value} />
            <DataCard label="Inventory Value" value={data.key_metrics.inventory_value} />
            <DataCard label="Total Store Value" value={data.key_metrics.total_store_value} />
            <DataCard label="Overhead Cost" value={data.key_metrics.overhead_cost} />
          </div>
        </section>
      )}
      {openSection === 'customer' && (
        <section className="mb-8 bg-yellow-50/60 rounded-2xl shadow p-6">
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
            <DataCard label="All Customers" value={data.customers.all_customers_count} />
            <DataCard label="Active Customers" value={data.customers.active_customers_count} />
            <DataCard label="Owing Customers" value={data.customers.owing_customers_count} />
            <DataCard label="Total Workers" value={data.additional_metrics.total_salary_workers} />
            <DataCard label="Active Workers" value={data.additional_metrics.active_salary_workers} />
            <DataCard label="Total Contractors" value={data.additional_metrics.total_contractors} />
          </div>
        </section>
      )}
      {openSection === 'additional' && (
        <section className="mb-8 bg-gray-50/60 rounded-2xl shadow p-6">
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
            <DataCard label="Active Contractors" value={data.additional_metrics.active_contractors} />
            <DataCard label="Inventory Items" value={data.additional_metrics.inventory_items} />
            <DataCard label="Raw Materials" value={data.additional_metrics.raw_materials_types} />
            <DataCard label="Suggested Overhead" value={data.key_metrics.suggested_overhead_cost} />
            <DataCard label="Profit (Month)" value={data.key_metrics.profit_month} />
            <DataCard label="Non-Project Shop" value={data.income_breakdown_month.non_project_shop_sales} />
          </div>
        </section>
      )}
    </div>
  );
};

export default Header;
