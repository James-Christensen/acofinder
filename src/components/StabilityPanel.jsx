import React, { useMemo, useState } from "react";
import { FaArrowUp, FaArrowDown, FaMinus, FaChevronDown, FaChevronRight } from "react-icons/fa";
import { calculateChurn, getStabilityLabel } from "../utils/churnAnalysis";

export default function StabilityPanel({
  currentMembers,
  priorMembers,
  currentPanel,
  priorPanel,
  currentYear,
  priorYear,
}) {
  const [showAdded, setShowAdded] = useState(false);
  const [showLost, setShowLost] = useState(false);

  const churn = useMemo(
    () => calculateChurn(currentMembers, priorMembers),
    [currentMembers, priorMembers]
  );

  const stability = getStabilityLabel(churn.churnRate);
  const panelChange = (currentPanel || 0) - (priorPanel || 0);
  const panelChangePct =
    priorPanel > 0 ? Math.round((panelChange / priorPanel) * 100) : 0;

  const totalProviders = Math.max(churn.currentCount, churn.priorCount, 1);

  return (
    <div className="max-w-3xl mx-auto">
      <h3 className="text-lg font-semibold mb-4">
        Provider Stability ({priorYear} → {currentYear})
      </h3>

      {/* Overall Stability Badge */}
      <div className="flex justify-center mb-5">
        <span className={`badge badge-lg ${stability.badge}`}>
          {stability.label} — {churn.churnRate}% Churn Rate
        </span>
      </div>

      {/* Key Metrics */}
      <div className="stats stats-vertical sm:stats-horizontal shadow w-full mb-5">
        <div className="stat">
          <div className="stat-title">Retained</div>
          <div className="stat-value text-success text-2xl">
            {churn.retained.length}
          </div>
          <div className="stat-desc">Practices in both years</div>
        </div>
        <div className="stat">
          <div className="stat-title">Added</div>
          <div className="stat-value text-info text-2xl">
            +{churn.added.length}
          </div>
          <div className="stat-desc">New in {currentYear}</div>
        </div>
        <div className="stat">
          <div className="stat-title">Lost</div>
          <div className="stat-value text-error text-2xl">
            -{churn.lost.length}
          </div>
          <div className="stat-desc">Gone from {priorYear}</div>
        </div>
        <div className="stat">
          <div className="stat-title">Net Change</div>
          <div
            className={`stat-value text-2xl ${
              churn.netChange > 0
                ? "text-success"
                : churn.netChange < 0
                ? "text-error"
                : ""
            }`}
          >
            {churn.netChange > 0 ? "+" : ""}
            {churn.netChange}
          </div>
          <div className="stat-desc">
            {churn.growthRate > 0 ? "+" : ""}
            {churn.growthRate}% growth
          </div>
        </div>
      </div>

      {/* Stacked Bar Visualization */}
      <div className="card bg-base-100 shadow border mb-5">
        <div className="card-body p-4">
          <h4 className="text-sm font-semibold mb-2">Provider Network Composition</h4>
          <div className="w-full bg-base-300 rounded-full h-6 flex overflow-hidden">
            {churn.retained.length > 0 && (
              <div
                className="bg-success h-6 flex items-center justify-center text-xs text-success-content"
                style={{
                  width: `${(churn.retained.length / totalProviders) * 100}%`,
                }}
                title={`${churn.retained.length} retained`}
              >
                {churn.retained.length > 3 && `${churn.retained.length}`}
              </div>
            )}
            {churn.added.length > 0 && (
              <div
                className="bg-info h-6 flex items-center justify-center text-xs text-info-content"
                style={{
                  width: `${(churn.added.length / totalProviders) * 100}%`,
                }}
                title={`${churn.added.length} added`}
              >
                {churn.added.length > 3 && `+${churn.added.length}`}
              </div>
            )}
            {churn.lost.length > 0 && (
              <div
                className="bg-error h-6 flex items-center justify-center text-xs text-error-content"
                style={{
                  width: `${(churn.lost.length / totalProviders) * 100}%`,
                }}
                title={`${churn.lost.length} lost`}
              >
                {churn.lost.length > 3 && `-${churn.lost.length}`}
              </div>
            )}
          </div>
          <div className="flex gap-4 mt-2 text-xs">
            <span className="flex items-center gap-1">
              <span className="w-3 h-3 bg-success rounded"></span> Retained
            </span>
            <span className="flex items-center gap-1">
              <span className="w-3 h-3 bg-info rounded"></span> Added
            </span>
            <span className="flex items-center gap-1">
              <span className="w-3 h-3 bg-error rounded"></span> Lost
            </span>
          </div>
        </div>
      </div>

      {/* Beneficiary Panel Change */}
      {priorPanel > 0 && (
        <div className="card bg-base-100 shadow border mb-5">
          <div className="card-body p-4">
            <h4 className="text-sm font-semibold mb-2">Beneficiary Count Change</h4>
            <div className="flex items-center gap-3">
              <span className="text-sm opacity-70">
                {priorYear}: {(priorPanel || 0).toLocaleString()}
              </span>
              <span>→</span>
              <span className="text-sm font-bold">
                {currentYear}: {(currentPanel || 0).toLocaleString()}
              </span>
              <span
                className={`badge ${
                  panelChange > 0
                    ? "badge-success"
                    : panelChange < 0
                    ? "badge-error"
                    : "badge-ghost"
                }`}
              >
                {panelChange > 0 ? (
                  <FaArrowUp className="mr-1" />
                ) : panelChange < 0 ? (
                  <FaArrowDown className="mr-1" />
                ) : (
                  <FaMinus className="mr-1" />
                )}
                {panelChange > 0 ? "+" : ""}
                {panelChange.toLocaleString()} ({panelChangePct > 0 ? "+" : ""}
                {panelChangePct}%)
              </span>
            </div>
          </div>
        </div>
      )}

      {/* Collapsible Added/Lost Lists */}
      {churn.added.length > 0 && (
        <div className="card bg-base-100 shadow border mb-3">
          <div
            className="card-body p-3 cursor-pointer"
            onClick={() => setShowAdded(!showAdded)}
          >
            <div className="flex justify-between items-center">
              <h4 className="text-sm font-semibold text-info">
                Added Practices ({churn.added.length})
              </h4>
              {showAdded ? <FaChevronDown /> : <FaChevronRight />}
            </div>
            {showAdded && (
              <div className="mt-2 max-h-60 overflow-y-auto">
                {churn.added.map((name, i) => (
                  <div key={i} className="text-xs py-1 border-b border-base-200">
                    {name}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {churn.lost.length > 0 && (
        <div className="card bg-base-100 shadow border mb-3">
          <div
            className="card-body p-3 cursor-pointer"
            onClick={() => setShowLost(!showLost)}
          >
            <div className="flex justify-between items-center">
              <h4 className="text-sm font-semibold text-error">
                Lost Practices ({churn.lost.length})
              </h4>
              {showLost ? <FaChevronDown /> : <FaChevronRight />}
            </div>
            {showLost && (
              <div className="mt-2 max-h-60 overflow-y-auto">
                {churn.lost.map((name, i) => (
                  <div key={i} className="text-xs py-1 border-b border-base-200">
                    {name}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {churn.priorCount === 0 && (
        <div className="alert alert-info mt-3">
          <span className="text-sm">
            No prior year member data available for this ACO. This may be a new MSSP participant.
          </span>
        </div>
      )}
    </div>
  );
}
