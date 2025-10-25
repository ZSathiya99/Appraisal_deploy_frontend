import React, { useState } from "react";
import right_arrow from "../../assets/right_arrow_1.svg";
import { useNavigate } from "react-router-dom";

const ProfileContent = ({ userData }) => {
  // // //userData);
  const employeeData = {
    "Emp-Id": userData.employee_id,
    Name: userData.fullName,
    "Mail-Id": userData.email,
    Designation: userData.designation,
    Department: userData.department,
    "Reporting To": userData.reporting_to ? userData.reporting_to : "Null",
    "Job Type": "Full Time",
    "phone_number" : userData.phone_number,
    "joining_date" : userData.joiningDate
  };
  // states
  const [isChecked, setIsChecked] = useState(false);

  // hooks
  const navigate = useNavigate();
  // function for navigating to the form
  const handleNavigate = () => {
    navigate("/profile/appraisal-form");
  };

  return (
    <>
      <main>
        <div className="mt-10 p-6 bg-white  rounded-xl ">
          <div className="md:flex w-[100%] text-lg ">
            <table className="table-auto  w-[40%] md:border-r-1 border-gray-400">
              <tbody>
                <tr>
                  <td className=" order-gray-300 px-4 py-2 font-medium text-gray-700">
                    Emp-Id :
                  </td>
                  <td className=" border-gray-300 px-4 py-2 text-gray-900">
                    {employeeData["Emp-Id"]}
                  </td>
                </tr>
                <tr>
                  <td className=" border-gray-300 px-4 py-2 font-medium text-gray-700">
                    Name
                  </td>
                  <td className=" border-gray-300 px-4 py-2 text-gray-900">
                    {employeeData.Name}
                  </td>
                </tr>
                <tr>
                  <td className=" border-gray-300 px-4 py-2 font-medium text-gray-700">
                    Mail-Id :
                  </td>
                  <td className=" border-gray-300 px-4 py-2 text-gray-900">
                    {employeeData["Mail-Id"]}
                  </td>
                </tr>
                <tr>
                  <td className=" border-gray-300 px-4 py-2 font-medium text-gray-700">
                    Phone number :
                  </td>
                  <td className=" border-gray-300 px-4 py-2 text-gray-900">
                    {employeeData.phone_number}
                   
                  </td>
                </tr>
              </tbody>
            </table>
            <table className="table-auto w-[30%] ">
              <tbody className="">
                <tr className="">
                  <td className=" border-gray-300 px-4 py-2 font-medium text-gray-700">
                    Designation :
                  </td>
                  <td className=" border-gray-300  py-2 text-gray-900">
                    {employeeData.Designation}
                  </td>
                </tr>
                <tr>
                  <td className=" order-gray-300 px-4 py-2 font-medium text-gray-700">
                    Department :
                  </td>
                  <td className=" border-gray-300  py-2 text-gray-900">
                    {employeeData.Department}
                  </td>
                </tr>
                <tr>
                  <td className=" order-gray-300 px-4 py-2 font-medium text-gray-700">
                    Job Type :
                  </td>
                  <td className=" border-gray-300  py-2 text-gray-900">
                    {employeeData["Job Type"]}
                  </td>
                </tr>
                <tr>
                  <td className=" border-gray-300 px-4 py-2 font-medium text-gray-700">
                    Date of Joining :
                  </td>
                  <td className=" border-gray-300 py-2 text-gray-900">
                    {employeeData.joining_date}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          {/* Checkbox */}
          <div className="footer-container px-4">
            <div className="mt-6 flex items-center  gap-2">
              <input
                type="checkbox"
                id="acknowledge"
                checked={isChecked}
                onChange={(e) => setIsChecked(e.target.checked)}
                className="w-4 h-4 accent-[#318179] "
              />
              <label
                htmlFor="acknowledge"
                className="text-sm text-gray-700 leading-5"
              >
                I acknowledge and agree to the above mentioned details
              </label>
            </div>

            {/* Button */}
            <button
              onClick={handleNavigate}
              disabled={!isChecked}
              className={`mt-2 w-fit px-6 cursor-pointer flex justify-center items-center gap-2 py-3 rounded-lg text-white text-sm font-medium transition-all duration-200 ${
                isChecked
                  ? "bg-[#318179] hover:bg-[#305854]"
                  : "bg-gray-400 cursor-not-allowed"
              }`}
            >
              Start Filling Appraisal Form
              <span>
                <img src={right_arrow} alt="" className="w-6 h-6" />
              </span>
            </button>
          </div>
        </div>
      </main>
    </>
  );
};

export default ProfileContent;
