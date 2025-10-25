import React, { useContext, useEffect, useState } from "react";
import VerticalStepper from "../Components/VerticalStepper ";
import { Data } from "../Context/Store";
import TeachingForm from "../Components/TeachingForm";
import HorizontalStepper from "../Components/HorizontalStepper";
import ResearchFormPage from "./ResearchFormPage";
import ServicePage from "./ServicePage";
import { useFetcher, useNavigate } from "react-router-dom";
import thanksImg from "../assets/thanks_img.svg";
import download from "../assets/t_download.svg";
import eye from "../assets/t_eye.svg";
import axios from "axios";
import { jwtDecode } from "jwt-decode";
import { ImageOff } from "lucide-react";
import { useMemo } from "react";

const AppraisalFormPage = () => {
  // Auth

 const API = "http://localhost:5000"
  const token = localStorage.getItem("appraisal_token");
  const decoded = jwtDecode(token);
  const designation = decoded.designation;
  const username = decoded.facultyName;
  const emp_id = decoded.id;

  const navigate = useNavigate();
  const {
    setSelectedTab,
    selectedTab,
    formCompleted,
    setFormCompleted,
    setIsSubmitted,
    setResearchMarks,
    setServiceMarks,
    isSubmitted,
  } = useContext(Data);
  console.log("isSubmitted : ", isSubmitted);
  const [teachingFinalMarks, setTeachingFinalmarks] = useState(0);
  console.log("teachingFinalMarks", teachingFinalMarks);
  const [researchFinalMarks, setResearchFinalMarks] = useState(0);
  const [serviceFinalMarks, setServiceFinalMarks] = useState(0);
  const [totalMarks, setTotalMarks] = useState(0);

  const rows = useMemo(
    () => [
      {
        performance: "Teaching Performance",
        mark: teachingFinalMarks,
        endPoint: "teaching",
      },
      {
        performance: "Research Performance",
        mark: researchFinalMarks,
        endPoint: "research",
      },
      {
        performance: "Service Performance",
        mark: serviceFinalMarks,
        endPoint: "service",
      },
      {
        performance: "Total Marks",
        mark: totalMarks,
        endPoint: "consolidated",
      },
    ],
    [teachingFinalMarks, researchFinalMarks, serviceFinalMarks, totalMarks]
  );

  useEffect(() => {
    console.log("run");
    axios
      .get(`${API}/api/employee/${emp_id}`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => {
        setIsSubmitted(res.data.formStatus);
        console.log("user data : ", res.data);
      });
  }, []);

  // console.log("")

  async function fetchData() {
    console.log("run")
    try {
      const res = await axios.get(`http://localhost:5000/api/points/${designation}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      // console.log("over all marks service : ", res.data[2].points);
      setResearchMarks(res.data[1].points);
      setServiceMarks(res.data[2].points);
      console.log("overall points", res.data[2].points);
    } catch (err) {
      console.error("error : ", err.message);
    }
  }
  useEffect(() => {
    fetchData();
  }, [token, designation]);

  // function to fetch the file and download
  const fetchFileTeaching = async (endPoint) => {
    try {
      const response = await axios.get(`${API}/api/pdf/${endPoint}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        responseType: "blob", // ✅ Important for handling binary data
      });

      // ✅ Create a URL for the PDF blob
      const fileURL = window.URL.createObjectURL(
        new Blob([response.data], { type: "application/pdf" })
      );

      // ✅ Open the PDF in a new tab for preview
      window.open(fileURL, "_blank");
    } catch (err) {
      console.error("Error fetching file:", err.message);
    }
  };

  async function handleTeachingFileDownload(endPoint) {
    try {
      const response = await axios.get(`${API}/api/pdf/${endPoint}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        responseType: "blob", // ✅ Important for handling binary data
      });

      // ✅ Create a URL for the PDF blob
      const fileURL = window.URL.createObjectURL(
        new Blob([response.data], { type: "application/pdf" })
      );

      // ✅ Optionally, trigger a download instead of preview
      const link = document.createElement("a");
      link.href = fileURL;
      link.setAttribute("download", `${endPoint}.pdf`); // Change filename if needed
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (err) {
      console.error("Error fetching file:", err.message);
    }
  }

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.post(
          `${API}/api/teachingrecord`,
          {
            facultyName: username,
            designation: designation,
          },
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
              "Content-Type": "application/json",
            },
          }
        );

        setTeachingFinalmarks(response.data.teachingMarks);
        setResearchFinalMarks(response.data.researchMarks);
        setServiceFinalMarks(response.data.serviceMarks);
        setTotalMarks(response.data.totalMarks);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };
    fetchData();
  }, []);

  return (
    <>
      {isSubmitted !== "Pending" ? (
        <div className="thanks-page-container mt-4">
          <div className="text-center flex justify-center ">
            <div>
              <img src={thanksImg} className="m-auto w-[180px] md:w-[220px]" />
              <h1 className="mt-4 text-[#318179] text-lg font-semibold">
                Thank You for Submitting !
              </h1>
              <h1 className="text-[#646464] max-sm:text-sm w-[70%] m-auto">
                Thank you for submitting your appraisal form. Your response has
                been recorded successfully.
              </h1>
            </div>
          </div>
          <div className="w-[90%] m-auto mt-2 border border-gray-400 rounded-lg ">
            <table className="w-full border border-gray-300 text-sm rounded-lg overflow-hidden ">
              <thead className="bg-[#A3D9CE]">
                <tr>
                  <th className="p-3 text-left">Performance</th>
                  <th className="p-3 text-left">Marks</th>
                  <th className="p-3 text-center">Action</th>
                </tr>
              </thead>
              <tbody>
                {rows.map((item, index) => (
                  <tr key={index} className="border-t border-gray-300">
                    <td
                      className={`pl-3 ${
                        item.performance.toLowerCase() == "total marks"
                          ? "font-bold"
                          : ""
                      } `}
                    >
                      {item.performance}
                    </td>
                    <td
                      className={`pl-3  ${
                        item.performance.toLowerCase() == "total marks"
                          ? "text-[#0E8474] font-bold"
                          : ""
                      } `}
                    >
                      {item.mark}
                    </td>
                    <td className="p-3 text-center flex items-center justify-center gap-4">
                      <img
                        src={eye}
                        className="cursor-pointer"
                        onClick={() => {
                          fetchFileTeaching(item.endPoint);
                        }}
                      />
                      <img
                        src={download}
                        className="cursor-pointer"
                        onClick={() => {
                          handleTeachingFileDownload(item.endPoint);
                        }}
                      />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        <main className="main-container md:grid grid-cols-12  p-2 md:p-6 gap-4 bg-[#f3fffc] ">
          <div className="stepper-container hidden md:block col-span-3 ">
            <VerticalStepper />
          </div>
          <div className="stepper-container mb-2  md:hidden  ">
            <HorizontalStepper />
          </div>
          <section className="form-container md:col-span-9 h-[93vh] overflow-auto">
            {selectedTab == "Teaching" && <TeachingForm />}
            {selectedTab == "Research" && <ResearchFormPage />}
            {selectedTab == "Service" && <ServicePage />}
          </section>
        </main>
      )}
    </>
  );
};

export default AppraisalFormPage;
