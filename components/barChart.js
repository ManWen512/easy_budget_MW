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

const BarChart = ({ data, selectedMonth = null, selectedYear = null, title }) => {
  // Helper function to format day as 'day/month/year'
  const formatDate = (day) => {
    if (selectedMonth !== null && selectedYear !== null) {
      return `${day}/${selectedMonth}/${selectedYear}`;
    }
    return `${day}`; // Fallback in case month or year is not set
  };

  const chartData = {
    labels: data.map((item) => formatDate(item.day)), // Format days for the x-axis labels
    datasets: [
      {
        label: title,
        data: data.map((item) => item.total), // Extract totals for the bar chart data
        backgroundColor: "rgba(75, 192, 192, 0.6)", // Color for the bars
        borderColor: "rgba(75, 192, 192, 1)", // Border color for the bars
        borderWidth: 2,
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
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
          text: "Balances",
        },
        beginAtZero: true, // Start the y-axis at zero
      },
    },
  };

  return <Bar data={chartData} options={options} />;
};

export default BarChart;
