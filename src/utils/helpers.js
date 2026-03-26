// Extract state abbreviation from CMS address string
export function getStateFromAddress(address) {
  if (!address || address.length < 9) return "";
  return address.slice(-9, -7).trim();
}

// Parse a numeric string with commas (e.g., "1,234,567") to a number
export function parseNumericString(str) {
  if (!str || str === "0") return 0;
  return parseInt(String(str).replace(/,/g, ""), 10) || 0;
}

// Format currency value for display
export function formatCurrency(value) {
  const num = typeof value === "number" ? value : parseNumericString(value);
  if (num === 0) return "$0";
  const abs = Math.abs(num);
  const sign = num < 0 ? "-" : "";
  if (abs >= 1_000_000) return `${sign}$${(abs / 1_000_000).toFixed(2)}M`;
  if (abs >= 1_000) return `${sign}$${(abs / 1_000).toFixed(0)}K`;
  return `${sign}$${abs}`;
}

// Format large numbers for display
export function formatNumber(value) {
  const num = typeof value === "number" ? value : parseNumericString(value);
  return num.toLocaleString();
}

// Determine quality reporting method from flags
export function getReportingMethod(aco) {
  if (aco.Report_eCQM === "1") return "eCQM";
  if (aco.Report_CQM === "1") return "MIPS CQM";
  if (aco.Report_WI === "1") return "Web Interface";
  return "N/A";
}

// Clean ACO name for display (remove corporate suffixes)
export function cleanAcoName(name, maxLength = 60) {
  if (!name) return "";
  let cleaned = name
    .replace(/, LLC/gi, "")
    .replace(/LLC/gi, "")
    .replace(/, Inc\./gi, "")
    .replace(/Inc\./gi, "")
    .trim();
  if (maxLength && cleaned.length > maxLength) {
    return cleaned.slice(0, maxLength - 3) + "...";
  }
  return cleaned;
}

// Safely open URL in new tab
export function openInNewTab(url) {
  if (!url) return;
  if (url.startsWith("http://") || url.startsWith("https://")) {
    window.open(url, "_blank", "noopener,noreferrer");
  }
}

// Calculate estimated ARR based on panel size and PMPM
export function calculateARR(panelSize, pmpm = 50) {
  return panelSize * pmpm * 12;
}

// Calculate risk level based on savings rate and quality score
export function getRiskLevel(aco) {
  const qualScore = parseFloat(aco.QualScore) || 0;
  const savRate = parseFloat(aco.Sav_Rate) || 0;

  if (qualScore < 30 || savRate < -5) return "high";
  if (qualScore < 60 || savRate < 0) return "medium";
  return "low";
}

// Get individual quality measures from an ACO record
export function getQualityMeasures(aco) {
  return [
    {
      id: "001",
      name: "CAHPS Summary",
      wiScore: aco["QualityID_001_WI"] || null,
      ecqmScore: aco["QualityID_001_eCQM-CQM"] || null,
    },
    {
      id: "236",
      name: "Controlling High Blood Pressure",
      wiScore: aco["QualityID_236_WI"] || null,
      ecqmScore: aco["QualityID_236_eCQM-CQM"] || null,
    },
    {
      id: "134",
      name: "Diabetes: A1C Poor Control",
      wiScore: aco["QualityID_134_WI"] || null,
      ecqmScore: aco["QualityID_134_eCQM-CQM"] || null,
    },
  ];
}

// Export ACO data to CSV
export function exportToCSV(data, filename = "aco-data.csv") {
  if (!data || data.length === 0) return;

  const headers = [
    "ACO ID",
    "ACO Name",
    "State",
    "Panel Size",
    "Risk Model",
    "Quality Score",
    "Generated Savings/Loss",
    "Earned Savings/Loss",
    "Reporting Method",
    "Member Practices",
    "ACO Executive",
    "Executive Email",
    "Executive Phone",
    "Public Contact",
    "Public Email",
    "Public Phone",
    "Website",
  ];

  const rows = data.map((aco) => [
    aco.aco_id || "",
    `"${(aco.aco_name || "").replace(/"/g, '""')}"`,
    aco.state || getStateFromAddress(aco.aco_address),
    aco.panel || parseNumericString(aco.N_AB),
    `"${aco.Risk_Model || ""}"`,
    aco.QualScore || "",
    parseNumericString(aco.GenSaveLoss),
    parseNumericString(aco.EarnSaveLoss),
    aco.method || getReportingMethod(aco),
    aco.aco_members || "",
    `"${aco.aco_exec_name || ""}"`,
    aco.aco_exec_email || "",
    aco.aco_exec_phone || "",
    `"${aco.aco_public_name || ""}"`,
    aco.aco_public_email || "",
    aco.aco_public_phone || "",
    aco.aco_public_reporting_website || "",
  ]);

  const csv = [headers.join(","), ...rows.map((r) => r.join(","))].join("\n");
  const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.setAttribute("href", url);
  link.setAttribute("download", filename);
  link.click();
  URL.revokeObjectURL(url);
}

// localStorage helpers for bookmarks
const BOOKMARKS_KEY = "aco_finder_bookmarks";

export function getBookmarks() {
  try {
    return JSON.parse(localStorage.getItem(BOOKMARKS_KEY)) || [];
  } catch {
    return [];
  }
}

export function toggleBookmark(acoId) {
  const bookmarks = getBookmarks();
  const idx = bookmarks.indexOf(acoId);
  if (idx > -1) {
    bookmarks.splice(idx, 1);
  } else {
    bookmarks.push(acoId);
  }
  localStorage.setItem(BOOKMARKS_KEY, JSON.stringify(bookmarks));
  return bookmarks;
}

export function isBookmarked(acoId) {
  return getBookmarks().includes(acoId);
}
