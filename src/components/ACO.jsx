import React from "react";
import { Link } from "react-router-dom";

export default function ACO({ id, name, address, website, state }) {
  const handleClick = (string) => {
    if (string.includes("http://") || string.includes("https://"))
      window.open(string, "_blank");
  };

  return (
    <Link to={`/aco/${id}`}>
      <div className="card card-bordered h-64 shadow-md compact side bg-base-100 hover:bg-base-300 hover:border-info hover:shadow-lg hover:shadow-primary-focus hover:cursor-pointer p-2 pb-4">
        <div className="flex-row items-center space-x-4 card-body">
          <div className="badge badge-info badge-outline">{id}</div>
        </div>
        <h2 className="card-title pl-4">{name}</h2>
        <p className="pl-4">State: {state} </p>
        <button
          className="btn btn-ghost btn-sm mx-auto normal-case text-info"
          onClick={() => handleClick(website)}
        >
          ACO Reporting Website
        </button>
      </div>
    </Link>
  );
}
