import { BarChart, Bar, ResponsiveContainer, XAxis, YAxis, Tooltip, Cell } from 'recharts';

const Barchart = () => {
  const data = [
    { name: 'Page A', uv: 4000, pv: 2400, amt: 2400 },
    { name: 'Page B', uv: 3000, pv: 1398, amt: 2210 },
    { name: 'Page C', uv: 2000, pv: 9800, amt: 2290 },
    { name: 'Page D', uv: 2780, pv: 3908, amt: 2000 },
  ];

  const COLORS = ['#343C6A', '#FC7900', '#1814F3', '#0178A3'];

  return (
    <div >
      <p className="text-3xl font-bold text-black lg:pt-0 pt-6">This month</p>
      <ResponsiveContainer width='100%' height={350}>
        <BarChart data={data} className='bg-white my-6 border rounded-lg py-4'>
          <XAxis dataKey="name" />
          <YAxis />
          <Tooltip />
          <Bar dataKey="uv">
            {data.map((_, index) => (
              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default Barchart;
