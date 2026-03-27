import React, { useState } from "react";
import {
  ComposableMap,
  Geographies,
  Geography,
} from "react-simple-maps";
import { getStateCode } from "../utils/stateCodeMap";
import { formatCurrency } from "../utils/helpers";

const GEO_URL = "https://cdn.jsdelivr.net/npm/us-atlas@3/states-10m.json";

// Color interpolation from light to dark based on value
function getColor(value, max, metric) {
  if (!value || max === 0) return "#e5e7eb"; // gray-200

  const ratio = Math.min(value / max, 1);

  if (metric === "savings") {
    // Green for positive, red for negative
    if (value < 0) {
      const r = Math.round(254 - ratio * 100);
      return `rgb(${r}, 100, 100)`;
    }
    const g = Math.round(120 + ratio * 100);
    return `rgb(60, ${g}, 80)`;
  }

  // Default: blue gradient
  const intensity = Math.round(50 + ratio * 180);
  return `rgb(${Math.round(60 - ratio * 30)}, ${Math.round(120 - ratio * 50)}, ${intensity})`;
}

export default function USStateMap({ data, metric = "count" }) {
  const [tooltip, setTooltip] = useState(null);

  // Calculate max value for color scaling
  const values = Object.values(data)
    .map((d) => Math.abs(d[metric] || 0))
    .filter(Boolean);
  const maxValue = Math.max(...values, 1);

  return (
    <div className="relative">
      <ComposableMap
        projection="geoAlbersUsa"
        projectionConfig={{ scale: 1000 }}
        width={800}
        height={500}
        style={{ width: "100%", height: "auto" }}
      >
        <Geographies geography={GEO_URL}>
          {({ geographies }) =>
            geographies.map((geo) => {
              const stateCode = getStateCode(geo.properties.name);
              const stateInfo = data[stateCode];
              const value = stateInfo ? stateInfo[metric] : 0;

              return (
                <Geography
                  key={geo.rsmKey}
                  geography={geo}
                  fill={getColor(value, maxValue, metric)}
                  stroke="#fff"
                  strokeWidth={0.5}
                  onMouseEnter={() => {
                    setTooltip({
                      name: geo.properties.name,
                      code: stateCode,
                      value,
                      data: stateInfo,
                    });
                  }}
                  onMouseLeave={() => setTooltip(null)}
                  style={{
                    default: { outline: "none" },
                    hover: { outline: "none", fill: "#fbbf24" },
                    pressed: { outline: "none" },
                  }}
                />
              );
            })
          }
        </Geographies>
      </ComposableMap>

      {/* Tooltip */}
      {tooltip && (
        <div className="absolute top-2 right-2 bg-base-100 shadow-lg rounded-lg p-3 text-sm border z-10 min-w-48">
          <div className="font-bold text-primary">{tooltip.name}</div>
          {tooltip.data ? (
            <div className="mt-1 space-y-0.5">
              <div className="flex justify-between">
                <span className="opacity-70">ACOs:</span>
                <span className="font-semibold">{tooltip.data.count}</span>
              </div>
              <div className="flex justify-between">
                <span className="opacity-70">Beneficiaries:</span>
                <span className="font-semibold">
                  {tooltip.data.beneficiaries?.toLocaleString()}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="opacity-70">Net Savings:</span>
                <span
                  className={`font-semibold ${
                    tooltip.data.savings > 0
                      ? "text-success"
                      : tooltip.data.savings < 0
                      ? "text-error"
                      : ""
                  }`}
                >
                  {formatCurrency(tooltip.data.savings)}
                </span>
              </div>
              {tooltip.data.avgQualScore > 0 && (
                <div className="flex justify-between">
                  <span className="opacity-70">Avg Quality:</span>
                  <span className="font-semibold">
                    {tooltip.data.avgQualScore}%
                  </span>
                </div>
              )}
              {tooltip.data.maPenetration && (
                <div className="flex justify-between">
                  <span className="opacity-70">MA Penetration:</span>
                  <span className="font-semibold">
                    {tooltip.data.maPenetration}%
                  </span>
                </div>
              )}
            </div>
          ) : (
            <div className="text-xs opacity-50 mt-1">No ACO data</div>
          )}
        </div>
      )}

      {/* Legend */}
      <div className="flex justify-center gap-2 mt-2 text-xs">
        <span className="opacity-50">Low</span>
        <div
          className="w-32 h-3 rounded"
          style={{
            background:
              metric === "savings"
                ? "linear-gradient(to right, rgb(254,100,100), #e5e7eb, rgb(60,220,80))"
                : "linear-gradient(to right, #e5e7eb, rgb(30,70,230))",
          }}
        ></div>
        <span className="opacity-50">High</span>
      </div>
    </div>
  );
}
