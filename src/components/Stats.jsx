import React from "react";
import { FaHospital, FaNotesMedical, FaDollarSign } from "react-icons/fa";

export default function Stats({ members, patients, arr }) {

  return (
    <>
      <div className="stats shadow">
        <div className="stat">
          <div className="stat-figure text-accent">
            <FaHospital className="my-2 text-4xl" />
          </div>
          <div className="stat-title">Member Practices</div>
          <div className="stat-value">{members}</div>
          <div className="stat-desc">2023 TINS</div>
        </div>

        <div className="stat">
          <div className="stat-figure text-warning">
            <FaNotesMedical className="my-2 text-4xl" />
          </div>
          <div className="stat-title">Medicare Panel</div>
          <div className="stat-value">{patients}</div>
          <div className="stat-desc">Based on 2021 Beneficiaries</div>
        </div>

        <div className="stat">
          <div className="stat-figure text-success">
            <FaDollarSign className="my-2 text-4xl" />
          </div>
          <div className="stat-title">Est. ARR</div>
          <div className="stat-value">${Math.round(arr / 1000)}k</div>
          <div className="stat-desc"> 50 PMPM</div>
        </div>
      </div>
      <></>
    </>
  );
}
