import React from 'react';
import { Pie } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
} from 'chart.js';

ChartJS.register(ArcElement, Tooltip, Legend);

const PieChart = () => {
  const data = {
    labels: ['Red', 'Blue', 'Yellow', 'Green', 'Purple', 'Orange'],
    datasets: [
      {
        label: 'Color Distribution',
        data: [12, 19, 3, 5, 2, 3],
        backgroundColor: [
          'rgba(255, 99, 132, 0.6)',  // Color for Red
          'rgba(54, 162, 235, 0.6)',  // Color for Blue
          'rgba(255, 206, 86, 0.6)',  // Color for Yellow
          'rgba(75, 192, 192, 0.6)',  // Color for Green
          'rgba(153, 102, 255, 0.6)', // Color for Purple
          'rgba(255, 159, 64, 0.6)',  // Color for Orange
        ],
        borderColor: [
          'rgba(255, 99, 132, 1)',  // Border for Red
          'rgba(54, 162, 235, 1)',  // Border for Blue
          'rgba(255, 206, 86, 1)',  // Border for Yellow
          'rgba(75, 192, 192, 1)',  // Border for Green
          'rgba(153, 102, 255, 1)', // Border for Purple
          'rgba(255, 159, 64, 1)',  // Border for Orange
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
        text: 'Pie Chart Example',
        font: {
          size: 24,
        },
        color: '#1E293B',
      },
    },
  };

  return <Pie data={data} options={options} />;
};

export default PieChart;
