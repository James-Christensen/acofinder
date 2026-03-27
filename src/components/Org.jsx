import React, { useContext, useState, useMemo } from "react";
import { useParams } from "react-router-dom";
import ACOContext from "../context/context";
import Stats from "./Stats";
import Members from "./Members";
import Contact from "./Contact";
import PerformanceData from "./PerformanceData";
import QualityBreakdown from "./QualityBreakdown";
import ProviderComposition from "./ProviderComposition";
import YearOverYear from "./YearOverYear";
import NPILookup from "./NPILookup";
import PenaltyRiskCalculator from "./PenaltyRiskCalculator";
import BenchmarkPressure from "./BenchmarkPressure";
import StabilityPanel from "./StabilityPanel";
import ProviderDirectory from "./ProviderDirectory";
import HospitalQuality from "./HospitalQuality";
import { FaUser, FaUserTie, FaUserNurse, FaUserMd, FaCopy, FaCheck } from "react-icons/fa";
import { openInNewTab, calculateARR, parseNumericString } from "../utils/helpers";
import { getSalesPriorityLabel, getSalesPriorityColor } from "../utils/salesPriority";
import { getMAPressureLevel } from "../data/maPenetration";

export default function Org() {
  const { id } = useParams();
  const {
    loading,
    error,
    getAcoById,
    getMembersForAco,
    getPriorMembersForAco,
    getPriorPerformance,
    toggleBookmark,
    bookmarks,
    CURRENT_YEAR,
    PRIOR_YEAR,
    ORG_YEAR,
  } = useContext(ACOContext);

  const [activeTab, setActiveTab] = useState("overview");
  const [copied, setCopied] = useState(null);

  const aco = useMemo(() => getAcoById(id), [getAcoById, id]);
  const members = useMemo(() => getMembersForAco(id), [getMembersForAco, id]);
  const priorMembers = useMemo(
    () => getPriorMembersForAco(id),
    [getPriorMembersForAco, id]
  );
  const priorPerf = useMemo(
    () => getPriorPerformance(id),
    [getPriorPerformance, id]
  );

  const bookmarked = bookmarks.includes(id);

  const copyToClipboard = (text, label) => {
    if (!text || text === "Not Listed") return;
    navigator.clipboard.writeText(text);
    setCopied(label);
    setTimeout(() => setCopied(null), 2000);
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
      <div className="alert alert-error shadow-lg max-w-lg mx-auto mt-10">
        <span>{error}</span>
      </div>
    );
  }

  if (!aco) {
    return (
      <div className="alert alert-warning shadow-lg max-w-lg mx-auto mt-10">
        <span>ACO with ID "{id}" not found.</span>
      </div>
    );
  }

  const panel = aco.panel || aco.memberCount * 709;
  const arr = calculateARR(panel);
  const maPressure = getMAPressureLevel(aco.maPenetration);

  const tabs = [
    { id: "overview", label: "Overview" },
    { id: "performance", label: "Performance" },
    { id: "members", label: `Members (${members.length})` },
    { id: "quality", label: "Quality Measures" },
    { id: "risk", label: "Risk Assessment" },
    { id: "stability", label: "Stability" },
    { id: "hospitals", label: "Hospitals" },
  ];

  const CopyButton = ({ text, label }) => (
    <button
      className="btn btn-ghost btn-xs ml-1"
      onClick={() => copyToClipboard(text, label)}
      title={`Copy ${label}`}
    >
      {copied === label ? (
        <FaCheck className="text-success text-xs" />
      ) : (
        <FaCopy className="text-xs opacity-50" />
      )}
    </button>
  );

  return (
    <div className="container mx-auto max-w-6xl">
      <div className="p-5 min-h-screen bg-base-200 text-center mx-auto">
        {/* Header */}
        <div className="flex justify-center items-start gap-3">
          <div>
            <h1 className="text-4xl lg:text-5xl text-primary font-bold">
              {aco.aco_name}
            </h1>
            <p className="py-3 text-center">{aco.aco_address}</p>
            <div className="flex justify-center gap-2 flex-wrap">
              <span className="badge badge-info">{aco.aco_id}</span>
              {aco.Risk_Model && (
                <span className="badge badge-outline">{aco.Risk_Model}</span>
              )}
              {aco.hasPerformanceData && (
                <span
                  className={`badge ${
                    aco.savings > 0
                      ? "badge-success"
                      : aco.savings < 0
                      ? "badge-error"
                      : "badge-ghost"
                  }`}
                >
                  {aco.savings > 0
                    ? "Earned Savings"
                    : aco.savings < 0
                    ? "Owes Losses"
                    : "Breakeven"}
                </span>
              )}
              {/* Sales Priority Badge */}
              {aco.salesPriority > 0 && (
                <span
                  className={`badge ${getSalesPriorityColor(aco.salesPriority)}`}
                >
                  {getSalesPriorityLabel(aco.salesPriority)} Priority (
                  {aco.salesPriority})
                </span>
              )}
              {/* ACO REACH Badge */}
              {aco.isReach && (
                <span className="badge badge-accent">ACO REACH</span>
              )}
              {/* MA Penetration Badge */}
              {aco.maPenetration && (
                <span className={`badge badge-outline ${maPressure.color}`}>
                  MA: {aco.maPenetration}%
                </span>
              )}
              <button
                className={`badge cursor-pointer ${
                  bookmarked ? "badge-warning" : "badge-outline"
                }`}
                onClick={() => toggleBookmark(id)}
              >
                {bookmarked ? "★ Bookmarked" : "☆ Bookmark"}
              </button>
            </div>
          </div>
        </div>

        {/* Stats Bar */}
        <div className="my-5">
          <Stats
            members={members.length}
            patients={aco.panel}
            arr={arr}
            qualScore={aco.qualScore}
            currentYear={CURRENT_YEAR}
            orgYear={ORG_YEAR}
          />
        </div>

        {/* Tabs */}
        <div className="tabs tabs-boxed justify-center my-5 bg-base-300 flex-wrap">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              className={`tab ${activeTab === tab.id ? "tab-active" : ""}`}
              onClick={() => setActiveTab(tab.id)}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Tab Content */}
        {activeTab === "overview" && (
          <div>
            {/* Contacts */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 my-5 mx-5">
              <Contact
                icon={<FaUserTie className="my-5 text-7xl" />}
                title="ACO Executive"
                name={aco.aco_exec_name}
                phone={aco.aco_exec_phone}
                email={aco.aco_exec_email}
                CopyButton={CopyButton}
              />
              <Contact
                icon={<FaUser className="my-5 text-7xl" />}
                title="Public Contact"
                name={aco.aco_public_name}
                phone={aco.aco_public_phone}
                email={aco.aco_public_email}
                CopyButton={CopyButton}
              />
              <Contact
                icon={<FaUserNurse className="my-5 text-7xl" />}
                title="Compliance Contact"
                name={aco.aco_compliance_contact_name}
              />
              <Contact
                icon={<FaUserMd className="my-5 text-7xl" />}
                title="Medical Director"
                name={aco.aco_medical_director_name}
              />
            </div>
            <div className="max-w-lg mx-auto my-5">
              <button
                className="btn btn-info my-5"
                onClick={() => openInNewTab(aco.aco_public_reporting_website)}
              >
                ACO Reporting Website
              </button>
            </div>

            {/* Provider Composition */}
            {aco.hasPerformanceData && <ProviderComposition aco={aco} />}
          </div>
        )}

        {activeTab === "performance" && (
          <div>
            {aco.hasPerformanceData ? (
              <>
                <PerformanceData
                  performance={aco}
                  currentYear={CURRENT_YEAR}
                />
                <BenchmarkPressure aco={aco} priorPerf={priorPerf} />
                {priorPerf && (
                  <YearOverYear
                    current={aco}
                    prior={priorPerf}
                    currentYear={CURRENT_YEAR}
                    priorYear={CURRENT_YEAR - 1}
                  />
                )}
              </>
            ) : (
              <p className="text-accent py-10">
                No performance data available for this ACO.
              </p>
            )}
          </div>
        )}

        {activeTab === "members" && (
          <div>
            <Members members={members} />
            {members.length > 0 && (
              <>
                <ProviderDirectory members={members} acoId={id} />
                <div className="mt-6">
                  <h3 className="text-lg font-semibold mb-3">
                    NPI Registry Lookup
                  </h3>
                  <p className="text-sm opacity-60 mb-3">
                    Search the NPPES registry for provider details on member
                    practices
                  </p>
                  <NPILookup practiceName={members[0]?.par_lbn || ""} />
                </div>
              </>
            )}
          </div>
        )}

        {activeTab === "quality" && (
          <div>
            {aco.hasPerformanceData ? (
              <QualityBreakdown aco={aco} />
            ) : (
              <p className="text-accent py-10">
                No quality data available for this ACO.
              </p>
            )}
          </div>
        )}

        {activeTab === "risk" && (
          <div>
            {aco.hasPerformanceData ? (
              <PenaltyRiskCalculator aco={aco} priorPerf={priorPerf} />
            ) : (
              <p className="text-accent py-10">
                No performance data available for risk assessment.
              </p>
            )}
          </div>
        )}

        {activeTab === "stability" && (
          <StabilityPanel
            currentMembers={members}
            priorMembers={priorMembers}
            currentPanel={aco.panel}
            priorPanel={priorPerf ? parseNumericString(priorPerf.N_AB) : 0}
            currentYear={CURRENT_YEAR}
            priorYear={PRIOR_YEAR}
          />
        )}

        {activeTab === "hospitals" && (
          <HospitalQuality members={members} />
        )}
      </div>
    </div>
  );
}
