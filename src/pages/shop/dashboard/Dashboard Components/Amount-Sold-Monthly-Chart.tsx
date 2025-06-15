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

const AmountSoldMonthlyBarChart = () => {
  const [month1, setMonth1] = useState("Jan");
  const [month1Num, setMonth1Num] = useState(
    Math.floor(Math.random() * (100000 - 40000 + 1)) + 40000
  );

  const [month2, setMonth2] = useState("Feb");
  const [month2Num, setMonth2Num] = useState(
    Math.floor(Math.random() * (100000 - 40000 + 1)) + 40000
  );

  const [month3, setMonth3] = useState("Mar");
  const [month3Num, setMonth3Num] = useState(
    Math.floor(Math.random() * (100000 - 40000 + 1)) + 40000
  );

  const [month4, setMonth4] = useState("Apr");
  const [month4Num, setMonth4Num] = useState(
    Math.floor(Math.random() * (100000 - 40000 + 1)) + 40000
  );

  const [month5, setMonth5] = useState("May");
  const [month5Num, setMonth5Num] = useState(
    Math.floor(Math.random() * (100000 - 40000 + 1)) + 40000
  );

  const [month6, setMonth6] = useState("Jun");
  const [month6Num, setMonth6Num] = useState(
    Math.floor(Math.random() * (100000 - 40000 + 1)) + 40000
  );

  const [month7, setMonth7] = useState("Jul");
  const [month7Num, setMonth7Num] = useState(
    Math.floor(Math.random() * (100000 - 40000 + 1)) + 40000
  );

  const [month8, setMonth8] = useState("Aug");
  const [month8Num, setMonth8Num] = useState(
    Math.floor(Math.random() * (100000 - 40000 + 1)) + 40000
  );

  const [month9, setMonth9] = useState("Sept");
  const [month9Num, setMonth9Num] = useState(
    Math.floor(Math.random() * (100000 - 40000 + 1)) + 40000
  );

  const [month10, setMonth10] = useState("Oct");
  const [month10Num, setMonth10Num] = useState(
    Math.floor(Math.random() * (100000 - 40000 + 1)) + 40000
  );

  const [month11, setMonth11] = useState("Nov");
  const [month11Num, setMonth11Num] = useState(
    Math.floor(Math.random() * (100000 - 40000 + 1)) + 40000
  );

  const [month12, setMonth12] = useState("Dec");
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

        setMonth1(logData.amount_sold_monthly[0].month);
        setMonth1Num(logData.amount_sold_monthly[0].total);

        setMonth2(logData.amount_sold_monthly[1].month);
        setMonth2Num(logData.amount_sold_monthly[1].total);

        setMonth3(logData.amount_sold_monthly[2].month);
        setMonth3Num(logData.amount_sold_monthly[2].total);

        setMonth4(logData.amount_sold_monthly[3].month);
        setMonth4Num(logData.amount_sold_monthly[3].total);

        setMonth5(logData.amount_sold_monthly[4].month);
        setMonth5Num(logData.amount_sold_monthly[4].total);

        setMonth6(logData.amount_sold_monthly[5].month);
        setMonth6Num(logData.amount_sold_monthly[5].total);

        setMonth7(logData.amount_sold_monthly[6].month);
        setMonth7Num(logData.amount_sold_monthly[6].total);

        setMonth8(logData.amount_sold_monthly[7].month);
        setMonth8Num(logData.amount_sold_monthly[7].total);

        setMonth9(logData.amount_sold_monthly[8].month);
        setMonth9Num(logData.amount_sold_monthly[8].total);

        setMonth10(logData.amount_sold_monthly[9].month);
        setMonth10Num(logData.amount_sold_monthly[9].total);

        setMonth11(logData.amount_sold_monthly[10].month);
        setMonth11Num(logData.amount_sold_monthly[10].total);

        setMonth12(logData.amount_sold_monthly[11].month);
        setMonth12Num(logData.amount_sold_monthly[11].total);
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
        className="font-semibold mb-2"
      >
        Amount Sold Monthly
      </h1>
      <ResponsiveContainer
        width="100%"
        height={447}
      >
        <BarChart data={data} className="bg-white">
          <defs>
            <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
              <stop offset="10%" stopColor="gray" stopOpacity={1} />
              <stop offset="90%" stopColor="blue" stopOpacity={0.2} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="month" />
          <YAxis />
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
  );
};

export default AmountSoldMonthlyBarChart;
