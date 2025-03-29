import { useEffect, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faChevronDown } from "@fortawesome/free-solid-svg-icons";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Cell,
  CartesianGrid,
  ResponsiveContainer,
  ComposedChart,
  Line,
  Area,
  Tooltip,
  Scatter,
} from "recharts";
const colors = [
  "#0088FE",
  "#00C49F",
  "#FFBB28",
  "#FF8042",
  "red",
  "pink",
  "brown",
  "cyan",
  "green",
  "indigo",
  "violet",
];
import { Accordion, Placeholder } from "rsuite";

const Dashboard = () => {
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

  useEffect(() => {
    async function fetchInfo() {
      try {
        const response = await fetch(
          "https://kidsdesigncompany.pythonanywhere.com/api/project-manager-dashboard/"
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
      value:
        income[0]?.total ||
        Math.floor(Math.random() * (100000 - 40000 + 1)) + 40000,
    },
    {
      month: income[1]?.month || "Feb",
      value:
        income[1]?.total ||
        Math.floor(Math.random() * (100000 - 40000 + 1)) + 40000,
    },
    {
      month: income[2]?.month || "Mar",
      value:
        income[2]?.total ||
        Math.floor(Math.random() * (100000 - 40000 + 1)) + 40000,
    },
    {
      month: income[3]?.month || "Apr",
      value:
        income[3]?.total ||
        Math.floor(Math.random() * (100000 - 40000 + 1)) + 40000,
    },
    {
      month: income[4]?.month || "May",
      value:
        income[4]?.total ||
        Math.floor(Math.random() * (100000 - 40000 + 1)) + 40000,
    },
    {
      month: income[5]?.month || "Jun",
      value:
        income[5]?.total ||
        Math.floor(Math.random() * (100000 - 40000 + 1)) + 40000,
    },
    {
      month: income[6]?.month || "Jul",
      value:
        income[6]?.total ||
        Math.floor(Math.random() * (100000 - 40000 + 1)) + 40000,
    },
    {
      month: income[7]?.month || "Aug",
      value:
        income[7]?.total ||
        Math.floor(Math.random() * (100000 - 40000 + 1)) + 40000,
    },
    {
      month: income[8]?.month || "Sept",
      value:
        income[8]?.total ||
        Math.floor(Math.random() * (100000 - 40000 + 1)) + 40000,
    },
    {
      month: income[9]?.month || "Oct",
      value:
        income[9]?.total ||
        Math.floor(Math.random() * (100000 - 40000 + 1)) + 40000,
    },
    {
      month: income[10]?.month || "Nov",
      value:
        income[10]?.total ||
        Math.floor(Math.random() * (100000 - 40000 + 1)) + 40000,
    },
    {
      month: income[11]?.month || "Dec",
      value:
        income[11]?.total ||
        Math.floor(Math.random() * (100000 - 40000 + 1)) + 40000,
    },
  ];

  const expensesData = [
    {
      month: expenses[0]?.month || "Jan",
      value:
        expenses[0]?.total ||
        Math.floor(Math.random() * (100000 - 40000 + 1)) + 40000,
    },
    {
      month: expenses[1]?.month || "Feb",
      value:
        expenses[1]?.total ||
        Math.floor(Math.random() * (100000 - 40000 + 1)) + 40000,
    },
    {
      month: expenses[2]?.month || "Mar",
      value:
        expenses[2]?.total ||
        Math.floor(Math.random() * (100000 - 40000 + 1)) + 40000,
    },
    {
      month: expenses[3]?.month || "Apr",
      value:
        expenses[3]?.total ||
        Math.floor(Math.random() * (100000 - 40000 + 1)) + 40000,
    },
    {
      month: expenses[4]?.month || "May",
      value:
        expenses[4]?.total ||
        Math.floor(Math.random() * (100000 - 40000 + 1)) + 40000,
    },
    {
      month: expenses[5]?.month || "Jun",
      value:
        expenses[5]?.total ||
        Math.floor(Math.random() * (100000 - 40000 + 1)) + 40000,
    },
    {
      month: expenses[6]?.month || "Jul",
      value:
        expenses[6]?.total ||
        Math.floor(Math.random() * (100000 - 40000 + 1)) + 40000,
    },
    {
      month: expenses[7]?.month || "Aug",
      value:
        expenses[7]?.total ||
        Math.floor(Math.random() * (100000 - 40000 + 1)) + 40000,
    },
    {
      month: expenses[8]?.month || "Sept",
      value:
        expenses[8]?.total ||
        Math.floor(Math.random() * (100000 - 40000 + 1)) + 40000,
    },
    {
      month: expenses[9]?.month || "Oct",
      value:
        expenses[9]?.total ||
        Math.floor(Math.random() * (100000 - 40000 + 1)) + 40000,
    },
    {
      month: expenses[10]?.month || "Nov",
      value:
        expenses[10]?.total ||
        Math.floor(Math.random() * (100000 - 40000 + 1)) + 40000,
    },
    {
      month: expenses[11]?.month || "Dec",
      value:
        expenses[11]?.total ||
        Math.floor(Math.random() * (100000 - 40000 + 1)) + 40000,
    },
  ];

  const getPath = (x: number, y: number, width: number, height: number) => {
    return `M${x},${y + height}C${x + width / 3},${y + height} ${
      x + width / 2
    },${y + height / 3}
    ${x + width / 2}, ${y}
    C${x + width / 2},${y + height / 3} ${x + (2 * width) / 3},${y + height} ${
      x + width
    }, ${y + height}
    Z`;
  };

  interface TriangleBarProps {
    fill?: string;
    x?: number;
    y?: number;
    width?: number;
    height?: number;
  }

  const TriangleBar = (props: TriangleBarProps) => {
    const { fill, x = 0, y = 0, width = 0, height = 0 } = props;

    return <path d={getPath(x, y, width, height)} stroke="none" fill={fill} />;
  };

  const profitData = [
    {
      month: profit[0]?.month || "Jan",
      value:
        profit[0]?.total ||
        Math.floor(Math.random() * (100000 - 40000 + 1)) + 40000,
    },
    {
      month: profit[1]?.month || "Feb",
      value:
        profit[1]?.total ||
        Math.floor(Math.random() * (100000 - 40000 + 1)) + 40000,
    },
    {
      month: profit[2]?.month || "Mar",
      value:
        profit[2]?.total ||
        Math.floor(Math.random() * (100000 - 40000 + 1)) + 40000,
    },
    {
      month: profit[3]?.month || "Apr",
      value:
        profit[3]?.total ||
        Math.floor(Math.random() * (100000 - 40000 + 1)) + 40000,
    },
    {
      month: profit[4]?.month || "May",
      value:
        profit[4]?.total ||
        Math.floor(Math.random() * (100000 - 40000 + 1)) + 40000,
    },
    {
      month: profit[5]?.month || "Jun",
      value:
        profit[5]?.total ||
        Math.floor(Math.random() * (100000 - 40000 + 1)) + 40000,
    },
    {
      month: profit[6]?.month || "Jul",
      value:
        profit[6]?.total ||
        Math.floor(Math.random() * (100000 - 40000 + 1)) + 40000,
    },
    {
      month: profit[7]?.month || "Aug",
      value:
        profit[7]?.total ||
        Math.floor(Math.random() * (100000 - 40000 + 1)) + 40000,
    },
    {
      month: profit[8]?.month || "Sept",
      value:
        profit[8]?.total ||
        Math.floor(Math.random() * (100000 - 40000 + 1)) + 40000,
    },
    {
      month: profit[9]?.month || "Oct",
      value:
        profit[9]?.total ||
        Math.floor(Math.random() * (100000 - 40000 + 1)) + 40000,
    },
    {
      month: profit[10]?.month || "Nov",
      value:
        profit[10]?.total ||
        Math.floor(Math.random() * (100000 - 40000 + 1)) + 40000,
    },
    {
      month: profit[11]?.month || "Dec",
      value:
        profit[11]?.total ||
        Math.floor(Math.random() * (100000 - 40000 + 1)) + 40000,
    },
  ];

  return (
    <div className="w-11/12 mx-auto mt-6 pl-1 pt-2">
      <div className="mb-16">
        <div className="grid items-center md:grid-cols-2 gap-3 mb-8 md:mb-20">
          <Accordion className="border-gray-20 border-2">
            <Accordion.Panel
              header="Breakdown Year"
              defaultExpanded
              style={{ fontSize: "clamp(12.5px, 3vw, 16px)" }}
            >
              <div className="text-gray-500 space-y-2">
                <p style={{ fontSize: "clamp(11.4px, 3vw, 13.6px)" }}>
                  <span className="font-semibold">No shop projects year: </span>
                  {breakdownYear?.no_shop_projects_year || 0}
                </p>
                <p style={{ fontSize: "clamp(11.4px, 3vw, 13.6px)" }}>
                  <span className="font-semibold">Percentage projects: </span>
                  {breakdownYear?.percentage_projects || 0}
                </p>
                <p style={{ fontSize: "clamp(11.4px, 3vw, 13.6px)" }}>
                  <span className="font-semibold">Percentage shop: </span>
                  {breakdownYear?.percentage_shop || 0}
                </p>
                <p style={{ fontSize: "clamp(11.4px, 3vw, 13.6px)" }}>
                  <span className="font-semibold">Profit year:</span>{" "}
                  {breakdownYear?.profit_year || 0}
                </p>
                <p style={{ fontSize: "clamp(11.4px, 3vw, 13.6px)" }}>
                  <span className="font-semibold">Project expenses year: </span>
                  {breakdownYear?.project_expenses_year || 0}
                </p>
                <p style={{ fontSize: "clamp(11.4px, 3vw, 13.6px)" }}>
                  <span className="font-semibold">
                    Project shop income year:{" "}
                  </span>
                  {breakdownYear?.project_shop_income_year || 0}
                </p>
                <p style={{ fontSize: "clamp(11.4px, 3vw, 13.6px)" }}>
                  <span className="font-semibold">Project counts year: </span>
                  {breakdownYear?.projects_count_year || 0}
                </p>
                <p style={{ fontSize: "clamp(11.4px, 3vw, 13.6px)" }}>
                  <span className="font-semibold">
                    Total projects income year:{" "}
                  </span>
                  {breakdownYear?.total_projects_income_year || 0}
                </p>
              </div>
            </Accordion.Panel>
          </Accordion>

          <Accordion className="border-gray-20 border-2">
            <Accordion.Panel
              header="Breakdown month"
              style={{ fontSize: "clamp(12.5px, 3vw, 16px)" }}
            >
              <div className="text-gray-500 space-y-2">
                <p style={{ fontSize: "clamp(11.4px, 3vw, 13.6px)" }}>
                  <span className="font-semibold">
                    No shop projects month:{" "}
                  </span>
                  {breakdownMonth?.no_shop_projects_month || 0}
                </p>
                <p style={{ fontSize: "clamp(11.4px, 3vw, 13.6px)" }}>
                  <span className="font-semibold">Percentage projects: </span>
                  {breakdownMonth?.percentage_projects || 0}
                </p>
                <p style={{ fontSize: "clamp(11.4px, 3vw, 13.6px)" }}>
                  <span className="font-semibold">Percentage shop: </span>
                  {breakdownMonth?.percentage_shop || 0}
                </p>
                <p style={{ fontSize: "clamp(11.4px, 3vw, 13.6px)" }}>
                  <span className="font-semibold">Profit month:</span>{" "}
                  {breakdownMonth?.profit_month || 0}
                </p>
                <p style={{ fontSize: "clamp(11.4px, 3vw, 13.6px)" }}>
                  <span className="font-semibold">
                    Project expenses month:{" "}
                  </span>
                  {breakdownMonth?.project_expenses_month || 0}
                </p>
                <p style={{ fontSize: "clamp(11.4px, 3vw, 13.6px)" }}>
                  <span className="font-semibold">
                    Project shop income month:{" "}
                  </span>
                  {breakdownMonth?.project_shop_income_month || 0}
                </p>
                <p style={{ fontSize: "clamp(11.4px, 3vw, 13.6px)" }}>
                  <span className="font-semibold">Project counts month: </span>
                  {breakdownMonth?.projects_count_month || 0}
                </p>
                <p style={{ fontSize: "clamp(11.4px, 3vw, 13.6px)" }}>
                  <span className="font-semibold">
                    Total projects income month:{" "}
                  </span>
                  {breakdownMonth?.total_projects_income_month || 0}
                </p>
              </div>
            </Accordion.Panel>
          </Accordion>

          <Accordion className="border-gray-20 border-2">
            <Accordion.Panel
              header="Expense breakdown year"
              style={{ fontSize: "clamp(12.5px, 3vw, 16px)" }}
            >
              <div className="text-gray-500 space-y-2">
                <p style={{ fontSize: "clamp(11.4px, 3vw, 13.6px)" }}>
                  <span className="font-semibold">Contractors: </span>
                  {expenseBreakdownYear?.contractors || 0}
                </p>
                <p style={{ fontSize: "clamp(11.4px, 3vw, 13.6px)" }}>
                  <span className="font-semibold">Factory Expenses: </span>
                  {expenseBreakdownYear?.factory_expenses || 0}
                </p>
                <p style={{ fontSize: "clamp(11.4px, 3vw, 13.6px)" }}>
                  <span className="font-semibold">
                    Other production expenses:{" "}
                  </span>
                  {expenseBreakdownYear?.other_production_expensis || 0}
                </p>
                <p style={{ fontSize: "clamp(11.4px, 3vw, 13.6px)" }}>
                  <span className="font-semibold">Overhead:</span>{" "}
                  {expenseBreakdownYear?.overhead || 0}
                </p>
                <p style={{ fontSize: "clamp(11.4px, 3vw, 13.6px)" }}>
                  <span className="font-semibold">Raw materials: </span>
                  {expenseBreakdownYear?.raw_materials || 0}
                </p>
                <p style={{ fontSize: "clamp(11.4px, 3vw, 13.6px)" }}>
                  <span className="font-semibold">Sold cost: </span>
                  {expenseBreakdownYear?.sold_cost || 0}
                </p>
                <p style={{ fontSize: "clamp(11.4px, 3vw, 13.6px)" }}>
                  <span className="font-semibold">
                    Total project expenses year:{" "}
                  </span>
                  {expenseBreakdownYear?.total_project_expenses_year || 0}
                </p>
                <p style={{ fontSize: "clamp(11.4px, 3vw, 13.6px)" }}>
                  <span className="font-semibold">
                    Yearly sold cost price:{" "}
                  </span>
                  {expenseBreakdownYear?.yearly_sold_cost_price || 0}
                </p>
              </div>
            </Accordion.Panel>
          </Accordion>

          <Accordion className="border-gray-20 border-2">
            <Accordion.Panel
              header="Expense breakdown month"
              style={{ fontSize: "clamp(12.5px, 3vw, 16px)" }}
            >
              <div className="text-gray-500 space-y-2">
                <p style={{ fontSize: "clamp(11.4px, 3vw, 13.6px)" }}>
                  <span className="font-semibold">Contractors: </span>
                  {expenseBreakdownMonth?.contractors || 0}
                </p>
                <p style={{ fontSize: "clamp(11.4px, 3vw, 13.6px)" }}>
                  <span className="font-semibold">Factory Expenses: </span>
                  {expenseBreakdownMonth?.factory_expenses || 0}
                </p>
                <p style={{ fontSize: "clamp(11.4px, 3vw, 13.6px)" }}>
                  <span className="font-semibold">
                    Other production expenses:{" "}
                  </span>
                  {expenseBreakdownMonth?.other_production_expensis || 0}
                </p>
                <p style={{ fontSize: "clamp(11.4px, 3vw, 13.6px)" }}>
                  <span className="font-semibold">Overhead:</span>{" "}
                  {expenseBreakdownMonth?.overhead || 0}
                </p>
                <p style={{ fontSize: "clamp(11.4px, 3vw, 13.6px)" }}>
                  <span className="font-semibold">Raw materials: </span>
                  {expenseBreakdownMonth?.raw_materials || 0}
                </p>
                <p style={{ fontSize: "clamp(11.4px, 3vw, 13.6px)" }}>
                  <span className="font-semibold">Sold cost: </span>
                  {expenseBreakdownMonth?.sold_cost || 0}
                </p>
                <p style={{ fontSize: "clamp(11.4px, 3vw, 13.6px)" }}>
                  <span className="font-semibold">
                    Total project expenses month:{" "}
                  </span>
                  {expenseBreakdownMonth?.total_project_expenses_month || 0}
                </p>
                <p style={{ fontSize: "clamp(11.4px, 3vw, 13.6px)" }}>
                  <span className="font-semibold">
                    Monthly sold cost price:{" "}
                  </span>
                  {expenseBreakdownMonth?.monthly_sold_cost_price || 0}
                </p>
              </div>
            </Accordion.Panel>
          </Accordion>
        </div>

        <div className="grid md:grid-cols-2 gap-7 items-center rounded-sm mb-9">
          {/* Income chart */}
          <div>
            <h1
              style={{ fontSize: "clamp(16.5px, 3vw, 23px)" }}
              className="font-semibold mb-2"
            >
              Income
            </h1>
            <ResponsiveContainer width="100%" height={447}>
              <BarChart
                data={incomeData}
                // margin={{left:30}}
                className="bg-white max-md:ml-[-7%]"
              >
                <defs>
                  <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="10%" stopColor="gray" stopOpacity={1} />
                    <stop offset="90%" stopColor="blue" stopOpacity={0.2} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />

                <YAxis dataKey="value" className="max-md:hidden max-md:w-0" />
                <Tooltip />
                <Bar
                  // type="monotone"
                  dataKey="value"
                  stroke="#0178a3"
                  fillOpacity={1}
                  fill="url(#colorValue)"
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
          {/* expenses chart */}
          <div>
            <h1 style={{ fontSize: "clamp(16.5px, 3vw, 23px)" }}>Expenses</h1>
            <ResponsiveContainer width="100%" height={460}>
              <BarChart
                data={expensesData}
                margin={{ top: 17, bottom: 9, left: 29 }}
                className="max-md:mx-[-50px]"
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis dataKey="value" className="max-md:hidden max-md:w-0" />

                {/* <Tooltip /> */}
                <Bar
                  dataKey="value"
                  stroke="black"
                  fillOpacity={1}
                  fill="green"
                  shape={<TriangleBar />}
                  label={{ position: "top" }}
                >
                  {expensesData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={colors[index % 20]} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
          {/* profit chart */}
          <div className="md:col-span-2">
            <h1
              style={{ fontSize: "clamp(16.5px, 3vw, 23px)" }}
              className="font-semibold mb-5"
            >
              Profit
            </h1>
            <ResponsiveContainer width="100%" height={400}>
              <ComposedChart
                data={profitData}
                margin={{ left: 30 }}
                className="max-md:mx-[-50px]"
              >
                <CartesianGrid stroke="#f5f5"></CartesianGrid>
                <XAxis dataKey="month"></XAxis>
                <YAxis dataKey="value" className="max-md:hidden max-md:w-0" />

                <Tooltip></Tooltip>
                {/* <Legend></Legend> */}
                <Area
                  type="monotone"
                  dataKey="value"
                  fill="gray"
                  stroke="#8884d8"
                />
                <Bar dataKey="value" barSize={30} fill="#413ea0" />
                <Line type="monotone" dataKey="value" stroke="gray" />
                <Scatter dataKey="value" fill="red" />
              </ComposedChart>
            </ResponsiveContainer>
          </div>
          1 peter 3v2 amp
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
