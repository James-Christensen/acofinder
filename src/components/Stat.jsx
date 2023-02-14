import React from "react";
import { FaChartLine } from "react-icons/fa";

export default function Stat({ statValue, title, statDesc, icon }) {
  return (
    <div className="stats shadow my-4 hover:shadow-lg hover:shadow-primary w-full">
      <div className="stat">
        <div className="stat-figure text-primary">{icon}</div>
        <div className="stat-title text-left">{title}</div>
        <div className="stat-value text-3xl text-left">{statValue}</div>
        <div className="stat-desc text-left">{statDesc}</div>
      </div>
    </div>
  );
}

Stat.defaultProps = {
  title: "Stat Title",
  statValue: "Num",
  statDesc: "Explaination of Num!",
  icon: <FaChartLine className="my-2 text-4xl" />,
};
