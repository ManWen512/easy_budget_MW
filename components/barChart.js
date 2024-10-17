import React from "react";
import { Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Tooltip,
  Legend,
} from "chart.js";

ChartJS.register(CategoryScale, LinearScale, BarElement, Tooltip, Legend);

const BarChart = ({ data = [], title , currency}) => {
  const colors = [
    "rgba(75, 192, 192, 0.6)", // Color for first bar
    "rgba(153, 102, 255, 0.6)", // Color for second bar
    "rgba(255, 159, 64, 0.6)", // Color for third bar
    "rgba(255, 99, 132, 0.6)", // Color for fourth bar
    // Add more colors as needed
  ];
  
  
  // Helper function to format day as 'day/month/year'
  const formatDate = (day) => {
    return `${day}`; // Fallback in case month or year is not set
  };

  const chartData = {
    labels: data.map((item) => formatDate(item.day)), // Format days for the x-axis labels
    datasets: [
      {
        label: title,
        data: data.map((item) => item.total), // Extract totals for the bar chart data
        backgroundColor: data.map((_, index) => colors[index % colors.length]), // Assign colors cyclically
        borderColor: data.map((_, index) => colors[index % colors.length].replace('0.6', '1')), // Border color
        borderWidth: 2,
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      tooltip:{
        callbacks: {
          label: (tooltipItem) => {
            const value = tooltipItem.raw; // Access the data value
            return `${currency}${value}`; // Format the value with a dollar sign
          },
        },
      },
      legend: {
        position: "top",
      },
      title: {
        display: true,
        text: "Daily Total Balance",
      },
    },
    scales: {
      x: {
        title: {
          display: true,
          text: "Date",
        },
      },
      y: {
        title: {
          display: true,
          text: `Balances (${currency})`,
        },
        beginAtZero: true, // Start the y-axis at zero
      },
    },
  };

  return <Bar data={chartData} options={options} />;
};

export default BarChart;
