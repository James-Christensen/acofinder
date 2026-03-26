import React, { useState, useContext, useMemo, useCallback } from "react";
import ACOContext from "../context/context";
import ACO from "./ACO";
import { West, SouthEast, NorthEast } from "../data";
import { getStateFromAddress } from "../utils/helpers";

export default function ACOResults() {
  const { acos, loading, error: globalError, searchAcos, bookmarkedAcos } = useContext(ACOContext);
  const [results, setResults] = useState([]);
  const [selectValue, setSelect] = useState("None");
  const [keyword, setKeyword] = useState("");
  const [searchError, setSearchError] = useState(false);
  const [searching, setSearching] = useState(false);
  const [sortBy, setSortBy] = useState("name");
  const [showBookmarks, setShowBookmarks] = useState(false);

  const filterByRegion = useCallback(
    (region) => {
      return acos.filter((aco) => region.includes(aco.state));
    },
    [acos]
  );

  const selectRegion = (e) => {
    const value = e.target.value;
    setSelect(value);
    setShowBookmarks(false);
    let display;
    switch (value) {
      case "West":
        display = filterByRegion(West);
        break;
      case "NorthEast":
        display = filterByRegion(NorthEast);
        break;
      case "SouthEast":
        display = filterByRegion(SouthEast);
        break;
      case "All":
        display = acos;
        break;
      default:
        display = [];
    }
    setResults(display);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!keyword.trim()) return;
    setSearching(true);
    setShowBookmarks(false);
    const data = await searchAcos(keyword);
    if (data.length === 0) {
      setSearchError(true);
      setTimeout(() => setSearchError(false), 3000);
    } else {
      setResults(data);
    }
    setKeyword("");
    setSearching(false);
  };

  const sortedResults = useMemo(() => {
    const list = showBookmarks ? bookmarkedAcos : results;
    return [...list].sort((a, b) => {
      if (sortBy === "state") {
        const stateA = a.state || getStateFromAddress(a.aco_address);
        const stateB = b.state || getStateFromAddress(b.aco_address);
        return stateA.localeCompare(stateB);
      }
      return (a.aco_name || "").localeCompare(b.aco_name || "");
    });
  }, [results, sortBy, showBookmarks, bookmarkedAcos]);

  // Autocomplete suggestions
  const suggestions = useMemo(() => {
    if (keyword.length < 2) return [];
    const lower = keyword.toLowerCase();
    return acos
      .filter(
        (a) =>
          a.aco_name.toLowerCase().includes(lower) ||
          a.aco_id.toLowerCase().includes(lower)
      )
      .slice(0, 8);
  }, [keyword, acos]);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[200px]">
        <span className="loading loading-spinner loading-lg text-primary"></span>
      </div>
    );
  }

  if (globalError) {
    return (
      <div className="alert alert-error shadow-lg max-w-lg mx-auto">
        <span>{globalError}</span>
      </div>
    );
  }

  return (
    <>
      <div className="container mx-auto w-5/6">
        <p className="text-primary-content text-sm sm:text-left text-center mb-5">
          Search for ACOs by name, ID, or keyword. Or select a region to browse.
        </p>
      </div>
      <div className="container mx-auto w-5/6 flex flex-col md:flex-row gap-3">
        <div className="w-full flex-row relative">
          <form onSubmit={handleSubmit}>
            <div className="flex gap-2">
              <input
                value={keyword}
                onChange={(e) => setKeyword(e.target.value)}
                type="text"
                placeholder="Search ACO name or ID..."
                className="input input-bordered input-success flex-1"
                aria-label="Search ACOs"
              />
              <button
                type="submit"
                className="btn btn-primary"
                disabled={searching}
              >
                {searching ? (
                  <span className="loading loading-spinner loading-sm"></span>
                ) : (
                  "Search"
                )}
              </button>
            </div>
          </form>
          {suggestions.length > 0 && keyword.length >= 2 && (
            <ul className="menu bg-base-200 rounded-box absolute z-50 w-full mt-1 shadow-lg max-h-64 overflow-auto">
              {suggestions.map((s) => (
                <li key={s.aco_id}>
                  <button
                    type="button"
                    onClick={() => {
                      setResults([s]);
                      setKeyword("");
                      setShowBookmarks(false);
                    }}
                    className="text-left"
                  >
                    <span className="badge badge-outline badge-sm">{s.aco_id}</span>
                    <span className="text-sm">{s.aco_name}</span>
                    <span className="text-xs opacity-60">{s.state}</span>
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>
        <div className="flex gap-2 items-center">
          <div className="flex gap-3">
            <label className="label cursor-pointer gap-2">
              <span className="label-text text-xs">Name</span>
              <input
                type="radio"
                name="sort"
                className="radio radio-sm checked:bg-primary"
                checked={sortBy === "name"}
                onChange={() => setSortBy("name")}
              />
            </label>
            <label className="label cursor-pointer gap-2">
              <span className="label-text text-xs">State</span>
              <input
                type="radio"
                name="sort"
                className="radio radio-sm checked:bg-primary"
                checked={sortBy === "state"}
                onChange={() => setSortBy("state")}
              />
            </label>
          </div>
          <select
            value={selectValue}
            onChange={selectRegion}
            className="select select-success select-sm"
            aria-label="Filter by region"
          >
            <option value="None">Select a Region</option>
            <option value="All">All</option>
            <option value="West">West</option>
            <option value="NorthEast">North East</option>
            <option value="SouthEast">South East</option>
          </select>
          <button
            className={`btn btn-sm ${showBookmarks ? "btn-warning" : "btn-outline btn-warning"}`}
            onClick={() => {
              setShowBookmarks(!showBookmarks);
              if (!showBookmarks) setResults([]);
            }}
            title="Show bookmarked ACOs"
          >
            ★ {bookmarkedAcos.length}
          </button>
        </div>
      </div>
      <div className="container mx-auto w-5/6 pt-5">
        {searchError && (
          <div className="flex">
            <div className="alert alert-error shadow-lg w-10/12 lg:w-96 mx-auto py-3 my-2">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="stroke-current flex-shrink-0 h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
              <span>No Results Found. Please Search Again.</span>
            </div>
          </div>
        )}
        {showBookmarks && bookmarkedAcos.length === 0 && (
          <p className="text-center text-sm text-base-content/60 my-4">
            No bookmarked ACOs yet. Click the ★ on any ACO card to bookmark it.
          </p>
        )}
        <div
          className={
            sortedResults.length > 1
              ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 my-3"
              : "grid grid-cols-1"
          }
        >
          {sortedResults.map((i) => (
            <ACO
              key={i.aco_id}
              aco={i}
            />
          ))}
        </div>
      </div>
    </>
  );
}
