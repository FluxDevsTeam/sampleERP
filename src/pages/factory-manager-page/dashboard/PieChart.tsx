import { PieChart, Pie, Cell, Legend, ResponsiveContainer } from "recharts";
import React from "react";

const COLORS = ["#8884d8", "#82ca9d", "#ffc658", "#ff7300", "#ff0000"];

const PieChartComponent = ({ data }: { data: { name: string; value: number }[] }) => {
  // Show top 5, group the rest as 'Others'
  let pieData = data || [];
  if (pieData.length > 5) {
    const sorted = [...pieData].sort((a, b) => b.value - a.value);
    let top5 = sorted.slice(0, 5);
    let others = sorted.slice(5);
    let othersInTop5Idx = top5.findIndex(item => item.name.toLowerCase() === 'others');
    let othersFromRest = others.filter(item => item.name.toLowerCase() === 'others');
    let nonOthersRest = others.filter(item => item.name.toLowerCase() !== 'others');
    let othersTotal = nonOthersRest.reduce((sum, item) => sum + (item.value || 0), 0);
    let othersLabel = 'Others';
    if (othersInTop5Idx !== -1) {
      let mergedValue = top5[othersInTop5Idx].value + othersTotal + othersFromRest.reduce((sum, item) => sum + (item.value || 0), 0);
      top5[othersInTop5Idx] = { ...top5[othersInTop5Idx], value: mergedValue };
    } else {
      if (othersFromRest.length > 0) {
        othersLabel = 'Other Categories';
        othersTotal += othersFromRest.reduce((sum, item) => sum + (item.value || 0), 0);
      }
      if (othersTotal > 0) {
        top5.push({ name: othersLabel, value: othersTotal });
      }
    }
    pieData = top5;
  }

  // Always put Others last in the legend
  const othersLabels = ['Others', 'Other Categories'];
  const pieLegendData = [
    ...pieData.filter((entry: { name: string }) => !othersLabels.includes(entry.name)),
    ...pieData.filter((entry: { name: string }) => othersLabels.includes(entry.name)),
  ];

  // Custom label for Pie chart: show percentage inside the slice segment
  const PieLabel = ({ value, percent, cx, cy, midAngle, innerRadius, outerRadius, index }: {
    value: number;
    percent: number;
    cx: number;
    cy: number;
    midAngle: number;
    innerRadius: number;
    outerRadius: number;
    index: number;
  }) => {
    if (percent < 0.05) return null;
    const RADIAN = Math.PI / 180;
    const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
    const x = cx + radius * Math.cos(-midAngle * RADIAN);
    const y = cy + radius * Math.sin(-midAngle * RADIAN);
    return (
      <text
        x={x}
        y={y}
        textAnchor="middle"
        fontSize={window.innerWidth < 640 ? 10 : 13}
        fontWeight="bold"
        fill="#fff"
        dominantBaseline="central"
      >
        {`${Math.round(percent * 100)}%`}
      </text>
    );
  };

  if (!pieData || pieData.length === 0) {
    return (
      <div className="w-full h-[400px] bg-gray-100 rounded-lg flex items-center justify-center border-2 border-dashed border-gray-300">
        <div className="text-center">
          <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
          </svg>
          <h3 className="mt-2 text-sm font-medium text-gray-900">No data to display</h3>
          <p className="mt-1 text-sm text-gray-500">There is currently no data available for this chart.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full h-[360px]">
      <h2 className="text-xl font-semibold text-gray-700">Financial Overview</h2>
      <ResponsiveContainer width="100%" height="90%">
        <PieChart>
          <Pie
            data={pieData}
            dataKey="value"
            nameKey="name"
            cx="50%"
            cy="50%"
            outerRadius={120}
            innerRadius={20}
            className="sm:outerRadius-[100px] sm:innerRadius-[50px]"
            label={PieLabel}
            labelLine={false}
          >
            {pieData.map((_entry: any, index: number) => (
              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
            ))}
          </Pie>
          <Legend
            layout="horizontal"
            verticalAlign="bottom"
            align="center"
            payload={pieLegendData.map((entry: { name: string }, index: number) => ({
              value: entry.name,
              type: 'circle',
              color: COLORS[index % COLORS.length]
            }))}
            wrapperStyle={{
              fontSize: window.innerWidth < 640 ? '10px' : '12px',
              whiteSpace: 'pre-wrap',
              wordBreak: 'break-word',
              maxWidth: '100%',
              paddingTop: '10px'
            }}
          />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
};

export default PieChartComponent;
