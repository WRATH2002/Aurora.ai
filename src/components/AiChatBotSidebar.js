import React, { useEffect, useRef, useState } from "react";
import {
  Bot,
  CaseSensitive,
  Command,
  CornerDownRight,
  Ellipsis,
  GitBranchPlus,
  MessageSquare,
  MoveRight,
  Package,
  PackageOpen,
  PanelTopClose,
  PanelTopOpen,
  PencilLine,
  Plus,
  Satellite,
  Search,
  Share2,
  Trash,
  X,
} from "lucide-react";
import {
  arrayRemove,
  arrayUnion,
  onSnapshot,
  serverTimestamp,
  Timestamp,
} from "firebase/firestore";
import firebase from "../firebase";
import { useNavigate } from "react-router-dom";
import { onAuthStateChanged } from "firebase/auth";
import { auth, db } from "../firebase";
import NewAIChatModal from "./NewAIChatModal";
import ShowArchiveChats from "./ShowArchiveChats";
import ConfirmModal, { RenameChatModal, ShareChat } from "./ConfirmModal";
import ShowSharedChats from "./ShowSharedChats";
import {
  ArrowMoveDownRightIcon,
  ArrowRight04Icon,
  Comment01Icon,
  CommentAdd01Icon,
  Delete02Icon,
  GitCommitIcon,
  GitMergeIcon,
  LinkForwardIcon,
  Package03Icon,
  PackageReceiveIcon,
  PencilEdit01Icon,
  Robot01Icon,
  Robot02Icon,
  SatelliteIcon,
  Search01Icon,
  Share01Icon,
  SidebarLeft01Icon,
  SidebarRight01Icon,
} from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import CreateNewAgent from "./CreateNewAgent";

