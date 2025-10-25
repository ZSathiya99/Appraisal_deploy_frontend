import { React, useContext, useState } from "react";
import { ChevronDown, Upload, UserStar, UploadCloud, X } from "lucide-react";
import { jwtDecode } from "jwt-decode";
import axios from "axios";
import { Data } from "../../Context/Store";

const ServiceForm6 = () => {
 const API = "http://localhost:5000"
  const token = localStorage.getItem("appraisal_token");
  const decoded = jwtDecode(token);
  const designation = decoded.designation;
  const username = decoded.facultyName;
  // states
  const { serviceMarks } = useContext(Data);

  const [selectedCheck, setSelectedCheck] = useState("");
  const [files, setFiles] = useState([]);
  const [mark, setMark] = useState(0);

  // consoles
  console.log("selected check : ", selectedCheck);

  // function for handling radio button click
  const handleCheckbox = async (value) => {
    console.log("running 3.6 index");
    const formData = {};
    formData.training = value;
    (formData.facultyName = username), setSelectedCheck(value);
    try {
      const response = await axios.post(
        `${API}/api/training/${designation}`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      console.log("res training index : ", response);
      setMark(response.data.finalMarks);
    } catch (err) {
      console.error("err : ", err.message);
    }
  };

  // function for handling file uploads
  const handleFileUpload = async (e) => {
    const uploadedFiles = Array.from(e.target.files);

    // Validate file size
    const validFiles = uploadedFiles.filter((file) => {
      if (file.size > 1 * 1024 * 1024) {
        alert(`"${file.name}" is larger than 1MB and will not be uploaded.`);
        return false;
      }
      return true;
    });

    // Validate file count
    const totalFiles = [...files, ...validFiles];
    if (totalFiles.length > 1) {
      alert("More than 1 files are not allowed");
      return;
    }

    setFiles(totalFiles);
    e.target.value = "";

    // Prepare FormData
    const formData = new FormData();

    // Append files
    totalFiles.forEach((file) => formData.append("trainingFiles", file));

    // Append other data
    formData.append("facultyName", username);
    formData.append("training ", selectedCheck);

    try {
      const response = await axios.post(
        `${API}/api/training/${designation}/`,
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
    // const fileName = encodeURIComponent(files[index].name); // encode to handle spaces & special chars
    const fileName = files[index].name;

    try {
      // API call to delete image with fileName in URL
      await axios.delete(
        `${API}/api/deleteImage`,
        {
          headers: { Authorization: `Bearer ${token}` },
           data: { keyword: "trainingFiles" }, 
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
      {serviceMarks?.Training == 0 ? (
        ""
      ) : (
        <div className="input-container-2 border border-[#AAAAAA] p-4  bg-white  rounded-xl grid gap-4 grid-cols-12">
          <div className="first-container pr-3 border-r border-gray-400 col-span-10">
            {/* .heading / question  */}
            <div>
              <h1 className="text-lg font-medium">
                 Organizing/Handling Training Progremme for External
                Participants <span className="text-red-500">*</span>
              </h1>
              <p className="text-gray-400 font-medium px-6">
                3 days and above - 5 Points || 2 days - 3 Points || 1 day - 1
                Point
              </p>
            </div>
            {/* input container  */}
            <div className="checkbox-container mt-2 px-6 space-y-2">
              <div className="container-1 flex items-center gap-2">
                <input
                  type="radio"
                  className="scale-125 cursor-pointer"
                  checked={selectedCheck == "1 day" ? true : false}
                  onChange={() => {
                    handleCheckbox("1 day");
                  }}
                />
                <label className="text-[#6f7282]">1 Day</label>
              </div>
              <div className="container-1 flex items-center gap-2">
                <input
                  type="radio"
                  className="scale-125 cursor-pointer"
                  checked={selectedCheck == "2 days" ? true : false}
                  onChange={() => {
                    handleCheckbox("2 days");
                  }}
                />
                <label className="text-[#6f7282]">2 Days</label>
              </div>
              <div className="container-1 flex items-center gap-2">
                <input
                  type="radio"
                  className="scale-125 cursor-pointer"
                  checked={selectedCheck == "3 days & above" ? true : false}
                  onChange={() => {
                    handleCheckbox("3 days & above");
                  }}
                />
                <label className="text-[#6f7282]">3 Days & Above</label>
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
              <div className="dropdown-attachment-container px-6">
                {/* Attachment */}
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
                    onChange={(e) => handleFileUpload(e)}
                    accept=".jpeg,.jpg,.png,.pdf,.doc,.docx"
                    multiple
                  />
                  <h1 className="text-sm mt-2 text-blue-400 ">
                    Compress files into a single file.{" "}
                    <span className="text-red-300">*</span>
                  </h1>
                </div>

                {/* Attachment preview */}
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
          </div>
          {/* marks container  */}
          <div className="second-container col-span-2 text-center">
            <h1 className="text-lg font-medium">Marks</h1>
            <div className="h-[80%] flex items-center justify-center">
              <h1 className="text-[#646464]  text-lg">
                <span className="font-semibold text-[#318179]">{mark}</span> out
                of {serviceMarks?.Training}
              </h1>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default ServiceForm6;
