import React, { useContext, useState, useMemo } from "react";
import ACOContext from "../context/context";
import { formatCurrency, calculateARR } from "../utils/helpers";
import { Link } from "react-router-dom";

export default function Compare() {
  const { acos, loading, error, getMembersForAco } = useContext(ACOContext);
  const [selected, setSelected] = useState([]);
  const [search, setSearch] = useState("");

  const suggestions = useMemo(() => {
    if (search.length < 2) return [];
    const lower = search.toLowerCase();
    return acos
      .filter(
        (a) =>
          !selected.includes(a.aco_id) &&
          (a.aco_name.toLowerCase().includes(lower) ||
            a.aco_id.toLowerCase().includes(lower))
      )
      .slice(0, 6);
  }, [search, acos, selected]);

  const selectedAcos = useMemo(
    () => selected.map((id) => acos.find((a) => a.aco_id === id)).filter(Boolean),
    [selected, acos]
  );

  const addAco = (id) => {
    if (selected.length < 4 && !selected.includes(id)) {
      setSelected([...selected, id]);
    }
    setSearch("");
  };

  const removeAco = (id) => {
    setSelected(selected.filter((s) => s !== id));
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

  const metrics = [
    { label: "State", get: (a) => a.state },
    { label: "Risk Model", get: (a) => a.Risk_Model || "N/A" },
    { label: "Panel Size", get: (a) => a.panel > 0 ? a.panel.toLocaleString() : "N/A" },
    { label: "Member Practices", get: (a) => a.memberCount || getMembersForAco(a.aco_id).length || "N/A" },
    { label: "Quality Score", get: (a) => a.qualScore > 0 ? `${a.qualScore.toFixed(1)}%` : "N/A", highlight: true },
    { label: "Generated Savings", get: (a) => a.genSavings ? formatCurrency(a.genSavings) : "N/A" },
    { label: "Earned Savings", get: (a) => a.savings ? formatCurrency(a.savings) : "N/A", highlight: true },
    { label: "Savings Rate", get: (a) => a.Sav_Rate ? `${a.Sav_Rate}%` : "N/A" },
    { label: "Reporting Method", get: (a) => a.method || "N/A" },
    { label: "Est. ARR (50 PMPM)", get: (a) => a.panel > 0 ? formatCurrency(calculateARR(a.panel)) : "N/A" },
    { label: "Final Share Rate", get: (a) => a.FinalShareRate ? `${a.FinalShareRate}%` : "N/A" },
    { label: "ACO Executive", get: (a) => a.aco_exec_name || "N/A" },
    { label: "Executive Email", get: (a) => a.aco_exec_email || "N/A" },
  ];

  return (
    <div className="container mx-auto max-w-6xl px-2">
      <h1 className="text-2xl font-bold text-secondary mb-4">
        Compare ACOs Side-by-Side
      </h1>

      {/* Search to add */}
      <div className="relative mb-6 max-w-md">
        <input
          type="text"
          className="input input-bordered w-full"
          placeholder={
            selected.length >= 4
              ? "Maximum 4 ACOs selected"
              : "Search ACO to add..."
          }
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          disabled={selected.length >= 4}
          aria-label="Search ACOs to compare"
        />
        {suggestions.length > 0 && (
          <ul className="menu bg-base-200 rounded-box absolute z-50 w-full mt-1 shadow-lg">
            {suggestions.map((s) => (
              <li key={s.aco_id}>
                <button type="button" onClick={() => addAco(s.aco_id)} className="text-left">
                  <span className="badge badge-outline badge-sm">{s.aco_id}</span>
                  <span className="text-sm">{s.aco_name}</span>
                  <span className="text-xs opacity-60">{s.state}</span>
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>

      {/* Selected tags */}
      {selected.length > 0 && (
        <div className="flex gap-2 mb-4 flex-wrap">
          {selectedAcos.map((aco) => (
            <div key={aco.aco_id} className="badge badge-lg badge-info gap-1">
              {aco.aco_id} - {aco.aco_name.slice(0, 30)}
              <button
                className="btn btn-ghost btn-xs px-1"
                onClick={() => removeAco(aco.aco_id)}
              >
                x
              </button>
            </div>
          ))}
        </div>
      )}

      {selected.length === 0 ? (
        <div className="text-center py-20 opacity-50">
          <p className="text-lg mb-2">Select 2-4 ACOs to compare</p>
          <p className="text-sm">Search above to add ACOs to the comparison</p>
        </div>
      ) : selected.length === 1 ? (
        <div className="text-center py-10 opacity-50">
          <p>Add at least one more ACO to compare</p>
        </div>
      ) : (
        <div className="overflow-x-auto border border-info rounded-lg">
          <table className="table w-full">
            <thead className="bg-base-200">
              <tr>
                <th className="min-w-[140px]">Metric</th>
                {selectedAcos.map((aco) => (
                  <th key={aco.aco_id} className="text-center min-w-[160px]">
                    <Link to={`/aco/${aco.aco_id}`} className="link link-primary text-sm">
                      {aco.aco_name.slice(0, 30)}
                    </Link>
                    <br />
                    <span className="text-xs opacity-50">{aco.aco_id}</span>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {metrics.map((m) => (
                <tr key={m.label} className={m.highlight ? "bg-base-200" : "hover"}>
                  <td className="font-medium text-sm">{m.label}</td>
                  {selectedAcos.map((aco) => (
                    <td key={aco.aco_id} className="text-center">
                      {m.get(aco)}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
