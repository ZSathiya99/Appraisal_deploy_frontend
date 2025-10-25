import React, { useContext, useEffect, useState } from "react";
import ProfileHeader from "../Components/Profile components/ProfileHeader";
import ProfileContent from "../Components/Profile components/ProfileContent";
import axios from "axios";
import { Data } from "../Context/Store";
import { jwtDecode } from "jwt-decode";

const ProfilePage = () => {
  const API = import.meta.env.VITE_API
  // context data
  const { isSubmitted, setIsSubmitted } = useContext(Data);
  const [userData, setUserData] = useState({});

  //auth
  const token = localStorage.getItem("appraisal_token");
  const decoded = jwtDecode(token);
  const id = decoded.id;
  //useEffects
  useEffect(() => {
    axios
      .get(
        `${API}/api/employee/${id}`,
        { headers: { Authorization: `Bearer ${token}` } }
      )
      .then((res) => {
         setUserData(res.data); 
         setIsSubmitted(res.data.formStatus); 
         console.log("user data : ", res.data)
         });
  }, [token, id]);


  return (
    <>
      <div className="main-container max-sm:p-2 p-2 h-[100vh]">
        <ProfileHeader userData={userData} />
        <ProfileContent userData={userData} />
      </div>
    </>
  );
};

export default ProfilePage;
