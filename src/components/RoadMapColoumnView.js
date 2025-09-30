import { HugeiconsIcon } from "@hugeicons/react";
import {
  AssignmentsIcon,
  CalendarLove02Icon,
  Cancel01Icon,
  CheckmarkCircle02Icon,
  CommentAdd01Icon,
  FullScreenIcon,
  Loading03Icon,
  MoreVerticalCircle01Icon,
  PauseIcon,
  PlusSignIcon,
  StarIcon,
  StickyNote01Icon,
  User02Icon,
  UserMultiple03Icon,
} from "@hugeicons/core-free-icons";
import React, { use, useEffect, useState } from "react";
import { onAuthStateChanged } from "firebase/auth";
import { auth, db } from "../firebase";
import {
  arrayRemove,
  arrayUnion,
  onSnapshot,
  serverTimestamp,
} from "firebase/firestore";
import firebase from "../firebase";
import { ring } from "ldrs";
import { TextAreaFieldUI } from "./RoadMapContainer";
import { colorCode } from "../utils/constant";
ring.register();

// Default values shown

export default function RoadMapColoumnView(props) {
  // ---------------------------------------- Function to format the due date to format -> dd <MonthShort>, yyyy
  function getDateFormat(dateStr) {
    let arr = [
      "Jan",
      "Feb",
      "Mar",
      "Apr",
      "May",
      "June",
      "July",
      "Aug",
      "Sept",
      "Oct",
      "Nov",
      "Dec",
    ];

    return (
      dateStr?.split("/")[0] +
      " " +
      arr[parseInt(dateStr?.split("/")[1]) - 1] +
      ", " +
      dateStr?.split("/")[2]
    );
  }

  return (
    <>
      <div
        key={props?.index}
        className={
          "w-[330px] h-full flex  flex-col justify-start items-start border-[1.5px] rounded-lg py-[10px] " +
          (props?.theme
            ? " border-[#30303000] bg-[#F7F7F700]"
            : " border-[#f7f7f700] bg-[#F7F7F700]") +
          (props?.id != "Todo" ? " ml-[15px]" : " ml-[0px]")
        }
      >
        <div
          className={
            "w-full px-[4px] flex  h-[25px] justify-between items-center mb-[5px] " +
            (props?.theme ? " text-[#828282]" : " text-[#7b798b]")
          }
        >
          <div className="flex justify-start items-center">
            {props?.id == "Todo" ? (
              <HugeiconsIcon
                className=" mr-[8px]"
                icon={StickyNote01Icon}
                size={18}
                strokeWidth={1.8}
              />
            ) : props?.id == "InProgress" ? (
              <HugeiconsIcon
                className=" mr-[8px]"
                icon={Loading03Icon}
                size={18}
                strokeWidth={1.8}
              />
            ) : props?.id == "Pause" ? (
              <HugeiconsIcon
                className=" mr-[8px]"
                icon={PauseIcon}
                size={18}
                strokeWidth={1.8}
              />
            ) : props?.id == "Done" ? (
              <HugeiconsIcon
                className=" mr-[8px]"
                icon={CheckmarkCircle02Icon}
                size={18}
                strokeWidth={1.8}
              />
            ) : (
              <HugeiconsIcon
                className=" mr-[8px]"
                icon={CheckmarkCircle02Icon}
                size={18}
                strokeWidth={1.8}
              />
            )}
            {props?.id}
          </div>
          <div className="flex justify-end items-center">
            <HugeiconsIcon
              className=" mr-[8px]"
              icon={PlusSignIcon}
              size={18}
              strokeWidth={1.8}
              onClick={() => {
                props?.setAddTaskModal([{ forTaskProgress: props?.id }]);
              }}
            />
            <HugeiconsIcon
              className=""
              icon={MoreVerticalCircle01Icon}
              fill="black"
              size={16}
              strokeWidth={1.8}
            />
          </div>
        </div>
        <div className="w-full flex flex-col justify-start items-start h-[calc(100%-25px)] overflow-y-scroll px-[4px]">
          {props?.colData.map((item, indexx) => {
            return (
              <div
                key={indexx}
                className={
                  "draggable w-full    flex-col justify-start items-start rounded-[10px]  cursor-pointer" +
                  (props?.theme
                    ? " text-[#eb942b] bg-[#222222]"
                    : " text-[#000000] bg-[white] ") +
                  (props?.theme
                    ? ["1-new", "2-new", "3-new", "4-new"].includes(item?.id)
                      ? " border-[0px] border-[#f1f1f100]"
                      : " border-[1.5px] border-[#2b2b2b]"
                    : ["1-new", "2-new", "3-new", "4-new"].includes(item?.id)
                    ? " border-[0px] border-[#f1f1f100]"
                    : " border-[1.5px] border-[#f1f1f1]") +
                  (["1-new", "2-new", "3-new", "4-new"].includes(item?.id)
                    ? " flex h-[0px] overflow-hidden p-[0px] my-0"
                    : " flex h-auto overflow-visible p-[15px] my-1")
                }
                onClick={() => {
                  props?.setShowTaskData([item?.CreatedBy, item?.Title]);
                  props?.setShowMoreInfoModal(true);
                }}
              >
                <div
                  className={
                    "px-[7px] h-[23px] flex justify-center items-center border-[1.5px] rounded-[6px] text-[11px] " +
                    (props?.theme ? " border-[#eb952b2a]" : " border-[#f7f7f7]")
                  }
                  style={{
                    backgroundColor: item?.ColorThemeSecondary
                      ? `${item?.ColorThemeSecondary}`
                      : `${colorCode[0].secondary}`,
                    color: item?.ColorThemePrimary
                      ? `${item?.ColorThemePrimary}`
                      : `${colorCode[0].primary}`,
                    border: item?.ColorThemePrimary
                      ? `1.5px solid ${item?.ColorThemePrimary + "30"}`
                      : `1.5px solid ${colorCode[0].primary + "30"}`,
                  }}
                >
                  <span
                    className="text-[18px] mr-[5px]"
                    // style={{
                    //   color: item?.ColorThemePrimary
                    //     ? `${item?.ColorThemePrimary}`
                    //     : `${colorCode[0].primary}`,
                    // }}
                  >
                    •
                  </span>{" "}
                  {item?.Status}
                </div>
                <div
                  className={
                    "w-full text-ellipsis overflow-hidden whitespace-nowrap text-[16px] font-[DMSm] mt-[8px]" +
                    (props?.theme ? " text-[#ffffff]" : " text-[#000000]")
                  }
                >
                  {item?.Title}
                </div>
                <div
                  className={
                    "w-full text-ellipsis overflow-hidden line-clamp-2 text-[13px] font-[DMSr] mt-[2px] " +
                    (props?.theme ? " text-[#828282]" : " text-[#5e5e5e]")
                  }
                >
                  {item?.Description}
                </div>
                <div className="flex justify-between items-center w-full mt-[8px] ">
                  <div
                    className={
                      "flex justify-start items-center text-[13px]" +
                      (props?.theme ? " text-[#828282]" : " text-[#5e5e5e]")
                    }
                  >
                    <HugeiconsIcon
                      className=" mr-[8px]"
                      icon={CalendarLove02Icon}
                      size={18}
                      strokeWidth={1.5}
                    />
                    {getDateFormat(item?.DueTime)}
                  </div>
                  <div
                    className={
                      "flex justify-end items-center text-[13px]" +
                      (props?.theme ? " text-[#828282]" : " text-[#5e5e5e]")
                    }
                  >
                    {item?.Priority}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </>
  );
}

export function ShowTaskInfo(props) {
  const [section, setSection] = useState("Activity");
  const [taskData, setTaskData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [expand, setExpand] = useState(false);
  const [comment, setComment] = useState("");
  const [activeInputField, setActiveInputField] = useState("comment");

  function fetchTaskDataFromFirebase(creatorID, taskTitle) {
    const user = firebase.auth().currentUser;
    const channelRef = db
      .collection("taskSpace")
      .doc(creatorID)
      .collection("taskSpace")
      .doc(taskTitle);

    onSnapshot(channelRef, (snapshot) => {
      setTaskData([
        {
          Title: snapshot?.data()?.Title,
          CreationTime: snapshot?.data()?.CreationTime,
          CreationDate: snapshot?.data()?.CreationDate,
          DueTime: snapshot?.data()?.DueTime,
          Progress: snapshot?.data()?.Progress,
          CreatedBy: snapshot?.data()?.CreatedBy,
          Status: snapshot?.data()?.Status,
          Priority: snapshot?.data()?.Priority,
          Tags: snapshot?.data()?.Tags,
          Assignees: snapshot?.data()?.Assignees,
          Description: snapshot?.data()?.Description,
          Activity: snapshot?.data()?.Activity,
          MyWork: snapshot?.data()?.MyWork,
          Assigned: snapshot?.data()?.Assigned,
          Comments: snapshot?.data()?.Comments,
        },
      ]);
    });
  }

  useEffect(() => {
    if (taskData?.length > 0) {
      setLoading(false);
    }
  }, [taskData]);

  useEffect(() => {
    setLoading(true);
    if (props?.showTaskData?.length > 0) {
      fetchTaskDataFromFirebase(props?.showTaskData[0], props?.showTaskData[1]);
    }
  }, [props?.showTaskData]);

  function getDateFormat(dateStr) {
    let arr = [
      "Jan",
      "Feb",
      "Mar",
      "Apr",
      "May",
      "June",
      "July",
      "Aug",
      "Sept",
      "Oct",
      "Nov",
      "Dec",
    ];

    return (
      dateStr?.split("/")[0] +
      " " +
      arr[parseInt(dateStr?.split("/")[1]) - 1] +
      ", " +
      dateStr?.split("/")[2]
    );
  }

  return (
    <>
      <div
        className={
          "w-full h-[100svh] fixed left-0 top-0 flex justify-end items-center backdrop-blur-[5px] z-[50] p-[10px] text-[14px]" +
          (props?.theme ? " bg-[#00000078]" : " bg-[#b0b0b081]")
        }
        onClick={() => {
          props?.setShowTaskData([]);
          props?.setShowMoreInfoModal(false);
        }}
      >
        {/* <AddComment /> */}
        {/* <div className="h-full w-[40px] mr-[10px] flex flex-col justify-start items-center pt-[8px]">
          <div className="w-full h-[40px] flex justify-center items-center bg-[white] rounded-xl text-[#7b798b] hover:text-[#000000] cursor-pointer">
            <HugeiconsIcon
              className=""
              icon={CommentAdd01Icon}
              size={18}
              strokeWidth={1.8}
              onClick={(e) => {
                e.stopPropagation();
              }}
            />
          </div>
          <div className="w-full h-[40px] flex justify-center items-center bg-[white] rounded-xl mt-[10px] text-[#7b798b] hover:text-[#000000] cursor-pointer">
            <HugeiconsIcon
              className=""
              icon={AssignmentsIcon}
              size={18}
              strokeWidth={1.8}
              onClick={(e) => {
                e.stopPropagation();
              }}
            />
          </div>
        </div> */}
        {loading ? (
          <div
            className="w-[440px] h-full flex flex-col justify-center items-center bg-[white] rounded-2xl p-[20px]"
            onClick={(e) => {
              e.stopPropagation();
            }}
          >
            <l-ring
              size="30"
              stroke="3.5"
              bg-opacity="0"
              speed="2"
              color="black"
            ></l-ring>
          </div>
        ) : (
          <>
            <div
              className={
                " h-full flex justify-between items-start rounded-2xl p-[20px] " +
                (expand ? " min-w-[880px]" : " min-w-[440px]") +
                (props?.theme ? " bg-[#1A1A1A]" : " bg-[white]")
              }
              // style={{ transition: ".3s" }}
              onClick={(e) => {
                e.stopPropagation();
                // props?.setShowTaskData([]);
                // props?.setShowMoreInfoModal(false);
              }}
            >
              {/* <div
                className={
                  "flex h-full flex-col justify-start items-start" +
                  (expand ? " w-[400px]" : " w-[0px]")
                }
                style={{ transition: ".3s" }}
              >
                <div className="w-full border-b-[1.5px] border-[#f7f7f7] flex justify-start items-center h-[35px] mt-[0px]">
                  {["Activity", "My Work", "Assigned", "Comments"]?.map(
                    (data, index) => {
                      return (
                        <>
                          <div
                            key={index}
                            className={
                              "group max-h-[35px] w-auto flex flex-col justify-center items-center cursor-pointer " +
                              (data == section
                                ? props?.theme
                                  ? " text-[#ffffff]"
                                  : " text-[#000000]"
                                : props?.theme
                                ? " text-[#828282] hover:text-[#ffffff]"
                                : " text-[#797979] hover:text-[#000000]") +
                              (index > 0 ? " ml-[10px]" : " ml-[0px]")
                            }
                            onClick={() => {
                              setSection(data);
                            }}
                          >
                            <div className="w-full flex justify-center items-center min-h-[35px] px-[5px] ">
                              {data}
                            </div>
                            <div
                              className={
                                "w-full min-h-[2.5px] rounded-full " +
                                (data == section
                                  ? props?.theme
                                    ? " bg-[#ffffff]"
                                    : " bg-[#000000]"
                                  : props?.theme
                                  ? " bg-[#ffffff00] "
                                  : " bg-[#00000000] ")
                              }
                            ></div>
                          </div>
                        </>
                      );
                    }
                  )}

                </div>
                <div className="w-full flex flex-col justify-start items-start mt-[20px]">
                  <div className="w-full flex justify-start items-start">
                    <div className="w-[35px] h-[35px] rounded-full bg-slate-500"></div>
                    <div className="w-[calc(100%-35px)] pl-[10px]">
                      <span></span>
                    </div>
                  </div>
                </div>
                <TextAreaFieldUI
                  theme={props?.theme}
                  inputTitle={"Comment"}
                  var={comment}
                  setVar={setComment}
                  activeInputField={activeInputField}
                  setActiveInputField={setActiveInputField}
                  fieldValue={"comment"}
                  placeholderText={"eg. Enter your comment ..."}
                  marginTop={"20px"}
                  noHeading={true}
                  bgColor={"#fbfbfb"}
                />
              </div> */}
              <div className="w-[400px] flex flex-col justify-start items-start">
                <div className="w-full flex justify-between items-center ">
                  <div className="flex justify-start items-center cursor-pointer">
                    <HugeiconsIcon
                      className={
                        "" +
                        (props?.theme
                          ? " text-[#828282] hover:text-[white] cursor-pointer"
                          : " text-[#7b798b] hover:text-[black] cursor-pointer")
                      }
                      icon={Cancel01Icon}
                      size={18}
                      strokeWidth={1.8}
                      onClick={(e) => {
                        e.stopPropagation();
                        props?.setShowTaskData([]);
                        props?.setShowMoreInfoModal(false);
                      }}
                    />
                  </div>
                  <div className="flex justify-end items-center">
                    <HugeiconsIcon
                      className={
                        " mr-[12px]" +
                        (props?.theme
                          ? " text-[#828282] hover:text-[white] cursor-pointer"
                          : " text-[#7b798b] hover:text-[black] cursor-pointer")
                      }
                      icon={FullScreenIcon}
                      size={18}
                      strokeWidth={1.8}
                      onClick={(e) => {
                        e.stopPropagation();
                        setExpand(!expand);
                      }}
                    />
                    <HugeiconsIcon
                      className={
                        " mr-[8px]" +
                        (props?.theme
                          ? " text-[#828282] hover:text-[white] cursor-pointer"
                          : " text-[#7b798b] hover:text-[black] cursor-pointer")
                      }
                      icon={StarIcon}
                      size={18}
                      strokeWidth={1.8}
                    />
                    <HugeiconsIcon
                      className={
                        "" +
                        (props?.theme
                          ? " text-[#828282] hover:text-[white] cursor-pointer"
                          : " text-[#7b798b] hover:text-[black] cursor-pointer")
                      }
                      icon={MoreVerticalCircle01Icon}
                      fill="black"
                      size={18}
                      strokeWidth={1.8}
                    />
                  </div>
                </div>
                <div
                  className={
                    "w-full border-t-[1.5px] my-[15px]" +
                    (props?.theme ? " border-[#303030]" : " border-[#f7f7f7]")
                  }
                ></div>
                {/* whitespace-nowrap text-ellipsis overflow-hidden */}
                <div
                  className={
                    "text-[11px] flex justify-start items-center" +
                    (props?.theme ? " text-[#828282]" : " text-[#797979]")
                  }
                >
                  <HugeiconsIcon
                    className=" mr-[5px]"
                    icon={User02Icon}
                    size={12}
                    strokeWidth={1.8}
                    onClick={() => {
                      props?.setAddTaskModal([{ forTaskProgress: props?.id }]);
                    }}
                  />
                  {/* <HugeiconsIcon
                    className=" mr-[5px]"
                    icon={UserMultiple03Icon}
                    size={12}
                    strokeWidth={1.8}
                    onClick={() => {
                      props?.setAddTaskModal([{ forTaskProgress: props?.id }]);
                    }}
                  /> */}
                  Personal
                </div>
                <div
                  className={
                    "w-full mt-[2px] font-[DMSm] text-[20px]" +
                    (props?.theme ? " text-[#ffffff]" : " text-[#000000]")
                  }
                >
                  {taskData[0]?.Title}
                </div>
                {/* bg-[#74f33093] ---> High
                    bg-[#bf65ff93] ---> Medium
                    bg-[#f37e3093] ---> Low*/}
                <div className="flex justify-start items-center mt-[15px]">
                  <div
                    className={
                      "flex justify-center items-center border-[1.5px] h-[25px] px-[10px] rounded-full text-[12px]" +
                      (props?.theme
                        ? taskData[0]?.Priority == "High"
                          ? " bg-[#74f3303b] text-[#74f330] border-[#74f33033]"
                          : taskData[0]?.Priority == "Medium"
                          ? " bg-[#c675ff4a] text-[#c675ff] border-[#c675ff33]"
                          : taskData[0]?.Priority == "Low"
                          ? " bg-[#ffb7484f] text-[#ffb748] border-[#ffb74833]"
                          : " bg-[white]"
                        : taskData[0]?.Priority == "High"
                        ? " bg-[#74f33093]"
                        : taskData[0]?.Priority == "Medium"
                        ? " bg-[#bf65ff93]"
                        : taskData[0]?.Priority == "Low"
                        ? " bg-[#f37e3093]"
                        : " bg-[white]")
                    }
                  >
                    {taskData[0]?.Priority}
                  </div>
                </div>
                <div className="flex flex-col justify-start items-start w-full text-[14px] mt-[25px] ">
                  <div className="w-full flex justify-start items-start">
                    <div
                      className={
                        "w-[130px] flex justify-start" +
                        (props?.theme ? " text-[#828282]" : " text-[#797979]")
                      }
                    >
                      Created Time
                    </div>
                    <div className="w-[calc(100%-130px)] flex justify-start items-start ">
                      {getDateFormat(taskData[0]?.CreationDate)}{" "}
                      <span className="text-[#5c5c5c] ml-[12px] uppercase">
                        {taskData[0]?.CreationTime}
                      </span>
                    </div>
                  </div>
                  <div className="w-full flex justify-start items-start mt-[12px]">
                    <div
                      className={
                        "w-[130px] flex justify-start" +
                        (props?.theme ? " text-[#828282]" : " text-[#797979]")
                      }
                    >
                      Created By
                    </div>
                    <div className="w-[calc(100%-130px)] flex justify-start items-start ">
                      {taskData[0]?.CreatedBy}
                    </div>
                  </div>
                  <div className="w-full flex justify-start items-start mt-[12px]">
                    <div
                      className={
                        "w-[130px] flex justify-start" +
                        (props?.theme ? " text-[#828282]" : " text-[#797979]")
                      }
                    >
                      Status
                    </div>
                    <div className="w-[calc(100%-130px)] flex justify-start items-start ">
                      {taskData[0]?.Status}
                    </div>
                  </div>
                  <div className="w-full flex justify-start items-start mt-[12px]">
                    <div
                      className={
                        "w-[130px] flex justify-start" +
                        (props?.theme ? " text-[#828282]" : " text-[#797979]")
                      }
                    >
                      Priority
                    </div>
                    <div className="w-[calc(100%-130px)] flex justify-start items-start ">
                      {taskData[0]?.Priority}
                    </div>
                  </div>
                  <div className="w-full flex justify-start items-start mt-[12px]">
                    <div
                      className={
                        "w-[130px] flex justify-start" +
                        (props?.theme ? " text-[#828282]" : " text-[#797979]")
                      }
                    >
                      Due Date
                    </div>
                    <div className="w-[calc(100%-130px)] flex justify-start items-start ">
                      {getDateFormat(taskData[0]?.DueTime)}
                    </div>
                  </div>
                  <div className="w-full flex justify-start items-start mt-[12px]">
                    <div
                      className={
                        "w-[130px] flex justify-start" +
                        (props?.theme ? " text-[#828282]" : " text-[#797979]")
                      }
                    >
                      Tags
                    </div>
                    <div className="w-[calc(100%-130px)] mt-[-12px] flex justify-start items-start flex-wrap ">
                      {taskData[0]?.Tags?.map((data, indexxx) => {
                        return (
                          <div
                            key={indexxx}
                            className={
                              "px-[9px] h-[28px] rounded-full flex justify-center items-center bg-[#F7F7F7] text-[#2b2b2b] text-[12px] mt-[10px]" +
                              (indexxx > 0 ? " mr-[10px]" : " mr-[10px]")
                            }
                          >
                            {data.charAt(0).toUpperCase() + data.substr(1)}
                          </div>
                        );
                      })}
                    </div>
                  </div>
                  <div className="w-full flex justify-start items-start mt-[12px]">
                    <div
                      className={
                        "w-[130px] flex justify-start" +
                        (props?.theme ? " text-[#828282]" : " text-[#797979]")
                      }
                    >
                      Assignees
                    </div>
                    <div className="w-[calc(100%-130px)] flex justify-start items-start ">
                      {taskData[0]?.DueTime}
                    </div>
                  </div>
                </div>
                <div
                  className={
                    "w-full p-[15px] py-[12px] text-[13px] rounded-xl bg-[#f7f7f7] flex flex-col justify-start items-start mt-[25px]" +
                    (props?.theme ? " text-[#828282]" : " text-[#797979]")
                  }
                >
                  <span className="text-[black] text-[14px] font-[DMSm] mb-[5px]">
                    Description
                  </span>
                  <pre className="font-[DMSr] whitespace-pre-wrap">
                    {taskData[0]?.Description}
                  </pre>
                </div>
                {/* <div className="w-full border-t-[1.5px] border-[#f7f7f7] my-[20px]"></div> */}
              </div>
            </div>
          </>
        )}
      </div>
    </>
  );
}

function AddComment(props) {
  return (
    <div className="w-[400px] mr-[10px] h-full flex justify-start justify-start">
      <div className="w-full h-auto rounded-2xl bg-[white] p-[20px] flex flex-col justify-start items-start ">
        <div className="w-full mt-[-3px] font-[DMSm] text-[20px]">
          Add Comment
        </div>
      </div>
    </div>
  );
}
