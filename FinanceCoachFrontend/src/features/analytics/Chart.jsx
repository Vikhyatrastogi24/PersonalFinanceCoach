// src/features/analytics/Chart.jsx
import React from "react";
import {
  PieChart,
  Pie,
  Cell,
  Tooltip as ReTooltip,
  Legend,
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  LineChart,
  Line,
} from "recharts";

// Color palette for chart slices/bars
const COLORS = [
  "#4ade80", // green-400
  "#60a5fa", // blue-400
  "#fbbf24", // yellow-400
  "#f87171", // red-400
  "#a78bfa", // purple-400
  "#f472b6", // pink-400
];

// Custom tooltip styles for all charts
const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-base-100 p-2 rounded shadow-lg border border-gray-200 text-gray-800">
        <p className="font-semibold">{label}</p>
        {payload.map((p, i) => (
          <p key={i}>
            {p.name || p.dataKey}: {p.value}
            {p.payload.currency ? ` ${p.payload.currency}` : ""}
          </p>
        ))}
      </div>
    );
  }
  return null;
};

export default function Chart({ type, data, dataKey, nameKey, title }) {
  // Example usage:
  // type: "pie" | "bar" | "line"
  // data: [{ category: "Food", amount: 250 }, ...]
  // dataKey: "amount"
  // nameKey: "category"

  // Render Pie Chart
  if (type === "pie") {
    return (
      <div className="w-full h-64 p-4 bg-base-100 rounded-lg shadow-md">
        <h3 className="text-lg font-semibold mb-2">{title}</h3>
        <ResponsiveContainer>
          <PieChart>
            <Pie
              data={data}
              dataKey={dataKey}
              nameKey={nameKey}
              cx="50%"
              cy="50%"
              outerRadius={80}
              label={({ percent }) => `${(percent * 100).toFixed(0)}%`}
              labelLine={false}
            >
              {data.map((entry, index) => (
                <Cell
                  key={`cell-${index}`}
                  fill={COLORS[index % COLORS.length]}
                />
              ))}
            </Pie>
            <ReTooltip content={<CustomTooltip />} />
            <Legend verticalAlign="bottom" height={36} />
          </PieChart>
        </ResponsiveContainer>
      </div>
    );
  }

  // Render Bar Chart
  if (type === "bar") {
    return (
      <div className="w-full h-64 p-4 bg-base-100 rounded-lg shadow-md">
        <h3 className="text-lg font-semibold mb-2">{title}</h3>
        <ResponsiveContainer>
          <BarChart
            data={data}
            margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey={nameKey} />
            <YAxis />
            <ReTooltip content={<CustomTooltip />} />
            <Legend verticalAlign="top" height={36} />
            <Bar dataKey={dataKey} fill={COLORS[0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    );
  }

  // Render Line Chart
  if (type === "line") {
    return (
      <div className="w-full h-64 p-4 bg-base-100 rounded-lg shadow-md">
        <h3 className="text-lg font-semibold mb-2">{title}</h3>
        <ResponsiveContainer>
          <LineChart
            data={data}
            margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey={nameKey} />
            <YAxis />
            <ReTooltip content={<CustomTooltip />} />
            <Legend verticalAlign="top" height={36} />
            <Line
              type="monotone"
              dataKey={dataKey}
              stroke={COLORS[1]}
              strokeWidth={2}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    );
  }

  return <p>Chart type not supported</p>;
}