export default function AiChatBotSidebar(props) {
  const [archiveModal, setArchiveModal] = useState(false);
  const [shareShowModal, setShareShowModal] = useState(false);
  const [agentModal, setAgentModal] = useState(false);
  const [theme, setTheme] = useState(props?.theme);
  const [chatSettings, setChatSettings] = useState("");
  const [newChat, setNewChat] = useState(false);
  const [confirmModal, setConfirmModal] = useState(false);
  const [confirmModalData, setConfirmModalData] = useState([]);
  const [renameModal, setRenameModal] = useState(false);
  const [renameModalData, setRenameModalData] = useState([]);
  const [shareModal, setShareModal] = useState(false);
  const [chatModeSection, setChatModeSection] = useState("normal"); // normal / agent
  const [shareModalData, setShareModalData] = useState([]);
  const [AIChatInfo, setAIChatInfo] = useState({
    ChatName: [],
    ChatNameInfo: [],
    ArchivedChatName: [],
    AllSharedChatName: [],
    ChatAccessRequest: [],
  });
  const [AIAgentInfo, setAIAgentInfo] = useState({
    AgentName: [],
  });

  const divRef = useRef(null);

  const navigate = useNavigate();
  function navigateToWelcomePgae() {
    navigate(`/user/login`);
  }

  // -------------------------------- Function to fetch Theme form Firebase  ## Called inside auth checking UseEffect
  function fetchTheme() {
    const user = firebase.auth().currentUser;
    const channelRef = db.collection("user").doc(user?.uid);
    onSnapshot(channelRef, (snapshot) => {
      setTheme(snapshot?.data()?.Theme);
    });
  }

  // ------------------------- Checking for outside div clicks
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (divRef.current && !divRef.current.contains(event.target)) {
        setChatSettings("");
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  // ------------------------- Function to fetch all AI Chat Info
  function fetchAllChatInfo() {
    const user = firebase.auth().currentUser;
    const chatRef1 = db
      .collection("user")
      .doc(user?.uid)
      .collection("AIChats")
      .doc("AllAIChats");

    onSnapshot(chatRef1, (snapshot) => {
      setAIChatInfo({
        ChatName: snapshot?.data()?.AllChatName,
        ChatNameInfo: snapshot?.data()?.AllChatNameInfo,
        ArchivedChatName: snapshot?.data()?.AllArchivedChatName,
        SharedChatName: snapshot?.data()?.AllSharedChatName,
        ChatAccessRequest: snapshot?.data()?.ChatAccessRequest,
      });
    });
  }

  // ------------------------- Function to fetch all AI Agent Info
  function fetchAllAgentInfo() {
    const user = firebase.auth().currentUser;
    const chatRef2 = db
      .collection("user")
      .doc(user?.uid)
      .collection("AIAgents")
      .doc("AllAIAgents");

    onSnapshot(chatRef2, (snapshot) => {
      setAIAgentInfo({
        AgentName: snapshot?.data()?.AllAIAgentInfo,
      });
    });
  }

  // ------------------------- Calling `fetchAllChatInfo()` function
  // useEffect(() => {
  //   fetchAllChatInfo();
  // }, []);

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
      setConfirmModalData([]);
    });
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

  // -------------------------- Function to archive Chat Space
  function archiveChatInFirebase(chatName, chatInfo) {
    const user = firebase.auth().currentUser;
    let tempDateTime = getCurrentDateTime();
    let obj = { ...chatInfo };
    obj.ArchiveDate = tempDateTime?.Date; // archive date
    obj.ArchiveTime = tempDateTime?.Time;

    console.log(obj);
    console.log(chatInfo);

    db.collection("user")
      .doc(user?.uid)
      .collection("AIChats")
      .doc("AllAIChats")
      .update({
        AllArchivedChatName: arrayUnion(obj),
      });

    db.collection("user")
      .doc(user?.uid)
      .collection("AIChats")
      .doc("AllAIChats")
      .update({
        AllChatName: arrayRemove(chatName),
      });

    db.collection("user")
      .doc(user?.uid)
      .collection("AIChats")
      .doc("AllAIChats")
      .update({
        AllChatNameInfo: arrayRemove(chatInfo),
      });
  }

  // -------------------------- Checking if the user is logged in or not
  useEffect(() => {
    const listen = onAuthStateChanged(auth, (user) => {
      if (user) {
        fetchTheme();
        fetchAllChatInfo();
        fetchAllAgentInfo();
      } else {
        // setAuthUser(null);
        navigateToWelcomePgae();
      }
    });
    return () => {
      listen();
    };
  }, []);

  const [chatsAnimation, setChatsAnimation] = useState(false);

  useEffect(() => {
    // setChatsAnimation(true);
    setTimeout(() => {
      if (props?.isAgentMode) {
        setChatsAnimation((prev) => true);
      } else {
        setChatsAnimation((prev) => false);
      }
    }, 50);
  }, [props?.isAgentMode]);

  return (
    <>
      {agentModal ? (
        <CreateNewAgent
          theme={theme}
          setAgentModal={setAgentModal}
          agentModal={agentModal}
        />
      ) : (
        <></>
      )}
      {props?.searchChat ? (
        <SearchChat
          // aiChatNames={aiChatNames}
          setSearchChat={props?.setSearchChat}
          searchChat={props?.searchChat}
          theme={theme}
          AIChatInfo={AIChatInfo}
        />
      ) : (
        <></>
      )}

      {confirmModal ? (
        <div
          className={
            "w-full h-[100svh] fixed left-0 top-0 flex justify-center items-center font-[DMSr] backdrop-blur-[5px]" +
            (theme ? " bg-[#00000078]" : " bg-[#b0b0b081]") +
            (confirmModal ? " z-50" : " -z-50")
          }
          // style={{ transition: ".3s" }}
          onClick={() => {
            setConfirmModalData([]);
            setConfirmModal(false);
          }}
        >
          <div
            className={
              "w-[350px] h-auto rounded-2xl border-[1.5px] boxShadowLight2 flex flex-col justify-start items-start p-[25px] pt-[18px] " +
              (theme
                ? " bg-[#1A1A1A] border-[#252525]"
                : " bg-[#ffffff] border-[#eaeaea]") +
              (confirmModal
                ? " mt-[0px] opacity-100"
                : " mt-[-80px] opacity-0 ")
            }
            style={{ transition: ".3s" }}
            onClick={(e) => {
              e.stopPropagation();
            }}
          >
            <span
              className={
                "text-[22px] font-[DMSm] w-full flex justify-between items-center" +
                (theme ? " text-[white]" : " text-[black]")
              }
            >
              <div className="flex justify-start items-center">
                <HugeiconsIcon
                  icon={Delete02Icon}
                  size={22}
                  strokeWidth={2.5}
                  className="mr-[10px]"
                />
                Delete Chat ?
              </div>
              <X
                width={18}
                height={18}
                strokeWidth={2.2}
                className={
                  "cursor-pointer " +
                  (theme
                    ? " text-[#828282] hover:text-[white]"
                    : " text-[#828282] hover:text-[black]")
                }
                onClick={(e) => {
                  setConfirmModalData([]);
                  setConfirmModal(false);
                }}
              />
            </span>
            <div
              className={
                "w-full mt-[20px] flex flex-col justify-start items-start" +
                (theme ? " text-[#828282]" : " text-[#828282]")
              }
            >
              This operation will delete the chat :{" "}
              <span
                className={
                  "font-[DMSm] flex justify-start items-center" +
                  (theme ? " text-[white]" : " text-[black]")
                }
              >
                {/* <HugeiconsIcon
                    icon={Comment01Icon}
                    size={16}
                    strokeWidth={2}
                    className="mr-[10px]"
                  /> */}
                {confirmModalData[0]}
              </span>
            </div>
            <div className="w-full mt-[30px] flex justify-end items-center">
              <button
                className={
                  "px-[15px] h-[30px] rounded-[8px] border-[1.5px] flex justify-center items-center text-[14px] cursor-pointer " +
                  (theme
                    ? " bg-[#dc3737] hover:bg-[#f33636] border-[#fa5e5e] text-[#ffffff]"
                    : " bg-[#222222] text-[#828282]")
                }
                onClick={() => {
                  deleteChatFromFirebase(
                    confirmModalData[0],
                    confirmModalData[1]
                  );
                  setConfirmModal(false);
                }}
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      ) : (
        <></>
      )}

      {renameModal ? (
        <>
          <RenameChatModal
            theme={theme}
            setRenameModal={setRenameModal}
            renameModal={renameModal}
            setRenameModalData={setRenameModalData}
            renameModalData={renameModalData}
            AIChatInfo={AIChatInfo}
          />
        </>
      ) : (
        <></>
      )}

      {shareModal ? (
        <>
          <ShareChat
            theme={theme}
            setShareModal={setShareModal}
            shareModal={shareModal}
            setShareModalData={setShareModalData}
            shareModalData={shareModalData}
            AIChatInfo={AIChatInfo}
          />
        </>
      ) : (
        <></>
      )}

      {newChat ? (
        <NewAIChatModal
          theme={theme}
          setNewChat={setNewChat}
          newChat={newChat}
          AIChatInfo={AIChatInfo}
        />
      ) : (
        <></>
      )}

      {archiveModal ? (
        <ShowArchiveChats
          theme={theme}
          setArchiveModal={setArchiveModal}
          archiveModal={archiveModal}
          AIChatInfo={AIChatInfo}
          setSelectedChatName={props?.setSelectedChatName}
        />
      ) : (
        <></>
      )}

      {shareShowModal ? (
        <ShowSharedChats
          theme={theme}
          setShareShowModal={setShareShowModal}
          shareShowModal={shareShowModal}
          AIChatInfo={AIChatInfo}
          // setSelectedChatName={props?.setSelectedChatName}
        />
      ) : (
        <></>
      )}

      <div
        className={
          " h-full bg-transparent rounded-l-lg hidden md:flex lg:flex flex-col justify-start items-start   border-r-[1.5px]" +
          (theme
            ? props?.chatSidebarModal
              ? " border-[#252525]"
              : " border-[#25252500]"
            : props?.chatSidebarModal
            ? " border-[#f7f7f7]"
            : " border-[#f7f7f700]") +
          (props?.chatSidebarModal
            ? " w-[250px] px-[30px] md:px-[7px] lg:px-[0px] overflow-visible "
            : " w-[0px] px-[30px] md:px-[0px] lg:px-[0px] overflow-hidden") +
          (props?.chatSidebarModal ? " opacity-100" : " opacity-0")
        }
        style={{
          transition: "opacity .2s, padding .3s, width .3s, overflow 0s",
          transitionDelay: props?.chatSidebarModal
            ? "0.3s, 0s, 0s, 0s"
            : "0s, 0s, 0s, 0s",
        }}
      >
        <div
          className={
            "w-full flex justify-between items-center min-h-[50px] max-h-[50px] px-[17px] " +
            (theme ? " text-[#828282]" : " text-[#797979]")
          }
          // style={{ transition: ".2s" }}
        >
          <div className="flex flex-col  justify-start items-center overflow-visible group max-w-[20px] max-h-[32px]">
            <div className="min-w-[20px] min-h-[32px] flex justify-center items-center">
              <HugeiconsIcon
                className={
                  "cursor-pointer " +
                  (theme ? " hover:text-[#ffffff]" : " hover:text-[#000000]")
                }
                onClick={() => {
                  props?.setSearchChat(!props?.searchChat);
                }}
                icon={Search01Icon}
                size={18}
                strokeWidth={1.6}
              />
            </div>
            <div
              className={
                "hidden mt-[5px] whitespace-nowrap group-hover:flex  justify-center items-center rounded-[9px]  text-[12px] px-[8px] py-[3px] cursor-default" +
                (props?.theme
                  ? " bg-[#363636] text-[#ededed]"
                  : " bg-[black] text-[#ffffff]")
              }
              style={{ boxShadow: "0px 1px 4px rgba(0,0,0,0.2)", zIndex: 1000 }}
            >
              Search chats
            </div>
          </div>

          {/* <Search
            width={18}
            height={18}
            strokeWidth={2}
            className={
              "cursor-pointer " +
              (theme ? " hover:text-[#ffffff]" : " hover:text-[#000000]")
            }
            onClick={() => {
              props?.setSearchChat(!props?.searchChat);
            }}
          /> */}

          <div className="flex justify-end items-center min-w-[80px] z-30">
            {/* <div
              className={
                " flex-col justify-start items-center overflow-visible group max-w-[20px] max-h-[32px] mr-[13px]" +
                (props?.isAgentMode ? " hidden" : " flex")
              }
            >
              <div className="min-w-[20px] min-h-[32px] flex justify-center items-center">
                <HugeiconsIcon
                  className={
                    "cursor-pointer " +
                    (theme ? " hover:text-[#ffffff]" : " hover:text-[#000000]")
                  }
                  onClick={() => {
                    setShareShowModal(!shareShowModal);
                    // setNewChat(!newChat);
                  }}
                  icon={LinkForwardIcon}
                  size={18}
                  strokeWidth={1.6}
                />
              </div>
              <div
                className={
                  "hidden mt-[5px] whitespace-nowrap group-hover:flex  justify-center items-center rounded-[9px]  text-[12px] px-[8px] py-[3px] cursor-default" +
                  (props?.theme
                    ? " bg-[#363636] text-[#ededed]"
                    : " bg-[black] text-[#ffffff]")
                }
                style={{
                  boxShadow: "0px 1px 4px rgba(0,0,0,0.2)",
                  zIndex: 1000,
                }}
              >
                Shared chats
              </div>
            </div>
            <div
              className={
                " flex-col justify-start items-center overflow-visible group max-w-[20px] max-h-[32px] mr-[13px]" +
                (props?.isAgentMode ? " hidden" : " flex")
              }
            >
              <div className="min-w-[20px] min-h-[32px] flex justify-center items-center">
                <HugeiconsIcon
                  className={
                    "cursor-pointer " +
                    (theme ? " hover:text-[#ffffff]" : " hover:text-[#000000]")
                  }
                  onClick={() => {
                    setArchiveModal(!archiveModal);
                    // setNewChat(!newChat);
                  }}
                  icon={Package03Icon}
                  size={18}
                  strokeWidth={1.6}
                />
              </div>
              <div
                className={
                  "hidden mt-[5px] whitespace-nowrap group-hover:flex  justify-center items-center rounded-[9px]  text-[12px] px-[8px] py-[3px] cursor-default" +
                  (props?.theme
                    ? " bg-[#363636] text-[#ededed]"
                    : " bg-[black] text-[#ffffff]")
                }
                style={{
                  boxShadow: "0px 1px 4px rgba(0,0,0,0.2)",
                  zIndex: 1000,
                }}
              >
                Archived chats
              </div>
            </div> */}
            <div
              className={
                "w-[26px] h-[18px] p-[3px] flex justify-start items-center rounded-full mr-[13px] cursor-pointer " +
                (props?.isAgentMode
                  ? props?.theme
                    ? " bg-[#EAEAEA]"
                    : " bg-[#000000]"
                  : props?.theme
                  ? " bg-[#EAEAEA]"
                  : " bg-[#EAEAEA]")
              }
              onClick={() => {
                props?.setIsAgentMode(!props?.isAgentMode);
              }}
              style={{ transition: ".2s" }}
            >
              <div
                className={
                  "min-h-[12px] min-w-[12px] rounded-full " +
                  (props?.isAgentMode ? " ml-[8px]" : " ml-[0px]") +
                  (props?.isAgentMode
                    ? props?.theme
                      ? " bg-[#ffffff]"
                      : " bg-[#ffffff]"
                    : props?.theme
                    ? " bg-[#ffffff]"
                    : " bg-[#ffffff]")
                }
                style={{ transition: ".2s" }}
              ></div>
            </div>
            <div
              className={
                " flex-col justify-start items-center overflow-visible group max-w-[20px] max-h-[32px]" +
                (props?.isAgentMode ? " hidden" : " flex")
              }
            >
              <div className="min-w-[20px] min-h-[32px] flex justify-center items-center">
                <HugeiconsIcon
                  className={
                    "cursor-pointer " +
                    (theme ? " hover:text-[#ffffff]" : " hover:text-[#000000]")
                  }
                  onClick={() => {
                    setNewChat(!newChat);
                  }}
                  icon={CommentAdd01Icon}
                  size={18}
                  strokeWidth={1.6}
                />
              </div>
              <div
                className={
                  "hidden mt-[5px] whitespace-nowrap group-hover:flex  justify-center items-center rounded-[9px]  text-[12px] px-[8px] py-[3px] cursor-default" +
                  (props?.theme
                    ? " bg-[#363636] text-[#ededed]"
                    : " bg-[black] text-[#ffffff]")
                }
                style={{
                  boxShadow: "0px 1px 4px rgba(0,0,0,0.2)",
                  zIndex: 1000,
                }}
              >
                New chat
              </div>
            </div>
            <div
              className={
                " flex-col justify-start items-center overflow-visible group max-w-[20px] max-h-[32px]" +
                (props?.isAgentMode ? " flex" : " hidden")
              }
            >
              <div className="min-w-[20px] min-h-[32px] flex justify-center items-center">
                <HugeiconsIcon
                  className={
                    "cursor-pointer " +
                    (theme ? " hover:text-[#ffffff]" : " hover:text-[#000000]")
                  }
                  onClick={(e) => {
                    setAgentModal(true);
                    // deleteChatFromFirebase(data?.ChatName, data);
                  }}
                  icon={Robot01Icon}
                  size={18}
                  strokeWidth={1.6}
                />
              </div>
              <div
                className={
                  "hidden mt-[5px] whitespace-nowrap group-hover:flex  justify-center items-center rounded-[9px]  text-[12px] px-[8px] py-[3px] cursor-default" +
                  (props?.theme
                    ? " bg-[#363636] text-[#ededed]"
                    : " bg-[black] text-[#ffffff]")
                }
                style={{
                  boxShadow: "0px 1px 4px rgba(0,0,0,0.2)",
                  zIndex: 1000,
                }}
              >
                New AI Agent
              </div>
            </div>

            {/* {props?.chatSidebarModal ? (
              <>
                <PanelTopClose
                  width={18}
                  height={18}
                  strokeWidth={2}
                  className={
                    "cursor-pointer -rotate-90" +
                    (theme ? " hover:text-[#ffffff]" : " hover:text-[#000000]")
                  }
                  onClick={() => {
                    props?.setChatSidebarModal(false);
                  }}
                />
                <HugeiconsIcon
                  className={
                    "cursor-pointer ml-[13px] rotate-0" +
                    (theme ? " hover:text-[#ffffff]" : " hover:text-[#000000]")
                  }
                  onClick={() => {
                    props?.setChatSidebarModal(false);
                  }}
                  icon={SidebarLeft01Icon}
                  size={18}
                  strokeWidth={1.8}
                />
              </>
            ) : (
              <>
                <PanelTopOpen
                  width={18}
                  height={18}
                  strokeWidth={2}
                  className={
                    "cursor-pointer -rotate-90" +
                    (theme ? " hover:text-[#ffffff]" : " hover:text-[#000000]")
                  }
                  onClick={() => {
                    props?.setChatSidebarModal(true);
                  }}
                />
                <HugeiconsIcon
                  className={
                    "cursor-pointer ml-[13px] -rotate-180" +
                    (theme ? " hover:text-[#ffffff]" : " hover:text-[#000000]")
                  }
                  onClick={() => {
                    props?.setChatSidebarModal(true);
                  }}
                  icon={SidebarLeft01Icon}
                  size={18}
                  strokeWidth={1.8}
                />
              </>
            )} */}
          </div>
        </div>
        {/* <div
          className={
            "w-full h-[40px] mt-[-10px] flex justify-center items-center text-[#adadad] border-b-[1.5px]" +
            (theme ? " border-[#252525]" : " border-[#f7f7f7]")
          }
        >
          <div
            className="w-[calc(100%/2)] h-full flex justify-center items-center rounded-lg cursor-pointer  "
            onClick={() => {
              props?.setIsAgentMode(false);
            }}
          >
            Normal
          </div>
          <div
            className="w-[calc(100%/2)] h-full flex justify-center items-center rounded-lg cursor-pointer  bg-[]"
            onClick={() => {
              props?.setIsAgentMode(true);
            }}
          >
            AI Agent
          </div>
        </div> */}

        {/* {props?.isAgentMode ? (
          <div
            onScroll={() => {
              setChatSettings("");
            }}
            className={
              "w-full h-[calc(100%-50px)] overflow-y-scroll flex flex-col-reverse justify-end items-start" +
              (chatsAnimation
                ? " opacity-100 mt-[0px]"
                : " opacity-0 mt-[20px]") +
              (props?.isAgentMode ? " flex" : " hidden")
            }
            style={{
              transition: "margin .2s, opacity .3s",
              // transitionDelay: "0.1s",
            }}
          >
            {AIAgentInfo?.AgentName?.map((data, index) => {
              return (
                <div
                  key={index}
                  className={
                    "w-full min-h-[33px] max-h-[33px] group rounded-lg flex justify-start items-center px-[10px] cursor-pointer" +
                    (theme
                      ? " hover:bg-[#222222] hover:text-[#eaeaea]"
                      : " hover:bg-[#F3F3F3] hover:text-[#000000]") +
                    (props?.selectedChatName == data?.agentName
                      ? theme
                        ? " bg-[#2A2A2A] text-[#eaeaea]"
                        : " bg-[#eaeaea] text-[#000000]"
                      : theme
                      ? " bg-transparent text-[#828282]"
                      : " bg-transparent text-[#797979]")
                  }
                  onClick={() => {
                    if (!props?.isAgentMode) {
                      props?.setIsAgentMode(true);
                    }
                    props?.setAgentInfo((prev) => [
                      {
                        Description: data?.agentDescription,
                        Placeholder: data?.agentPlaceholder,
                        Name: data?.agentName,
                        Date: data?.CreationDate,
                        Time: data?.CreationTime,
                      },
                    ]);
                    props?.setChatLoading((prev) => true);
                    props?.setSelectedChatName(data?.agentName);
                  }}
                >
                  <div
                    className={
                      " group-hover:w-[calc(100%-30px)] text-ellipsis overflow-hidden whitespace-nowrap font-[DMSr]" +
                      (chatSettings == data?.agentName
                        ? " w-[calc(100%-30px)]"
                        : " w-[calc(100%-00px)]")
                    }
                    // style={{ transition: ".2s" }}
                  >
                    {data?.agentName}
                  </div>
                  <div
                    className={
                      " group-hover:w-[30px] h-full overflow-visible flex flex-col justify-start items-end " +
                      (chatSettings == data?.agentName
                        ? " w-[30px]"
                        : " w-[0px]")
                    }
                    // style={{ transition: ".2s" }}
                    onClick={(e) => {
                      e.stopPropagation();
                      if (chatSettings.length > 0) {
                        setChatSettings("");
                      } else {
                        setChatSettings(data?.agentName);
                      }
                    }}
                  >
                    <div
                      className={
                        "w-full min-h-full flex justify-end items-center " +
                        (theme
                          ? " text-[#828282] hover:text-[#eaeaea]"
                          : " text-[#797979] hover:text-[#000000]")
                      }
                    >
                      {chatSettings == data?.agentName ? (
                        <X
                          width={18}
                          height={18}
                          strokeWidth={2}
                          className=""
                        />
                      ) : (
                        <Ellipsis
                          width={18}
                          height={18}
                          strokeWidth={2}
                          className=""
                        />
                      )}
                    </div>
                    <div
                      // ref={divRef}
                      className={
                        "w-auto h-auto rounded-[10px] p-[15px] py-[12px]  flex-col justify-start items-start z-40 mt-[5px] mr-[-10px]" +
                        (chatSettings == data?.agentName
                          ? theme
                            ? " opacity-100 bg-[#2A2A2A] flex"
                            : " opacity-100 bg-[#F3F3F3] flex"
                          : theme
                          ? " opacity-0 bg-[#2A2A2A] hidden"
                          : " opacity-0 bg-[#F3F3F3] hidden")
                      }
                      onClick={(e) => {
                        e.stopPropagation();
                      }}
                    >
                      <div
                        className={
                          "w-full h-[28px] flex justify-start items-center" +
                          (theme
                            ? " text-[#bdbdbd] hover:text-[#ffffff]"
                            : " text-[#797979] hover:text-[#000000]")
                        }
                        onClick={(e) => {
                          archiveChatInFirebase(data?.agentName, data);
                          setChatSettings("");
                        }}
                      >
                        <HugeiconsIcon
                          className="mr-[8px]"
                          icon={PackageReceiveIcon}
                          size={18}
                          strokeWidth={1.8}
                        />
                        <span className="">Archive</span>
                      </div>
                      <div
                        className={
                          "w-full h-[28px] flex justify-start items-center" +
                          (theme
                            ? " text-[#bdbdbd] hover:text-[#ffffff]"
                            : " text-[#797979] hover:text-[#000000]")
                        }
                        onClick={(e) => {
                          setShareModalData([data?.agentName, data]);
                          setShareModal(true);
                          setChatSettings("");
                        }}
                      >
                        <HugeiconsIcon
                          className="mr-[8px]"
                          icon={Share01Icon}
                          size={18}
                          strokeWidth={1.8}
                        />
                        <span className="">Share</span>
                      </div>
                      <div
                        className={
                          "w-full h-[28px] flex justify-start items-center" +
                          (theme
                            ? " text-[#bdbdbd] hover:text-[#ffffff]"
                            : " text-[#797979] hover:text-[#000000]")
                        }
                        onClick={(e) => {
                          // renameChatInFirebase(
                          // data?.ChatName,
                          // data,
                          // "Temporary New Name Setup 2"
                          // );
                          setRenameModalData([data?.agentName, data]);
                          setRenameModal(true);
                          setChatSettings("");
                        }}
                      >
                        <HugeiconsIcon
                          className="mr-[8px]"
                          icon={PencilEdit01Icon}
                          size={18}
                          strokeWidth={1.8}
                        />
                        <span className="">Rename</span>
                      </div>
                      <div
                        className={
                          "w-full h-[28px] flex justify-start items-center" +
                          (theme
                            ? " text-[#bf3838] hover:text-[#ff5353]"
                            : " text-[#e84d3a] hover:text-[#ff2308]")
                        }
                        onClick={(e) => {
                          setConfirmModalData([data?.agentName, data]);
                          setConfirmModal(true);
                          setChatSettings("");
                          // deleteChatFromFirebase(data?.ChatName, data);
                        }}
                      >
                        <HugeiconsIcon
                          className="mr-[8px]"
                          icon={Delete02Icon}
                          size={18}
                          strokeWidth={1.8}
                        />
                        <span className="">Delete</span>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div
            onScroll={() => {
              setChatSettings("");
            }}
            className={
              "w-full h-[calc(100%-80px)] overflow-y-scroll flex flex-col-reverse justify-end items-start" +
              (!chatsAnimation
                ? " opacity-100 mt-[0px]"
                : " opacity-0 mt-[20px]") +
              (!props?.isAgentMode ? " flex" : " hidden")
            }
            style={{
              transition: "margin .2s, opacity .3s",
              // transitionDelay: "0.1s",
            }}
          >
            {AIChatInfo?.ChatNameInfo?.map((data, index) => {
              return (
                <div
                  key={index}
                  className={
                    "w-full min-h-[33px] max-h-[33px] group rounded-lg flex justify-start items-center px-[10px] cursor-pointer" +
                    (theme
                      ? " hover:bg-[#222222] hover:text-[#eaeaea]"
                      : " hover:bg-[#F3F3F3] hover:text-[#000000]") +
                    (props?.selectedChatName == data?.ChatName
                      ? theme
                        ? " bg-[#2A2A2A] text-[#eaeaea]"
                        : " bg-[#eaeaea] text-[#000000]"
                      : theme
                      ? " bg-transparent text-[#828282]"
                      : " bg-transparent text-[#797979]")
                  }
                  onClick={() => {
                    if (props?.isAgentMode) {
                      props?.setIsAgentMode(false);
                      // props?.setAgentInfo([]);
                    }
                    props?.setAgentInfo([]);
                    props?.setChatLoading((prev) => true);
                    props?.setSelectedChatName(data?.ChatName);
                  }}
                >
                  <div
                    className={
                      " group-hover:w-[calc(100%-30px)] text-ellipsis overflow-hidden whitespace-nowrap font-[DMSr]" +
                      (chatSettings == data?.ChatName
                        ? " w-[calc(100%-30px)]"
                        : " w-[calc(100%-00px)]")
                    }
                    // style={{ transition: ".2s" }}
                  >
                    {data?.ChatName}
                  </div>
                  <div
                    className={
                      " group-hover:w-[30px] h-full overflow-visible flex flex-col justify-start items-end " +
                      (chatSettings == data?.ChatName
                        ? " w-[30px]"
                        : " w-[0px]")
                    }
                    // style={{ transition: ".2s" }}
                    onClick={(e) => {
                      e.stopPropagation();
                      if (chatSettings.length > 0) {
                        setChatSettings("");
                      } else {
                        setChatSettings(data?.ChatName);
                      }
                    }}
                  >
                    <div
                      className={
                        "w-full min-h-full flex justify-end items-center " +
                        (theme
                          ? " text-[#828282] hover:text-[#eaeaea]"
                          : " text-[#797979] hover:text-[#000000]")
                      }
                    >
                      {chatSettings == data?.ChatName ? (
                        <X
                          width={18}
                          height={18}
                          strokeWidth={2}
                          className=""
                        />
                      ) : (
                        <Ellipsis
                          width={18}
                          height={18}
                          strokeWidth={2}
                          className=""
                        />
                      )}
                    </div>
                    <div
                      // ref={divRef}
                      className={
                        "w-auto h-auto rounded-[10px] p-[15px] py-[12px]  flex-col justify-start items-start z-40 mt-[5px] mr-[-10px]" +
                        (chatSettings == data?.ChatName
                          ? theme
                            ? " opacity-100 bg-[#2A2A2A] flex"
                            : " opacity-100 bg-[#F3F3F3] flex"
                          : theme
                          ? " opacity-0 bg-[#2A2A2A] hidden"
                          : " opacity-0 bg-[#F3F3F3] hidden")
                      }
                      onClick={(e) => {
                        e.stopPropagation();
                      }}
                    >
                      <div
                        className={
                          "w-full h-[28px] flex justify-start items-center" +
                          (theme
                            ? " text-[#bdbdbd] hover:text-[#ffffff]"
                            : " text-[#797979] hover:text-[#000000]")
                        }
                        onClick={(e) => {
                          archiveChatInFirebase(data?.ChatName, data);
                          setChatSettings("");
                        }}
                      >
                        <HugeiconsIcon
                          className="mr-[8px]"
                          icon={PackageReceiveIcon}
                          size={18}
                          strokeWidth={1.8}
                        />
                        <span className="">Archive</span>
                      </div>
                      <div
                        className={
                          "w-full h-[28px] flex justify-start items-center" +
                          (theme
                            ? " text-[#bdbdbd] hover:text-[#ffffff]"
                            : " text-[#797979] hover:text-[#000000]")
                        }
                        onClick={(e) => {
                          setShareModalData([data?.ChatName, data]);
                          setShareModal(true);
                          setChatSettings("");
                        }}
                      >
                        <HugeiconsIcon
                          className="mr-[8px]"
                          icon={Share01Icon}
                          size={18}
                          strokeWidth={1.8}
                        />
                        <span className="">Share</span>
                      </div>
                      <div
                        className={
                          "w-full h-[28px] flex justify-start items-center" +
                          (theme
                            ? " text-[#bdbdbd] hover:text-[#ffffff]"
                            : " text-[#797979] hover:text-[#000000]")
                        }
                        onClick={(e) => {
                          // renameChatInFirebase(
                          // data?.ChatName,
                          // data,
                          // "Temporary New Name Setup 2"
                          // );
                          setRenameModalData([data?.ChatName, data]);
                          setRenameModal(true);
                          setChatSettings("");
                        }}
                      >
                        <HugeiconsIcon
                          className="mr-[8px]"
                          icon={PencilEdit01Icon}
                          size={18}
                          strokeWidth={1.8}
                        />
                        <span className="">Rename</span>
                      </div>
                      <div
                        className={
                          "w-full h-[28px] flex justify-start items-center" +
                          (theme
                            ? " text-[#bf3838] hover:text-[#ff5353]"
                            : " text-[#e84d3a] hover:text-[#ff2308]")
                        }
                        onClick={(e) => {
                          setConfirmModalData([data?.ChatName, data]);
                          setConfirmModal(true);
                          setChatSettings("");
                          // deleteChatFromFirebase(data?.ChatName, data);
                        }}
                      >
                        <HugeiconsIcon
                          className="mr-[8px]"
                          icon={Delete02Icon}
                          size={18}
                          strokeWidth={1.8}
                        />
                        <span className="">Delete</span>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )} */}

        <div
          className="min-w-full max-w-full flex justify-start items-start h-[calc(100%-50px)] overflow-hidden"
          // style={{ transition: ".2s" }}
        >
          <div
            onScroll={() => {
              setChatSettings("");
            }}
            className={
              "min-w-full max-w-full px-[7px] h-full overflow-y-scroll flex-col-reverse justify-end items-start" +
              (!props?.isAgentMode
                ? " ml-[0px] opacity-100"
                : " ml-[-250px] opacity-0")
            }
            style={{
              transition: "opacity .2s, margin .3s",
            }}
          >
            {AIChatInfo?.ChatNameInfo?.map((data, index) => {
              return (
                <div
                  key={index}
                  className={
                    "w-full min-h-[33px] max-h-[33px] group rounded-lg flex justify-start items-center px-[10px] cursor-pointer" +
                    (theme
                      ? " hover:bg-[#222222] hover:text-[#eaeaea]"
                      : " hover:bg-[#F3F3F3] hover:text-[#000000]") +
                    (props?.selectedChatName == data?.ChatName
                      ? theme
                        ? " bg-[#2A2A2A] text-[#eaeaea]"
                        : " bg-[#eaeaea] text-[#000000]"
                      : theme
                      ? " bg-transparent text-[#828282]"
                      : " bg-transparent text-[#797979]")
                  }
                  onClick={() => {
                    if (props?.isAgentMode) {
                      props?.setIsAgentMode(false);
                      // props?.setAgentInfo([]);
                    }
                    props?.setAgentInfo([]);
                    props?.setChatLoading((prev) => true);
                    props?.setSelectedChatName(data?.ChatName);
                  }}
                >
                  <div
                    className={
                      " group-hover:w-[calc(100%-30px)] text-ellipsis overflow-hidden whitespace-nowrap font-[DMSr]" +
                      (chatSettings == data?.ChatName
                        ? " w-[calc(100%-30px)]"
                        : " w-[calc(100%-00px)]")
                    }
                    // style={{ transition: ".2s" }}
                  >
                    {data?.ChatName}
                  </div>
                  <div
                    className={
                      " group-hover:w-[30px] h-full overflow-visible flex flex-col justify-start items-end " +
                      (chatSettings == data?.ChatName
                        ? " w-[30px]"
                        : " w-[0px]")
                    }
                    // style={{ transition: ".2s" }}
                    onClick={(e) => {
                      e.stopPropagation();
                      if (chatSettings.length > 0) {
                        setChatSettings("");
                      } else {
                        setChatSettings(data?.ChatName);
                      }
                    }}
                  >
                    <div
                      className={
                        "w-full min-h-full flex justify-end items-center " +
                        (theme
                          ? " text-[#828282] hover:text-[#eaeaea]"
                          : " text-[#797979] hover:text-[#000000]")
                      }
                    >
                      {chatSettings == data?.ChatName ? (
                        <X
                          width={18}
                          height={18}
                          strokeWidth={2}
                          className=""
                        />
                      ) : (
                        <Ellipsis
                          width={18}
                          height={18}
                          strokeWidth={2}
                          className=""
                        />
                      )}
                    </div>
                    <div
                      // ref={divRef}
                      className={
                        "w-auto h-auto rounded-[10px] p-[15px] py-[12px]  flex-col justify-start items-start z-40 mt-[5px] mr-[-10px]" +
                        (chatSettings == data?.ChatName
                          ? theme
                            ? " opacity-100 bg-[#2A2A2A] flex"
                            : " opacity-100 bg-[#F3F3F3] flex"
                          : theme
                          ? " opacity-0 bg-[#2A2A2A] hidden"
                          : " opacity-0 bg-[#F3F3F3] hidden")
                      }
                      onClick={(e) => {
                        e.stopPropagation();
                      }}
                    >
                      <div
                        className={
                          "w-full h-[28px] flex justify-start items-center" +
                          (theme
                            ? " text-[#bdbdbd] hover:text-[#ffffff]"
                            : " text-[#797979] hover:text-[#000000]")
                        }
                        onClick={(e) => {
                          archiveChatInFirebase(data?.ChatName, data);
                          setChatSettings("");
                        }}
                      >
                        <HugeiconsIcon
                          className="mr-[8px]"
                          icon={PackageReceiveIcon}
                          size={18}
                          strokeWidth={1.8}
                        />
                        <span className="">Archive</span>
                      </div>
                      <div
                        className={
                          "w-full h-[28px] flex justify-start items-center" +
                          (theme
                            ? " text-[#bdbdbd] hover:text-[#ffffff]"
                            : " text-[#797979] hover:text-[#000000]")
                        }
                        onClick={(e) => {
                          setShareModalData([data?.ChatName, data]);
                          setShareModal(true);
                          setChatSettings("");
                        }}
                      >
                        <HugeiconsIcon
                          className="mr-[8px]"
                          icon={Share01Icon}
                          size={18}
                          strokeWidth={1.8}
                        />
                        <span className="">Share</span>
                      </div>
                      <div
                        className={
                          "w-full h-[28px] flex justify-start items-center" +
                          (theme
                            ? " text-[#bdbdbd] hover:text-[#ffffff]"
                            : " text-[#797979] hover:text-[#000000]")
                        }
                        onClick={(e) => {
                          // renameChatInFirebase(
                          // data?.ChatName,
                          // data,
                          // "Temporary New Name Setup 2"
                          // );
                          setRenameModalData([data?.ChatName, data]);
                          setRenameModal(true);
                          setChatSettings("");
                        }}
                      >
                        <HugeiconsIcon
                          className="mr-[8px]"
                          icon={PencilEdit01Icon}
                          size={18}
                          strokeWidth={1.8}
                        />
                        <span className="">Rename</span>
                      </div>
                      <div
                        className={
                          "w-full h-[28px] flex justify-start items-center" +
                          (theme
                            ? " text-[#bf3838] hover:text-[#ff5353]"
                            : " text-[#e84d3a] hover:text-[#ff2308]")
                        }
                        onClick={(e) => {
                          setConfirmModalData([data?.ChatName, data]);
                          setConfirmModal(true);
                          setChatSettings("");
                          // deleteChatFromFirebase(data?.ChatName, data);
                        }}
                      >
                        <HugeiconsIcon
                          className="mr-[8px]"
                          icon={Delete02Icon}
                          size={18}
                          strokeWidth={1.8}
                        />
                        <span className="">Delete</span>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
          <div
            onScroll={() => {
              setChatSettings("");
            }}
            className={
              "min-w-full max-w-full px-[7px] h-full overflow-y-scroll flex-col-reverse justify-end items-start" +
              (!props?.isAgentMode ? " opacity-0" : " opacity-100")
            }
            style={{
              transition: "opacity .2s",
            }}
          >
            {AIAgentInfo?.AgentName?.map((data, index) => {
              return (
                <div
                  key={index}
                  className={
                    "w-full min-h-[33px] max-h-[33px] group rounded-lg flex justify-start items-center px-[10px] cursor-pointer" +
                    (theme
                      ? " hover:bg-[#222222] hover:text-[#eaeaea]"
                      : " hover:bg-[#F3F3F3] hover:text-[#000000]") +
                    (props?.selectedChatName == data?.agentName
                      ? theme
                        ? " bg-[#2A2A2A] text-[#eaeaea]"
                        : " bg-[#eaeaea] text-[#000000]"
                      : theme
                      ? " bg-transparent text-[#828282]"
                      : " bg-transparent text-[#797979]")
                  }
                  onClick={() => {
                    if (!props?.isAgentMode) {
                      props?.setIsAgentMode(true);
                    }
                    props?.setAgentInfo((prev) => [
                      {
                        Description: data?.agentDescription,
                        Placeholder: data?.agentPlaceholder,
                        Name: data?.agentName,
                        Date: data?.CreationDate,
                        Time: data?.CreationTime,
                      },
                    ]);
                    props?.setChatLoading((prev) => true);
                    props?.setSelectedChatName(data?.agentName);
                  }}
                >
                  <div
                    className={
                      " group-hover:w-[calc(100%-30px)] text-ellipsis overflow-hidden whitespace-nowrap font-[DMSr]" +
                      (chatSettings == data?.agentName
                        ? " w-[calc(100%-30px)]"
                        : " w-[calc(100%-00px)]")
                    }
                    // style={{ transition: ".2s" }}
                  >
                    {data?.agentName}
                  </div>
                  <div
                    className={
                      " group-hover:w-[30px] h-full overflow-visible flex flex-col justify-start items-end " +
                      (chatSettings == data?.agentName
                        ? " w-[30px]"
                        : " w-[0px]")
                    }
                    // style={{ transition: ".2s" }}
                    onClick={(e) => {
                      e.stopPropagation();
                      if (chatSettings.length > 0) {
                        setChatSettings("");
                      } else {
                        setChatSettings(data?.agentName);
                      }
                    }}
                  >
                    <div
                      className={
                        "w-full min-h-full flex justify-end items-center " +
                        (theme
                          ? " text-[#828282] hover:text-[#eaeaea]"
                          : " text-[#797979] hover:text-[#000000]")
                      }
                    >
                      {chatSettings == data?.agentName ? (
                        <X
                          width={18}
                          height={18}
                          strokeWidth={2}
                          className=""
                        />
                      ) : (
                        <Ellipsis
                          width={18}
                          height={18}
                          strokeWidth={2}
                          className=""
                        />
                      )}
                    </div>
                    <div
                      // ref={divRef}
                      className={
                        "w-auto h-auto rounded-[10px] p-[15px] py-[12px]  flex-col justify-start items-start z-40 mt-[5px] mr-[-10px]" +
                        (chatSettings == data?.agentName
                          ? theme
                            ? " opacity-100 bg-[#2A2A2A] flex"
                            : " opacity-100 bg-[#F3F3F3] flex"
                          : theme
                          ? " opacity-0 bg-[#2A2A2A] hidden"
                          : " opacity-0 bg-[#F3F3F3] hidden")
                      }
                      onClick={(e) => {
                        e.stopPropagation();
                      }}
                    >
                      <div
                        className={
                          "w-full h-[28px] flex justify-start items-center" +
                          (theme
                            ? " text-[#bdbdbd] hover:text-[#ffffff]"
                            : " text-[#797979] hover:text-[#000000]")
                        }
                        onClick={(e) => {
                          archiveChatInFirebase(data?.agentName, data);
                          setChatSettings("");
                        }}
                      >
                        <HugeiconsIcon
                          className="mr-[8px]"
                          icon={PackageReceiveIcon}
                          size={18}
                          strokeWidth={1.8}
                        />
                        <span className="">Archive</span>
                      </div>
                      <div
                        className={
                          "w-full h-[28px] flex justify-start items-center" +
                          (theme
                            ? " text-[#bdbdbd] hover:text-[#ffffff]"
                            : " text-[#797979] hover:text-[#000000]")
                        }
                        onClick={(e) => {
                          setShareModalData([data?.agentName, data]);
                          setShareModal(true);
                          setChatSettings("");
                        }}
                      >
                        <HugeiconsIcon
                          className="mr-[8px]"
                          icon={Share01Icon}
                          size={18}
                          strokeWidth={1.8}
                        />
                        <span className="">Share</span>
                      </div>
                      <div
                        className={
                          "w-full h-[28px] flex justify-start items-center" +
                          (theme
                            ? " text-[#bdbdbd] hover:text-[#ffffff]"
                            : " text-[#797979] hover:text-[#000000]")
                        }
                        onClick={(e) => {
                          // renameChatInFirebase(
                          // data?.ChatName,
                          // data,
                          // "Temporary New Name Setup 2"
                          // );
                          setRenameModalData([data?.agentName, data]);
                          setRenameModal(true);
                          setChatSettings("");
                        }}
                      >
                        <HugeiconsIcon
                          className="mr-[8px]"
                          icon={PencilEdit01Icon}
                          size={18}
                          strokeWidth={1.8}
                        />
                        <span className="">Rename</span>
                      </div>
                      <div
                        className={
                          "w-full h-[28px] flex justify-start items-center" +
                          (theme
                            ? " text-[#bf3838] hover:text-[#ff5353]"
                            : " text-[#e84d3a] hover:text-[#ff2308]")
                        }
                        onClick={(e) => {
                          setConfirmModalData([data?.agentName, data]);
                          setConfirmModal(true);
                          setChatSettings("");
                          // deleteChatFromFirebase(data?.ChatName, data);
                        }}
                      >
                        <HugeiconsIcon
                          className="mr-[8px]"
                          icon={Delete02Icon}
                          size={18}
                          strokeWidth={1.8}
                        />
                        <span className="">Delete</span>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
        {/* <div
          className={
            "w-full h-[40px] flex justify-start items-center  mt-[10px] mb-[7px] px-[10px]" +
            (theme ? " text-[white]" : " text-[black]")
          }
          onClick={(e) => {
            setAgentModal(true);
            // deleteChatFromFirebase(data?.ChatName, data);
          }}
        >
          Create New Agent
        </div> */}
      </div>
    </>
  );
}

const SearchChat = (props) => {
  const [searchPrompt, setSearchPrompt] = useState("");
  const [resultArr, setResultArr] = useState([]);
  const [theme, setTheme] = useState(props?.theme);
  const [caseSensitive, setCaseSensitive] = useState(false);
  const debounceRef = useRef(null);

  function filterBySection(searchPrompt) {
    if (searchPrompt.length == 0) {
      setResultArr(props?.AIChatInfo?.ChatNameInfo);
    } else {
      if (caseSensitive) {
        setResultArr(
          props?.AIChatInfo?.ChatNameInfo?.filter((data) =>
            data?.ChatName?.includes(searchPrompt)
          )
        );
      } else {
        setResultArr(
          props?.AIChatInfo?.ChatNameInfo?.filter((data) =>
            data?.ChatName?.toLowerCase()?.includes(searchPrompt.toLowerCase())
          )
        );
      }
    }
  }

  useEffect(() => {
    filterBySection(searchPrompt);
  }, [caseSensitive]);

  useEffect(() => {
    const handler = setTimeout(() => {
      filterBySection(searchPrompt);
    }, 300);

    return () => {
      clearTimeout(handler);
    };
  }, [searchPrompt]);

  useEffect(() => {
    const handleEsc = (event) => {
      if (event.key === "Escape") {
        props?.setSearchChat(false);
      }
    };

    document.addEventListener("keydown", handleEsc);

    return () => {
      document.removeEventListener("keydown", handleEsc);
    };
  }, []);

  return (
    <>
      <div
        className={
          "w-full h-[100svh] fixed left-0 top-0 flex justify-center items-center z-50 backdrop-blur-[5px]" +
          (theme ? " bg-[#00000078]" : " bg-[#d4d4d4a7]")
        }
      >
        <div
          className="w-[90%] md:w-[540px] lg:w-[540px] flex flex-col justify-start items-start  h-[500px]"
          // style={{ transform: "translate(-50%, -50%)" }}
        >
          {/* <div className="w-full flex justify-center items-center mb-[10px] z-50">
            <div
              className={
                "h-[35px] boxShadowLight2 flex justify-center items-center px-[10px] pr-[5px] rounded-lg py-[5px] cursor-pointer border-[1.5px] text-[14px]" +
                (theme
                  ? " bg-[#1A1A1A] border-[#252525] text-[#828282] hover:text-[#ffffff]"
                  : " bg-[#ffffff] border-[#f0f0f0] text-[#797979] hover:text-[#000000]")
              }
              onClick={() => {
                props?.setSearchChat(false);
              }}
            >
              <X
                width="16"
                height="16"
                strokeWidth="2.5"
                className="mr-[6px]"
              />{" "}
              Close{" "}
              <div
                className={
                  " h-[23px] ml-[10px] rounded-[4px] flex justify-center items-center text-[12px] px-[7px] cursor-default border-[1.5px]" +
                  (theme
                    ? " bg-[#272727] text-[#828282] border-[#292929]"
                    : " bg-[#f3f3f3] text-[#797979] border-[#cfcfcf]")
                }
              >
                <Command
                  width="12"
                  height="12"
                  strokeWidth="2.2"
                  className="mr-[4px]"
                />
                Esc
              </div>
            </div>
          </div> */}
          <div
            className={
              "w-full flex flex-col justify-start items-start rounded-2xl max-h-[calc(100%-45px)] h-auto  boxShadowLight2 px-[7px] pr-[4px] py-[7px] font-[DMSr] text-[14px] border-[1.5px]" +
              (theme
                ? " bg-[#1A1A1A] border-[#252525]"
                : " bg-[#ffffff] border-[#f0f0f0]")
            }
            style={{ transition: ".2s" }}
          >
            <div className="flex justify-between items-center w-full px-[10px] ">
              <div
                className={
                  "flex justify-start items-center w-[30px] cursor-pointer  " +
                  (theme
                    ? " text-[#828282] hover:text-[white]"
                    : " text-[#797979] hover:text-[black]")
                }
                onClick={() => {
                  //   setSearchPrompt("");
                }}
              >
                {/* <Search width="16" height="16" strokeWidth="2.2" /> */}
                <HugeiconsIcon icon={Search01Icon} size={18} strokeWidth={2} />
              </div>
              <input
                className={
                  " bg-transparent h-[35px] outline-none text-[14px] pr-[20px]" +
                  (searchPrompt.length == 0
                    ? " w-[calc(100%-58px)]"
                    : " w-[calc(100%-88px)]") +
                  (theme
                    ? " placeholder:text-[#5b5b5b] text-[white]"
                    : " placeholder:text-[#a7a7a7] text-[black]")
                }
                placeholder="Search in Splitwise ..."
                value={searchPrompt}
                onChange={(e) => {
                  setSearchPrompt(e.target.value);
                }}
                style={{ transition: ".1s" }}
              ></input>
              <div
                className={
                  "flex justify-center items-center w-[30px] h-[30px] mr-[-5px] rounded-[6px] cursor-pointer " +
                  (!caseSensitive
                    ? theme
                      ? " text-[#828282] hover:text-[#ffffff]"
                      : " text-[#797979] hover:text-[#000000]"
                    : theme
                    ? " text-[#ffffff] bg-[#2a2a2a]"
                    : " text-[#000000] bg-[#eeeeee]")
                }
                onClick={() => {
                  setCaseSensitive(!caseSensitive);
                }}
              >
                <CaseSensitive width="16" height="16" strokeWidth="2.2" />
              </div>
              <div
                className={
                  "flex justify-end items-center overflow-visible ml-[3px] cursor-pointer " +
                  (searchPrompt.length > 0
                    ? " w-[30px] opacity-100"
                    : " w-[0px] opacity-0") +
                  (theme
                    ? " text-[#828282] hover:text-[#eaeaea]"
                    : " text-[#797979] hover:text-[#000000]")
                }
                style={{ transition: ".1s" }}
                onClick={() => {
                  setSearchPrompt("");
                }}
              >
                <X width="16" height="16" strokeWidth="2.2" />
              </div>
            </div>
            <div
              className={
                "w-[calc(100%+11px)] ml-[-7px] border-t-[1.5px] mt-[7px] mb-[6px]" +
                (theme ? " border-[#252525]" : " border-[#f1f1f1]")
              }
            ></div>
            <div
              className={
                "w-full flex flex-col justify-start items-start h-[calc(100%-45.5px)] overflow-y-auto pr-[4px] text-[14px] " +
                (theme ? " searchChatScrollDark" : " searchChatScrollLight")
              }
            >
              {searchPrompt.length == 0 && resultArr?.length == 0 ? (
                <>
                  <div
                    className={
                      "py-[7px] h-[35px] w-full cursor-pointer flex justify-center items-center my-[1px] px-[10px] rounded-[6px]" +
                      (theme ? " text-[#828282] " : " text-[#797979] ")
                    }
                  >
                    <div
                      className={
                        "flex justify-start items-center w-[30px] cursor-pointer mt-[3px] "
                      }
                      onClick={() => {
                        // setSearchPrompt("");
                      }}
                    >
                      {/* <Satellite width="16" height="16" strokeWidth="2.2" /> */}
                      <HugeiconsIcon
                        icon={SatelliteIcon}
                        size={18}
                        strokeWidth={1.8}
                      />
                    </div>
                    <div className="w-auto">No Chats</div>
                  </div>
                </>
              ) : searchPrompt.length > 0 && resultArr?.length == 0 ? (
                <>
                  {" "}
                  <div
                    className={
                      "py-[7px] h-[35px] w-full cursor-pointer flex justify-start items-start my-[1px] px-[10px] rounded-[8px]" +
                      (theme
                        ? " hover:bg-[#2a2a2a] text-[#828282] hover:text-[#eaeaea] "
                        : " hover:bg-[#F3F3F3] text-[#797979] hover:text-[#000000]")
                    }
                    onClick={() => {
                      //   setSection(data);
                    }}
                  >
                    <div
                      className={
                        "flex justify-start items-center w-[30px] cursor-pointer mt-[3px] "
                      }
                      onClick={() => {
                        setSearchPrompt("");
                      }}
                    >
                      <HugeiconsIcon
                        icon={CommentAdd01Icon}
                        size={18}
                        strokeWidth={1.8}
                      />
                    </div>
                    <div className="w-[calc(100%-120px)] flex justify-start items-center h-full ">
                      <div className="w-auto  text-ellipsis overflow-hidden whitespace-nowrap  max-[calc(100%-100px)] ">
                        {searchPrompt}
                      </div>
                      <div className="w-[90px] ml-[10px] flex justify-start items-center whitespace-nowrap h-full">
                        <HugeiconsIcon
                          className="mr-[4px]"
                          icon={ArrowRight04Icon}
                          size={14}
                          strokeWidth={2}
                        />
                        <span className="ml-[5px] text-[12px] flex justify-start items-center h-full">
                          create chat
                        </span>
                      </div>
                    </div>
                    <div
                      className={
                        "flex justify-end items-center w-[90px] h-full" +
                        (theme ? " text-[#606060] " : " text-[#9c9c9c] ")
                      }
                    >
                      <HugeiconsIcon
                        className="mr-[4px] mt-[-6px]"
                        icon={ArrowMoveDownRightIcon}
                        size={13}
                        strokeWidth={2.2}
                      />
                      <span className="text-[12px] whitespace-nowrap">
                        Alt + Enter
                      </span>
                    </div>
                  </div>
                  <div
                    className={
                      "py-[7px] h-[35px] w-full cursor-pointer flex justify-center items-center my-[1px] px-[10px] rounded-[6px]" +
                      (theme ? " text-[#828282] " : " text-[#797979] ")
                    }
                    onClick={() => {
                      //   setSection(data);
                    }}
                  >
                    <div
                      className={
                        "flex justify-start items-center w-[30px] cursor-pointer mt-[3px] "
                      }
                      onClick={() => {
                        setSearchPrompt("");
                      }}
                    >
                      {/* <Satellite width="16" height="16" strokeWidth="2.2" /> */}
                      <HugeiconsIcon
                        icon={SatelliteIcon}
                        size={18}
                        strokeWidth={1.8}
                      />
                    </div>
                    <div className="w-auto">No Result Found</div>
                  </div>
                </>
              ) : (
                <>
                  <div
                    className={
                      "py-[7px] h-[35px] w-full cursor-pointer justify-start items-start my-[1px] px-[10px] rounded-[8px]" +
                      (theme
                        ? " hover:bg-[#2a2a2a] text-[#828282] hover:text-[#eaeaea] "
                        : " hover:bg-[#F3F3F3] text-[#797979] hover:text-[#000000]") +
                      (searchPrompt.length > 0 ? " flex" : " hidden")
                    }
                    onClick={() => {
                      //   setSection(data);
                    }}
                  >
                    <div
                      className={
                        "flex justify-start items-center w-[30px] cursor-pointer mt-[3px] "
                      }
                      onClick={() => {
                        setSearchPrompt("");
                      }}
                    >
                      <HugeiconsIcon
                        icon={CommentAdd01Icon}
                        size={18}
                        strokeWidth={1.8}
                      />
                    </div>
                    <div className="w-[calc(100%-120px)] flex justify-start items-center">
                      <div className="w-auto  text-ellipsis overflow-hidden whitespace-nowrap  max-[calc(100%-100px)] ">
                        {searchPrompt}
                      </div>
                      <div className="w-[90px] ml-[10px] flex justify-start items-center whitespace-nowrap">
                        <HugeiconsIcon
                          className="mr-[4px]"
                          icon={ArrowRight04Icon}
                          size={14}
                          strokeWidth={2}
                        />
                        <span className="ml-[5px] text-[12px]">
                          create chat
                        </span>
                      </div>
                    </div>
                    <div
                      className={
                        "flex justify-end items-center w-[90px] h-full" +
                        (theme ? " text-[#606060]" : " text-[#9c9c9c]")
                      }
                    >
                      <HugeiconsIcon
                        className="mr-[4px] mt-[-6px]"
                        icon={ArrowMoveDownRightIcon}
                        size={13}
                        strokeWidth={2.2}
                      />
                      <span className="text-[12px] whitespace-nowrap">
                        Alt + Enter
                      </span>
                    </div>
                  </div>
                  {resultArr?.map((data, index) => {
                    return (
                      <div
                        className={
                          "py-[7px] h-[35px] w-full cursor-pointer flex justify-start items-start my-[1px] px-[10px] rounded-[8px]" +
                          (theme
                            ? " hover:bg-[#2a2a2a] text-[#828282] hover:text-[#eaeaea] "
                            : " hover:bg-[#F3F3F3] text-[#797979] hover:text-[#000000]")
                        }
                        onClick={() => {
                          //   setSection(data);
                        }}
                        key={index}
                      >
                        <div
                          className={
                            "flex justify-start items-center w-[30px] cursor-pointer mt-[3px] "
                          }
                          onClick={() => {
                            setSearchPrompt("");
                          }}
                        >
                          {/* <Bot width="16" height="16" strokeWidth="2.2" />{" "} */}
                          <HugeiconsIcon
                            icon={Comment01Icon}
                            size={18}
                            strokeWidth={1.8}
                          />
                        </div>
                        <div className="w-[calc(100%-30px)] text-ellipsis overflow-hidden whitespace-nowrap">
                          {data?.ChatName}
                        </div>
                      </div>
                    );
                  })}
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};
