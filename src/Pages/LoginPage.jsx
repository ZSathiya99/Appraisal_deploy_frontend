import React, { useContext, useState } from "react";
import login_bg from "../assets/login_bg2.jpeg";
import login_illustration from "../assets/login_illustration.png";
import { useNavigate } from "react-router-dom";
import ForgotPassword from "../Components/ForgotPassword";
import OtpForm from "../Components/OtpForm";
import NewPasswordForm from "../Components/NewPasswordForm";
import axios from "axios";
import { Data } from "../Context/Store";

const LoginPage = () => {
  const API = import.meta.env.VITE_API
  const [isLoading, setIsLoading] = useState(false);
  const { setUserData } = useContext(Data);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLogin, setIsLogin] = useState(true);
  const [isForgotPassword, setIsForgotPassword] = useState(false);
  const [isOtpForm, setIsOtpForm] = useState(false);
  const [isNewPassword, setIsNewPassword] = useState(false);
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);

  const [errors, setErrors] = useState({ email: "", password: "" });

  const handleLogin = async () => {
    const emailRegex = /^[a-zA-Z0-9._%+-]+@sece\.ac\.in$/;
    const newErrors = { email: "", password: "" };
    let hasError = false;

    if (!email.trim()) {
      newErrors.email = "Email is required.";
      hasError = true;
    } else if (!emailRegex.test(email)) {
      newErrors.email = "Enter a valid email address.";
      hasError = true;
    }

    if (!password.trim()) {
      newErrors.password = "Password is required.";
      hasError = true;
    } else if (password.length < 4) {
      newErrors.password = "Password must be at least 6 characters.";
      hasError = true;
    }

    if (hasError) {
      setErrors(newErrors);
      return;
    }

    setErrors({});
    setIsLoading(true);

    try {
      const response = await axios.post(
        `${API}/api/employee-login`,
        { email, password }
      );

      if (response.status === 200) {
        const token = response.data.token;
        localStorage.setItem("appraisal_token", token);
        setUserData(response.data.employee);
        console.log("setUserData=========>", response.data.employee)
        navigate("/profile");
      }
    } catch (err) {
      console.log(err)
      const message =
        err.response?.data?.message || "Login failed. Please try again.";
      setErrors({ ...newErrors, password: message });
    } finally {
      setIsLoading(false);
    }
  };

  function handleNewPassword() {
    setIsLogin(true);
    setIsNewPassword(false);
  }

  function handleForgotPassword() {
    setIsOtpForm(true);
    setIsForgotPassword(false);
  }

  function handleOpenForgotPassword() {
    setIsOtpForm(false);
    setIsLogin(false);
    setIsForgotPassword(true);
  }

  function openNewPassword() {
    setIsNewPassword(true);
    setIsOtpForm(false);
  }

  async function handleSubmit() { }

  return (
    <main>
      <div className="main-container h-[100vh]">
        <img src={login_bg} className="h-[100%] w-[100%] max-sm:object-cover" />
        <div className="main-container absolute top-[50%] translate-y-[-50%] lg:grid grid-cols-2 justify-between  gap-2 px-4 md:px-20 w-[100%]">
          <div className="first-container w-[100%] hidden lg:block">
            <img
              src={login_illustration}
              className="w-[500px] h-[500px] object-cover"
            />
          </div>
          <div className="second-container w-[100%] lg:w-[100%]  h-[100%]">
            <div className="login-form-container flex justify-center items-center shadow-2xl w-[100%] bg-opacity-5 h-[100%] backdrop-blur-md   p-8 rounded-2xl ">
              {isForgotPassword && (
                <div className="w-[100%]">
                  <h1 className="text-white text-3xl font-semibold mb-2 login-heading">
                    Forgot password
                  </h1>
                  <div className="">
                    <label className="text-white text-sm mb-2 block">
                      Email Id
                    </label>
                    <input
                      type="text"
                      placeholder="Enter your email id"
                      className="w-full py-3 px-2 rounded-md input-bg bg-opacity-10 text-[#ffffff] placeholder-gray-300 placeholder-opacity-50 focus:outline-none focus:ring-2 focus:ring-gray-300 border border-[#ffffff5f] focus:border-none"
                    />
                    <button
                      onClick={handleForgotPassword}
                      className="w-full bg-[#0E8474]  mt-4 text-white font-medium cursor-pointer py-4 px-2 rounded-md transition-all duration-100"
                    >
                      GENERATE OTP
                    </button>
                  </div>
                </div>
              )}
              {isLogin && (
                <div className="main-container h-fit  w-[100%]">
                  <h2 className="text-white text-3xl mb-4 font-semibold login-heading">
                    Login
                  </h2>
                  {/* <p className="text-white mb-8 text-sm md:text-md hidden ">
                    Lorem ipsum dolor sit amet consectetur adipisicing elit.
                    Saepe excepturi, sapiente fugit labore animi quam, odit
                    vitae sit quod..
                  </p> */}

                  {/* Email input */}
                  <div className="mb-4 w-[100%] ">
                    <label className="text-white text-sm mb-2 block">
                      Username
                    </label>
                    <input
                      onChange={(e) => setEmail(e.target.value)}
                      type="text"
                      placeholder="Enter your username"
                      className="w-full py-3 px-2 rounded-md input-bg  text-[#ffffff] placeholder-white text-sm placeholder-opacity-50 focus:outline-none focus:ring-2 focus:ring-gray-300 border border-[#ffffff5f] focus:border-none"
                    />
                    {errors.email && (
                      <p className="text-red-500 text-sm mt-1">
                        {errors.email}
                      </p>
                    )}
                  </div>

                  {/* Password input */}
                  <div className="mb-2 relative">
                    <label className="text-white text-sm mb-2 block">
                      Password
                    </label>
                    <input
                      onChange={(e) => setPassword(e.target.value)}
                      type={showPassword ? "text" : "password"}
                      placeholder="Enter your password"
                      className="w-full py-3 px-2 pr-10 rounded-md input-bg bg-opacity-10 text-[#ffffff] placeholder-white text-sm placeholder-opacity-50 focus:outline-none focus:ring-2 focus:ring-gray-300 border border-[#ffffff5f] focus:border-none"
                    />

                    {/* Eye Icon */}
                    <div
                      onClick={() => setShowPassword((prev) => !prev)}
                      className="absolute top-10 right-3 z-[100] text-gray-300 cursor-pointer"
                    >
                      {showPassword ? (
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-5 w-5"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M13.875 18.825A10.05 10.05 0 0112 19c-5.523 0-10-4.477-10-10 0-1.012.151-1.986.435-2.91m2.157-2.15a10.02 10.02 0 0112.828 0M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                          />
                        </svg>
                      ) : (
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-5 w-5"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                          />
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M2.458 12C3.732 7.943 7.523 5 12 5c2.49 0 4.78.905 6.542 2.458M21.542 12c-.686 2.338-2.248 4.356-4.317 5.823M3 3l18 18"
                          />
                        </svg>
                      )}
                    </div>

                    {/* Error message */}
                    {errors.password && (
                      <p className="text-red-500 text-sm mt-1">
                        {errors.password}
                      </p>
                    )}
                  </div>

                  <div className="text-right text-sm mb-6">
                    <a
                      onClick={handleOpenForgotPassword}
                      className="text-white text-opacity-70 cursor-pointer hover:text-white hover:underline"
                    >
                      Forgot Password?
                    </a>
                  </div>

                  <button
                    onClick={handleLogin}
                    disabled={isLoading}
                    className={`w-full bg-[#0E8474]  flex items-center justify-center gap-4 text-white font-medium py-4 px-2 rounded-md transition-all duration-100 ${isLoading ? "cursor-not-allowed" : "cursor-pointer"
                      }`}
                  >
                    LOGIN{" "}
                    {isLoading && (
                      <span>
                        <div className="loader"></div>
                      </span>
                    )}
                  </button>
                </div>
              )}

              {isOtpForm && <OtpForm openNewPassword={openNewPassword} />}
              <div className={`w-[100%] ${!isNewPassword && "hidden"} `}>
                {isNewPassword && (
                  <NewPasswordForm handleNewPassword={handleNewPassword} />
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
};

export default LoginPage;
