import { PieChart, Pie, Cell, ResponsiveContainer } from 'recharts';

const Piechart = () => {
  const data = [
    { name: 'Entertainment', value: 30 },
    { name: 'Bill Expense', value: 15 },
    { name: 'Others', value: 20 },
    { name: 'Investments', value: 35 },
  ];

  const COLORS = ['#343C6A', '#FC7900', '#1814F3', '#0178A3'];
  const RADIAN = Math.PI / 180;

  const renderCustomizedLabel = ({
    cx,
    cy,
    midAngle,
    innerRadius,
    outerRadius,
    percent,
    name,
  }:any) => {
    const radius = innerRadius + (outerRadius - innerRadius) * 0.6;
    const x = cx + radius * Math.cos(-midAngle * RADIAN);
    const y = cy + radius * Math.sin(-midAngle * RADIAN);

    return (
      <text
        x={x}
        y={y}
        fill="white"
        textAnchor="middle"
        dominantBaseline="central"
        fontSize={12}
      >
        <tspan x={x} dy="-0.5em">{name}</tspan>
        <tspan x={x} dy="1.2em">{`${(percent * 100).toFixed(0)}%`}</tspan>
      </text>
    );
  };

  return (
    <div className="w-full   ">
      <p className="text-3xl font-bold text-black ">Expenses Statistics</p>

      <ResponsiveContainer width="100%" height={350}>
        <PieChart className='bg-white my-6 border rounded-lg'>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            labelLine={false}
            label={renderCustomizedLabel}
            outerRadius={150}
            fill="#8884d8"
            dataKey="value"
          >
            {data.map((_, index) => (
              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
            ))}
          </Pie>
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
};

export default Piechart;
