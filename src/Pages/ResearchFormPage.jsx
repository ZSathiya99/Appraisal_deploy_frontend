import React, { useContext, useEffect } from "react";
import VerticalStepper from "../Components/VerticalStepper ";
import { Data } from "../Context/Store";
import TeachingForm from "../Components/TeachingForm";
import ResearchForm1 from "../Components/ResearchFormComponents/ResearchForm1";
import ResearchForm2 from "../Components/ResearchFormComponents/ResearchForm2";
import ResearchForm3 from "../Components/ResearchFormComponents/ResearchForm3";
import ResearchForm4 from "../Components/ResearchFormComponents/ResearchForm4";
import ResearchForm5 from "../Components/ResearchFormComponents/ResearchForm5";
import ResearchForm7 from "../Components/ResearchFormComponents/ResearchForm7";
import ResearchForm8 from "../Components/ResearchFormComponents/ResearchForm8";
import ResearchForm9 from "../Components/ResearchFormComponents/ResearchForm9";
import ResearchForm11 from "../Components/ResearchFormComponents/ResearchForm11";
import ResearchForm14 from "../Components/ResearchFormComponents/ResearchForm14";
import ResearchForm13 from "../Components/ResearchFormComponents/ResearchForm13";
import ResearchForm6 from "../Components/ResearchFormComponents/ResearchForm6";
import HorizontalStepper from "../Components/HorizontalStepper";
import ResearchForm10 from "../Components/ResearchFormComponents/ResearchForm10";
const ResearchFormPage = () => {
  const { setSelectedTab, setShowPreviewResearch } = useContext(Data);
  function handleNext() {
    // setSelectedTab("Service");
    setShowPreviewResearch(true);
  }

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

  return (
    <>
      <div className="main-container space-y-3">
        <ResearchForm1 />
        <ResearchForm2 />
        <ResearchForm3 />
        <ResearchForm4 />
        <ResearchForm5 />
        <ResearchForm6 />
        <ResearchForm7 />
        <ResearchForm8 />
        <ResearchForm9 />
        <ResearchForm10 />
        <ResearchForm11 />
        <ResearchForm13 />
        <ResearchForm14 />
      </div>
      <div className="button-container flex items-center justify-end mt-2">
        <button
          onClick={() => {
            handleNext();
          }}
          className="bg-[#318179] px-8 py-2 font-medium text-white rounded cursor-pointer hover:bg-[#305551]"
        >
          Next
        </button>
      </div>
    </>
  );
};

export default ResearchFormPage;
