import { ChevronDown, Upload, UserStar } from "lucide-react";
import React, { useState } from "react";
import { UploadCloud } from "lucide-react";
import axios from "axios";
import { jwtDecode } from "jwt-decode";

const TeachingForm9_2 = () => {
  const token = localStorage.getItem("appraisal_token");
  const decoded = jwtDecode(token);
  const designation = decoded.designation;
  const [attendedSem1, setAttendedSem1] = useState("");
  const [attendedSem2, setAttendedSem2] = useState("");
  const [filesSem1, setFilesSem1] = useState([]);
  const [filesSem2, setFilesSem2] = useState([]);
    const [programsmark, setProgramsmark] = useState("");

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

  const handleFileChangeSem1 = (e) => {
    const selectedFiles = Array.from(e.target.files);
    const previewFiles = selectedFiles.map((file) => ({
      file,
      preview: file.type.startsWith("image/")
        ? URL.createObjectURL(file)
        : null,
    }));
    setFilesSem1(previewFiles);
  };

  const handleFileChangeSem2 = (e) => {
    const selectedFiles = Array.from(e.target.files);
    const previewFiles = selectedFiles.map((file) => ({
      file,
      preview: file.type.startsWith("image/")
        ? URL.createObjectURL(file)
        : null,
    }));
    setFilesSem2(previewFiles);
  };

  const removeFileSem1 = (index) => {
    const updated = [...filesSem1];
    updated.splice(index, 1);
    setFilesSem1(updated);
  };

  const removeFileSem2 = (index) => {
    const updated = [...filesSem2];
    updated.splice(index, 1);
    setFilesSem2(updated);
  };
  const handleProgramstwoTypeChange = async (selectedValue) => {
    if (!selectedValue || !designation || !token) {
      console.error("Missing required values", {
        selectedValue,
        designation,
        token,
      });
      return;
    }

    try {
      setAttended(selectedValue);

      const response = await axios.post(
        `${API}/api/fdpPrograms/${designation}`,
        { Programs: selectedValue },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      // console.log("Programs attended submitted:", response.data);
    } catch (error) {
      console.error(
        "Error submitting attendance status:",
        error.response?.data || error.message
      );
    }
  };

  return (
    <>
      <div className="main-container border p-5 border-[#AAAAAA] bg-white rounded-xl">
        <div className="grid grid-cols-12 gap-4">
          <div className="col-span-10 pr-3 border-r border-gray-400">
            <h1 className="text-lg font-medium">
             Online course passed (Min 12 hours with certificate).{" "}
              <span className="text-red-500">*</span>
            </h1>

            {/* === Semester 1 === */}
            <div className="mt-4">
              <label className="text-gray-900 text-lg font-medium block mb-2">
                Semester 1
              </label>
              <p className="text-gray-800">
                Have you passed Online course (Min 12 hours with certificate)
              </p>
              <div className="flex gap-4 mt-2">
                <label className="flex items-center gap-2">
                  <input
                    className="cursor-pointer"
                    type="checkbox"
                    checked={attendedSem1 === "Yes"}
                    onChange={() => setAttendedSem1("Yes")}
                  />
                  Yes
                </label>
                <label className="flex items-center gap-2">
                  <input
                    className="cursor-pointer"
                    type="checkbox"
                    checked={attendedSem1 === "No"}
                    onChange={() => setAttendedSem1("No")}
                  />
                  No
                </label>
              </div>

              {attendedSem1 === "Yes" && (
                <div className="mt-4">
                  <div className="border-2 border-dashed border-[#3ab5a3] rounded-md p-4 text-center cursor-pointer">
                    <label
                      htmlFor="file-upload-sem1"
                      className="cursor-pointer text-gray-600 flex items-center justify-center gap-3"
                    >
                      <span className="text-xl">
                        <UploadCloud />
                      </span>{" "}
                      Drag and drop the files here or{" "}
                      <span className="underline text-teal-500">
                        choose file
                      </span>
                    </label>
                    <input
                      id="file-upload-sem1"
                      type="file"
                      className="hidden"
                      onChange={handleFileChangeSem1}
                      accept=".jpeg,.jpg,.png,.pdf,.doc,.docx"
                      multiple
                    />
                    <h1 className="text-sm mt-2 text-blue-400 ">
                Compress files into a single file. <span className="text-red-300">*</span>
              </h1>
                  </div>

                  <div className="mt-4 space-y-2 flex flex-col gap-2">
                    {filesSem1.map((fileObj, index) => (
                      <div
                        key={index}
                        className="flex items-center justify-between bg-gray-50 px-3 py-2 rounded border"
                      >
                        <div className="flex items-center gap-3">
                          {fileObj.preview ? (
                            <img
                              src={fileObj.preview}
                              alt="Preview"
                              className="w-6 h-6 object-cover rounded"
                            />
                          ) : (
                            <span className="text-sm text-gray-700">
                              {fileObj.file.name}
                            </span>
                          )}
                        </div>
                        <button
                          onClick={() => removeFileSem1(index)}
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

            {/* === Semester 2 === */}
            <div className="mt-6 pt-4 border-t">
              <label className="text-gray-900 text-lg font-medium block mb-2">
                Semester 2
              </label>
              <p className="text-gray-800">
                Have you passed Online course (Min 12 hours with certificate)
              </p>
              <div className="flex gap-4 mt-2">
                <label className="flex items-center gap-2">
                  <input
                    className="cursor-pointer"
                    type="checkbox"
                    checked={attendedSem2 === "Yes"}
                    onChange={() => setAttendedSem2("Yes")}
                  />
                  Yes
                </label>
                <label className="flex items-center gap-2">
                  <input
                    className="cursor-pointer"
                    type="checkbox"
                    checked={attendedSem2 === "No"}
                    onChange={() => setAttendedSem2("No")}
                  />
                  No
                </label>
              </div>

              {attendedSem2 === "Yes" && (
                <div className="mt-4">
                  <div className="border-2 border-dashed border-[#3ab5a3] rounded-md p-4 text-center cursor-pointer">
                    <label
                      htmlFor="file-upload-sem2"
                      className="cursor-pointer text-gray-600 flex items-center justify-center gap-3"
                    >
                      <span className="text-xl">
                        <UploadCloud />
                      </span>{" "}
                      Drag and drop the files here or{" "}
                      <span className="underline text-teal-500">
                        choose file
                      </span>
                    </label>
                    <input
                      id="file-upload-sem2"
                      type="file"
                      className="hidden"
                      onChange={handleFileChangeSem2}
                      accept=".jpeg,.jpg,.png,.pdf,.doc,.docx"
                      multiple
                    />
                  </div>

                  <div className="mt-4 space-y-2 flex flex-col gap-2">
                    {filesSem2.map((fileObj, index) => (
                      <div
                        key={index}
                        className="flex items-center justify-between bg-gray-50 px-3 py-2 rounded border"
                      >
                        <div className="flex items-center gap-3">
                          {fileObj.preview ? (
                            <img
                              src={fileObj.preview}
                              alt="Preview"
                              className="w-6 h-6 object-cover rounded"
                            />
                          ) : (
                            <span className="text-sm text-gray-700">
                              {fileObj.file.name}
                            </span>
                          )}
                        </div>
                        <button
                          onClick={() => removeFileSem2(index)}
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
          </div>

          {/* Right column for Marks */}
          <div className="col-span-2 text-center">
            <h1 className="text-lg font-medium">Marks</h1>
            <div className="h-[80%] flex items-center justify-center">
              <h1 className="text-[#646464] text-lg">
                <span className="font-semibold text-[#318179]">{programsmark ||0}</span> out of 3
              </h1>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default TeachingForm9_2;
