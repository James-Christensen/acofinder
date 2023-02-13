import React, { useState, createContext, useEffect } from "react";
import { OrgUrl, PerformanceUrl } from "../context/ursl";
import { acoMembers } from "../context/acoMemberData";

import axios from "axios";
const _ = require("lodash");

const ACOContext = createContext();

export const ACOProvider = ({ children }) => {
  const [acos, setAcos] = useState([]);
  const [sortState, setStateSort] = useState(false);
  const [sortName, setSortName] = useState(false);
  const [org, setOrg] = useState([]);

  
//old data/first build
  useEffect(() => {
    fetchACOs();}, []);

  const fetchACOs = async () => {
    const response = await fetch(
      `https://data.cms.gov/data-api/v1/dataset/ea96c3ef-0dcb-4549-9866-03f087e81a5d/data`
    );

    const data = await response.json();
    setAcos(data);
  };
  //new data/new build
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
        filteredList.map((aco) => ({ ...aco, aco_id: aco.ACO_ID })),
        "aco_id"
      ),
      _.keyBy(acoMembers, "aco_id")
    );

    setOrg(Object.values(mergedACOs));
  };



  let sortedACOs = [...acos].sort((aco1, aco2) =>
    aco1.aco_address.slice(-9, -7) < aco2.aco_address.slice(-9, -7)
      ? -1
      : aco1.aco_address.slice(-9, -7) > aco2.aco_address.slice(-9, -7)
      ? 1
      : 0
  );

  let sortedNameACOs = [...acos].sort((aco1, aco2) =>
    aco1.aco_name < aco2.aco_name ? -1 : aco1.aco_name > aco2.aco_name ? 1 : 0
  );

  const handleStateSort = () => {
    setStateSort(!sortState);
    setAcos(sortedACOs);
  };

  const handleNameSort = () => {
    setSortName(!sortName);
    setAcos(sortedNameACOs);
  };

  return (
    <ACOContext.Provider
      value={{ acos, setAcos, handleStateSort, handleNameSort,org }}
    >
      {children}
    </ACOContext.Provider>
  );
};

export default ACOContext;
