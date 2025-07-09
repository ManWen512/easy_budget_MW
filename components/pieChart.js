import React, { useRef, useEffect } from 'react';
import * as echarts from 'echarts';

// Define the colors once to ensure consistency
const PIE_CHART_COLORS = [
  '#FF6384',
  '#36A2EB',
  '#FFCE56',
  '#4BC0C0',
  '#9966FF',
  '#FF9F40',
];

const PieChart = ({ data, cost, currency }) => {
  const chartRef = useRef(null);
  const myChart = useRef(null);

  useEffect(() => {
    if (chartRef.current) {
      myChart.current = echarts.init(chartRef.current);

      const option = {
        tooltip: {
          trigger: 'item',
          formatter: '{b}: {d}%', // Shows name and percentage
        },
        legend: {
          show: false, // We'll create a custom legend below the chart
        },
        series: [
          {
            name: 'Expense Distribution',
            type: 'pie',
            radius: ['40%', '70%'], // Inner and outer radius for the donut chart
            avoidLabelOverlap: false,
            itemStyle: {
              borderRadius: 10,
              borderColor: '#fff',
              borderWidth: 2,
            },
            label: {
              show: false, // Hide labels on the slices
              position: 'center',
            },
            emphasis: {
              radius: ['40%', '70%'], // Keep the same radius on hover
              label: {
                show: true,
                fontSize: 20,
                fontWeight: 'bold',
                formatter: (params) => {
                  // Only show the name when hovered
                  return params.name.split('=')[0].trim();
                },
              },
            },
            labelLine: {
              show: false,
            },
            data: data
              ? data.map((item) => {
                  const matchingCost = cost.find((cos) => cos.name === item.name);
                  return {
                    name: matchingCost ? `${item.name} = ${currency} ${matchingCost.total}` : item.name,
                    value: item.percentage,
                  };
                })
              : [],
            color: PIE_CHART_COLORS, // Use the defined color array
          },
        ],
      };

      myChart.current.setOption(option);

      // Handle window resize
      const handleResize = () => {
        myChart.current.resize();
      };

      window.addEventListener('resize', handleResize);

      return () => {
        window.removeEventListener('resize', handleResize);
        if (myChart.current) { // Ensure it's not null before disposing
          myChart.current.dispose();
        }
      };
    }
  }, [data, cost, currency]); // Dependencies remain the same

  return (
    <div className="flex flex-col gap-0">
      <div className="w-full h-auto" style={{ minHeight: '200px' }}>
        <div ref={chartRef} style={{ width: '100%', height: '200px' }} />
      </div>
      <div className="max-h-[152px] overflow-y-auto">
        <div className="grid grid-rows-1 gap-1 ">
          {data && data.map((item, index) => {
            const matchingCost = cost.find((cos) => cos.name === item.name);
            // Use the globally defined color array for the legend
            const backgroundColor = PIE_CHART_COLORS[index % PIE_CHART_COLORS.length]; // Use modulo for safety if data length > colors
            return (
              <div key={index} className="flex items-center gap-2 bg-gray-50 p-1 rounded-lg">
                <div
                  className="w-3 h-3 rounded-full flex-shrink-0"
                  style={{ backgroundColor: backgroundColor }}
                />
                <div className="flex flex-col min-w-0">
                  <span className="font-outfit text-xs truncate">
                    {item.name}: {item.percentage}% {matchingCost && `(${currency} ${matchingCost.total})`}
                  </span>
                  {/* <span className="font-outfit text-xs text-gray-500 truncate">
                    {item.percentage}% {matchingCost && `(${currency} ${matchingCost.total})`}
                  </span> */}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default React.memo(PieChart);