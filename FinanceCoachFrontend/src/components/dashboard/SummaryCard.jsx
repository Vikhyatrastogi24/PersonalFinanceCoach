import React from "react";

export default function SummaryCard({
  title,
  value,
  icon,
  color = "bg-indigo-600",
}) {
  return (
    <div
      className={`flex items-center space-x-4 p-6 rounded-xl shadow-lg text-white ${color} hover:scale-105 transition-transform`}
    >
      <div className="text-4xl">{icon}</div>
      <div>
        <p className="text-lg font-semibold">{title}</p>
        <p className="text-3xl font-extrabold">{value}</p>
      </div>
    </div>
  );
}
