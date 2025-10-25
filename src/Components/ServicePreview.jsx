import React, { useEffect, useState, useRef, useContext } from "react";
import jsPDF from "jspdf";
import bulb from "../assets/bulb.svg";
import { X, ChevronsRight } from "lucide-react";
import axios from "axios";
import { jwtDecode } from "jwt-decode";
import { Data } from "../Context/Store";
import domtoimage from "dom-to-image-more";
import { Navigate, useNavigate } from "react-router-dom";

export default function ResearchPreview() {
 const API = "http://localhost:5000"
  // refs
  const previewRef = useRef(); // For the modal preview
  const pdfRef = useRef(); // For the hidden PDF content

  // Auth and user details
  const token = localStorage.getItem("appraisal_token");
  const decoded = jwtDecode(token);
  const designation = decoded.designation;
  const username = decoded.facultyName;
  const department = decoded.department;
  const email = decoded.email;
  const emp_id = decoded.id;

  // Context datas
  const {
    setshowPreviewForm1,
    setSerivePreview,
    setSelectedTab,
    setShowPreviewResearch,
    formCompleted,
    setFormCompleted,
    setIsSubmitted,
    isSubmitted,
  } = useContext(Data);
  // States
  const [isCompleted, setIsCompleted] = useState(true);
  const [previewmark, setPreviewmark] = useState(null);
  console.log("previewmarkpreviewmark",previewmark)
  // router dom hooks
  const navigate = useNavigate();

  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "auto";
    };
  }, []);

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
        setPreviewmark(response.data);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };
    fetchData();
  }, [designation, username]);

  const handleDownload = async () => {
    if (!pdfRef.current) return;

    // Wait for all images inside PDF content to load
    const imgs = pdfRef.current.querySelectorAll("img");
    await Promise.all(
      Array.from(imgs).map(
        (img) =>
          new Promise((resolve) => {
            if (img.complete) resolve();
            img.onload = resolve;
            img.onerror = resolve;
          })
      )
    );

    try {
      const dataUrl = await domtoimage.toPng(pdfRef.current, { quality: 1 });
      const pdf = new jsPDF("p", "mm", "a4");
      const imgProps = pdf.getImageProperties(dataUrl);
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;
      pdf.addImage(dataUrl, "PNG", 0, 0, pdfWidth, pdfHeight);
      pdf.save("teaching-preview.pdf");
    } catch (error) {
      console.error("PDF generation failed:", error);
    }
  };

  // function to navigatae to the thanks page
  const handleComplete = async () => {
    setFormCompleted(true);
    try {
      const response = await axios.put(`${API}/api/submit/${emp_id}`);
      const status = response.data.employee.formStatus?.toLowerCase();

      if (status === "submitted") {
        setIsSubmitted("Submitted");
      } else {
        console.log("logical error");
      }
    } catch (err) {
      console.error(err.message);
    }
  };

  

  return (
    <>
      <div className="p-6">
        {/* Main Modal Preview */}
        <div
          ref={previewRef}
          className="bg-white w-[90%] sm:w-[520px] rounded-lg shadow py-4 fixed z-[50] top-[50%] left-[50%] translate-y-[-50%] translate-x-[-50%]"
        >
          {/* Header */}
          <div className="flex justify-between items-center mb-3 pb-3 border-b px-4 border-gray-300">
            <h2 className="font-semibold text-lg">Service Performance</h2>
            <button
              onClick={() => setSerivePreview(false)}
              className="cursor-pointer hover:bg-gray-300 bg-gray-200 rounded-full p-1"
            >
              <X />
            </button>
          </div>

          {/* Table */}
          <div className="rounded-lg overflow-hidden mx-4 border border-gray-300">
            <div className="flex justify-between items-center bg-[#edf7f5] border-b border-gray-200">
              <div className="px-3 py-2 font-medium">Title</div>
              <div className="px-3 py-2 font-medium">Marks</div>
            </div>

            <div className="space-y-1 px-3">
              {[
                [
                  "Accreditation Activities - NAAC, NBA, UGC, NIRF, AU",
                  previewmark?.record?.activities?.marks,
                ],
                [
                  "Branding of Institution ",
                  previewmark?.record?.branding?.marks,
                ],
                [
                  " Membership in Professional Bodies ",
                  previewmark?.record?.membership?.marks,
                ],
                [
                  " Co-curricular and Extra-curricular Outreach Programme",
                  previewmark?.record?.external?.marks,
                ],
                [
                  "Assistance in General Administration",
                  previewmark?.record?.administration?.marks,
                ],
                [
                  "Organizing/Handling Training Progremme for External",
                  previewmark?.record?.training?.marks,
                ],
              ].map(([label, marks], i) => (
                <p key={i} className="flex justify-between font-medium">
                  {label}: <span>{marks ?? 0}</span>
                </p>
              ))}
            </div>

            <div className="flex justify-between pt-2 font-semibold bg-gray-100">
              <div className="px-3 py-2 text-black">Total Marks</div>
              <h1 className="px-3">{previewmark?.serviceMarks ?? 0}</h1>
            </div>
          </div>

          {/* Note */}
          <div className="bg-pink-50 text-[#ED6C83] text-[13px] flex gap-2 mx-4 rounded mt-3 px-3 py-2">
            <img src={bulb} className="w-6 h-6" alt="Note" />
            <span className="font-semibold">Note :</span> You can't edit the
            form once you click Submit button
          </div>

          {/* Buttons */}
          <div className="flex justify-end gap-3 mt-4 px-4">
            {/* <button
              onClick={handleDownload}
              className="bg-gray-200 px-4 py-2 rounded hover:bg-gray-300"
            >
              📄 Download PDF
            </button> */}
            <button
              onClick={() => {
                setSelectedTab("Service");
                setShowPreviewResearch(false);
                setSerivePreview(false);
                handleComplete();
              }}
              className="bg-[#318179] text-white px-6 py-2 rounded hover:bg-[#21645d] text-sm flex items-center gap-1"
            >
              Submit <ChevronsRight />
            </button>
          </div>
        </div>

        {/* Hidden PDF Content (always mounted off-screen) */}
        <div
          ref={pdfRef}
          style={{ position: "absolute", left: "-9999px", top: 0 }}
          className="w-[800px] bg-white p-6"
        >
          {/* Header */}
          {/* Header Section */}
          {/* Header Section */}
          <div className="flex justify-between items-start">
            <img src="/logo.png" alt="Logo" className="w-32 h-auto" />

            <div className="text-right text-sm">
              <p className="font-bold">ORGANISATION DETAILS :</p>
              <p>Sri Eshwar College of Engineering</p>
              <p>366, Sector 4, Rewari, Haryana, India</p>
            </div>
          </div>

          {/* Employee Info */}
          {/* Employee Info */}
          <div className="border border-gray-400 p-3 mt-4 space-y-2 text-sm">
            <div>
              <span className="font-bold border border-black px-1 bg-gray-200">
                Name :
              </span>{" "}
              {username}
            </div>
            <div>
              <span className="font-bold border border-black px-1 bg-gray-200">
                Email ID :
              </span>{" "}
              {email}
            </div>
            <div>
              <span className="font-bold border border-black px-1 bg-gray-200">
                Employee ID :
              </span>{" "}
              {emp_id || 12345}
            </div>
            <div>
              <span className="font-bold border border-black px-1 bg-gray-200">
                Department :
              </span>{" "}
              {department}
            </div>
            <div>
              <span className="font-bold border border-black px-1 bg-gray-200">
                Designation :
              </span>{" "}
              {designation}
            </div>
          </div>

          {/* Table */}
          <table className="w-full mt-6 border border-black border-collapse text-sm">
            <thead className="bg-gray-100">
              <tr>
                <th className="border border-black p-2 text-left">Questions</th>
                <th className="border border-black p-2 text-center">Marks</th>
              </tr>
            </thead>
            <tbody>
              {[
                [
                  "Accreditation Activities - NAAC, NBA, UGC, NIRF, AU",
                  previewmark?.record?.activities?.marks,
                ],
                [
                  "Branding of Institution",
                  previewmark?.record?.branding?.marks,
                ],
                [
                  "Membership in Professional Bodies",
                  previewmark?.record?.membership?.marks,
                ],
                [
                  "Co-curricular and Extra-curricular Outreach Programme",
                  previewmark?.record?.external?.marks,
                ],
                [
                  "Assistance in General Administration",
                  previewmark?.record?.administration?.marks,
                ],
                [
                  "Organizing/Handling Training Programme for External",
                  previewmark?.record?.training?.marks,
                ],
              ].map(([label, marks], i) => (
                <tr key={i}>
                  <td className="border border-black p-2">{label}</td>
                  <td className="border border-black p-2 text-center">
                    {marks ?? 0}
                  </td>
                </tr>
              ))}
            </tbody>
            <tfoot>
              <tr className="font-bold">
                <td className="border border-black p-2">Total Marks</td>
                <td className="border border-black p-2 text-center">
                  {previewmark?.serviceMarks ?? 0}
                </td>
              </tr>
            </tfoot>
          </table>

          {/* Footer */}
          <div className="text-center mt-6 bg-teal-700 text-white p-2 text-xs">
            All rights reserved by @Quantum pulse Technology
          </div>
        </div>
      </div>
      <div className="tint fixed top-0 right-0 left-0 bottom-0"></div>
    </>
  );
}
