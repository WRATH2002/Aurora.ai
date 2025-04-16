import {
  Bot,
  CaseSensitive,
  Check,
  OctagonX,
  PackageOpen,
  Satellite,
  Search,
  Settings,
  Squircle,
  Trash,
  User,
  X,
} from "lucide-react";
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

export default function ShowSharedChats(props) {
  const [anime, setAnime] = useState(false);
  const [showInfo, setShowInfo] = useState(false);
  const [showInfoData, setShowInfoData] = useState("");
  const [showInfoDataObj, setShowInfoDataObj] = useState({});

  useEffect(() => {
    setTimeout(() => {
      setAnime(true);
    }, 50);
  }, []);
  // ----------------------------- Function to get structured Date
  function getStructuredDate(dateStr) {
    let [day, month, year] = dateStr?.split("/")?.map(Number);
    let date = new Date(year, month - 1, day);
    let options = { year: "numeric", month: "short", day: "numeric" };
    let formatted = date.toLocaleDateString("en-US", options);
    return formatted;
  }

  // ----------------------------- Function to get Data Object without Archive details
  function getDataExceptArchive(dataObj) {
    // let { ArchiveDate, ArchiveTime, ...filteredData } = dataObj;
    // const user = firebase.auth().currentUser;
    // db.collection("user")
    //   .doc(user?.uid)
    //   .collection("AIChats")
    //   .doc("AllAIChats")
    //   .update({
    //     AllChatName: arrayUnion(dataObj?.ChatName),
    //   });
    // db.collection("user")
    //   .doc(user?.uid)
    //   .collection("AIChats")
    //   .doc("AllAIChats")
    //   .update({
    //     AllChatNameInfo: arrayUnion(filteredData),
    //   });
    // db.collection("user")
    //   .doc(user?.uid)
    //   .collection("AIChats")
    //   .doc("AllAIChats")
    //   .update({
    //     AllArchivedChatName: arrayRemove(dataObj),
    //   });
    // console.log("Chat space unarchived!");
  }

  // ----------------------------- Function to delete archive data permanently
  function deleteArchiveChatSpace(dataObj) {
    // const user = firebase.auth().currentUser;
    // const chatDocPathRef = db
    //   .collection("user")
    //   .doc(user?.uid)
    //   .collection("AIChats")
    //   .doc(dataObj?.ChatName);
    // chatDocPathRef.delete();
    // db.collection("user")
    //   .doc(user?.uid)
    //   .collection("AIChats")
    //   .doc("AllAIChats")
    //   .update({ AllArchivedChatName: arrayRemove(dataObj) });
  }

  return (
    <>
      {showInfo ? (
        <SharedChatSettings
          theme={props?.theme}
          ChatAccessRequest={props?.AIChatInfo?.ChatAccessRequest}
          setShowInfo={setShowInfo}
          showInfo={showInfo}
          setShowInfoData={setShowInfoData}
          showInfoData={showInfoData}
          showInfoDataObj={showInfoDataObj}
        />
      ) : (
        <></>
      )}

      <div
        className={
          "w-full h-[100svh] fixed left-0 top-0 flex justify-center items-center z-50 backdrop-blur-[5px]" +
          (props?.theme ? " bg-[#00000078]" : " bg-[#b0b0b081]") +
          (anime ? " opacity-100" : " opacity-0 ")
        }
        style={{ transition: ".1s" }}
        onClick={() => {
          props?.setShareShowModal(false);
        }}
      >
        <div
          className={
            "w-[70%] h-auto rounded-2xl border-[1.5px] boxShadowLight2 flex flex-col justify-start items-start p-[25px] pt-[18px] " +
            (props?.theme
              ? " bg-[#1A1A1A] border-[#252525]"
              : " bg-[#ffffff] border-[#eaeaea]") +
            (anime ? " mt-[0px] opacity-100" : " mt-[-50px] opacity-0 ")
          }
          style={{ transition: ".1s" }}
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
            Shared Chats
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
                props?.setShareShowModal(false);
              }}
            />
          </span>
          <div
            className={
              "mt-[20px] w-full flex justify-between items-center" +
              (props?.theme ? " text-[#828282]" : " text-[#828282]")
            }
          >
            <div className="">Name</div>

            <div className="flex justify-end items-center">
              <div className="w-[100px] flex justify-start items-center ">
                Shared Date
              </div>
              <div className="w-[100px] flex justify-start items-center ml-[40px]">
                Shared Time
              </div>
              <div className=""></div>
              <div className="flex justify-end items-center opacity-0 ml-[20px]">
                <PackageOpen
                  width={16}
                  height={16}
                  strokeWidth={2}
                  className={
                    " mr-[10px]" +
                    (props?.theme
                      ? " text-[#828282] hover:text-[white]"
                      : " text-[#828282] hover:text-[black]")
                  }
                />
                <OctagonX
                  width={16}
                  height={16}
                  strokeWidth={2}
                  className={
                    "cursor-pointer" +
                    (props?.theme
                      ? " text-[#828282] hover:text-[white]"
                      : " text-[#828282] hover:text-[black]")
                  }
                />
              </div>
            </div>
          </div>
          <div
            className={
              "border-t-[1.5px]  w-full my-[10px]" +
              (props?.theme ? " border-[#272727] " : " border-[#272727]")
            }
          ></div>
          {props?.AIChatInfo?.SharedChatName.length > 0 ? (
            <>
              <div className="w-full flex flex-col-reverse justify-end items-start">
                {props?.AIChatInfo?.SharedChatName?.map((data, index) => {
                  return (
                    <>
                      {/* {props?.AIChatInfo.ChatAccessRequest?.map((item, index) => {
                      return (
                        <>
                          {item?.RequestedFor == data?.chatName ? (
                            <>
                              <div
                                key={index}
                                className="ml-[7px] border-l-[1.5px] text-[#636363] border-[#464646] border-dashed flex justify-start items-center"
                              >
                                <div className="h-[10px] w-[30px] rounded-l-lg border-b-[1.5px] border-[#464646] border-dashed mt-[-7px] mr-[10px]"></div>
                                {item?.Requestor}
                              </div>
                            </>
                          ) : (
                            <></>
                          )}
                        </>
                      );
                    })} */}
                      <div
                        key={index}
                        className={
                          "h-[35px] w-full flex justify-between items-center" +
                          (props?.theme ? " text-[#828282]" : " text-[#828282]")
                        }
                      >
                        <div
                          className={
                            "flex justify-start items-center cursor-pointer" +
                            (props?.theme ? " text-[white]" : " text-[black]")
                          }
                          onClick={(e) => {
                            // props?.setSelectedChatName(data?.ChatName);
                            // props?.setArchiveModal(false);
                          }}
                        >
                          {/* <Squircle
                            width="12"
                            height="12"
                            strokeWidth="4"
                            color="#f53b3b"
                            fill="#f53b3b"
                            className="mr-[-16px] mt-[-10px] z-[52]"
                          /> */}
                          <Bot
                            width="16"
                            height="16"
                            strokeWidth="2"
                            className="mr-[10px]"
                          />{" "}
                          {data?.chatName}{" "}
                          <Settings
                            width="16"
                            height="16"
                            strokeWidth="2"
                            className={
                              "ml-[10px] cursor-pointer" +
                              (props?.theme
                                ? " text-[#828282] hover:text-[#eaeaea]"
                                : " text-[#828282]")
                            }
                            onClick={(e) => {
                              setShowInfo(true);
                              setShowInfoData(data?.chatName);
                              setShowInfoDataObj(data);
                            }}
                          />
                        </div>

                        <div className="flex justify-end items-center">
                          <div
                            className={
                              "w-[100px] flex justify-start items-center " +
                              (props?.theme
                                ? " text-[#595959]"
                                : " text-[#828282]")
                            }
                          >
                            {getStructuredDate(data?.sharedDate)}
                          </div>
                          <div
                            className={
                              "w-[100px] flex justify-start items-center ml-[40px]" +
                              (props?.theme
                                ? " text-[#595959]"
                                : " text-[#828282]")
                            }
                          >
                            {data?.sharedTime}
                          </div>
                          <div className=""></div>
                          <div className="flex justify-end items-center ml-[20px]">
                            <PackageOpen
                              width={16}
                              height={16}
                              strokeWidth={2}
                              className={
                                "cursor-pointer mr-[10px]" +
                                (props?.theme
                                  ? " text-[#828282] hover:text-[white]"
                                  : " text-[#828282] hover:text-[black]")
                              }
                              onClick={(e) => {
                                // getDataExceptArchive(data);
                              }}
                            />
                            <OctagonX
                              width={16}
                              height={16}
                              strokeWidth={2}
                              className={
                                "cursor-pointer" +
                                (props?.theme
                                  ? " text-[#828282] hover:text-[white]"
                                  : " text-[#828282] hover:text-[black]")
                              }
                            />
                          </div>
                        </div>
                      </div>
                    </>
                  );
                })}
              </div>
            </>
          ) : (
            <>
              <div
                className={
                  "h-[35px] w-full flex justify-center items-center" +
                  (props?.theme ? " text-[#828282]" : " text-[#828282]")
                }
              >
                <Satellite
                  width="16"
                  height="16"
                  strokeWidth="2"
                  className="mr-[10px]"
                />
                You have no archived chats
              </div>
            </>
          )}
        </div>
      </div>
    </>
  );
}

