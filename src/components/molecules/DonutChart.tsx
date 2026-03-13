

interface DonutData {
  label: string;
  value: number;
  color: string;
}

interface DonutChartProps {
  totalLabel: string;
  totalValue: string;
  data: DonutData[];
  size?: number;
}

export function DonutChart({ totalLabel, totalValue, data, size = 180 }: DonutChartProps) {
  const total = data.reduce((acc, item) => acc + item.value, 0);
  
  // Build conic gradient string
  let cumulativeValue = 0;
  const gradientParts = data.map((item) => {
    const start = (cumulativeValue / total) * 100;
    cumulativeValue += item.value;
    const end = (cumulativeValue / total) * 100;
    return `${item.color} ${start}% ${end}%`;
  });

  return (
    <div className="flex flex-col md:flex-row items-center justify-around gap-8 h-full">
      <div 
        className="relative rounded-full flex items-center justify-center shrink-0 shadow-lg"
        style={{ 
          width: size, 
          height: size, 
          background: `conic-gradient(${gradientParts.join(', ')})` 
        }}
      >
        <div className="absolute w-[75%] h-[75%] bg-white rounded-full flex flex-col items-center justify-center shadow-inner">
          <p className="text-xs text-text-secondary font-medium mb-1">{totalLabel}</p>
          <p className="text-2xl font-bold tracking-tight text-text-primary">{totalValue}</p>
        </div>
      </div>
      
      <div className="flex flex-col gap-3 justify-center">
        {data.map((item) => (
          <div key={item.label} className="flex items-center gap-3">
            <div className="w-3 h-3 rounded-full shrink-0" style={{ backgroundColor: item.color }} />
            <span className="text-xs font-semibold text-text-secondary w-20">{item.label}</span>
            <span className="text-xs font-bold text-text-primary ml-auto">
              {Math.round((item.value / total) * 100)}%
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
