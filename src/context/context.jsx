import React, { useState, createContext, useEffect, useCallback, useMemo } from "react";
import axios from "axios";
import {
  OrgUrl,
  PerformanceUrl,
  memberURL,
  PriorPerformanceUrl,
  buildSearchUrl,
  CURRENT_YEAR,
  PRIOR_YEAR,
} from "./ursl";
import {
  getStateFromAddress,
  parseNumericString,
  getReportingMethod,
  getBookmarks,
  toggleBookmark as toggleBookmarkHelper,
} from "../utils/helpers";

const ACOContext = createContext();

export const ACOProvider = ({ children }) => {
  const [acos, setAcos] = useState([]);
  const [members, setMembers] = useState({});
  const [priorPerformance, setPriorPerformance] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [bookmarks, setBookmarksState] = useState(getBookmarks());

  useEffect(() => {
    fetchAllData();
  }, []);

  const fetchAllData = async () => {
    setLoading(true);
    setError(null);
    try {
      const [orgRes, perfRes, memberRes, priorPerfRes] = await Promise.all([
        axios.get(OrgUrl),
        axios.get(PerformanceUrl),
        axios.get(memberURL),
        axios.get(PriorPerformanceUrl).catch(() => ({ data: [] })),
      ]);

      const orgData = orgRes.data;
      const perfData = perfRes.data;
      const memberData = memberRes.data;
      const priorPerfData = priorPerfRes.data;

      // Build performance lookup by ACO_ID
      const perfByAcoId = {};
      perfData.forEach((p) => {
        perfByAcoId[p.ACO_ID] = p;
      });

      // Build member data grouped by aco_id
      const membersByAco = {};
      memberData.forEach((m) => {
        if (!membersByAco[m.aco_id]) membersByAco[m.aco_id] = [];
        membersByAco[m.aco_id].push(m);
      });

      // Merge org + performance + member counts
      const merged = orgData.map((org) => {
        const perf = perfByAcoId[org.aco_id] || {};
        const memberCount = (membersByAco[org.aco_id] || []).length;
        const state = getStateFromAddress(org.aco_address);
        const panel = parseNumericString(perf.N_AB);
        const savings = parseNumericString(perf.EarnSaveLoss);
        const genSavings = parseNumericString(perf.GenSaveLoss);
        const method = getReportingMethod(perf);
        const qualScore = parseFloat(perf.QualScore) || 0;
        const hasPerformanceData = !!perf.ACO_ID;

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
        };
      });

      setAcos(merged);
      setMembers(membersByAco);
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

  const getPriorPerformance = useCallback(
    (acoId) => priorPerformance.find((p) => p.ACO_ID === acoId) || null,
    [priorPerformance]
  );

  const toggleBookmark = useCallback((acoId) => {
    const updated = toggleBookmarkHelper(acoId);
    setBookmarksState([...updated]);
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

    const byState = {};
    acos.forEach((a) => {
      if (!a.state) return;
      if (!byState[a.state]) byState[a.state] = { count: 0, beneficiaries: 0, savings: 0 };
      byState[a.state].count++;
      byState[a.state].beneficiaries += a.panel || 0;
      byState[a.state].savings += a.savings || 0;
    });

    const byRiskModel = {};
    acos.forEach((a) => {
      const model = a.Risk_Model || "Unknown";
      if (!byRiskModel[model]) byRiskModel[model] = { count: 0, beneficiaries: 0 };
      byRiskModel[model].count++;
      byRiskModel[model].beneficiaries += a.panel || 0;
    });

    return { total, totalBeneficiaries, totalSavings, totalGenSavings, avgQualScore, withPerformance, byState, byRiskModel };
  }, [acos]);

  const value = {
    acos,
    loading,
    error,
    searchAcos,
    getAcoById,
    getMembersForAco,
    getPriorPerformance,
    bookmarks,
    toggleBookmark,
    bookmarkedAcos,
    allStates,
    allRiskModels,
    allReportingMethods,
    marketStats,
    CURRENT_YEAR,
    PRIOR_YEAR,
  };

  return <ACOContext.Provider value={value}>{children}</ACOContext.Provider>;
};

export default ACOContext;
