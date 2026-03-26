import React, { useContext, useState, useMemo } from "react";
import { Link } from "react-router-dom";
import ACOContext from "../context/context";
import { formatCurrency } from "../utils/helpers";

export default function Leaderboard() {
  const { acos, loading, error, CURRENT_YEAR } = useContext(ACOContext);
  const [metric, setMetric] = useState("savings");
  const [showTop] = useState(true);
  const [count, setCount] = useState(25);

  const ranked = useMemo(() => {
    const withPerf = acos.filter((a) => a.hasPerformanceData);
    let sorted;

    switch (metric) {
      case "savings":
        sorted = [...withPerf].sort((a, b) => b.savings - a.savings);
        break;
      case "losses":
        sorted = [...withPerf].sort((a, b) => a.savings - b.savings);
        break;
      case "genSavings":
        sorted = [...withPerf].sort((a, b) => b.genSavings - a.genSavings);
        break;
      case "qualScore":
        sorted = [...withPerf].sort((a, b) => b.qualScore - a.qualScore);
        break;
      case "qualScoreLow":
        sorted = [...withPerf]
          .filter((a) => a.qualScore > 0)
          .sort((a, b) => a.qualScore - b.qualScore);
        break;
      case "panel":
        sorted = [...withPerf].sort((a, b) => b.panel - a.panel);
        break;
      default:
        sorted = withPerf;
    }

    return showTop ? sorted.slice(0, count) : sorted.slice(-count).reverse();
  }, [acos, metric, showTop, count]);

  const getValueDisplay = (aco) => {
    switch (metric) {
      case "savings":
      case "losses":
        return formatCurrency(aco.savings);
      case "genSavings":
        return formatCurrency(aco.genSavings);
      case "qualScore":
      case "qualScoreLow":
        return `${aco.qualScore.toFixed(1)}%`;
      case "panel":
        return aco.panel.toLocaleString();
      default:
        return "";
    }
  };

  const getValueColor = (aco) => {
    switch (metric) {
      case "savings":
      case "genSavings":
        return aco.savings > 0 ? "text-success" : aco.savings < 0 ? "text-error" : "";
      case "losses":
        return aco.savings < 0 ? "text-error" : "text-success";
      case "qualScore":
        return aco.qualScore >= 80 ? "text-success" : aco.qualScore >= 50 ? "text-warning" : "text-error";
      case "qualScoreLow":
        return aco.qualScore < 50 ? "text-error" : aco.qualScore < 80 ? "text-warning" : "text-success";
      default:
        return "";
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[400px]">
        <span className="loading loading-spinner loading-lg text-primary"></span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="alert alert-error shadow-lg max-w-lg mx-auto">
        <span>{error}</span>
      </div>
    );
  }

  return (
    <div className="container mx-auto max-w-5xl px-2">
      <h1 className="text-2xl font-bold text-secondary mb-4">
        {CURRENT_YEAR} ACO Leaderboard
      </h1>

      {/* Controls */}
      <div className="flex flex-wrap gap-3 mb-4 items-end">
        <div>
          <label className="label label-text text-xs">Rank By</label>
          <select
            className="select select-bordered select-sm"
            value={metric}
            onChange={(e) => setMetric(e.target.value)}
          >
            <option value="savings">Earned Savings (Top)</option>
            <option value="losses">Earned Savings (Bottom / Losses)</option>
            <option value="genSavings">Generated Savings</option>
            <option value="qualScore">Quality Score (Highest)</option>
            <option value="qualScoreLow">Quality Score (Lowest)</option>
            <option value="panel">Panel Size (Largest)</option>
          </select>
        </div>
        <div>
          <label className="label label-text text-xs">Show</label>
          <select
            className="select select-bordered select-sm"
            value={count}
            onChange={(e) => setCount(parseInt(e.target.value))}
          >
            <option value={10}>Top 10</option>
            <option value={25}>Top 25</option>
            <option value={50}>Top 50</option>
          </select>
        </div>
      </div>

      {/* Sales Context */}
      <div className="bg-base-200 p-3 rounded-lg mb-4 text-sm">
        {metric === "losses" || metric === "qualScoreLow" ? (
          <p>
            <strong>Prospecting Tip:</strong> ACOs at the bottom of the leaderboard face penalty risk and performance pressure — they are often the most receptive to solutions that improve quality or reduce costs.
          </p>
        ) : (
          <p>
            <strong>Prospecting Tip:</strong> Top-performing ACOs have proven their ability to succeed in value-based care. They may be interested in scaling, optimizing, or expanding their programs.
          </p>
        )}
      </div>

      {/* Leaderboard Table */}
      <div className="overflow-x-auto border border-info rounded-lg">
        <table className="table table-compact w-full">
          <thead className="sticky top-0 bg-base-200">
            <tr>
              <th className="w-12">Rank</th>
              <th>ACO</th>
              <th>State</th>
              <th>Risk Model</th>
              <th className="text-right">Value</th>
              <th className="text-right">Panel</th>
            </tr>
          </thead>
          <tbody>
            {ranked.map((aco, idx) => (
              <tr key={aco.aco_id} className="hover border-b border-base-300">
                <td className="font-bold opacity-50">{idx + 1}</td>
                <td>
                  <Link to={`/aco/${aco.aco_id}`} className="link link-primary text-sm">
                    {aco.aco_name}
                  </Link>
                  <span className="text-xs opacity-50 ml-2">{aco.aco_id}</span>
                </td>
                <td>{aco.state}</td>
                <td className="text-xs">{aco.Risk_Model || "-"}</td>
                <td className={`text-right font-semibold ${getValueColor(aco)}`}>
                  {getValueDisplay(aco)}
                </td>
                <td className="text-right">{aco.panel > 0 ? aco.panel.toLocaleString() : "-"}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
