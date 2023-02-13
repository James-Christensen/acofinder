import { React, useEffect, useState } from "react";
import axios from "axios";
import { OrgUrl, PerformanceUrl } from "../context/ursl";
import ACO from "../components/ACO";
const _ = require("lodash");

export default function About() {
  const [loading, setloading] = useState(true);
  const [org, setOrg] = useState([]);
  const [newACOs, setNewACOs] = useState([]);
  const [oldACOs, setOldACOs] = useState([]);

  useEffect(() => {
    getACO();
  }, []);

  const getACO = async () => {
    const response = await axios.get(OrgUrl);
    const data = await response.data;
    axios.get(PerformanceUrl).then((response) => {
      setOldACOs(response.data);
    });
    setNewACOs(data);
    setloading(false);
  };

  if (oldACOs && oldACOs.length > 1) {
    const deleteMe = _.difference(
      oldACOs.map((aco) => aco.ACO_ID),
      newACOs.map((aco) => aco.aco_id)
    );

    const filteredList = oldACOs.filter(
      (aco) => !deleteMe.includes(aco.ACO_ID)
    );
    // console.log(filteredList.find((aco) => aco.ACO_ID === "A1001"));
    // console.log(oldACOs.find((aco) => aco.ACO_ID === "A1001"));
    // console.log(deleteMe)
    // console.log(filteredList.includes("A1769"));
    // console.log(filteredList);

    if (filteredList.length > 0) {
      for (let i = 0; i < filteredList.length; i++) {
        filteredList[i].aco_id = filteredList[i].ACO_ID;
        delete filteredList[i].ACO_ID;
      }
    }
    let newArray = [];
    if (filteredList.length > 0) {
      const mergedACOs = _.merge(
        _.keyBy(newACOs, "aco_id"),
        _.keyBy(filteredList, "aco_id")
      );

      function updateOrg() {
        
        for (const [key, value] of Object.entries(mergedACOs)) {
          newArray.push(value);
        }
        return newArray
      }
      updateOrg();
      setOrg(newArray);
    }
  }

  return (
    <>
      <div className="flex justify-center flex-col align-middle text-center">
        <h1 className="text-6xl mb-4">About</h1>
        <p className="">
          Search tool built for sales reps to find ACOs and learn more about
          them.
        </p>
      </div>
      {/* {loading === true ? (
        <p>Loading...</p>
      ) : (
        <>
          {org.map((i) => (
            <ACO
              key={i.aco_id}
              name={i.ACO_Name}
              id={i.aco_id}
              website={i.aco_public_reporting_website}
              address={i.aco_address}
              state={i.ACO_State}
            />
          ))}
        </>
      )} */}
    </>
  );
}
