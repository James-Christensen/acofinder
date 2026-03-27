import React from "react";
import { FaArrowUp, FaArrowDown, FaMinus } from "react-icons/fa";
import { formatCurrency, parseNumericString } from "../utils/helpers";

export default function BenchmarkPressure({ aco, priorPerf }) {
  const benchmark = parseNumericString(aco.BnchmkMinExp);
  const genSavings = aco.genSavings || 0;
  const savRate = parseFloat(aco.Sav_Rate) || 0;

  // Prior year comparison
  const priorBenchmark = priorPerf ? parseNumericString(priorPerf.BnchmkMinExp) : 0;
  const priorGenSavings = priorPerf ? parseNumericString(priorPerf.GenSaveLoss) : 0;
  const priorSavRate = priorPerf ? parseFloat(priorPerf.Sav_Rate) || 0 : null;

  // Calculate trend
  const savRateTrend = priorSavRate !== null ? savRate - priorSavRate : null;

  // Determine pressure level
  let pressureLevel, pressureColor, pressureLabel;
  if (savRate < -3) {
    pressureLevel = "critical";
    pressureColor = "text-error";
    pressureLabel = "Critical — Spending well above benchmark";
  } else if (savRate < 0) {
    pressureLevel = "high";
    pressureColor = "text-error";
    pressureLabel = "High — Spending above benchmark";
  } else if (savRate < 2) {
    pressureLevel = "moderate";
    pressureColor = "text-warning";
    pressureLabel = "Moderate — Close to benchmark";
  } else {
    pressureLevel = "low";
    pressureColor = "text-success";
    pressureLabel = "Low — Comfortably below benchmark";
  }

  if (benchmark === 0) {
    return null;
  }

  return (
    <div className="card bg-base-100 shadow border my-5 max-w-2xl mx-auto">
      <div className="card-body p-5">
        <h3 className="card-title text-lg">Benchmark Pressure Analysis</h3>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 my-3">
          {/* Benchmark Amount */}
          <div className="text-center">
            <div className="text-xs opacity-60 uppercase">Benchmark Min</div>
            <div className="text-xl font-bold">{formatCurrency(benchmark)}</div>
          </div>

          {/* Generated Savings/Loss */}
          <div className="text-center">
            <div className="text-xs opacity-60 uppercase">Generated Savings</div>
            <div
              className={`text-xl font-bold ${
                genSavings > 0 ? "text-success" : genSavings < 0 ? "text-error" : ""
              }`}
            >
              {formatCurrency(genSavings)}
            </div>
          </div>

          {/* Savings Rate */}
          <div className="text-center">
            <div className="text-xs opacity-60 uppercase">Savings Rate</div>
            <div className={`text-xl font-bold ${pressureColor}`}>
              {savRate.toFixed(1)}%
              {savRateTrend !== null && (
                <span className="ml-2 text-sm">
                  {savRateTrend > 0 ? (
                    <FaArrowUp className="inline text-success" />
                  ) : savRateTrend < 0 ? (
                    <FaArrowDown className="inline text-error" />
                  ) : (
                    <FaMinus className="inline opacity-50" />
                  )}
                  <span className="text-xs opacity-70 ml-1">
                    {savRateTrend > 0 ? "+" : ""}
                    {savRateTrend.toFixed(1)}%
                  </span>
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Pressure Gauge */}
        <div className="my-3">
          <div className="flex justify-between text-xs mb-1">
            <span className="text-error">Above Benchmark</span>
            <span className="text-success">Below Benchmark</span>
          </div>
          <div className="w-full bg-base-300 rounded-full h-3 relative">
            {/* Center marker at 0% savings rate */}
            <div
              className="absolute top-0 w-0.5 h-3 bg-base-content opacity-30"
              style={{ left: "50%" }}
            ></div>
            {/* Position marker based on savings rate (-10% to +10% range) */}
            <div
              className={`h-3 rounded-full transition-all ${
                savRate >= 0 ? "bg-success" : "bg-error"
              }`}
              style={{
                width: `${Math.min(Math.max(Math.abs(savRate) * 5, 2), 50)}%`,
                marginLeft: savRate >= 0 ? "50%" : `${Math.max(50 - Math.abs(savRate) * 5, 0)}%`,
              }}
            ></div>
          </div>
        </div>

        {/* Pressure Assessment */}
        <div className={`alert ${
          pressureLevel === "critical" || pressureLevel === "high"
            ? "alert-error"
            : pressureLevel === "moderate"
            ? "alert-warning"
            : "alert-success"
        } mt-2`}>
          <span className="text-sm">{pressureLabel}</span>
        </div>

        {/* YoY Trend */}
        {priorPerf && (
          <div className="text-xs opacity-60 mt-2 text-center">
            Prior year: {formatCurrency(priorGenSavings)} generated savings |
            Benchmark: {formatCurrency(priorBenchmark)}
          </div>
        )}
      </div>
    </div>
  );
}
