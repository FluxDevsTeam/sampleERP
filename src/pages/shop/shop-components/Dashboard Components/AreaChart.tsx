
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const Areachart = () => {
  const data = [
    { month: 'Jan', value: 100 },
    { month: 'Feb', value: 45 },
    { month: 'Mar', value: 45 },
    { month: 'Apr', value: 100 },
    { month: 'May', value: 30 },
    { month: 'Jun', value: 80 },
    { month: 'Jul', value: 34 },
    { month: 'Aug', value: 100 },
    { month: 'Sep', value: 75 },
    { month: 'Oct', value: 20 },
    { month: 'Nov', value: 95 },
    { month: 'Dec', value: 32 },
  ];

  return (
    <div>
      <ResponsiveContainer width="90%" height={350} >
        <AreaChart data={data} className='bg-white' >
          <defs>
            <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#0178a3" stopOpacity={0.8} />
              <stop offset="95%" stopColor="#0178a3" stopOpacity={0} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="month" />
          <YAxis />
          <Tooltip />
          <Area
            type="monotone"
            dataKey="value"
            stroke="#0178a3"
            fillOpacity={1}
            fill="url(#colorValue)"
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
};

export default Areachart;
