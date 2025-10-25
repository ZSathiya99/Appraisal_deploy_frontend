import React, { useEffect, useRef, useState, useContext } from "react";
import { ChevronDown, UploadCloud } from "lucide-react";
import { ToastContainer, toast } from "react-toastify";
import axios from "axios";
import { jwtDecode } from "jwt-decode";
import { Data } from "../../Context/Store";

const TeachingForm6 = () => {
 const API = "http://localhost:5000"
  const token = localStorage.getItem("appraisal_token");
  const decoded = jwtDecode(token);
  const designation = decoded.designation;
  const username = decoded.facultyName;
  const { markData } = useContext(Data);

  // State
  const [firstDropdown, setFirstDropdown] = useState(false);
  const [secondDropdown, setSecondDropdown] = useState(false);
  const [projectGuidance, setProjectGuidance] = useState(null);
  const [studentPublication, setStudentPublication] = useState(null);
  const [projectPublication, setProjectPublication] = useState("");
  const [none, setNone] = useState(true); // ✅ boolean instead of string
  const [files, setFiles] = useState([]);

  // Refs
  const firstDropdownRef = useRef(null);
  const secondDropdownRef = useRef(null);

  // API call for dropdown changes
  const handleApiCall = async (value, type) => {
    if (type === "guidance") setProjectGuidance(value);
    if (type === "publication") setStudentPublication(value);

    setFirstDropdown(false);
    setSecondDropdown(false);

    const publications = {
      projectGuidance: type === "guidance" ? value : projectGuidance,
      studentPublication: type === "publication" ? value : studentPublication,
      None: false,
    };

    const formData = new FormData();
    formData.append("publications", JSON.stringify(publications));
    formData.append("facultyName", username);

    try {
      const res = await axios.post(
        `${API}/api/publications/${designation}`,
        formData,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setProjectPublication(res.data.finalMarks);
    } catch (err) {
      console.error("Dropdown API error:", err.response?.data || err.message);
    }
  };

  // Handle None checkbox
  const handleNone = async () => {
    const newNone = !none;
    setNone(newNone);

    if (newNone) {
      // ✅ Clear everything when "None" is checked
      setProjectGuidance(null);
      setStudentPublication(null);
      setFiles([]);
    }

    const publications = {
      projectGuidance: newNone ? 0 : projectGuidance,
      studentPublication: newNone ? 0 : studentPublication,
      None: newNone,
    };

    const formData = new FormData();
    formData.append("publications", JSON.stringify(publications));
    formData.append("facultyName", username);

    try {
      const res = await axios.post(
        `${API}/api/publications/${designation}`,
        formData,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setProjectPublication(res.data.finalMarks);
    } catch (err) {
      console.error("None API error:", err.response?.data || err.message);
    }
  };

  // Handle click outside dropdowns
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (firstDropdownRef.current && !firstDropdownRef.current.contains(e.target)) {
        setFirstDropdown(false);
      }
      if (secondDropdownRef.current && !secondDropdownRef.current.contains(e.target)) {
        setSecondDropdown(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // File upload
  const handleFileUpload = async (e) => {
    if (none) {
      toast.error("Cannot upload files when 'None' is selected");
      e.target.value = "";
      return;
    }

    try {
      const newFiles = Array.from(e.target.files);
      if (!newFiles.length) return toast.error("No file selected");

      // File size check (max 1 MB)
      const sizeFilteredFiles = newFiles.filter((file) => {
        if (file.size > 1 * 1024 * 1024) {
          toast.error(`${file.name} is larger than 1 MB`);
          return false;
        }
        return true;
      });

      if (!sizeFilteredFiles.length) {
        e.target.value = "";
        return;
      }

      // Max files limit check (1 file allowed)
      if (files.length + sizeFilteredFiles.length > 1) {
        toast.error("You can only upload a maximum of 1 file.");
        e.target.value = "";
        return;
      }

      // Remove duplicates
      const uniqueFiles = sizeFilteredFiles.filter(
        (file) => !files.some((f) => f.name === file.name)
      );
      if (!uniqueFiles.length) {
        e.target.value = "";
        return;
      }

      setFiles([...files, ...uniqueFiles]);

      // Prepare FormData
      const publications = {
        projectGuidance: projectGuidance || 0,
        studentPublication: studentPublication || 0,
        None: false,
      };

      const formData = new FormData();
      formData.append("publications", JSON.stringify(publications));
      formData.append("facultyName", username);

      uniqueFiles.forEach((file) => {
        formData.append("studentProjectFiles", file);
      });

      // API call
      const res = await axios.post(
        `${API}/api/publications/${designation}`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
          },
        }
      );

      setProjectPublication(res.data.finalMarks);
      // toast.success("File uploaded successfully!");
    } catch (err) {
      console.error("Upload failed:", err.response?.data || err.message);
      toast.error("Upload failed!");
    } finally {
      e.target.value = "";
    }
  };

  // File remove
  const removeFile = async (index) => {
    const fileName = encodeURIComponent(files[index].name);

    try {
      await axios.delete(`${API}/api/deleteImage`, {
        headers: { Authorization: `Bearer ${token}` },
        data: { keyword: "studentProjectFiles" },
      });

      if (files[index].preview) {
        URL.revokeObjectURL(files[index].preview);
      }

      const updatedFiles = [...files];
      updatedFiles.splice(index, 1);
      setFiles(updatedFiles);

      // toast.success(`${decodeURIComponent(fileName)} deleted successfully`);
    } catch (error) {
      console.error("Error deleting file:", error.response?.data || error.message);
    }
  };

  return (
    <div className="main-container border p-5 border-[#AAAAAA] bg-white rounded-xl">
      <div className="input-container-3 grid gap-4 grid-cols-12">
        {/* First Section */}
        <div className="first-container pr-3 border-r border-gray-400 col-span-10">
          <h1 className="text-lg font-medium">
            6. Student Project and Publications <span className="text-red-500">*</span>
          </h1>

          {/* Project Guidance */}
          <h1 className="text-lg text-[#646464] font-medium mt-1">
            1. U.G / P.G. Project Guidance - 1 Point (per Student/Max -2 Students)
          </h1>
          <div
            ref={firstDropdownRef}
            className="dropdwon-container relative mt-2 ml-3 w-[220px] border rounded"
          >
            <div
              onClick={() => !none && setFirstDropdown(!firstDropdown)} // ✅ disable when None selected
              className={`header flex items-center justify-between px-2 py-2 cursor-pointer ${
                none ? "bg-gray-100 text-gray-400 cursor-not-allowed" : ""
              }`}
            >
              <h1>{projectGuidance !== null ? projectGuidance : "Number of projects"}</h1>
              <ChevronDown
                className={`${firstDropdown ? "rotate-180" : "rotate-0"} transition-all duration-300`}
              />
            </div>
            {firstDropdown && !none && (
              <div className="dropdown w-full z-10 absolute top-full shadow-lg border bg-gray-50">
                {[0, 1, 2, 3, 4, 5].map((num) => (
                  <button
                    key={num}
                    onClick={() => handleApiCall(num, "guidance")}
                    className="w-full py-2 text-left px-2 hover:bg-gray-200 border-b"
                  >
                    {num}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Student Publication */}
          <h1 className="text-lg text-[#646464] font-medium mt-1">
            2. Projects converted to Student Publication (Scopus/WoS) – 2 Points (per paper)
          </h1>
          <div
            ref={secondDropdownRef}
            className="dropdwon-container relative mt-2 ml-3 w-[260px] border rounded"
          >
            <div
              onClick={() => !none && setSecondDropdown(!secondDropdown)} // ✅ disable when None selected
              className={`header flex items-center justify-between gap-4 px-2 py-2 cursor-pointer ${
                none ? "bg-gray-100 text-gray-400 cursor-not-allowed" : ""
              }`}
            >
              <h1>{studentPublication !== null ? studentPublication : "Number of Publication"}</h1>
              <ChevronDown
                className={`${secondDropdown ? "rotate-180" : "rotate-0"} transition-all duration-300`}
              />
            </div>
            {secondDropdown && !none && (
              <div className="dropdown w-full z-10 absolute top-full shadow-lg border bg-gray-50">
                {[0, 1, 2, 3, 4, 5].map((num) => (
                  <button
                    key={num}
                    onClick={() => handleApiCall(num, "publication")}
                    className="w-full py-2 text-left px-2 hover:bg-gray-200 border-b"
                  >
                    {num}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* None Checkbox */}
          <div className="none-container mt-2 flex gap-3">
            <input
              type="checkbox"
              className="accent-teal-500 border scale-125 cursor-pointer"
              checked={none}
              onChange={handleNone}
            />
            <label>None</label>
          </div>

          {/* File Upload */}
          {!none && (
            <div className="mt-2 ">
              <div className="border-2 relative border-dashed border-[#3ab5a3] rounded-md p-4 text-center cursor-pointer">
                <label className="cursor-pointer text-gray-600 flex items-center justify-center gap-3">
                  <span className="text-xl">
                    <UploadCloud />
                  </span>
                  Drag and drop the file here or{" "}
                  <span className="underline text-teal-500">choose file</span>
                </label>
                <input
                  type="file"
                  className="absolute top-0 right-0 left-0 bottom-0 opacity-0"
                  onChange={handleFileUpload}
                  accept=".jpeg,.jpg,.png,.pdf,.doc,.docx"
                />
                <h1 className="text-sm mt-2 text-blue-400">
                  Compress files into a single file. <span className="text-red-300">*</span>
                </h1>
                <ToastContainer />
              </div>

              {/* Uploaded Files */}
              <div className="mt-4 flex flex-wrap gap-2">
                {files?.map((fileObj, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between bg-gray-50 px-3 py-2 rounded border"
                  >
                    <span className="text-sm text-gray-700">
                      {fileObj.name.length > 25 ? fileObj.name.slice(0, 12) + "..." : fileObj.name}
                    </span>
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

        {/* Second Section */}
        <div className="second-container col-span-2 text-center">
          <h1 className="text-lg font-medium">Marks</h1>
          <div className="h-[80%] flex items-center justify-center">
            <h1 className="text-[#646464] text-lg">
              <span className="font-semibold text-[#318179]">{projectPublication || 0}</span>{" "}
              out of {markData?.points?.projectPublication}
            </h1>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TeachingForm6;
