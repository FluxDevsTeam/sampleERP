import { useEffect, useState } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  ResponsiveContainer,
  ComposedChart,
  Line,
  Area,
  Tooltip,
  PieChart,
  Pie,
  Cell,
  Legend,
} from "recharts";
import { Accordion } from "rsuite";
import { RoundedBar, CustomTooltip } from "../../../components/CustomChartComponents";
import DashboardCard from "../../factory-manager-page/dashboard/DashboardCard";
import PieChartComponent from "../../factory-manager-page/dashboard/PieChart";
import BarChartComponent from "../../factory-manager-page/dashboard/Barchart";

const ProjectManagerDashboard = () => {
  document.title = "Product Dashboard - KDC Admin";

  const [breakdownYear, setbreakdownYear] = useState<any | null>(null);
  const [breakdownMonth, setbreakdownMonth] = useState<any | null>(null);
  const [expenseBreakdownYear, setexpenseBreakdownYear] = useState<any | null>(
    null
  );
  const [expenseBreakdownMonth, setexpenseBreakdownMonth] = useState<
    any | null
  >(null);

  const [income, setIncome] = useState<any[]>([]);
  const [expenses, setExpenses] = useState<any[]>([]);
  const [profit, setProfit] = useState<any[]>([]);

  const [showAllCards, setShowAllCards] = useState(false);

  useEffect(() => {
    async function fetchInfo() {
      try {
        const response = await fetch(
          "https://backend.kidsdesigncompany.com/api/project-manager-dashboard/",
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              Authorization: `JWT ${localStorage.getItem("accessToken")}`,
            },
          }
        );

        if (!response.ok) {
          throw new Error("Failed to fetch dashboard data");
        }

        const logData = await response.json();
        setbreakdownYear(logData.breakdown_year);
        setbreakdownMonth(logData.breakdown_month);
        setexpenseBreakdownYear(logData.expense_breakdown_year);
        setexpenseBreakdownMonth(logData.expense_breakdown_month);
        setIncome(logData.monthly_trends.income);
        setExpenses(logData.monthly_trends.expenses);
        setIncome(logData.monthly_trends.income);
        setProfit(logData.monthly_trends.profit);

        console.log(logData);
      } catch (error) {
        console.error("Error fetching dashboard:", error);
        setbreakdownYear({});
      }
    }
    fetchInfo();
  }, []);

  const incomeData = [
    {
      month: income[0]?.month || "Jan",
      value: income[0]?.total || 0,
    },
    {
      month: income[1]?.month || "Feb",
      value: income[1]?.total || 0,
    },
    {
      month: income[2]?.month || "Mar",
      value: income[2]?.total || 0,
    },
    {
      month: income[3]?.month || "Apr",
      value: income[3]?.total || 0,
    },
    {
      month: income[4]?.month || "May",
      value: income[4]?.total || 0,
    },
    {
      month: income[5]?.month || "Jun",
      value: income[5]?.total || 0,
    },
    {
      month: income[6]?.month || "Jul",
      value: income[6]?.total || 0,
    },
    {
      month: income[7]?.month || "Aug",
      value: income[7]?.total || 0,
    },
    {
      month: income[8]?.month || "Sept",
      value: income[8]?.total || 0,
    },
    {
      month: income[9]?.month || "Oct",
      value: income[9]?.total || 0,
    },
    {
      month: income[10]?.month || "Nov",
      value: income[10]?.total || 0,
    },
    {
      month: income[11]?.month || "Dec",
      value: income[11]?.total || 0,
    },
  ];

  const expensesData = [
    {
      month: expenses[0]?.month || "Jan",
      value: expenses[0]?.total || 0,
    },
    {
      month: expenses[1]?.month || "Feb",
      value: expenses[1]?.total || 0,
    },
    {
      month: expenses[2]?.month || "Mar",
      value: expenses[2]?.total || 0,
    },
    {
      month: expenses[3]?.month || "Apr",
      value: expenses[3]?.total || 0,
    },
    {
      month: expenses[4]?.month || "May",
      value: expenses[4]?.total || 0,
    },
    {
      month: expenses[5]?.month || "Jun",
      value: expenses[5]?.total || 0,
    },
    {
      month: expenses[6]?.month || "Jul",
      value: expenses[6]?.total || 0,
    },
    {
      month: expenses[7]?.month || "Aug",
      value: expenses[7]?.total || 0,
    },
    {
      month: expenses[8]?.month || "Sept",
      value: expenses[8]?.total || 0,
    },
    {
      month: expenses[9]?.month || "Oct",
      value: expenses[9]?.total || 0,
    },
    {
      month: expenses[10]?.month || "Nov",
      value: expenses[10]?.total || 0,
    },
    {
      month: expenses[11]?.month || "Dec",
      value: expenses[11]?.total || 0,
    },
  ];

  const profitData = [
    {
      month: profit[0]?.month || "Jan",
      value: profit[0]?.total || 0,
    },
    {
      month: profit[1]?.month || "Feb",
      value: profit[1]?.total || 0,
    },
    {
      month: profit[2]?.month || "Mar",
      value: profit[2]?.total || 0,
    },
    {
      month: profit[3]?.month || "Apr",
      value: profit[3]?.total || 0,
    },
    {
      month: profit[4]?.month || "May",
      value: profit[4]?.total || 0,
    },
    {
      month: profit[5]?.month || "Jun",
      value: profit[5]?.total || 0,
    },
    {
      month: profit[6]?.month || "Jul",
      value: profit[6]?.total || 0,
    },
    {
      month: profit[7]?.month || "Aug",
      value: profit[7]?.total || 0,
    },
    {
      month: profit[8]?.month || "Sept",
      value: profit[8]?.total || 0,
    },
    {
      month: profit[9]?.month || "Oct",
      value: profit[9]?.total || 0,
    },
    {
      month: profit[10]?.month || "Nov",
      value: profit[10]?.total || 0,
    },
    {
      month: profit[11]?.month || "Dec",
      value: profit[11]?.total || 0,
    },
  ];

  // Helper to determine if a key is monetary
  const isMonetary = (key: string) => {
    const excluded = [
      'no_shop_projects_year', 'no_shop_projects_month', 'projects_count_year', 'projects_count_month',
      'percentage_projects', 'percentage_shop',
    ];
    if (key.toLowerCase() === 'other_production_expensis') return true;
    if (excluded.includes(key.toLowerCase())) return false;
    return /amount|income|profit|expenses|cost|price|total|contractors|overhead|materials|sold|value|pay|shop/i.test(key);
  };

  // Helper to filter out percentage cards
  const isPercentageKey = (key: string) => ['percentage_projects', 'percentage_shop'].includes(key.toLowerCase());

  // Grouped cards
  const yearlyBreakdownCards = breakdownYear ? Object.entries(breakdownYear)
    .filter(([key]) => !isPercentageKey(key))
    .map(([key, value]) => ({
      key: `breakdownYear-${key}`,
      title: key.replace(/_/g, ' '),
      value: Number(value) || 0,
      currency: isMonetary(key) ? '\u20a6 ' : undefined
    })) : [];

  const monthlyBreakdownCards = breakdownMonth ? Object.entries(breakdownMonth)
    .filter(([key]) => !isPercentageKey(key))
    .map(([key, value]) => ({
      key: `breakdownMonth-${key}`,
      title: key.replace(/_/g, ' '),
      value: Number(value) || 0,
      currency: isMonetary(key) ? '\u20a6 ' : undefined
    })) : [];

  const yearlyExpenseCards = expenseBreakdownYear ? Object.entries(expenseBreakdownYear)
    .map(([key, value]) => ({
      key: `expenseBreakdownYear-${key}`,
      title: key.replace(/_/g, ' '),
      value: Number(value) || 0,
      currency: isMonetary(key) ? '\u20a6 ' : undefined
    })) : [];

  const monthlyExpenseCards = expenseBreakdownMonth ? Object.entries(expenseBreakdownMonth)
    .map(([key, value]) => ({
      key: `expenseBreakdownMonth-${key}`,
      title: key.replace(/_/g, ' '),
      value: Number(value) || 0,
      currency: isMonetary(key) ? '\u20a6 ' : undefined
    })) : [];

  // Combine for show more/less logic
  const allCards = [
    ...yearlyBreakdownCards,
    ...monthlyBreakdownCards,
    ...yearlyExpenseCards,
    ...monthlyExpenseCards,
  ];

  // Number of columns in the grid (should match lg:grid-cols-6)
  const numCols = 6;
  const numRowsDefault = 2;
  const defaultVisibleCount = numCols * numRowsDefault;
  const visibleCards = showAllCards ? allCards : allCards.slice(0, defaultVisibleCount);

  // Helper to render a group with heading, with optional slice
  const renderCardGroup = (heading: string, cards: any[], start: number, end: number) => {
    const groupCards = cards.slice(start, end);
    return groupCards.length ? (
      <div className="mb-2">
        <h4 className="text-xs font-semibold text-gray-500 mb-1 pl-1 uppercase tracking-wide">{heading}</h4>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
          {groupCards.map(card => (
            <DashboardCard key={card.key} title={card.title} value={card.value} currency={card.currency} />
          ))}
        </div>
      </div>
    ) : null;
  };

  // Helper to get visible cards per group for the first N cards
  function getVisibleGroupSlices(groups: any[][], max: number) {
    let remaining = max;
    const slices = [];
    for (const group of groups) {
      if (remaining <= 0) {
        slices.push([0, 0]);
        continue;
      }
      const take = Math.min(group.length, remaining);
      slices.push([0, take]);
      remaining -= take;
    }
    return slices;
  }

  const groups = [yearlyBreakdownCards, monthlyBreakdownCards, yearlyExpenseCards, monthlyExpenseCards];
  const groupNames = ['Yearly Breakdown', 'Monthly Breakdown', 'Yearly Expenses', 'Monthly Expenses'];
  const groupSlices = showAllCards ? groups.map(g => [0, g.length]) : getVisibleGroupSlices(groups, defaultVisibleCount);

  // Prepare pie chart data (use monthlyExpenseCards as example, adapt as needed)
  const pieChartData = monthlyExpenseCards.map(card => ({ name: card.title, value: card.value }));

  return (
    <div>
      <div className="p-2 sm:p-4">
        {/* Grouped card sections, only first 2 rows by default */}
        {groups.map((group, i) => renderCardGroup(groupNames[i], group, groupSlices[i][0], groupSlices[i][1]))}
        {allCards.length > defaultVisibleCount && (
          <div className="flex justify-center mb-4">
            <button
              className="flex items-center justify-center w-10 h-10 bg-blue-400 text-white rounded-full shadow-lg hover:bg-blue-400 transition-transform duration-200 focus:outline-none"
              onClick={() => setShowAllCards(v => !v)}
              title={showAllCards ? 'Show Less' : 'Show More'}
              aria-label={showAllCards ? 'Show Less' : 'Show More'}
            >
              <svg
                className={`w-6 h-6 transform transition-transform duration-300 ${showAllCards ? 'rotate-180' : ''}`}
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
              </svg>
            </button>
          </div>
        )}
      </div>
      <div className="p-2 sm:p-4">
        <div className="w-full min-h-[220px] sm:min-h-[350px] bg-white rounded-lg shadow p-2 sm:p-4 overflow-x-auto mb-4">
          <PieChartComponent data={pieChartData} />
        </div>
        <div className="w-full min-h-[220px] sm:min-h-[350px] bg-white rounded-lg shadow p-2 sm:p-4 overflow-x-auto">
          <BarChartComponent />
        </div>
      </div>
    </div>
  );
};

export default ProjectManagerDashboard;
