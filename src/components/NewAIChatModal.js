import { Bot, Check, File, ShieldAlert, ShieldCheck, X } from "lucide-react";
import React, { useEffect, useState } from "react";
import { db } from "../firebase";
import {
  arrayRemove,
  arrayUnion,
  onSnapshot,
  serverTimestamp,
  Timestamp,
} from "firebase/firestore";
import firebase from "../firebase";
import { ring2 } from "ldrs";
ring2.register();

// Default values shown

export default function NewAIChatModal(props) {
  const [chatName, setChatName] = useState("");
  const [security, setSecurity] = useState(false);
  const [securityPIN, setSecurityPIN] = useState("");
  const [processing, setProcessing] = useState(false);
  // const [AIChatInfo, setAIChatInfo] = useState({
  //   ChatName: [],
  //   ChatNameInfo: [],
  // });

  // // ------------------------- Function to fetch all AI Chat Info
  // function fetchAllChatInfo() {
  //   const user = firebase.auth().currentUser;
  //   const chatRef1 = db
  //     .collection("user")
  //     .doc(user?.uid)
  //     .collection("AIChats")
  //     .doc("AllAIChats");

  //   onSnapshot(chatRef1, (snapshot) => {
  //     setAIChatInfo({
  //       ChatName: snapshot?.data()?.AllChatName,
  //       ChatNameInfo: snapshot?.data()?.AllChatNameInfo,
  //     });
  //   });
  // }

  // // ------------------------- Calling `fetchAllChatInfo()` function
  // useEffect(() => {
  //   fetchAllChatInfo();
  // }, []);

  // ------------------------- Function to check for Chat Name Availability
  function checkNameAvailibility() {
    let flag = 0;
    props?.AIChatInfo?.ChatName?.map((chat) => {
      if (chat.toLowerCase() == chatName.toLowerCase()) {
        flag = 1;
      }
    });

    return flag == 1 ? true : false;
  }

  // ------------------------- Function to get current Date & Time
  function getCurrentDateTime() {
    const now = new Date();
    let hours = now.getHours();
    const minutes = now.getMinutes();
    const period = hours >= 12 ? "pm" : "am";

    hours = hours % 12 || 12; // Convert 0 to 12 for 12-hour format
    let time = `${hours}:${minutes.toString().padStart(2, "0")} ${period}`;
    let date =
      now.getDate() +
      "/" +
      parseInt(parseInt(now.getMonth()) + 1) +
      "/" +
      now.getFullYear();

    return { Time: time, Date: date };
  }

  // ------------------------- Function to create new chat space in Firebase
  function createNewChatInFirebase() {
    let tempTime = getCurrentDateTime();
    const user = firebase.auth().currentUser;
    const chatRef1 = db
      .collection("user")
      .doc(user?.uid)
      .collection("AIChats")
      .doc("AllAIChats")
      .update({
        AllChatName: arrayUnion(chatName),
        AllChatNameInfo: arrayUnion({
          ChatName: chatName,
          CreationDate: tempTime.Date,
          CreationTime: tempTime.Time,
          isSecured: security,
          PIN: securityPIN,
        }),
      });

    const chatRef2 = db
      .collection("user")
      .doc(user?.uid)
      .collection("AIChats")
      .doc(chatName)
      .set({
        chats: [],
      });

    chatRef1.then(() => {
      console.log("Chat is added to all chats !");
    });
    chatRef2.then(() => {
      console.log("Chat space is created, ready to use !");
      props?.setNewChat(false);
    });
  }

  return (
    <div
      className={
        "w-full h-[100svh] fixed left-0 top-0 flex justify-center items-center z-50 backdrop-blur-[5px]" +
        (props?.theme ? " bg-[#00000078]" : " bg-[#b0b0b081]")
      }
      onClick={() => {
        props?.setNewChat(false);
      }}
    >
      <div
        className={
          "w-[350px] h-auto rounded-2xl border-[1.5px] boxShadowLight2 flex flex-col justify-start items-start p-[25px] pt-[18px] " +
          (props?.theme
            ? " bg-[#1A1A1A] border-[#252525]"
            : " bg-[#ffffff] border-[#eaeaea]")
        }
        onClick={(e) => {
          e.stopPropagation();
        }}
      >
        <span
          className={
            "text-[22px] font-[geistMedium] w-full flex justify-between items-center" +
            (props?.theme ? " text-[white]" : " text-[black]")
          }
        >
          Create New Chat
          <X
            width={18}
            height={18}
            strokeWidth={2.2}
            className={
              "cursor-pointer " +
              (props?.theme
                ? " text-[#828282] hover:text-[white]"
                : " text-[#828282] hover:text-[black]")
            }
            onClick={(e) => {
              props?.setNewChat(false);
            }}
          />
        </span>
        <div className="w-full flex justify-start items-center  mt-[20px] ">
          <div className="h-[35px] w-[30px] flex justify-start items-center pl-[10px] ">
            <Bot
              width={16}
              height={16}
              strokeWidth="2"
              className="text-[#7b798b]"
            />
          </div>
          <input
            className={
              "ml-[-30px] w-[calc(100%-0px)] pl-[35px] bg-transparent h-[35px] outline-none rounded-[10px] border-[1.5px] text-[14px] pr-[35px]" +
              (props?.theme
                ? " text-[white] placeholder:text-[#5b5b5b] border-[#2c2c2c]"
                : " text-[black] placeholder:text-[#828282] border-[#2c2c2c]")
            }
            autoFocus
            value={chatName}
            onChange={(e) => {
              if (
                !e.target.value.includes(".") &
                !e.target.value.includes("/") &
                !e.target.value.includes("%")
              ) {
                setChatName(e.target.value);
              }
            }}
            placeholder="eg. Probeseek UI"
          ></input>
          <div
            className={
              "w-[8px] h-[8px] rounded-full ml-[-20px] mr-[12px]" +
              (chatName.length == 0 ? " hidden" : " flex") +
              (props?.theme
                ? checkNameAvailibility()
                  ? " bg-[#e16d2ffd]"
                  : " bg-[#2ec82efd]"
                : checkNameAvailibility()
                ? " bg-[#f1694a]"
                : " bg-[#259c25d4]")
            }
          ></div>
        </div>
        <div className="w-full flex justify-between items-center mt-[15px]">
          <div
            className={
              "flex justify-start items-center" +
              (props?.theme
                ? security
                  ? " text-[#e9e9e9]"
                  : " text-[#828282]"
                : security
                ? " "
                : " text-[#6e6e7c]")
            }
          >
            {security ? (
              <ShieldCheck
                width={16}
                height={16}
                strokeWidth={2}
                className={
                  "mr-[8px]" +
                  (props?.theme
                    ? security
                      ? " text-[#2ec82efd]"
                      : " text-[#828282]"
                    : security
                    ? " "
                    : " text-[#6e6e7c]")
                }
              />
            ) : (
              <ShieldAlert
                width={16}
                height={16}
                strokeWidth={2}
                className={
                  "mr-[8px]" +
                  (props?.theme
                    ? security
                      ? " text-[#2ec82efd]"
                      : " text-[#828282]"
                    : security
                    ? " "
                    : " text-[#6e6e7c]")
                }
              />
            )}
            Enable PIN security
          </div>
          <div className="flex justify-end items-center">
            <div
              className={
                "w-[33px] h-[22px] rounded-full   flex justify-start items-center px-[2px] cursor-pointer" +
                (props?.theme
                  ? !security
                    ? " bg-[#2f2f2f]"
                    : " bg-[#2ec82e40]"
                  : !security
                  ? " bg-[#3E3E3E]"
                  : " bg-[#3a6f7754]")
              }
              onClick={() => {
                setSecurity(!security);
              }}
              style={{ transition: ".1s" }}
            >
              <div
                className={
                  "w-[16px] aspect-square rounded-full  " +
                  (props?.theme
                    ? !security
                      ? " ml-[1px] bg-[#1A1A1A]"
                      : " ml-[11px] bg-[#2ec82efd]"
                    : !security
                    ? " ml-[1px] bg-[#1A1A1A]"
                    : " ml-[11px] bg-[#3a6f77]")
                }
                style={{ transition: ".1s" }}
              ></div>
            </div>
          </div>
        </div>
        {/* <div className="w-full flex justify-center items-center">
          <div className="flex justify-center items-center w-[190px] h-[40px] border-[1.5px] rounded-[10px] mt-[20px] border-[#2f2f2f] bg-transparent outline-none">
            <input
              className="tracking-[20px] h-[40px] bg-transparent outline-none w-[50px] overflow-visible"
              autoFocus
              value={securityPIN}
              onChange={(e) => {
                // if (
                //   !e.target.value.includes(".") & !e.target.value.includes("/")
                // ) {
                setSecurityPIN(e.target.value);
                // }
              }}
            ></input>
          </div>
        </div> */}
        <div className="w-full mt-[30px] flex justify-end items-center">
          {/* <button
            className={
              "px-[15px] h-[30px] rounded-[8px] border-[1.5px] flex justify-center items-center text-[14px] " +
              (props?.theme
                ? "  hover:bg-[#4040409d] border-[#383838] text-[#aeaeae] hover:text-[#ffffff] opacity-100 cursor-pointer mr-[15px]"
                : " bg-[#222222] text-[#828282]")
            }
          >
            Cancel
          </button> */}
          <button
            className={
              "px-[15px] h-[30px] rounded-[8px] border-[1.5px] flex justify-center items-center text-[14px] " +
              (props?.theme
                ? chatName.length > 0 && !checkNameAvailibility()
                  ? " bg-[#404040] hover:bg-[#656565] border-[#515151] hover:border-[#717171]  text-[#ffffff] opacity-100 cursor-pointer"
                  : " bg-[#404040] border-[#515151] text-[#ffffff] opacity-20 cursor-not-allowed"
                : chatName.length > 0 && !checkNameAvailibility()
                ? " bg-[#222222] text-[#828282]"
                : " bg-[#222222] text-[#828282]")
            }
            onClick={() => {
              if (chatName.length > 0 && !checkNameAvailibility()) {
                setProcessing(true);
                createNewChatInFirebase();
              }
            }}
          >
            {processing ? (
              <>
                <l-ring-2
                  size="15"
                  stroke="3"
                  stroke-length="0.25"
                  bg-opacity="0.1"
                  speed="0.8"
                  color="white"
                ></l-ring-2>
                <span className="ml-[8px]">Creating</span>
              </>
            ) : (
              <>Confirm</>
            )}
          </button>
        </div>
        {/* <button>continue</button> */}
      </div>
    </div>
  );
}
