import React, { useContext } from "react";
import ACOResults from "../components/ACOResults";
import ACOContext from "../context/context";
import { formatCurrency } from "../utils/helpers";

export default function Home() {
  const { marketStats, loading } = useContext(ACOContext);

  return (
    <div>
      {!loading && marketStats.total > 0 && (
        <div className="container mx-auto w-5/6 mb-4">
          <div className="stats stats-vertical sm:stats-horizontal shadow w-full text-sm">
            <div className="stat py-2">
              <div className="stat-title text-xs">Total ACOs</div>
              <div className="stat-value text-lg text-primary">{marketStats.total}</div>
            </div>
            <div className="stat py-2">
              <div className="stat-title text-xs">Beneficiaries</div>
              <div className="stat-value text-lg">{(marketStats.totalBeneficiaries / 1000000).toFixed(1)}M</div>
            </div>
            <div className="stat py-2">
              <div className="stat-title text-xs">Program Savings</div>
              <div className="stat-value text-lg text-success">{formatCurrency(marketStats.totalSavings)}</div>
            </div>
            <div className="stat py-2">
              <div className="stat-title text-xs">Avg Quality</div>
              <div className="stat-value text-lg">{marketStats.avgQualScore.toFixed(0)}%</div>
            </div>
          </div>
        </div>
      )}
      <ACOResults />
    </div>
  );
}
