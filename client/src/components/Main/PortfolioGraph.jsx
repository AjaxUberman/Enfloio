import React, { useState, useEffect } from "react";
import { Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  BarElement,
  Filler,
} from "chart.js";
import { format, subMonths } from "date-fns";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

const PortfolioGraph = ({ mainDatas }) => {
  const [dataPoints, setDataPoints] = useState([]);
  const today = new Date();
  const labels = [
    format(subMonths(today, 4), "MMMM"),
    format(subMonths(today, 3), "MMMM"),
    format(subMonths(today, 2), "MMMM"),
    format(subMonths(today, 1), "MMMM"),
    format(today, "MMMM"),
  ];

  useEffect(() => {
    if (mainDatas && mainDatas.length > 0) {
      const monthlyDataRequired = mainDatas[0].monthlyData;
      const insideData = [];
      for (const data of monthlyDataRequired) {
        if (!data.income) {
          insideData.push(0);
        } else {
          insideData.push(data.income);
        }
      }
      setDataPoints(insideData);
    }
  }, [mainDatas]);

  if (!Array.isArray(mainDatas)) {
    return <h1 className="text-4xl font-bold">Returning to login Page...</h1>;
  }

  const backgroundColors = dataPoints.map((value) =>
    value > 0 ? "green" : "red"
  );

  const data = {
    labels: labels,
    datasets: [
      {
        label: "Positive",
        fill: true,
        backgroundColor: "green",
        data: dataPoints,
      },
    ],
  };

  const options = { maintainAspectRatio: false, aspectRatio: 1 };

  return (
    <div className="">
      <div className="flex gap-4 items-baseline">
        <p className="font-bold text-main-text">Portfolio Status</p>
        <p className="px-4 py-1 bg-positive-green rounded-md shadow-xl font-semibold text-white">
          Positive
        </p>
      </div>
      <div className="md:w-2/3 h-96 mt-10 md:mt-0">
        <Bar data={data} options={options} />
      </div>
    </div>
  );
};

export default PortfolioGraph;
