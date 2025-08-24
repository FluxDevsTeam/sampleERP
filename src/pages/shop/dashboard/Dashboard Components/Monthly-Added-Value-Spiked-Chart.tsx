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

const MonthlyAddedValueChart = () => {
  const [january, setJanuary] = useState("Jan");
  const [januaryValue, setJanuaryValue] = useState(0);
  const [february, setFebruary] = useState("Feb");
  const [februaryValue, setFebruaryValue] = useState(0);
  const [march, setMarch] = useState("Mar");
  const [marchValue, setMarchValue] = useState(0);
  const [april, setApril] = useState("Apr");
  const [aprilValue, setAprilValue] = useState(0);
  const [may, setMay] = useState("May");
  const [mayValue, setMayValue] = useState(0);
  const [june, setJune] = useState("Jun");
  const [juneValue, setJuneValue] = useState(0);
  const [july, setJuly] = useState("Jul");
  const [julyValue, setJulyValue] = useState(0);
  const [august, setAugust] = useState("Aug");
  const [augustValue, setAugustValue] = useState(0);
  const [september, setSeptember] = useState("Sep");
  const [septemberValue, setSeptemberValue] = useState(0);
  const [october, setOctober] = useState("Oct");
  const [octoberValue, setOctoberValue] = useState(0);
  const [november, setNovember] = useState("Nov");
  const [novemberValue, setNovemberValue] = useState(0);
  const [december, setDecember] = useState("Dec");
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
    const monthlyAdded = dashboardDataJson.monthly_added_value;
    if (monthlyAdded[0]) {
      setJanuary(monthlyAdded[0].month);
      setJanuaryValue(monthlyAdded[0].total);
    }
    if (monthlyAdded[1]) {
      setFebruary(monthlyAdded[1].month);
      setFebruaryValue(monthlyAdded[1].total);
    }
    if (monthlyAdded[2]) {
      setMarch(monthlyAdded[2].month);
      setMarchValue(monthlyAdded[2].total);
    }
    if (monthlyAdded[3]) {
      setApril(monthlyAdded[3].month);
      setAprilValue(monthlyAdded[3].total);
    }
    if (monthlyAdded[4]) {
      setMay(monthlyAdded[4].month);
      setMayValue(monthlyAdded[4].total);
    }
    if (monthlyAdded[5]) {
      setJune(monthlyAdded[5].month);
      setJuneValue(monthlyAdded[5].total);
    }
    if (monthlyAdded[6]) {
      setJuly(monthlyAdded[6].month);
      setJulyValue(monthlyAdded[6].total);
    }
    if (monthlyAdded[7]) {
      setAugust(monthlyAdded[7].month);
      setAugustValue(monthlyAdded[7].total);
    }
    if (monthlyAdded[8]) {
      setSeptember(monthlyAdded[8].month);
      setSeptemberValue(monthlyAdded[8].total);
    }
    if (monthlyAdded[9]) {
      setOctober(monthlyAdded[9].month);
      setOctoberValue(monthlyAdded[9].total);
    }
    if (monthlyAdded[10]) {
      setNovember(monthlyAdded[10].month);
      setNovemberValue(monthlyAdded[10].total);
    }
    if (monthlyAdded[11]) {
      setDecember(monthlyAdded[11].month);
      setDecemberValue(monthlyAdded[11].total);
    }
  }, []);

  return (
    <div>
      <h1
        style={{ fontSize: "clamp(16.5px, 3vw, 23px)" }}
        className="font-semibold mb-2"
      >
        Monthly Added Value
      </h1>
      <ResponsiveContainer width="100%" height={300}>
        <BarChart
          data={data}
          className="bg-white"
          margin={{ left: 0, right: 14, top: 10, bottom: 9 }}
        >
          <defs>
            <linearGradient id="addedValueGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="10%" stopColor="#ffc658" stopOpacity={1} />
              <stop offset="90%" stopColor="#ffc658" stopOpacity={0.2} />
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
            fill="url(#addedValueGradient)"
          />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default MonthlyAddedValueChart;