import { React, useEffect, useState, useContext } from "react";
import ACOContext from "../context/context";
import ACO from "../components/ACO";
import { West, SouthEast, NorthEast } from "../data";
import axios from "axios";

export default function ACOResults() {
  const { acos, setAcos } = useContext(ACOContext);
  const [loading, setloading] = useState(true);
  const [results, setResults] = useState([]);
  const [selectValue, setSelect] = useState("Select a Region");
  const [keyword, setKeyword] = useState("");
  const [error, setError] = useState(false);

  const selectRegion = (e) => {
    setSelect(e.target.value);
    let display;

    switch (e.target.value) {
      case "West":
        display = filterAcos(West);
        break;
      case "NorthEast":
        display = filterAcos(NorthEast);
        break;
      case "SouthEast":
        display = filterAcos(SouthEast);
        break;
      case "All":
        display = acos;
        break;
      default:
        display = "";
    }
    setResults(display);
  };

  const filterAcos = (region) => {
    return acos.filter((aco) =>
      region.includes(aco.aco_address.slice(-9).slice(0, 2))
    );
  };

  useEffect(() => {
    fetchACOs();
  }, []);

  const fetchACOs = async () => {
    const response = await fetch(
      `https://data.cms.gov/data-api/v1/dataset/ea96c3ef-0dcb-4549-9866-03f087e81a5d/data`
    );
    const data = await response.json();
    setAcos(data);
    setloading(false);
  };

  const searchACO = () => {
    return axios
      .get(
        `https://data.cms.gov/data-api/v1/dataset/ea96c3ef-0dcb-4549-9866-03f087e81a5d/data?keyword=${keyword}`
      )
      .then(function (response) {
        response.data.length !== 0 ? setResults(response.data) : setError(true);
      });
  };

  const sortByState = (results) => {
    return [...results].sort((aco1, aco2) =>
      aco1.aco_address.slice(-9, -7) < aco2.aco_address.slice(-9, -7)
        ? -1
        : aco1.aco_address.slice(-9, -7) > aco2.aco_address.slice(-9, -7)
        ? 1
        : 0
    );
  };

  const sortByName = (results) => {
    return [...results].sort((aco1, aco2) =>
      aco1.aco_name < aco2.aco_name ? -1 : aco1.aco_name > aco2.aco_name ? 1 : 0
    );
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    await Promise.all([searchACO(), setKeyword("")]);
  };

  useEffect(() => {
    if (error) {
      setTimeout(() => {
        setError(false);
      }, 2000);
    }
  }, [error]);

  const handleStateSort = (e) => {
    setResults(sortByState(results));
  };

  const handleNameSort = (e) => {
    setResults(sortByName(results));
  };

  return (
    <>
      {loading === true ? (
        <p className="text-center text-lg">Loading...</p>
      ) : (
        <>
          <div className="container mx-auto w-5/6">
            <p className="text-primary-content text-sm sm:text-left text-center mb-5">
              Search for ACOs by name, ID, or other keyword.
            </p>
          </div>
          <div className="container mx-auto w-5/6 flex flex-col md:flex-row">
            <div className="w-full flex-row">
              <form onSubmit={handleSubmit}>
                <input
                  value={keyword}
                  onChange={(e) => setKeyword(e.target.value)}
                  type="text"
                  placeholder="Type here"
                  className="input input-bordered input-success w-7/12 sm:9/12 md:w-3/5  lg:w-9/12 xl:w-9/12 ml-auto mr-2"
                />
                <button type="submit" className="btn btn-sm btn-primary mx-2">
                  Search
                </button>
              </form>
            </div>
            <div className="w-full sm:flex justify-end">
              <div className="sm:w-7/12 w-full flex">
                <div className="w-1/2 pl-5 md:pr-2 md:pl-0">
                  <label className="label cursor-pointer">
                    <span className="label-text text-xs">Sort by Name:</span>
                    <input
                      type="radio"
                      name="radio-10"
                      className="radio checked:bg-primary"
                      defaultChecked={true}
                      onChange={handleNameSort}
                    />
                  </label>
                </div>
                <div className="w-1/2 pl-5 md:pr-2 md:pl-0">
                  <label className="label cursor-pointer">
                    <span className="label-text text-xs">Sort by State:</span>
                    <input
                      type="radio"
                      name="radio-10"
                      className="radio checked:bg-primary"
                      defaultChecked={false}
                      onChange={handleStateSort}
                    />
                  </label>
                </div>
              </div>
              <div className="sm:w-5/12 w-full flex justify-start sm:justify-end bg-blue-200">
                <select
                  value={selectValue}
                  onChange={selectRegion}
                  className="select select-success w-full"
                >
                  <option value={"None"}>Select a Region</option>
                  <option value={"All"}>All</option>
                  <option value={"West"}>West</option>
                  <option value={"NorthEast"}>North East</option>
                  <option value={"SouthEast"}>South East</option>
                </select>
              </div>
            </div>
          </div>
          <div className="container mx-auto w-5/6 pt-5">
            {error === true ? (
              <div className="flex">
                <div className="alert alert-error shadow-lg w-10/12 lg:w-96 mx-auto py-3 my-2">
                  <div>
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="stroke-current flex-shrink-0 h-6 w-6"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z"
                      />
                    </svg>
                    <span>No Results Found. Please Search Again. </span>
                  </div>
                </div>
              </div>
            ) : (
              " "
            )}
            <div
              className={
                results.length > 1
                  ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 my-3"
                  : "grid grid-cols-1"
              }
            >
              {results.map((i) => (
                <ACO
                  key={i.aco_id}
                  name={i.aco_name}
                  id={i.aco_id}
                  website={i.aco_public_reporting_website}
                  address={i.aco_address}
                  state={i.aco_address.slice(-9, -7)}
                />
              ))}
            </div>
          </div>
        </>
      )}
    </>
  );
}

