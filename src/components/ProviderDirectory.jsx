import React, { useState, useContext } from "react";
import { FaSearch, FaHospital } from "react-icons/fa";
import ACOContext from "../context/context";
import { enrichACOMembers, aggregateProviderStats } from "../utils/nppesService";

export default function ProviderDirectory({ members, acoId }) {
  const { getNpiCache, setNpiCacheForAco } = useContext(ACOContext);

  const cached = getNpiCache(acoId);
  const [enrichedData, setEnrichedData] = useState(cached?.enriched || null);
  const [stats, setStats] = useState(cached?.stats || null);
  const [loading, setLoading] = useState(false);
  const [progress, setProgress] = useState({ done: 0, total: 0 });

  const fetchProviderData = async () => {
    setLoading(true);
    setProgress({ done: 0, total: members.length });

    try {
      const enriched = await enrichACOMembers(members, (done, total) => {
        setProgress({ done, total });
      });
      const providerStats = aggregateProviderStats(enriched);

      setEnrichedData(enriched);
      setStats(providerStats);
      setNpiCacheForAco(acoId, { enriched, stats: providerStats });
    } catch (err) {
      console.error("Provider enrichment failed:", err);
    }
    setLoading(false);
  };

  if (!members || members.length === 0) {
    return null;
  }

  return (
    <div className="my-5">
      <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
        <FaHospital className="text-primary" />
        Provider Network Intelligence
      </h3>
      <p className="text-sm opacity-60 mb-4">
        Enrich member practices with NPPES registry data to see specialty mix,
        NPI counts, and geographic spread.
      </p>

      {!stats && !loading && (
        <div className="text-center">
          <button
            className="btn btn-primary btn-sm"
            onClick={fetchProviderData}
          >
            <FaSearch className="mr-2" />
            Fetch Provider Data ({members.length} practices)
          </button>
          <p className="text-xs opacity-50 mt-2">
            This queries the NPPES registry for each practice. May take a few minutes.
          </p>
        </div>
      )}

      {loading && (
        <div className="text-center py-5">
          <span className="loading loading-spinner loading-md text-primary"></span>
          <p className="text-sm mt-2">
            Looking up {progress.done} of {progress.total} practices...
          </p>
          <progress
            className="progress progress-primary w-64 mx-auto mt-2"
            value={progress.done}
            max={progress.total}
          ></progress>
        </div>
      )}

      {stats && (
        <div>
          {/* Aggregate Stats */}
          <div className="stats stats-vertical sm:stats-horizontal shadow w-full mb-5">
            <div className="stat">
              <div className="stat-title">Total NPIs Found</div>
              <div className="stat-value text-primary text-2xl">{stats.totalNPIs}</div>
              <div className="stat-desc">
                {stats.practicesWithNPI} of {stats.practicesTotal} matched
              </div>
            </div>
            <div className="stat">
              <div className="stat-title">Specialties</div>
              <div className="stat-value text-2xl">
                {stats.specialtyBreakdown.length}
              </div>
              <div className="stat-desc">Unique taxonomy types</div>
            </div>
            <div className="stat">
              <div className="stat-title">Geographic Spread</div>
              <div className="stat-value text-2xl">
                {stats.geographicSpread.length}
              </div>
              <div className="stat-desc">
                States: {stats.geographicSpread.slice(0, 5).join(", ")}
                {stats.geographicSpread.length > 5 && "..."}
              </div>
            </div>
          </div>

          {/* Specialty Breakdown */}
          {stats.specialtyBreakdown.length > 0 && (
            <div className="card bg-base-100 shadow border mb-5">
              <div className="card-body p-4">
                <h4 className="text-sm font-semibold mb-3">
                  Top Specialties
                </h4>
                <div className="space-y-2">
                  {stats.specialtyBreakdown.slice(0, 10).map(([specialty, count]) => (
                    <div key={specialty} className="flex items-center gap-2">
                      <div className="w-full bg-base-300 rounded-full h-4 flex-1">
                        <div
                          className="bg-primary h-4 rounded-full"
                          style={{
                            width: `${Math.min(
                              (count / stats.specialtyBreakdown[0][1]) * 100,
                              100
                            )}%`,
                          }}
                        ></div>
                      </div>
                      <span className="text-xs w-8 text-right font-bold">
                        {count}
                      </span>
                      <span className="text-xs w-48 truncate" title={specialty}>
                        {specialty}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Enriched Practice Table */}
          <div className="card bg-base-100 shadow border">
            <div className="card-body p-4">
              <h4 className="text-sm font-semibold mb-3">
                Practice Details ({enrichedData.filter((m) => m.npiData?.length > 0).length} with NPI data)
              </h4>
              <div className="overflow-x-auto max-h-96">
                <table className="table table-compact w-full">
                  <thead className="bg-base-200 sticky top-0">
                    <tr>
                      <th>Practice Name</th>
                      <th>NPIs</th>
                      <th>Primary Specialty</th>
                      <th>Location</th>
                      <th>Phone</th>
                    </tr>
                  </thead>
                  <tbody>
                    {enrichedData
                      .filter((m) => m.npiData?.length > 0)
                      .map((m, i) => {
                        const npi = m.npiData[0];
                        const addr =
                          npi?.addresses?.find(
                            (a) => a.address_purpose === "LOCATION"
                          ) || npi?.addresses?.[0];
                        const taxonomy = npi?.taxonomies?.[0];
                        return (
                          <tr key={i} className="hover">
                            <td className="text-xs">{m.par_lbn}</td>
                            <td className="text-xs font-mono">
                              {m.npiData.length}
                            </td>
                            <td className="text-xs">
                              {taxonomy?.desc || "N/A"}
                            </td>
                            <td className="text-xs">
                              {addr?.city}, {addr?.state}
                            </td>
                            <td className="text-xs">
                              {addr?.telephone_number || "N/A"}
                            </td>
                          </tr>
                        );
                      })}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
