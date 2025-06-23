/* eslint-disable @typescript-eslint/no-explicit-any */
import { factoryData } from "./api";
import { useState, useEffect } from "react";
import PieChartComponent from "./PieChart";
import BarChartComponent from "./Barchart";
import { Accordion } from 'rsuite';
import 'rsuite/dist/rsuite.min.css';

const Finances = () => {
  const [financialHealth, setFinancialHealth] = useState<Record<string, number>>({});
  const [yearlyData, setYearlyData] = useState<Record<string, number>>({});
  const [customerData, setCustomerData] = useState<Record<string, number>>({});
  const [workerData, setWorkerData] = useState<Record<string, number>>({});
  const [paidData, setPaidData] = useState<Record<string, number>>({});
  const [expenseBreakdown, setExpenseBreakdown] = useState<{ name: string; value: number }[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchFactory = async () => {
      try {
        setLoading(true);
        const data = await factoryData();

        if (data?.financial_health) {
          setFinancialHealth({
            "Active Assets": data.financial_health.active_assets || 0,
            "Deprecated Assets": data.financial_health.deprecated_assets || 0,
            "Sales Count (This Month)": data.financial_health.sales_count_this_month || 0,
            "Project Sales (This Month)": data.financial_health.total_project_sales_this_month || 0,
            "Non-Project Sales (This Month)": data.financial_health.total_non_project_sales_this_month || 0,
            "Shop Items Sold (This Month)": data.financial_health.total_shop_items_sold_this_month || 0,
            "Shop Profit (This Month)": data.financial_health.total_shop_profit_this_month || 0,
            "Project Count (This Month)": data.financial_health.project_count_this_month || 0,
            "Project Amount (This Month)": data.financial_health.total_project_amount_this_month || 0,
            "Total Income (This Month)": data.financial_health.total_income_this_month || 0,
            "Total Expenses (This Month)": data.financial_health.total_expenses_month || 0,
            "Profit (This Month)": data.financial_health.profit_month || 0,
          });
        }

        if (data?.yearly_data) {
          setYearlyData({
            "Total Expenses (Year)": data.yearly_data.total_expenses_year || 0,
            "Total Income (Year)": data.yearly_data.total_income_year || 0,
            "Profit (Year)": data.yearly_data.profit_year || 0,
          });
        }

        if (data?.customers) {
          setCustomerData({
            "All Customers": data.customers.all_customers_count || 0,
            "Active Customers": data.customers.active_customers_count || 0,
            "Owing Customers": data.customers.owing_customers_count || 0
          });
        }

        if (data?.workers) {
          setWorkerData({
            "Salary Workers": data.workers.salary_workers_count || 0,
            "Active Salary Workers": data.workers.active_salary_workers_count || 0,
            "Salary Workers Pay": data.workers.total_salary_workers_monthly_pay || 0,
            "All Contractors": data.workers.all_contractors_count || 0,
            "Active Contractors": data.workers.all_active_contractors_count || 0,
          });
        }

        if (data?.paid) {
          setPaidData({
            "Monthly Total Paid": data.paid.monthly_total_paid || 0,
            "Weekly Total Paid": data.paid.weekly_total_paid || 0,
            "Total Paid": data.paid.total_paid || 0,
            "Contractors Monthly Pay": data.paid.total_contractors_monthly_pay || 0,
            "Contractors Weekly Pay": data.paid.total_contractors_weekly_pay || 0,
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

  const allData = [
    { title: "Financial Health", data: financialHealth },
    { title: "Yearly Data", data: yearlyData },
    { title: "Customer Data", data: customerData },
    { title: "Worker Data", data: workerData },
    { title: "Payment Data", data: paidData },
  ].filter(section => Object.keys(section.data).length > 0);


  if (loading) {
    return (
      <div className="bg-gray-50 min-h-screen p-4 sm:p-6 lg:p-8">
        <div className="max-w-7xl mx-auto animate-pulse">
          <div className="h-8 bg-gray-300 rounded w-1/4 mb-6"></div>
          <div className="space-y-4 mb-8">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="h-12 bg-gray-300 rounded-lg"></div>
            ))}
          </div>
          <div>
            <div className="h-7 bg-gray-300 rounded w-1/5 mb-4"></div>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="h-96 bg-gray-300 rounded-lg"></div>
              <div className="h-96 bg-gray-300 rounded-lg"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-gray-50 min-h-screen flex items-center justify-center">
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg relative" role="alert">
          <strong className="font-bold">Error:</strong>
          <span className="block sm:inline"> {error}</span>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gray-50 min-h-screen p-4 sm:p-6 lg:p-8">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Financial Dashboard</h1>

        {/* Info Accordion */}
        <div className="mb-12">
            <Accordion bordered>
                {allData.map(({ title, data }) => (
                    <Accordion.Panel header={title} key={title} defaultExpanded>
                        <div className="space-y-3 p-4">
                            {Object.entries(data).map(([key, value]) => (
                                <div key={key} className="flex justify-between items-start gap-4 text-sm">
                                    <p className="text-gray-600 capitalize">
                                        {key}:
                                    </p>
                                    <p className="font-medium text-gray-900 bg-gray-100 px-2 py-1 rounded text-right shrink-0">
                                        {typeof value === 'number' ? value.toLocaleString() : value}
                                    </p>
                                </div>
                            ))}
                        </div>
                    </Accordion.Panel>
                ))}
            </Accordion>
        </div>

        {/* Charts Section */}
        <div>
          <h2 className="text-2xl font-semibold text-gray-800 mb-6">Financial Overview</h2>
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
            <div className="lg:col-span-2 bg-white p-6 rounded-lg shadow-md border border-gray-200">
                <h3 className="text-xl font-semibold mb-4 text-gray-700">Expense Breakdown</h3>
                <PieChartComponent data={expenseBreakdown} />
            </div>
            <div className="lg:col-span-3 bg-white p-6 rounded-lg shadow-md border border-gray-200">
                <h3 className="text-xl font-semibold mb-4 text-gray-700">Income & Expense Trends</h3>
                <BarChartComponent />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Finances;
