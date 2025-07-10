"use client";

import React, { useEffect, useRef } from "react";
import * as echarts from "echarts";
import { selectTheme } from "@/redux/selectors/settingsSelectors";
import { useSelector } from "react-redux";

const EChartBar = ({ data = [], title, currency, height = 400 }) => {
  const chartRef = useRef(null);
  const instanceRef = useRef(null);
  const theme = useSelector(selectTheme);

  const colors = [
    "#FF6384",
  ];

  const formatDate = (day) => {
    return `${day}`; // Modify to &apos;DD/MM/YYYY&apos; if needed
  };

  const chartOption = {
    title: {
      text: title,
      left: "center",
      textStyle:{
        color: theme === "dark" ? "#ffffff" : "#111827"
      }
    },
    tooltip: {
      trigger: "axis",
      formatter: (params) => {
        const item = params[0];
        return `${item.axisValue}<br/>${item.seriesName}: ${currency} ${item.data}`;
      },
    },
    xAxis: {
      type: "category",
      data: data.map((item) => formatDate(item.day)),
      name: "Date",
      axisLine: {
        lineStyle: {
          color: theme === "dark" ? "#fff" : "#333",
        },
      },
    },
    yAxis: {
      type: "value",
      name: `Cost (${currency})`,
      // axisLabel: {
      //   color: theme === "dark" ? "#fff" : "#333",
      // },
      axisLine: {
        lineStyle: {
          color: theme === "dark" ? "#fff" : "#333",
        },
      },
    },
    series: [
      {
        name: title,
        type: "bar",
        data: data.map((item) => item.total),
        itemStyle: {
          borderRadius: [8, 8, 0, 0], // Rounded top corners
          color: (params) => colors[params.dataIndex % colors.length],
        },
        barWidth: "60%",
      },
    ],
  };

  useEffect(() => {
    if (chartRef.current && data && Array.isArray(data) && data.length > 0) {
      if (!instanceRef.current) {
        instanceRef.current = echarts.init(chartRef.current);
      }
      instanceRef.current.setOption(chartOption);
      const resizeHandler = () => instanceRef.current?.resize();
      window.addEventListener("resize", resizeHandler);
      return () => {
        window.removeEventListener("resize", resizeHandler);
        instanceRef.current?.dispose();
        instanceRef.current = null;
      };
    }
  }, [data, title, currency]);

  // Conditional rendering based on data availability
  if (!data || !Array.isArray(data) || data.length === 0) {
    return null;
  }

  return <div ref={chartRef} style={{ width: "100%", height }} />;
};

export default React.memo(EChartBar);
