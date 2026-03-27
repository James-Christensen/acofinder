import React, { useContext, useMemo, useState } from "react";
import ACOContext from "../context/context";
import { formatCurrency } from "../utils/helpers";
import { getMAPressureLevel } from "../data/maPenetration";
import USStateMap from "../components/USStateMap";

export default function MarketInsights() {
  const { acos, loading, error, marketStats } = useContext(ACOContext);
  const [stateView, setStateView] = useState("count");
  const [mapMetric, setMapMetric] = useState("count");

  // Risk model transition analysis
  const riskAnalysis = useMemo(() => {
    const twoSided = acos.filter(
      (a) => a.Risk_Model && a.Risk_Model.toLowerCase().includes("two")
    );
    const oneSided = acos.filter(
      (a) =>
        a.Risk_Model &&
        !a.Risk_Model.toLowerCase().includes("two") &&
        a.hasPerformanceData
    );
    const losingMoney = acos.filter((a) => a.savings < 0);
    const atRisk = acos.filter(
      (a) => a.qualScore > 0 && a.qualScore < 50 && a.hasPerformanceData
    );
    const reachParticipants = acos.filter((a) => a.isReach);

    return { twoSided, oneSided, losingMoney, atRisk, reachParticipants };
  }, [acos]);

  // State-level data sorted by selected metric
  const stateData = useMemo(() => {
    if (!marketStats.byState) return [];
    return Object.entries(marketStats.byState)
      .map(([state, data]) => ({ state, ...data }))
      .sort((a, b) => {
        if (stateView === "count") return b.count - a.count;
        if (stateView === "beneficiaries") return b.beneficiaries - a.beneficiaries;
        if (stateView === "maPenetration") return (b.maPenetration || 0) - (a.maPenetration || 0);
        return b.savings - a.savings;
      });
  }, [marketStats.byState, stateView]);

  // State-level map data
  const stateMapData = useMemo(() => {
    if (!marketStats.byState) return {};
    return marketStats.byState;
  }, [marketStats.byState]);

  // Risk model breakdown
  const riskModelData = useMemo(() => {
    if (!marketStats.byRiskModel) return [];
    return Object.entries(marketStats.byRiskModel)
      .map(([model, data]) => ({ model, ...data }))
      .sort((a, b) => b.count - a.count);
  }, [marketStats.byRiskModel]);

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
    <div className="container mx-auto max-w-6xl px-2">
      <h1 className="text-2xl font-bold text-secondary mb-6">
        MSSP Market Insights
      </h1>

      {/* Top-level Stats */}
      <div className="stats stats-vertical sm:stats-horizontal shadow w-full mb-6">
        <div className="stat">
          <div className="stat-title">Total ACOs</div>
          <div className="stat-value text-primary">{marketStats.total}</div>
          <div className="stat-desc">{marketStats.withPerformance} with performance data</div>
        </div>
        <div className="stat">
          <div className="stat-title">Total Beneficiaries</div>
          <div className="stat-value text-2xl">{marketStats.totalBeneficiaries.toLocaleString()}</div>
          <div className="stat-desc">Medicare lives in MSSP</div>
        </div>
        <div className="stat">
          <div className="stat-title">Total Earned Savings</div>
          <div className="stat-value text-2xl text-success">{formatCurrency(marketStats.totalSavings)}</div>
          <div className="stat-desc">Across all ACOs</div>
        </div>
        <div className="stat">
          <div className="stat-title">Avg Quality Score</div>
          <div className="stat-value text-2xl">{marketStats.avgQualScore.toFixed(1)}%</div>
          <div className="stat-desc">Program-wide average</div>
        </div>
      </div>

      {/* Opportunity Segments */}
      <h2 className="text-xl font-semibold mb-3">Prospect Segments</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 mb-8">
        <div className="card bg-error/10 border border-error">
          <div className="card-body p-4">
            <h3 className="card-title text-error text-lg">{riskAnalysis.losingMoney.length}</h3>
            <p className="text-sm">ACOs with net losses</p>
            <p className="text-xs opacity-70">Highest urgency prospects</p>
          </div>
        </div>
        <div className="card bg-warning/10 border border-warning">
          <div className="card-body p-4">
            <h3 className="card-title text-warning text-lg">{riskAnalysis.atRisk.length}</h3>
            <p className="text-sm">Quality below 50%</p>
            <p className="text-xs opacity-70">At risk of reduced share rate</p>
          </div>
        </div>
        <div className="card bg-info/10 border border-info">
          <div className="card-body p-4">
            <h3 className="card-title text-info text-lg">{riskAnalysis.twoSided.length}</h3>
            <p className="text-sm">Two-sided risk</p>
            <p className="text-xs opacity-70">Face downside risk</p>
          </div>
        </div>
        <div className="card bg-success/10 border border-success">
          <div className="card-body p-4">
            <h3 className="card-title text-success text-lg">{riskAnalysis.oneSided.length}</h3>
            <p className="text-sm">One-sided risk</p>
            <p className="text-xs opacity-70">May transition to two-sided</p>
          </div>
        </div>
        <div className="card bg-accent/10 border border-accent">
          <div className="card-body p-4">
            <h3 className="card-title text-accent text-lg">{riskAnalysis.reachParticipants.length}</h3>
            <p className="text-sm">ACO REACH</p>
            <p className="text-xs opacity-70">Also in REACH model</p>
          </div>
        </div>
      </div>

      {/* Geographic Heatmap */}
      <h2 className="text-xl font-semibold mb-3">Geographic Distribution</h2>
      <div className="card bg-base-100 shadow border mb-8">
        <div className="card-body p-4">
          <div className="flex justify-end mb-2">
            <select
              className="select select-bordered select-sm"
              value={mapMetric}
              onChange={(e) => setMapMetric(e.target.value)}
            >
              <option value="count">ACO Count</option>
              <option value="beneficiaries">Total Beneficiaries</option>
              <option value="savings">Net Savings</option>
              <option value="avgQualScore">Avg Quality Score</option>
              <option value="maPenetration">MA Penetration %</option>
            </select>
          </div>
          <USStateMap data={stateMapData} metric={mapMetric} />
        </div>
      </div>

      {/* Risk Model Breakdown */}
      <h2 className="text-xl font-semibold mb-3">Risk Model Breakdown</h2>
      <div className="overflow-x-auto border rounded-lg mb-8">
        <table className="table table-compact w-full">
          <thead className="bg-base-200">
            <tr>
              <th>Risk Model</th>
              <th className="text-right">ACO Count</th>
              <th className="text-right">Total Beneficiaries</th>
              <th className="text-right">% of Program</th>
            </tr>
          </thead>
          <tbody>
            {riskModelData.map((r) => (
              <tr key={r.model} className="hover">
                <td>{r.model}</td>
                <td className="text-right">{r.count}</td>
                <td className="text-right">{r.beneficiaries.toLocaleString()}</td>
                <td className="text-right">
                  {marketStats.total > 0 ? ((r.count / marketStats.total) * 100).toFixed(1) : 0}%
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* State-level Market Sizing */}
      <div className="flex justify-between items-center mb-3">
        <h2 className="text-xl font-semibold">Market by State</h2>
        <select
          className="select select-bordered select-sm"
          value={stateView}
          onChange={(e) => setStateView(e.target.value)}
        >
          <option value="count">Sort by ACO Count</option>
          <option value="beneficiaries">Sort by Beneficiaries</option>
          <option value="savings">Sort by Savings</option>
          <option value="maPenetration">Sort by MA Penetration</option>
        </select>
      </div>
      <div className="overflow-x-auto border rounded-lg mb-6">
        <table className="table table-compact w-full">
          <thead className="bg-base-200 sticky top-0">
            <tr>
              <th>State</th>
              <th className="text-right">ACOs</th>
              <th className="text-right">Beneficiaries</th>
              <th className="text-right">Net Savings</th>
              <th className="text-right">Avg Quality</th>
              <th className="text-right">MA Penetration</th>
              <th>Distribution</th>
            </tr>
          </thead>
          <tbody>
            {stateData.map((s) => {
              const maPressure = getMAPressureLevel(s.maPenetration);
              return (
                <tr key={s.state} className="hover">
                  <td className="font-semibold">{s.state}</td>
                  <td className="text-right">{s.count}</td>
                  <td className="text-right">{s.beneficiaries.toLocaleString()}</td>
                  <td className={`text-right ${s.savings > 0 ? "text-success" : s.savings < 0 ? "text-error" : ""}`}>
                    {formatCurrency(s.savings)}
                  </td>
                  <td className="text-right">
                    {s.avgQualScore > 0 ? `${s.avgQualScore}%` : "-"}
                  </td>
                  <td className={`text-right font-semibold ${maPressure.color}`}>
                    {s.maPenetration ? `${s.maPenetration}%` : "-"}
                  </td>
                  <td>
                    <div className="w-32 bg-base-300 rounded-full h-2">
                      <div
                        className="bg-primary h-2 rounded-full"
                        style={{
                          width: `${Math.min((s.count / (stateData[0]?.count || 1)) * 100, 100)}%`,
                        }}
                      ></div>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
