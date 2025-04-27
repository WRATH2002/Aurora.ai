import React from "react";
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

  // -------------------------------- Function to fetch Theme form Firebase  ## Called inside auth checking UseEffect
  function fetchTheme() {
    const user = firebase.auth().currentUser;
    const channelRef = db.collection("user").doc(user?.uid);
    onSnapshot(channelRef, (snapshot) => {
      setTheme(snapshot?.data()?.Theme);
    });
  }

  // -------------------------------- Checking for if the user is logged in or not
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

  // useEffect(() => {
  //   if (scrollToLast.current) {
  //     scrollToLast.current.scrollTop = scrollToLast.current.scrollHeight;
  //   }
  // }, []);

  // --------------------------- Fetching Theme ## Deprecated --> Called Above

  // useEffect(() => {
  //   function fetchTheme() {
  //     const user = firebase.auth().currentUser;
  //     const channelRef = db.collection("user").doc(user?.uid);
  //     onSnapshot(channelRef, (snapshot) => {
  //       setTheme(snapshot?.data()?.Theme);
  //     });
  //   }
  //   fetchTheme();
  // }, []);

  // ------------------------------- Setting the Browser theme color based on Theme for Android
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

  // const genAI = new GoogleGenerativeAI(process.env.REACT_APP_GEMINI_KEY);
  // const genAI = new GoogleGenerativeAI(
  //   "XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX"
  // );
  // const model = genAI.getGenerativeModel({
  //   model: "gemini-1.5-pro",
  // });

  // const generationConfig = {
  //   temperature: 1,
  //   top_p: 0.95,
  //   top_k: 64,
  //   max_output_tokens: 8192,
  //   response_mime_type: "text/plain",
  // };

  // async function run() {
  //   console.log("generating plan");
  //   const chatSession = model.startChat({
  //     generationConfig,
  //     // safetySettings: Adjust safety settings
  //     // See https://ai.google.dev/gemini-api/docs/safety-settings
  //     history: [],
  //   });

  //   const result = await chatSession.sendMessage(
  //     `
  //     ${prompt}`
  //   );
  //   console.log(result?.response?.text());
  //   setChat((prev) => [
  //     ...prev,
  //     { sender: "assistant", message: result?.response?.text() },
  //   ]);
  // }
  // const navigate = useNavigate();
  // function navigateToSection(section) {
  //   navigate(`/user/welcomeUser/${section}`);
  // }

  // const addToQueue = (noteId) => {
  //   setFetchNoteQueue((prevQueue) => [...prevQueue, noteId]); // Append to queue
  // };

  // useEffect(() => {
  //   console.log(selectedDoc);
  // }, [selectedDoc]);

  return (
    <>
      <div
        className={
          "w-full h-[100svh] flex font-[DMSr] pr-[0px] md:pr-[7px] lg:pr-[7px] pb-[7px] z-10 backdrop-blur-xl overflow-hidden" +
          (theme ? " bg-[#141414]" : " bg-[#f3f3f3]")
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

              <div className="w-full h-[calc(100%-102px)] md:h-[calc(100%-40px)] lg:h-[calc(100%-40px)] flex justify-start items-start font-[DMSr]">
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
              (theme ? " text-[#9ba6aa]" : " text-[#797979]")
            }
          >
            <div className="w-full h-[40px] hidden md:hidden lg:hidden"></div>
            <div
              className={
                "w-full h-full  rounded-lg flex justify-start items-start " +
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
              />
              <AiChatBot
                theme={theme}
                setChatSidebarModal={setChatSidebarModal}
                chatSidebarModal={chatSidebarModal}
                selectedChatName={selectedChatName}
                setSelectedChatName={setSelectedChatName}
              />
            </div>
          </div>
        )}
      </div>
    </>
  );
}
