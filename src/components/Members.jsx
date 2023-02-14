import { React, useState } from "react";
import {
  FaRegWindowClose,
  FaChevronCircleUp,
  FaChevronCircleDown,
} from "react-icons/fa";

export default function Members({ members }) {
  const [collapse, setCollapse] = useState(false);
  const tableRows = members.map((i) => (
    <tr key={i.par_lbn} className="hover text-center border-b border-info">
      <td className="w-2 px-5">{i.par_lbn}</td>
    </tr>
  ));
  return (
    <div className="collapse justify-end w-full -mt-8 pt-0">
      <input
        type="checkbox"
        className="peer"
        value={collapse}
        onClick={() => setCollapse(!collapse)}
      />
      <div className="my-5 collapse-title text-primary-content text-right text-sm w-full mx-auto flex justify-start sm:justify-end ">
        <p className="mr-5 text-sm align-middle	">
          {collapse === true ? "Hide" : "Show"} Members:
        </p>
        {collapse === true ? (
          <FaChevronCircleUp className="mr-0 mt-1 text-md align-middle	" />
        ) : (
          <FaChevronCircleDown className="mr-0 mt-1 text-md align-middle	" />
        )}
      </div>
      <div className="flex mx-auto justify-center flex-col align-middle text-center w-5/6 h-auto collapse-content">
        <div className="container overflow-display overscroll-contain pr-0 border-info rounded-l-md border overflow-auto h-96">
          <table className="table table-fixed text-center overflow-scroll w-full	">
            <thead className="sticky top-0 w-full">
              <tr className="border-b border-info text-primary-content w-full">
                <th className="normal-case text-center text-xl w-full">
                  <div className="flex justify-end">
                    <div className="w-1/3 align-middle"></div>
                    <div className="w-1/3 align-middle">Practice Name</div>
                    <div className="w-1/3 align-middle">
                      <p className="text-sm text-right italic mt-1 my-auto">
                        Total: {members.length}
                      </p>
                    </div>
                  </div>
                </th>
              </tr>
            </thead>
            <tbody className="text-left border-b border-info">
              {tableRows}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

