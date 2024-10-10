import React from 'react';
import { Pie } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
} from 'chart.js';

ChartJS.register(ArcElement, Tooltip, Legend);

const PieChart = ({ data , cost}) => {

  // Ensure that the data is correctly formatted before passing it to the chart
  const chartData = {
    labels: data
    ? data.map((item) => {
        const matchingCost = cost.find((cos) => cos.name === item.name); // Find matching cost by name
        return matchingCost ? `${item.name} = ${matchingCost.total}` : item.name; // Format label if match found
      })
    : [],
    datasets: [
      {
        
        data: data ? data.map((item) => item.percentage) : [],
        backgroundColor: [
          'rgba(255, 99, 132, 0.6)',  // Red
          'rgba(54, 162, 235, 0.6)',  // Blue
          'rgba(255, 206, 86, 0.6)',  // Yellow
          'rgba(75, 192, 192, 0.6)',  // Green
          'rgba(153, 102, 255, 0.6)', // Purple
          'rgba(255, 159, 64, 0.6)',  // Orange
        ],
        borderColor: [
          'rgba(255, 99, 132, 1)',  // Red border
          'rgba(54, 162, 235, 1)',  // Blue border
          'rgba(255, 206, 86, 1)',  // Yellow border
          'rgba(75, 192, 192, 1)',  // Green border
          'rgba(153, 102, 255, 1)', // Purple border
          'rgba(255, 159, 64, 1)',  // Orange border
        ],
        borderWidth: 2,
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top',
        labels: {
          font: {
            size: 14,
          },
          color: '#333',
        },
      },
      title: {
        display: true,
        text: '',
        font: {
          size: 24,
        },
        color: '#1E293B',
      },
    },
  };

  return <Pie data={chartData} options={options} />;
};

export default PieChart;
