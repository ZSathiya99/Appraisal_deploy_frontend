import React from "react";

const NewPasswordForm = ({handleNewPassword}) => {
  return (
    <>
      <div className="W-[100%] ">
        <div className="">
          <label className="text-white text-sm mb-2 block">New password</label>
          <input
            type="text"
            placeholder="Enter New Password"
            className="w-full py-3 px-2 rounded-md input-bg bg-opacity-10 text-[#ffffff] placeholder-gray-300 placeholder-opacity-50 focus:outline-none focus:ring-2 focus:ring-gray-300 border border-[#ffffff5f] focus:border-none"
          />
          <label className="text-white text-sm mb-2 block mt-2">
            Confirm password
          </label>
          <input  
            type="text"
            placeholder="Enter confirm Password"
            className="w-full py-3 px-2 rounded-md input-bg bg-opacity-10 text-[#ffffff] placeholder-gray-300 placeholder-opacity-50 focus:outline-none focus:ring-2 focus:ring-gray-300 border border-[#ffffff5f] focus:border-none"
          />
          <button
            onClick={handleNewPassword}
            className="w-full bg-[#318179] hover:bg-[#569c96da] mt-4 text-white font-medium cursor-pointer py-4 px-2 rounded-md transition-all duration-100"
          >
            CHANGE PASSWORD
          </button>
        </div>
      </div>
    </>
  );
};

export default NewPasswordForm;
