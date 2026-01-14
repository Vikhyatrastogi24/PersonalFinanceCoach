import React from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

export default function StatsWidget({ title = "Monthly Spending", data = [] }) {
  return (
    <div className="bg-indigo-800 bg-opacity-80 rounded-xl p-6 shadow-xl w-full max-w-full md:max-w-md hover:scale-105 transition-transform">
      <h2 className="text-xl font-semibold mb-6 text-indigo-200">{title}</h2>
      <ResponsiveContainer width="100%" height={250}>
        <BarChart data={data}>
          <XAxis dataKey="month" stroke="#a78bfa" />
          <YAxis stroke="#a78bfa" />
          <Tooltip
            contentStyle={{ backgroundColor: "#312e81", borderRadius: 8 }}
            itemStyle={{ color: "#a78bfa" }}
            cursor={{ fill: "rgba(101, 78, 235, 0.1)" }}
          />
          <Bar dataKey="spending" fill="#8b5cf6" radius={[4, 4, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
