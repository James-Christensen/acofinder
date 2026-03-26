import React from "react";
import { parseNumericString } from "../utils/helpers";

export default function ProviderComposition({ aco }) {
  const nPCP = parseNumericString(aco.N_PCP);
  const nSpec = parseNumericString(aco.N_Spec);
  const nNP = parseNumericString(aco.N_NP);
  const nPA = parseNumericString(aco.N_PA);
  const total = nPCP + nSpec + nNP + nPA;

  if (total === 0) return null;

  const segments = [
    { label: "Primary Care", count: nPCP, color: "bg-primary" },
    { label: "Specialists", count: nSpec, color: "bg-secondary" },
    { label: "Nurse Practitioners", count: nNP, color: "bg-accent" },
    { label: "Physician Assistants", count: nPA, color: "bg-info" },
  ].filter((s) => s.count > 0);

  return (
    <div className="w-full max-w-3xl mx-auto my-6">
      <h3 className="text-lg font-semibold mb-3">Provider Composition</h3>

      {/* Bar chart */}
      <div className="flex w-full h-8 rounded-lg overflow-hidden mb-3">
        {segments.map((seg) => (
          <div
            key={seg.label}
            className={`${seg.color} flex items-center justify-center text-xs font-bold`}
            style={{ width: `${(seg.count / total) * 100}%` }}
            title={`${seg.label}: ${seg.count}`}
          >
            {(seg.count / total) * 100 > 10 ? `${Math.round((seg.count / total) * 100)}%` : ""}
          </div>
        ))}
      </div>

      {/* Legend */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {segments.map((seg) => (
          <div key={seg.label} className="flex items-center gap-2">
            <div className={`w-3 h-3 rounded ${seg.color}`}></div>
            <div className="text-sm">
              <span className="font-medium">{seg.count.toLocaleString()}</span>{" "}
              <span className="opacity-70">{seg.label}</span>
            </div>
          </div>
        ))}
      </div>

      <p className="text-sm opacity-50 mt-2">
        Total providers: {total.toLocaleString()} |
        PCP ratio: {total > 0 ? Math.round((nPCP / total) * 100) : 0}%
      </p>
    </div>
  );
}
