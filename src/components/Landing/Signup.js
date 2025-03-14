import React, { useEffect } from "react";
import { auth } from "../../firebase";
import {
  createUserWithEmailAndPassword,
  GoogleAuthProvider,
  signInWithPopup,
} from "firebase/auth";
import { db } from "../../firebase";
import { useState } from "react";
import { FcGoogle } from "react-icons/fc";

import { Eye, EyeOff } from "lucide-react";
import { arrayUnion, serverTimestamp } from "firebase/firestore";
import { useNavigate, useParams } from "react-router-dom";
import { toolbarItems } from "../../utils/constant";
import { processStringEncrypt } from "../../utils/functions";
import { formatDate } from "../../utils/functionsConstant";

export default function Signup() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [nameField, setNameField] = useState(false);
  const [emailField, setEmailField] = useState(false);
  const [passwordField, setPasswordField] = useState(false);
  const [showPass, setShowPass] = useState(false);
  const [error, setError] = useState("");

  const provider = new GoogleAuthProvider();

  function formattedName() {
    let words = name.split(" ");
    for (let i = 0; i < words.length; i++) {
      words[i] =
        words[i].charAt(0).toUpperCase() + words[i].slice(1).toLowerCase();
    }
    return words.join(" ");
  }

  // Function to get a proper formatted date with time ---------------------------

  function formatDateTime(dateTimeStr) {
    const months = [
      "Jan",
      "Feb",
      "Mar",
      "Apr",
      "May",
      "Jun",
      "Jul",
      "Aug",
      "Sep",
      "Oct",
      "Nov",
      "Dec",
    ];
    const suffixes = ["st", "nd", "rd", "th"];

    const dateObj = new Date(dateTimeStr);
    const day = dateObj.getDate();
    const month = months[dateObj.getMonth()];
    const year = dateObj.getFullYear();

    const hour = dateObj.getHours() % 12 || 12;
    const minutes = dateObj.getMinutes().toString().padStart(2, "0");
    const period = dateObj.getHours() >= 12 ? "PM" : "AM";

    const getDaySuffix = (day) => {
      if (day >= 11 && day <= 13) return "th";
      return suffixes[(day % 10) - 1] || "th";
    };

    return {
      Date: `${day}${getDaySuffix(day)} ${month}, ${year}`,
      Time: `${hour}:${minutes} ${period}`,
    };
  }

  // Function to create user space in Firebase -----------------------------------

  function createUserCollection(user) {
    let tempCreationTime = formatDateTime(new Date().toLocaleString());

    // UserSpace ----------->
    db.collection("user")
      .doc(user.uid)
      .set({
        // User Details Object --------------------------->
        UserDetails: {
          Name: formattedName(),
          Email: email,
          Password: password,
          UserID: user.uid,
          PhotoURL: "default",
          Username: "notCreated",
          CreationTime: tempCreationTime,
          // Timestamp: serverTimestamp(),
        },

        // Default Editor Settings ----------------------->
        DefaultToolbar: toolbarItems,
        EditedToolbar: toolbarItems,
        notInToolbar: [],

        // Default Account Settings ---------------------->
        Theme: false, // False -> Light || True -> Dark
        AccentColor: "#EAEBF4",
        AppDefaultFont: "geistRegular", // Geist Regular
        AppCurrentFont: "geistRegular", // Geist Regular
        EditorDefaultFont: "rr", // Roboto Mono
        EditorCurrentFont: "rr", // Roboto Mono
      });

    // User API Space ------>
    db.collection("user")
      .doc(user.uid)
      .collection("APIKeys")
      .doc("APIKeys")
      .set({
        StoreAPILocally: false,
        ScopedAPIUsage: false,
        ScopedUserID: user.uid,
        ActiveAPIKey: processStringEncrypt(
          "AIzaSyDViziRgn4Bj7gKX_486zR-SgBqBFLyg0U"
        ),
        AllAPIKeys: [
          {
            APIKeyID: processStringEncrypt(
              "AIzaSyDViziRgn4Bj7gKX_486zR-SgBqBFLyg0U"
            ),
            CreationTime: "By Default",
            Status: "",
          },
        ],
        DeletedAPIKeys: [],
      });

    // User Note Space ----->
    db.collection("user")
      .doc(user.uid)
      .collection("AllNotes")
      .doc("AllNotes")
      .set({
        FolderStructure: [
          { Title: "Readme.txt", isFolder: false, subStructure: [] },
        ],
      });

    // User All Folder Record ----->
    db.collection("user")
      .doc(user.uid)
      .collection("AllNotes")
      .doc("AllFolders")
      .set({
        AllFolders: [],
      });

    // User All Note Content ----->
    db.collection("user")
      .doc(user?.uid)
      .collection("AllNotes")
      .doc("FilewiseContent")
      .collection("FilewiseContent")
      .doc("~_~Readme.txt")
      .set({
        Content: `{"root":{"children":[{"children":[],"direction":null,"format":"","indent":0,"type":"paragraph","version":1,"textFormat":1,"textStyle":"font-size: 50px;font-family: smr;"}],"direction":null,"format":"","indent":0,"type":"root","version":1}}`,
        LastSaved: formatDate(),
      });

    // User All TextFile Record ----->
    db.collection("user")
      .doc(user.uid)
      .collection("AllNotes")
      .doc("AllTextFile")
      .set({
        AllTextFile: ["Readme.txt"],
      });

    // AllUserSpace -------->
    db.collection("allUsers")
      .doc("AllUsersDetails")
      .update({
        // AllUsers Details Array --------------------------->
        AllUsersDetails: arrayUnion({
          Name: formattedName(),
          Email: email,
          Password: password,
          UserID: user.uid,
          PhotoURL: "default",
          Username: "notCreated",
          CreationTime: tempCreationTime,
          // Timestamp: serverTimestamp(),
        }),
      });

    console.log("Account created successfully");
    navigateToLoggedInPage(user.uid);
  }

  const signUp = () => {
    const letterPattern = /[a-zA-Z]/;
    // e.preventDefault();
    if (name.length == 0) {
      setError("Name can't be empty");
    } else if (email.length === 0 || !email.includes("@gmail.com")) {
      setError("Email must contain '@gmail.com'");
    } else if (password.length < 8) {
      setError("Password should be atleast 8 characters");
    } else {
      createUserWithEmailAndPassword(auth, email, password)
        .then((userCredential) => {
          // console.log(userCredential.user.uid);
          // console.log(userCredential.user.email);
          // console.log(userCredential);
          createUserCollection(userCredential.user);
        })
        .catch((error) => {
          console.log(error.message);
          setError("Oops! Email already in use");
        });
    }
  };

  const signUpWithGoogle = () => {
    signInWithPopup(auth, provider)
      .then((result) => {
        const user = result.user;
        console.log("Google Sign-In Success");
        console.log("User ID:", user.uid);
        console.log("Email:", user.email);

        // Optionally, create a user collection in your database
        createUserCollection(user);
      })
      .catch((error) => {
        console.error("Google Sign-In Error:", error.message);
        setError("Google Sign-In failed");
      });
  };

  const navigate = useNavigate();
  function navigateToSection() {
    navigate(`/user/login`);
  }

  function navigateToLoggedInPage(id) {
    navigate(`/user/welcomeUser/user?ID=${id}?section=Notes`);
  }

  useEffect(() => {
    const handleKeyDown = (event) => {
      if (event.key === "Enter") {
        console.log("We are verifying details !");
        signUp();
      }
    };

    window.addEventListener("keydown", handleKeyDown);

    // Cleanup the event listener on component unmount
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, []);

  return (
    <div className="w-full h-[100svh] flex justify-center items-center font-[geistRegular]">
      <div className="w-full lg:w-[350px] md:w-[350px] p-[40px] rounded-none md:rounded-xl lg:rounded-xl h-[100svh] md:h-[70%] lg:h-[70%] max-h-full md:max-h-[550px] lg:max-h-[550px]  flex flex-col justify-center md:justify-center lg:justify-center items-start bg-[white] px-[50px] font-[geistRegular] text-[14px] z-0">
        <div className="font-[geistSemibold] text-[35px] mb-[20px] w-full flex justify-center">
          Sign Up
        </div>
        <div className="w-full h-[40px] flex flex-col justify-start items-start mt-[20px] ">
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
              setError("");
            }}
            onFocus={() => {
              setNameField(true);
            }}
            onBlur={() => {
              setNameField(false);
            }}
          ></input>
        </div>
        <div className="w-full h-[40px] flex flex-col justify-start items-start mt-[15px] ">
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
              setError("");
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
                setError("");
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
            signUp();
          }}
        >
          Sign Up
        </div>

        <div className="w-full h-[40px] mt-[0px] rounded-lg text-[12px] flex justify-center items-center text-[#9ba6aa]">
          Already have an account ?{" "}
          <span
            className="text-[black] ml-[5px] cursor-pointer"
            onClick={() => {
              navigateToSection();
            }}
          >
            {" "}
            Sign In
          </span>
        </div>

        <div className="w-full h-[40px] mt-[0px] rounded-lg text-[12px] flex justify-between items-center text-[#9ba6aa]">
          <div className="w-[calc((100%-40px)/2)] border-t-[1.5px] border-t-[#ededed]"></div>
          <div className="">or</div>
          <div className="w-[calc((100%-40px)/2)] border-t-[1.5px] border-t-[#ededed]"></div>
        </div>
        <div
          className="w-full h-[40px] border-[1.5px] border-[#ededed] rounded-lg bg-transparent px-[12px] flex justify-center items-center  cursor-pointer"
          onClick={() => {
            signUpWithGoogle();
          }}
        >
          <span>
            <FcGoogle className="text-[18px] mr-[10px]" />
          </span>
          <span>Sign up with Google</span>
        </div>
      </div>{" "}
    </div>
  );
}
