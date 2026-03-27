import { parseNumericString } from "./helpers";

/**
 * Calculate a Sales Priority Score (0-100) for an ACO.
 * Higher scores = more urgent prospect for Mingle Health sales reps.
 *
 * Scoring breakdown (max 100):
 *   - Net losses (savings < 0):                 up to 25 pts
 *   - Low quality score (< 50%):                up to 20 pts
 *   - Share rate gap (Max - Final):              up to 15 pts
 *   - Two-sided risk model:                      flat 15 pts
 *   - YoY performance decline:                   up to 25 pts
 */
export function calculateSalesPriority(aco, priorPerf = null) {
  if (!aco || !aco.hasPerformanceData) return 0;

  let score = 0;

  // 1. Net losses (up to 25 pts)
  const savings = aco.savings || 0;
  const panel = aco.panel || 1;
  if (savings < 0) {
    // Scale by loss magnitude per beneficiary (worse losses = higher score)
    const lossPerBene = Math.abs(savings) / panel;
    // $100 per bene loss = max 25 pts; scale linearly
    score += Math.min(25, Math.round((lossPerBene / 100) * 25));
  }

  // 2. Low quality score (up to 20 pts)
  const qualScore = aco.qualScore || 0;
  if (qualScore > 0 && qualScore < 50) {
    score += Math.min(20, Math.round(50 - qualScore));
  } else if (qualScore === 0 && aco.hasPerformanceData) {
    // No quality score reported — might be a new ACO
    score += 10;
  }

  // 3. Share rate gap (up to 15 pts)
  const maxShare = parseFloat(aco.MaxShareRate) || 0;
  const finalShare = parseFloat(aco.FinalShareRate) || 0;
  if (maxShare > 0 && finalShare < maxShare) {
    const gap = maxShare - finalShare;
    score += Math.min(15, Math.round(gap));
  }

  // 4. Two-sided risk model (flat 15 pts)
  if (
    aco.Risk_Model &&
    aco.Risk_Model.toLowerCase().includes("two")
  ) {
    score += 15;
  }

  // 5. Year-over-year performance decline (up to 25 pts)
  if (priorPerf) {
    const priorSavings = parseNumericString(priorPerf.EarnSaveLoss);
    const priorQual = parseFloat(priorPerf.QualScore) || 0;

    // Savings decline: up to 15 pts
    if (priorSavings > savings) {
      const decline = priorSavings - savings;
      const declinePct = panel > 0 ? (decline / panel) * 100 : 0;
      score += Math.min(15, Math.round(declinePct * 3));
    }

    // Quality decline: up to 10 pts
    if (priorQual > qualScore && priorQual > 0) {
      const qualDecline = priorQual - qualScore;
      score += Math.min(10, Math.round(qualDecline / 3));
    }
  }

  return Math.min(100, Math.max(0, score));
}

/**
 * Get a human-readable label for the sales priority score.
 */
export function getSalesPriorityLabel(score) {
  if (score >= 75) return "Hot";
  if (score >= 50) return "Warm";
  if (score >= 25) return "Cool";
  return "Cold";
}

/**
 * Get a DaisyUI badge color class for the sales priority score.
 */
export function getSalesPriorityColor(score) {
  if (score >= 75) return "badge-error";
  if (score >= 50) return "badge-warning";
  if (score >= 25) return "badge-info";
  return "badge-ghost";
}
