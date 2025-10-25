import React from "react";

const OtpForm = ({ openNewPassword }) => {
  return (
    <>
      <div className="main-container w-[100%]">
        <div className="">
          <label className="text-white text-sm mb-2 block">OTP</label>
          <input
            type="text"
            placeholder="Enter otp"
            className="w-full py-3 px-2 rounded-md input-bg bg-opacity-10 text-[#ffffff] placeholder-gray-300 placeholder-opacity-50 focus:outline-none focus:ring-2 focus:ring-gray-300 border border-[#ffffff5f] focus:border-none"
          />
          <button
            onClick={openNewPassword}
            className="w-full bg-[#318179] hover:bg-[#569c96da] mt-4 text-white font-medium cursor-pointer py-4 px-2 rounded-md transition-all duration-100"
          >
            VERIFY OTP
          </button>
        </div>
      </div>
    </>
  );
};

export default OtpForm;
