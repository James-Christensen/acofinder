import React, { useState, useContext, useMemo, useCallback } from "react";
import { Link } from "react-router-dom";
import ACOContext from "../context/context";
import { FaDownload, FaFilter, FaSortUp, FaSortDown, FaChevronLeft, FaChevronRight } from "react-icons/fa";
import { cleanAcoName, formatCurrency, openInNewTab, exportToCSV } from "../utils/helpers";

const PAGE_SIZE = 50;

export default function Table() {
  const {
    acos,
    loading,
    error,
    allStates,
    allRiskModels,
    allReportingMethods,
    CURRENT_YEAR,
  } = useContext(ACOContext);

  const [sortCol, setSortCol] = useState("aco_name");
  const [sortAsc, setSortAsc] = useState(true);
  const [page, setPage] = useState(0);
  const [showFilters, setShowFilters] = useState(false);

  // Filters
  const [filterState, setFilterState] = useState("");
  const [filterRiskModel, setFilterRiskModel] = useState("");
  const [filterMethod, setFilterMethod] = useState("");
  const [filterMinPanel, setFilterMinPanel] = useState("");
  const [filterMaxPanel, setFilterMaxPanel] = useState("");
  const [filterMinQual, setFilterMinQual] = useState("");
  const [filterSavingsOnly, setFilterSavingsOnly] = useState(false);
  const [filterLossOnly, setFilterLossOnly] = useState(false);
  const [includeNoPerf, setIncludeNoPerf] = useState(true);
  const [nameSearch, setNameSearch] = useState("");

  const filtered = useMemo(() => {
    let list = [...acos];

    if (nameSearch) {
      const lower = nameSearch.toLowerCase();
      list = list.filter(
        (a) =>
          a.aco_name.toLowerCase().includes(lower) ||
          a.aco_id.toLowerCase().includes(lower)
      );
    }
    if (filterState) list = list.filter((a) => a.state === filterState);
    if (filterRiskModel) list = list.filter((a) => a.Risk_Model === filterRiskModel);
    if (filterMethod) list = list.filter((a) => a.method === filterMethod);
    if (filterMinPanel) list = list.filter((a) => a.panel >= parseInt(filterMinPanel));
    if (filterMaxPanel) list = list.filter((a) => a.panel <= parseInt(filterMaxPanel));
    if (filterMinQual) list = list.filter((a) => a.qualScore >= parseFloat(filterMinQual));
    if (filterSavingsOnly) list = list.filter((a) => a.savings > 0);
    if (filterLossOnly) list = list.filter((a) => a.savings < 0);
    if (!includeNoPerf) list = list.filter((a) => a.hasPerformanceData);

    return list;
  }, [
    acos, nameSearch, filterState, filterRiskModel, filterMethod,
    filterMinPanel, filterMaxPanel, filterMinQual,
    filterSavingsOnly, filterLossOnly, includeNoPerf,
  ]);

  const sorted = useMemo(() => {
    return [...filtered].sort((a, b) => {
      let cmp = 0;
      switch (sortCol) {
        case "aco_id":
          cmp = (a.aco_id || "").localeCompare(b.aco_id || "");
          break;
        case "aco_name":
          cmp = (a.aco_name || "").localeCompare(b.aco_name || "");
          break;
        case "state":
          cmp = (a.state || "").localeCompare(b.state || "");
          break;
        case "panel":
          cmp = (a.panel || 0) - (b.panel || 0);
          break;
        case "savings":
          cmp = (a.savings || 0) - (b.savings || 0);
          break;
        case "qualScore":
          cmp = (a.qualScore || 0) - (b.qualScore || 0);
          break;
        case "method":
          cmp = (a.method || "").localeCompare(b.method || "");
          break;
        case "memberCount":
          cmp = (a.memberCount || 0) - (b.memberCount || 0);
          break;
        default:
          cmp = 0;
      }
      return sortAsc ? cmp : -cmp;
    });
  }, [filtered, sortCol, sortAsc]);

  const totalPages = Math.ceil(sorted.length / PAGE_SIZE);
  const pageData = sorted.slice(page * PAGE_SIZE, (page + 1) * PAGE_SIZE);

  const handleSort = useCallback(
    (col) => {
      if (sortCol === col) {
        setSortAsc(!sortAsc);
      } else {
        setSortCol(col);
        setSortAsc(true);
      }
      setPage(0);
    },
    [sortCol, sortAsc]
  );

  const SortIcon = ({ col }) => {
    if (sortCol !== col) return null;
    return sortAsc ? (
      <FaSortUp className="inline ml-1" />
    ) : (
      <FaSortDown className="inline ml-1" />
    );
  };

  const clearFilters = () => {
    setFilterState("");
    setFilterRiskModel("");
    setFilterMethod("");
    setFilterMinPanel("");
    setFilterMaxPanel("");
    setFilterMinQual("");
    setFilterSavingsOnly(false);
    setFilterLossOnly(false);
    setIncludeNoPerf(true);
    setNameSearch("");
    setPage(0);
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
    <div className="container mx-auto px-2">
      {/* Header */}
      <div className="flex justify-between items-center mb-4 flex-wrap gap-3">
        <h1 className="text-2xl font-bold text-secondary">
          {CURRENT_YEAR} ACOs ({filtered.length})
        </h1>
        <div className="flex gap-2">
          <button
            className={`btn btn-sm ${showFilters ? "btn-primary" : "btn-outline"}`}
            onClick={() => setShowFilters(!showFilters)}
          >
            <FaFilter className="mr-1" /> Filters
          </button>
          <button
            className="btn btn-sm btn-outline btn-success"
            onClick={() =>
              exportToCSV(filtered, `aco-data-${CURRENT_YEAR}.csv`)
            }
          >
            <FaDownload className="mr-1" /> Export CSV
          </button>
        </div>
      </div>

      {/* Filter Panel */}
      {showFilters && (
        <div className="bg-base-200 p-4 rounded-lg mb-4">
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
            <div>
              <label className="label label-text text-xs">Name/ID</label>
              <input
                type="text"
                className="input input-bordered input-sm w-full"
                placeholder="Search..."
                value={nameSearch}
                onChange={(e) => { setNameSearch(e.target.value); setPage(0); }}
              />
            </div>
            <div>
              <label className="label label-text text-xs">State</label>
              <select
                className="select select-bordered select-sm w-full"
                value={filterState}
                onChange={(e) => { setFilterState(e.target.value); setPage(0); }}
              >
                <option value="">All States</option>
                {allStates.map((s) => (
                  <option key={s} value={s}>{s}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="label label-text text-xs">Risk Model</label>
              <select
                className="select select-bordered select-sm w-full"
                value={filterRiskModel}
                onChange={(e) => { setFilterRiskModel(e.target.value); setPage(0); }}
              >
                <option value="">All Models</option>
                {allRiskModels.map((m) => (
                  <option key={m} value={m}>{m}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="label label-text text-xs">Reporting</label>
              <select
                className="select select-bordered select-sm w-full"
                value={filterMethod}
                onChange={(e) => { setFilterMethod(e.target.value); setPage(0); }}
              >
                <option value="">All Methods</option>
                {allReportingMethods.map((m) => (
                  <option key={m} value={m}>{m}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="label label-text text-xs">Min Panel</label>
              <input
                type="number"
                className="input input-bordered input-sm w-full"
                placeholder="0"
                value={filterMinPanel}
                onChange={(e) => { setFilterMinPanel(e.target.value); setPage(0); }}
              />
            </div>
            <div>
              <label className="label label-text text-xs">Min Quality</label>
              <input
                type="number"
                className="input input-bordered input-sm w-full"
                placeholder="0"
                value={filterMinQual}
                onChange={(e) => { setFilterMinQual(e.target.value); setPage(0); }}
              />
            </div>
          </div>
          <div className="flex gap-4 mt-3 flex-wrap items-center">
            <label className="label cursor-pointer gap-2">
              <input
                type="checkbox"
                className="checkbox checkbox-sm checkbox-success"
                checked={filterSavingsOnly}
                onChange={(e) => { setFilterSavingsOnly(e.target.checked); setFilterLossOnly(false); setPage(0); }}
              />
              <span className="label-text text-xs">Savings only</span>
            </label>
            <label className="label cursor-pointer gap-2">
              <input
                type="checkbox"
                className="checkbox checkbox-sm checkbox-error"
                checked={filterLossOnly}
                onChange={(e) => { setFilterLossOnly(e.target.checked); setFilterSavingsOnly(false); setPage(0); }}
              />
              <span className="label-text text-xs">Losses only</span>
            </label>
            <label className="label cursor-pointer gap-2">
              <input
                type="checkbox"
                className="checkbox checkbox-sm checkbox-primary"
                checked={includeNoPerf}
                onChange={(e) => { setIncludeNoPerf(e.target.checked); setPage(0); }}
              />
              <span className="label-text text-xs">Include ACOs without performance data</span>
            </label>
            <button className="btn btn-ghost btn-xs" onClick={clearFilters}>
              Clear All
            </button>
          </div>
        </div>
      )}

      {/* Table */}
      <div className="overflow-x-auto border border-info rounded-lg">
        <table className="table table-compact w-full">
          <thead className="sticky top-0 bg-base-200 z-10">
            <tr className="border-b border-info">
              <th className="cursor-pointer hover:bg-base-300" onClick={() => handleSort("aco_id")}>
                ID <SortIcon col="aco_id" />
              </th>
              <th className="cursor-pointer hover:bg-base-300" onClick={() => handleSort("aco_name")}>
                Name <SortIcon col="aco_name" />
              </th>
              <th className="cursor-pointer hover:bg-base-300" onClick={() => handleSort("state")}>
                State <SortIcon col="state" />
              </th>
              <th className="cursor-pointer hover:bg-base-300" onClick={() => handleSort("panel")}>
                Panel <SortIcon col="panel" />
              </th>
              <th className="cursor-pointer hover:bg-base-300" onClick={() => handleSort("qualScore")}>
                Quality <SortIcon col="qualScore" />
              </th>
              <th className="cursor-pointer hover:bg-base-300" onClick={() => handleSort("savings")}>
                Savings <SortIcon col="savings" />
              </th>
              <th className="cursor-pointer hover:bg-base-300" onClick={() => handleSort("method")}>
                Method <SortIcon col="method" />
              </th>
              <th className="cursor-pointer hover:bg-base-300" onClick={() => handleSort("memberCount")}>
                Members <SortIcon col="memberCount" />
              </th>
              <th>Website</th>
            </tr>
          </thead>
          <tbody>
            {pageData.map((aco) => (
              <tr key={aco.aco_id} className="hover border-b border-base-300">
                <td className="font-mono text-xs">{aco.aco_id}</td>
                <td>
                  <Link to={`/aco/${aco.aco_id}`} className="link link-primary text-sm">
                    {cleanAcoName(aco.aco_name, 45)}
                  </Link>
                </td>
                <td>{aco.state}</td>
                <td className="text-right">{aco.panel > 0 ? aco.panel.toLocaleString() : "-"}</td>
                <td className="text-right">
                  {aco.qualScore > 0 ? (
                    <span className={aco.qualScore >= 80 ? "text-success" : aco.qualScore >= 50 ? "text-warning" : "text-error"}>
                      {aco.qualScore.toFixed(1)}%
                    </span>
                  ) : "-"}
                </td>
                <td className="text-right">
                  {aco.savings !== 0 ? (
                    <span className={aco.savings > 0 ? "text-success" : "text-error"}>
                      {formatCurrency(aco.savings)}
                    </span>
                  ) : "-"}
                </td>
                <td className="text-xs">{aco.method !== "N/A" ? aco.method : "-"}</td>
                <td className="text-right">{aco.memberCount || "-"}</td>
                <td>
                  {aco.aco_public_reporting_website && (
                    <button
                      className="btn btn-outline btn-xs text-info normal-case"
                      onClick={() => openInNewTab(aco.aco_public_reporting_website)}
                    >
                      Visit
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className="flex justify-between items-center mt-3 mb-6">
        <p className="text-sm opacity-60">
          Showing {page * PAGE_SIZE + 1}-{Math.min((page + 1) * PAGE_SIZE, sorted.length)} of {sorted.length} ACOs
        </p>
        <div className="btn-group">
          <button
            className="btn btn-sm"
            disabled={page === 0}
            onClick={() => setPage(page - 1)}
          >
            <FaChevronLeft />
          </button>
          {Array.from({ length: Math.min(totalPages, 7) }, (_, i) => {
            let pageNum;
            if (totalPages <= 7) {
              pageNum = i;
            } else if (page < 4) {
              pageNum = i;
            } else if (page > totalPages - 5) {
              pageNum = totalPages - 7 + i;
            } else {
              pageNum = page - 3 + i;
            }
            return (
              <button
                key={pageNum}
                className={`btn btn-sm ${page === pageNum ? "btn-active" : ""}`}
                onClick={() => setPage(pageNum)}
              >
                {pageNum + 1}
              </button>
            );
          })}
          <button
            className="btn btn-sm"
            disabled={page >= totalPages - 1}
            onClick={() => setPage(page + 1)}
          >
            <FaChevronRight />
          </button>
        </div>
      </div>

      <p className="text-sm text-success pb-2 italic text-center">
        Click an ACO Name to view details
      </p>
    </div>
  );
}
