import React, { useState, createContext, useEffect, useCallback, useMemo } from "react";
import axios from "axios";
import {
  OrgUrl,
  PerformanceUrl,
  PriorPerformanceUrl,
  buildMemberPageUrl,
  buildSearchUrl,
  CMS_PAGE_SIZE,
  CURRENT_YEAR,
  PRIOR_YEAR,
  ORG_YEAR,
} from "./ursl";
import {
  getStateFromAddress,
  parseNumericString,
  getReportingMethod,
  getBookmarks,
  toggleBookmark as toggleBookmarkHelper,
} from "../utils/helpers";
import { calculateSalesPriority } from "../utils/salesPriority";
import { getMAPenetration } from "../data/maPenetration";
import { isAcoReachParticipant } from "../data/acoReach";
import { calculateChurn } from "../utils/churnAnalysis";

const ACOContext = createContext();

// Normalize API response keys to lowercase for consistent access
function normalizeKeys(obj) {
  const normalized = {};
  Object.keys(obj).forEach((key) => {
    normalized[key.toLowerCase()] = obj[key];
  });
  return normalized;
}

// Fetch all paginated member data for a given year
async function fetchAllMemberPages(year) {
  let allData = [];
  let offset = 0;
  while (true) {
    const url = buildMemberPageUrl(year, offset);
    const res = await axios.get(url);
    allData = allData.concat(res.data);
    if (res.data.length < CMS_PAGE_SIZE) break;
    offset += CMS_PAGE_SIZE;
  }
  return allData.map(normalizeKeys);
}

