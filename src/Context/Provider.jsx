import { useEffect, useState } from "react";
import { Data } from "./Store.js";
import { Axis3D } from "lucide-react";
export const DataProvider = ({ children }) => {
  const [formCompleted, setFormCompleted] = useState(false);
  const [showPreviewForm1, setshowPreviewForm1] = useState(false);
  const [step, setStep] = useState(1);
  const [selectedTab, setSelectedTab] = useState("Teaching");
  const [teachingFiles, setTeachingFiles] = useState([]);
  const [teachingMarks, setTeachingMarks] = useState([]);
  const [userData, setUserData] = useState({});
  const [markData, setMarkData] = useState({});
  const [remarkData, setRemarkData] = useState({});
  const [researchMarks, setResearchMarks] = useState(null);
  const [serviceMarks, setServiceMarks] = useState(null);
  const [showPreviewResearch, setShowPreviewResearch] = useState(false);
  const [showServicePreview, setSerivePreview] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState("");
  return (
    <Data.Provider
      value={{
        setResearchMarks,
        setServiceMarks,
        step,
        setStep,
        selectedTab,
        setSelectedTab,
        userData,
        setUserData,
        markData,
        setMarkData,
        remarkData,
        setRemarkData,
        showPreviewForm1,
        setshowPreviewForm1,
        setResearchMarks,
        researchMarks,
        serviceMarks,
        setShowPreviewResearch,
        showPreviewResearch,
        showServicePreview,
        setSerivePreview,
        formCompleted,
        setFormCompleted,
        isSubmitted,
        setIsSubmitted,
      }}
    >
      {children}
    </Data.Provider>
  );
};
