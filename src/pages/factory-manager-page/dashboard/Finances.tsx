/* eslint-disable @typescript-eslint/no-explicit-any */
import { factoryData } from "./api";
import { useState, useEffect } from "react";
import PieChartComponent from "./PieChart";
import BarChartComponent from "./Barchart";

// Reusable Dropdown Component
const Dropdown = ({
  title,
  data,
}: {
  title: string;
  data: Record<string, number>;
}) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="relative inline-block text-left w-[400px] mb-2">
      <button
        onClick={() => setIsOpen((prev) => !prev)}
        className="px-4 py-2 bg-gray-20 text-white rounded-lg hover:bg-gray-700 w-full flex justify-between items-center"
      >
        <span>{title}</span>
        <span className={`text-[25px] transform ${isOpen ? "rotate-180" : ""}`}>
          &#9662;
        </span>
      </button>

      {isOpen && (
        <div className="absolute mt-2 w-full bg-white border border-gray-300 rounded-lg shadow-lg z-10">
          <ul className="p-2">
            {Object.entries(data).map(([key, value]) => (
              <li
                key={key}
                className="px-4 py-1 hover:bg-gray-100 cursor-pointer flex justify-between"
              >
                <span>{key.replace(/_/g, " ")}:</span>
                <span>{value}</span>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

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

        console.log("Fetched data:", data);

        if (data?.financial_health) {
          setFinancialHealth({
            Active_Assets: data.financial_health.active_assets || 0,
            Deprecated_Assets: data.financial_health.deprecated_assets || 0,
            Sales_Count: data.financial_health.sales_count_this_month || 0,
            Project_Sales: data.financial_health.total_project_sales_this_month || 0,
            Non_Project_Sales: data.financial_health.total_non_project_sales_this_month || 0,
            Shop_Items_Sold: data.financial_health.total_shop_items_sold_this_month || 0,
            Shop_Profit: data.financial_health.total_shop_profit_this_month || 0,
            Project_Count: data.financial_health.project_count_this_month || 0,
            Project_Amount: data.financial_health.total_project_amount_this_month || 0,
            Total_Income: data.financial_health.total_income_this_month || 0,
            Total_Expenses: data.financial_health.total_expenses_month || 0,
            Profit: data.financial_health.profit_month || 0,
          });
        }

        if (data?.yearly_data) {
          setYearlyData({
            Total_Expenses: data.yearly_data.total_expenses_year || 0,
            Total_Income: data.yearly_data.total_income_year || 0,
            Profit: data.yearly_data.profit_year || 0,
          });
        }

        if (data?.customers) {
          setCustomerData({
            All_Customers: data.customers.all_customers_count || 0,
            Active_Customers: data.customers.active_customers_count || 0,
            Owing_Customers: data.customers.owing_customers_count || 0
          });
        }

        if (data?.workers) {
          setWorkerData({
            Salary_Workers: data.workers.salary_workers_count || 0,
            Active_Salary_Workers: data.workers.active_salary_workers_count || 0,
            Salary_Workers_Pay: data.workers.total_salary_workers_monthly_pay || 0,
            All_Contractors: data.workers.all_contractors_count || 0,
            Active_Contractors: data.workers.all_active_contractors_count || 0,
          });
        }

        if (data?.paid) {
          setPaidData({
            Monthly_Total_Paid: data.paid.monthly_total_paid || 0,
            Weekly_Total_Paid: data.paid.weekly_total_paid || 0,
            Total_Paid: data.paid.total_paid || 0,
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

  return (
    <div>
      <div className="p-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {/* Financial Health Dropdown */}
        <Dropdown title="Financial Health" data={financialHealth} />

        {/* Yearly Data Dropdown */}
        <Dropdown title="Yearly Data" data={yearlyData} />
        <Dropdown title="Customer" data={customerData} />
        <Dropdown title="Workers" data={workerData} />
        <Dropdown title="Paid" data={paidData} />
      </div>
      <div className="p-4">
        <h2 className="text-lg font-bold mb-8">Financial Overview</h2>
        <PieChartComponent data={expenseBreakdown} />
        <BarChartComponent />
      </div>
  </div>
  );
};

export default Finances;
