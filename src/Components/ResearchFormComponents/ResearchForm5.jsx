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
const ResearchForm5 = () => {
 const API = "http://localhost:5000"
  // states
  const { researchMarks } = useContext(Data);

  const [isDropDown, setDropdown] = useState(false);
  const [selectedCheck, setSelectedCheck] = useState("No");
  const [numberOfPapers, setNumberOfPapers] = useState("No. of Books");
  const [files, setFiles] = useState([]);
  const token = localStorage.getItem("appraisal_token");
  const decoded = jwtDecode(token);
  const designation = decoded.designation;
  const username = decoded.facultyName;
  const [pointsData, setPointsData] = useState([]);
  const [selectedValuenum, setSelectedValuenum] = useState("");
  const [fileError, setFileError] = useState("");
  const [indexedBookmark, setIndexedBookmark] = useState("");
  const [num, setNum] = useState("");
  const { remarkData } = useContext(Data);
  console.log("remarkData", remarkData);

  const [inputGroups, setInputGroups] = useState([
    { author: "", typeOfAuthor: "" },
  ]);

  // function for handling checkbox click
  const handleCheckbox = async (value) => {
    setSelectedCheck(value);
  };

  // function for handling dropdown click / selecting number of papers

  const handleFileUpload = async (e) => {
    const uploadedFiles = Array.from(e.target.files);

    // Filter out files larger than 5MB
    const validFiles = uploadedFiles.filter((file) => {
      if (file.size > 1 * 1024 * 1024) {
        alert(`"${file.name}" is larger than 1MB and will not be uploaded.`);
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
      formData.append("IndexFiles", file); // field name must match backend
    });
    e.target.value = "";
    // Append other form data
    formData.append("facultyName", username);
    formData.append("numPaper", selectedValuenum);

    try {
      await axios.post(`${API}/api/IndexedBook/${designation}`, formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      });
      console.log("Upload successful");
    } catch (err) {
      console.error("File upload failed:", err);
      // toast.error("Failed to upload files.");
    }
  };

  console.log("input groups : ", inputGroups);

  async function handleDropdownClick(value) {
    setSelectedValuenum(value);

    const formData = new FormData();
    formData.append("numPaper", JSON.stringify(value));
    formData.append("facultyName", username);

    try {
      const res = await axios.post(
        `${API}/api/IndexedBook/${designation}`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
          },
        }
      );

      console.log("Upload successful");
      console.log("Response data:", res.data); // ✅ Check full API response here

      // Example: if API returns finalMarks
      if (res.data.finalMarks !== undefined) {
        setIndexedBookmark(res.data.finalMarks);
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
      await axios.delete(`${API}/api/deleteImage`, {
          headers: { Authorization: `Bearer ${token}` },
           data: { keyword: "IndexFiles" }, 
        });

      // Revoke preview URL if exists
      if (files[index].preview) {
        URL.revokeObjectURL(files[index].preview);
      }

      // Update state after successful deletion
      const updatedFiles = [...files];
      updatedFiles.splice(index, 1);
      setFiles(updatedFiles);
      document.getElementById("file-upload").value = "";

      // Clear error if limit is now fine

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
               Papers Published in Scopus / WoS Indexed Book Chapters /
              Conference Proceedigns <span className="text-red-500">*</span>
            </h1>
          </div>
          {/* input container  */}
          <div className="checkbox-container mt-2 px-6 flex items-center gap-5">
            <div className="container-1 flex items-center gap-2">
              <input
                type="checkbox"
                className="scale-125 cursor-pointer"
                checked={selectedCheck == "Yes" ? true : false}
                onChange={() => {
                  handleCheckbox("Yes");
                }}
              />
              <label className="text-[#6f7282]">Yes</label>
            </div>
            <div className="container-1 flex items-center gap-2">
              <input
                type="checkbox"
                className="scale-125 cursor-pointer"
                checked={selectedCheck == "No" ? true : false}
                onChange={() => {
                  handleCheckbox("No");
                }}
              />
              <label className="text-[#6f7282]">No</label>
            </div>
          </div>
          {/* Dropdown and attachment container  */}
          {selectedCheck == "Yes" && (
            <div className="dropdown-attachment-container px-6">
              {/* Dropdown  */}
              <div className="select-dropdown-container mt-2 w-[170px] relative bg-white z-20">
                <div className="header flex items-center justify-between border border-[#8B9AA9] rounded-lg px-2 py-2">
                  {/* Input instead of h1 */}
                  <input
                    type="number"
                    value={numberOfPapers}
                    onChange={(e) =>
                      handleDropdownClick(Number(e.target.value))
                    }
                    placeholder="No. of Books"
                    className="text-[#8B9AA9] w-full outline-none"
                    readOnly // keeps it dropdown-driven but still shows value
                  />

                  <ChevronDown
                    onClick={() => setDropdown(!isDropDown)}
                    className={`cursor-pointer transition-transform duration-200 ${
                      isDropDown && "rotate-180"
                    }`}
                  />
                </div>

                {isDropDown && (
                  <div className="content-container shadow-lg w-[210px] bg-[#ffffff] border rounded-b-lg border-gray-200 absolute top-full">
                    {[1, 2, 3, 4].map((num) => (
                      <button
                        key={num}
                        onClick={() => {
                          handleDropdownClick(num);
                          setDropdown(false); // close after selection
                          setNumberOfPapers(num);
                        }}
                        className="px-3 py-1 hover:bg-gray-100 w-full border-b border-gray-100 text-left cursor-pointer"
                      >
                        {num}
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* Attachement  */}
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
                    Compress files into a single file.{" "}
                    <span className="text-red-300">*</span>
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
          )}
        </div>
        {/* marks container  */}
        <div className="second-container col-span-2 text-center">
          <h1 className="text-lg font-medium">Marks</h1>
          <div className="h-[80%] flex items-center justify-center">
            <h1 className="text-[#646464]  text-lg">
              <span className="font-semibold text-[#318179]">
                {indexedBookmark || 0}
              </span>{" "}
              out of {researchMarks?.indexbook}
            </h1>
          </div>
        </div>
      </div>
    </>
  );
};

export default ResearchForm5;
