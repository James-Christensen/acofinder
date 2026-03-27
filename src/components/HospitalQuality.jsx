import React, { useState } from "react";
import { FaHospital, FaStar, FaRegStar, FaSearch } from "react-icons/fa";
import {
  fetchHospitalsForACO,
  parseStarRating,
  getReadmissionStatus,
} from "../utils/hospitalService";

function StarRating({ rating }) {
  if (rating === null) return <span className="text-xs opacity-50">N/A</span>;
  return (
    <div className="flex gap-0.5">
      {[1, 2, 3, 4, 5].map((star) => (
        <span key={star}>
          {star <= rating ? (
            <FaStar className="text-warning text-xs" />
          ) : (
            <FaRegStar className="text-base-300 text-xs" />
          )}
        </span>
      ))}
    </div>
  );
}

export default function HospitalQuality({ members }) {
  const [hospitals, setHospitals] = useState([]);
  const [loading, setLoading] = useState(false);
  const [fetched, setFetched] = useState(false);
  const [progress, setProgress] = useState({ done: 0, total: 0 });

  const loadHospitalData = async () => {
    setLoading(true);
    setFetched(true);

    try {
      const results = await fetchHospitalsForACO(members, (done, total) => {
        setProgress({ done, total });
      });
      setHospitals(results);
    } catch (err) {
      console.error("Hospital data fetch failed:", err);
    }
    setLoading(false);
  };

  const hospitalKeywords = [
    "hospital",
    "health system",
    "medical center",
    "health center",
    "clinic",
    "memorial",
  ];
  const hospitalMemberCount = members.filter((m) =>
    hospitalKeywords.some((kw) => m.par_lbn.toLowerCase().includes(kw))
  ).length;

  return (
    <div className="max-w-3xl mx-auto">
      <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
        <FaHospital className="text-primary" />
        Hospital Quality & Readmission Data
      </h3>
      <p className="text-sm opacity-60 mb-4">
        Search CMS hospital data for facilities associated with this ACO's member practices.
        Found {hospitalMemberCount} practice(s) with hospital-related names.
      </p>

      {!fetched && (
        <div className="text-center">
          <button
            className="btn btn-primary btn-sm"
            onClick={loadHospitalData}
            disabled={hospitalMemberCount === 0}
          >
            <FaSearch className="mr-2" />
            Load Hospital Data
          </button>
          {hospitalMemberCount === 0 && (
            <p className="text-xs opacity-50 mt-2">
              No member practices with hospital-related names found.
            </p>
          )}
        </div>
      )}

      {loading && (
        <div className="text-center py-5">
          <span className="loading loading-spinner loading-md text-primary"></span>
          <p className="text-sm mt-2">
            Searching {progress.done} of {progress.total} hospital-named practices...
          </p>
        </div>
      )}

      {fetched && !loading && hospitals.length === 0 && (
        <div className="alert alert-info">
          <span className="text-sm">
            No CMS hospital records found matching this ACO's member practices.
            This may mean the ACO's network is primarily physician practices.
          </span>
        </div>
      )}

      {hospitals.length > 0 && (
        <div className="overflow-x-auto border rounded-lg">
          <table className="table table-compact w-full">
            <thead className="bg-base-200">
              <tr>
                <th>Hospital</th>
                <th>Rating</th>
                <th>Type</th>
                <th>Location</th>
                <th>Readmission</th>
                <th>Emergency</th>
              </tr>
            </thead>
            <tbody>
              {hospitals.map((h, i) => {
                const stars = parseStarRating(
                  h.hospital_overall_rating || h.overall_rating
                );
                const readmission = getReadmissionStatus(h);
                return (
                  <tr key={i} className="hover">
                    <td className="text-xs font-semibold max-w-xs truncate">
                      {h.hospital_name || h.facility_name || "Unknown"}
                    </td>
                    <td>
                      <StarRating rating={stars} />
                    </td>
                    <td className="text-xs">
                      {h.hospital_type || h.facility_type || "N/A"}
                    </td>
                    <td className="text-xs">
                      {h.city}, {h.state}
                    </td>
                    <td>
                      <span className={`text-xs font-semibold ${readmission.color}`}>
                        {readmission.label}
                      </span>
                    </td>
                    <td className="text-xs">
                      {h.emergency_services === "Yes" ? (
                        <span className="badge badge-xs badge-success">Yes</span>
                      ) : (
                        <span className="badge badge-xs badge-ghost">No</span>
                      )}
                    </td>
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
