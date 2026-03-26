import React from "react";
import { parseNumericString, formatCurrency } from "../utils/helpers";
import { FaArrowUp, FaArrowDown, FaMinus } from "react-icons/fa";

export default function YearOverYear({ current, prior, currentYear, priorYear }) {
  if (!prior) return null;

  const metrics = [
    {
      label: "Panel Size (Beneficiaries)",
      currentVal: current.panel || parseNumericString(current.N_AB),
      priorVal: parseNumericString(prior.N_AB),
      format: (v) => v.toLocaleString(),
    },
    {
      label: "Generated Savings/Loss",
      currentVal: current.genSavings || parseNumericString(current.GenSaveLoss),
      priorVal: parseNumericString(prior.GenSaveLoss),
      format: formatCurrency,
    },
    {
      label: "Earned Savings/Loss",
      currentVal: current.savings || parseNumericString(current.EarnSaveLoss),
      priorVal: parseNumericString(prior.EarnSaveLoss),
      format: formatCurrency,
    },
    {
      label: "Quality Score",
      currentVal: parseFloat(current.QualScore) || 0,
      priorVal: parseFloat(prior.QualScore) || 0,
      format: (v) => (v > 0 ? `${v.toFixed(1)}%` : "N/A"),
    },
    {
      label: "Savings Rate",
      currentVal: parseFloat(current.Sav_Rate) || 0,
      priorVal: parseFloat(prior.Sav_Rate) || 0,
      format: (v) => (v !== 0 ? `${v.toFixed(2)}%` : "N/A"),
    },
  ];

  const TrendIcon = ({ current, prior }) => {
    if (current === 0 && prior === 0) return <FaMinus className="text-base-content/30" />;
    if (current > prior) return <FaArrowUp className="text-success" />;
    if (current < prior) return <FaArrowDown className="text-error" />;
    return <FaMinus className="text-base-content/30" />;
  };

  const getChangePercent = (current, prior) => {
    if (prior === 0) return current > 0 ? "+100%" : "N/A";
    const change = ((current - prior) / Math.abs(prior)) * 100;
    return `${change > 0 ? "+" : ""}${change.toFixed(1)}%`;
  };

  return (
    <div className="w-full max-w-4xl mx-auto my-6">
      <h3 className="text-lg font-semibold mb-4">
        Year-over-Year Comparison ({priorYear} vs {currentYear})
      </h3>
      <div className="overflow-x-auto">
        <table className="table w-full">
          <thead>
            <tr>
              <th>Metric</th>
              <th className="text-right">{priorYear}</th>
              <th className="text-right">{currentYear}</th>
              <th className="text-center">Trend</th>
              <th className="text-right">Change</th>
            </tr>
          </thead>
          <tbody>
            {metrics.map((m) => (
              <tr key={m.label} className="hover">
                <td className="font-medium">{m.label}</td>
                <td className="text-right">{m.format(m.priorVal)}</td>
                <td className="text-right font-semibold">{m.format(m.currentVal)}</td>
                <td className="text-center">
                  <TrendIcon current={m.currentVal} prior={m.priorVal} />
                </td>
                <td className="text-right text-sm">
                  {getChangePercent(m.currentVal, m.priorVal)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Risk Model Change */}
      {prior.Risk_Model && current.Risk_Model && prior.Risk_Model !== current.Risk_Model && (
        <div className="alert alert-info mt-4">
          <span>
            Risk model changed from <strong>{prior.Risk_Model}</strong> to{" "}
            <strong>{current.Risk_Model}</strong>
          </span>
        </div>
      )}
    </div>
  );
}
