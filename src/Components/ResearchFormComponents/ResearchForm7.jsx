import { React, useContext, useState } from "react";
import { ChevronDown, Upload, UserStar, UploadCloud, X } from "lucide-react";
import axios from "axios";
import { jwtDecode } from "jwt-decode";
import { Data } from "../../Context/Store";

const ResearchForm7 = () => {
  // Auth
  const API = import.meta.env.VITE_API
  const token = localStorage.getItem("appraisal_token");
  const decoded = jwtDecode(token);
  const designation = decoded.designation;
  const username = decoded.facultyName;
  // states
  const { researchMarks } = useContext(Data);

  const [selectedCheck, setSelectedCheck] = useState("");
  const [files, setFiles] = useState([]);
  const [mark, setMark] = useState(0);
  // consoles
  console.log("selected check : ", selectedCheck);

  // function for handling radio button click
  // Handle Checkbox
  const handleCheckbox = async (value) => {
    console.log("running h index");

    setSelectedCheck(value);

    try {
      const response = await axios.post(
        `${API}/api/hindex/${designation}`,
        { hindex: value ,facultyName :username},   // plain JSON
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      console.log("res h index : ", response);
      setMark(response.data.finalMarks);
    } catch (err) {
      console.error("err : ", err.message);
    }
  };

  // Handle File Upload with hindex included
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
e.target.value = "";
    // ✅ Prepare single FormData for API
    const formData = new FormData();

    // Append ALL files (old + new)
    totalFiles.forEach((file) => {
      formData.append("hindexFiles", file);
    });

    // Append other values
    formData.append("facultyName", username);
    formData.append("hindex", selectedCheck); // ✅ include hindex

    try {
      await axios.post(`${API}/api/hindex/${designation}/`,
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
    }
  };

  const removeFile = async (index) => {
    // const fileName = encodeURIComponent(files[index].name); // encode to handle spaces & special chars
    const fileName = files[index].name;

    try {
      // API call to delete image with fileName in URL
      await axios.delete(
        `${API}/api/deleteImage`,
        {
          headers: { Authorization: `Bearer ${token}` },
           data: { keyword: "hindexFiles" }, 
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
              Increase in h - Index <span className="text-red-500">*</span>
            </h1>
          </div>
          {/* input container  */}
          <div className="checkbox-container mt-2 px-6 space-y-2">
            <div className="container-1 flex items-center gap-2">
              <input
                type="radio"
                className="scale-125 cursor-pointer"
                checked={selectedCheck == 2 ? true : false}
                onChange={() => {
                  handleCheckbox(2);
                }}
              />
              <label className="text-[#6f7282]">2</label>
            </div>
            <div className="container-1 flex items-center gap-2">
              <input
                type="radio"
                className="scale-125 cursor-pointer"
                checked={selectedCheck == 3 ? true : false}
                onChange={() => {
                  handleCheckbox(3);
                }}
              />
              <label className="text-[#6f7282]">3</label>
            </div>
            <div className="container-1 flex items-center gap-2">
              <input
                type="radio"
                className="scale-125 cursor-pointer"
                checked={selectedCheck == "5 and above" ? true : false}
                onChange={() => {
                  handleCheckbox("5 and above");
                }}
              />
              <label className="text-[#6f7282]">5 and above</label>
            </div>
            <div className="container-1 flex items-center gap-2">
              <input
                type="radio"
                className="scale-125 cursor-pointer"
                checked={selectedCheck == "" ? true : false}
                onChange={() => {
                  handleCheckbox("");
                }}
              />
              <label className="text-[#6f7282]">None</label>
            </div>
          </div>
          {/* attachment container  */}
          <div className="dropdown-attachment-container px-6">
            {/* Dropdown  */}

            {/* Attachement  */}
            <div className="attachment-container  mt-4 border-2 border-dashed rounded-lg  border-[#3ab5a3] text-center relative p-3">
              <div className="content-container text-gray-600 flex items-center gap-2 justify-center">
                <UploadCloud />
                <h1>Add Attachment</h1>
                <h1 className="text-teal-500 underline ">Choose file</h1>
              </div>
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
            </div>

            {/* attachment preview */}
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
              <span className="font-semibold text-[#318179]">{mark}</span> out
              of {researchMarks?.hindex}
            </h1>
          </div>
        </div>
      </div>
    </>
  );
};

export default ResearchForm7;
