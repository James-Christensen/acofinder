import React, { useMemo } from "react";
import { parseNumericString, formatCurrency } from "../utils/helpers";

export default function PenaltyRiskCalculator({ aco }) {
  const analysis = useMemo(() => {
    const qualScore = aco.qualScore || parseFloat(aco.QualScore) || 0;
    const savRate = parseFloat(aco.Sav_Rate) || 0;
    const minSavPerc = parseFloat(aco.MinSavPerc) || 0;
    const genSavings = aco.genSavings || parseNumericString(aco.GenSaveLoss);
    const earnedSavings = aco.savings || parseNumericString(aco.EarnSaveLoss);
    const benchmark = parseNumericString(aco.BnchmkMinExp);
    const isTwoSided =
      aco.Risk_Model && aco.Risk_Model.toLowerCase().includes("loss");
    const finalShareRate = parseFloat(aco.FinalShareRate) || 0;
    const maxShareRate = parseFloat(aco.MaxShareRate) || 0;

    // Risk factors
    const risks = [];
    let overallRisk = "low";

    // Quality risk
    if (qualScore > 0 && qualScore < 30) {
      risks.push({
        factor: "Critical Quality Score",
        detail: `Score of ${qualScore.toFixed(1)}% is below minimum quality threshold`,
        severity: "high",
        impact: "May receive $0 in shared savings regardless of financial performance",
      });
      overallRisk = "high";
    } else if (qualScore > 0 && qualScore < 50) {
      risks.push({
        factor: "Low Quality Score",
        detail: `Score of ${qualScore.toFixed(1)}% significantly reduces shared savings rate`,
        severity: "medium",
        impact: `Final share rate reduced to ${finalShareRate}% vs max of ${maxShareRate}%`,
      });
      if (overallRisk !== "high") overallRisk = "medium";
    }

    // Savings rate risk
    if (savRate < 0) {
      risks.push({
        factor: "Spending Above Benchmark",
        detail: `Savings rate of ${savRate}% means spending exceeds benchmark`,
        severity: "high",
        impact: isTwoSided
          ? `ACO may owe losses of ${formatCurrency(Math.abs(earnedSavings))}`
          : "No shared savings earned; may face pressure to move to two-sided risk",
      });
      overallRisk = "high";
    } else if (savRate > 0 && savRate < minSavPerc) {
      risks.push({
        factor: "Below Minimum Savings Rate",
        detail: `Savings rate of ${savRate}% is below the ${minSavPerc}% minimum threshold`,
        severity: "medium",
        impact: "Generated savings exist but ACO does not qualify to keep them",
      });
      if (overallRisk !== "high") overallRisk = "medium";
    }

    // Two-sided risk exposure
    if (isTwoSided) {
      risks.push({
        factor: "Two-Sided Risk Model",
        detail: `${aco.Risk_Model} — ACO is exposed to downside risk`,
        severity: earnedSavings < 0 ? "high" : "medium",
        impact:
          earnedSavings < 0
            ? `Currently owing ${formatCurrency(Math.abs(earnedSavings))} in losses`
            : "Financial exposure exists even if currently generating savings",
      });
    }

    // Quality-savings gap
    if (qualScore > 0 && maxShareRate > 0 && finalShareRate < maxShareRate * 0.7) {
      risks.push({
        factor: "Shared Savings Rate Gap",
        detail: `Final share rate (${finalShareRate}%) is well below maximum (${maxShareRate}%)`,
        severity: "medium",
        impact: `Quality improvement could increase share rate by ${(maxShareRate - finalShareRate).toFixed(1)} percentage points`,
      });
    }

    return { risks, overallRisk, isTwoSided, qualScore, savRate, genSavings, earnedSavings };
  }, [aco]);

  const riskColors = {
    high: "text-error",
    medium: "text-warning",
    low: "text-success",
  };

  const riskLabels = {
    high: "High Risk",
    medium: "Moderate Risk",
    low: "Low Risk",
  };

  return (
    <div className="w-full max-w-4xl mx-auto my-6">
      <h3 className="text-lg font-semibold mb-4">Penalty & Bonus Risk Assessment</h3>

      {/* Overall Risk Badge */}
      <div className="flex items-center gap-3 mb-6">
        <span className="text-sm font-medium">Overall Risk Level:</span>
        <span
          className={`badge badge-lg ${
            analysis.overallRisk === "high"
              ? "badge-error"
              : analysis.overallRisk === "medium"
              ? "badge-warning"
              : "badge-success"
          }`}
        >
          {riskLabels[analysis.overallRisk]}
        </span>
        {analysis.isTwoSided && (
          <span className="badge badge-outline badge-info">Two-Sided Risk</span>
        )}
      </div>

      {/* Risk Factors */}
      {analysis.risks.length > 0 ? (
        <div className="space-y-3">
          {analysis.risks.map((risk, idx) => (
            <div
              key={idx}
              className={`card border ${
                risk.severity === "high"
                  ? "border-error bg-error/5"
                  : risk.severity === "medium"
                  ? "border-warning bg-warning/5"
                  : "border-success bg-success/5"
              }`}
            >
              <div className="card-body p-4">
                <div className="flex justify-between items-start">
                  <h4 className={`font-semibold ${riskColors[risk.severity]}`}>
                    {risk.factor}
                  </h4>
                  <span
                    className={`badge badge-sm ${
                      risk.severity === "high"
                        ? "badge-error"
                        : risk.severity === "medium"
                        ? "badge-warning"
                        : "badge-success"
                    }`}
                  >
                    {risk.severity}
                  </span>
                </div>
                <p className="text-sm">{risk.detail}</p>
                <p className="text-sm opacity-70 italic">{risk.impact}</p>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="alert alert-success">
          <span>No significant risk factors identified. This ACO appears to be performing well.</span>
        </div>
      )}

      {/* Sales Strategy */}
      <div className="mt-6 p-4 bg-base-300 rounded-lg text-left">
        <h4 className="font-semibold mb-2">Recommended Approach</h4>
        {analysis.overallRisk === "high" ? (
          <p className="text-sm">
            This ACO faces significant financial or quality risks. Lead with
            urgency — they likely need solutions to avoid penalties or improve
            quality scores quickly. Quantify the potential financial impact of
            your solution.
          </p>
        ) : analysis.overallRisk === "medium" ? (
          <p className="text-sm">
            This ACO has some areas for improvement but isn't in crisis.
            Position your solution as a way to optimize performance and maximize
            shared savings. Focus on the gap between current and potential share
            rate.
          </p>
        ) : (
          <p className="text-sm">
            This ACO is performing well. Focus on scalability, efficiency, and
            helping them maintain their strong position. They may be interested in
            expanding their program or taking on more risk.
          </p>
        )}
      </div>
    </div>
  );
}
