import React from "react";
import { FaHospital, FaNotesMedical, FaDollarSign, FaChartLine } from "react-icons/fa";

export default function Stats({ members, patients, arr, qualScore, currentYear }) {
  return (
    <div className="stats stats-vertical sm:stats-horizontal shadow">
      <div className="stat">
        <div className="stat-figure text-accent">
          <FaHospital className="my-2 text-4xl" />
        </div>
        <div className="stat-title">Member Practices</div>
        <div className="stat-value">{(members || 0).toLocaleString()}</div>
        <div className="stat-desc">{currentYear} TINs</div>
      </div>

      <div className="stat">
        <div className="stat-figure text-warning">
          <FaNotesMedical className="my-2 text-4xl" />
        </div>
        <div className="stat-title">Medicare Panel</div>
        <div className="stat-value">{(patients || 0).toLocaleString()}</div>
        <div className="stat-desc">{currentYear} Beneficiaries</div>
      </div>

      <div className="stat">
        <div className="stat-figure text-success">
          <FaDollarSign className="my-2 text-4xl" />
        </div>
        <div className="stat-title">Est. ARR</div>
        <div className="stat-value">
          ${arr >= 1000000 ? `${(arr / 1000000).toFixed(1)}M` : `${Math.round(arr / 1000)}K`}
        </div>
        <div className="stat-desc">@ 50 PMPM</div>
      </div>

      {qualScore > 0 && (
        <div className="stat">
          <div className="stat-figure text-primary">
            <FaChartLine className="my-2 text-4xl" />
          </div>
          <div className="stat-title">Quality Score</div>
          <div className="stat-value">{qualScore.toFixed(1)}%</div>
          <div className="stat-desc">{currentYear} Performance</div>
        </div>
      )}
    </div>
  );
}
