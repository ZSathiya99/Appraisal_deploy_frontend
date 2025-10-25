import React, { useContext } from "react";
import {
  ChevronDown,
  Upload,
  UserStar,
  UploadCloud,
  X,
  Plus,
} from "lucide-react";
import { useState, useEffect } from "react";
import axios from "axios";
import { jwtDecode } from "jwt-decode";
import { ToastContainer, toast } from "react-toastify";
import { Data } from "../../Context/Store";
const ResearchForm1 = () => {
  const API = import.meta.env.VITE_API
  // Auth
  const token = localStorage.getItem("appraisal_token");
  const decoded = jwtDecode(token);
  const designation = decoded.designation;
  const username = decoded.facultyName;
  const [pointsData, setPointsData] = useState([]);
  console.log("pointsData", pointsData);

  // context Data
  const { setResearchMarks, researchMarks } = useContext(Data);

  // states
  const [isDropDown, setDropdown] = useState(false);
  const [selectedCheck, setSelectedCheck] = useState("No");
  console.log("selectedCheck", selectedCheck);
  const [numberOfPapers, setNumberOfPapers] = useState("No. of Papers");
  const [files, setFiles] = useState([]);
  const [remarkData, setRemarkData] = useState("");
  const [fileError, setFileError] = useState("");
  const [sciemark, setSciemark] = useState("");
  const [scieoutmark, setScieoutmark] = useState("");
  console.log("scieoutmark", scieoutmark);
  const [inputGroups, setInputGroups] = useState([
    { author: "", typeOfAuthor: "" },
  ]);

  // function to add multiple input fields
  const handleAddInput = () => {
    if (inputGroups.length >= 4) {
      alert("Only four papers are allowed.");
      return;
    }
    setInputGroups((prev) => [...prev, { author: "", typeOfAuthor: "" }]);
  };

  // function to handle cancel button in input fields
  const handleInputCancel = (i) => {
    setError(false);
    setInputGroups((prev) => prev.filter((_, index) => index !== i));
  };
  // function for handling checkbox click
  const handleCheckbox = async (value) => {
    setSelectedCheck(value);
  };

  // function for handling dropdown click / selecting number of papers
  const handleDropdownClick = (value) => {
    setNumberOfPapers(value);
    setDropdown(!isDropDown);
  };

  // function for handling file uploads
  const handleFileUpload = async (e) => {
    const uploadedFiles = Array.from(e.target.files);

    // ✅ Filter out files larger than 5MB
    const validFiles = uploadedFiles.filter((file) => {
      if (file.size > 1 * 1024 * 1024) {
        alert(`"${file.name}" is larger than 1MB and will not be uploaded.`);
        return false;
      }
      return true;
    });

    // ✅ Merge with existing files & keep only unique (name + size)
    const combinedFiles = [...files, ...validFiles];
    const uniqueFiles = combinedFiles.filter(
      (file, index, self) =>
        index ===
        self.findIndex((f) => f.name === file.name && f.size === file.size)
    );

    // ✅ Max 3 files check
    if (uniqueFiles.length > 1) {
      alert("More than 1 files are not allowed");
      return;
    }

    // ✅ Update state with only unique files
    setFiles(uniqueFiles);

    // ✅ Prepare FormData for API
    const formData = new FormData();
    uniqueFiles.forEach((file) => {
      formData.append("sciePaperFiles", file); // must match backend
    });

    formData.append("facultyName", username);
    formData.append("scie", JSON.stringify(inputGroups));

    try {
      await axios.post(
        `${API}/api/scie/${designation}`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            // ❌ don’t set Content-Type manually, axios handles it
          },
        }
      );
      console.log("Upload successful");
    } catch (err) {
      console.error("File upload failed:", err.response || err);
    } finally {
      e.target.value = ""; // reset input so same file can be uploaded again
    }
  };

  console.log("input groups : ", inputGroups);

  async function sendDataToAPI(value) {
    const formData = new FormData();
    formData.append("scie", JSON.stringify(value));
    formData.append("facultyName", username);

    try {
      const res = await axios.post(
        `${API}/api/scie/${designation}`,
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
        setSciemark(res.data.finalMarks);
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
           data: { keyword: "sciePaperFiles" }, 
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
  useEffect(() => {
    if (!designation || !token) return;

    const fetchAllData = async () => {
      try {
        const pointsResponse = await axios.get(
          `http://localhost:5000/api/points/${designation}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        console.log("Full API Response:", pointsResponse.data);

        const researchData = pointsResponse.data.find(
          (item) => item.category === "research"
        );

        const sciePoints = researchData?.points?.scie || 0;
        // setRemarkData(researchData.points);
        console.log("Points:", researchData);
        // You can set state here
        setScieoutmark(sciePoints);
        setRemarkData(researchData);
      } catch (error) {
        console.error(
          "Error fetching points:",
          error.response?.data || error.message
        );
      }
    };

    fetchAllData();
  }, [designation, token]);

  const [error, setError] = useState(false);
  function handleError(value) {
    console.log("hey : ", value);
    if (value.length >= 18) {
      setError(true);
    } else {
      setError(false);
    }
  }
  return (
    <>
      <div className="input-container-2 border border-[#AAAAAA] p-4  bg-white  rounded-xl grid gap-4 grid-cols-12">
        <div className="first-container pr-3 border-r border-gray-400 col-span-10">
          {/* .heading / question  */}
          <div>
            <h1 className="text-lg font-medium">
              Papers Published in SCIE / SSCI / AHCI Indexed Journals{" "}
              <span className="text-red-500">*</span>
            </h1>
          </div>
          {/* input container  */}
          <div className="checkbox-container mt-2 px-6 flex items-center justify-between gap-5">
            <div className="flex items-center gap-5">
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
            {selectedCheck == "Yes" && (
              <button
                onClick={handleAddInput}
                className="text-white font-semibold px-4 py-2 rounded-md bg-teal-500 flex items-center gap-3 cursor-pointer hover:bg-teal-700"
              >
                Add <Plus />
              </button>
            )}
          </div>

          {/* Dynamic input fiels  */}
          {selectedCheck == "Yes" && (
            <>
              {inputGroups.map((item, index) => {
                return (
                  <div
                    key={index}
                    className="input-container md:mx-6 mt-2 space-y-2 w-[200px] sm:w-[400px] sm:flex items-center justify-between gap-4"
                  >
                    <div className="">
                      <input
                        type="text"
                        placeholder="Name of the paper"
                        className="border-1 border-gray-400 rounded-md px-4 py-2 w-[80%] md:w-[100%]"
                        value={item.author}
                        maxLength={18} // 👈 limits input to 16 characters
                        onChange={(e) => {
                          const updatedGroups = [...inputGroups];
                          updatedGroups[index].author = e.target.value;
                          setInputGroups(updatedGroups);
                          handleError(e.target.value);
                          // Call API immediately with updated value
                          sendDataToAPI(updatedGroups);
                        }}
                      />
                    </div>

                    {/* <div className=""> */}
                    <select
                      value={item.typeOfAuthor}
                      onChange={(e) => {
                        const updatedGroups = [...inputGroups];
                        updatedGroups[index].typeOfAuthor = e.target.value;
                        setInputGroups(updatedGroups);

                        // Call API immediately with updated value
                        sendDataToAPI(updatedGroups);
                      }}
                      className="cursor-pointer outline-none border-1 border-gray-400 w-[80%] md:w-[50%] flex items-center justify-between rounded-md px-4 py-3"
                    >
                      <option value="" disabled>
                        Type of Author
                      </option>
                      <option value="Firstauthor">First Author</option>
                      <option value="secondauthor">Second Author</option>
                      <option value="thirdauthor">
                        Third and above Author
                      </option>
                    </select>

                    {/* Cancel Button
                     */}
                    {fileError && (
                      <p className="text-red-600 text-sm mt-2">{fileError}</p>
                    )}
                    <div
                      onClick={() => handleInputCancel(index)}
                      className="cancel-button w-fit bg-gray-200 border-1 border-gray-200 rounded-full p-1 hover:bg-gray-300 cursor-pointer"
                    >
                      <X className="text-red-400" />
                    </div>
                  </div>
                );
              })}
            </>
          )}
          {error && (
            <h1 className="text-red-400 text-sm mx-6">
              Should not exceed more than 19
            </h1>
          )}

          {/* Dropdown and attachment container  */}
          {selectedCheck == "Yes" && (
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
          )}
        </div>
        {/* marks container  */}
        <div className="second-container col-span-2 text-center">
          <h1 className="text-lg font-medium">Marks</h1>
          <div className="h-[80%] flex items-center justify-center">
            <h1 className="text-[#646464]  text-lg">
              <span className="font-semibold text-[#318179]">
                {" "}
                {sciemark || 0}
              </span>{" "}
              out of {scieoutmark || 0}
            </h1>
          </div>
        </div>
      </div>
    </>
  );
};

export default ResearchForm1;
