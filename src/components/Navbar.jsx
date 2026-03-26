import React from "react";
import { FaPiedPiperHat } from "react-icons/fa";
import { Link } from "react-router-dom";

export default function Navbar() {
  return (
    <nav className="navbar mb-6 shadow-lg bg-neutral text-neutral-content">
      <div className="container mx-auto">
        <div className="flex-none px-2 mx-2">
          <FaPiedPiperHat className="inline pr-2 text-3xl text-success" />
          <Link to="/" className="text-lg font-bold text-primary-content">
            ACO Finder
          </Link>
        </div>
        <div className="flex-1 px-2 mx-2">
          <div className="flex justify-end gap-1">
            <Link
              to="/"
              className="btn btn-ghost btn-sm text-primary-content rounded-btn"
            >
              Home
            </Link>
            <Link
              to="/table"
              className="btn btn-ghost btn-sm text-primary-content rounded-btn"
            >
              Table
            </Link>
            <Link
              to="/leaderboard"
              className="btn btn-ghost btn-sm text-primary-content rounded-btn"
            >
              Leaderboard
            </Link>
            <Link
              to="/compare"
              className="btn btn-ghost btn-sm text-primary-content rounded-btn"
            >
              Compare
            </Link>
            <Link
              to="/market"
              className="btn btn-ghost btn-sm text-primary-content rounded-btn"
            >
              Market
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
}
