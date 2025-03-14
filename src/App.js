import logo from "./logo.svg";
import "./App.css";
import LandingPage from "./components/Landing/LandingPage";
import LeftSidebar from "./components/LeftSidebar";
import LeftSection from "./components/LeftSection";
import { ArrowUp, Sparkles, User, X } from "lucide-react";
import MainPageTopBar from "./components/MainPageTopBar";
import MainPage from "./components/MainPage";
import { useEffect, useRef, useState } from "react";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { lexicalEdit } from "./utils/constant";
import { db } from "./firebase";
import {
  arrayRemove,
  arrayUnion,
  onSnapshot,
  serverTimestamp,
} from "firebase/firestore";
import firebase from "./firebase";
import TypingEffect from "./components/TypingEffect";
import Login from "./components/Landing/Login";
import CalenderView from "./components/CalenderView";
import AiWindowPopUp from "./components/AiWindowPopUp";
import Signup from "./components/Landing/Signup";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { useNavigate, useParams } from "react-router-dom";
import AppContainer from "./components/AppContainer";
import AdminPage from "./components/AdminPage";

function App() {
  const [theme, setTheme] = useState(false);
  const [isMinimise, setIsMinimise] = useState(false);
  const [selectedText, setSelectedText] = useState("");
  const [prompt, setPrompt] = useState("");
  const [subDivHeight, setSubDivHeight] = useState(0); // To store div's height
  const subDivRef = useRef(null); // Create a ref for the div
  const scrollToLast = useRef(null);
  const [fileStacked, setFileStacked] = useState(["Welcome to Obsidian"]);
  const [selected, setSelected] = useState(0);

  const [toggleAddEventModal, setToggleAddEventModal] = useState(false);
  const [month, setMonth] = useState("");
  const [year, setYear] = useState("");

  const [AiOutput, setAiOutput] = useState([
    //     {
    //       Section: "Change Format/Paragraph",
    //       Message: [
    //         `Welcome to AI Notes!  This powerful tool helps you effortlessly write, organize, and master your notes.  Forget cluttered thoughts and frantic searches – AI structures your ideas, finds anything instantly, and even provides summaries and key insights.  Access your secure and synced notes anytime, anywhere, across all your devices.  To begin, simply open a new tab.  Explore saved notes from the Files menu and leverage the AI assistant by highlighting text or typing commands like /summarize, /highlight, or /explain.  Rename and reorder tabs for optimal organization.  Enjoy features like multiple tabs, AI summaries, collaborative editing, and various export options.  Users save an average of two hours per week – imagine the possibilities!  Have questions? Our 24/7 chatbot is always ready to assist.  Start crafting brilliance now by opening a new tab!`,
    //         `Welcome to AI Notes! This intuitive tool empowers you to seamlessly write, organize, and conquer your notes.  Say goodbye to disorganized thoughts and frantic searching – AI structures your ideas, locates anything instantly, and even generates summaries and key takeaways.
    // Access your secure and synchronized notes anytime, anywhere, across all your devices. To get started, simply open a new tab. Explore existing notes from the Files menu and utilize the AI assistant by highlighting text or entering commands such as /summarize, /highlight, or /explain.
    // Rename and reorder tabs for maximum organization. Enjoy features like multiple tabs, AI summaries, shared editing, and various export options. Users report saving an average of two hours per week – imagine the potential!  Have any questions? Our 24/7 chatbot is always available to help. Begin creating brilliance now by opening a new tab!`,
    //       ],
    //     },
  ]);
  const [loading, setLoading] = useState(false);
  const [AiSection, setAiSection] = useState("");

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
  return (
    <>
      <div className="-z-30 left-0 top-0 fixed w-full h-[100svh] bg-[#F6F8FA]"></div>

      {/* <div
        className={
          "w-full h-[100svh] flex font-[geistRegular] pr-[7px] pb-[7px] z-10 backdrop-blur-xl overflow-hidden" +
          (theme ? " bg-[#161B1E]" : " bg-[#ffffff6e]")
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

        <LeftSection
          theme={theme}
          setTheme={setTheme}
          isMinimise={isMinimise}
          setIsMinimise={setIsMinimise}
          selected={selected}
          setSelected={setSelected}
          fileStacked={fileStacked}
          setFileStacked={setFileStacked}
        />
        <div
          className={
            " h-full flex flex-col " +
            (isMinimise
              ? " w-[calc((100%-50px)/1)]"
              : " w-[calc((100%-270px)/1)]")
          }
          style={{ transition: ".3s" }}
        >
          <MainPageTopBar
            theme={theme}
            setTheme={setTheme}
            fileStacked={fileStacked}
            setFileStacked={setFileStacked}
            selected={selected}
            setSelected={setSelected}
          />
          <div className="w-full h-[calc(100%-40px)] flex justify-start items-start font-[geistRegular]">
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
                AiOutput={AiOutput}
                setAiOutput={setAiOutput}
                loading={loading}
                setLoading={setLoading}
                AiSection={AiSection}
                setAiSection={setAiSection}
              />
            </div>
          </div>
        </div>
      </div> */}

      <Router>
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/user/login" element={<Login />} />
          <Route path="/user/signup" element={<Signup />} />
          <Route path="/user/welcomeUser/user" element={<AppContainer />} />
          <Route path="/admin" element={<AdminPage />} />
          {/* <Route path="/" element={<LandingPage />} />
          <Route path="/user" element={<UserLandingPage />} />
          <Route path="/partner" element={<PartnerLandingPage />} />
          
          <Route path="/partner/login" element={<PartnerLogin />} />
          <Route path="/partner/signup" element={<PartnerSignup />} />{" "}
          <Route
            path="/user/welcomeUser/:currSection"
            element={<UserLandingPage />}
          />
          <Route
            path="/partner/welcomePartner/:currSection"
            element={<PartnerLandingPage />}
          /> */}
        </Routes>
      </Router>
      {/* <div className="w-full h-[100svh] flex justify-center items-center font-[geistRegular]"> */}
      {/* <Login />  */}
      {/* <Signup /> */}
      {/* </div> */}
    </>
  );
}

