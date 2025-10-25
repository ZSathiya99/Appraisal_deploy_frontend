import { ChevronDown, Upload, UserStar } from "lucide-react";
import React, { useState, useEffect, useContext } from "react";
import { UploadCloud } from "lucide-react";
import axios from "axios";
import { jwtDecode } from "jwt-decode";
import { Data } from "../../Context/Store";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
const TeachingForm5 = () => {
  const API = "http://localhost:5000";
  const token = localStorage.getItem("appraisal_token");
  const decoded = jwtDecode(token);
  const designation = decoded.designation;
  const username = decoded.facultyName;
  const { markData } = useContext(Data);
  const [isDropDown, setIsDropdown] = useState(false);
  const [OrganizingGuestFile, setOrganizingGuestFiles] = useState([]);
  const [visitingType, setVisitingType] = useState("None");
  const [outOfMarks, setOutOfMarks] = useState({ teaching: 0 });
  const [guestLecturemark, setGuestLecturemark] = useState("");
  const [guest, setGuest] = useState();
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

  const handleFileChange = (e) => {
    const selectedFiles = Array.from(e.target.files);
    const validFiles = filterValidFiles(selectedFiles);
    const filePreviews = validFiles.map((file) => ({
      file,
      preview: file.type.startsWith("image") ? URL.createObjectURL(file) : null,
    }));
    setOrganizingGuestFiles((prev) => [...prev, ...filePreviews]);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    const droppedFiles = Array.from(e.dataTransfer.files);
    const validFiles = filterValidFiles(droppedFiles);
    const filePreviews = validFiles.map((file) => ({
      file,
      preview: file.type.startsWith("image") ? URL.createObjectURL(file) : null,
    }));
    setOrganizingGuestFiles((prev) => [...prev, ...filePreviews]);
  };
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

  const removeFile = async (index) => {
    const fileName = encodeURIComponent(files[index].name);
    console.log("indexcc", fileName); // encode to handle spaces & special chars
    console.log("index", index);
    try {
      // API call to delete image with fileName in URL
      await axios.delete(`${API}/api/deleteImage`, {
        headers: { Authorization: `Bearer ${token}` },
        data: { keyword: "GuestLectureFiles" },
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

      toast.success(`${decodeURIComponent(fileName)} deleted successfully`);
    } catch (error) {
      console.error(
        "Error deleting file:",
        error.response?.data || error.message
      );
      // toast.error("Failed to delete file");
    }
  };
  const [selectedValues, setSelectedValues] = useState(null);
  const handleVisitingTypeChange = async (selectedValue) => {
    setSelectedValues(selectedValue);
    try {
      setVisitingType(selectedValue); // update state immediately

      const response = await axios.post(
        `${API}/api/guestLecture/${designation}`, // ✅ fixed double slash
        {
          GuestLecture: selectedValue,
          facultyName: username,
        },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`, // include token if your API is protected
          },
        }
      );

      setGuestLecturemark(response.data.finalMarks);
    } catch (error) {
      console.error(
        "Error submitting teaching type:",
        error.response?.data || error.message
      );
    }
  };
  const handleFileUpload = async (e) => {
    const newFiles = Array.from(e.target.files); // Files just selected

    if (!newFiles.length) {
      console.warn("No file selected");
      return;
    }

    // 1️⃣ File size check (max 2 MB)
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

    // 2️⃣ Max files limit check (max 3 total)
    if (files.length + sizeFilteredFiles.length > 1) {
      toast.error("You can only upload a maximum of 1 files.");
      e.target.value = "";
      return;
    }

    // 3️⃣ Remove duplicates by file name
    const uniqueFiles = sizeFilteredFiles.filter(
      (file) => !files.some((existingFile) => existingFile.name === file.name)
    );

    if (uniqueFiles.length === 0) {
      e.target.value = "";
      return;
    }

    // 4️⃣ Required data checks
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
      formData.append("GuestLecture", selectedValues || "");

      updatedFiles.forEach((file) => {
        formData.append("GuestLectureFiles", file);
      });

      // 7️⃣ Send API request
      const res = await axios.post(
        `${API}/api/guestLecture/${designation}`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            // ❌ don’t set Content-Type manually, axios handles it
          },
        }
      );

      console.log("Upload success:", res.data);
    } catch (err) {
      console.error("Upload failed:", err.response?.data || err.message);
    }

    // 8️⃣ Reset file input
    e.target.value = "";
  };

  return (
    <>
      <div className="main-container border p-5 border-[#AAAAAA] bg-white rounded-xl ">
        <div className="input-container-3 grid gap-4 grid-cols-12">
          <div className="first-container pr-3 border-r border-gray-400 col-span-10">
            <div>
              <h1 className="text-lg font-medium">
                Organizing Guest Lectures / Inviting Visiting Faculty for
                respective subject <span className="text-red-500">*</span>{" "}
              </h1>
              <h1 className="text-lg text-[#646464] font-medium text-[16px] mt-1">
                National Experts - 1 Point || International Experts - 2 Points
              </h1>
            </div>

            <div className="radio-button-container space-y-2 px-2 py-2 rounded-lg mt-2 text-[#646464] font-medium">
              <div className="input-1 flex items-center gap-2">
                <input
                  type="radio"
                  name="Nationals"
                  value="National Experts"
                  className="scale-125 accent-teal-400 cursor-pointer"
                  checked={visitingType === "National Experts"}
                  onChange={(e) => handleVisitingTypeChange(e.target.value)}
                />
                <label className="text-gray-500">National Experts</label>
              </div>

              <div className="input-1 flex items-center gap-2">
                <input
                  type="radio"
                  name="Internationals"
                  value="International Experts"
                  className="scale-125 accent-teal-400 cursor-pointer"
                  checked={visitingType === "International Experts"}
                  onChange={(e) => handleVisitingTypeChange(e.target.value)}
                />
                <label className="text-gray-500">International Experts</label>
              </div>
              <div className="input-1 flex items-center gap-2">
                <input
                  type="radio"
                  name="None"
                  value="None"
                  className="scale-125 accent-teal-400 cursor-pointer"
                  checked={visitingType === "None"}
                  onChange={(e) => handleVisitingTypeChange(e.target.value)}
                />
                <label className="text-gray-500">None</label>
              </div>
            </div>

            {/* ======================= File attachment =====================  */}
            <div className="mt-2 ">
              <div
                // onDrop={handleDrop}
                // onDragOver={(e) => e.preventDefault()}
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
                  Compress files into a single file.{" "}
                  <span className="text-red-300">*</span>
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
          </div>
          <div className="second-container col-span-2 text-center">
            <h1 className="text-lg font-medium">Marks</h1>
            <div className="h-[80%] flex items-center justify-center">
              <h1 className="text-[#646464]  text-lg">
                <span className="font-semibold text-[#318179]">
                  {guestLecturemark || 0}
                </span>{" "}
                out of {markData?.points?.guest}
              </h1>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default TeachingForm5;
