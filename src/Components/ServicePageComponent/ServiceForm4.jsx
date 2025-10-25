import React, { useContext, useEffect, useState } from "react";
import { ChevronDown, UploadCloud } from "lucide-react";
import { Data } from "../../Context/Store";
import { jwtDecode } from "jwt-decode";
import axios from "axios";

const ServiceForm4 = () => {
  const API = "http://localhost:5000";

  const token = localStorage.getItem("appraisal_token");
  const decoded = jwtDecode(token);
  const designation = decoded.designation;
  const username = decoded.facultyName;

  const { serviceMarks } = useContext(Data);

  const [selectedCheck, setSelectedCheck] = useState("No");
  const [externalProgramCount, setExternalProgramCount] = useState(0);

  const [selectedCheck2, setSelectedCheck2] = useState("No");
  const [externalEventsCount, setExternalEventsCount] = useState(0);
  const [rolesvalues, setRolesvalues] = useState(0);

  const [dropdown1, setDropdown1] = useState(false);
  const [dropdown2, setDropdown2] = useState(false);

  const [files, setFiles] = useState([]);
  const [mark, setMark] = useState(0);

  // === API Call ===
  const sendApi = async (programCount, eventCount, check1, check2) => {
    try {
      const resourcePersonMarks = check1 === "Yes" ? programCount * 2 : 0;
      const eventsMarks = check2 === "Yes" ? eventCount * 1 : 0;

      const cocurricular = [
        { role: "ResourcePerson", count: programCount },
        { role: "Events", count: eventCount },
      ];
      setRolesvalues(cocurricular);
      // ✅ use FormData
      const formData = new FormData();

      // append cocurricular (as string)
      formData.append("cocurricular", JSON.stringify(cocurricular));

      // append facultyName separately
      formData.append("facultyName", username);

      // append files if you have any
      // totalFiles.forEach((file) => formData.append("externalFiles", file));

      const response = await axios.post(
        `${API}/api/cocurricular/${designation}`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data", // ✅ important
          },
        }
      );

      setMark(response.data.finalMarks);
      console.log("API Response:", response.data);
    } catch (err) {
      console.error("Post API failed:", err.message);
    }
  };

  // Trigger API whenever values change
  useEffect(() => {
    sendApi(
      externalProgramCount,
      externalEventsCount,
      selectedCheck,
      selectedCheck2
    );
  }, [
    selectedCheck,
    externalProgramCount,
    selectedCheck2,
    externalEventsCount,
  ]);

  // === File Upload ===
  const handleFileUpload = async (e) => {
    const uploadedFiles = Array.from(e.target.files);

    const validFiles = uploadedFiles.filter((file) => {
      if (file.size > 5 * 1024 * 1024) {
        alert(`"${file.name}" is larger than 5MB and will not be uploaded.`);
        return false;
      }
      return true;
    });

    const totalFiles = [...files, ...validFiles];
    if (totalFiles.length > 1) {
      alert("Only 1 file is allowed");
      return;
    }

    setFiles(totalFiles);
    e.target.value = "";

    const formData = new FormData();

    // append files
    totalFiles.forEach((file) => formData.append("externalFiles", file));

    // append cocurricular (stringified array of objects only)
    formData.append("cocurricular", JSON.stringify(rolesvalues));

    // append facultyName separately
    formData.append("facultyName", username);

    try {
      const response = await axios.post(
        `${API}/api/cocurricular/${designation}/`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
          },
        }
      );
      console.log("Upload successful", response.data);
    } catch (err) {
      console.error("File upload failed:", err);
    }
  };

  const removeFile = async (index) => {
    const fileName = files[index].name;
    try {
      await axios.delete(`${API}/api/deleteImage`, {
        headers: { Authorization: `Bearer ${token}` },
        data: { keyword: "externalFiles" },
      });

      if (files[index].preview) URL.revokeObjectURL(files[index].preview);

      const updatedFiles = [...files];
      updatedFiles.splice(index, 1);
      setFiles(updatedFiles);

      document.getElementById("file-upload").value = "";
    } catch (error) {
      console.error(
        "Error deleting file:",
        error.response?.data || error.message
      );
    }
  };

  return (
    <div className="input-container-2 border border-[#AAAAAA] p-4 bg-white rounded-xl grid gap-4 grid-cols-12">
      <div className="first-container pr-3 border-r border-gray-400 col-span-10">
        <h1 className="text-lg font-medium">
          Co-curricular and Extra-curricular Outreach Programme{" "}
          <span className="text-red-500">*</span>
        </h1>
        <h1 className="text-gray-400 font-medium px-6">
          External Programmes acted as Resource Person – 2 Points / Programme
        </h1>

        {/* Yes/No for Resource Person */}
        <div className="checkbox-container px-6 mt-2 flex items-center gap-4">
          <label className="flex gap-2 items-center">
            <input
              type="checkbox"
              className="scale-125 cursor-pointer"
              checked={selectedCheck === "Yes"}
              onChange={() => setSelectedCheck("Yes")}
            />
            <span className="text-gray-400">Yes</span>
          </label>
          <label className="flex gap-2 items-center">
            <input
              type="checkbox"
              className="scale-125 cursor-pointer"
              checked={selectedCheck === "No"}
              onChange={() => {
                setSelectedCheck("No");
                setExternalProgramCount(0);
              }}
            />
            <span className="text-gray-400">No</span>
          </label>
        </div>

        {/* Dropdown for Programs */}
        {selectedCheck === "Yes" && (
          <div className="dropdown-container relative mt-2 mx-6 p-2 border rounded-md">
            <div className="header flex items-center justify-between gap-4">
              <h1>{externalProgramCount || "Number of Programs"}</h1>
              <ChevronDown
                onClick={() => setDropdown1(!dropdown1)}
                className={`text-gray-600 w-8 h-8 cursor-pointer ${
                  dropdown1 && "rotate-180"
                }`}
              />
            </div>
            {dropdown1 && (
              <div className="content-container absolute z-10 bg-white w-full border rounded-md top-full left-0 shadow-xl">
                {[1, 2, 3, 4, 5].map((num) => (
                  <button
                    key={num}
                    onClick={() => {
                      setExternalProgramCount(num);
                      setDropdown1(false);
                    }}
                    className="w-full px-3 py-1 text-left hover:bg-gray-100"
                  >
                    {num}
                  </button>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Events Section */}
        <h1 className="text-lg font-medium mt-4 px-6">
          Participated in External Events – 1 Point / Event
        </h1>
        <div className="checkbox-container mt-2 flex items-center gap-4 px-6">
          <label className="flex gap-2 items-center">
            <input
              type="checkbox"
              className="scale-125 cursor-pointer"
              checked={selectedCheck2 === "Yes"}
              onChange={() => setSelectedCheck2("Yes")}
            />
            <span className="text-gray-400">Yes</span>
          </label>
          <label className="flex gap-2 items-center">
            <input
              type="checkbox"
              className="scale-125 cursor-pointer"
              checked={selectedCheck2 === "No"}
              onChange={() => {
                setSelectedCheck2("No");
                setExternalEventsCount(0);
              }}
            />
            <span className="text-gray-400">No</span>
          </label>
        </div>

        {/* Dropdown for Events */}
        {selectedCheck2 === "Yes" && (
          <div className="dropdown-container relative mt-2 mx-6 p-2 border rounded-md">
            <div className="header flex items-center justify-between gap-4">
              <h1>{externalEventsCount || "Number of Events"}</h1>
              <ChevronDown
                onClick={() => setDropdown2(!dropdown2)}
                className={`text-gray-600 w-8 h-8 cursor-pointer ${
                  dropdown2 && "rotate-180"
                }`}
              />
            </div>
            {dropdown2 && (
              <div className="content-container absolute z-10 bg-white w-full border rounded-md top-full left-0 shadow-xl">
                {[1, 2, 3, 4, 5].map((num) => (
                  <button
                    key={num}
                    onClick={() => {
                      setExternalEventsCount(num);
                      setDropdown2(false);
                    }}
                    className="w-full px-3 py-1 text-left hover:bg-gray-100"
                  >
                    {num}
                  </button>
                ))}
              </div>
            )}
          </div>
        )}

        {/* File Upload */}
        {(selectedCheck === "Yes" || selectedCheck2 === "Yes") && (
          <div className="dropdown-attachment-container px-6">
            <div className="attachment-container mt-4 border-2 border-dashed rounded-lg border-[#3ab5a3] text-center relative p-3">
              <div className="content-container text-gray-600 flex items-center gap-2 justify-center">
                <UploadCloud />
                <h1>Add Attachment</h1>
                <h1 className="text-teal-500 underline">Choose file</h1>
              </div>
              <input
                id="file-upload"
                type="file"
                className="absolute top-0 right-0 left-0 bottom-0 opacity-0"
                onChange={handleFileUpload}
                accept=".jpeg,.jpg,.png,.pdf,.doc,.docx"
              />
              <h1 className="text-sm mt-2 text-blue-400 ">
                Compress files into a single file.{" "}
                <span className="text-red-300">*</span>
              </h1>
            </div>

            {/* Preview */}
            <div className="mt-4 flex items-start gap-2 overflow-auto">
              {files?.map((fileObj, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between bg-gray-50 px-3 py-2 rounded border"
                >
                  <span className="text-sm text-gray-700">
                    {fileObj.name.length > 25
                      ? fileObj.name.slice(0, 12) + "..."
                      : fileObj.name}
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

      {/* Marks */}
      <div className="second-container col-span-2 text-center">
        <h1 className="text-lg font-medium">Marks</h1>
        <div className="h-[80%] flex items-center justify-center">
          <h1 className="text-[#646464] text-lg">
            <span className="font-semibold text-[#318179]">{mark || 0}</span>{" "}
            out of {serviceMarks?.External}
          </h1>
        </div>
      </div>
    </div>
  );
};

export default ServiceForm4;