export default App;

{
  /* <div className="w-[400px] h-full ">
              <div
                className={
                  "w-full h-full  rounded-r-lg flex p-[10px]" +
                  (theme ? " bg-[#1d2528]" : " bg-[#ffffff]")
                }
              >
                <div
                  className={
                    "w-full h-full rounded-lg flex flex-col justify-start items-start p-[10px] pr-[2px] " +
                    (theme ? " bg-[#161B1E]" : " bg-[#F8F8FB]")
                  }
                >
                  
                  <div
                    className={
                      "w-full h-[calc(100%-73px)] pr-[8px] overflow-y-scroll scroll-smooth flex flex-col justify-start items-start" +
                      (theme ? " darkScrollSecondary" : " lightScrollSecondary")
                    }
                    ref={scrollToLast}
                  >
                    {chat?.map((data, index) => {
                      return (
                        <>
                          <div
                            className={
                              "w-full flex h-auto justify-start items-start" +
                              (data?.sender == "user"
                                ? " flex-row-reverse"
                                : " flex-row")
                            }
                          >
                            <div
                              className={
                                "max-w-[90%] p-[10px] px-[0px] flex justify-start items-start" +
                                (data?.sender == "user"
                                  ? " flex-row-reverse bg-white rounded-xl"
                                  : " flex-row")
                              }
                            >
                              <div className="w-[35px] flex justify-start">
                                {data?.sender == "user" ? (
                                  <User
                                    width={18}
                                    height={18}
                                    strokeWidth={2.2}
                                    className=""
                                  />
                                ) : (
                                  <Sparkles
                                    width={18}
                                    height={18}
                                    strokeWidth={2.2}
                                    className=""
                                  />
                                )}
                              </div>
                              {data?.sender == "user" ? (
                                <>
                                  <pre className="max-w-[calc(100%-35px)] font-[geistRegular] text-[14px] whitespace-pre-wrap ">
                                    {data?.message}
                                  </pre>
                                </>
                              ) : (
                                <>
                                  <TypingEffect
                                    text={data?.message} // Adjust initial opacity if desired
                                  />
                                  <pre className="max-w-[calc(100%-35px)] font-[geistRegular] text-[14px] whitespace-pre-wrap">
                                    {data?.message}
                                  </pre> 
                                </>
                              )}
                            </div>
                          </div>
                        </>
                      );
                    })}
                    <div className="min-h-[50px]"></div>
                  </div>
                  <div className="w-full h-[50px] bg-gradient-to-t from-[#F8F8FB] to-[#F8F8FB00] mt-[-50px] "></div>
                  <div
                    ref={subDivRef}
                    className={
                      "w-[360px] bottom-[27px] boxShadowLight3 h-auto max-h-[250px] min-h-[40px]  rounded-md flex flex-col justify-end items-start fixed p-[15px]" +
                      (theme
                        ? " bg-[#273136] text-[#ffffff]"
                        : " bg-[white] text-[#000000]")
                    }
                    style={{ transition: ".3s" }}
                  >
                    <pre
                      className={
                        "w-full h-auto max-h-[100px] min-h-0 border-l-[4px]  text-[#d4d4d4] text-[14px] overflow-y-scroll p-[10px] py-[0px] whitespace-pre-wrap font-[geistRegular] ff" +
                        (selectedText?.length == 0
                          ? " mb-[0px]"
                          : " mb-[15px]") +
                        (theme
                          ? " border-[#313C40] text-[#d4d4d4]"
                          : " border-[#d4d4df] text-[#949393]")
                      }
                      style={{ transition: ".3s" }}
                    >
                      {selectedText}
                    </pre>
                    <div className="w-full flex justify-between items-end h-auto">
                      <textarea
                        className="w-[calc(100%-40px)]  h-auto max-h-[150px] min-h-[40px] bg-transparent   resize-none outline-none text-[14px] "
                        style={{ transition: ".3s" }}
                        placeholder="Enter prompt here ..."
                        value={prompt}
                        onInput={(e) => {
                          setPrompt(e.target.value);
                          e.target.style.height = "auto"; // Reset the height to auto to recalculate
                          e.target.style.height = `${e.target.scrollHeight}px`; // Set the height to the scroll height
                        }}
                      ></textarea>
                      <div
                        className={
                          "w-[30px] aspect-square rounded-full flex justify-center items-center  cursor-pointer z-40" +
                          (theme
                            ? " bg-[#3C474B] hover:bg-[#485559]"
                            : " bg-[#EAEBF4]")
                        }
                        onClick={() => {
                          setChat((prev) => [
                            ...prev,
                            {
                              sender: "user",
                              message: prompt,
                            },
                          ]);
                          run();
                        }}
                      >
                        <ArrowUp width={18} height={18} strokeWidth={2.5} />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div> */
}
