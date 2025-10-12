import React, { use } from "react";
import LandingPage from "./Landing/LandingPage";
import LeftSidebar from "./LeftSidebar";
import LeftSection from "./LeftSection";

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
import RoadMapContainer from "./RoadMapContainer";
import LockDown from "./LockDown";

import { ring2 } from "ldrs";
import { useSelector } from "react-redux";
import CreateTheme from "./CreateTheme";
ring2.register();

// Default values shown

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
  const [fileStackedWithInfo, setFileStackedWithInfo] = useState([]);
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
  const [chatSidebarModal, setChatSidebarModal] = useState(true);
  const [selectedChatName, setSelectedChatName] = useState("");
  const [isAgentMode, setIsAgentMode] = useState(false);
  const [agentInfo, setAgentInfo] = useState([]);
  const [chatLoading, setChatLoading] = useState(false);

  // ---- For fetching data from Redux Store
  const currentTheme = useSelector((state) => state?.currentTheme);
  // ---- Initializing Navigate for redirection
  const navigate = useNavigate();

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

  // ---- Function to navigate to Login Page
  function navigateToWelcomePgae() {
    navigate(`/user/login`);
  }

  // ---- Function to fetch Theme form Firebase  ## Called inside auth checking UseEffect
  function fetchTheme() {
    const user = firebase.auth().currentUser;
    const channelRef = db.collection("user").doc(user?.uid);
    onSnapshot(channelRef, (snapshot) => {
      setTheme(snapshot?.data()?.Theme);
    });
  }

  // ---- Checking if the user is logged in or not
  useEffect(() => {
    const listen = onAuthStateChanged(auth, (user) => {
      if (user) {
        setAuthUser(user);
        fetchTheme();
      } else {
        setAuthUser(null);
        navigateToWelcomePgae();
      }
    });
    return () => {
      listen();
    };
  }, []);

  // ---- Setting the Browser theme color based on Theme for Android
  useEffect(() => {
    const themeColorMeta = document.querySelector("meta[name='theme-color']");

    if (themeColorMeta) {
      themeColorMeta.setAttribute("content", theme ? "#141414" : "#ffffff");
    } else {
      // If the meta tag doesn't exist, create it
      const newMeta = document.createElement("meta");
      newMeta.name = "theme-color";
      newMeta.content = theme ? "#141414" : "#ffffff";
      document.head.appendChild(newMeta);
    }
  }, [theme]);

  useEffect(() => {
    if (subDivRef.current) {
      // Get and set the height of the div
      setSubDivHeight(subDivRef.current.offsetHeight);
    }
  }, []);

  const activeTimeRef = useRef(0); // in seconds
  const intervalRef = useRef(null);
  const [showReminder, setShowReminder] = useState(false);

  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.visibilityState === "visible") {
        startCounting();
      } else {
        stopCounting();
      }
    };

    document.addEventListener("visibilitychange", handleVisibilityChange);

    // Start counting when component mounts and tab is visible
    if (document.visibilityState === "visible") {
      startCounting();
    }

    return () => {
      document.removeEventListener("visibilitychange", handleVisibilityChange);
      stopCounting(); // cleanup
    };
  }, []);

  const startCounting = () => {
    if (intervalRef.current) return; // already running
    intervalRef.current = setInterval(() => {
      activeTimeRef.current += 1;

      if (activeTimeRef.current >= 20 * 60) {
        setShowReminder(true);
        stopCounting(); // optional: pause timer after first reminder
      }
    }, 1000);
  };

  const stopCounting = () => {
    clearInterval(intervalRef.current);
    intervalRef.current = null;
  };

  const resetReminder = () => {
    setShowReminder(false);
    activeTimeRef.current = 0;
    startCounting();
  };

  return (
    <>
      {/* {showReminder && (
        <LockDown theme={theme} onBreakComplete={resetReminder} />
      )} */}

      {/* <CreateTheme /> */}

      <div
        className={
          "w-full h-[100svh] flex font-[DMSr] pr-[0px] md:pr-[7px] lg:pr-[7px] pb-[7px] z-10 backdrop-blur-xl overflow-hidden" +
          (theme
            ? ` bg-[#141414] appDark`
            : ` bg-[${currentTheme?.bgSecondary}] appLight`)
        }
        style={{
          // ---- fetched from redux store
          backgroundColor: `${currentTheme?.bgSecondary}`,
        }}
      >
        <div
          className={
            "fixed right-[20px] bottom-[20px] w-auto h-[40px] rounded-[10px] border flex justify-start items-center px-[12px]" +
            (theme
              ? " border-[#252525] bg-[#353e42]"
              : " border-[#d2d2d2] bg-[#ffffff]") +
            (loading ? " mb-[0px]" : " mb-[-70px]")
          }
          style={{
            zIndex: "1000",
            boxShadow: "0 12px 16px -6px rgba(0, 0, 0, 0.1)",
            // ---- fetched from redux store
            transition: `${currentTheme?.mediumAnimationDuration}`,
            backgroundColor: `${currentTheme?.bgPrimary}`,
            borderColor: `${currentTheme?.borderSecondary}`,
            color: `${currentTheme?.textPrimary}`, // For both text and loader
          }}
        >
          <l-ring-2
            size="16"
            stroke="2.5"
            stroke-length="0.25"
            bg-opacity="0.1"
            speed="0.8"
            color="currentColor"
          ></l-ring-2>
          <div className="ml-[10px] font-[r] text-[14px]">
            Please wait ! Gemini is thinking ...
          </div>
        </div>
        {!loading || AiOutput.length > 0 ? (
          <>
            {/* <div
              className={
                "fixed right-[20px] bottom-[20px] w-auto h-[40px] rounded-[10px] border flex justify-start items-center px-[12px]" +
                (theme
                  ? " border-[#252525] bg-[#353e42]"
                  : " border-[#d2d2d2] bg-[#ffffff]")
              }
              style={{
                zIndex: "1000",
                boxShadow: "0 12px 16px -6px rgba(0, 0, 0, 0.1)",
              }}
            >
              <l-ring-2
                size="16"
                stroke="2.5"
                stroke-length="0.25"
                bg-opacity="0.1"
                speed="0.8"
                color="black"
              ></l-ring-2>
              <div className="ml-[10px] font-[r] text-[14px]">
                Please wait ! Gemini is thinking ...
              </div>
            </div> */}
            {/* <AiWindowPopUp
              AiOutput={AiOutput}
              setAiOutput={setAiOutput}
              loading={loading}
              setLoading={setLoading}
              AiSection={AiSection}
              setAiSection={setAiSection}
            /> */}
          </>
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
              style={{
                // ---- fetched from redux store
                transition: `${currentTheme?.mediumAnimationDuration}`,
              }}
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

              <div className="w-full h-[calc(100%-102px)] md:h-[calc(100%-40px)] lg:h-[calc(100%-40px)] flex justify-start items-start font-[ir]">
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
          <>
            <RoadMapContainer
              theme={theme}
              selectedDoc={selectedDoc}
              setSelectedDoc={setSelectedDoc}
              TempData={TempData}
            />
          </>
        ) : searchParams.get("ID")?.split("?section=")[1] == "Calender" ? (
          <div className="w-full h-full flex justify-start items-center pt-[8px]">
            <CalenderView theme={theme} />
          </div>
        ) : (
          <div
            className={
              "w-full md:w-[calc(100%-50px)] lg:w-[calc(100%-50px)] h-[calc(100svh-52px)] md:h-[100svh] lg:h-[100svh] flex flex-col justify-start items-start py-[0px] md:py-[8px] lg:py-[8px] text-[white] text-[14px]" +
              (theme ? " text-[#9ba6aa]" : " text-[#9a6969]")
            }
          >
            <div className="w-full h-[40px] hidden md:hidden lg:hidden"></div>
            <div
              className={
                "w-full h-full  rounded-xl flex justify-start items-start " +
                (theme ? " bg-[#1a1a1a]" : " bg-[#ffffff]")
              }
            >
              <AiChatBotSidebar
                theme={theme}
                setSearchChat={setSearchChat}
                searchChat={searchChat}
                setChatSidebarModal={setChatSidebarModal}
                chatSidebarModal={chatSidebarModal}
                selectedChatName={selectedChatName}
                setSelectedChatName={setSelectedChatName}
                isAgentMode={isAgentMode}
                setIsAgentMode={setIsAgentMode}
                agentInfo={agentInfo}
                setAgentInfo={setAgentInfo}
                chatLoading={chatLoading}
                setChatLoading={setChatLoading}
              />
              <AiChatBot
                theme={theme}
                setChatSidebarModal={setChatSidebarModal}
                chatSidebarModal={chatSidebarModal}
                selectedChatName={selectedChatName}
                setSelectedChatName={setSelectedChatName}
                isAgentMode={isAgentMode}
                setIsAgentMode={setIsAgentMode}
                agentInfo={agentInfo}
                setAgentInfo={setAgentInfo}
                chatLoading={chatLoading}
                setChatLoading={setChatLoading}
              />
            </div>
          </div>
        )}
      </div>
    </>
  );
}
