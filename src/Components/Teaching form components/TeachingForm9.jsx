import { ChevronDown, Upload, UserStar } from "lucide-react";
import React, { useEffect, useState, useContext } from "react";
import { UploadCloud } from "lucide-react";
import axios from "axios";
import { jwtDecode } from "jwt-decode";
import { Data } from "../../Context/Store";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const TeachingForm9 = () => {
    const API = import.meta.env.VITE_API
  const token = localStorage.getItem("appraisal_token");
  const decoded = jwtDecode(token);
  const designation = decoded.designation;
  const username = decoded.facultyName;
  const [facultyDevelopmentAttendedFile, setFacultyDevelopmentAttendedFile] =
    useState([]);
  const [semData, setSemData] = useState({});
  // console.log("sem data : ", semData);
  const [isChecked, setIsChecked] = useState(false);
  const [isNoChecked, setIsNoChecked] = useState(false);
  const [attended, setAttended] = useState("No");
  const [attendedSem1, setAttendedSem1] = useState("No");
  const [secondInputCheckbox, setSecondInputCheckbox] = useState("No");
  const [attendedSem2, setAttendedSem2] = useState("No");
  const [programsmark, setProgramsmark] = useState("");
  const [fdp1, setFdp1] = useState(false);
  const [fdp2, setFdp2] = useState(false);
  const [online1, setOnline1] = useState(false);
  const [online2, setOnline2] = useState(false);
  const [files, setFiles] = useState([]);

  const { markData } = useContext(Data);
  const handleYesSem2 = () => {
    setAttendedSem2("Yes");
  };

  const handleNoSem2 = () => {
    setAttendedSem2("No");
  };

  const handleYesChange = () => {
    setAttended("Yes");
  };

  const handleNoChange = () => {
    setAttended("No");
  };

  // console.log(attended);
  // console.log(isChecked);
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

  const handleFileChange = async (e) => {
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
    if (facultyDevelopmentAttendedFile.length + sizeFilteredFiles.length > 1) {
      toast.error("You can only upload a maximum of 1 files.");
      e.target.value = "";
      return;
    }

    // 3️⃣ Remove duplicates by file name
    const uniqueFiles = sizeFilteredFiles.filter(
      (file) =>
        !facultyDevelopmentAttendedFile.some(
          (existing) => existing.file.name === file.name
        )
    );

    if (uniqueFiles.length === 0) {
      e.target.value = "";
      return;
    }

    // 4️⃣ Create file previews
    const filePreviews = uniqueFiles.map((file) => ({
      file,
      preview: file.type.startsWith("image") ? URL.createObjectURL(file) : null,
    }));

    // 5️⃣ Update state
    setFacultyDevelopmentAttendedFile((prev) => [...prev, ...filePreviews]);

    // 6️⃣ Prepare FormData (upload all current + new files)
    const updatedFileList = [
      ...facultyDevelopmentAttendedFile,
      ...filePreviews,
    ];
    const formData = new FormData();

    updatedFileList.forEach((item) => {
      formData.append("FdpprogramFiles", item.file);
    });

    formData.append("facultyName", username);
    formData.append("semesterData", JSON.stringify(semData));

    // 7️⃣ Send API request
    try {
      const response = await axios.post(
        `${API}/api/fdpPrograms/${designation}`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      console.log("Upload success:", response.data);
    } catch (err) {
      console.error("Upload failed:", err.response?.data || err.message);
    }

    // 8️⃣ Reset file input
    e.target.value = "";
  };

  const handleDrop = (e) => {
    e.preventDefault();
    const droppedFiles = Array.from(e.dataTransfer.files);
    const validFiles = filterValidFiles(droppedFiles);
    const filePreviews = validFiles.map((file) => ({
      file,
      preview: file.type.startsWith("image") ? URL.createObjectURL(file) : null,
    }));
    setFacultyDevelopmentAttendedFile((prev) => [...prev, ...filePreviews]);
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

  // const removeFile = async (index) => {
  //   if (!files || !files[index]) {
  //     toast.error("File not found");
  //     return;
  //   }
  //   const fileName = encodeURIComponent(files[index].name);

  //   try {
  //     console.log("Deleting:", fileName);
  //     const res = await axios.delete(
  //       `${API}/api/deleteImage/${fileName}`,
  //       {
  //         headers: { Authorization: `Bearer ${token}` },
  //       }
  //     );
  //     console.log("Delete response:", res.data);

  //     if (files[index].preview) {
  //       URL.revokeObjectURL(files[index].preview);
  //     }

  //     setFiles(prev => {
  //       const newFiles = [...prev];
  //       newFiles.splice(index, 1);
  //       return newFiles;
  //     });

  //     if (files.length - 1 < 3) setFileError("");

  //     toast.success(`${decodeURIComponent(fileName)} deleted successfully`);
  //   } catch (error) {
  //     console.error("Error deleting file:", error.response?.data || error.message);
  //     toast.error("Failed to delete file");
  //   }
  // };
  const removeFile = async (index) => {
    if (
      !facultyDevelopmentAttendedFile ||
      !facultyDevelopmentAttendedFile[index]
    ) {
      toast.error("File not found");
      return;
    }

    // Handle both shapes: direct name OR file.name
    const fileName =
      facultyDevelopmentAttendedFile[index]?.name ||
      facultyDevelopmentAttendedFile[index]?.file?.name ||
      "";

    if (!fileName) {
      toast.error("File name not found, skipping API call");
      // Remove from UI without hitting API
      setFacultyDevelopmentAttendedFile((prev) => {
        const newFiles = [...prev];
        newFiles.splice(index, 1);
        return newFiles;
      });
      return;
    }

    try {
      console.log("Deleting:", fileName);
      await axios.delete(
        `${API}/api/deleteImage`,
        {
          headers: { Authorization: `Bearer ${token}` },
          data: { keyword: "FdpprogramFiles" },
        }
      );

      if (facultyDevelopmentAttendedFile[index]?.preview) {
        URL.revokeObjectURL(facultyDevelopmentAttendedFile[index].preview);
      }

      setFacultyDevelopmentAttendedFile((prev) => {
        const newFiles = [...prev];
        newFiles.splice(index, 1);
        return newFiles;
      });

      if (facultyDevelopmentAttendedFile.length - 1 < 3) setFileError("");

      toast.success(`${fileName} deleted successfully`);
    } catch (error) {
      console.error(
        "Error deleting file:",
        error.response?.data || error.message
      );
      // toast.error("Failed to delete file");
    }
  };

  // const programData = {
  //   "Sem 1": { fdp: true, online: false },
  //   "Sem 2": { fdp: false, online: true },
  // };

  // const handleProgramsTypeChange = async (programData) => {
  //   if (!programData || !designation || !token) {
  //     console.error("Missing required values", {
  //       programData,
  //       designation,
  //       token,
  //     });
  //     return;
  //   }

  //   try {
  //     setAttended(programData); // Optional: update local state if needed

  //     const semesterData = {

  //       "Sem 1": { fdp: programData, online: attendedSem1 },
  //       "Sem 2 ": { fdp: attendedSem2, online: secondInputCheckbox },
  //     };

  //     // console.log("req data : ", semesterData);
  //     const response = await axios.post(
  //       `${API}/api/fdpPrograms/${designation}`,
  //       { semesterData },
  //       {
  //         headers: {
  //           "Content-Type": "application/json",
  //           Authorization: `Bearer ${token}`,
  //         },
  //       }
  //     );

  //     // console.log("Programs attended submitted:", response.data);
  //   } catch (error) {
  //     console.error(
  //       "Error submitting attendance status:",
  //       error.response?.data || error.message
  //     );
  //   }
  // };
  const [selectedValues, setSelectedValues] = useState(null);

  async function handleApiCall(semester, field, value) {
    // console.log("calling------>", semester, field, value);
    setSelectedValues(semester, field, value);

    let fdp_sem_1 = fdp1;
    let online_sem_1 = online1;
    let fdp_sem_2 = fdp2;
    let online_sem_2 = online2;

    if (semester === 1 && field === "fdp") {
      fdp_sem_1 = value;
    }
    if (semester === 1 && field === "online") {
      online_sem_1 = value;
    }
    if (semester === 2 && field === "fdp") {
      fdp_sem_2 = value;
    }
    if (semester === 2 && field === "online") {
      online_sem_2 = value;
    }

    const semesterData = {
      Sem1: { fdp: fdp_sem_1, online: online_sem_1 },
      Sem2: { fdp: fdp_sem_2, online: online_sem_2 },
    };
    setSemData(semesterData);

    const formData = new FormData(); // ✅ Correct instantiation
    formData.append("semesterData", JSON.stringify(semesterData)); // ✅ Correct key name
    formData.append("facultyName", username);
    facultyDevelopmentAttendedFile.forEach((file, index) => {
      formData.append("FdpprogramFiles", file);
    });
    try {
      const response = await axios.post(
        `${API}/api/fdpPrograms/${designation}`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`, // Let browser set Content-Type
          },
        }
      );
      // console.log("resp: ", response);
      setProgramsmark(response.data.finalMarks);
    } catch (err) {
      console.error(err);
      window.alert(err.message);
    }
  }
  const handleFileUpload = async (e) => {
    // console.log("running");
    const newFile = Array.from(e.target.files);
    // console.log("STEP 1 - New files selected:", newFile);

    if (!newFile.length) {
      console.warn("No file selected");
      return;
    }

    // console.log("STEP 2 - decoded:", decoded);
    if (!decoded?.facultyName) {
      console.error("decoded is missing");
      return;
    }

    // console.log("STEP 3 - designation:", designation);
    if (!designation) {
      console.error("designation is missing");
      return;
    }

    const updatedFiles = [...files, ...newFile];
    setFiles(updatedFiles);
    // console.log("STEP 4 - Updated file list:", updatedFiles);

    try {
      const username = decoded.facultyName;
      const formData = new FormData();
      formData.append("facultyName", username);
      formData.append("highlevelCompetition", selectedValues || "");

      updatedFiles.forEach((file) => {
        formData.append("FdpprogramFiles", file);
      });

      // console.log("STEP 5 - Sending API request...");

      const res = await axios.post(
        `${API}/api/fdpPrograms/${designation}`,
        formData,
        { headers: { "Content-Type": "multipart/form-data" } }
      );

      // console.log("STEP 6 - API success:", res.data);
    } catch (err) {
      console.error("STEP 6 - API failed:", err.response?.data || err.message);
    }

    e.target.value = ""; // reset so same file can be selected again
  };

  return (
    <>
      <div className="main-container border p-5 border-[#AAAAAA] bg-white rounded-xl ">
        <div className="input-container-3 grid gap-4 grid-cols-12">
          <div className="first-container pr-3 border-r border-gray-400 col-span-10">
            <div>
              <h1 className="text-lg font-medium">
                Faculty Development Programme attended .
              </h1>
            </div>
            <div
              className={`input-container space-y-2 px-2 rounded-lg mt-1 text-[#646464] font-medium`}
            >
              <div className="input-1 ">
                <div>
                  <label className="text-gray-900 text-lg font-medium block mb-2">
                    Semester 1{" "}
                  </label>
                  <label className="text-gray-800 ">
                    Have you attended AICTE / SWAYAM / Reputed HEI - FDP
                    programs (Min 5 days and above with certificate)
                  </label>
                </div>

                <div className="flex gap-2 items-center mb-4 mt-2">
                  {" "}
                  <div className="input-container flex gap-2 items-center ">
                    <input
                      type="checkbox"
                      checked={fdp1 == true ? true : false}
                      onChange={() => {
                        setFdp1(true);
                        handleApiCall(1, "fdp", true);
                      }}
                      className="scale-125 accent-teal-400 cursor-pointer"
                    />
                    <label>Yes</label>
                  </div>
                  <div className="input-container flex gap-2  items-center">
                    <input
                      type="checkbox"
                      className="scale-125 accent-teal-400 cursor-pointer"
                      checked={fdp1 == true ? false : true}
                      onChange={() => {
                        setFdp1(false);
                        handleApiCall(1, "fdp", false);
                      }}
                    />
                    <label>No</label>
                  </div>
                </div>

                {/* ======================= File attachment =====================  */}

                <p className="text-gray-800">
                  Have you passed Online course (Min 12 hours with certificate)
                </p>
                <div className="flex gap-4 mt-2">
                  <label className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      className="scale-125 accent-teal-400 cursor-pointer"
                      checked={online1 == true ? true : false}
                      onChange={() => {
                        setOnline1(true);
                        handleApiCall(1, "online", true);
                      }}
                    />
                    Yes
                  </label>
                  <label className="flex items-center gap-2">
                    <input
                      className="scale-125 accent-teal-400 cursor-pointer"
                      type="checkbox"
                      checked={online1 == true ? false : true}
                      onChange={() => {
                        setOnline1(false);
                        handleApiCall(1, "online", false);
                      }}
                    />
                    No
                  </label>
                </div>
              </div>
            </div>

            <div
              className={`input-container space-y-2 px-2 pt-2 mt-4 border-t text-[#646464] font-medium`}
            >
              <div className="input-1">
                <div>
                  <label className="text-gray-900 text-lg font-medium block mb-2">
                    Semester 2{" "}
                  </label>
                  <label className="text-gray-800 ">
                    Have you attended AICTE / SWAYAM / Reputed HEI - FDP
                    programs (Min 5 days and above with certificate)
                  </label>
                </div>

                <div className="flex items-center gap-2">
                  {" "}
                  <div className="input-container flex gap-2 items-center">
                    <input
                      type="checkbox"
                      className="scale-125 accent-teal-400 cursor-pointer"
                      checked={fdp2 == true ? true : false}
                      onChange={() => {
                        setFdp2(true);
                        handleApiCall(2, "fdp", true);
                      }}
                    />
                    <label htmlFor="">Yes</label>
                  </div>
                  <div className="input-container flex gap-2 items-center">
                    <input
                      type="checkbox"
                      className="scale-125 accent-teal-400 cursor-pointer"
                      checked={fdp2 == true ? false : true}
                      onChange={() => {
                        setFdp2(false);
                        handleApiCall(2, "fdp", false);
                      }}
                    />
                    <label htmlFor="">No</label>
                  </div>
                </div>
              </div>
              {/* ======================= File attachment =====================  */}

              {/* here  */}
              <p className="text-gray-800">
                Have you passed Online course (Min 12 hours with certificate)
              </p>
              <div className="flex gap-4 mt-2">
                <label className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    className="scale-125 accent-teal-400 cursor-pointer"
                    checked={online2 == true ? true : false}
                    onChange={() => {
                      setOnline2(true);
                      handleApiCall(2, "online", true);
                    }}
                  />
                  Yes
                </label>
                <label className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    className="scale-125 accent-teal-400 cursor-pointer"
                    checked={online2 == true ? false : true}
                    onChange={() => {
                      setOnline2(false);
                      handleApiCall(2, "online", false);
                    }}
                  />
                  No
                </label>
              </div>

              {(fdp1 || online1 || fdp2 || online2) && (
                <div className="mt-4">
                  <div className="border-2 relative border-dashed border-[#3ab5a3] rounded-md p-4 text-center cursor-pointer">
                    <label className="cursor-pointer text-gray-600 flex items-center justify-center gap-3">
                      <span className="text-xl">
                        <UploadCloud />
                      </span>
                      Add Attachment{" "}
                      <span className="underline text-teal-500">
                        choose file
                      </span>
                    </label>
                    <input
                      id="file-upload"
                      type="file"
                      className="opacity-0 absolute top-0 right-0 left-0 bottom-0"
                      onChange={handleFileChange}
                      accept=".jpeg,.jpg,.png,.pdf,.doc,.docx"
                      multiple
                    />
                    <h1 className="text-sm mt-2 text-blue-400 ">
                Compress files into a single file. <span className="text-red-300">*</span>
              </h1>
                    <ToastContainer />
                  </div>

                  {/* Uploaded File List */}
                  <div className="mt-4 space-y-2  flex items-start gap-2 overflow-auto">
                    <div className="mt-4 space-y-2 flex items-start gap-2 overflow-auto">
                      {facultyDevelopmentAttendedFile?.map((fileObj, index) => {
                        const displayName =
                          fileObj?.name ||
                          fileObj?.file?.name ||
                          "Unnamed file";

                        return (
                          <div
                            key={index}
                            className="flex items-center justify-between bg-gray-50 px-3 py-2 rounded border"
                          >
                            <div className="flex items-center gap-3">
                              {fileObj.preview ? (
                                <img
                                  src={fileObj.preview}
                                  alt={displayName}
                                  className="w-6 h-6 object-cover rounded"
                                />
                              ) : (
                                <span className="text-sm text-gray-700">
                                  {displayName.length > 25
                                    ? displayName.slice(0, 12) + "..."
                                    : displayName}
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
                        );
                      })}
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
          <div className="second-container col-span-2 text-center">
            <h1 className="text-lg font-medium">Marks</h1>
            <div className="h-[80%] flex items-center justify-center">
              <h1 className="text-[#646464]  text-lg">
                <span className="font-semibold text-[#318179]">
                  {programsmark || 0}
                </span>{" "}
                out of {markData?.points?.fdpProgramme}
              </h1>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default TeachingForm9;
