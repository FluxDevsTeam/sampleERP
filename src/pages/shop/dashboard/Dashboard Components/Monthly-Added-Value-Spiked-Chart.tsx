import { useEffect, useState } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Cell,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
} from "recharts";

// Format number with naira sign and commas
const formatNaira = (value: number) => `₦${value.toLocaleString()}`;

// Add compact formatter
const formatNairaCompact = (value: number) => {
  if (value >= 1_000_000) {
    return `₦${(value / 1_000_000).toFixed(1).replace(/\.0$/, '')}m`;
  } else if (value >= 1_000) {
    return `₦${(value / 1_000).toFixed(1).replace(/\.0$/, '')}k`;
  }
  return `₦${value.toLocaleString()}`;
};

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

const MonthlyAddedValueSpikedChart = () => {
  const [month1, setMonth1] = useState("Jan");
  const [month1Num, setMonth1Num] = useState(0);

  const [month2, setMonth2] = useState("Feb");
  const [month2Num, setMonth2Num] = useState(0);

  const [month3, setMonth3] = useState("Mar");
  const [month3Num, setMonth3Num] = useState(0);

  const [month4, setMonth4] = useState("Apr");
  const [month4Num, setMonth4Num] = useState(0);

  const [month5, setMonth5] = useState("May");
  const [month5Num, setMonth5Num] = useState(0);

  const [month6, setMonth6] = useState("Jun");
  const [month6Num, setMonth6Num] = useState(0);

  const [month7, setMonth7] = useState("Jul");
  const [month7Num, setMonth7Num] = useState(0);

  const [month8, setMonth8] = useState("Aug");
  const [month8Num, setMonth8Num] = useState(0);

  const [month9, setMonth9] = useState("Sept");
  const [month9Num, setMonth9Num] = useState(0);

  const [month10, setMonth10] = useState("Oct");
  const [month10Num, setMonth10Num] = useState(0);

  const [month11, setMonth11] = useState("Nov");
  const [month11Num, setMonth11Num] = useState(0);

  const [month12, setMonth12] = useState("Dec");
  const [month12Num, setMonth12Num] = useState(0);

  const data = [
    { month: month1, value: month1Num },
    { month: month2, value: month2Num },
    { month: month3, value: month3Num },
    { month: month4, value: month4Num },
    { month: month5, value: month5Num },
    { month: month6, value: month6Num },
    { month: month7, value: month7Num },
    { month: month8, value: month8Num },
    { month: month9, value: month9Num },
    { month: month10, value: month10Num },
    { month: month11, value: month11Num },
    { month: month12, value: month12Num },
  ];

  useEffect(() => {
    async function fetchStockInfo() {
      // INVENTORY DASHBOARD
      try {
        const response = await fetch(
          "https://backend.kidsdesigncompany.com/api/shopkeeper-dashboard/",
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              Authorization: `JWT ${localStorage.getItem("accessToken")}`,
            },
          }
        );

        if (!response.ok) {
          throw new Error("Authentication failed");
        }

        const logData = await response.json();
        console.log(logData);

        setMonth1(logData.monthly_added_value[0].month);
        setMonth1Num(logData.monthly_added_value[0].total);

        setMonth2(logData.monthly_added_value[1].month);
        setMonth2Num(logData.monthly_added_value[1].total);

        setMonth3(logData.monthly_added_value[2].month);
        setMonth3Num(logData.monthly_added_value[2].total);

        setMonth4(logData.monthly_added_value[3].month);
        setMonth4Num(logData.monthly_added_value[3].total);

        setMonth5(logData.monthly_added_value[4].month);
        setMonth5Num(logData.monthly_added_value[4].total);

        setMonth6(logData.monthly_added_value[5].month);
        setMonth6Num(logData.monthly_added_value[5].total);

        setMonth7(logData.monthly_added_value[6].month);
        setMonth7Num(logData.monthly_added_value[6].total);

        setMonth8(logData.monthly_added_value[7].month);
        setMonth8Num(logData.monthly_added_value[7].total);

        setMonth9(logData.monthly_added_value[8].month);
        setMonth9Num(logData.monthly_added_value[8].total);

        setMonth10(logData.monthly_added_value[9].month);
        setMonth10Num(logData.monthly_added_value[9].total);

        setMonth11(logData.monthly_added_value[10].month);
        setMonth11Num(logData.monthly_added_value[10].total);

        setMonth12(logData.monthly_added_value[11].month);
        setMonth12Num(logData.monthly_added_value[11].total);
      } catch (error) {
        console.error("Error fetching dashboard:", error);
      }
    }

    fetchStockInfo();
  }, []);

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

  return (
    <div>
      <h1 style={{ fontSize: "clamp(16.5px, 3vw, 23px)" }}>
        Monthly Added Value
      </h1>
      <ResponsiveContainer width="100%" height={340}>
        <BarChart data={data} margin={{ left: 0, right: 14, top: 10, bottom: 9 }}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="month" />
          <YAxis tickFormatter={formatNairaCompact} width={60} />
          <Tooltip formatter={(value: number) => formatNairaCompact(value)} />
          <Bar
            dataKey="value"
            stroke="black"
            fillOpacity={1}
            fill="green"
            shape={<TriangleBar />}
            label={{ position: "top", formatter: formatNairaCompact }}
          >
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={colors[index % 20]} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default MonthlyAddedValueSpikedChart;
