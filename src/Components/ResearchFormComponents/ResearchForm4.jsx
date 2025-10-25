import React from "react";
import {
  ChevronDown,
  Upload,
  UserStar,
  UploadCloud,
  X,
  Plus,
} from "lucide-react";
import { useState, useEffect, useContext } from "react";
import axios from "axios";
import { jwtDecode } from "jwt-decode";
import { Data } from "../../Context/Store";
import { ToastContainer, toast } from "react-toastify";
const ResearchForm4 = () => {
  const { researchMarks } = useContext(Data);
   const API = import.meta.env.VITE_API

  // states
  const [totalMark, setTotalMarks] = useState(0);
  const [selectedValue, setSelectedValue] = useState("None");
  const [isDropDown, setDropdown] = useState(false);
  const [selectedCheck, setSelectedCheck] = useState("No");
  const [numberOfPapers, setNumberOfPapers] = useState("No. of Books");
  const [files, setFiles] = useState([]);
  const token = localStorage.getItem("appraisal_token");
  const decoded = jwtDecode(token);
  const designation = decoded.designation;
  const username = decoded.facultyName;
  const [pointsData, setPointsData] = useState([]);
  const [fileError, setFileError] = useState("");
  const [aictemark, setAictemark] = useState("");
const [selectedValuenum,setSelectedValuenum] = useState("");
  const { remarkData } = useContext(Data);
  console.log("remarkData", remarkData);
  const [inputGroups, setInputGroups] = useState([
    { author: "", typeOfAuthor: "" },
  ]);

  const handleInputCancel = (i) => {
    setInputGroups((prev) => prev.filter((_, index) => index !== i));
  };

  // function for handling checkbox click
  const handleCheckbox = async (value) => {
    setSelectedCheck(value);
  };
  // function for handling checkbox click

  // function for handling dropdown click / selecting number of papers
  const handleDropdownClick = (value) => {
    setNumberOfPapers(value);
    setDropdown(!isDropDown);
  };
  const handleAddInput = () => {
    if (inputGroups.length >= 4) {
      alert("Only four papers are allowed.");
      return;
    }
    setInputGroups((prev) => [...prev, { author: "", typeOfAuthor: "" }]);
  };

  const handleFileUpload = async (e) => {
    const uploadedFiles = Array.from(e.target.files);

    // Filter out files larger than 5MB
    const validFiles = uploadedFiles.filter((file) => {
      if (file.size > 1 * 1024 * 1024) {
        alert(`"${file.name}" is larger than 5MB and will not be uploaded.`);
        return false;
      }
      return true;
    });

    // Check total file count (existing + new)
    const totalFiles = [...files, ...validFiles];
    if (totalFiles.length > 1) {
      alert("More than 1 files are not allowed");
      return;
    }

    // Update state
    setFiles(totalFiles);

    // Prepare FormData for API
    const formData = new FormData();

    // Append ALL files (old + new)
    totalFiles.forEach((file) => {
      formData.append("ScopusFiles", file); // field name must match backend
    });
     e.target.value = "";

    // Append other form data
    formData.append("facultyName", username);
    formData.append("numBook", selectedValuenum);

    try {
      await axios.post(
        `${API}/api/scopusBook/${designation}`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
          },
        }
      );
      console.log("Upload successful");
    } catch (err) {
      console.error("File upload failed:", err);
      // toast.error("Failed to upload files.");
    }
  };

  console.log("input groups : ", inputGroups);

  async function sendDataToAPI(value) {
    setSelectedValuenum(value)
    const formData = new FormData();
    formData.append("numBook", JSON.stringify(value));
    formData.append("facultyName", username);

    try {
      const res = await axios.post(
        `${API}/api/scopusBook/${designation}`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
          },
        }
      );

      console.log("Upload successful");
      console.log("Response data demo:", res.data); // ✅ Check full API response here
      setTotalMarks(res.data.finalMarks);
      // Example: if API returns finalMarks
      if (res.data.finalMarks !== undefined) {
        setAictemark(res.data.finalMarks);
      }

      return res.data; // optional, if you want to use it elsewhere
    } catch (err) {
      console.error("File upload failed:", err);
    }
  }

  const removeFile = async (index) => {
    // const fileName = encodeURIComponent(files[index].name); // encode to handle spaces & special chars
    const fileName = files[index].name;

    try {
      // API call to delete image with fileName in URL
      await axios.delete(
        `${API}/api/deleteImage`,
        {
          headers: { Authorization: `Bearer ${token}` },
           data: { keyword: "ScopusFiles" }, 
        }
      );

      // Revoke preview URL if exists
      if (files[index].preview) {
        URL.revokeObjectURL(files[index].preview);
      }

      // Update state after successful deletion
      const updatedFiles = [...files];
      updatedFiles.splice(index, 1);
      setFiles(updatedFiles);
  // Reset file input
    document.getElementById("file-upload").value = "";
    
      // Clear error if limit is now fine
      // if (updatedFiles.length < 3) {
      //   setFileError("");
      // }

      // toast.success(`${decodeURIComponent(fileName)} deleted successfully`);
      // toast.success(`${fileName} deleted successfully`);
    } catch (error) {
      console.error(
        "Error deleting file:",
        error.response?.data || error.message
      );
      // toast.error("Failed to delete file");
    }
  };

  return (
    <>
      <div className="input-container-2 border border-[#AAAAAA] p-4  bg-white  rounded-xl grid gap-4 grid-cols-12">
        <div className="first-container pr-3 border-r border-gray-400 col-span-10">
          {/* .heading / question  */}
          <div>
            <h1 className="text-lg font-medium">
              Book Published in Scopus / WoS Indexed Series{" "}
              <span className="text-red-500">*</span>
            </h1>
            <h1 className="text-lg font-medium text-gray-600 mx-6">
              2 Points per Book (Max of 4 points) 
            </h1>
          </div>
          {/* input container  */}

          {/* Dynamic input fiels  */}

          <div className="mx-6 mt-2">
            <div className="input-container flex items-center gap-3">
              <input
                type="radio"
                className="scale-125"
                checked={selectedValue == 1}
                onChange={() => {
                  setSelectedValue(1);
                  sendDataToAPI(1);
                }}
              />
              <label className="text-gray-500">1</label>
            </div>
            <div className="input-container flex items-center gap-3">
              <input
                type="radio"
                className="scale-125"
                checked={selectedValue == 2}
                onChange={() => {
                  setSelectedValue(2);
                  sendDataToAPI(2);
                }}
              />
              <label className="text-gray-500">2</label>
            </div>
            <div className="input-container flex items-center gap-3">
              <input
                type="radio"
                className="scale-125"
                checked={selectedValue == 3}
                onChange={() => {
                  setSelectedValue(3);
                  sendDataToAPI(3);
                }}
              />
              <label className="text-gray-500">3</label>
            </div>
            <div className="input-container flex items-center gap-3">
              <input
                type="radio"
                className="scale-125"
                checked={selectedValue == 4}
                onChange={() => {
                  setSelectedValue(4);
                  sendDataToAPI(4);
                }}
              />
              <label className="text-gray-500">4</label>
            </div>
            <div className="input-container flex items-center gap-3">
              <input
                type="radio"
                className="scale-125"
                checked={selectedValue == "None"}
                onChange={() => {
                  setSelectedValue("None");
                  sendDataToAPI("None");
                }}
              />
              <label className="text-gray-500">None</label>
            </div>
          </div>

          {/* Dropdown and attachment container  */}

          <div className="mt-2 ">
            <div className="border-2 border-dashed relative border-[#3ab5a3] rounded-md p-4 text-center cursor-pointer">
              <label className="cursor-pointer text-gray-600 flex items-center justify-center gap-3">
                <span className="text-xl">
                  {" "}
                  <UploadCloud />{" "}
                </span>{" "}
                Add Attachment{" "}
                <span className="underline text-teal-500">choose file</span>
              </label>
              <input
                id="file-upload"
                type="file"
                className="absolute top-0 right-0 left-0 bottom-0 opacity-0"
                onChange={(e) => handleFileUpload(e)}
                accept=".jpeg,.jpg,.png,.pdf,.doc,.docx"
                multiple
              />
              <h1 className="text-sm mt-2 text-blue-400 ">
                Compress files into a single file. <span className="text-red-300">*</span>
              </h1>
              <ToastContainer />
            </div>

            <div className="mt-4 space-y-2  flex items-start gap-2 overflow-auto">
              {files?.map((fileObj, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between bg-gray-50 px-3 py-2 rounded border"
                >
                  <div className="flex items-center gap-3">
                    {fileObj.preview ? (
                      <img
                        src={fileObj.preview}
                        // alt={fileObj.file.name}
                        className="w-6 h-6 object-cover rounded"
                      />
                    ) : (
                      <span className="text-sm text-gray-700">
                        {/* {fileObj.name} */}
                        {fileObj.name.length > 25
                          ? fileObj.name.slice(0, 12) + "..."
                          : fileObj.name}
                      </span>
                    )}
                  </div>
                  <button
                    onClick={() => removeFile(index)}
                    className="text-gray-500 hover:text-red-600 cursor-pointer text-xl font-bold"
                  >
                    ×
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
        {/* marks container  */}
        <div className="second-container col-span-2 text-center">
          <h1 className="text-lg font-medium">Marks</h1>
          <div className="h-[80%] flex items-center justify-center">
            <h1 className="text-[#646464]  text-lg">
              <span className="font-semibold text-[#318179]">{totalMark}</span>{" "}
              out of {researchMarks?.book_scopus}
            </h1>
          </div>
        </div>
      </div>
    </>
  );
};

export default ResearchForm4;
