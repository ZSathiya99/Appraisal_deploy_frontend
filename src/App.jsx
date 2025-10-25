import React, { useContext, useEffect } from "react";
import { Routes, Route } from "react-router-dom";
import ProfilePage from "./Pages/ProfilePage";
import AppraisalFormPage from "./Pages/AppraisalFormPage";
import LoginPage from "./Pages/LoginPage";
import { Data } from "./Context/Store";
import TeachingPreview from "./Components/TeachingPreview";
import ResearchPreview from "./Components/ResearchPreview";
import ServicePreview from "./Components/ServicePreview";
import ThanksPage from "./Pages/ThanksPage";

const App = () => {
 
  const {
    setMarkData,
    showPreviewForm1,
    setshowPreviewForm1m,
    showPreviewResearch,
    showServicePreview,
  } = useContext(Data);
  console.log("prev state : ", showPreviewForm1);
  return (
    <>
      <Routes>
        <Route path="/" element={<LoginPage />} />
        <Route path="/profile" element={<ProfilePage />} />
        <Route path="/profile/appraisal-form" element={<AppraisalFormPage />} />
        <Route path="/profile/appraisal-completed" element={<ThanksPage />} />
      </Routes>
      {showPreviewForm1 && <TeachingPreview />}
      {showPreviewResearch && <ResearchPreview />}
      {showServicePreview && <ServicePreview />}
    </>
  );
};

export default App;
