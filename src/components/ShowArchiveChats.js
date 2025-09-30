import { Bot, PackageOpen, Satellite, Trash, X } from "lucide-react";
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
import { HugeiconsIcon } from "@hugeicons/react";
import {
  Comment01Icon,
  Delete02Icon,
  PackageOpenIcon,
  PackageSentIcon,
  SatelliteIcon,
} from "@hugeicons/core-free-icons";

export default function ShowArchiveChats(props) {
  const [anime, setAnime] = useState(false);

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
    let { ArchiveDate, ArchiveTime, ...filteredData } = dataObj;
    const user = firebase.auth().currentUser;
    db.collection("user")
      .doc(user?.uid)
      .collection("AIChats")
      .doc("AllAIChats")
      .update({
        AllChatName: arrayUnion(dataObj?.ChatName),
      });

    db.collection("user")
      .doc(user?.uid)
      .collection("AIChats")
      .doc("AllAIChats")
      .update({
        AllChatNameInfo: arrayUnion(filteredData),
      });

    db.collection("user")
      .doc(user?.uid)
      .collection("AIChats")
      .doc("AllAIChats")
      .update({
        AllArchivedChatName: arrayRemove(dataObj),
      });

    console.log("Chat space unarchived!");
  }

  // ----------------------------- Function to delete archive data permanently
  function deleteArchiveChatSpace(dataObj) {
    const user = firebase.auth().currentUser;

    const chatDocPathRef = db
      .collection("user")
      .doc(user?.uid)
      .collection("AIChats")
      .doc(dataObj?.ChatName);

    chatDocPathRef.delete();

    db.collection("user")
      .doc(user?.uid)
      .collection("AIChats")
      .doc("AllAIChats")
      .update({ AllArchivedChatName: arrayRemove(dataObj) });
  }

  return (
    <div
      className={
        "w-full h-[100svh] fixed left-0 top-0 flex justify-center items-center z-50 backdrop-blur-[5px]" +
        (props?.theme ? " bg-[#00000078]" : " bg-[#b0b0b081]") +
        (anime ? " opacity-100" : " opacity-0 ")
      }
      style={{ transition: ".3s" }}
      onClick={() => {
        props?.setArchiveModal(false);
      }}
    >
      <div
        className={
          "w-[70%] h-auto rounded-2xl border-[1.5px] boxShadowLight2 flex flex-col justify-start items-start p-[25px] pt-[18px] " +
          (props?.theme
            ? " bg-[#1A1A1A] border-[#252525]"
            : " bg-[#ffffff] border-[#eaeaea]") +
          (anime ? " mt-[0px] opacity-100" : " mt-[-80px] opacity-0 ")
        }
        style={{ transition: ".3s" }}
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
          Archived Chats
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
              props?.setArchiveModal(false);
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
              Archived at
            </div>
            <div className="w-[100px] flex justify-start items-center ml-[40px]">
              Created at
            </div>
            <div className=""></div>
            <div className="flex justify-end items-center opacity-0 ml-[20px] h-full">
              <div
                className={
                  "h-full w-[25px] flex justify-end items-center  mr-[5px] cursor-default" +
                  (props?.theme
                    ? " text-[#828282] hover:text-[white]"
                    : " text-[#828282] hover:text-[black]")
                }
              >
                <HugeiconsIcon
                  icon={PackageOpenIcon}
                  size={18}
                  strokeWidth={1.8}
                />
              </div>
              <div
                className={
                  "h-full w-[25px] flex justify-end items-center cursor-default " +
                  (props?.theme
                    ? " text-[#828282] hover:text-[white]"
                    : " text-[#828282] hover:text-[black]")
                }
              >
                <HugeiconsIcon
                  icon={Delete02Icon}
                  size={18}
                  strokeWidth={1.8}
                />
              </div>
            </div>
          </div>
        </div>
        <div
          className={
            "border-t-[1.5px]  w-full my-[10px]" +
            (props?.theme ? " border-[#272727] " : " border-[#272727]")
          }
        ></div>
        {props?.AIChatInfo?.ArchivedChatName.length > 0 ? (
          <>
            <div className="w-full flex flex-col-reverse justify-end items-start">
              {props?.AIChatInfo?.ArchivedChatName?.map((data, index) => {
                return (
                  <div
                    key={index}
                    className={
                      "group h-[35px] w-full flex justify-between items-center" +
                      (props?.theme ? " text-[#828282]" : " text-[#828282]")
                    }
                  >
                    <div
                      className={
                        "flex justify-start items-center cursor-pointer" +
                        (props?.theme ? " text-[white]" : " text-[black]")
                      }
                      onClick={(e) => {
                        props?.setSelectedChatName(data?.ChatName);
                        props?.setArchiveModal(false);
                      }}
                    >
                      <HugeiconsIcon
                        className="mr-[10px] mb-[-2px]"
                        icon={Comment01Icon}
                        size={18}
                        strokeWidth={1.8}
                      />
                      {/* <Bot
                        width="16"
                        height="16"
                        strokeWidth="2"
                        className="mr-[10px]"
                      />{" "} */}
                      {data?.ChatName}
                    </div>

                    <div className="flex justify-end items-center">
                      <div
                        className={
                          "w-[100px] flex justify-start items-center " +
                          (props?.theme ? " text-[#595959]" : " text-[#828282]")
                        }
                      >
                        {getStructuredDate(data?.ArchiveDate)}
                      </div>
                      <div
                        className={
                          "w-[100px] flex justify-start items-center ml-[40px]" +
                          (props?.theme ? " text-[#595959]" : " text-[#828282]")
                        }
                      >
                        {getStructuredDate(data?.CreationDate)}
                      </div>
                      <div className=""></div>
                      <div className="flex h-full justify-end items-center ml-[20px] opacity-100 group-hover:opacity-100">
                        <div
                          className={
                            "h-full w-[25px] flex justify-end items-center  mr-[5px] cursor-pointer" +
                            (props?.theme
                              ? " text-[#828282] hover:text-[white]"
                              : " text-[#828282] hover:text-[black]")
                          }
                          onClick={(e) => {
                            getDataExceptArchive(data);
                          }}
                        >
                          <HugeiconsIcon
                            icon={PackageSentIcon}
                            size={18}
                            strokeWidth={1.8}
                          />
                        </div>
                        <div
                          className={
                            "h-full w-[25px] flex justify-end items-center cursor-pointer " +
                            (props?.theme
                              ? " text-[#828282] hover:text-[white]"
                              : " text-[#828282] hover:text-[black]")
                          }
                          onClick={(e) => {
                            deleteArchiveChatSpace(data);
                          }}
                        >
                          <HugeiconsIcon
                            icon={Delete02Icon}
                            size={18}
                            strokeWidth={1.8}
                          />
                        </div>

                        {/* <PackageOpen
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
                            getDataExceptArchive(data);
                          }}
                        /> */}
                        {/* <Trash
                          width={16}
                          height={16}
                          strokeWidth={2}
                          className={
                            "cursor-pointer " +
                            (props?.theme
                              ? " text-[#828282] hover:text-[white]"
                              : " text-[#828282] hover:text-[black]")
                          }
                          onClick={(e) => {
                            deleteArchiveChatSpace(data);
                          }}
                        /> */}
                      </div>
                    </div>
                  </div>
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
              {/* <Satellite
                width="16"
                height="16"
                strokeWidth="2"
                className="mr-[10px]"
              /> */}
              <HugeiconsIcon icon={SatelliteIcon} size={18} strokeWidth={1.8} />
              You have no archived chats
            </div>
          </>
        )}
      </div>
    </div>
  );
}
