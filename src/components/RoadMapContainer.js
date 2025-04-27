import React, { useEffect, useState } from "react";
import {
  ArrowLeft,
  ArrowUp,
  Calendar,
  CalendarFold,
  Check,
  ChevronRight,
  Circle,
  CircleCheck,
  CloudDrizzle,
  Cog,
  Ellipsis,
  File,
  FileArchive,
  FileSearch,
  FolderClosed,
  FolderOpen,
  Link2,
  Loader,
  MessageSquare,
  MessageSquareText,
  MoveLeft,
  NotebookPen,
  Paperclip,
  Pause,
  Plus,
  Search,
  Siren,
  SlidersHorizontal,
  SlidersVertical,
  Sparkles,
  Tags,
  Terminal,
  Trash,
  Twitch,
  User,
  X,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { onAuthStateChanged } from "firebase/auth";
import { auth, db } from "../firebase";
import {
  arrayRemove,
  arrayUnion,
  onSnapshot,
  serverTimestamp,
} from "firebase/firestore";
import firebase from "../firebase";

export default function RoadMapContainer(props) {
  const [theme, setTheme] = useState(props?.theme);
  const [searchPrompt, setSearchPrompt] = useState("");
  const [section, setSection] = useState("All");

  const navigate = useNavigate();

  function navigateToWelcomePgae() {
    navigate(`/user/login`);
  }

  useEffect(() => {
    function ActiveApiKey() {
      // const user = firebase.auth().currentUser;
      const listen = onAuthStateChanged(auth, (user) => {
        if (user) {
          const channelRef = db.collection("user").doc(user?.uid);

          onSnapshot(channelRef, (snapshot) => {
            setTheme(snapshot?.data()?.Theme);
          });
        } else {
          console.log("Not Logged in");
          navigateToWelcomePgae();
        }
      });
    }
    ActiveApiKey();
  }, []);
  return (
    <>
      <div
        className={
          "w-[calc(100%-50px)] h-[100svh] flex flex-col justify-start items-start py-[8px] text-[white] text-[14px]" +
          (theme ? " text-[#9ba6aa]" : " text-[#6e6e7c]")
        }
      >
        {/* <div className="w-full h-[40px]"></div> */}
        <div
          className={
            "w-full h-full rounded-lg flex flex-col justify-start items-start overflow-hidden" +
            (theme ? " bg-[#1a1a1a]" : " bg-[#ffffff]")
          }
        >
          {/* <div className="w-[320px] h-full rounded-lg border-[1.5px] border-[#273645] flex flex-col justify-start items-start p-[10px] px-[2px]">
            <div className="w-full h-[22px] flex justify-between items-center mb-[10px] px-[8px]">
              <div className="flex justify-start items-center">
                <Circle width={18} height={18} strokeWidth={1.8} className="" />
                <span
                  className={
                    "ml-[8px] " +
                    (props?.theme ? " text-[#ffffff]" : " text-[#000000]")
                  }
                >
                  Todo
                </span>
                <span className="ml-[8px]">4</span>
              </div>
              <div className="flex justify-end items-center">
                <Search
                  width={16}
                  height={16}
                  strokeWidth={2}
                  className={
                    "cursor-pointer " +
                    (props?.theme
                      ? " text-[#9ba6aa] hover:text-[#ffffff]"
                      : " text-[#6e6e7c] hover:text-[#000000]")
                  }
                />
                <SlidersHorizontal
                  width={16}
                  height={16}
                  strokeWidth={2}
                  className={
                    "cursor-pointer ml-[8px] rotate-90 " +
                    (props?.theme
                      ? " text-[#9ba6aa] hover:text-[#ffffff]"
                      : " text-[#6e6e7c] hover:text-[#000000]")
                  }
                />
                <Plus
                  width={18}
                  height={18}
                  strokeWidth={2}
                  className={
                    "cursor-pointer ml-[8px] " +
                    (props?.theme
                      ? " text-[#9ba6aa] hover:text-[#ffffff]"
                      : " text-[#6e6e7c] hover:text-[#000000]")
                  }
                />
                <Ellipsis
                  width={18}
                  height={18}
                  strokeWidth={1.8}
                  className={
                    "cursor-pointer ml-[8px]" +
                    (props?.theme
                      ? " text-[#9ba6aa] hover:text-[#ffffff]"
                      : " text-[#6e6e7c] hover:text-[#000000]")
                  }
                />
              </div>
            </div>

            <div
              className={
                "w-full h-[calc(100%-22px)] px-[8px] flex flex-col justify-start items-start overflow-y-scroll" +
                (theme ? " text-[#9ba6aa]" : " text-[#6e6e7c]")
              }
              onScroll={() => {
                if (props?.selectedDoc.split("_")[0] == "Todo") {
                  props?.setSelectedDoc("");
                }
              }}
            >
              {props?.TempData.map((data, index) => {
                return (
                  <div
                    key={index}
                    className={
                      "w-full h-auto rounded-lg bg-[#283541] flex flex-col justify-end items-end py-[10px] border-[1.5px] " +
                      (theme ? " border-[#2f3c47]" : " border-[#2f3c47]") +
                      (index == 0 ? " mt-[0px]" : " mt-[10px]")
                    }
                  >
                    
                    <div
                      className={
                        "w-full flex justify-between items-center px-[13px]" +
                        (theme ? " text-[white]" : " text-[black]")
                      }
                    >
                      <div className="flex justify-start items-center w-[calc(100%-50px)]">
                        <CloudDrizzle
                          width={18}
                          height={18}
                          strokeWidth={1.8}
                          className=""
                        />
                        <div className="ml-[8px] text-ellipsis whitespace-nowrap overflow-hidden w-[100%] ">
                          {data?.Title}
                        </div>
                      </div>
                      <div className="ml-[15px] w-[35px] flex justify-end items-center">
                        <Siren
                          width={18}
                          height={18}
                          strokeWidth={1.8}
                          className=""
                        />
                      </div>
                    </div>
                    <div className="w-full overflow-hidden text-ellipsis line-clamp-2 text-[13px]  mt-[5px] px-[13px]">
                      {data?.SubTitle}
                    </div>
                    <div className="w-full flex flex-wrap justify-start items-center text-[13px] mt-[5px]  px-[13px]">
                      <CalendarFold
                        width={16}
                        height={16}
                        strokeWidth={1.8}
                        className=" mb-[8px]"
                      />
                      <span className="ml-[8px] whitespace-nowrap mb-[8px] ">
                        Nov 6, 2025
                      </span>
                      {data?.Topics.map((dataa, index) => {
                        return (
                          <div
                            key={index}
                            className="px-[5px] h-[21px] flex justify-center items-center rounded-[5px] bg-[#e650e676] border-[1.5px] border-[#e978e971] text-[#fba4fb] ml-[8px] whitespace-nowrap mb-[8px]"
                          >
                            {dataa}
                          </div>
                        );
                      })}
                    </div>
                    <div className="w-full border-t-[2px] border-dashed border-[#3a4752] mt-[7px] my-[10px]"></div>
                    <div
                      className={
                        "w-auto h-[116px] bg-[#313f4d] mt-[-116px] rounded-lg  mr-[10px] flex-col justify-start items-start py-[8px] text-[13px] boxShadowLight2 border-[1.5px] border-[#384655]" +
                        (props?.selectedDoc.split("_")[0] == "Todo" &&
                        props?.selectedDoc.split("_")[1] == index
                          ? " flex"
                          : " hidden")
                      }
                    >
                      <div
                        className={
                          "w-full h-[25px] flex justify-start items-center cursor-pointer px-[12px] " +
                          (theme
                            ? " text-[#9ba6aa] hover:text-[#ffffff]"
                            : " text-[#6e6e7c] hover:text-[#000000]")
                        }
                      >
                        <Trash
                          width={16}
                          height={16}
                          strokeWidth={1.8}
                          className=""
                        />
                        <span className="ml-[7px]">Delete</span>
                      </div>
                      <div
                        className={
                          "w-full h-[25px] flex justify-start items-center cursor-pointer px-[12px] " +
                          (theme
                            ? " text-[#9ba6aa] hover:text-[#ffffff]"
                            : " text-[#6e6e7c] hover:text-[#000000]")
                        }
                      >
                        <Loader
                          width={16}
                          height={16}
                          strokeWidth={1.8}
                          className=""
                        />
                        <span className="ml-[7px]">Mark Progress</span>
                      </div>
                      <div
                        className={
                          "w-full h-[25px] flex justify-start items-center cursor-pointer px-[12px] " +
                          (theme
                            ? " text-[#9ba6aa] hover:text-[#ffffff]"
                            : " text-[#6e6e7c] hover:text-[#000000]")
                        }
                      >
                        <CircleCheck
                          width={16}
                          height={16}
                          strokeWidth={1.8}
                          className=""
                        />
                        
                        <span className="ml-[7px]">Mark Done</span>
                      </div>
                      <div
                        className={
                          "w-full h-[25px] flex justify-start items-center cursor-pointer px-[12px] " +
                          (theme
                            ? " text-[#9ba6aa] hover:text-[#ffffff]"
                            : " text-[#6e6e7c] hover:text-[#000000]")
                        }
                      >
                        <Pause
                          width={16}
                          height={16}
                          strokeWidth={1.8}
                          className=""
                        />
                        <span className="ml-[7px]">Mark Pause</span>
                      </div>
                    </div>
                    <div className="w-full px-[13px] flex justify-between items-center text-[13px] text-[#ffffff8c]">
                      <div className="flex justify-start items-center">
                        <Link2
                          width={16}
                          height={16}
                          strokeWidth={1.8}
                          className=""
                        />
                        <span className="ml-[5px] mr-[13px] ">
                          {data?.Links}
                        </span>
                        <Tags
                          width={16}
                          height={16}
                          strokeWidth={1.8}
                          className=""
                        />
                        <span className="ml-[5px] mr-[13px] ">
                          {data?.Tags}
                        </span>
                        <Paperclip
                          width={16}
                          height={16}
                          strokeWidth={1.8}
                          className=""
                        />
                        <span className="ml-[5px] mr-[13px] ">
                          {data?.Attachments}
                        </span>
                      </div>
                      {props?.selectedDoc.split("_")[0] == "Todo" &&
                      props?.selectedDoc.split("_")[1] == index ? (
                        <div
                          onClick={() => {
                            props?.setSelectedDoc("");
                          }}
                        >
                          <X
                            width={16}
                            height={16}
                            strokeWidth={1.8}
                            className={
                              "cursor-pointer " +
                              (theme
                                ? " hover:text-[white]"
                                : " hover:text-[black]")
                            }
                          />
                        </div>
                      ) : (
                        <div
                          onClick={() => {
                            props?.setSelectedDoc(`Todo_${index}`);
                          }}
                        >
                          <Ellipsis
                            width={16}
                            height={16}
                            strokeWidth={1.8}
                            className={
                              "cursor-pointer " +
                              (theme
                                ? " hover:text-[white]"
                                : " hover:text-[black]")
                            }
                          />
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
          <div className="w-[320px] h-full rounded-lg border-[1.5px] border-[#273645] flex flex-col justify-start items-start p-[10px] ml-[20px]">
            <div className="w-full flex justify-between items-center mb-[10px]">
              <div className="flex justify-start items-center">
                <Loader width={18} height={18} strokeWidth={1.8} className="" />
                <span className="ml-[8px]">In Progress</span>
                <span className="ml-[8px]">9</span>
              </div>
              <div className="flex justify-end items-center">
                <Plus
                  width={18}
                  height={18}
                  strokeWidth={1.8}
                  className={
                    "cursor-pointer " +
                    (theme
                      ? " text-[#9ba6aa] hover:text-[#ffffff]"
                      : " text-[#6e6e7c] hover:text-[#000000]")
                  }
                />
                <Ellipsis
                  width={18}
                  height={18}
                  strokeWidth={1.8}
                  className={
                    "cursor-pointer ml-[8px]" +
                    (theme
                      ? " text-[#9ba6aa] hover:text-[#ffffff]"
                      : " text-[#6e6e7c] hover:text-[#000000]")
                  }
                />
              </div>
            </div>
            <div className="w-full h-[170px] rounded-lg bg-[#283541] flex flex-col justify-start items-start p-[10px]">
              <div className="w-full flex justify-between items-center">
                <div className="flex justify-start items-center w-[calc(100%-50px)]">
                  <Twitch
                    width={18}
                    height={18}
                    strokeWidth={1.8}
                    className=""
                  />
                  <div className="ml-[8px] text-ellipsis whitespace-nowrap overflow-hidden w-[100%]">
                    Cloud Synchronization Document sds sfvs c
                  </div>
                </div>
                <div className="ml-[15px] w-[35px] flex justify-end items-center">
                  <Cog width={18} height={18} strokeWidth={1.8} className="" />
                </div>
              </div>
              <div className="text-[13px] text-[#ffffff8c] mt-[5px]">
                Project Description
              </div>
            </div>
            <div className="w-full h-[170px] rounded-lg bg-[#283541] mt-[10px]"></div>
          </div>  */}
          <div
            className={
              "w-full h-[86px] border-b-[1.5px] flex flex-col justify-start items-start p-[8px] pb-[0px]" +
              (theme
                ? " bg-[#222222] border-[#303030]"
                : " bg-[#222222] border-[#303030]")
            }
          >
            <div className="w-full flex justify-between items-center px-[10px]">
              <div className="w-[calc((100%-450px)/2)] flex justify-start items-center h-full">
                {/* <button className="flex justify-center items-center">
                  <SlidersVertical
                    width={16}
                    height={16}
                    strokeWidth={2}
                    className="mr-[8px]"
                  />{" "}
                  Layout
                </button> */}
              </div>
              <div className="w-[450px] flex justify-center items-center">
                <button className="w-[35px] flex justify-center items-center mr-[-35px] z-10 text-[#808080] hover:text-[#ffffff] cursor-pointer">
                  <Search width={16} height={16} strokeWidth={2} className="" />
                </button>
                <input
                  className={
                    "outline-none rounded-[10px] h-[33px] w-[450px] border-[1.5px] px-[35px]" +
                    (theme
                      ? " bg-[#292929] border-[#323232] placeholder:text-[#5b5b5b]"
                      : " bg-[#292929] border-[#303030]")
                  }
                  placeholder="Search for anything"
                  value={searchPrompt}
                  onInput={(e) => {
                    setSearchPrompt(e.target.value);
                    // e.target.style.height = "auto"; // Reset the height to auto to recalculate
                    // e.target.style.height = `${e.target.scrollHeight}px`; // Set the height to the scroll height
                  }}
                  // onKeyDown={(e) => {
                  //   if (e.key === "Enter" && !e.shiftKey) {
                  //     e.preventDefault(); // Prevent new line
                  //     if (message?.trim().length > 0) {
                  //       addUserMessage(message);
                  //       setLoading(true);
                  //       e.target.style.height = "auto";
                  //     }
                  //   }
                  // }}
                ></input>
                <button
                  className={
                    "w-[35px] justify-center items-center ml-[-35px] z-10 text-[#808080] hover:text-[#ffffff] cursor-pointer" +
                    (searchPrompt.length > 0 ? " flex" : " hidden")
                  }
                  onClick={() => {
                    setSearchPrompt("");
                    // setShowModels(false);
                  }}
                >
                  <X width={16} height={16} strokeWidth={2} className="" />
                </button>
              </div>
              <div className="w-[calc((100%-450px)/2)] flex justify-end items-center h-full">
                <button
                  className={
                    "flex justify-center items-center border-[1.5px] rounded-lg h-[30px] px-[10px]" +
                    (theme
                      ? " text-[#828282] hover:text-[white]  border-[#3c3c3c] hover:bg-[#3c3c3c] hover:border-[#4a4a4a]"
                      : " text-[#797979] hover:text-[black]  border-[#303030]")
                  }
                >
                  <SlidersVertical
                    width={16}
                    height={16}
                    strokeWidth={2}
                    className="mr-[8px]"
                  />{" "}
                  Layout
                </button>
              </div>
            </div>
            <div className="w-full flex justify-between items-end mt-[10px] h-[35px] mb-[-1.5px] px-[20px]">
              <div className="flex justify-start ">
                <div
                  className={
                    "w-auto flex flex-col justify-center items-start cursor-pointer" +
                    (theme
                      ? section == "All"
                        ? " text-[white] hover:text-[white]"
                        : " text-[#828282] hover:text-[white]"
                      : section == "All"
                      ? " text-[black] hover:text-[black]"
                      : " text-[#797979] hover:text-[black]")
                  }
                  onClick={() => {
                    setSection("All");
                    // setShowModels(false);
                  }}
                >
                  <div className="flex justify-center items-center whitespace-nowrap">
                    All
                  </div>
                  <div
                    className={
                      "w-full h-[2px] rounded-full mt-[5px]" +
                      (theme
                        ? section == "All"
                          ? " bg-[white]"
                          : " bg-transparent"
                        : section == "All"
                        ? " bg-[black]"
                        : " bg-transparent")
                    }
                  ></div>
                </div>
                <div
                  className={
                    "w-auto flex flex-col justify-center items-start cursor-pointer ml-[25px]" +
                    (theme
                      ? section == "Ongoing"
                        ? " text-[white] hover:text-[white]"
                        : " text-[#828282] hover:text-[white]"
                      : section == "Ongoing"
                      ? " text-[black] hover:text-[black]"
                      : " text-[#797979] hover:text-[black]")
                  }
                  onClick={() => {
                    setSection("Ongoing");
                    // setShowModels(false);
                  }}
                >
                  <div className="flex justify-center items-center whitespace-nowrap">
                    Ongoing
                    <div className="border-[1.5px] border-[#3d3d3d] rounded-md flex justify-center items-center px-[4px] h-[17px] text-[9px] font-[geistMedium] ml-[5px]">
                      32
                    </div>
                  </div>
                  <div
                    className={
                      "w-full h-[2px] rounded-full mt-[5px]" +
                      (theme
                        ? section == "Ongoing"
                          ? " bg-[white]"
                          : " bg-transparent"
                        : section == "Ongoing"
                        ? " bg-[black]"
                        : " bg-transparent")
                    }
                  ></div>
                </div>
                <div
                  className={
                    "w-auto flex flex-col justify-center items-start cursor-pointer ml-[25px]" +
                    (theme
                      ? section == "Notes"
                        ? " text-[white] hover:text-[white]"
                        : " text-[#828282] hover:text-[white]"
                      : section == "Notes"
                      ? " text-[black] hover:text-[black]"
                      : " text-[#797979] hover:text-[black]")
                  }
                  onClick={() => {
                    setSection("Notes");
                    // setShowModels(false);
                  }}
                >
                  <div className="flex justify-center items-center whitespace-nowrap">
                    Notes
                  </div>
                  <div
                    className={
                      "w-full h-[2px] rounded-full mt-[5px]" +
                      (theme
                        ? section == "Notes"
                          ? " bg-[white]"
                          : " bg-transparent"
                        : section == "Notes"
                        ? " bg-[black]"
                        : " bg-transparent")
                    }
                  ></div>
                </div>
                <div
                  className={
                    "w-auto flex flex-col justify-center items-start cursor-pointer ml-[25px]" +
                    (theme
                      ? section == "Due"
                        ? " text-[white] hover:text-[white]"
                        : " text-[#828282] hover:text-[white]"
                      : section == "Due"
                      ? " text-[black] hover:text-[black]"
                      : " text-[#797979] hover:text-[black]")
                  }
                  onClick={() => {
                    setSection("Due");
                    // setShowModels(false);
                  }}
                >
                  <div className="flex justify-center items-center whitespace-nowrap">
                    Due{" "}
                    <div className="border-[1.5px] border-[#3d3d3d] rounded-md flex justify-center items-center px-[4px] h-[17px] text-[9px] font-[geistMedium] ml-[5px]">
                      9
                    </div>
                  </div>
                  <div
                    className={
                      "w-full h-[2px] rounded-full mt-[5px]" +
                      (theme
                        ? section == "Due"
                          ? " bg-[white]"
                          : " bg-transparent"
                        : section == "Due"
                        ? " bg-[black]"
                        : " bg-transparent")
                    }
                  ></div>
                </div>
                <div
                  className={
                    "w-auto flex flex-col justify-center items-start cursor-pointer ml-[25px]" +
                    (theme
                      ? section == "Rent"
                        ? " text-[white] hover:text-[white]"
                        : " text-[#828282] hover:text-[white]"
                      : section == "Rent"
                      ? " text-[black] hover:text-[black]"
                      : " text-[#797979] hover:text-[black]")
                  }
                  onClick={() => {
                    setSection("Rent");
                    // setShowModels(false);
                  }}
                >
                  <div className="flex justify-center items-center whitespace-nowrap">
                    Rent
                  </div>
                  <div
                    className={
                      "w-full h-[2px] rounded-full mt-[5px]" +
                      (theme
                        ? section == "Rent"
                          ? " bg-[white]"
                          : " bg-transparent"
                        : section == "Rent"
                        ? " bg-[black]"
                        : " bg-transparent")
                    }
                  ></div>
                </div>
              </div>
              <div className="flex justify-end h-full"></div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