const SharedChatSettings = (props) => {
  const [searchValue, setSearchValue] = useState("");
  const [activeSection, setActiveSection] = useState(0);

  // // ------------------------- Function to fetch user Info
  //   function fetchUserInfo() {
  //     const user = firebase.auth().currentUser;
  //     const chatRef1 = db
  //       .collection("user")
  //       .doc(user?.uid)
  //       .collection("AIChats")
  //       .doc("AllAIChats");

  //     onSnapshot(chatRef1, (snapshot) => {
  //       setAIChatInfo({
  //         ChatName: snapshot?.data()?.AllChatName,
  //         ChatNameInfo: snapshot?.data()?.AllChatNameInfo,
  //         ArchivedChatName: snapshot?.data()?.AllArchivedChatName,
  //         SharedChatName: snapshot?.data()?.AllSharedChatName,
  //         ChatAccessRequest: snapshot?.data()?.ChatAccessRequest,
  //       });
  //     });
  //   }

  return (
    <>
      <div
        className={
          "w-full h-[100svh] fixed left-0 top-0 flex justify-center items-center z-[70] backdrop-blur-[5px]" +
          (props?.theme ? " bg-[#00000078]" : " bg-[#b0b0b081]")
        }
        style={{ transition: ".1s" }}
        onClick={() => {
          props?.setShowInfo(false);
        }}
      >
        <div
          className={
            "w-[350px] h-auto rounded-2xl border-[1.5px] boxShadowLight2 flex flex-col justify-start items-start p-[25px] pt-[18px] " +
            (props?.theme
              ? " bg-[#1A1A1A] border-[#252525]"
              : " bg-[#ffffff] border-[#eaeaea]")
          }
          style={{ transition: ".1s" }}
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
            {props?.showInfoData}
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
                props?.setShowInfo(false);
              }}
            />
          </span>
          <div
            className={
              "mt-[20px] mb-[-1.5px] z-[51]" +
              (props?.theme ? " text-[#828282]" : " text-[#828282]")
            }
          >
            <div className="flex justify-start items-center">
              <div
                className="w-auto flex flex-col justify-center items-start cursor-pointer"
                onClick={() => {
                  setActiveSection(0);
                }}
              >
                <span
                  className={
                    "" +
                    (props?.theme
                      ? activeSection == 0
                        ? " text-[white]"
                        : " text-[#828282]"
                      : activeSection == 0
                      ? " text-[black]"
                      : " text-[#828282]")
                  }
                >
                  Access Requestor
                </span>
                <div
                  className={
                    "w-full h-[2px] mt-[8px] rounded-full " +
                    (props?.theme
                      ? activeSection == 0
                        ? " bg-[white]"
                        : " bg-transparent"
                      : activeSection == 1
                      ? " bg-[#000000]"
                      : " bg-transparent")
                  }
                ></div>
              </div>
              <div
                className="w-auto flex flex-col justify-center items-start cursor-pointer ml-[20px]"
                onClick={() => {
                  setActiveSection(1);
                }}
              >
                <span
                  className={
                    "" +
                    (props?.theme
                      ? activeSection == 1
                        ? " text-[white]"
                        : " text-[#828282]"
                      : activeSection == 0
                      ? " text-[black]"
                      : " text-[#828282]")
                  }
                >
                  Access Granted
                </span>
                <div
                  className={
                    "w-full h-[2px] mt-[8px] rounded-full " +
                    (props?.theme
                      ? activeSection == 1
                        ? " bg-[white]"
                        : " bg-transparent"
                      : activeSection == 1
                      ? " bg-[#000000]"
                      : " bg-transparent")
                  }
                ></div>
              </div>
            </div>
          </div>
          <div
            className={
              "w-full border-t-[1.5px]  " +
              (props?.theme ? " border-[#272727] " : " border-[#272727]")
            }
          ></div>
          <div
            className={
              "flex justify-between items-center w-full mt-[20px] rounded-[10px] px-[10px] border-[1.5px]" +
              (props?.theme
                ? " text-[white] border-[#2c2c2c]"
                : " text-[black] border-[#2c2c2c]")
            }
          >
            <div
              className={
                "flex justify-start items-center w-[30px] cursor-pointer  " +
                (props?.theme
                  ? " text-[#828282] hover:text-[white]"
                  : " text-[#828282] hover:text-[black]")
              }
              onClick={() => {
                //   setSearchPrompt("");
              }}
            >
              <Search width="16" height="16" strokeWidth="2.2" />
            </div>
            <input
              className={
                " bg-transparent h-[35px] outline-none text-[14px] pr-[0px]" +
                (searchValue.length == 0
                  ? " w-[calc(100%-30px)]"
                  : " w-[calc(100%-60px)]") +
                (props?.theme
                  ? "  placeholder:text-[#5b5b5b]"
                  : " placeholder:text-[#828282]")
              }
              placeholder="Search here"
              value={searchValue}
              onChange={(e) => {
                setSearchValue(e.target.value);
              }}
              style={{ transition: ".1s" }}
            ></input>

            <div
              className={
                "flex justify-end items-center overflow-visible ml-[0px] cursor-pointer " +
                (searchValue.length > 0
                  ? " w-[30px] opacity-100"
                  : " w-[0px] opacity-0") +
                (props?.theme
                  ? " text-[#828282] hover:text-[#eaeaea]"
                  : " text-[#000000] hover:text-[#000000]")
              }
              style={{ transition: ".1s" }}
              onClick={() => {
                setSearchValue("");
              }}
            >
              <X width="16" height="16" strokeWidth="2.2" />
            </div>
          </div>
          <div className="w-full mt-[20px]">
            {props?.ChatAccessRequest?.map((item, index) => {
              return (
                <>
                  {item?.RequestedFor == props?.showInfoData ? (
                    <>
                      <ShowUser
                        requestor={item?.Requestor}
                        index={index}
                        theme={props?.theme}
                        showInfoDataObj={props?.showInfoDataObj}
                        item={item}
                        shareChatName={props?.showInfoData}
                      />
                    </>
                  ) : (
                    <></>
                  )}
                </>
              );
            })}
          </div>
        </div>
      </div>
    </>
  );
};

