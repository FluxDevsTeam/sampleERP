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

const formatNairaCompact = (value: number) =>
  `\u20a6${new Intl.NumberFormat("en-US", {
    notation: "compact",
    compactDisplay: "short",
  }).format(value)}`;

const AmountSoldMonthlyBarChart = () => {
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
    const amountSold = dashboardDataJson.amount_sold_monthly;
    if (amountSold[0]) {
      setJanuary(amountSold[0].month);
      setJanuaryValue(amountSold[0].total);
    }
    if (amountSold[1]) {
      setFebruary(amountSold[1].month);
      setFebruaryValue(amountSold[1].total);
    }
    if (amountSold[2]) {
      setMarch(amountSold[2].month);
      setMarchValue(amountSold[2].total);
    }
    if (amountSold[3]) {
      setApril(amountSold[3].month);
      setAprilValue(amountSold[3].total);
    }
    if (amountSold[4]) {
      setMay(amountSold[4].month);
      setMayValue(amountSold[4].total);
    }
    if (amountSold[5]) {
      setJune(amountSold[5].month);
      setJuneValue(amountSold[5].total);
    }
    if (amountSold[6]) {
      setJuly(amountSold[6].month);
      setJulyValue(amountSold[6].total);
    }
    if (amountSold[7]) {
      setAugust(amountSold[7].month);
      setAugustValue(amountSold[7].total);
    }
    if (amountSold[8]) {
      setSeptember(amountSold[8].month);
      setSeptemberValue(amountSold[8].total);
    }
    if (amountSold[9]) {
      setOctober(amountSold[9].month);
      setOctoberValue(amountSold[9].total);
    }
    if (amountSold[10]) {
      setNovember(amountSold[10].month);
      setNovemberValue(amountSold[10].total);
    }
    if (amountSold[11]) {
      setDecember(amountSold[11].month);
      setDecemberValue(amountSold[11].total);
    }
  }, []);

  return (
    <div>
      <h1
        style={{ fontSize: "clamp(16.5px, 3vw, 23px)" }}
        className="font-semibold mb-2"
      >
        Monthly Sales Amount
      </h1>
      <ResponsiveContainer width="100%" height={300}>
        <BarChart
          data={data}
          className="bg-white"
          margin={{ left: 0, right: 14, top: 10, bottom: 9 }}
        >
          <defs>
            <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
              <stop offset="10%" stopColor="gray" stopOpacity={1} />
              <stop offset="90%" stopColor="blue" stopOpacity={0.2} />
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
            fill="url(#colorValue)"
          />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default AmountSoldMonthlyBarChart;