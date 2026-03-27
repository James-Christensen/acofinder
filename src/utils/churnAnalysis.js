/**
 * Calculate provider churn/stability between two years of member data.
 *
 * @param {Array} currentMembers - Current year member records [{ par_lbn, aco_id }]
 * @param {Array} priorMembers - Prior year member records [{ par_lbn, aco_id }]
 * @returns {Object} Churn analysis results
 */
export function calculateChurn(currentMembers = [], priorMembers = []) {
  const currentTINs = new Set(currentMembers.map((m) => m.par_lbn));
  const priorTINs = new Set(priorMembers.map((m) => m.par_lbn));

  const added = [...currentTINs].filter((t) => !priorTINs.has(t));
  const lost = [...priorTINs].filter((t) => !currentTINs.has(t));
  const retained = [...currentTINs].filter((t) => priorTINs.has(t));

  const currentCount = currentTINs.size;
  const priorCount = priorTINs.size;

  const churnRate =
    priorCount > 0 ? Math.round((lost.length / priorCount) * 100) : 0;
  const growthRate =
    priorCount > 0
      ? Math.round(((currentCount - priorCount) / priorCount) * 100)
      : currentCount > 0
      ? 100
      : 0;

  return {
    added,
    lost,
    retained,
    churnRate,
    growthRate,
    currentCount,
    priorCount,
    netChange: currentCount - priorCount,
  };
}

/**
 * Get a stability label based on churn rate.
 */
export function getStabilityLabel(churnRate) {
  if (churnRate >= 30) return { label: "Unstable", color: "text-error", badge: "badge-error" };
  if (churnRate >= 15) return { label: "Some Churn", color: "text-warning", badge: "badge-warning" };
  if (churnRate > 0) return { label: "Stable", color: "text-success", badge: "badge-success" };
  return { label: "No Change", color: "text-info", badge: "badge-info" };
}
