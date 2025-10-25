import axios from "axios";
import { jwtDecode } from "jwt-decode";
import { UserSearch } from "lucide-react";
import { useState, useContext } from "react";

import { Data } from "../../Context/Store";

// Label data
// if (feedback === "100 to 91") marks = 3;
//     else if (feedback === "90 to 81") marks = 2;
//     else if (feedback === "Less than or equal to 80") marks = 1;
const labelData = [
  { label: "91% to 100%", value: "100 to 91" },
  { label: "81% to 90%", value: "90 to 81" },
  { label: "less than or equal to 80%", value: "Less than or equal to 80" },
  { label: "None", value: "None" },
];
// const { markData } = useContext(Data);

const TeachingForm3 = () => {
  const API = import.meta.env.VITE_API
  //   Auth
  const token = localStorage.getItem("appraisal_token");
  const decoded = jwtDecode(token);
  const designation = decoded.designation;
  const username = decoded.facultyName;

  //   States
  const [selectedValue, setSelectedValue] = useState("None");
  const [feedbackMark, setFeedbackMark] = useState(0);

  async function handleApiCall(value) {
    console.log("run");
    try {
      const response = await axios.post(
        `${API}/api/feedback/${designation}`,
        {
          feedback: value,
          facultyName: username,
        }, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      }
      );

      setFeedbackMark(response.data.finalMarks);

    } catch (error) {
      console.error("Error submitting teaching percentage:", error);
    }
  }
  return (
    <>
      <div className="main-containear">
        <div className="input-container-3 border p-5 border-[#AAAAAA] bg-white rounded-xl grid gap-4 grid-cols-12">
          {/* Left side */}
          <div className="first-container pr-3 border-r border-gray-400 col-span-10">
            <div>
              <h1 className="text-lg font-medium">
                 The average student feedback for all Theory / Lab classes
                <span className="text-red-500">*</span>
              </h1>
              <h1 className="text-lg text-[#646464] font-medium text-[16px] mt-1">
                100 to 91 – 03 Points|| 90 to 81 – 02 Points || &lt;= 80 – 1
                Point
              </h1>
            </div>

            {/* Radio buttons */}
            <div className="radio-button-container space-y-2 px-2 py-2 rounded-lg mt-2 text-[#646464] font-medium">
              {labelData.map((option) => {
                return (
                  <>
                    <div className="input-1 flex items-center gap-2">
                      <input
                        type="radio"
                        checked={selectedValue == option.value}
                        onChange={() => {
                          setSelectedValue(option.value);
                          handleApiCall(option.value);
                        }}
                        className="scale-125 accent-teal-400 cursor-pointer"
                      />
                      <label className="text-gray-500">{option.label}</label>
                    </div>
                  </>
                );
              })}
            </div>
          </div>

          {/* Right side */}
          <div className="second-container col-span-2 text-center">
            <h1 className="text-lg font-medium">Marks</h1>
            <div className="h-[80%] flex items-center justify-center">
              <h1 className="text-[#646464] text-lg">
                <span className="font-semibold text-[#318179]">{feedbackMark || 0}</span> out of{" "}
                {/* {markData?.points?.guest} */}{3}
              </h1>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default TeachingForm3;
