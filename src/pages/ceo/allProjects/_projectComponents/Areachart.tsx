
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const Areachart = () => {
  const data = [
    { month: 'Jan', value: 30 },
    { month: 'Feb', value: 45 },
    { month: 'Mar', value: 60 },
    { month: 'Apr', value: 50 },
    { month: 'May', value: 70 },
    { month: 'Jun', value: 80 },
    { month: 'Jul', value: 90 },
    { month: 'Aug', value: 100 },
    { month: 'Sep', value: 75 },
    { month: 'Oct', value: 85 },
    { month: 'Nov', value: 95 },
    { month: 'Dec', value: 65 },
  ];

  return (
    <div className="my-4 p-6">
      <p className="text-3xl font-bold text-black mb-4">Project History</p>
      <ResponsiveContainer width="100%" height={300} >
        <AreaChart data={data} className='bg-white py-5' >
          <defs>
            <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#8884d8" stopOpacity={0.8} />
              <stop offset="95%" stopColor="#8884d8" stopOpacity={0} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="month" />
          <YAxis />
          <Tooltip />
          <Area
            type="monotone"
            dataKey="value"
            stroke="#8884d8"
            fillOpacity={1}
            fill="url(#colorValue)"
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
};

export default Areachart;
