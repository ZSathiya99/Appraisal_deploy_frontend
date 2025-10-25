import React, { useContext, useState } from "react";
import { ChevronDown, Upload, UserStar, UploadCloud, X } from "lucide-react";
import { jwtDecode } from "jwt-decode";
import axios from "axios";
import { Data } from "../../Context/Store";

const ResearchForm10 = () => {
 const API = "http://localhost:5000"
  const token = localStorage.getItem("appraisal_token");
  const decoded = jwtDecode(token);
  const designation = decoded.designation;
  console.log("emp id :  ", decoded.id);
  const username = decoded.facultyName;
  const [selectedCheck, setSelectedCheck] = useState("none");
  const [dropdown, setDropdown] = useState(false);
  const [files, setFiles] = useState([]);
  const [mark, setMark] = useState(0);
  console.log("mark", mark);
  // const [selectedValue, setSelectedValue] = useState();
  const { researchMarks } = useContext(Data);
  const [selectedValues, setSelectedValues] = useState("None");
  // store multiple selections
  const [piCount, setPiCount] = useState(null);
  const [coPiCount, setCoPiCount] = useState(null);
  const [dropdown1, setDropdown1] = useState(false);
  const [dropdown2, setDropdown2] = useState(false);
  const [selectedPayload, setSelectedPayload] = useState({});
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
    totalFiles.forEach((file) => formData.append("FundFiles", file));

    // Append other data
    
    formData.append("facultyName", username);
    formData.append("PI", piCount);
    formData.append("CoPI", coPiCount);
    try {
      const response = await axios.post(
        `${API}/api/Fund/${designation}/`,
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
      await axios.delete(`${API}/api/deleteImage`, {
        headers: { Authorization: `Bearer ${token}` },
        data: { keyword: "FundFiles" },
      });

      // Revoke preview URL if exists
      if (files[index].preview) {
        URL.revokeObjectURL(files[index].preview);
      }

      // Update state after successful deletion
      const updatedFiles = [...files];
      updatedFiles.splice(index, 1);
      setFiles(updatedFiles);

      document.getElementById("file-upload").value = "";
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

  // Handle checkbox changes
  const handleCheckboxChange = (value) => {
    if (value === "None") {
      setSelectedValues(["None"]);
      setPiCount(null);
      setCoPiCount(null);
      handleSubmit(["None"], {});
      return;
    }

    setSelectedValues((prev) => {
      const current = Array.isArray(prev) ? prev : [];
      const updated = current.includes(value)
        ? current.filter((v) => v !== value)
        : [...current.filter((v) => v !== "None"), value];

      handleSubmit(updated, { PI: piCount, CoPI: coPiCount });
      return updated;
    });
  };
  const handleSubmit = async (
    selected = selectedValues,
    counts = { PI: piCount, CoPI: coPiCount }
  ) => {
    try {
      const formData = new FormData();

      if (selected.includes("None")) {
        formData.append("None", "true");
      } else {
        if (selected.includes("PI") && counts.PI != null) {
          formData.append("PI", counts.PI.toString());
        }
        if (selected.includes("Co-PI") && counts.CoPI != null) {
          formData.append("CoPI", counts.CoPI.toString());
        }
        // ❌ don't append "None" when it's not selected
      }

      setSelectedPayload(formData);

      formData.append("facultyName", username);
      formData.append("designation", designation);

      const response = await axios.post(
        `http://localhost:5000/api/Fund/${designation}`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
          },
        }
      );

      setMark(response.data.finalMarks);
      console.log("Response:", response.data);
    } catch (error) {
      console.error("Error submitting data:", error);
    }
  };

  // Handle dropdown number selection for PI
  const handlePiCountChange = (num) => {
    setPiCount(num);
    handleSubmit(selectedValues, { PI: num, CoPI: coPiCount });
  };

  // Handle dropdown number selection for Co-PI
  const handleCoPiCountChange = (num) => {
    setCoPiCount(num);
    handleSubmit(selectedValues, { PI: piCount, CoPI: num });
  };

  return (
    <>
      <div className="input-container-2 border border-[#AAAAAA] p-4  bg-white  rounded-xl grid gap-4 grid-cols-12">
        <div className="first-container pr-3 border-r border-gray-400 col-span-10">
          {/* header  */}
          <h1 className="text-lg font-medium">
            Funded Project Min 5L <span className="text-red-500">*</span>
          </h1>
          <div className="header px-6">
            <div>
              <h1 className="text-gray-400 font-medium ">
                PI - 5 Points || Co - PI 2 Points (must sanction during
                evaluation period)
              </h1>
            </div>
          </div>
          <div className="checkbox-container mt-2 px-6">
            {/* PI */}
            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                className="scale-125 cursor-pointer"
                checked={selectedValues.includes("PI")}
                onChange={() => handleCheckboxChange("PI")}
              />
              <label className="text-[#6f7282]">PI</label>
            </div>
            {selectedValues.includes("PI") && (
              <div className="dropdown-container border-1 w-[300px] px-2 border-gray-400 rounded-md my-2 relative">
                <div className="header flex items-center gap-4 py-2 justify-between">
                  <h1 className="text-gray-600">
                    {piCount ? piCount : "Number of Funded Projects"}
                  </h1>
                  <ChevronDown
                    onClick={() => setDropdown1(!dropdown1)}
                    className={`text-gray-400 cursor-pointer ${
                      dropdown1 && "rotate-180"
                    } transition-all duration-300 `}
                  />
                </div>
                {dropdown1 && (
                  <div className="button-container absolute top-full left-0 z-50 rounded-sm bg-white shadow-md w-full border-1 border-gray-300">
                    {[1, 2, 3, 4, 5].map((num) => (
                      <button
                        key={num}
                        onClick={() => {
                          setPiCount(num);
                          setDropdown1(false);
                          handlePiCountChange(num); // send immediately
                        }}
                        className="hover:bg-gray-200 w-full text-left px-4 py-1 cursor-pointer"
                      >
                        {num}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* Co-PI */}
            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                className="scale-125 cursor-pointer"
                checked={selectedValues.includes("Co-PI")}
                onChange={() => handleCheckboxChange("Co-PI")}
              />
              <label className="text-[#6f7282]">Co - PI</label>
            </div>
            {selectedValues.includes("Co-PI") && (
              <div className="dropdown-container border-1 w-[300px] px-2 border-gray-400 rounded-md my-2 relative">
                <div className="header flex items-center gap-4 py-2 justify-between">
                  <h1 className="text-gray-600">
                    {coPiCount ? coPiCount : "Number of Funded Projects"}
                  </h1>
                  <ChevronDown
                    onClick={() => setDropdown2(!dropdown2)}
                    className={`text-gray-400 cursor-pointer ${
                      dropdown2 && "rotate-180"
                    } transition-all duration-300 `}
                  />
                </div>
                {dropdown2 && (
                  <div className="button-container absolute top-full left-0 z-50 rounded-sm bg-white shadow-md w-full border-1 border-gray-300">
                    {[1, 2, 3, 4, 5].map((num) => (
                      <button
                        key={num}
                        onClick={() => {
                          setCoPiCount(num);
                          setDropdown2(false);
                          handleCoPiCountChange(num); // send immediately
                        }}
                        className="hover:bg-gray-200 w-full text-left px-4 py-1 cursor-pointer"
                      >
                        {num}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* None */}
            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                className="scale-125 cursor-pointer accent-teal-500"
                checked={selectedValues.includes("None")}
                onChange={() => handleCheckboxChange("None")}
              />
              <label className="text-[#6f7282]">None</label>
            </div>
          </div>

          {/* Attachment container  */}
          <div className="dropdown-attachment-container px-6">
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
                Compress files into a single file.{" "}
                <span className="text-red-300">*</span>
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
              <span className="font-semibold text-[#318179]">{mark || 0}</span>{" "}
              out of {researchMarks?.fund}
            </h1>
          </div>
        </div>
      </div>
    </>
  );
};

export default ResearchForm10;
