import React, { useContext, useEffect } from "react";
import ServiceForm1 from "../Components/ServicePageComponent/ServiceForm1";
import ServiceForm2 from "../Components/ServicePageComponent/ServiceForm2";
import ServiceForm3 from "../Components/ServicePageComponent/ServiceForm3";
import ServiceForm4 from "../Components/ServicePageComponent/ServiceForm4";
import ServiceForm5 from "../Components/ServicePageComponent/ServiceForm5";
import ServiceForm6 from "../Components/ServicePageComponent/ServiceForm6";
import { Data } from "../Context/Store";
const ServicePage = () => {
  
  const { setSerivePreview, } = useContext(Data);
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
        <ServiceForm1 />
        <ServiceForm2 />
        <ServiceForm3 />
        <ServiceForm4 />
        <ServiceForm5 />
        <ServiceForm6 />
        <div className="button-container flex justify-end">
          <button
            onClick={() => {
              setSerivePreview(true);
            }}
            className="bg-[#318179] px-8 py-2 font-medium text-white rounded cursor-pointer hover:bg-[#305551]"
          >
            Submit
          </button>
        </div>
      </div>
    </>
  );
};

export default ServicePage;
