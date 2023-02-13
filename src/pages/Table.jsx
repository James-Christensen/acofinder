import { React, useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import { OrgUrl, PerformanceUrl } from "../context/ursl";
import { acoMembers } from "../context/acoMemberData";
const _ = require("lodash");

export default function Table() {
  const [loading, setloading] = useState(true);
  const [org, setOrg] = useState([]);
  const [sortState, setStateSort] = useState(false);
  const [sortName, setSortName] = useState(false);
  const [sortPanel, setSortPanel] = useState(false);
  const [sortSavings, setSortSavings] = useState(false);
  const [sortReporting, setSortReporting] = useState(false);

  useEffect(() => {
    getList();
  }, []);

  const getList = async () => {
    const [orgResponse, performanceResponse] = await Promise.all([
      axios.get(OrgUrl),
      axios.get(PerformanceUrl),
    ]);

    const newData = orgResponse.data;
    const oldData = performanceResponse.data;
    const deleteMe = _.difference(
      oldData.map((aco) => aco.ACO_ID),
      newData.map((aco) => aco.aco_id)
    );

    const filteredList = oldData.filter(
      (aco) => !deleteMe.includes(aco.ACO_ID)
    );
    const mergedACOs = _.merge(
      _.keyBy(newData, "aco_id"),
      _.keyBy(
        filteredList.map((aco) => ({
          ...aco,
          aco_id: aco.ACO_ID,
        })),
        "aco_id"
      ),
      _.keyBy(acoMembers, "aco_id")
    );

    let acoList = Object.entries(mergedACOs).map((e) => e[1]);
    acoList.pop();

    acoList.forEach((aco) => {
      aco.state = aco.aco_address.slice(-9, -7);
    });

    acoList.forEach((aco) => {
      if (aco.N_AB !== undefined) {
        aco.panel = _.parseInt(aco.N_AB.replaceAll(",", ""));
      } else {
        aco.panel = 0;
      }
    });

    acoList.forEach((aco) => {
      if (aco.EarnSaveLoss !== undefined) {
        aco.savings = _.parseInt(aco.EarnSaveLoss.replaceAll(",", ""));
      } else {
        aco.savings = 0;
      }
    });
    acoList.forEach((aco) => {
      if (aco.Report_eCQM === "1") {
        aco.method = "eCQM";
      } else if (aco.Report_CQM === "1") {
        aco.method = "MIPS CQM";
      } else if (aco.Report_WI === "1") {
        aco.method = "Web Interface";
      } else {
        aco.method = "NA";
      }
    });

    setOrg(Object.values(acoList));
    setloading(false);
  };

  const handleClick = (string) => {
    if (string.includes("http://") || string.includes("https://"))
      window.open(string, "_blank");
  };

  let sortedACOs = [...org].sort((aco1, aco2) =>
    aco1.aco_address.slice(-9, -7) < aco2.aco_address.slice(-9, -7)
      ? -1
      : aco1.aco_address.slice(-9, -7) > aco2.aco_address.slice(-9, -7)
      ? 1
      : 0
  );

  let sortedNameACOs = [...org].sort((aco1, aco2) =>
    aco1.aco_name < aco2.aco_name ? -1 : aco1.aco_name > aco2.aco_name ? 1 : 0
  );
  let sortedPanelACOs = [...org].sort((aco1, aco2) =>
    aco1.panel < aco2.panel ? -1 : aco1.panel > aco2.panel ? 1 : 0
  );

  let sortedSavingsACOs = [...org].sort((aco1, aco2) =>
    aco1.savings < aco2.savings ? -1 : aco1.savings > aco2.savings ? 1 : 0
  );
  let sortedReportingACOs = [...org].sort((aco1, aco2) =>
    aco1.method < aco2.method ? -1 : aco1.method > aco2.method ? 1 : 0
  );

  const handleStateSort = () => {
    if (sortState === false) {
      setOrg(sortedACOs);
    } else {
      setOrg(sortedACOs.reverse());
    }
    setStateSort(!sortState);
  };

  const handleNameSort = () => {
    if (sortName === false) {
      setOrg(sortedNameACOs);
    } else {
      setOrg(sortedNameACOs.reverse());
    }
    setSortName(!sortName);
  };
  const handlePanelSort = () => {
    if (sortPanel === false) {
      setOrg(sortedPanelACOs);
    } else {
      setOrg(sortedPanelACOs.reverse());
    }
    setSortPanel(!sortPanel);
  };

  const handleSavingsSort = () => {
    if (sortSavings === false) {
      setOrg(sortedSavingsACOs);
    } else {
      setOrg(sortedSavingsACOs.reverse());
    }
    setSortSavings(!sortSavings);
  };
  const handleReportingSort = () => {
    if (sortReporting === false) {
      setOrg(sortedReportingACOs);
    } else {
      setOrg(sortedReportingACOs.reverse());
    }
    setSortReporting(!sortReporting);
  };

  const tableRows = org.map((i) => (
    <tr key={i.aco_id} className="hover text-center border-b border-info">
      <td className="w-2 px-5">{i.aco_id}</td>
      <td className="w-2 px-5">
        <Link to={`/aco/${i.aco_id}`}>
          {_.truncate(
            _.replace(
              _.replace(_.replace(i.aco_name, ", LLC", ""), "LLC", ""),
              ", Inc.",
              ""
            ),

            {
              length: 50,
            }
          )}
        </Link>
      </td>
      <td className="w-2 px-5">{i.state}</td>
      <td className="w-2 px-5">{i.N_AB !== undefined ? i.N_AB : i.panel}</td>
      <td className="w-2 px-5">
        {i.savings > 0
          ? `$${(i.savings / 1000000).toFixed(2)} million`
          : "No Shared Savings"}
      </td>
      <td className="w-2 px-5">{i.method}</td>
      <td className="w-2 px-5">
        <button
          className="btn btn-outline normal-case btn-sm text-info"
          onClick={() => handleClick(i.aco_public_reporting_website)}
        >
          ACO Reporting Website
        </button>
      </td>
    </tr>
  ));

  return (
    <>
      <h1 className="text-4xl font-bold text-center text-secondary -mt-16 mb-6">
        {" "}
        All 2023 ACO's
      </h1>

      <div className="flex mx-auto justify-center flex-col align-middle text-center w-fit h-full">
        <div className="z-50	container overflow-display overscroll-contain pr-0 border-info rounded-l-md border overflow-y-scroll h-96">
          <table className="table table-compact table-fixed text-center overflow-scroll	">
            <thead className="sticky top-0">
              <tr className="border-b border-info text-primary-content">
                <th>Id</th>
                <th
                  onClick={handleNameSort}
                  className="normal-case hover:cursor-pointer"
                >
                  Name{" "}
                </th>
                <th
                  onClick={handleStateSort}
                  className="normal-case hover:cursor-pointer"
                >
                  State
                </th>
                <th
                  onClick={handlePanelSort}
                  className="normal-case hover:cursor-pointer"
                >
                  2021 Panel
                </th>
                <th
                  onClick={handleSavingsSort}
                  className="normal-case hover:cursor-pointer"
                >
                  2021 Shared Savings
                </th>
                <th
                  onClick={handleReportingSort}
                  className="normal-case hover:cursor-pointer"
                >
                  2021 Reporting Method
                </th>
                <th className="normal-case ">Public Reporting </th>
              </tr>
            </thead>
            <tbody className="text-left border-b border-info">
              {tableRows}
            </tbody>
          </table>
        </div>
        <p className="text-sm text-success pt-2 pb-0 m-0 italic ">
          Click an ACO Name above to learn more
        </p>
      </div>
    </>
  );
}
