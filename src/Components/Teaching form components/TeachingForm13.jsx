import { ChevronDown, Upload, UserStar } from "lucide-react";
import React, { useState, useContext } from "react";
import { UploadCloud } from "lucide-react";
import axios from "axios";
import { jwtDecode } from "jwt-decode";
import { Data } from "../../Context/Store";

const TeachingForm13 = () => {
 const API = "http://localhost:5000"
  const token = localStorage.getItem("appraisal_token");
  const decoded = jwtDecode(token);
  const designation = decoded.designation;
  const username = decoded.facultyName;
  const [isDropDown, setIsDropdown] = useState(false);
  const [academicRoles, setAcademicRoles] = useState("");
  console.log("academicRoles", academicRoles);
  const [visitingType, setVisitingType] = useState("No");
  const [selectedRoles, setSelectedRoles] = useState([]);
  const { markData } = useContext(Data);
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

  const handleFileUpload = async (e) => {
    const uploadedFiles = Array.from(e.target.files);

    // Filter out > 5MB
    const validFiles = uploadedFiles.filter((file) => {
      if (file.size > 1 * 1024 * 1024) {
        alert(`"${file.name}" is larger than 1MB and will not be uploaded.`);
        return false;
      }
      return true;
    });

    // Merge with existing, remove duplicates by (name + size)
    const combinedFiles = [...files, ...validFiles];
    const uniqueFiles = combinedFiles.filter(
      (file, index, self) =>
        index ===
        self.findIndex((f) => f.name === file.name && f.size === file.size)
    );

    // Check max 3 files
    if (uniqueFiles.length > 3) {
      alert("More than 3 files are not allowed");
      return;
    }

    setFiles(uniqueFiles);
    const roles = [...selectedRoles];
    // Prepare FormData
    const formData = new FormData();
    uniqueFiles.forEach((file) => {
      formData.append("files", file);
    });

    formData.append("facultyName", username);
    formData.append("roles", roles);

    try {
      const res = await axios.post(
        `${API}/api/academicRoles/${designation}`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            // ✅ don’t set Content-Type manually, axios handles it
          },
        }
      );
      console.log("Upload successful", res.data);
    } catch (err) {
      console.error("File upload failed:", err.response || err);
    } finally {
      e.target.value = ""; // reset input so same file can be uploaded again
    }
  };

  const removeFile = async (index) => {
    // const fileName = encodeURIComponent(files[index].name); // encode to handle spaces & special chars
    const fileName = files[index].name;

    try {
      // API call to delete image with fileName in URL
      await axios.delete(`${API}/api/deleteImage`, {
        headers: { Authorization: `Bearer ${token}` },
        data: { keyword: "files" },
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
        // setFileError("");
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

  //   const removeFile = async (index) => {
  //   const fileName = encodeURIComponent(files[index].name); // encode to handle spaces & special chars

  //   try {
  //     // API call to delete image with fileName in URL
  //     await axios.delete(
  //       `${API}/api/deleteImage/${fileName}`,
  //       {
  //         headers: { Authorization: `Bearer ${token}` },
  //       }
  //     );

  //     // Revoke preview URL if exists
  //     if (files[index].preview) {
  //       URL.revokeObjectURL(files[index].preview);
  //     }

  //     // Update state after successful deletion
  //     const updatedFiles = [...files];
  //     updatedFiles.splice(index, 1);
  //     setFiles(updatedFiles);

  //     // Clear error if limit is now fine
  //     if (updatedFiles.length < 3) {
  //       setFileError("");
  //     }

  //     toast.success(`${decodeURIComponent(fileName)} deleted successfully`);
  //   } catch (error) {
  //     console.error("Error deleting file:", error.response?.data || error.message);
  //     toast.error("Failed to delete file");
  //   }
  // };
  const toggleRole = (role) => {
    const updatedRoles = selectedRoles.includes(role)
      ? selectedRoles.filter((r) => r !== role)
      : [...selectedRoles, role];

    setSelectedRoles(updatedRoles);
    handleacademicRolesTypeChange(visitingType, updatedRoles);
  };

 const handleacademicRolesTypeChange = async (updatedVisitingType, updatedRoles) => {
  if (!designation || !token || !username) {
    console.error("Missing required values", { designation, token, username });
    return;
  }

  try {
    const response = await axios.post(
      `${API}/api/academicRoles/${designation}`,
      {
        visitingType: updatedVisitingType,              // ✅ send visitingType always
        roles: updatedRoles.length ? updatedRoles : [], // ✅ send empty if none
        facultyName: username,
      },
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      }
    );

    setAcademicRoles(response.data.finalMarks);
  } catch (error) {
    console.error(
      "Error updating academic roles:",
      error.response?.data || error.message
    );
  }
};


  return (
    <>
      <div className="main-container border p-5 border-[#AAAAAA] bg-white rounded-xl ">
        <div className="input-container-3 grid gap-4 grid-cols-12">
          <div className="first-container pr-3 border-r border-gray-400 col-span-10">
            <div>
              <h1 className="text-lg font-medium">
                Are you a Accademic Coordinator / Class Advisor 2 Points
                <span className="text-red-500">*</span>{" "}
              </h1>
              <h1 className="text-gray-500 ">
                {" "}
                Course Coordinator / TimetableCoordinator / Exam Cell/ Lab
                Coordinator/ Project Coordinator etc., – Each 1 Point
              </h1>
              <div className="flex gap-2 items-center mt-2">
                <div className="input-container flex items-center gap-2 ">
                  <div className="input-container-1 flex gap-2 items-center">
                    <input
                      type="checkbox"
                      checked={visitingType === "Yes"}
                      onChange={() => {
                        const newVisitingType = "Yes";
                        setVisitingType(newVisitingType);
                        handleacademicRolesTypeChange(
                          newVisitingType,
                          selectedRoles
                        );
                      }}
                    />
                    <label className="text-gray-500 font-medium">Yes</label>
                  </div>
                </div>
                <div className="input-container-1 flex gap-2 items-center">
                  <input
                    type="checkbox"
                    checked={visitingType === "No"}
                    onChange={() => {
                      const newVisitingType = "No";
                      setVisitingType(newVisitingType);

                      // ✅ Pass empty roles if "No" is selected
                      handleacademicRolesTypeChange(newVisitingType, []);
                    }}
                  />
                  <label className="text-gray-500 font-medium">No</label>
                </div>
              </div>
            </div>
 {visitingType !== "No" && (
            <div className="select-container mt-2 relative">
              <div className="header flex items-center justify-between border border-[#8B9AA9] rounded-lg px-2 py-2">
                <h1 className="text-[#8B9AA9]">Select</h1>
                <ChevronDown
                  onClick={() => setIsDropdown(!isDropDown)}
                  className={`cursor-pointer ${isDropDown ? "rotate-180" : ""}`}
                />
              </div>

              {isDropDown && (
                <div className="dropdown-container w-full space-y-3 absolute top-full p-2 bg-white border-1 border-[#AAAAAA] rounded-lg z-10">
                  {[
                    "Course Coordinator",
                    "Timetable Coordinator",
                    "Exam Cell",
                    "Lab Coordinator",
                    "Project Coordinator",
                  ].map((role) => (
                    <div
                      key={role}
                      className="input-container flex gap-3 items-center"
                    >
                      <input
                        type="checkbox"
                        className="accent-[#3ab5a3]"
                        checked={selectedRoles.includes(role)}
                        onChange={() => toggleRole(role)}
                      />
                      <label className="text-[#8B9AA9]">{role}</label>
                    </div>
                  ))}
                </div>
              )}
            </div>
 )}

            {/* ======================= File attachment =====================  */}
            {visitingType == "Yes" && (
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
          <div className="second-container col-span-2 text-center">
            <h1 className="text-lg font-medium">Marks</h1>
            <div className="h-[80%] flex items-center justify-center">
              <h1 className="text-[#646464]  text-lg">
                <span className="font-semibold text-[#318179]">
                  {academicRoles || 0}
                </span>{" "}
                out of {markData?.points?.academicRoles}
              </h1>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default TeachingForm13;
