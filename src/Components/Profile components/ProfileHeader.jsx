import React from "react";
import { Image } from "lucide-react";
import clg_img from "../../assets/clg_img_2.png";
import profile_img from "../../assets/profile_img.png";
const ProfileHeader = ({ userData }) => {
  // // console.log(userData);
  return (
    <>
      <main className="">
        <div className="img-container w-[100%] bg-gray-200 rounded-lg max-sm:h-[130px] h-[260px] flex items-center gap-4 justify-center">
          <img
            src={clg_img}
            className="h-[100%] w-[100%] object-cover rounded-lg"
          />
          {/* <Image className='w-20 h-20 text-gray-700' /> */}
        </div>
        <div className="parent-container-profile-img relative">
          <div className="profile-img-container absolute bottom-[-52px] bg-[#318179] max-sm:left-[20px] left-[40px] rounded-full  border-1 border-white max-sm:w-[80px] max-sm:h-[80px] w-[120px] h-[120px] flex items-center justify-center">
            {/* <Image className='w-12 h-12 text-gray-700' /> */}
            {userData.image ? (
              <img src={profile_img} className="w-[100%] h-[100%]" />
            ) : (
              <div className="text-white">{userData.fullName?.slice(0, 1)}</div>
            )}
          </div>
        </div>
      </main>
    </>
  );
};

export default ProfileHeader;
