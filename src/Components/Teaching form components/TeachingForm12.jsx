import { ChevronDown, Upload, UserStar } from "lucide-react";
import React, { useState, useContext } from "react";
import { UploadCloud } from "lucide-react";
import axios from "axios";
import { jwtDecode } from "jwt-decode";
import { Data } from "../../Context/Store";

const TeachingForm12 = () => {
 const API = "http://localhost:5000"
  const token = localStorage.getItem("appraisal_token");
  const decoded = jwtDecode(token);
  const designation = decoded.designation;
  const username = decoded.facultyName;
  const [tutorWardMeeting, setTutorWardMeeting] = useState([]);
  const [tutorwardMeetingmark, setTutorwardMeetingmark] = useState("");
  const [tutorWardMeetingChecked, setTutorWardMeetingChecked] = useState(false);
  const [selectedValue1, setSelectedValue1] = useState("No");
  const [selectedValue2, setSelectedValue2] = useState("No");
  // State
  const [isChecked, setIsChecked] = useState("No"); // For tutorWardMeeting
  const [isChecked2, setIsChecked2] = useState("No"); // For valueAdditionInStudentLife

  // Handle Tutor-Ward Meeting checkbox
  const handleTutorWardMeetingChange = (value) => {
    setIsChecked(value);
    submitTutorWardMeeting(value, isChecked2); // Send API with both values
  };

  // Handle Value Addition checkbox
  const handleValueAdditionChange = (value) => {
    setIsChecked2(value);
    submitTutorWardMeeting(isChecked, value); // Send API with both values
  };

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
    const fileName = encodeURIComponent(files[index].name); // encode to handle spaces & special chars

    try {
      // API call to delete image with fileName in URL
      await axios.delete(`${API}/api/deleteImage`, {
        headers: { Authorization: `Bearer ${token}` },
        data: { keyword: "valueAdditionFiles" },
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
      }

      // toast.success(`${decodeURIComponent(fileName)} deleted successfully`);
    } catch (error) {
      console.error(
        "Error deleting file:",
        error.response?.data || error.message
      );
      // toast.error("Failed to delete file");
    }
  };
  // ✅ Function
  const submitTutorWardMeeting = async (tutorWardValue, valueAdditionValue) => {
    if (!designation || !token || !username) {
      console.error("Missing required values", {
        designation,
        token,
        username,
      });
      return;
    }

    try {
      const response = await axios.post(
        `${API}/api/tutorwardMeeting/${designation}`,
        {
          tutorWardMeetings: tutorWardValue, // First field
          valueAdditionInStudentLife: valueAdditionValue, // Second field
          facultyName: username, // Extra field
        },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setTutorwardMeetingmark(response.data.finalMarks);
      console.log("Tutor-Ward Meeting submitted ✅:", response.data);
    } catch (error) {
      console.error(
        "Error submitting tutor-ward meeting ❌:",
        error.response?.data || error.message
      );
    }
  };

  const handleFileUpload = async (e) => {
    const uploadedFiles = Array.from(e.target.files);

    // ✅ Filter out > 5MB
    const validFiles = uploadedFiles.filter((file) => {
      if (file.size > 1 * 1024 * 1024) {
        alert(`"${file.name}" is larger than 1MB and will not be uploaded.`);
        return false;
      }
      return true;
    });

    // ✅ Remove duplicates (by file name)
    const uniqueFiles = validFiles.filter(
      (file) => !files.some((existingFile) => existingFile.name === file.name)
    );

    if (uniqueFiles.length === 0) {
      e.target.value = ""; // reset if no new valid files
      return;
    }

    // ✅ Check total file count
    const totalFiles = [...files, ...uniqueFiles];
    if (totalFiles.length > 1) {
      alert("More than 1 files are not allowed");
      e.target.value = "";
      return;
    }

    setFiles(totalFiles);

    // ✅ Prepare FormData with only newly added files
    const formData = new FormData();
    uniqueFiles.forEach((file) => {
      formData.append("valueAdditionFiles", file); // confirm backend expects this key
    });

    formData.append("facultyName", username);
    formData.append("tutorWardMeetings", selectedValue1);
    formData.append("valueAdditionInStudentLife", selectedValue2);
    // formData.append("roles", selectedRoles); // uncomment if backend needs roles

    try {
      const res = await axios.post(
        `${API}/api/tutorwardMeeting/${designation}`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      console.log("Upload successful", res.data);
    } catch (err) {
      console.error("File upload failed:", err.response?.data || err.message);
    } finally {
      e.target.value = ""; // ✅ reset input so same file can be uploaded again
    }
  };

  return (
    <>
      <div className="main-container border p-5 border-[#AAAAAA] bg-white rounded-xl ">
        <div className="input-container-3 grid gap-4 grid-cols-12">
          <div className="first-container pr-3 border-r border-gray-400 col-span-10 ">
            <div>
              <h1 className="text-lg font-medium">
                Tutor ward meeting. <span className="text-red-500">*</span>
              </h1>
            </div>
            <div className="radio-button-container space-y-2 px-2 py-2 rounded-lg  text-[#646464] font-medium">
              <h1>Minimum 6 meetings with all mentees collectively – 3 Points</h1>
              <div className="input-container flex items-center gap-4">
                <div>
                  <input
                    type="checkbox"
                    checked={isChecked === "Yes"}
                    onChange={() => {
                      setSelectedValue1("Yes");
                      handleTutorWardMeetingChange("Yes");
                    }}
                  />
                  <label className="ml-2">Yes</label>
                </div>
                <div>
                  <input
                    type="checkbox"
                    checked={isChecked === "No"}
                    onChange={() => {
                      setSelectedValue1("No");
                      handleTutorWardMeetingChange("No");
                    }}
                  />
                  <label className="ml-2">No</label>
                </div>
              </div>
            </div>

            {/* ======================= File attachment =====================  */}

            <div className="radio-button-container space-y-2 px-2 py-2 border-t text-[#646464] font-medium">
              <h1>Value addition brought about in students life – 2 Points</h1>
              <div className="input-container flex items-center gap-4">
                <div>
                  <input
                    type="checkbox"
                    checked={isChecked2 === "Yes"}
                    onChange={() => {
                      setSelectedValue2("Yes");
                      handleValueAdditionChange("Yes");
                    }}
                  />
                  <label className="ml-2">Yes</label>
                </div>
                <div>
                  <input
                    type="checkbox"
                    checked={isChecked2 === "No"}
                    onChange={() => {
                      setSelectedValue2("No");
                      handleValueAdditionChange("No");
                    }}
                  />
                  <label className="ml-2">No</label>
                </div>
              </div>
            </div>
            {(isChecked == "Yes" || isChecked2 == "Yes") && (
              <div className="mt-2 ">
                <div className="border-2 relative border-dashed border-[#3ab5a3] rounded-md p-4 text-center cursor-pointer">
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
                    onChange={handleFileUpload}
                    accept=".jpeg,.jpg,.png,.pdf,.doc,.docx"
                    multiple
                  />
                  <h1 className="text-sm mt-2 text-blue-400 ">
                    Compress files into a single file.{" "}
                    <span className="text-red-300">*</span>
                  </h1>
                </div>

                {/* Uploaded File List */}
                <div className="mt-4 space-y-2  flex items-start gap-2">
                  {files.map((fileObj, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between bg-gray-50 px-3 py-2 rounded border"
                    >
                      <div className="flex items-center gap-3">
                        {fileObj.preview ? (
                          <img
                            src={fileObj.preview}
                            alt={fileObj.file.name}
                            className="w-6 h-6 object-cover rounded"
                          />
                        ) : (
                          <span className="text-sm text-gray-700">
                            {fileObj.name}
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
                  {tutorwardMeetingmark || 0}
                </span>{" "}
                out of {markData?.points?.tutorMeeting}
              </h1>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default TeachingForm12;
