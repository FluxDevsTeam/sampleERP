import { useEffect, useState } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import dashboardDataJson from "@/data/shop/dashboard/dashboard.json";

const formatNairaCompact = (value: number) => {
  if (value >= 1_000_000) {
    return `₦${(value / 1_000_000).toFixed(1).replace(/\.0$/, "")}m`;
  } else if (value >= 1_000) {
    return `₦${(value / 1_000).toFixed(1).replace(/\.0$/, "")}k`;
  }
  return `₦${value.toLocaleString()}`;
};

const MonthlyProfitChart = () => {
  const [january, setJanuary] = useState("January");
  const [januaryValue, setJanuaryValue] = useState(0);
  const [february, setFebruary] = useState("February");
  const [februaryValue, setFebruaryValue] = useState(0);
  const [march, setMarch] = useState("March");
  const [marchValue, setMarchValue] = useState(0);
  const [april, setApril] = useState("April");
  const [aprilValue, setAprilValue] = useState(0);
  const [may, setMay] = useState("May");
  const [mayValue, setMayValue] = useState(0);
  const [june, setJune] = useState("June");
  const [juneValue, setJuneValue] = useState(0);
  const [july, setJuly] = useState("July");
  const [julyValue, setJulyValue] = useState(0);
  const [august, setAugust] = useState("August");
  const [augustValue, setAugustValue] = useState(0);
  const [september, setSeptember] = useState("September");
  const [septemberValue, setSeptemberValue] = useState(0);
  const [october, setOctober] = useState("October");
  const [octoberValue, setOctoberValue] = useState(0);
  const [november, setNovember] = useState("November");
  const [novemberValue, setNovemberValue] = useState(0);
  const [december, setDecember] = useState("December");
  const [decemberValue, setDecemberValue] = useState(0);

  const data = [
    { month: january, value: januaryValue },
    { month: february, value: februaryValue },
    { month: march, value: marchValue },
    { month: april, value: aprilValue },
    { month: may, value: mayValue },
    { month: june, value: juneValue },
    { month: july, value: julyValue },
    { month: august, value: augustValue },
    { month: september, value: septemberValue },
    { month: october, value: octoberValue },
    { month: november, value: novemberValue },
    { month: december, value: decemberValue },
  ];

  useEffect(() => {
    const monthlyProfit = dashboardDataJson.monthly_profit;
    if (monthlyProfit[0]) {
      setJanuary(monthlyProfit[0].month);
      setJanuaryValue(monthlyProfit[0].total);
    }
    if (monthlyProfit[1]) {
      setFebruary(monthlyProfit[1].month);
      setFebruaryValue(monthlyProfit[1].total);
    }
    if (monthlyProfit[2]) {
      setMarch(monthlyProfit[2].month);
      setMarchValue(monthlyProfit[2].total);
    }
    if (monthlyProfit[3]) {
      setApril(monthlyProfit[3].month);
      setAprilValue(monthlyProfit[3].total);
    }
    if (monthlyProfit[4]) {
      setMay(monthlyProfit[4].month);
      setMayValue(monthlyProfit[4].total);
    }
    if (monthlyProfit[5]) {
      setJune(monthlyProfit[5].month);
      setJuneValue(monthlyProfit[5].total);
    }
    if (monthlyProfit[6]) {
      setJuly(monthlyProfit[6].month);
      setJulyValue(monthlyProfit[6].total);
    }
    if (monthlyProfit[7]) {
      setAugust(monthlyProfit[7].month);
      setAugustValue(monthlyProfit[7].total);
    }
    if (monthlyProfit[8]) {
      setSeptember(monthlyProfit[8].month);
      setSeptemberValue(monthlyProfit[8].total);
    }
    if (monthlyProfit[9]) {
      setOctober(monthlyProfit[9].month);
      setOctoberValue(monthlyProfit[9].total);
    }
    if (monthlyProfit[10]) {
      setNovember(monthlyProfit[10].month);
      setNovemberValue(monthlyProfit[10].total);
    }
    if (monthlyProfit[11]) {
      setDecember(monthlyProfit[11].month);
      setDecemberValue(monthlyProfit[11].total);
    }
  }, []);

  return (
    <div>
      <h1
        style={{ fontSize: "clamp(16.5px, 3vw, 23px)" }}
        className="font-semibold mb-5"
      >
        Monthly Profit
      </h1>
      <ResponsiveContainer width="100%" height={300}>
        <BarChart
          data={data}
          className="bg-white"
          margin={{ left: 0, right: 14, top: 10, bottom: 9 }}
        >
          <defs>
            <linearGradient id="profitGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="10%" stopColor="#82ca9d" stopOpacity={1} />
              <stop offset="90%" stopColor="#82ca9d" stopOpacity={0.2} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="month" />
          <YAxis tickFormatter={formatNairaCompact} width={64} />
          <Tooltip formatter={(value: number) => formatNairaCompact(value)} />
          <Bar
            dataKey="value"
            stroke="#0178a3"
            fillOpacity={1}
            fill="url(#profitGradient)"
          />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default MonthlyProfitChart;