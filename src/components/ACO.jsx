import React, { useContext } from "react";
import { Link } from "react-router-dom";
import ACOContext from "../context/context";
import { openInNewTab, getStateFromAddress } from "../utils/helpers";
import { getSalesPriorityLabel, getSalesPriorityColor } from "../utils/salesPriority";

export default function ACO({ aco }) {
  const { toggleBookmark, bookmarks } = useContext(ACOContext);
  const state = aco.state || getStateFromAddress(aco.aco_address);
  const bookmarked = bookmarks.includes(aco.aco_id);

  return (
    <div className="card card-bordered h-72 shadow-md compact side bg-base-100 hover:bg-base-300 hover:border-info hover:shadow-lg hover:shadow-primary-focus p-2 pb-4 relative">
      <button
        className={`absolute top-2 right-2 btn btn-ghost btn-xs ${bookmarked ? "text-warning" : "text-base-content/30"}`}
        onClick={(e) => {
          e.preventDefault();
          e.stopPropagation();
          toggleBookmark(aco.aco_id);
        }}
        title={bookmarked ? "Remove bookmark" : "Bookmark this ACO"}
      >
        {bookmarked ? "★" : "☆"}
      </button>
      <Link to={`/aco/${aco.aco_id}`}>
        <div className="flex-row items-center space-x-4 card-body">
          <div className="badge badge-info badge-outline">{aco.aco_id}</div>
          {aco.hasPerformanceData && (
            <div className={`badge badge-sm ${aco.savings > 0 ? "badge-success" : aco.savings < 0 ? "badge-error" : "badge-ghost"}`}>
              {aco.savings > 0 ? "Savings" : aco.savings < 0 ? "Loss" : ""}
            </div>
          )}
          {/* Sales Priority Badge */}
          {aco.salesPriority > 0 && (
            <div className={`badge badge-sm ${getSalesPriorityColor(aco.salesPriority)}`}>
              {getSalesPriorityLabel(aco.salesPriority)} ({aco.salesPriority})
            </div>
          )}
          {/* ACO REACH Badge */}
          {aco.isReach && (
            <div className="badge badge-sm badge-accent">ACO REACH</div>
          )}
        </div>
        <h2 className="card-title pl-4 text-sm">{aco.aco_name}</h2>
        <p className="pl-4">State: {state}</p>
        {aco.panel > 0 && (
          <p className="pl-4 text-xs opacity-70">Panel: {aco.panel.toLocaleString()}</p>
        )}
        {/* Churn indicator */}
        {aco.churnRate > 20 && (
          <p className="pl-4 text-xs text-warning">⚠ {aco.churnRate}% provider churn</p>
        )}
      </Link>
      <button
        className="btn btn-ghost btn-sm mx-auto normal-case text-info"
        onClick={() => openInNewTab(aco.aco_public_reporting_website)}
      >
        ACO Website
      </button>
    </div>
  );
}
