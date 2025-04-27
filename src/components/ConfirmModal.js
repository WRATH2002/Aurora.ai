import { Bot, Files, Info, PenLine, Plus, X } from "lucide-react";
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
import { QR } from "react-qr-rounded";
import { useSearchParams } from "react-router-dom";

export default function ConfirmModal(props) {
  return (
    <div
      className={
        "w-full h-[100svh] fixed left-0 top-0 flex justify-center items-center z-50 backdrop-blur-[5px]" +
        (props?.theme ? " bg-[#00000078]" : " bg-[#b0b0b081]")
      }
      onClick={() => {
        // props?.setNewChat(false);
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
        ConfirmModal
      </div>
    </div>
  );
}

// setShareModal = { setShareModal };
// shareModal = { shareModal };
// setShareModalData = { setShareModalData };
// shareModalData = { shareModalData };

export function RenameChatModal(props) {
  const [newName, setNewName] = useState(props?.renameModalData[0]);

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

  // ------------------------- Function to check for Chat Name Availability
  function checkNameAvailibility() {
    let flag = 0;
    props?.AIChatInfo?.ChatName?.map((chat) => {
      if (chat.toLowerCase() == newName.toLowerCase()) {
        flag = 1;
      }
    });

    return flag == 1 ? true : false;
  }

  // ------------------------- Delete Chat Space from Firebase
  function deleteChatFromFirebase(path, chatInfo) {
    const user = firebase.auth().currentUser;

    db.collection("user")
      .doc(user?.uid)
      .collection("AIChats")
      .doc("AllAIChats")
      .update({ AllChatName: arrayRemove(path) }); // delete from AllChatName

    db.collection("user")
      .doc(user?.uid)
      .collection("AIChats")
      .doc("AllAIChats")
      .update({ AllChatNameInfo: arrayRemove(chatInfo) }); // delete from AllChatNameInfo

    const chatDocPathRef = db
      .collection("user")
      .doc(user?.uid)
      .collection("AIChats")
      .doc(path);

    chatDocPathRef.delete().then(() => {
      console.log("deleted");
      props?.setRenameModalData([]);
    });
  }

  // -------------------------- Function to create new Chat Space in Firebase
  function createNewChatSpace(chatData, NewChatName, chatInfo) {
    const user = firebase.auth().currentUser;
    let tempDateTime = getCurrentDateTime();

    const chatRef2 = db
      .collection("user")
      .doc(user?.uid)
      .collection("AIChats")
      .doc(NewChatName)
      .set({
        chats: chatData,
      });

    chatRef2.then(() => {
      console.log("Chat is renamed!");
      //  props?.setSelectedChatName()
    });

    db.collection("user")
      .doc(user?.uid)
      .collection("AIChats")
      .doc("AllAIChats")
      .update({ AllChatName: arrayUnion(NewChatName) }); // add in AllChatName

    db.collection("user")
      .doc(user?.uid)
      .collection("AIChats")
      .doc("AllAIChats")
      .update({
        AllChatNameInfo: arrayUnion({
          ChatName: NewChatName,
          CreationDate: chatInfo?.CreationDate,
          CreationTime: chatInfo?.CreationTime,
          isSecured: chatInfo?.isSecured,
          PIN: chatInfo?.PIN,
          isEdited: true, // Extra feild for Edited chats
          EditCount: chatInfo?.EditCount ? chatInfo?.EditCount + 1 : 1, // Extra feild for Edited chats
          LastEditedDate: tempDateTime?.Date, // Extra feild for Edited chats
          LastEditedTime: tempDateTime?.Time, // Extra feild for Edited chats
        }),
      }); // add in AllChatNameInfo
  }

  // -------------------------- Function to Rename the Chat Space in Firebase
  function renameChatInFirebase(path, chatInfo, NewChatName) {
    const user = firebase.auth().currentUser;

    let tempChatSpaceData = [];

    db.collection("user")
      .doc(user?.uid)
      .collection("AIChats")
      .doc(path)
      .get()
      .then((doc) => {
        if (doc.exists) {
          tempChatSpaceData = doc.data()?.chats;
          createNewChatSpace(tempChatSpaceData, NewChatName, chatInfo);
          deleteChatFromFirebase(path, chatInfo);
          // console.log(tempChatSpaceData);
        } else {
          console.log("No such chat exist");
        }
      })
      .catch((error) => {
        console.error("Error fetching the chat", error);
      });
  }

  return (
    <>
      <div
        className={
          "w-full h-[100svh] fixed left-0 top-0 flex justify-center items-center z-50 backdrop-blur-[5px]" +
          (props?.theme ? " bg-[#00000078]" : " bg-[#b0b0b081]")
        }
        onClick={() => {
          props?.setRenameModalData([]);
          props?.setRenameModal(false);
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
            Rename Chat
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
                props?.setRenameModalData([]);
                props?.setRenameModal(false);
              }}
            />
          </span>
          <div
            className={
              "w-full mt-[20px]" +
              (props?.theme ? " text-[#828282]" : " text-[#828282]")
            }
          >
            Enter new chat name
          </div>
          <div className="w-full flex justify-start items-center  mt-[10px] ">
            <div className="h-[35px] w-[30px] flex justify-start items-center pl-[10px] ">
              <PenLine
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
              value={newName}
              onChange={(e) => {
                if (
                  !e.target.value.includes(".") &
                  !e.target.value.includes("/") &
                  !e.target.value.includes("%")
                ) {
                  setNewName(e.target.value);
                }
              }}
              placeholder="eg. Probeseek UI"
            ></input>
            <div
              className={
                "w-[8px] h-[8px] rounded-full ml-[-20px] mr-[12px]" +
                (newName.length == 0 ? " hidden" : " flex") +
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
          <div className="w-full mt-[30px] flex justify-end items-center">
            <button
              className={
                "px-[15px] h-[30px] rounded-[8px] border-[1.5px] flex justify-center items-center text-[14px] " +
                (props?.theme
                  ? newName.length > 0 && !checkNameAvailibility()
                    ? " bg-[#404040] hover:bg-[#656565] border-[#515151] hover:border-[#717171]  text-[#ffffff] opacity-100 cursor-pointer"
                    : " bg-[#404040] border-[#515151] text-[#ffffff] opacity-20 cursor-not-allowed"
                  : newName.length > 0 && !checkNameAvailibility()
                  ? " bg-[#222222] text-[#828282]"
                  : " bg-[#222222] text-[#828282]")
              }
              onClick={() => {
                renameChatInFirebase(
                  props?.renameModalData[0],
                  props?.renameModalData[1],
                  newName
                );
                console.log(props?.renameModalData[0]);
                console.log(newName);
                props?.setRenameModal(false);
              }}
            >
              Confirm
            </button>
          </div>
        </div>
      </div>
    </>
  );
}

export function ShareChat(props) {
  const [newName, setNewName] = useState(props?.shareModalData[0]);
  const [addUser, setAddUser] = useState("");
  const [visibilityModal, setVisibilityModal] = useState("Public");
  const [durationModal, setDurationModal] = useState("1 day");
  const [accessGrantedUser, setAccessGrantedUser] = useState([]);
  const [isShared, setIsShared] = useState(false);
  const [searchParams] = useSearchParams(); //   const [userID, setUserID] = useState("")

  //   useEffect(() => {
  // setUserID()
  //   },[])

  // cost sear

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

  // --------------------------- Function to create share chat space
  function createShareChatSpaceInFirebase(
    path,
    chatData,
    duration,
    visibility,
    userArr
  ) {
    const user = firebase.auth().currentUser;
    let tempDateTime = getCurrentDateTime();
    let tempLink = `https://auroranoteai.vercel.app/shared?chat=${props?.shareModalData[0]
      ?.split(" ")
      ?.join("%20")}?userID=${user.uid}`;

    // console.log(tempLink);
    // console.log(path);

    // db.collection("sharedChat")
    //   .doc(user.uid)
    //   .update({
    //     SharedChats: arrayUnion(path),
    //     ChatAccessRequest: [],
    //     ChatAccessGranted: accessGrantedUser,
    //   });

    // ---------------------

    db.collection("sharedChat")
      .doc(path + "~_~" + user.uid)
      .set({
        chats: chatData,
        sharedDate: tempDateTime?.Date,
        sharedTime: tempDateTime?.Time,
        sharedDuration: duration,
        visibility: visibility,
        users: userArr,
      });

    db.collection("user")
      .doc(user.uid)
      .collection("AIChats")
      .doc("AllAIChats")
      .update({
        AllSharedChatName: arrayUnion({
          chatName: path,
          // chats: chatData,  // Reason the structur will take a lot of space for high chats space sharing
          sharedDate: tempDateTime?.Date,
          sharedTime: tempDateTime?.Time,
          sharedDuration: duration,
          visibility: visibility,
          users: userArr,
          linkToChat: tempLink,
        }),
        // ChatAccessRequest: [], // Structure --> {Requestor : UserID, RequestedFor : ChatName}
        // AllSharedChatInfo: arrayUnion()
      });
  }

  // --------------------------- Function to share the chat
  function shareChatWithOther(path, duration, visibility, userArr) {
    const user = firebase.auth().currentUser;

    let tempChatSpaceData = [];

    db.collection("user")
      .doc(user?.uid)
      .collection("AIChats")
      .doc(path)
      .get()
      .then((doc) => {
        if (doc.exists) {
          tempChatSpaceData = doc.data()?.chats;
          createShareChatSpaceInFirebase(
            path,
            tempChatSpaceData,
            duration,
            visibility,
            userArr
          );
          // createNewChatSpace(tempChatSpaceData, NewChatName, chatInfo);
          // deleteChatFromFirebase(path, chatInfo);
          // console.log(tempChatSpaceData);
        } else {
          console.log("No such chat exist");
        }
      })
      .catch((error) => {
        console.error("Error fetching the chat", error);
      });
  }

  // --------------------------- Function to copy text
  function copyToClipboard(text) {
    // const text = "Add note at cursor location";
    navigator.clipboard
      .writeText(text)
      .then(() => {
        console.log("Text copied to clipboard");
      })
      .catch((err) => {
        console.error("Failed to copy text: ", err);
      });
  }

  return (
    <>
      <div
        className={
          "w-full h-[100svh] fixed left-0 top-0 flex justify-center items-center z-50 backdrop-blur-[5px]" +
          (props?.theme ? " bg-[#00000078]" : " bg-[#b0b0b081]")
        }
        onClick={() => {
          // props?.setRenameModalData([]);
          props?.setShareModal(false);
        }}
      >
        <div
          className={
            "w-[700px] h-auto rounded-2xl border-[1.5px] boxShadowLight2 flex flex-col justify-start items-start p-[25px] pt-[18px] " +
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
            Share Chat
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
                // props?.setRenameModalData([]);
                props?.setShareModal(false);
              }}
            />
          </span>
          <div className="w-full h-auto flex justify-between items-start mt-[20px]">
            <div
              className={
                "w-[calc(100%-280px)] h-auto  mr-[30px] pr-[30px] flex flex-col justify-start items-start border-r-[1.5px] " +
                (props?.theme
                  ? " text-[white] border-[#2c2c2c]"
                  : " text-[black] border-[#2c2c2c]")
              }
            >
              <div
                className={
                  "w-full overflow-hidden text-ellipsis line-clamp-1" +
                  (props?.theme ? " text-[#828282]" : " text-[#828282]")
                }
              >
                Chat to be shared :{" "}
                {/* <span
                  className={
                    "font-[geistMedium] " +
                    (props?.theme ? " text-[white]" : " text-[black]")
                  }
                >
                  {props?.shareModalData[0]}
                </span> */}
              </div>
              <div
                className={
                  "w-full overflow-hidden text-ellipsis line-clamp-1 mt-[5px] text-[16px]" +
                  (props?.theme ? " text-[#828282]" : " text-[#828282]")
                }
              >
                <span
                  className={
                    "font-[geistMedium] " +
                    (props?.theme ? " text-[white]" : " text-[black]")
                  }
                >
                  {props?.shareModalData[0]}
                </span>
              </div>
              <span
                className={
                  "mt-[20px] " +
                  (props?.theme ? " text-[#828282]" : " text-[#828282]")
                }
              >
                Chat name to be shown
              </span>
              <div className="w-full flex justify-start items-center mt-[10px]">
                <input
                  className={
                    "w-full h-[35px] px-[12px] outline-none rounded-[10px] border-[1.5px] bg-transparent" +
                    (props?.theme
                      ? " text-[white] placeholder:text-[#5b5b5b] border-[#2c2c2c]"
                      : " text-[black] placeholder:text-[#828282] border-[#2c2c2c]")
                  }
                  value={newName}
                  onChange={(e) => {
                    if (
                      !e.target.value.includes(".") &
                      !e.target.value.includes("/") &
                      !e.target.value.includes("%")
                    ) {
                      setNewName(e.target.value);
                    }
                  }}
                  placeholder="This name will be visible to shared people"
                ></input>
              </div>
              <div className="mt-[20px] w-full flex justify-between items-center">
                <div
                  className={
                    "flex justify-start items-center" +
                    (props?.theme ? " text-[#828282]" : " text-[#6e6e7c]")
                  }
                >
                  Chat visibility
                </div>
                <div className="flex flex-col justify-center items-end bg-[#141414] border-[1.5px] border-[#1e1e1e] rounded-[10px]">
                  <div className="w-[150px]  h-[35px] p-[5px] flex justify-start items-center mb-[-35px]">
                    <div
                      className={
                        "min-w-[50%]  h-full bg-[#2a2a2a] border-[1.5px] border-[#2f2f2f] rounded-[6px] " +
                        (visibilityModal == "Public"
                          ? " ml-[0px]"
                          : " ml-[69px]")
                      }
                      style={{ transition: ".15s" }}
                    ></div>
                  </div>
                  <div className="w-[150px]  h-[35px] flex justify-center items-center px-[5px] ">
                    <div
                      className={
                        "w-[75px] h-full flex justify-center items-center cursor-pointer hover:text-[white]" +
                        (props?.theme
                          ? visibilityModal == "Public"
                            ? " text-[white]"
                            : " text-[#828282]"
                          : visibilityModal == "Public"
                          ? " text-[white]"
                          : " text-[#828282]")
                      }
                      onClick={() => {
                        setVisibilityModal("Public");
                      }}
                    >
                      Public
                    </div>
                    <div
                      className={
                        "w-[75px] h-full flex justify-center items-center cursor-pointer hover:text-[white]" +
                        (props?.theme
                          ? visibilityModal == "Private"
                            ? " text-[white]"
                            : " text-[#828282]"
                          : visibilityModal == "Private"
                          ? " text-[white]"
                          : " text-[#828282]")
                      }
                      onClick={() => {
                        setVisibilityModal("Private");
                      }}
                    >
                      Private
                    </div>
                  </div>
                </div>
              </div>

              <div className="mt-[10px] w-full flex justify-between items-center">
                <div
                  className={
                    "flex justify-start items-center" +
                    (props?.theme ? " text-[#828282]" : " text-[#6e6e7c]")
                  }
                >
                  Share duration
                </div>
                <div className="flex flex-col justify-center items-end bg-[#141414] border-[1.5px] border-[#1e1e1e] rounded-[10px]">
                  <div className="w-[180px]  h-[35px] p-[5px] flex justify-start items-center mb-[-35px]">
                    <div
                      className={
                        "min-w-[33%]  h-full bg-[#2a2a2a] border-[1.5px] border-[#2f2f2f] rounded-[6px] " +
                        (durationModal == "1 day"
                          ? " ml-[0px]"
                          : durationModal == "3 day"
                          ? " ml-[56.67px]"
                          : " ml-[113.34px]")
                      }
                      style={{ transition: ".15s" }}
                    ></div>
                  </div>
                  <div className="w-[180px]  h-[35px] flex justify-center items-center px-[5px] ">
                    <div
                      className={
                        "w-[56.67px] h-full flex justify-center items-center cursor-pointer hover:text-[white]" +
                        (props?.theme
                          ? durationModal == "1 day"
                            ? " text-[white]"
                            : " text-[#828282]"
                          : durationModal == "1 day"
                          ? " text-[white]"
                          : " text-[#828282]")
                      }
                      onClick={() => {
                        setDurationModal("1 day");
                      }}
                    >
                      1 day
                    </div>
                    <div
                      className={
                        "w-[56.67px] h-full flex justify-center items-center cursor-pointer hover:text-[white]" +
                        (props?.theme
                          ? durationModal == "3 day"
                            ? " text-[white]"
                            : " text-[#828282]"
                          : durationModal == "3 day"
                          ? " text-[white]"
                          : " text-[#828282]")
                      }
                      onClick={() => {
                        setDurationModal("3 day");
                      }}
                    >
                      3 day
                    </div>
                    <div
                      className={
                        "w-[56.67px] h-full flex justify-center items-center cursor-pointer hover:text-[white]" +
                        (props?.theme
                          ? durationModal == "1 week"
                            ? " text-[white]"
                            : " text-[#828282]"
                          : durationModal == "1 week"
                          ? " text-[white]"
                          : " text-[#828282]")
                      }
                      onClick={() => {
                        setDurationModal("1 week");
                      }}
                    >
                      1 week
                    </div>
                  </div>
                </div>
              </div>
              {visibilityModal == "Private" ? (
                <>
                  <span
                    className={
                      "mt-[20px] " +
                      (props?.theme ? " text-[#828282]" : " text-[#828282]")
                    }
                  >
                    Add users
                  </span>
                  <div className="w-full flex justify-start items-center mt-[10px]">
                    <input
                      className={
                        "w-[calc(100%)] h-[35px] px-[12px] pr-[75px] outline-none rounded-[10px] border-[1.5px] bg-transparent" +
                        (props?.theme
                          ? " text-[white] placeholder:text-[#5b5b5b] border-[#2c2c2c]"
                          : " text-[black] placeholder:text-[#828282] border-[#2c2c2c]")
                      }
                      value={addUser}
                      onChange={(e) => {
                        const inputValue = e.target.value;
                        const alphanumericRegex = /^[a-zA-Z0-9]*$/; // Matches only alphanumeric characters (letters and numbers)

                        if (alphanumericRegex.test(inputValue)) {
                          setAddUser(inputValue);
                        }
                      }}
                      placeholder="Enter User ID"
                    ></input>
                    <button
                      className={
                        " h-[25px] w-[60px] mr-[5px] ml-[-65px] rounded-[8px] border-[1.5px] flex justify-center items-center text-[13px] " +
                        (props?.theme
                          ? addUser.length > 0
                            ? " bg-[#404040] hover:bg-[#656565] border-[#515151] hover:border-[#717171]  text-[#ffffff] opacity-100 cursor-pointer"
                            : " bg-[#404040] border-[#515151] text-[#ffffff] opacity-20 cursor-not-allowed"
                          : " bg-[#222222] text-[#828282]")
                      }
                      onClick={() => {
                        setAccessGrantedUser((prev) => [...prev, addUser]);
                        setAddUser("");
                      }}
                    >
                      <Plus
                        width={14}
                        height={14}
                        strokeWidth={2.2}
                        className="ml-[-5px] mr-[4px]"
                      />{" "}
                      Add
                    </button>
                  </div>
                  <div className="w-full mt-[20px] flex justify-start items-center">
                    {accessGrantedUser?.map((data, index) => {
                      return (
                        <>
                          {index < 4 ? (
                            <div
                              key={index}
                              className={
                                "w-[45px] h-[45px] rounded-full p-[3px] " +
                                (props?.theme
                                  ? " bg-[#1A1A1A]"
                                  : " bg-[#1A1A1A]") +
                                (index == 0 ? " ml-[0px]" : " ml-[-22px]")
                              }
                            >
                              <img
                                className={
                                  "w-full h-full rounded-full object-fill " +
                                  (props?.theme
                                    ? " bg-[#2d2d2d]"
                                    : " bg-[#1A1A1A]")
                                }
                                src="https://images.pexels.com/photos/31566261/pexels-photo-31566261/free-photo-of-majestic-maine-coon-cat-in-lush-outdoor-setting.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2"
                              ></img>
                            </div>
                          ) : (
                            <></>
                          )}
                        </>
                      );
                    })}
                    <div
                      className={
                        "w-[45px] h-[45px] rounded-full p-[3px] ml-[-22px]" +
                        (props?.theme ? " bg-[#1A1A1A]" : " bg-[#1A1A1A]") +
                        (accessGrantedUser.length > 4 ? " flex" : " hidden")
                      }
                    >
                      <div
                        className={
                          "w-full h-full rounded-full flex justify-center items-center text-[12px] " +
                          (props?.theme ? " bg-[#2d2d2d]" : " bg-[#1A1A1A]")
                        }
                      >
                        <Plus
                          width={12}
                          height={12}
                          strokeWidth={3.2}
                          className="mr-[2px]"
                        />{" "}
                        {accessGrantedUser.length - 4}
                      </div>
                    </div>
                  </div>
                </>
              ) : (
                <></>
              )}
              <div
                className={
                  "w-full flex justify-start items-start mt-[20px] " +
                  (props?.theme ? " text-[#fb600cc8]" : " text-[#828282]") +
                  (visibilityModal == "Private" ? " hidden" : " flex")
                }
              >
                <div
                  className={
                    "w-[20px] flex justify-start items-center mr-[8px]" +
                    (props?.theme ? " text-[#fb600cc8]" : " text-[#828282]")
                  }
                >
                  <Info
                    width={16}
                    height={16}
                    strokeWidth={2.2}
                    className=" mt-[3px]"
                  />
                </div>
                <span className="w-[calc(100%-28px])] ml-[0px]">
                  The chat will be visible to anyone accessing with the link.
                </span>
              </div>
              <div className="w-full mt-[20px] flex justify-end items-center">
                <button
                  className={
                    "px-[15px] h-[30px] rounded-[8px] border-[1.5px] flex justify-center items-center text-[14px] " +
                    (props?.theme
                      ? newName.length > 0
                        ? " bg-[#404040] hover:bg-[#656565] border-[#515151] hover:border-[#717171]  text-[#ffffff] opacity-100 cursor-pointer"
                        : " bg-[#404040] border-[#515151] text-[#ffffff] opacity-20 cursor-not-allowed"
                      : " bg-[#222222] text-[#828282]")
                  }
                  onClick={() => {
                    setIsShared(true);
                    if (!isShared) {
                      shareChatWithOther(
                        props?.shareModalData[0],
                        durationModal,
                        visibilityModal,
                        accessGrantedUser
                      );
                    } else {
                      props?.setShareModal(false);
                    }
                    // props?.setShareModal(false);
                  }}
                >
                  {isShared ? <>Close</> : <>Share</>}
                </button>
              </div>
            </div>
            <div
              className={
                "w-[250px] h-auto flex flex-col justify-start items-start " +
                (isShared ? " blur-0" : " blur-md")
              }
            >
              <span
                className={
                  "" + (props?.theme ? " text-[#828282]" : " text-[#828282]")
                }
              >
                Shared chat link
              </span>
              <div className="w-full flex justify-start items-center mt-[10px]">
                <input
                  className={
                    "w-full h-[35px] px-[12px] pr-[40px] outline-none rounded-[10px] border-[1.5px] bg-transparent" +
                    (props?.theme
                      ? " text-[white] border-[#2c2c2c]"
                      : " text-[black] border-[#2c2c2c]")
                  }
                  value={`https://auroranoteai.vercel.app/shared?chat=${
                    props?.shareModalData[0]
                  }?userID=${searchParams.get("ID")?.split("?section=")[0]}`}
                ></input>
                <div
                  className={
                    "w-[35px] h-[35px] ml-[-35px] flex justify-center items-center cursor-pointer " +
                    (props?.theme
                      ? " text-[#7b798b] hover:text-[#eaeaea]"
                      : " text-[#7b798b] hover:text-[#eaeaea]")
                  }
                  onClick={() => {
                    copyToClipboard(
                      `https://auroranoteai.vercel.app/shared?chat=${
                        props?.shareModalData[0]
                      }?userID=${searchParams.get("ID")?.split("?section=")[0]}`
                    );
                  }}
                  // copyToClipboard
                >
                  <Files width={16} height={16} strokeWidth="2" className="" />
                </div>
              </div>
              <div className="w-full flex justify-center items-center mt-[30px]">
                <div
                  className={
                    "w-full border-t-[1.5px]" +
                    (props?.theme ? " border-[#272727] " : " border-[#272727]")
                  }
                ></div>
                <div
                  className={
                    "px-[15px] whitespace-nowrap" +
                    (props?.theme
                      ? " bg-[#1A1A1A] text-[#828282]"
                      : " bg-[#1A1A1A] text-[#828282]")
                  }
                >
                  Scan to open
                </div>
                <div
                  className={
                    "w-full border-t-[1.5px]" +
                    (props?.theme ? " border-[#272727] " : " border-[#272727]")
                  }
                ></div>
              </div>
              <div className="w-full aspect-square p-[40px] pt-[30px] pb-[30px]">
                <div className="w-full aspect-square flex flex-col justify-between items-center">
                  <div className="w-full h-[18px] flex justify-between items-center mb-[-6px] ">
                    <svg
                      width="18"
                      height="18"
                      className="-rotate-90 "
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M2 2 H4 A12 12 0 0 1 16 14 V16"
                        stroke="#828282"
                        stroke-width="3"
                        fill="none"
                        stroke-linecap="round"
                      />
                    </svg>
                    <svg
                      width="18"
                      height="18"
                      className=""
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M2 2 H4 A12 12 0 0 1 16 14 V16"
                        stroke="#828282"
                        stroke-width="3"
                        fill="none"
                        stroke-linecap="round"
                      />
                    </svg>
                  </div>
                  <div className="w-full p-[10px] px-[20px]">
                    <QR
                      className="w-full aspect-square"
                      color="#ffffff"
                      backgroundColor="#1A1A1A"
                      rounding={50}
                      errorCorrectionLevel="M"
                    >
                      {`https://auroranoteai.vercel.app/shared?chat=${
                        props?.shareModalData[0]
                      }?userID=${
                        searchParams.get("ID")?.split("?section=")[0]
                      }`}
                    </QR>
                  </div>
                  <div className="w-full h-[18px] flex justify-between items-center mt-[-6px]">
                    <svg
                      width="18"
                      height="18"
                      className="rotate-180 "
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M2 2 H4 A12 12 0 0 1 16 14 V16"
                        stroke="#828282"
                        stroke-width="3"
                        fill="none"
                        stroke-linecap="round"
                      />
                    </svg>
                    <svg
                      width="18"
                      height="18"
                      className="rotate-90"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M2 2 H4 A12 12 0 0 1 16 14 V16"
                        stroke="#828282"
                        stroke-width="3"
                        fill="none"
                        stroke-linecap="round"
                      />
                    </svg>
                  </div>
                </div>
              </div>
            </div>
            {/* <div className="w-[250px] min-h-full ml-[-250px] backdrop-blur-md bg-slate-300 z-[51]">
              dv
            </div> */}
          </div>
        </div>
      </div>
    </>
  );
}
