import { useState, useEffect } from "react";
import axios from "axios";
import { PieChart, Pie, Cell, Tooltip, Legend } from "recharts";

const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#A28EF0", "#F76C6C"]; // Color variety

const PieCharts = () => {
  const [yearData, setYearData] = useState([]);
  const [monthData, setMonthData] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get("https://kidsdesigncompany.pythonanywhere.com/api/ceo-dashboard/");
        const data = response.data;

        if (data?.categorical_data_year?.expense_categories && data?.categorical_data_month?.expense_categories) {
          setYearData(data.categorical_data_year.expense_categories);
          setMonthData(data.categorical_data_month.expense_categories);
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, []);

  return (
    <div style={{ display: "flex", justifyContent: "center", gap: "50px", marginTop: "50px" }}>
      {/* Yearly Expenses Pie Chart */}
      <div>
        <h2 style={{ textAlign: "center", marginBottom: "10px" }}>Yearly Expenses</h2>
        <PieChart width={400} height={400}>
          <Pie
            data={yearData}
            dataKey="value"
            nameKey="name"
            cx="50%"
            cy="50%"
            outerRadius={120}
            fill="#8884d8"
            label
          >
            {yearData.map((_, index) => (
              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
            ))}
          </Pie>
          <Tooltip />
          <Legend />
        </PieChart>
      </div>

      {/* Monthly Expenses Pie Chart */}
      <div>
        <h2 style={{ textAlign: "center", marginBottom: "10px" }}>Monthly Expenses</h2>
        <PieChart width={400} height={400}>
          <Pie
            data={monthData}
            dataKey="value"
            nameKey="name"
            cx="50%"
            cy="50%"
            outerRadius={120}
            fill="#82ca9d"
            label
          >
            {monthData.map((_, index) => (
              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
            ))}
          </Pie>
          <Tooltip />
          <Legend />
        </PieChart>
      </div>
    </div>
  );
};

export default PieCharts;
