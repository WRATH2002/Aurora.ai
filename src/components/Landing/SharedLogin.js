import React, { useEffect } from "react";
import { auth } from "../../firebase";
import { signInWithEmailAndPassword } from "firebase/auth";
import { FcGoogle } from "react-icons/fc";

import { useState } from "react";
import { Eye, EyeOff } from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";
import ClickSpark from "../Animations/ClickSpark";
import { onAuthStateChanged } from "firebase/auth";
// --------------------Icons----------------
// import { useDispatch } from "react-redux";
// import { toggleStateMode } from "../../utils/chatSlice";
// import toast, { Toaster } from "react-hot-toast";

export default function SharedLogin(props) {
  // const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  // const [nameField, setNameField] = useState(false);
  const [emailField, setEmailField] = useState(false);
  const [passwordField, setPasswordField] = useState(false);
  // const [activeField, setActiveField] = useState("")
  const [showPass, setShowPass] = useState(false);
  const [error, setError] = useState("");

  // const dispatch = useDispatch();

  useEffect(() => {
    const listen = onAuthStateChanged(auth, (user) => {
      if (user) {
        // navigateToLoggedInPage(user.uid);
      } else {
      }
    });
    return () => {
      listen();
    };
  }, []);

  const signIn = () => {
    if (!email.includes("@gmail.com")) {
      setError("Email must contain '@gmail.com'");
    } else if (password.length < 8) {
      setError("Password should be atleast 8 characters");
    } else {
      signInWithEmailAndPassword(auth, email.trim(), password)
        .then((userCredential) => {
          console.log(userCredential);
          navigateToLoggedInPage(userCredential?.user?.uid);
        })
        .catch((error) => {
          // toast.error("Invalid Login Credentials");
          console.log(error);
          setError("Oops! Invalid Login Credentials");
          // toast.error(error.message);
          // console.log(error);
          // console.log(error.message);
        });
    }
  };
  // function changeMode() {
  //   dispatch(toggleStateMode(2));
  // }

  const navigate = useNavigate();
  function navigateToSection() {
    navigate(`/user/signup`);
  }

  function navigateToLoggedInPage(id) {
    navigate(-1);
  }

  return (
    <>
      {/* <ClickSpark
        sparkColor="#000"
        sparkSize={10}
        sparkRadius={15}
        sparkCount={8}
        duration={400}
      /> */}
      <div className="w-full h-[100svh] flex justify-center items-center font-[geistRegular]">
        <div className="w-full lg:w-[350px] md:w-[350px] p-[40px] rounded-none md:rounded-xl lg:rounded-xl h-[100svh] md:h-[70%] lg:h-[70%]  flex flex-col justify-center md:justify-center lg:justify-center items-start bg-[white] px-[50px] font-[geistRegular] text-[14px] z-0 max-h-full md:max-h-[550px] lg:max-h-[550px]">
          <div className="font-[geistSemibold] text-[35px] mb-[20px] w-full flex justify-center">
            Log In
          </div>
          {/* <div className="w-full h-[40px] flex flex-col justify-start items-start ">
          <div
            className={
              "w-full min-h-full max-h-full mb-[-40px] flex items-start justify-start pl-[10px] " +
              (nameField || name.length > 0
                ? " pt-[0px] text-[11px]"
                : " pt-[20px] text-[14px]")
            }
            style={{ transition: ".3s" }}
          >
            <div
              className={
                "bg-[#ffffff] h-[4px] mt-[-2px]  flex justify-center items-center px-[3px] text-[#9ba6aa]" +
                (nameField || name.length > 0 ? " z-[10]" : " z-[0]")
              }
              style={{
                zIndex: nameField || name.length > 0 ? "100" : "0",
                // transition: ".3s",
              }}
            >
              Name
            </div>
          </div>
          <input
            className="w-full h-[40px] border-[1.5px] border-[#ededed] rounded-lg bg-transparent px-[12px] outline-none "
            style={{ zIndex: "5" }}
            value={name}
            onChange={(e) => {
              setName(e.target.value);
            }}
            onFocus={() => {
              setNameField(true);
            }}
            onBlur={() => {
              setNameField(false);
            }}
          ></input>
        </div> */}
          <div className="w-full h-[40px] flex flex-col justify-start items-start mt-[20px] ">
            <div
              className={
                "w-full min-h-full max-h-full mb-[-40px] flex items-start justify-start pl-[10px] " +
                (emailField || email.length > 0
                  ? " pt-[0px] text-[11px]"
                  : " pt-[20px] text-[14px]")
              }
              style={{ transition: ".3s" }}
            >
              <div
                className={
                  "bg-[#ffffff] h-[4px] mt-[-2px]  flex justify-center items-center px-[3px] text-[#9ba6aa]" +
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
              className="w-full h-[40px] border-[1.5px] border-[#ededed] rounded-lg bg-transparent px-[12px] outline-none "
              style={{ zIndex: "5" }}
              value={email}
              onChange={(e) => {
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
          <div className="w-full h-[40px] flex flex-col justify-start items-start mt-[15px] ">
            <div
              className={
                "w-full min-h-full max-h-full mb-[-40px] flex items-start justify-start pl-[10px] " +
                (passwordField || password.length > 0
                  ? " pt-[0px] text-[11px]"
                  : " pt-[20px] text-[14px]")
              }
              style={{ transition: ".3s" }}
            >
              <div
                className={
                  "bg-[#ffffff] h-[4px] mt-[-2px]  flex justify-center items-center px-[3px] text-[#9ba6aa]" +
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
                className="w-full h-[40px] border-[1.5px] border-[#ededed] rounded-lg bg-transparent px-[12px] pr-[52px] outline-none "
                style={{ zIndex: "5" }}
                value={password}
                type={!showPass ? "password" : "text"}
                onChange={(e) => {
                  setPassword(e.target.value);
                }}
                onFocus={() => {
                  setPasswordField(true);
                }}
                onBlur={() => {
                  setPasswordField(false);
                }}
              ></input>
              <div
                className="w-[40px] h-full ml-[-40px] flex justify-center items-center cursor-pointer z-20"
                onClick={() => {
                  setShowPass(!showPass);
                }}
              >
                {showPass ? (
                  <EyeOff width={15} height={15} strokeWidth={1.9} />
                ) : (
                  <Eye width={15} height={15} strokeWidth={1.9} />
                )}
              </div>
            </div>
          </div>
          <div
            className={
              "w-full flex justify-end items-center text-[12px] mt-[5px] text-[#ff3b00]" +
              (error.length > 0 ? " flex" : " hidden")
            }
          >
            <div>{error} *</div>
          </div>
          <div
            className="w-full h-[40px] mt-[30px] rounded-lg bg-[#27344c] text-[white] text-[14px] flex justify-center items-center cursor-pointer"
            onClick={() => {
              signIn();
            }}
          >
            Log In
          </div>

          <div className="w-full h-[40px] mt-[0px] rounded-lg text-[12px] flex justify-center items-center text-[#9ba6aa]">
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
          </div>

          <div className="w-full h-[40px] mt-[0px] rounded-lg text-[12px] flex justify-between items-center text-[#9ba6aa]">
            <div className="w-[calc((100%-40px)/2)] border-t-[1.5px] border-t-[#ededed]"></div>
            <div className="">or</div>
            <div className="w-[calc((100%-40px)/2)] border-t-[1.5px] border-t-[#ededed]"></div>
          </div>
          <div className="w-full h-[40px] border-[1.5px] border-[#ededed] rounded-lg bg-transparent px-[12px] flex justify-center items-center  cursor-pointer">
            <span>
              <FcGoogle className="text-[18px] mr-[10px]" />
            </span>
            <span>Sign up with Google</span>
          </div>
        </div>{" "}
      </div>
    </>
  );
}