export const ACOProvider = ({ children }) => {
  const [acos, setAcos] = useState([]);
  const [members, setMembers] = useState({});
  const [priorMembers, setPriorMembers] = useState({});
  const [priorPerformance, setPriorPerformance] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [bookmarks, setBookmarksState] = useState(getBookmarks());
  const [npiCache, setNpiCache] = useState({});

  useEffect(() => {
    fetchAllData();
  }, []);

  const fetchAllData = async () => {
    setLoading(true);
    setError(null);
    try {
      // Fetch org, performance, prior performance, and both years of member data in parallel
      const [orgRes, perfRes, priorPerfRes, currentMemberData, priorMemberData] =
        await Promise.all([
          axios.get(OrgUrl),
          axios.get(PerformanceUrl),
          axios.get(PriorPerformanceUrl).catch(() => ({ data: [] })),
          fetchAllMemberPages(CURRENT_YEAR),
          fetchAllMemberPages(PRIOR_YEAR).catch(() => []),
        ]);

      const orgData = orgRes.data.map(normalizeKeys);
      const perfData = perfRes.data;
      const priorPerfData = priorPerfRes.data;

      // Build performance lookup by ACO_ID
      const perfByAcoId = {};
      perfData.forEach((p) => {
        perfByAcoId[p.ACO_ID] = p;
      });

      // Build prior performance lookup by ACO_ID
      const priorPerfByAcoId = {};
      priorPerfData.forEach((p) => {
        priorPerfByAcoId[p.ACO_ID] = p;
      });

      // Build member data grouped by aco_id (current year)
      const membersByAco = {};
      currentMemberData.forEach((m) => {
        if (!membersByAco[m.aco_id]) membersByAco[m.aco_id] = [];
        membersByAco[m.aco_id].push(m);
      });

      // Build member data grouped by aco_id (prior year)
      const priorMembersByAco = {};
      priorMemberData.forEach((m) => {
        if (!priorMembersByAco[m.aco_id]) priorMembersByAco[m.aco_id] = [];
        priorMembersByAco[m.aco_id].push(m);
      });

      // Merge org + performance + member counts + new computed fields
      const merged = orgData.map((org) => {
        const perf = perfByAcoId[org.aco_id] || {};
        const priorPerf = priorPerfByAcoId[org.aco_id] || null;
        const currentMems = membersByAco[org.aco_id] || [];
        const priorMems = priorMembersByAco[org.aco_id] || [];
        const memberCount = currentMems.length;
        const state = getStateFromAddress(org.aco_address);
        const panel = parseNumericString(perf.N_AB);
        const savings = parseNumericString(perf.EarnSaveLoss);
        const genSavings = parseNumericString(perf.GenSaveLoss);
        const method = getReportingMethod(perf);
        const qualScore = parseFloat(perf.QualScore) || 0;
        const hasPerformanceData = !!perf.ACO_ID;

        // Feature 2: Sales Priority Score
        const acoData = {
          ...org,
          ...perf,
          panel,
          savings,
          genSavings,
          qualScore,
          hasPerformanceData,
        };
        const salesPriority = calculateSalesPriority(acoData, priorPerf);

        // Feature 3: MA Penetration
        const maPenetration = getMAPenetration(state);

        // Feature 8: ACO REACH cross-reference
        const isReach = isAcoReachParticipant(org.aco_name);

        // Feature 4: Churn & Stability
        const churn = calculateChurn(currentMems, priorMems);

        return {
          ...org,
          ...perf,
          aco_id: org.aco_id,
          state,
          panel,
          savings,
          genSavings,
          method,
          qualScore,
          memberCount,
          hasPerformanceData,
          salesPriority,
          maPenetration,
          isReach,
          churnRate: churn.churnRate,
          providerGrowth: churn.growthRate,
          providersAdded: churn.added.length,
          providersLost: churn.lost.length,
          netProviderChange: churn.netChange,
        };
      });

      setAcos(merged);
      setMembers(membersByAco);
      setPriorMembers(priorMembersByAco);
      setPriorPerformance(priorPerfData);
      setLoading(false);
    } catch (err) {
      console.error("Failed to fetch ACO data:", err);
      setError("Failed to load ACO data. Please try again later.");
      setLoading(false);
    }
  };

  const searchAcos = useCallback(async (keyword) => {
    if (!keyword.trim()) return [];
    try {
      const url = buildSearchUrl(keyword);
      const res = await axios.get(url);
      return res.data;
    } catch (err) {
      console.error("Search failed:", err);
      return [];
    }
  }, []);

  const getAcoById = useCallback(
    (id) => acos.find((a) => a.aco_id === id) || null,
    [acos]
  );

  const getMembersForAco = useCallback(
    (acoId) => members[acoId] || [],
    [members]
  );

  const getPriorMembersForAco = useCallback(
    (acoId) => priorMembers[acoId] || [],
    [priorMembers]
  );

  const getPriorPerformance = useCallback(
    (acoId) => priorPerformance.find((p) => p.ACO_ID === acoId) || null,
    [priorPerformance]
  );

  const toggleBookmark = useCallback((acoId) => {
    const updated = toggleBookmarkHelper(acoId);
    setBookmarksState([...updated]);
  }, []);

  // NPI cache management for Provider Directory
  const getNpiCache = useCallback(
    (acoId) => npiCache[acoId] || null,
    [npiCache]
  );

  const setNpiCacheForAco = useCallback((acoId, data) => {
    setNpiCache((prev) => ({ ...prev, [acoId]: data }));
  }, []);

  const bookmarkedAcos = useMemo(
    () => acos.filter((a) => bookmarks.includes(a.aco_id)),
    [acos, bookmarks]
  );

  const allStates = useMemo(() => {
    return [...new Set(acos.map((a) => a.state).filter(Boolean))].sort();
  }, [acos]);

  const allRiskModels = useMemo(() => {
    return [...new Set(acos.map((a) => a.Risk_Model).filter(Boolean))].sort();
  }, [acos]);

  const allReportingMethods = useMemo(() => {
    return [...new Set(acos.map((a) => a.method).filter(Boolean))].sort();
  }, [acos]);

  const marketStats = useMemo(() => {
    const total = acos.length;
    const totalBeneficiaries = acos.reduce((sum, a) => sum + (a.panel || 0), 0);
    const totalSavings = acos.reduce((sum, a) => sum + (a.savings || 0), 0);
    const totalGenSavings = acos.reduce((sum, a) => sum + (a.genSavings || 0), 0);
    const withPerf = acos.filter((a) => a.qualScore > 0);
    const avgQualScore =
      withPerf.reduce((sum, a) => sum + a.qualScore, 0) / (withPerf.length || 1);
    const withPerformance = acos.filter((a) => a.hasPerformanceData).length;
    const reachCount = acos.filter((a) => a.isReach).length;

    const byState = {};
    acos.forEach((a) => {
      if (!a.state) return;
      if (!byState[a.state])
        byState[a.state] = {
          count: 0,
          beneficiaries: 0,
          savings: 0,
          maPenetration: getMAPenetration(a.state),
          totalQualScore: 0,
          qualCount: 0,
        };
      byState[a.state].count++;
      byState[a.state].beneficiaries += a.panel || 0;
      byState[a.state].savings += a.savings || 0;
      if (a.qualScore > 0) {
        byState[a.state].totalQualScore += a.qualScore;
        byState[a.state].qualCount++;
      }
    });

    // Compute avg quality per state
    Object.values(byState).forEach((s) => {
      s.avgQualScore =
        s.qualCount > 0 ? Math.round((s.totalQualScore / s.qualCount) * 10) / 10 : 0;
    });

    const byRiskModel = {};
    acos.forEach((a) => {
      const model = a.Risk_Model || "Unknown";
      if (!byRiskModel[model]) byRiskModel[model] = { count: 0, beneficiaries: 0 };
      byRiskModel[model].count++;
      byRiskModel[model].beneficiaries += a.panel || 0;
    });

    return {
      total,
      totalBeneficiaries,
      totalSavings,
      totalGenSavings,
      avgQualScore,
      withPerformance,
      reachCount,
      byState,
      byRiskModel,
    };
  }, [acos]);

  const value = {
    acos,
    loading,
    error,
    searchAcos,
    getAcoById,
    getMembersForAco,
    getPriorMembersForAco,
    getPriorPerformance,
    bookmarks,
    toggleBookmark,
    bookmarkedAcos,
    allStates,
    allRiskModels,
    allReportingMethods,
    marketStats,
    getNpiCache,
    setNpiCacheForAco,
    CURRENT_YEAR,
    PRIOR_YEAR,
    ORG_YEAR,
  };

  return <ACOContext.Provider value={value}>{children}</ACOContext.Provider>;
};

export default ACOContext;
