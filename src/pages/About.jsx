import React from "react";

export default function About() {
  return (
    <div className="container mx-auto max-w-3xl px-4">
      <div className="text-center mb-8">
        <h1 className="text-5xl font-bold mb-4">About ACO Finder</h1>
        <p className="text-lg">
          A sales intelligence tool for researching Medicare Shared Savings
          Program (MSSP) Accountable Care Organizations.
        </p>
      </div>

      <div className="space-y-6">
        <div className="card bg-base-200">
          <div className="card-body">
            <h2 className="card-title">What It Does</h2>
            <p>
              ACO Finder aggregates publicly available CMS data to help sales
              reps identify, research, and prioritize ACO prospects. It combines
              organization data, financial performance results, quality scores,
              and member practice lists into a single searchable interface.
            </p>
          </div>
        </div>

        <div className="card bg-base-200">
          <div className="card-body">
            <h2 className="card-title">Data Sources</h2>
            <ul className="list-disc list-inside space-y-1">
              <li>CMS MSSP Participating ACO Organizations</li>
              <li>CMS MSSP Performance Year Financial & Quality Results</li>
              <li>CMS MSSP ACO Participant/Member Practices</li>
            </ul>
            <p className="text-sm opacity-70 mt-2">
              All data is sourced from publicly available CMS datasets at
              data.cms.gov.
            </p>
          </div>
        </div>

        <div className="card bg-base-200">
          <div className="card-body">
            <h2 className="card-title">Key Features</h2>
            <ul className="list-disc list-inside space-y-1">
              <li>Search and filter ACOs by name, state, region, risk model</li>
              <li>Advanced table with sorting, filtering, and CSV export</li>
              <li>Detailed ACO profiles with contacts, members, and performance</li>
              <li>Quality measure breakdowns with sales talking points</li>
              <li>Year-over-year performance comparison</li>
              <li>Side-by-side ACO comparison tool</li>
              <li>Savings/loss leaderboard for prospect prioritization</li>
              <li>Market insights and territory sizing by state</li>
              <li>Bookmark ACOs for quick access</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
