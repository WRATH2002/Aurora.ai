import React from "react";
import LandingPage from "./Landing/LandingPage";
import LeftSidebar from "./LeftSidebar";
import LeftSection from "./LeftSection";
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
  Sparkles,
  Tags,
  Terminal,
  Trash,
  Twitch,
  User,
  X,
} from "lucide-react";
import MainPageTopBar from "./MainPageTopBar";
import MainPage from "./MainPage";
import { useEffect, useRef, useState } from "react";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { lexicalEdit, TempData } from "../utils/constant";
import { auth, db } from "../firebase";
import {
  arrayRemove,
  arrayUnion,
  onSnapshot,
  serverTimestamp,
} from "firebase/firestore";
import firebase from "../firebase";
import TypingEffect from "./TypingEffect";
import Login from "./Landing/Login";
import CalenderView from "./CalenderView";
import AiWindowPopUp from "./AiWindowPopUp";
import Signup from "./Landing/Signup";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  useSearchParams,
} from "react-router-dom";
import { useNavigate, useParams } from "react-router-dom";
import { onAuthStateChanged } from "firebase/auth";
import AiChatBot from "./AiChatBot";
import AiChatBotSidebar from "./AiChatBotSidebar";

export default function AppContainer() {
  const [searchParams] = useSearchParams();
  const [theme, setTheme] = useState(false);
  const [isMinimise, setIsMinimise] = useState(false);
  const [selectedText, setSelectedText] = useState("");
  const [prompt, setPrompt] = useState("");
  const [subDivHeight, setSubDivHeight] = useState(0); // To store div's height
  const subDivRef = useRef(null); // Create a ref for the div
  const scrollToLast = useRef(null);
  const [fileStacked, setFileStacked] = useState(["Welcome to Obsidian"]);
  const [fileStackedWithInfo, setFileStackedWithInfo] = useState([
    // {
    //   Title: "Welcome to Obsidian",
    //   Content: "",
    //   LastSaved: "",
    //   isInitial: true,
    // },
  ]);
  const [selected, setSelected] = useState(0);

  const [toggleAddEventModal, setToggleAddEventModal] = useState(false);
  const [month, setMonth] = useState("");
  const [year, setYear] = useState("");
  const [selectedDoc, setSelectedDoc] = useState("");

  const [AiOutput, setAiOutput] = useState([]);
  const [loading, setLoading] = useState(false);
  const [saveLoading, setSaveLoading] = useState(false);
  const [AiSection, setAiSection] = useState("");

  const [authUser, setAuthUser] = useState(null);

  const [fetchNoteQueue, setFetchNoteQueue] = useState([]);
  const [searchChat, setSearchChat] = useState(false);

  const [chat, setChat] = useState([
    { sender: "user", message: "Tell me about COmputer network" },
    {
      sender: "assistant",
      message: `A computer network is a collection of interconnected devices, such as computers, servers, smartphones, and peripherals, that can communicate and share resources with each other. These devices are linked together using various communication mediums, like cables (Ethernet, fiber optic) or wireless technologies (Wi-Fi, Bluetooth).  The purpose of a network is to facilitate information exchange, resource sharing, and collaboration among users and devices.

Here's a breakdown of key aspects of computer networks:

**Key Components:**

* **Nodes:** These are the individual devices connected to the network, including computers, servers, printers, routers, switches, and more.
* **Links:** These are the communication pathways that connect the nodes. They can be physical cables or wireless connections.
* **Protocols:** These are the rules and standards that govern how data is transmitted and received over the network.  Examples include TCP/IP, HTTP, and FTP.`,
    },
  ]);

  useEffect(() => {
    console.log("##########################################################");
    console.log(fileStackedWithInfo);
  }, [fileStackedWithInfo]);

  const navigate = useNavigate();
  function navigateToWelcomePgae() {
    navigate(`/user/login`);
  }

  useEffect(() => {
    const listen = onAuthStateChanged(auth, (user) => {
      if (user) {
        setAuthUser(user);
        // fetchSplitTransaction();
      } else {
        setAuthUser(null);
        navigateToWelcomePgae();
      }
    });
    return () => {
      listen();
    };
  }, []);

  useEffect(() => {
    if (scrollToLast.current) {
      scrollToLast.current.scrollTop = scrollToLast.current.scrollHeight;
    }
  }, [chat]);

  function fetchTheme() {
    // const user = firebase.auth().currentUser;

    const channelRef = db.collection("user").doc("lv5PcvKwOUUj45R95lwE");

    onSnapshot(channelRef, (snapshot) => {
      setTheme(snapshot?.data()?.Theme);
    });
  }

  useEffect(() => {
    fetchTheme();
  }, []);

  useEffect(() => {
    const themeColorMeta = document.querySelector("meta[name='theme-color']");

    if (themeColorMeta) {
      themeColorMeta.setAttribute("content", theme ? "#111D2A" : "#ffffff");
    } else {
      // If the meta tag doesn't exist, create it
      const newMeta = document.createElement("meta");
      newMeta.name = "theme-color";
      newMeta.content = theme ? "#111D2A" : "#ffffff";
      document.head.appendChild(newMeta);
    }
  }, [theme]);

  useEffect(() => {
    if (subDivRef.current) {
      // Get and set the height of the div
      setSubDivHeight(subDivRef.current.offsetHeight);
    }
  }, []);

  // const genAI = new GoogleGenerativeAI(process.env.REACT_APP_GEMINI_KEY);
  const genAI = new GoogleGenerativeAI(
    "AIzaSyDViziRgn4Bj7gKX_486zR-SgBqBFLyg0U"
  );
  const model = genAI.getGenerativeModel({
    model: "gemini-1.5-pro",
  });

  const generationConfig = {
    temperature: 1,
    top_p: 0.95,
    top_k: 64,
    max_output_tokens: 8192,
    response_mime_type: "text/plain",
  };

  async function run() {
    console.log("generating plan");
    const chatSession = model.startChat({
      generationConfig,
      // safetySettings: Adjust safety settings
      // See https://ai.google.dev/gemini-api/docs/safety-settings
      history: [],
    });

    const result = await chatSession.sendMessage(
      `
      ${prompt}`
    );
    console.log(result?.response?.text());
    setChat((prev) => [
      ...prev,
      { sender: "assistant", message: result?.response?.text() },
    ]);
  }
  // const navigate = useNavigate();
  // function navigateToSection(section) {
  //   navigate(`/user/welcomeUser/${section}`);
  // }

  const addToQueue = (noteId) => {
    setFetchNoteQueue((prevQueue) => [...prevQueue, noteId]); // Append to queue
  };

  useEffect(() => {
    console.log(selectedDoc);
  }, [selectedDoc]);

  return (
    <>
      <div
        className={
          "w-full h-[100svh] flex font-[geistRegular] pr-[0px] md:pr-[7px] lg:pr-[7px] pb-[7px] z-10 backdrop-blur-xl overflow-hidden" +
          (theme ? " bg-[#111d2a]" : " bg-[#ffffff00]")
        }
      >
        {loading || AiOutput.length > 0 ? (
          <AiWindowPopUp
            AiOutput={AiOutput}
            setAiOutput={setAiOutput}
            loading={loading}
            setLoading={setLoading}
            AiSection={AiSection}
            setAiSection={setAiSection}
          />
        ) : (
          <></>
        )}
        <LeftSidebar
          theme={theme}
          setTheme={setTheme}
          isMinimise={isMinimise}
          setIsMinimise={setIsMinimise}
        />

        {/* <div className="w-[calc(100%-50px)] h-[calc(100%-40px)] mt-[40px] bg-white rounded-lg p-[5px] ">
          <CalenderView />
        </div> */}
        {searchParams.get("ID")?.split("?section=")[1] == "Notes" ? (
          <>
            <LeftSection
              theme={theme}
              setTheme={setTheme}
              isMinimise={isMinimise}
              setIsMinimise={setIsMinimise}
              selected={selected}
              setSelected={setSelected}
              fileStacked={fileStacked}
              setFileStacked={setFileStacked}
              fileStackedWithInfo={fileStackedWithInfo}
              setFileStackedWithInfo={setFileStackedWithInfo}
              setFetchNoteQueue={setFetchNoteQueue}
              fetchNoteQueue={fetchNoteQueue}
            />

            <div
              className={
                " h-full  flex-col " +
                (isMinimise
                  ? " w-[calc((100%-50px)/1)] flex relative"
                  : fileStacked.length > 0
                  ? " w-full flex fixed md:static lg:static md:flex lg:flex md:w-[calc((100%-300px)/1)] lg:w-[calc((100%-300px)/1)]"
                  : " w-[0px] hidden md:flex lg:flex  md:w-[calc((100%-300px)/1)] lg:w-[calc((100%-300px)/1)]")
              }
              style={{ transition: ".3s" }}
            >
              <MainPageTopBar
                theme={theme}
                setTheme={setTheme}
                fileStacked={fileStacked}
                setFileStacked={setFileStacked}
                fileStackedWithInfo={fileStackedWithInfo}
                setFileStackedWithInfo={setFileStackedWithInfo}
                selected={selected}
                setSelected={setSelected}
                saveLoading={saveLoading}
                setSaveLoading={setSaveLoading}
              />

              <div className="w-full h-[calc(100%-102px)] md:h-[calc(100%-40px)] lg:h-[calc(100%-40px)] flex justify-start items-start font-[geistRegular]">
                <div className="w-[calc(100%-00px)] h-full flex justify-start items-start rounded-r-md ">
                  <MainPage
                    theme={theme}
                    setTheme={setTheme}
                    isMinimise={isMinimise}
                    setIsMinimise={setIsMinimise}
                    selectedText={selectedText}
                    setSelectedText={setSelectedText}
                    selected={selected}
                    setSelected={setSelected}
                    fileStacked={fileStacked}
                    fileStackedWithInfo={fileStackedWithInfo}
                    setFileStackedWithInfo={setFileStackedWithInfo}
                    AiOutput={AiOutput}
                    setAiOutput={setAiOutput}
                    loading={loading}
                    setLoading={setLoading}
                    AiSection={AiSection}
                    setAiSection={setAiSection}
                    setFetchNoteQueue={setFetchNoteQueue}
                    fetchNoteQueue={fetchNoteQueue}
                    saveLoading={saveLoading}
                    setSaveLoading={setSaveLoading}
                  />
                </div>
              </div>
            </div>
          </>
        ) : searchParams.get("ID")?.split("?section=")[1] == "Roadmaps" ? (
          <div
            className={
              "w-[calc(100%-50px)] h-[100svh] flex flex-col justify-start items-start pb-[8px] text-[white] text-[14px]" +
              (theme ? " text-[#9ba6aa]" : " text-[#6e6e7c]")
            }
          >
            <div className="w-full h-[40px]"></div>
            <div className="w-full h-[calc(100svh-48px)] rounded-lg flex justify-start items-start bg-[#1D2935] p-[30px]">
              <div className="w-[320px] h-full rounded-lg border-[1.5px] border-[#273645] flex flex-col justify-start items-start p-[10px] px-[2px]">
                <div className="w-full h-[22px] flex justify-between items-center mb-[10px] px-[8px]">
                  <div className="flex justify-start items-center">
                    <Circle
                      width={18}
                      height={18}
                      strokeWidth={1.8}
                      className=""
                    />
                    <span
                      className={
                        "ml-[8px] " +
                        (theme ? " text-[#ffffff]" : " text-[#000000]")
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
                        (theme
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
                        (theme
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

                <div
                  className={
                    "w-full h-[calc(100%-22px)] px-[8px] flex flex-col justify-start items-start overflow-y-scroll" +
                    (theme ? " text-[#9ba6aa]" : " text-[#6e6e7c]")
                  }
                  onScroll={() => {
                    if (selectedDoc.split("_")[0] == "Todo") {
                      setSelectedDoc("");
                    }
                  }}
                >
                  {TempData.map((data, index) => {
                    return (
                      <div
                        key={index}
                        className={
                          "w-full h-auto rounded-lg bg-[#283541] flex flex-col justify-end items-end py-[10px] border-[1.5px] " +
                          (theme ? " border-[#2f3c47]" : " border-[#2f3c47]") +
                          (index == 0 ? " mt-[0px]" : " mt-[10px]")
                        }
                      >
                        {/* <div
                          className={
                            "w-[100px] h-[100px] rounded-lg bg-[#313f4d] absolute boxShadowLight2" +
                            (index == 0 ? " flex" : " hidden")
                          }
                        ></div> */}
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
                            (selectedDoc.split("_")[0] == "Todo" &&
                            selectedDoc.split("_")[1] == index
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
                            {/* <Check
                              width={10}
                              height={10}
                              strokeWidth={3.5}
                              className="ml-[-13.5px] mr-[3.5px]"
                            /> */}
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
                          {selectedDoc.split("_")[0] == "Todo" &&
                          selectedDoc.split("_")[1] == index ? (
                            <div
                              onClick={() => {
                                setSelectedDoc("");
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
                                setSelectedDoc(`Todo_${index}`);
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
                    <Loader
                      width={18}
                      height={18}
                      strokeWidth={1.8}
                      className=""
                    />
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
                      <Cog
                        width={18}
                        height={18}
                        strokeWidth={1.8}
                        className=""
                      />
                    </div>
                  </div>
                  <div className="text-[13px] text-[#ffffff8c] mt-[5px]">
                    Project Description
                  </div>
                </div>
                <div className="w-full h-[170px] rounded-lg bg-[#283541] mt-[10px]"></div>
              </div>
            </div>
          </div>
        ) : (
          <div
            className={
              "w-full md:w-[calc(100%-50px)] lg:w-[calc(100%-50px)] h-[calc(100svh-52px)] md:h-[100svh] lg:h-[100svh] flex flex-col justify-start items-start py-[0px] md:py-[8px] lg:py-[8px] text-[white] text-[14px]" +
              (theme ? " text-[#9ba6aa]" : " text-[#6e6e7c]")
            }
          >
            <div className="w-full h-[40px] hidden md:hidden lg:hidden"></div>
            <div
              className={
                "w-full h-full  rounded-lg flex justify-start items-start " +
                (theme ? " bg-[#1D2935]" : " bg-[#ffffff]")
              }
            >
              <AiChatBotSidebar
                theme={theme}
                setSearchChat={setSearchChat}
                searchChat={searchChat}
              />
              <AiChatBot theme={theme} />
            </div>
          </div>
        )}
      </div>
    </>
  );
}
