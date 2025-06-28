// Custom shape for bars with rounded top corners
export const RoundedBar = (props: any) => {
    const { fill, x, y, width, height } = props;
    // Path for a rectangle with rounded top-left and top-right corners
    const path = `M${x},${y + 5}
                  A5,5 0 0 1 ${x + 5},${y}
                  L${x + width - 5},${y}
                  A5,5 0 0 1 ${x + width},${y + 5}
                  L${x + width},${y + height}
                  L${x},${y + height}
                  Z`;
    return <path d={path} fill={fill} />;
  };
  
  // Custom styled tooltip
  export const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="p-4 bg-white border border-gray-200 rounded-lg shadow-lg">
          <p className="label text-lg font-bold">{`${label}`}</p>
          {payload.map((pld: any, index: number) => (
            <div key={index} style={{ color: pld.fill }}>
              <p className="intro">{`${pld.name}: ₦${pld.value.toLocaleString()}`}</p>
            </div>
          ))}
        </div>
      );
    }
  
    return null;
  };
  
