import React, { useRef } from 'react';
import { Pie } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
  Chart,
} from 'chart.js';
import ChartDataLabels from 'chartjs-plugin-datalabels';

ChartJS.register(ArcElement, Tooltip, Legend, ChartDataLabels);

const PieChart = ({ data, cost, currency }) => {
  const chartRef = useRef(null);

  const chartData = {
    labels: data
      ? data.map((item) => {
          const matchingCost = cost.find((cos) => cos.name === item.name);
          return matchingCost ? `${item.name} = ${currency} ${matchingCost.total}` : item.name;
        })
      : [],
    datasets: [
      {
        data: data ? data.map((item) => item.percentage) : [],
        backgroundColor: [
          '#FF6384',
          '#36A2EB',
          '#FFCE56',
          '#4BC0C0',
          '#9966FF',
          '#FF9F40',
        ],
        borderColor: [
          '#FF6384',
          '#36A2EB',
          '#FFCE56',
          '#4BC0C0',
          '#9966FF',
          '#FF9F40',
        ],
        borderWidth: 2,
        cutout: '40%',
        borderRadius: 10,
        spacing: 5,
      },
    ],
  };

  const centerTextPlugin = {
    id: 'centerText',
    afterDraw(chart) {
      const { width, height, ctx } = chart;
      const activeElements = chart.getActiveElements();
      ctx.save();

      if (activeElements.length > 0) {
        const { index } = activeElements[0];
        const label = chart.data.labels[index].split('=')[0].trim();
        const value = chart.data.datasets[0].data[index];

        ctx.font = 'bold 20px outfit';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillStyle = '#000';
        ctx.fillText(`${label}`, width / 2, height / 2);
      }

      ctx.restore();
    },
  };

  const options = {
    responsive: true,
    maintainAspectRatio: true,
    plugins: {
      datalabels: {
        display: false,
      },
      tooltip: {
        callbacks: {
          label: (tooltipItem) => {
            const value = tooltipItem.raw;
            return `${value}%`;
          },
        },
      },
      legend: {
        display: false,
      },
      title: {
        display: true,
        text: '',
        font: {
          family: 'outfit',
          size: 24,
        },
        color: '#1E293B',
      },
    },
  };

  return (
    <div className="flex flex-col gap-1">
      <div className="w-full h-auto">
        <Pie
          ref={chartRef}
          data={chartData}
          options={options}
          plugins={[ChartDataLabels, centerTextPlugin]}
        />
      </div>
      <div className="max-h-[200px] overflow-y-auto">
        <div className="grid grid-rows-1 gap-2 p-4">
          {data && data.map((item, index) => {
            const matchingCost = cost.find((cos) => cos.name === item.name);
            return (
              <div key={index} className="flex items-center gap-2 bg-gray-50 p-2 rounded-lg">
                <div 
                  className="w-3 h-3 rounded-full flex-shrink-0" 
                  style={{ backgroundColor: chartData.datasets[0].backgroundColor[index] }}
                />
                <div className="flex flex-col min-w-0">
                  <span className="font-outfit text-sm truncate">
                    {item.name}
                  </span>
                  <span className="font-outfit text-xs text-gray-500 truncate">
                    {item.percentage}% {matchingCost && `(${currency} ${matchingCost.total})`}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default PieChart;
