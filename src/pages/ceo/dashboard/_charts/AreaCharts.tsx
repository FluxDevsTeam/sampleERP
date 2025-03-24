import React, { useState, useEffect } from "react";
import axios from "axios";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";

const AreaChartComponent = () => {
  const [incomeData, setIncomeData] = useState([]);
  const [expensesData, setExpensesData] = useState([]);
  const [profitData, setProfitData] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get("https://kidsdesigncompany.pythonanywhere.com/api/ceo-dashboard/");
        const data = response.data;

        if (data?.monthly_trends) {
          setIncomeData(data.monthly_trends.income);
          setExpensesData(data.monthly_trends.expenses);
          setProfitData(data.monthly_trends.profit);
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, []);

  const renderChart = (data, title, color, id) => (
    <div style={{ width: "100%", height: 350, marginBottom: "40px", textAlign: "center" }} >
      <h3 style={{ fontSize: "16px", fontWeight: "bold", marginBottom: "10px" }}>{title}</h3>
      <ResponsiveContainer width="90%" height="100%">
        <AreaChart data={data} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
          <defs>
            <linearGradient id={id} x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor={color} stopOpacity={0.8} />
              <stop offset="95%" stopColor={color} stopOpacity={0} />
            </linearGradient>
          </defs>
          <XAxis 
            dataKey="month" 
            tick={{ fontSize: "12px", textAnchor: "middle" }} 
            angle={-20} 
          />
          <YAxis tick={{ fontSize: "12px" }} />
          <CartesianGrid strokeDasharray="3 3" />
          <Tooltip />
          <Area type="monotone" dataKey="total" stroke={color} fillOpacity={1} fill={`url(#${id})`} />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );

  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "20px" }}>
      {renderChart(incomeData, "Monthly Income", "#00C49F", "incomeGradient")}
      {renderChart(expensesData, "Monthly Expenses", "#FF8042", "expensesGradient")}
      {renderChart(profitData, "Monthly Profit", "#0088FE", "profitGradient")}
    </div>
  );
};

export default AreaChartComponent;
