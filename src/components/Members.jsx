import React, { useState, useMemo } from "react";
import { FaChevronCircleUp, FaChevronCircleDown, FaSearch } from "react-icons/fa";

export default function Members({ members }) {
  const [search, setSearch] = useState("");
  const [sortAsc, setSortAsc] = useState(true);

  const filtered = useMemo(() => {
    let list = [...members];
    if (search) {
      const lower = search.toLowerCase();
      list = list.filter((m) => (m.par_lbn || "").toLowerCase().includes(lower));
    }
    list.sort((a, b) => {
      const cmp = (a.par_lbn || "").localeCompare(b.par_lbn || "");
      return sortAsc ? cmp : -cmp;
    });
    return list;
  }, [members, search, sortAsc]);

  if (members.length === 0) {
    return <p className="text-center py-5 opacity-60">No member practice data available.</p>;
  }

  return (
    <div className="w-full">
      <div className="flex justify-between items-center mb-3 gap-3 flex-wrap">
        <h3 className="text-lg font-semibold">
          Member Practices ({members.length})
        </h3>
        <div className="flex gap-2 items-center">
          <div className="relative">
            <FaSearch className="absolute left-3 top-3 text-xs opacity-40" />
            <input
              type="text"
              placeholder="Filter practices..."
              className="input input-bordered input-sm pl-8 w-48"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              aria-label="Filter member practices"
            />
          </div>
          <button
            className="btn btn-ghost btn-sm"
            onClick={() => setSortAsc(!sortAsc)}
            title={sortAsc ? "Sort Z-A" : "Sort A-Z"}
          >
            {sortAsc ? <FaChevronCircleUp /> : <FaChevronCircleDown />}
          </button>
        </div>
      </div>
      <div className="overflow-auto max-h-96 border border-info rounded-lg">
        <table className="table table-compact w-full">
          <thead className="sticky top-0 bg-base-200">
            <tr className="border-b border-info">
              <th className="normal-case w-16">#</th>
              <th className="normal-case">Practice Name</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((m, idx) => (
              <tr key={`${m.par_lbn}-${idx}`} className="hover border-b border-base-300">
                <td className="opacity-50">{idx + 1}</td>
                <td>{m.par_lbn}</td>
              </tr>
            ))}
            {filtered.length === 0 && (
              <tr>
                <td colSpan={2} className="text-center opacity-50 py-4">
                  No practices match "{search}"
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
      {search && (
        <p className="text-xs opacity-50 mt-1">
          Showing {filtered.length} of {members.length} practices
        </p>
      )}
    </div>
  );
}