const ShowUser = (props) => {
  const [userInfo, setUserInfo] = useState({});

  // ------------------------- Function to fetch user Info
  function fetchUserInfo() {
    // const user = firebase.auth().currentUser;
    const chatRef1 = db.collection("user").doc(props?.requestor);

    onSnapshot(chatRef1, (snapshot) => {
      setUserInfo(snapshot?.data()?.UserDetails);
    });
  }

  useEffect(() => {
    fetchUserInfo();
  }, []);

  // ------------------------- Function to approve access request
  function approveAccess() {
    const user = firebase.auth().currentUser;
    console.table(props?.showInfoDataObj);
    let tempUser = [...props?.showInfoDataObj?.users];
    tempUser.push(props?.requestor);

    db.collection("user")
      .doc(user?.uid)
      .collection("AIChats")
      .doc("AllAIChats")
      .update({
        AllSharedChatName: arrayUnion({
          chatName: props?.showInfoDataObj?.chatName,
          linkToChat: props?.showInfoDataObj?.linkToChat,
          sharedDate: props?.showInfoDataObj?.sharedDate,
          sharedDuration: props?.showInfoDataObj?.sharedDuration,
          sharedTime: props?.showInfoDataObj?.sharedTime,
          users: tempUser,
          visibility: props?.showInfoDataObj?.visibility,
        }),
      });

    db.collection("sharedChat")
      .doc(props?.shareChatName + "~_~" + user?.uid)
      .update({
        users: arrayUnion(props?.requestor),
      });

    db.collection("user")
      .doc(user?.uid)
      .collection("AIChats")
      .doc("AllAIChats")
      .update({
        AllSharedChatName: arrayRemove(props?.showInfoDataObj),
        ChatAccessRequest: arrayRemove(props?.item),
      });
  }

  // ------------------------- Function to deny access request
  function denyAccess() {
    const user = firebase.auth().currentUser;
    db.collection("user")
      .doc(user?.uid)
      .collection("AIChats")
      .doc("AllAIChats")
      .update({
        ChatAccessRequest: arrayRemove(props?.item),
      });
  }

  return (
    <div
      key={props?.index}
      className=" text-[#636363]flex justify-start items-center"
    >
      {/* <div className="h-[10px] w-[30px] rounded-l-lg border-b-[1.5px] border-[#464646] border-dashed mt-[-7px] mr-[10px]"></div> */}
      <div className="w-full flex justify-start items-center">
        <User width="16" height="16" strokeWidth="2.2" className="mr-[10px]" />
        <div className="flex w-[calc(100%-20px)] justify-between items-start">
          <span>{userInfo?.Name}</span>
          <div className="flex justify-end items-center">
            <div
              className={
                "mr-[10px] cursor-pointer w-[25px] h-[25px] flex justify-center items-center" +
                (props?.theme
                  ? " text-[#00b000] hover:text-[#0aeb0a]"
                  : " text-[#bf3838] hover:text-[#ff5353]")
              }
              onClick={() => {
                approveAccess();
              }}
            >
              <Check
                width="16"
                height="16"
                strokeWidth="2.7"
                // color=""
                className="mr-[0px]"
              />
            </div>
            <div
              className={
                " cursor-pointer w-[25px] h-[25px] flex justify-center items-center" +
                (props?.theme
                  ? " text-[#bf3838] hover:text-[#ff5353]"
                  : " text-[#bf3838] hover:text-[#ff5353]")
              }
              onClick={() => {
                denyAccess();
              }}
            >
              <X
                width="16"
                height="16"
                strokeWidth="2.7"
                className="mr-[0px]"
                // color=""
              />
            </div>
          </div>
          {/* <span
            className={
              "whitespace-nowrap flex justify-start items-center" +
              (props?.theme ? " text-[#828282]" : " text-[#000000]")
            }
          >
            ID : {props?.requestor}
          </span> */}
        </div>
      </div>
    </div>
  );
};
