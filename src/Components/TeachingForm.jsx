import { ChevronDown, FoldHorizontal, Plus, Search, X } from "lucide-react";
import React, { useEffect, useState, useRef, useContext } from "react";
import { UploadCloud } from "lucide-react";
import plus_icon from "../assets/plus_icon.svg";
import axios from "axios";
import TeachingFrom4 from "./Teaching form components/TeachingFrom4";
import TeachingForm5 from "./Teaching form components/TeachingForm5";
import TeachingForm7 from "./Teaching form components/TeachingForm7";
import TeachingForm8 from "./Teaching form components/TeachingForm8";
import TeachingForm9 from "./Teaching form components/TeachingForm9";
import TeachingForm9_2 from "./Teaching form components/TeachingForm9_2";
import TeachingForm10 from "./Teaching form components/TeachingForm10";
import TeachingForm12 from "./Teaching form components/TeachingForm12";
import TeachingForm13 from "./Teaching form components/TeachingForm13";
import { jwtDecode } from "jwt-decode";
import { Data } from "../Context/Store";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import TeachingForm3 from "./Teaching form components/TeachingForm3";
import TeachingForm6 from "./Teaching form components/TeachingForm6";

const subjects = [
  "Mongo Db",
  "React js",
  "Javascript",
  "Node js",
  "Express js",
];

const outOfMarks = {
  teaching: 2,
  pass_percentage: 3,
  students_feedback: 20,
};

