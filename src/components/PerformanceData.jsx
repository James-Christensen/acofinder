import React from "react";
import Stat from "./Stat";
import {
  FaChartLine,
  FaMoneyCheckAlt,
  FaMoneyBill,
  FaBalanceScale,
} from "react-icons/fa";
import { formatCurrency } from "../utils/helpers";

export default function PerformanceData({ performance, currentYear }) {
  const year = currentYear || "Current";

  return (
    <div className="w-full">
      <h3 className="text-lg font-semibold mb-3">{year} Performance Results</h3>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        <Stat
          title="Risk Model"
          statValue={performance.Risk_Model || "N/A"}
          statDesc="Risk Arrangement"
          icon={
            <FaBalanceScale className="my-2 text-4xl text-primary-content hover:text-primary" />
          }
        />
        <Stat
          title="Generated Savings/Loss"
          statValue={formatCurrency(performance.genSavings || performance.GenSaveLoss)}
          statDesc={performance.genSavings > 0 ? "Generated Savings" : performance.genSavings < 0 ? "Generated Loss" : "Breakeven"}
          icon={
            <FaMoneyCheckAlt className="my-2 text-4xl text-primary-content hover:text-success" />
          }
        />
        <Stat
          title="Earned Savings/Loss"
          statValue={formatCurrency(performance.savings || performance.EarnSaveLoss)}
          statDesc={performance.savings > 0 ? "Earned Savings" : performance.savings < 0 ? "Owed Losses" : "N/A"}
          icon={
            <FaMoneyBill className="my-2 text-4xl text-primary-content hover:text-success" />
          }
        />
        <Stat
          title="Quality Score"
          statValue={`${performance.qualScore || performance.QualScore || "N/A"}${typeof (performance.qualScore || performance.QualScore) === "number" ? "%" : ""}`}
          statDesc={`${year} Quality Performance`}
          icon={
            <FaChartLine className="text-4xl text-primary-content hover:text-primary" />
          }
        />
      </div>
      <p className="text-sm mt-3 opacity-70">
        {year} Submission Method: {performance.method || (
          performance.Report_CQM === "1" ? "MIPS CQM" :
          performance.Report_eCQM === "1" ? "eCQM" :
          performance.Report_WI === "1" ? "Web Interface" : "N/A"
        )}
      </p>
    </div>
  );
}
