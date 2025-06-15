import { useEffect, useState } from "react";
import {
  ComposedChart,
  Line,
  Area,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Scatter,
  ResponsiveContainer,
} from "recharts";

const MonthlyProfitChart = () => {
  const [month1, setMonth1] = useState("January");
  const [month1Num, setMonth1Num] = useState(
    Math.floor(Math.random() * (100000 - 40000 + 1)) + 40000
  );

  const [month2, setMonth2] = useState("February");
  const [month2Num, setMonth2Num] = useState(
    Math.floor(Math.random() * (100000 - 40000 + 1)) + 40000
  );

  const [month3, setMonth3] = useState("March");
  const [month3Num, setMonth3Num] = useState(
    Math.floor(Math.random() * (100000 - 40000 + 1)) + 40000
  );

  const [month4, setMonth4] = useState("April");
  const [month4Num, setMonth4Num] = useState(
    Math.floor(Math.random() * (100000 - 40000 + 1)) + 40000
  );

  const [month5, setMonth5] = useState("May");
  const [month5Num, setMonth5Num] = useState(
    Math.floor(Math.random() * (100000 - 40000 + 1)) + 40000
  );

  const [month6, setMonth6] = useState("June");
  const [month6Num, setMonth6Num] = useState(
    Math.floor(Math.random() * (100000 - 40000 + 1)) + 40000
  );

  const [month7, setMonth7] = useState("July");
  const [month7Num, setMonth7Num] = useState(
    Math.floor(Math.random() * (100000 - 40000 + 1)) + 40000
  );

  const [month8, setMonth8] = useState("August");
  const [month8Num, setMonth8Num] = useState(
    Math.floor(Math.random() * (100000 - 40000 + 1)) + 40000
  );

  const [month9, setMonth9] = useState("September");
  const [month9Num, setMonth9Num] = useState(
    Math.floor(Math.random() * (100000 - 40000 + 1)) + 40000
  );

  const [month10, setMonth10] = useState("October");
  const [month10Num, setMonth10Num] = useState(
    Math.floor(Math.random() * (100000 - 40000 + 1)) + 40000
  );

  const [month11, setMonth11] = useState("November");
  const [month11Num, setMonth11Num] = useState(
    Math.floor(Math.random() * (100000 - 40000 + 1)) + 40000
  );

  const [month12, setMonth12] = useState("December");
  const [month12Num, setMonth12Num] = useState(
    Math.floor(Math.random() * (100000 - 40000 + 1)) + 40000
  );

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
          "https://backend.kidsdesigncompany.com/api/shopkeeper-dashboard/", {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              Authorization: `JWT ${localStorage.getItem("accessToken")}`,
            }
          }
        );

        if (!response.ok) {
          throw new Error("Authentication failed");
        }

        const logData = await response.json();
        console.log(logData);

        setMonth1(logData.monthly_profit[0].month);
        setMonth1Num(logData.monthly_profit[0].total);

        setMonth2(logData.monthly_profit[1].month);
        setMonth2Num(logData.monthly_profit[1].total);

        setMonth3(logData.monthly_profit[2].month);
        setMonth3Num(logData.monthly_profit[2].total);

        setMonth4(logData.monthly_profit[3].month);
        setMonth4Num(logData.monthly_profit[3].total);

        setMonth5(logData.monthly_profit[4].month);
        setMonth5Num(logData.monthly_profit[4].total);

        setMonth6(logData.monthly_profit[5].month);
        setMonth6Num(logData.monthly_profit[5].total);

        setMonth7(logData.monthly_profit[6].month);
        setMonth7Num(logData.monthly_profit[6].total);

        setMonth8(logData.monthly_profit[7].month);
        setMonth8Num(logData.monthly_profit[7].total);

        setMonth9(logData.monthly_profit[8].month);
        setMonth9Num(logData.monthly_profit[8].total);

        setMonth10(logData.monthly_profit[9].month);
        setMonth10Num(logData.monthly_profit[9].total);

        setMonth11(logData.monthly_profit[10].month);
        setMonth11Num(logData.monthly_profit[10].total);

        setMonth12(logData.monthly_profit[11].month);
        setMonth12Num(logData.monthly_profit[11].total);
      } catch (error) {
        console.error("Error fetching dashboard:", error);
      }
    }

    fetchStockInfo();
  }, []);

  return (
    <div>
      <h1
        style={{ fontSize: "clamp(16.5px, 3vw, 23px)" }}
        className="font-semibold mb-5"
      >
        Monthly Profit
      </h1>
      <ResponsiveContainer width="100%" height={400}>
        <ComposedChart data={data}>
          <CartesianGrid stroke="#f5f5"></CartesianGrid>
          <XAxis dataKey="month"></XAxis>
          <YAxis></YAxis>
          <Tooltip></Tooltip>
          {/* <Legend></Legend> */}
          <Area type="monotone" dataKey="value" fill="gray" stroke="#8884d8" />
          <Bar dataKey="value" barSize={30} fill="#413ea0" />
          <Line type="monotone" dataKey="value" stroke="gray" />
          <Scatter dataKey="value" fill="red" />
        </ComposedChart>
      </ResponsiveContainer>
    </div>
  );
};

export default MonthlyProfitChart;
