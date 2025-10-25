import { ChevronDown, Upload, UserStar } from "lucide-react";
import React, { useState, useContext, useEffect } from "react";
import { UploadCloud } from "lucide-react";
import axios from "axios";
import { jwtDecode } from "jwt-decode";
import { Data } from "../../Context/Store";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const TeachingForm10 = () => {
  const API = import.meta.env.VITE_API
  const token = localStorage.getItem("appraisal_token");
  const decoded = jwtDecode(token);
  const designation = decoded.designation;
  const username = decoded.facultyName;

  const [files, setFiles] = useState([]);
  const [selectedValue, setSelectedValue] = useState("No");
  const [mouSigned, setMouSigned] = useState([]);
  const [mouSignedmark, setMouSignedmark] = useState("");
  const [yesNo, setYesNo] = useState("No");
  const { markData } = useContext(Data);
  const [facultyDevelopmentAttendedFile, setFacultyDevelopmentAttendedFile] =
    useState([]);

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

  // const handleFileChange = (e) => {
  //   // console.log("running")
  //   const selectedFiles = Array.from(e.target.files);
  //   const validFiles = filterValidFiles(selectedFiles);
  //   const filePreviews = validFiles.map((file) => ({
  //     file,
  //     preview: file.type.startsWith("image") ? URL.createObjectURL(file) : null,
  //   }));
  //   setMouSigned((prev) => [...prev, ...filePreviews]);
  //   // console.log("mou selected files : ", selectedFiles)
  // };

  const handleDrop = (e) => {
    e.preventDefault();
    const droppedFiles = Array.from(e.dataTransfer.files);
    const validFiles = filterValidFiles(droppedFiles);
    const filePreviews = validFiles.map((file) => ({
      file,
      preview: file.type.startsWith("image") ? URL.createObjectURL(file) : null,
    }));
    setMouSigned((prev) => [...prev, ...filePreviews]);
  };

  const handleLaboratoryTypeChange = async (selectedValue) => {
    if (!selectedValue || !designation || !token) {
      console.error("Missing required values", {
        selectedValue,
        designation,
        token,
      });
      return;
    }

    setSelectedValue(selectedValue);
    // console.log("name : ", username);
    try {
      const response = await axios.post(
        `${API}/api/industryInvolvement/${designation}`,
        {
          industryInvolvement: selectedValue,
          facultyName: username, // ✅ Add faculty name here
        }, // You may want to rename "Programs" to something like "Involvement" if that's what it really is
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      // console.log("Industry involvement submitted:", response.data);
      setMouSignedmark(response.data.finalMarks);
    } catch (error) {
      console.error(
        "Error submitting industry involvement:",
        error.response?.data || error.message
      );
    }
  };

  async function handleFileUpload(e) {
    const newFiles = Array.from(e.target.files); // Files just selected

    // 1️⃣ No file selected
    if (!newFiles.length) {
      console.warn("No file selected");
      return;
    }

    // 2️⃣ File size check (max 2 MB)
    const sizeFilteredFiles = newFiles.filter((file) => {
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

    // 3️⃣ Max files limit check (max 3)
    if (files.length + sizeFilteredFiles.length > 1) {
      toast.error("You can only upload a maximum of 1 files.");
      e.target.value = "";
      return;
    }

    // 4️⃣ Remove duplicates based on file name
    const uniqueFiles = sizeFilteredFiles.filter(
      (file) => !files.some((existingFile) => existingFile.name === file.name)
    );

    if (uniqueFiles.length === 0) {
      e.target.value = "";
      return;
    }

    // 5️⃣ Update file list
    const updatedFiles = [...files, ...uniqueFiles];
    setFiles(updatedFiles);

    // 6️⃣ Prepare FormData
    const formData = new FormData();
    formData.append("industryInvolvement", yesNo);

    if (!decoded?.facultyName) {
      console.error("Faculty name is missing");
      return;
    }
    formData.append("facultyName", decoded.facultyName);

    updatedFiles.forEach((file) => {
      formData.append("IndustryFiles", file);
    });

    // 7️⃣ API request
    try {
      const response = await axios.post(
        `${API}/api/industryInvolvement/${designation}`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setMouSignedmark(response.data.finalMarks);
    } catch (error) {
      console.error(
        "Error submitting industry involvement:",
        error.response?.data || error.message
      );
    }

    // 8️⃣ Reset input so same file can be re-selected
    e.target.value = "";
  }
  // const removeFile = (index) => {
  //   setFiles((prevFiles) => {
  //     // Revoke preview URL if it exists to avoid memory leaks
  //     if (prevFiles[index]?.preview) {
  //       URL.revokeObjectURL(prevFiles[index].preview);
  //     }
  //     // Remove the file from the array
  //     return prevFiles.filter((_, i) => i !== index);
  //   });
  // };

  // console.log("=========================== my files ====> : ", files);
  const removeFile = async (index) => {
    if (!files || !files[index]) {
      toast.error("File not found");
      return;
    }

    const fileName = encodeURIComponent(files[index].name);

    try {
      const res = await axios.delete(
        `${API}/api/deleteImage`,
        { headers: { Authorization: `Bearer ${token}` },
      data: { keyword: "IndustryFiles" }, }
      );

      console.log("Response status:", res.status);
      console.log("Response data:", res.data);

      // ✅ Normal success
      handleFileRemoval(index, decodeURIComponent(fileName));
    } catch (error) {
      const msg = error.response?.data?.message;
      console.log("Error status:", error.response?.status, "Message:", msg);

      if (msg === "File deleted successfully") {
        // ✅ Treat non-200 "success" as actual success
        handleFileRemoval(index, decodeURIComponent(fileName));
      } else {
        // toast.error("Failed to delete file");
      }
    }
  };

  // Helper to remove file from state & show toast
  const handleFileRemoval = (index, fileName) => {
    if (files[index]?.preview) {
      URL.revokeObjectURL(files[index].preview);
    }

    setFiles(prev => {
      const updated = [...prev];
      updated.splice(index, 1);
      return updated;
    });

    if (files.length - 1 < 3) setFileError("");

    toast.success(`${fileName} deleted successfully`);
  };


  return (
    <>
      <div className="main-container border p-5 border-[#AAAAAA] bg-white rounded-xl  ">
        <div className="input-container-3 grid gap-4 grid-cols-12">
          <div className="first-container pr-3 border-r border-gray-400 col-span-10">
            <div>
              <h1 className="text-lg font-medium">
                 MoU Signed with Industries / Establishment of a Laboratory
                in Collaboration with an Industry / Involvement in CoE
                activities. <span className="text-red-500">*</span>
              </h1>
            </div>
            <div
              className={`radio-button-container space-y-2 px-2 py-2 rounded-lg mt-2 text-[#646464] font-medium`}
            >
              <div className="flex gap-4 mt-2">
                <label className="flex items-center gap-2">
                  <input
                    className="scale-125 accent-teal-400 cursor-pointer"
                    type="checkbox"
                    checked={yesNo === "Yes"}
                    onChange={() => {
                      setYesNo("Yes");
                      handleLaboratoryTypeChange("Yes");
                    }}
                  />
                  Yes
                </label>
                <label className="flex items-center gap-2">
                  <input
                    className="scale-125 accent-teal-400 cursor-pointer"
                    type="checkbox"
                    checked={yesNo === "No"}
                    onChange={() => {
                      setYesNo("No");
                      handleLaboratoryTypeChange("No");
                    }}
                  />
                  No
                </label>
              </div>
            </div>
            {/* ======================= File attachment =====================  */}
            {yesNo == "Yes" && (
              <div className="mt-2 ">
                <div
                  onDrop={handleDrop}
                  onDragOver={(e) => e.preventDefault()}
                  className="border-2 border-dashed relative border-[#3ab5a3] rounded-md p-4 text-center cursor-pointer"
                >
                  <label className="cursor-pointer text-gray-600 flex items-center justify-center gap-3">
                    <span className="text-xl">
                      {" "}
                      <UploadCloud />{" "}
                    </span>{" "}
                    Drag and drop the files here or{" "}
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

                <div className="mt-4 space-y-2  flex items-start gap-2">
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
          <div className="second-container col-span-2 text-center">
            <h1 className="text-lg font-medium">Marks</h1>
            <div className="h-[80%] flex items-center justify-center">
              <h1 className="text-[#646464]  text-lg">
                <span className="font-semibold text-[#318179]">
                  {mouSignedmark || 0}
                </span>{" "}
                out of {markData?.points?.industryInvolvement}
              </h1>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default TeachingForm10;
