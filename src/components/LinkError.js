import React, { useState, useEffect } from "react";
import { auth, db } from "../firebase";
import { onSnapshot } from "firebase/firestore";
import firebase from "../firebase";
import { useNavigate, useSearchParams } from "react-router-dom";
import { Copy, Unplug, UnplugIcon } from "lucide-react";
// import { auth } from "../firebase";
import { onAuthStateChanged } from "firebase/auth";
import Noise from "./Animations/Noise";

export default function LinkError() {
  const [theme, setTheme] = useState(false);
  const [isUser, setIsUser] = useState(null);
  const navigate = useNavigate();

  function navigateToSection() {
    navigate(`/user/login`);
  }

  function fetchTheme(userrr) {
    const user = firebase.auth().currentUser;
    const channelRef = db.collection("user").doc(user?.uid);
    onSnapshot(channelRef, (snapshot) => {
      setTheme(snapshot?.data()?.Theme);
      setTimeout(() => {
        setIsUser(userrr);
      }, 50);
    });
  }

  useEffect(() => {
    const listen = onAuthStateChanged(auth, (user) => {
      if (user) {
        fetchTheme(user);
        console.log("logged in");
      } else {
        navigateToSection();
      }
    });
    return () => {
      listen();
    };
  }, []);
  return (
    <div
      className={
        "w-full h-[100svh] flex flex-col justify-center items-center font-[geistRegular]" +
        (theme
          ? " bg-[#141414] text-[#686868]"
          : " bg-[#ffffff] text-[#000000]")
      }
    >
      <Noise
        patternSize={250}
        patternScaleX={1.5}
        patternScaleY={1.5}
        patternRefreshInterval={2}
        patternAlpha={12}
      />
      {/* <UnplugIcon
        width={140}
        height={140}
        strokeWidth={1.5}
        className="rotate-45"
        color="#3b3b3b"
      /> */}
      <span className="text-[120px] font-[geistBold">Oops !</span>
      <span className="text-[16px]">
        The page you are looking for doesn't exist
      </span>
    </div>
  );
}
