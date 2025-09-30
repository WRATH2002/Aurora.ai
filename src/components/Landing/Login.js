import React, { useEffect } from "react";
import { auth } from "../../firebase";
import { signInWithEmailAndPassword } from "firebase/auth";
import { FcGoogle } from "react-icons/fc";

import { useState } from "react";
import { Eye, EyeOff } from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";
import ClickSpark from "../Animations/ClickSpark";
import { onAuthStateChanged } from "firebase/auth";
import { HugeiconsIcon } from "@hugeicons/react";
import { Tick02Icon } from "@hugeicons/core-free-icons";
import { strengthColors } from "../../utils/constant";
import logo from "../../assets/img/brandLogo.svg";

export default function Login(props) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [emailField, setEmailField] = useState(false);
  const [passwordField, setPasswordField] = useState(false);
  const [showPass, setShowPass] = useState(false);
  const [error, setError] = useState("");
  const [errorInfo, setErrorInfo] = useState({
    email: false,
    password: false,
    errorDetails: "",
  });

  useEffect(() => {
    console.log();
    const listen = onAuthStateChanged(auth, (user) => {
      if (user) {
        console.log("✔️ You'r logged in, taking you to the desired page.");
        navigateToLoggedInPage(user.uid);
        console.log("######### Welcome to AURORA #########");
      } else {
        console.error("❌ You'r not logged in, Please login or signup.");
      }
    });
    return () => {
      console.log("⏳ Checking if you'r logged in or not");
      listen();
    };
  }, []);

  const signIn = () => {
    // if (!email.includes("@gmail.com")) {
    //   // setError("Email must contain '@gmail.com'");
    //   setErrorInfo({
    //     email: true,
    //     password: errorInfo.password,
    //     errorDetails: "Email must contain '@gmail.com'",
    //   });
    // } else if (password.length < 8) {
    //   // setError("Password should be atleast 8 characters");
    //   setErrorInfo({
    //     email: false,
    //     password: true,
    //     errorDetails: "Password should be atleast 8 characters",
    //   });
    // } else {
    //   signInWithEmailAndPassword(auth, email.trim(), password)
    //     .then((userCredential) => {
    //       // console.log(userCredential);
    //       console.log("✅ Login successful");
    //       navigateToLoggedInPage(userCredential?.user?.uid);
    //     })
    //     .catch((error) => {
    //       // toast.error("Invalid Login Credentials");
    //       console.log(error);
    //       setError("Oops! Invalid Login Credentials");
    //       // toast.error(error.message);
    //       // console.log(error);
    //       // console.log(error.message);
    //     });
    // }

    let obj = errorInfo;

    if (!email?.toLowerCase()?.includes("@gmail.com")) {
      obj = {
        email: true,
        password: obj.password,
        errorDetails: "",
      };
    }
    if (password?.length < 8) {
      obj = {
        email: obj.email,
        password: true,
        errorDetails: "",
      };
    }

    if (email?.toLowerCase()?.includes("@gmail.com") && password?.length >= 8) {
      signInWithEmailAndPassword(auth, email.trim(), password)
        .then((userCredential) => {
          // console.log(userCredential);
          console.log("✅ Login successful");
          navigateToLoggedInPage(userCredential?.user?.uid);
        })
        .catch((error) => {
          // toast.error("Invalid Login Credentials");
          console.log(error);
          // setError("Oops! Invalid Login Credentials");
          // toast.error(error.message);
          // console.log(error);
          // console.log(error.message);
          setErrorInfo({
            email: false,
            password: false,
            errorDetails: "Oops! Invalid Login Credentials",
          });
        });
    }

    setErrorInfo(obj);
  };
  // function changeMode() {
  //   dispatch(toggleStateMode(2));
  // }

  const navigate = useNavigate();
  function navigateToSection() {
    navigate(`/user/signup`);
  }

  function navigateToLoggedInPage(id) {
    navigate(`/user/welcomeUser/user?ID=${id}?section=Notes`);
  }

  function checkPasswordStrength(pswd) {
    let score = 0;
    // Condition 1: At least one uppercase character
    if (/[A-Z]/.test(pswd)) score += 20;
    // Condition 2: At least one lowercase character
    if (/[a-z]/.test(pswd)) score += 20;
    // Condition 3: At least one numerical character
    if (/[0-9]/.test(pswd)) score += 20;
    // Condition 4: At least one special character
    if (/[^A-Za-z0-9]/.test(pswd)) score += 20;
    // Condition 5: More than 8 characters
    if (pswd.length > 8) score += 20;

    return score; // returns 0, 20, 40, 60, 80, or 100
  }

  function navigateToHome() {
    navigate(`/`);
  }

  return (
    <>
      <ClickSpark
        sparkColor="#000"
        sparkSize={10}
        sparkRadius={15}
        sparkCount={8}
        duration={400}
      />
      <div className="w-full h-[100svh] flex justify-center items-center font-[r]">
        <div
          className="w-full lg:w-[400px] md:w-[400px] p-[40px] py-[20px] rounded-none md:rounded-xl lg:rounded-xl min-h-[100svh] md:min-h-[75%] lg:min-h-[75%]  flex flex-col justify-center md:justify-center lg:justify-center items-start bg-[white] px-[50px] font-[r] text-[14px] max-h-full md:max-h-[100%] lg:max-h-[100%]"
          // style={{ zIndex: "0" }}
        >
          <div
            style={{ zIndex: "10" }}
            className="w-full flex justify-center items-center mb-[30px]"
          >
            <button
              className="w-[80px] h-[80px] p-[13px] rounded-lg bg-[#f7f7f7]"
              onClick={() => {
                navigateToHome();
              }}
            >
              <img src={logo} className=" w-full h-full object-fill "></img>
            </button>
          </div>
          <div
            style={{ zIndex: "10" }}
            className=" font-[geistSemibold] text-[26px] mb-[5px] w-full flex justify-center"
          >
            Yooo, welcome back!
          </div>
          <div
            style={{ zIndex: "10" }}
            className=" w-full flex justify-center items-center text-[#00000078] mb-[20px]"
          >
            First time here ?{" "}
            <button
              className="px-[3px] mx-[2px] text-[black] cursor-pointer"
              onClick={() => {
                navigateToSection();
              }}
            >
              Sign Up for free
            </button>
          </div>

          <div
            style={{ zIndex: "10" }}
            className=" w-full h-[40px] flex flex-col justify-start items-start mt-[20px] "
          >
            <div
              className={
                "w-full min-h-full max-h-full mb-[-40px] flex items-start justify-start pl-[10px] " +
                (emailField || email.length > 0
                  ? " pt-[0px] text-[11px]"
                  : " pt-[20px] text-[13px]")
              }
              style={{ transition: ".3s" }}
            >
              <div
                className={
                  "bg-[#ffffff] h-[4px] mt-[-2px] font-[300]  flex justify-center items-center px-[3px] text-[#0000004d]" +
                  (emailField || email.length > 0 ? " z-[10]" : " z-[0]")
                }
                style={{
                  zIndex: emailField || email.length > 0 ? "100" : "0",
                  // transition: ".3s",
                }}
              >
                Email
              </div>
            </div>
            <input
              className=" w-full  h-[40px] border-[1px] border-[#d5d5d500] rounded-lg bg-transparent px-[12px]"
              // placeholderTextColor="#000000"
              style={{
                zIndex: "5",
                outline: errorInfo?.email
                  ? "2px solid #ce3d00"
                  : "1px solid #d5d5d5" /* Force an outline */,
                outlineOffset: "0px",
              }}
              value={email}
              onChange={(e) => {
                if (errorInfo?.email) {
                  setErrorInfo({
                    email: false,
                    password: errorInfo?.password,
                    errorDetails: "",
                  });
                }
                setEmail(e.target.value);
              }}
              onFocus={() => {
                setEmailField(true);
              }}
              onBlur={() => {
                setEmailField(false);
              }}
            ></input>
          </div>
          <div
            style={{ zIndex: "10" }}
            className=" w-full h-[40px] flex flex-col justify-start items-start mt-[15px] "
          >
            <div
              className={
                "w-full min-h-full max-h-full mb-[-40px] flex items-start justify-start pl-[10px] " +
                (passwordField || password.length > 0
                  ? " pt-[0px] text-[11px]"
                  : " pt-[20px] text-[13px]")
              }
              style={{ transition: ".3s" }}
            >
              <div
                className={
                  "bg-[#ffffff] h-[4px] mt-[-2px]  flex justify-center items-center px-[3px] text-[#0000004d]" +
                  (passwordField || password.length > 0 ? " z-[10]" : " z-[0]")
                }
                style={{
                  zIndex: passwordField || password.length > 0 ? "100" : "0",
                  // transition: ".3s",
                }}
              >
                Password
              </div>
            </div>
            <div
              className="w-full h-[40px]  bg-transparent flex justify-start items-center "
              style={{ zIndex: "5" }}
            >
              <input
                className="w-full h-[40px] border-[1.5px] border-[#ededed00] rounded-lg bg-transparent px-[12px] pr-[52px]   "
                style={{
                  zIndex: "5",
                  outline: errorInfo?.password
                    ? "2px solid #ce3d00"
                    : "1px solid #d5d5d5" /* Force an outline */,
                  outlineOffset: "0px",
                }}
                value={password}
                type={!showPass ? "password" : "text"}
                onChange={(e) => {
                  if (errorInfo?.password) {
                    setErrorInfo({
                      email: errorInfo?.email,
                      password: false,
                      errorDetails: "",
                    });
                  }
                  setPassword(e.target.value);
                }}
                onFocus={() => {
                  setPasswordField(true);
                }}
                onBlur={() => {
                  setPasswordField(false);
                }}
              ></input>
              <button
                className="w-[40px] h-full ml-[-40px] flex justify-center items-center cursor-pointer z-20"
                onClick={() => {
                  setShowPass(!showPass);
                }}
              >
                {showPass ? (
                  <EyeOff width={15} height={15} strokeWidth={1.7} />
                ) : (
                  <Eye width={15} height={15} strokeWidth={1.7} />
                )}
              </button>
            </div>
          </div>

          {/* <div className="z-[2] mt-[15px] mb-[5px] text-[12px] text-[#9b9b9b] ">
            Password Strength :{" "}
            <span className="ml-[0px] text-[black]">
              {strengthColors[checkPasswordStrength(password)]?.tag}
            </span>
          </div>
          <div className="z-[2] w-full h-[5px] rounded-[6px] overflow-hidden flex justify-start items-center bg-[#eeeeee]">
            <div
              className={` h-full rounded-r-[2px]`}
              style={{
                transition: ".3s",
                width: `${checkPasswordStrength(password)}%`,
                backgroundColor: `${
                  strengthColors[checkPasswordStrength(password)]?.bg
                }`,
              }}
            ></div>
          </div> */}

          {/* <div className="z-[2] flex flex-col justify-start items-start text-[13px] mt-[10px]">
            <div className="flex justify-center items-center my-[1px]">
              <div className="min-w-[14px] min-h-[14px] mt-[0px] rounded-full bg-[#2ddf00] mr-[10px] flex justify-center items-center">
                <HugeiconsIcon
                  icon={Tick02Icon}
                  size={10}
                  strokeWidth={4}
                  className=""
                />
              </div>{" "}
              atleast one uppercase character
            </div>
            <div className="flex justify-center items-center my-[1px]">
              <div className="min-w-[14px] min-h-[14px] mt-[0px] rounded-full bg-[black] mr-[10px]"></div>{" "}
              atleast one lowercase character
            </div>
            <div className="flex justify-center items-center my-[1px]">
              <div className="min-w-[14px] min-h-[14px] mt-[0px] rounded-full bg-[black] mr-[10px]"></div>{" "}
              atleast one numerical character
            </div>
            <div className="flex justify-center items-center my-[1px]">
              <div className="min-w-[14px] min-h-[14px] mt-[0px] rounded-full bg-[black] mr-[10px]"></div>{" "}
              atleast one special character
            </div>
            <div className="flex justify-center items-center my-[1px]">
              <div className="min-w-[14px] min-h-[14px] mt-[0px] rounded-full bg-[black] mr-[10px]"></div>{" "}
              more than 8 characters
            </div>
          </div> */}

          <div
            style={{ zIndex: "10" }}
            className={
              " w-full flex justify-end items-center text-[12px] mt-[5px] text-[#ff3b00]" +
              (error.length > 0 ? " flex" : " hidden")
            }
          >
            <div>{error} *</div>
          </div>
          <button
            style={{ zIndex: "10" }}
            className=" w-full h-[40px] mt-[30px] rounded-lg font-[700] tracking-wider bg-[#000000] text-[white] text-[14px] flex justify-center items-center cursor-pointer"
            onClick={() => {
              signIn();
            }}
          >
            Log In
          </button>

          {/* <div
            style={{ zIndex: "10" }}
            className=" w-full h-[40px] mt-[0px] rounded-lg text-[12px] flex justify-center items-center text-[#9ba6aa]"
          >
            Don't have an account yet ?{" "}
            <span
              className="text-[black] ml-[5px] cursor-pointer"
              onClick={() => {
                navigateToSection();
              }}
            >
              {" "}
              Sign Up
            </span>
          </div> */}

          <div className="w-full h-[40px] mt-[0px] rounded-lg text-[12px] flex justify-between items-center text-[#9ba6aa]">
            <div className="w-[calc((100%-40px)/2)] border-t-[1.5px] border-t-[#ededed]"></div>
            <div className="">or</div>
            <div className="w-[calc((100%-40px)/2)] border-t-[1.5px] border-t-[#ededed]"></div>
          </div>
          <div
            style={{ zIndex: "10" }}
            className=" w-full h-[40px] border-[1.5px] border-[#ededed] rounded-lg bg-transparent px-[12px] flex justify-center items-center  cursor-pointer"
          >
            <span>
              <FcGoogle className="text-[18px] mr-[10px]" />
            </span>
            <span>Sign up with Google</span>
          </div>
          <div className="text-[12px] text-center text-[#b3b3b3] mt-[30px] w-full z-[2]">
            You acknowledge that you read, and agree, to our
          </div>
          <div className="text-[12px] text-center text-[#b3b3b3] mt-[0px] w-full z-[2]">
            <button className="text-[#454545] mx-[0px] underline underline-offset-[2px]">
              Terms of Service
            </button>{" "}
            and{" "}
            <button className="text-[#454545] mx-[0px] underline underline-offset-[2px]">
              Privacy Policy
            </button>
            .
          </div>
        </div>{" "}
      </div>
    </>
  );
}
