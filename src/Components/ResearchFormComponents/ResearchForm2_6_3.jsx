import React, { useState } from "react";
import { ChevronDown, Upload, UserStar, UploadCloud, X } from "lucide-react";
import axios from "axios";
import { jwtDecode } from "jwt-decode";
const ResearchForm2_6_3 = ({ setMark }) => {
  // Auth
 const API = "http://localhost:5000"
  const token = localStorage.getItem("appraisal_token");
  const decoded = jwtDecode(token);
  const designation = decoded.designation;
  const username = decoded.facultyName;

  const [selectedCheck, setSelectedCheck] = useState("No");
  const [numPatent, setNumPatent] = useState(0);

  const [dropdown3, setDropdown3] = useState(false);
  const hanldeDropdown = (key) => {
    if (key == "d3") {
      setDropdown3(!dropdown3);
    }
  };

  // function for handling radio button click
  const handleCheckbox = async (value) => {
    setSelectedCheck(value);
    let formData = {};
    if (value == "Yes") {
      formData.patentType = "Designothers";
      formData.numPatent = numPatent;
      formData.facultyName = username;
    }
    try {
      const response = await axios.post(
        `${API}/api/patent/${designation}/`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setMark(response.data.finalMarks);
    } catch (err) {}
  };

  // function for API call while selecting the number or patent published
  const handleBtnClick = async (value, patent_type) => {
    setDropdown3(false);
    let formData = {};
    formData.patentType = patent_type;
    formData.numPatent = value;
    formData.facultyName = username;

    try {
      const response = await axios.post(
        `${API}/api/patent/${designation}/`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
          },
        }
      );
      console.log("Resp : ", response.data);
      setMark(response.data.finalMarks);
    } catch (err) {
      console.log("error occured :", err.message);
    }
  };

  return (
    <>
      <div className="main-container mt-4">
        {/* header  */}
        <div className="header">
          <div>
            <h1 className="text-lg font-medium">
              Design and others <span className="text-red-500">*</span>
            </h1>
            <h1 className="text-gray-400 font-medium ">2 Points / Patent</h1>
          </div>
        </div>
        {/* input container  */}
        <div className="checkbox-container mt-2 flex items-center gap-4">
          <div className=" flex items-center gap-2 ">
            <input
              type="checkbox"
              className="scale-125 cursor-pointer"
              checked={selectedCheck == "Yes" ? true : false}
              onChange={() => {
                setSelectedCheck("Yes");
                handleCheckbox("Yes");
              }}
            />
            <label className="text-[#6f7282]">Yes</label>
          </div>
          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              className="scale-125 cursor-pointer"
              checked={selectedCheck == "No" ? true : false}
              onChange={() => {
                setSelectedCheck("No");
                handleCheckbox("No");
              }}
            />
            <label className="text-[#6f7282]">No</label>
          </div>
        </div>
        {/* Dropdown  */}
        {selectedCheck == "Yes" && (
          <div className="dropdown-container relative flex items-center gap-2 justify-between border-1 border-gray-500 px-4 py-2 mt-2 rounded-md">
            <h1 className="text-gray-600">
              {numPatent == 0 ? "Number of Patent Published" : numPatent}
            </h1>
            <ChevronDown
              onClick={() => hanldeDropdown("d3")}
              className={`text-gray-400 cursor-pointer ${
                dropdown3 && "rotate-180"
              } transition-all duration-300`}
            />
            {dropdown3 && (
              <div className="content-container absolute top-full left-0 bg-white z-1 rounded-md border-1 border-gray-300  w-full shadow-md  shadow-gray-500 ">
                <button
                  onClick={() => {
                    handleBtnClick(1, "Designothers");
                    setNumPatent(1);
                  }}
                  className="py-2 px-4 cursor-pointer border-b-1 border-gray-300 hover:bg-gray-100 text-left w-full"
                >
                  1
                </button>
                <button
                  onClick={() => {
                    handleBtnClick(2, "Designothers");
                    setNumPatent(2);
                  }}
                  className="py-2 px-4 cursor-pointer border-b-1 border-gray-300 hover:bg-gray-100 text-left w-full"
                >
                  2
                </button>
                <button
                  onClick={() => {
                    handleBtnClick(3, "Designothers");
                    setNumPatent(3);
                  }}
                  className="py-2 px-4 cursor-pointer border-b-1 border-gray-300 hover:bg-gray-100 text-left w-full"
                >
                  3
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </>
  );
};

export default ResearchForm2_6_3;
