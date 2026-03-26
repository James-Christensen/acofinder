import React, { useState } from "react";
import axios from "axios";
import { FaSearch } from "react-icons/fa";

const NPPES_API = "https://npiregistry.cms.hhs.gov/api/?version=2.1";

export default function NPILookup({ practiceName }) {
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searched, setSearched] = useState(false);
  const [searchTerm, setSearchTerm] = useState(practiceName || "");

  const searchNPI = async () => {
    if (!searchTerm.trim()) return;
    setLoading(true);
    setSearched(true);
    try {
      const res = await axios.get(NPPES_API, {
        params: {
          organization_name: searchTerm,
          limit: 10,
          enumeration_type: "NPI-2",
        },
      });
      setResults(res.data.results || []);
    } catch (err) {
      console.error("NPI lookup failed:", err);
      setResults([]);
    }
    setLoading(false);
  };

  return (
    <div className="w-full">
      <div className="flex gap-2 mb-3">
        <input
          type="text"
          className="input input-bordered input-sm flex-1"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && searchNPI()}
          placeholder="Organization name..."
          aria-label="Search NPI registry"
        />
        <button
          className="btn btn-sm btn-primary"
          onClick={searchNPI}
          disabled={loading}
        >
          {loading ? (
            <span className="loading loading-spinner loading-xs"></span>
          ) : (
            <FaSearch />
          )}
        </button>
      </div>

      {searched && results.length === 0 && !loading && (
        <p className="text-sm opacity-50">No NPI results found for "{searchTerm}"</p>
      )}

      {results.length > 0 && (
        <div className="overflow-x-auto border rounded-lg">
          <table className="table table-compact w-full">
            <thead className="bg-base-200">
              <tr>
                <th>NPI</th>
                <th>Organization Name</th>
                <th>Taxonomy / Specialty</th>
                <th>City, State</th>
                <th>Phone</th>
              </tr>
            </thead>
            <tbody>
              {results.map((r) => {
                const addr =
                  r.addresses?.find((a) => a.address_purpose === "LOCATION") ||
                  r.addresses?.[0] ||
                  {};
                const taxonomy = r.taxonomies?.[0] || {};
                return (
                  <tr key={r.number} className="hover">
                    <td className="font-mono text-xs">{r.number}</td>
                    <td className="text-sm">
                      {r.basic?.organization_name || r.basic?.name || "N/A"}
                    </td>
                    <td className="text-xs">
                      {taxonomy.desc || "N/A"}
                      {taxonomy.primary && (
                        <span className="badge badge-xs badge-success ml-1">Primary</span>
                      )}
                    </td>
                    <td className="text-xs">
                      {addr.city}, {addr.state}
                    </td>
                    <td className="text-xs">{addr.telephone_number || "N/A"}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