const TeachingForm = () => {
 const API = "http://localhost:5000"
  // const value =
  // auth
  const token = localStorage.getItem("appraisal_token");
  const decoded = jwtDecode(token);
  const designation = decoded.designation;
  const username = decoded.facultyName;
  const { setMarkData, showPreviewForm1, setshowPreviewForm1, setSelectedTab } =
    useContext(Data);
  const [fileError, setFileError] = useState("");

  const [teachingPercentage, setTeachingPercentage] = useState("None");
  const [studentFeedback, setStudentFeedback] = useState("None");

  const [subjectslist, setSubjectslist] = useState([]);
  console.log(subjectslist);

  const [isTeachingAssgingment, setIsTeachingAssignment] = useState(false);
  const [teachingAssignmentFile, setTeachingAssignmentFile] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredSubjectData, setFileredSubjectData] = useState(subjects);
  const [selectedSubjects, setSelectedSubjects] = useState([]);
  const [files, setFiles] = useState([]);
  const [outOfMarks, setOutOfMarks] = useState({ teaching: 0 });
  const [teachingmark, setTeachingmark] = useState();
  const [passPercentage, setPassPercentage] = useState();
  const [teashigresmark, setTeashigresmark] = useState();

  const [studentFmark, setStudentFmark] = useState(0); // actual marks from backend
  const [studentFeedbackmark, setStudentFeedbackmark] = useState(3);

  const [teachpermark, setTeachpermark] = useState();

  useEffect(() => {
    const handleBeforeUnload = (event) => {
      event.preventDefault();
      event.returnValue = ""; // Required for Chrome
    };

    window.addEventListener("beforeunload", handleBeforeUnload);

    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload);
    };
  }, []);
  const [allSubjectCodes, setAllSubjectCodes] = useState([
    "CS101",
    "CS102",
    "CS103",
    "MA101",
    "PH101", // 👈 fetched once from DB
  ]);
  const [suggestions, setSuggestions] = useState({});
  const [errors, setErrors] = useState({});
  const [errorsone, setErrorsone] = useState({});
  const inputRefs = useRef([]);

  const [inputGroups, setInputGroups] = useState([
    { id: Date.now(), subjectCode: "", subjectName: "", credits: "" }, // default one
  ]);

  const handleAddGroup = () => {
    setInputGroups([
      ...inputGroups,
      {
        id: Date.now() + Math.random(),
        subjectCode: "",
        subjectName: "",
        credits: "",
      },
    ]);
  };

  const handleRemoveGroup = async (id, index) => {
    try {
      // Remove locally first
      const updatedGroups = inputGroups.filter((group) => group.id !== id);
      setInputGroups(updatedGroups);

      // Prepare FormData with updated groups
      const formData = new FormData();
      formData.append("teachingAssignment", JSON.stringify(updatedGroups));
      formData.append("facultyName", decoded.facultyName);

      // Append files if needed
      for (let i = 0; i < files.length; i++) {
        formData.append("Teachingfiles", files[i]);
      }

      // Call API to update backend
      const response = await axios.post(
        `${API}/api/teaching/${designation}`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      // Update marks after API call
      setTeashigresmark(response.data.finalMarks);
    } catch (error) {
      console.error("Error removing group:", error);
    }
  };

  const handleInputChange = async (index, field, value) => {
    try {
      const updatedGroups = [...inputGroups];
      updatedGroups[index][field] = value;
      setInputGroups(updatedGroups);

      const currentGroup = updatedGroups[index];
      if (
        currentGroup.subjectCode.trim() === "" ||
        currentGroup.subjectName.trim() === "" ||
        currentGroup.credits.trim() === ""
      ) {
        return;
      }

      const formData = new FormData();
      formData.append("teachingAssignment", JSON.stringify(updatedGroups));
      formData.append("facultyName", decoded.facultyName);

      for (let i = 0; i < files.length; i++) {
        formData.append("Teachingfiles", files[i]);
      }

      for (let pair of formData.entries()) {
      }

      const response = await axios.post(
        `${API}/api/teaching/${designation}`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setTeashigresmark(response.data.finalMarks);
    } catch (error) {
      console.error("Upload error:", error);
    }
  };
  const [selectedValues, setSelectedValues] = useState(null);
  const handleChangeTeachingPercentage = async (value) => {
    setSelectedValues(value);
    try {
      const response = await axios.post(
        `${API}/api/passPercentage/${designation}`,
        {
          passPercentage: value,
          facultyName: username,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setTeachpermark(response.data.finalMarks);
      set;
    } catch (error) {
      console.error("Error submitting teaching percentage:", error);
    }
  };
  const handleChangetheoryandlab = async (value) => {
    setStudentFeedback(value);
    try {
      const response = await axios.post(`${API}/api/feedback/${designation}`, {
        feedback: value,
        facultyName: username,
      });

      // backend returns awarded marks
      setStudentFmark(response.data.finalMarks);

      // if backend also returns max marks → update
      if (response.data.totalMarks) {
        setStudentFeedbackmark(response.data.totalMarks);
      }
    } catch (error) {
      console.error(
        "Error submitting teaching percentage:",
        error.response?.data || error.message
      );
    }
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      inputRefs.current.forEach((ref, idx) => {
        if (ref && !ref.contains(event.target)) {
          setSuggestions((prev) => ({ ...prev, [idx]: [] }));
        }
      });
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleCheckboxChange = (subject) => {
    if (selectedSubjects.includes(subject)) {
      setSelectedSubjects((prev) => prev.filter((item) => item !== subject));
    } else {
      setSelectedSubjects((prev) => [...prev, subject]);
    }
  };

  const handleFileChange = async (e) => {
    console.log("run");
    const selectedFiles = Array.from(e.target.files);

    if (!selectedFiles.length) {
      console.warn("No file selected");
      return;
    }

    const sizeFilteredFiles = selectedFiles.filter((file) => {
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

    if (files.length + sizeFilteredFiles.length > 1) {
      toast.error("You can only upload a maximum of 1 files.");
      e.target.value = "";
      return;
    }

    const uniqueFiles = sizeFilteredFiles.filter(
      (file) => !files.some((existingFile) => existingFile.name === file.name)
    );
    if (uniqueFiles.length === 0) {
      toast.error("These files are already added.");
      e.target.value = "";
      return;
    }

    const newFileObjects = uniqueFiles.map((file) => ({
      file,
      name: file.name,
      preview: file.type.startsWith("image/")
        ? URL.createObjectURL(file)
        : null,
    }));
    const updatedFileList = [...files, ...newFileObjects];
    console.log("my files : ", updatedFileList);
    setFiles(updatedFileList);
    e.target.value = "";
    setFileError("");
    const formData = new FormData();
    formData.append("teachingAssignment", JSON.stringify(inputGroups));
    formData.append("facultyName", username);

    newFileObjects.forEach((fileObj) => {
      formData.append("Teachingfiles", fileObj.file);
    });

    // 9️⃣ Send to backend
    try {
      await axios.post(`${API}/api/teaching/${designation}`, formData, {
        headers: { Authorization: `Bearer ${token}` },
      });
    } catch (err) {
      console.error("File upload failed:", err);
      toast.error("Failed to upload files.");
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    const droppedFiles = Array.from(e.dataTransfer.files);
    setFiles((prev) => [...prev, ...droppedFiles]);
  };
  const handleFileCance = (f) => {
    setFiles((prev) => prev.filter((item) => item.name !== f.name));
  };
  useEffect(() => {
    if (!designation || !token) return;

    const fetchAllData = async () => {
      try {
        // 🔹 1. Fetch points
        const pointsResponse = await axios.get(
          `http://localhost:5000/api/points/${designation}`,

          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        setOutOfMarks(pointsResponse.data);

        const teachingData = pointsResponse.data.find(
          (item) => item.category === "teaching"
        );
        const teachingAssignment =
          teachingData?.points?.teachingAssignment || 0;
        const passPercentage = teachingData?.points?.passPercentage || 0;
        const studentFeedback = teachingData?.points?.studentFeedback || 0;

        setTeachingmark(teachingAssignment);
        setPassPercentage(passPercentage);
        setStudentFeedbackmark(studentFeedback);
        localStorage.setItem(
          "appraisal_outofmark",
          JSON.stringify(teachingData)
        );

        setMarkData(teachingData);

        // 🔹 2. Fetch subjects
        const subjectsResponse = await axios.get(`${API}/api/Subjects`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        setSubjectslist(subjectsResponse.data);

        // // console.log("Fetched subjects:", subjectsResponse.data);
      } catch (error) {
        console.error(
          "Error in fetching data:",
          error.response?.data || error.message
        );
        window.alert("Something went wrong while fetching data.");
      }
    };

    fetchAllData();
  }, [designation, token]);
  //   const removeFile = (index) => {
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
    const fileName = files[index].name;

    try {
      // API call to delete image with fileName in URL
      await axios.delete(`${API}/api/deleteImage/${fileName}`, {
        headers: { Authorization: `Bearer ${token}` },
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

      // toast.success(`${fileName} deleted successfully`);
    } catch (error) {
      console.error(
        "Error deleting file:",
        error.response?.data || error.message
      );
      // toast.error("Failed to delete file");
    }
  };

  function handleNextButton() {
    setshowPreviewForm1(true);
  }
  // useEffect(() => {
  //   setStudentFeedback("None");
  // }, []);

  return (
    <>
      {/* bg-[#D6D6D6] */}
      <div className="main-container space-y-2 ">
        <div className="input-container-1 border border-[#AAAAAA] p-5 bg-white  rounded-xl grid gap-4 grid-cols-12">
          <div className="first-container pr-8 border-r border-gray-400 col-span-10">
            <div className="flex items-center justify-between ">
              <div>
                <h1 className="text-lg max-sm:text-sm font-medium">
                  Teaching Assignment <span className="text-red-500">*</span>
                  <span className="text-sm text-gray-400">
                    ( No of credits per subject taught )
                  </span>
                </h1>
                <h1 className="text-lg text-[#646464] font-medium text-[16px] mt-1 max-sm:text-sm">
                  ( 3 Credits -1 Points || Max 3 Points )
                </h1>
              </div>
              <button
                className="bg-[#3ab5a3] p-1 flex items-center gap-1 text-white font-medium w-6 h-6 justify-center rounded-full cursor-pointer hover:bg-[#52978d]"
                onClick={handleAddGroup}
              >
                <img src={plus_icon} className="text-white  w-5 h-5" />
              </button>
            </div>

            {/* ✅ Render all input groups dynamically */}
            {inputGroups.map((group, index) => (
              <div key={index} className="relative mt-4">
                <div className="input-container sm:grid sm:grid-cols-2 md:grid-cols-3  gap-4">
                  {/* Subject Code Input with Autocomplete */}
                  <div
                    className="relative"
                    ref={(el) => (inputRefs.current[index] = el)}
                  >
                    <div className="flex flex-col w-full">
                      <div className="flex flex-col w-full">
                        <input
                          type="text"
                          placeholder="Enter Subject Code"
                          value={group.subjectCode}
                          onChange={(e) => {
                            let value = e.target.value;

                            if (value.length > 8) {
                              setErrors((prev) => ({
                                ...prev,
                                [index]:
                                  "Subject code cannot exceed 8 characters",
                              }));
                              value = value.slice(0, 8); // Trim extra chars
                            } else {
                              setErrors((prev) => ({ ...prev, [index]: "" }));
                            }

                            handleInputChange(index, "subjectCode", value);
                          }}
                          className={`border ${
                            errors[index]
                              ? "border-red-500"
                              : "border-[#AAAAAA]"
                          } bg-white focus:outline-1 outline-[#3ab5a3] focus:border-none rounded-md px-2 py-2 w-full`}
                        />
                      </div>
                      {/* ✅ Show error below input */}
                      {errors[index] && (
                        <p className="text-red-500 text-xs mt-1">
                          {errors[index]}
                        </p>
                      )}
                    </div>

                    {/* Autocomplete Dropdown */}
                    {suggestions[index] && suggestions[index].length > 0 && (
                      <div className="absolute top-full left-0 w-full bg-[#f3fffc] border border-gray-400 rounded-md mt-1 z-10 max-h-40 overflow-y-auto">
                        {suggestions[index].map((code, i) => (
                          <div
                            key={i}
                            onClick={() => {
                              handleInputChange(index, "subjectCode", code);
                              setSuggestions((prev) => ({
                                ...prev,
                                [index]: [],
                              }));
                            }}
                            className="px-2 py-1 hover:bg-gray-100 cursor-pointer text-sm"
                          >
                            {code}
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Subject Input */}

                  <div className="">
                    <input
                      type="text"
                      placeholder="Enter Subject"
                      value={group.subjectName}
                      onChange={(e) => {
                        let value = e.target.value;

                        // ✅ Allow only letters and spaces
                        if (/[^a-zA-Z\s]/.test(value)) {
                          setErrorsone((prev) => ({
                            ...prev,
                            [index]: "Only letters and spaces are allowed",
                          }));
                          value = value.replace(/[^a-zA-Z\s]/g, "");
                        } else if (value.length > 25) {
                          setErrorsone((prev) => ({
                            ...prev,
                            [index]: "Subject name cannot exceed 25 characters",
                          }));
                          value = value.slice(0, 25);
                        } else {
                          setErrorsone((prev) => ({ ...prev, [index]: "" }));
                        }

                        handleInputChange(index, "subjectName", value);
                      }}
                      className={`border w-full ${
                        errorsone[index] ? "border-red-500" : "border-[#AAAAAA]"
                      } rounded-md px-2 py-2 focus:outline-1 outline-[#3ab5a3] focus:border-none`}
                    />
                    {errorsone[index] && (
                      <p className="text-red-500 text-xs mt-1">
                        {errorsone[index]}
                      </p>
                    )}
                  </div>
                  {/* Credits Input */}
                  <div className="w-full">
                    <select
                      value={group.credits}
                      onChange={(e) =>
                        handleInputChange(index, "credits", e.target.value)
                      }
                      className="border w-[100%] border-[#AAAAAA] rounded-md px-2 py-2 focus:outline-1 outline-[#3ab5a3] focus:border-none"
                    >
                      <option value="">Select Credits</option>
                      <option value="1">1</option>
                      <option value="2">2</option>
                      <option value="3">3</option>
                      <option value="4">4 </option>
                    </select>
                  </div>
                </div>
                {/* ✅ Show error below */}

                {/* Remove Group Button */}
                {index !== 0 && (
                  <X
                    className="absolute -right-7 top-2 text-gray-500 hover:text-red-500 cursor-pointer"
                    onClick={() => handleRemoveGroup(group.id, index)}
                  />
                )}
              </div>
            ))}

            <div className="mt-2">
              <div className="border-2 border-dashed relative border-[#3ab5a3] rounded-md p-4 text-center cursor-pointer">
                <label className="cursor-pointer text-gray-600 flex items-center justify-center gap-3">
                  <span className="text-xl">
                    <UploadCloud />
                  </span>
                  Add Attachment
                  <span className="underline text-teal-500">choose file</span>
                </label>

                <input
                  id="file-upload"
                  type="file"
                  className="absolute top-0 right-0 left-0 bottom-0 opacity-0 cursor-pointer"
                  onChange={handleFileChange}
                  accept=".jpeg,.jpg,.png,.pdf,.doc,.docx"
                  multiple
                  disabled={files.length >= 1}
                />
                <h1 className="text-sm mt-2 text-blue-400 ">
                  Compress files into a single file.{" "}
                  <span className="text-red-300">*</span>
                </h1>
                <ToastContainer />
              </div>

              {/* ✅ INLINE ERROR BELOW DROPZONE */}
              {fileError && (
                <p className="text-red-600 text-sm mt-2">{fileError}</p>
              )}

              {/* Uploaded File List */}
              <div className="mt-4 space-y-2 flex items-start gap-2 flex-col">
                {files.map((fileObj, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between bg-gray-50 px-3 py-2 rounded border"
                  >
                    <div className="flex items-center gap-3">
                      {fileObj.preview ? (
                        <img
                          src={fileObj.preview}
                          alt={fileObj.name}
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
          </div>
          <div className="second-container col-span-2 text-center">
            <h1 className="text-lg font-medium">Marks</h1>
            <div className="h-[80%] flex items-center justify-center">
              <h1 className="text-[#646464] text-lg">
                <span className="font-semibold text-[#318179]">
                  {teashigresmark || 0}
                </span>{" "}
                out of {teachingmark}
              </h1>
            </div>
          </div>
        </div>

        {/* ====================================== Input container 2 ==============================  */}

        <div className="input-container-2 border border-[#AAAAAA] p-4  bg-white  rounded-xl grid gap-4 grid-cols-12">
          <div className="first-container pr-3 border-r border-gray-400 col-span-10">
            <div>
              <h1 className="text-lg font-medium">
                Pass Percentage <span className="text-red-500">*</span>
                <span className="text-sm text-gray-400">( Average )</span>
              </h1>
              <h1 className="text-lg text-[#646464] font-medium text-[16px] mt-1">
                ( 100% - 3 Points || 90 to 99% - 2 Points || 80 to 89% - 1 Point
                )
              </h1>
            </div>
            <div className="radio-button-container space-y-2 px-2 py-2 rounded-lg mt-2 text-[#646464] font-medium">
              {[
                { label: "100%", value: "100%" },
                { label: "90% to 99%", value: "90 to 99%" },
                { label: "80% to 89%", value: "80 to 89%" },
                { label: "None", value: "None" },
              ].map((option) => (
                <div
                  key={option.value}
                  className="input-1 flex items-center gap-2"
                >
                  <input
                    type="radio"
                    name="teaching-percentage"
                    className="scale-125 accent-teal-400 cursor-pointer"
                    value={option.value}
                    checked={teachingPercentage === option.value}
                    onChange={(e) => {
                      const selectedValue = e.target.value;
                      setTeachingPercentage(selectedValue);
                      handleChangeTeachingPercentage(selectedValue); // Call API
                    }}
                  />
                  <label className="text-gray-500">{option.label}</label>
                </div>
              ))}
            </div>
          </div>
          <div className="second-container col-span-2 text-center">
            <h1 className="text-lg font-medium">Marks</h1>
            <div className="h-[80%] flex items-center justify-center">
              <h1 className="text-[#646464]  text-lg">
                <span className="font-semibold text-[#318179]">
                  {teachpermark || 0}
                </span>{" "}
                out of {passPercentage}
              </h1>
            </div>
          </div>
        </div>

        {/* ====================================== Input container 3 ====================================  */}
        <TeachingForm3 />

        {/* ======================================= Input container 4 ========================================================= */}
        <TeachingFrom4 />
        {/* ======================================= Input container 4 ========================================================= */}
        <TeachingForm5 />

        {/* ======================================= Input container 4 ========================================================= */}
        <TeachingForm6 />
        {/* ======================================= Input container 4 ========================================================= */}
        <TeachingForm7 />
        {/* ======================================= Input container 4 ========================================================= */}
        <TeachingForm8 />
        {/* ======================================= Input container 4 ========================================================= */}
        <TeachingForm9 />
        {/* ======================================= Input container 4 ========================================================= */}
        {/* <TeachingForm9_2 /> */}

        {/* ======================================= Input container 4 ========================================================= */}
        <TeachingForm10 />
        {console.log("designation : ", designation)}
        {designation !== "Professor" && (
          <>
            <TeachingForm12 />
            {/* ======================================= Input container 4 ========================================================= */}
            <TeachingForm13 />
          </>
        )}
      </div>
      <div className="button-container flex items-center justify-end mt-2">
        <button
          onClick={() => handleNextButton()}
          className="bg-[#318179] px-8 py-2 font-medium text-white rounded cursor-pointer hover:bg-[#305551]"
        >
          Next
        </button>
      </div>
    </>
  );
};

export default TeachingForm;
