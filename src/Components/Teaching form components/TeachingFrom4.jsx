import { ChevronDown, Upload, UserStar } from "lucide-react";
import React, { useState, useEffect, useContext } from "react";
import axios from "axios";
import { UploadCloud } from "lucide-react";
import { jwtDecode } from "jwt-decode";
import { Data } from "../../Context/Store";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const TeachingFrom4 = () => {
 const API = "http://localhost:5000"
  const { markData } = useContext(Data);
  console.log("markData", markData);
  const token = localStorage.getItem("appraisal_token");
  const decoded = jwtDecode(token);
  const designation = decoded.designation;
  const username = decoded.facultyName;
  const [isDropDown, setIsDropdown] = useState(false);
  const [developmentTeachingFile, setDevelopmentTeachingFile] = useState([]);
  const [outOfMarks, setOutOfMarks] = useState({ teaching: 0 });
  const [developmentmark, setDevelopmentmark] = useState("");
  const [files, setFiles] = useState([]);

  const allowedTypes = [
    "image/jpeg",
    "image/png",
    "application/pdf",
    "application/msword", // .doc
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document", // .docx
  ];

  const filterValidFiles = (fileList) => {
    return fileList.filter((file) => allowedTypes.includes(file.type));
  };
  const [teachingType, setTeachingType] = useState("");

  const handleFileChange = (e) => {
    const selectedFiles = Array.from(e.target.files);
    const validFiles = filterValidFiles(selectedFiles);
    const filePreviews = validFiles.map((file) => ({
      file,
      preview: file.type.startsWith("image") ? URL.createObjectURL(file) : null,
    }));
    setDevelopmentTeachingFile((prev) => [...prev, ...filePreviews]);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    const droppedFiles = Array.from(e.dataTransfer.files);
    const validFiles = filterValidFiles(droppedFiles);
    const filePreviews = validFiles.map((file) => ({
      file,
      preview: file.type.startsWith("image") ? URL.createObjectURL(file) : null,
    }));
    setDevelopmentTeachingFile((prev) => [...prev, ...filePreviews]);
  };

  const [selectedValues, setSelectedValues] = useState("None");
  const handleTeachingTypeChange = async (selectedValue) => {
    setSelectedValues(selectedValue);
    try {
      setTeachingType(selectedValue);

      const response = await axios.post(
        `${API}/api/innovativeApproach/${designation}`,
        {
          InnovativeApproach: selectedValue,
          facultyName: username,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      // console.log("Teaching type submitted:", response.data);
      setDevelopmentmark(response.data.finalMarks);
      setIsDropdown(false);
    } catch (error) {
      console.error(
        "Error submitting teaching type:",
        error.response?.data || error.message
      );
    }
  };
  const handleFileUpload = async (e) => {
    const newFile = Array.from(e.target.files); // Files just selected

    if (!newFile.length) {
      console.warn("No file selected");
      return;
    }

    // 1️⃣ File size check (max 2 MB)
    const sizeFilteredFiles = newFile.filter((file) => {
      if (file.size > 1 * 1024 * 1024) {
        toast.error(`${file.name} is larger than 1 MB`);
        return false;
      }
      return true;
    });

    if (sizeFilteredFiles.length === 0) {
      e.target.value = "";
      return;
    }

    // 2️⃣ Max files limit check (max 3)
    if (files.length + sizeFilteredFiles.length > 1) {
      toast.error("You can only upload a maximum of 1 files.");
      e.target.value = "";
      return;
    }

    // 3️⃣ Remove duplicates based on file name
    const uniqueFiles = sizeFilteredFiles.filter(
      (file) => !files.some((existingFile) => existingFile.name === file.name)
    );

    if (uniqueFiles.length === 0) {
      e.target.value = "";
      return;
    }

    // 4️⃣ Check if facultyName and designation exist
    if (!decoded?.facultyName) {
      console.error("decoded is missing");
      return;
    }
    if (!designation) {
      console.error("designation is missing");
      return;
    }

    // 5️⃣ Update state
    const updatedFiles = [...files, ...uniqueFiles];
    setFiles(updatedFiles);

    // 6️⃣ Prepare FormData
    try {
      const formData = new FormData();
      formData.append("facultyName", decoded.facultyName);
      formData.append("InnovativeApproach", selectedValues || "");

      updatedFiles.forEach((file) => {
        formData.append("Innovativefiles", file);
      });

      // 7️⃣ Send API request
      const res = await axios.post(
        `${API}/api/innovativeApproach/${designation}`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
          },
        }
      );

      console.log("Upload success:", res.data);
    } catch (err) {
      console.error("Upload failed:", err.response?.data || err.message);
    }

    // 8️⃣ Reset input so same file can be re-selected
    e.target.value = "";
  };

  const removeFile = async (index) => {
    const fileName = encodeURIComponent(files[index].name); // encode to handle spaces & special chars
    console.log("file index : ", fileName);
    try {
      // API call to delete image with fileName in URL
      await axios.delete(`${API}/api/deleteImage`, {
        headers: { Authorization: `Bearer ${token}` },
        data: { keyword: "Innovativefiles" },
      });

      // Revoke preview URL if exists
      if (files[index].preview) {
        URL.revokeObjectURL(files[index].preview);
      }

      // Update state after successful deletion
      const updatedFiles = [...files];
      updatedFiles.splice(index, 1);
      setFiles(updatedFiles);

      // Clear error if limit is now fine
      if (updatedFiles.length < 3) {
        setFileError("");
      }

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
      <div className="main-container border p-5 border-[#AAAAAA] bg-white rounded-xl ">
        <div className="input-container-3 grid gap-4 grid-cols-12">
          <div className="first-container pr-3 border-r border-gray-400 col-span-10">
            <div>
              <h1 className="text-lg font-medium">
                The development of teaching resource
                <span className="text-red-500">*</span>{" "}
              </h1>
              <h1 className="text-lg text-[#646464] font-medium text-[16px] mt-1">
                ( Classroom Teaching - 1 Point || Lab - 2 Points )
              </h1>
            </div>
            <div className="select-container mt-2 relative">
              {/* Header */}
              <div
                className="header flex items-center justify-between border border-[#8B9AA9] rounded-lg px-2 py-2 cursor-pointer"
                onClick={() => setIsDropdown(!isDropDown)}
              >
                <h1
                  className={`${
                    !selectedValues ? "text-[#8B9AA9]" : "text-black"
                  }`}
                >
                  {selectedValues ? selectedValues : "Select Teaching Type"}
                </h1>
                <ChevronDown
                  className={`transition-transform duration-200 ${
                    isDropDown ? "rotate-180" : ""
                  }`}
                />
              </div>

              {isDropDown && (
                <div className="dropdown-container w-full space-y-3 absolute top-full p-2 bg-white border border-[#AAAAAA] rounded-lg z-10">
                  <div className="dropdown-container w-full space-y-3 absolute top-full p-2 bg-white border border-[#AAAAAA] rounded-lg z-10">
                    <div
                      className="input-container flex gap-3 items-center cursor-pointer"
                      onClick={() =>
                        handleTeachingTypeChange("Classroom Teaching")
                      }
                    >
                      <span className="text-[#8B9AA9]">Classroom Teaching</span>
                    </div>

                    <div
                      className="input-container flex gap-3 items-center cursor-pointer"
                      onClick={() => handleTeachingTypeChange("Lab")}
                    >
                      <span className="text-[#8B9AA9]">Lab Teaching</span>
                    </div>

                    <div
                      className="input-container flex gap-3 items-center cursor-pointer"
                      onClick={() => handleTeachingTypeChange("Both")}
                    >
                      <span className="text-[#8B9AA9]">
                        Both Classroom and Lab Teaching
                      </span>
                    </div>
                    <div
                      className="input-container flex gap-3 items-center cursor-pointer"
                      onClick={() => handleTeachingTypeChange("None")}
                    >
                      <span className="text-[#8B9AA9]">None</span>
                    </div>
                  </div>
                </div>
              )}
            </div>
            {/* test demo */}
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
          <div className="second-container col-span-2 text-center">
            <h1 className="text-lg font-medium">Marks</h1>
            <div className="h-[80%] flex items-center justify-center">
              <h1 className="text-[#646464]  text-lg">
                <span className="font-semibold text-[#318179]">
                  {developmentmark || 0}
                </span>{" "}
                out of
                {markData?.points?.innovativeApproach}
              </h1>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default TeachingFrom4;
