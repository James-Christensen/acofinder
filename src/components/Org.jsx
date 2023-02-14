import { React, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import Stats from "./Stats";
import Members from "./Members";
import Contact from "./Contact";
import PerformanceData from "./PerformanceData";
import { FaUser, FaUserTie, FaUserNurse, FaUserMd } from "react-icons/fa";
const _ = require("lodash");

export default function Org() {
  const [aco, setAcoData] = useState([]);
  const [members, setMembers] = useState([]);
  const [performance, setPerformance] = useState();
  const [loading, setloading] = useState(true);
  const [has2021Data, setHas2021Data] = useState(false);

  const placeholderData = [{ N_AB: 709 }];

  const { id } = useParams();
  const acoURL = `https://data.cms.gov/data-api/v1/dataset/ea96c3ef-0dcb-4549-9866-03f087e81a5d//data?keyword=${id}`;
  const perURL = `https://data.cms.gov/data-api/v1/dataset/bd6b766f-6fa3-43ae-8e9a-319da31dc374/data?column=%22ACO_ID%22%2C%22Risk_Model%22%2C%22N_AB%22%2C%22Sav_Rate%22%2C%22MinSavPerc%22%2C%22GenSaveLoss%22%2C%22EarnSaveLoss%22%2C%22Report_WI%22%2C%22Report_eCQM%22%2C%22Report_CQM%22%2C%22Met_QPS%22%2C%22QualScore%22%2C%22FinalShareRate%22%2C%22N_PCP%22%2C%22N_Spec%22%2C%22N_NP%22%2C%22N_PA%22%2C%22QualityID_134_eCQMCQM%22%2C%22QualityID_134_WI%22%2C%22QualityID_001_WI%22%2C%22QualityID_001_eCQMCQM%22%2C%22QualityID_236_WI%22%2C%22QualityID_236_eCQMCQM%22%2C
&keyword=${id}`;
  const memberURL = `https://data.cms.gov/data-api/v1/dataset/fd907586-71e8-4128-ad95-801ee1f4f6f0/data?column=%22par_lbn%22%2C%22aco_id%22&keyword=${id}`;

  useEffect(() => {
    getACO();
  }, []);
  // );

  const getACO = async () => {
    const response = await axios.get(acoURL);
    const data = await response.data;
    const memResponse = await axios.get(memberURL);
    const memData = await memResponse.data;
    

    axios.get(perURL).then(function (response) {
      response.data.length > 0
        ? setPerformance(response.data)
        : setPerformance(placeholderData);
      response.data.length > 0
        ? setHas2021Data(true)
        : console.log("has 2021 data");

    });
    setMembers(memData);
    setAcoData(data);
    setloading(false);
  };

  const handleClick = (string) => {
    if (string.includes("http://") || string.includes("https://"))
      window.open(string, "_blank");
  };



  //props to pass to stats
  let patients =
    has2021Data === true ? performance[0].N_AB : placeholderData[0].N_AB *members.length;

  let panel =
    typeof patients === "string" ? Number(patients.replace(",", "")) : patients;
  let arr = panel * 6;

  return (
    <div className="container mx-auto">
      {loading === true ? (
        <p> Loading... </p>
      ) : (
        <div>
          <div className="p-5 min-h-screen bg-base-200 text-center mx-auto">
            <h1 className="text-5xl text-primary font-bold">{aco[0].aco_name}</h1>
            <p className="py-6 text-center">{aco[0].aco_address}</p>
            <div className="container">
              <Stats members={members.length} patients={patients} arr={arr} />
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 my-5 mx-5">
              <Contact
                icon={<FaUserTie className="my-5 text-9xl" />}
                title={"ACO Executive"}
                name={aco[0].aco_exec_name}
                phone={aco[0].aco_exec_phone}
                email={aco[0].aco_exec_email}
              />
              <Contact
                icon={<FaUser className="my-5 text-9xl" />}
                title={"Public Contact"}
                name={aco[0].aco_public_name}
                phone={aco[0].aco_public_phone}
                email={aco[0].aco_public_email}
              />
              <Contact
                icon={<FaUserNurse className="my-5 text-9xl" />}
                title={"Compliance Contact"}
                name={aco[0].aco_compliance_contact_name}
              />
              <Contact
                icon={<FaUserMd className="my-5 text-9xl" />}
                title={"Medical Director"}
                name={aco[0].aco_medical_director_name}
              />
            </div>
            <div className="max-w-lg mx-auto my-5">
              <button
                className="btn btn-info my-5"
                onClick={() => handleClick(aco[0].aco_public_reporting_website)}
              >
                ACO Reporting Website
              </button>
            </div>
            <div>
              <div className="">
                <div className="divider"> 2023 Member List</div>
                <Members className="w-full" members={members} />
              </div>
              {has2021Data === false && loading === false ? (
                <p className="text-accent">No 2021 Data</p>
              ) : (
                <>
                  <div className="divider"> 2021 Performance Info</div>
                  <PerformanceData performance={performance} />
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
