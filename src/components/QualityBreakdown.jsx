import React from "react";
import { getQualityMeasures } from "../utils/helpers";

export default function QualityBreakdown({ aco }) {
  const measures = getQualityMeasures(aco);
  const qualScore = aco.qualScore || parseFloat(aco.QualScore) || 0;

  const getScoreColor = (score) => {
    if (!score || score === "N/A") return "";
    const num = parseFloat(score);
    if (num >= 80) return "text-success";
    if (num >= 50) return "text-warning";
    return "text-error";
  };

  return (
    <div className="w-full max-w-4xl mx-auto">
      <h3 className="text-lg font-semibold mb-4">Quality Measure Breakdown</h3>

      {/* Overall Score */}
      <div className="stats shadow mb-6 w-full">
        <div className="stat">
          <div className="stat-title">Overall Quality Score</div>
          <div className={`stat-value ${getScoreColor(qualScore)}`}>
            {qualScore > 0 ? `${qualScore.toFixed(1)}%` : "N/A"}
          </div>
          <div className="stat-desc">
            {qualScore >= 80
              ? "Strong performance"
              : qualScore >= 50
              ? "Moderate - room for improvement"
              : qualScore > 0
              ? "Below average - potential pain point"
              : "No score available"}
          </div>
        </div>
        <div className="stat">
          <div className="stat-title">Final Share Rate</div>
          <div className="stat-value text-2xl">
            {aco.FinalShareRate ? `${aco.FinalShareRate}%` : "N/A"}
          </div>
          <div className="stat-desc">Max: {aco.MaxShareRate || "N/A"}%</div>
        </div>
        <div className="stat">
          <div className="stat-title">Savings Rate</div>
          <div className="stat-value text-2xl">
            {aco.Sav_Rate ? `${aco.Sav_Rate}%` : "N/A"}
          </div>
          <div className="stat-desc">Min Required: {aco.MinSavPerc || "N/A"}%</div>
        </div>
      </div>

      {/* Individual Measures */}
      <div className="overflow-x-auto">
        <table className="table w-full">
          <thead>
            <tr>
              <th>Measure ID</th>
              <th>Measure Name</th>
              <th>Web Interface Score</th>
              <th>eCQM/CQM Score</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {measures.map((m) => {
              const score = m.wiScore || m.ecqmScore;
              const numScore = parseFloat(score);
              return (
                <tr key={m.id} className="hover">
                  <td className="font-mono">{m.id}</td>
                  <td>{m.name}</td>
                  <td className={getScoreColor(m.wiScore)}>
                    {m.wiScore || "N/A"}
                  </td>
                  <td className={getScoreColor(m.ecqmScore)}>
                    {m.ecqmScore || "N/A"}
                  </td>
                  <td>
                    {!score || score === "N/A" ? (
                      <span className="badge badge-ghost badge-sm">No Data</span>
                    ) : numScore >= 80 ? (
                      <span className="badge badge-success badge-sm">Strong</span>
                    ) : numScore >= 50 ? (
                      <span className="badge badge-warning badge-sm">Moderate</span>
                    ) : (
                      <span className="badge badge-error badge-sm">Needs Improvement</span>
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Sales Insights */}
      <div className="mt-6 p-4 bg-base-300 rounded-lg text-left">
        <h4 className="font-semibold mb-2">Sales Talking Points</h4>
        <ul className="list-disc list-inside text-sm space-y-1">
          {qualScore > 0 && qualScore < 60 && (
            <li className="text-warning">
              Quality score below 60% — at risk of reduced shared savings rate. Opportunity to discuss quality improvement solutions.
            </li>
          )}
          {qualScore >= 80 && (
            <li className="text-success">
              High quality performer — likely interested in maintaining/improving position. Focus on efficiency and scale.
            </li>
          )}
          {aco.Sav_Rate && parseFloat(aco.Sav_Rate) < 0 && (
            <li className="text-error">
              Negative savings rate — ACO is spending above benchmark. Strong need for cost management solutions.
            </li>
          )}
          {aco.Risk_Model && aco.Risk_Model.toLowerCase().includes("loss") && (
            <li className="text-info">
              Two-sided risk model — ACO faces downside risk. Higher urgency for performance improvement tools.
            </li>
          )}
          {measures.some((m) => {
            const s = parseFloat(m.wiScore || m.ecqmScore);
            return s > 0 && s < 50;
          }) && (
            <li className="text-warning">
              One or more quality measures below 50% — specific gap areas to address in conversation.
            </li>
          )}
        </ul>
      </div>
    </div>
  );
}
