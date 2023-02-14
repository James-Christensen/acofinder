import React from "react";
import Stat from "./Stat";
import {
  FaChartLine,
  FaMoneyCheckAlt,
  FaMoneyBill,
  FaBalanceScale,
} from "react-icons/fa";

export default function PerformanceData({ performance }) {
  const earned =
    performance[0].EarnSaveLoss.length > 8
      ? `${performance[0].EarnSaveLoss.slice(0, 3).replace(",", ".")} m`
      : performance[0].EarnSaveLoss.length < 3
      ? 0
      : `${performance[0].EarnSaveLoss.slice(0, 3)} k`;
  const generated =
    performance[0].GenSaveLoss.length > 8
      ? `${performance[0].GenSaveLoss.slice(0, 3).replace(",", ".")} m`
      : `${performance[0].GenSaveLoss.slice(0, 3)} k`;

  return (
    <div className="w-full">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 ">
        <Stat
          title={"Risk Model:"}
          statValue={performance[0].Risk_Model}
          statDesc={"Risk"}
          icon={
            <FaBalanceScale className="my-2 text-4xl text-primary-content hover:text-primary" />
          }
        />
        <Stat
          title={"Generated Savings"}
          statValue={`$${generated}`}
          statDesc={"Savings or Loss"}
          icon={
            <FaMoneyCheckAlt className="my-2 text-4xl text-primary-content hover:text-success" />
          }
        />
        <Stat
          title={"Earned Savings"}
          statValue={`$${earned}`}
          statDesc={"Amount Earned"}
          icon={
            <FaMoneyBill className="my-2 text-4xl text-primary-content hover:text-success" />
          }
        />
        <Stat
          title={"Score"}
          statValue={performance[0].QualScore}
          statDesc={"2021 Quality Performance"}
          icon={
            <FaChartLine className="text-4xl text-primary-content hover:text-primary" />
          }
        />
      </div>
      <p>
        2021 Submission Method:{" "}
        {performance[0].Report_CQM === "1"
          ? "MIPS CQM"
          : performance[0].Report_eCQM === "1"
          ? "eCQM"
          : "Web Interface"}
      </p>
    </div>
  );
}
