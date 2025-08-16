/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState, useEffect } from "react";
import { factoryData } from "./api";
import PieChartComponent from "./PieChart";
import BarChartComponent from "./Barchart";
import DashboardCard from "./DashboardCard";
import { MdExpandMore, MdExpandLess } from "react-icons/md";

const FactoryManagerDashboard = () => {

  const [salesProjectMetrics, setSalesProjectMetrics] = useState<Record<string, number>>({});
  const [operationalAndCustomerMetrics, setOperationalAndCustomerMetrics] = useState<Record<string, number>>({});
  const [expenseBreakdown, setExpenseBreakdown] = useState<{ name: string; value: number }[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [openSection, setOpenSection] = useState<'salesProjectMetrics' | 'operationalAndCustomerMetrics'>('salesProjectMetrics');

  // Check if sidebar is open by looking for the sidebar element and its width
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  // Update sidebar state when window resizes or sidebar toggles
  useEffect(() => {
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

  useEffect(() => {
    const fetchFactory = async () => {
      try {
        setLoading(true);
        const data = await factoryData();

        console.log("Fetched data:", data);



        if (data?.financial_health && data?.yearly_data) {
          setSalesProjectMetrics({
            Sales_Count: data.financial_health.sales_count_this_month || 0,
            Project_Sales: data.financial_health.total_project_sales_this_month || 0,
            Non_Project_Sales: data.financial_health.total_non_project_sales_this_month || 0,
            Shop_Items_Sold: data.financial_health.total_shop_items_sold_this_month || 0,
            Shop_Profit: data.financial_health.total_shop_profit_this_month || 0,
            Project_Count: data.financial_health.project_count_this_month || 0,
            Project_Amount: data.financial_health.total_project_amount_this_month || 0,
            Total_Income_Year: data.yearly_data.total_income_year || 0,
            Total_Expenses_Year: data.yearly_data.total_expenses_year || 0,
            Profit_Year: data.yearly_data.profit_year || 0,
          });
        }

        if (data?.customers && data?.paid && data?.financial_health && data?.workers) {
          setOperationalAndCustomerMetrics({
            All_Customers: data.customers.all_customers_count || 0,
            Active_Customers: data.customers.active_customers_count || 0,
            Owing_Customers: data.customers.owing_customers_count || 0,
            Total_Paid: data.paid.total_paid || 0,
            Total_Income_Month: data.financial_health.total_income_this_month || 0,
            Total_Expenses_Month: data.financial_health.total_expenses_month || 0,
            Profit_Month: data.financial_health.profit_month || 0,
            Salary_Workers: data.workers.salary_workers_count || 0,
            Active_Salary_Workers: data.workers.active_salary_workers_count || 0,
            Salary_Workers_Pay: data.workers.total_salary_workers_monthly_pay || 0,
            All_Contractors: data.workers.all_contractors_count || 0,
            Active_Contractors: data.workers.all_active_contractors_count || 0,
            Contractors_Monthly_Pay: data.paid.total_contractors_monthly_pay || 0,
            Contractors_Weekly_Pay: data.paid.total_contractors_weekly_pay || 0,
          });
        }

        if (data?.expense_category_breakdown) {
          setExpenseBreakdown(
            data.expense_category_breakdown.map((item: { category: string; total: number }) => ({
              name: item.category,
              value: item.total,
            }))
          );
        }

      } catch (err) {
        console.error("Error fetching financial data:", err);
        setError("Failed to load financial data.");
      } finally {
        setLoading(false);
      }
    };

    fetchFactory();
  }, []);

  if (loading) {
    return (
      <div className="container mx-auto p-4">
        <div className="animate-pulse space-y-4">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="h-24 bg-gray-200 rounded"></div>
          ))}
        </div>
      </div>
    );
  }

  if (error) return <div className="text-red-500">{error}</div>;

  const financialOverviewCards: { key: string; label: string; value: number }[] = [];
  const salesProjectMetricsCards = Object.entries(salesProjectMetrics).map(([key, value]) => ({
    key: `salesProjectMetrics-${key}`,
    label: key.replace(/_/g, ' '),
    value,
  }));
  const operationalAndCustomerMetricsCards = Object.entries(operationalAndCustomerMetrics).map(([key, value]) => ({
    key: `operationalAndCustomerMetrics-${key}`,
    label: key.replace(/_/g, ' '),
    value,
  }));


  const handleSectionClick = (section: typeof openSection) => {
    setOpenSection(section);
  };

  return (
    <div className="relative z-10 sm:p-3 lg:p-4 w-full min-w-0 mb-20">
      {/* Collapsible Section Headers Row */}
      <div className="grid grid-cols-2  lg:flex gap-2 mb-3 px-0 py-1 w-full min-w-0">

        <button
          className={`w-full flex-1 flex-shrink min-w-0 flex items-center justify-between px-2 py-6 rounded-lg shadow bg-blue-50/60 hover:bg-blue-100 transition font-semibold text-blue-700 text-[11px] sm:text-xs ${openSection === 'salesProjectMetrics' ? 'ring-2 ring-blue-400' : ''}`}
          onClick={() => handleSectionClick('salesProjectMetrics')}
        >
          <span className="truncate text-left flex-1">Sales & Project Metrics</span>
          <span className="flex items-center justify-end ml-2">
            {openSection === 'salesProjectMetrics' ? <MdExpandLess size={18} /> : <MdExpandMore size={18} />}
          </span>
        </button>
        <button
          className={`w-full flex-1 flex-shrink min-w-0 flex items-center justify-between px-2 py-6 rounded-lg shadow bg-teal-50/60 hover:bg-teal-100 transition font-semibold text-teal-700 text-[11px] sm:text-xs ${openSection === 'operationalAndCustomerMetrics' ? 'ring-2 ring-teal-400' : ''}`}
          onClick={() => handleSectionClick('operationalAndCustomerMetrics')}
        >
          <span className="truncate text-left flex-1">Operational & Customer Metrics</span>
          <span className="flex items-center justify-end ml-2">
            {openSection === 'operationalAndCustomerMetrics' ? <MdExpandLess size={18} /> : <MdExpandMore size={18} />}
          </span>
        </button>
      </div>

      {/* Collapsible Section Content */}


      {openSection === 'salesProjectMetrics' && (
         <section className="mb-6 sm:mb-8 bg-blue-50/60 rounded-2xl shadow p-1 sm:p-4 lg:p-6">
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-1 sm:gap-3 lg:gap-4">
            {salesProjectMetricsCards.map(card => (
              <DashboardCard key={card.key} label={card.label} value={card.value} />
            ))}
          </div>
        </section>
      )}

      {openSection === 'operationalAndCustomerMetrics' && (
        <section className="mb-6 sm:mb-8 bg-teal-50/60 rounded-2xl shadow p-1 sm:p-4 lg:p-6">
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-1 sm:gap-3 lg:gap-4">
            {operationalAndCustomerMetricsCards.map(card => (
              <DashboardCard key={card.key} label={card.label} value={card.value} />
            ))}
          </div>
        </section>
      )}



      <div className="p-2 sm:p-4">
        <div className="w-full min-h-[220px] sm:min-h-[350px] bg-white rounded-lg shadow p-2 sm:p-4 overflow-x-auto mb-4">
          <PieChartComponent data={expenseBreakdown} />
        </div>
        <div className="w-full min-h-[220px] sm:min-h-[350px] bg-white rounded-lg shadow p-2 sm:p-4 overflow-x-auto">
          <BarChartComponent />
        </div>
      </div>
    </div>
  );
};

export default FactoryManagerDashboard;
