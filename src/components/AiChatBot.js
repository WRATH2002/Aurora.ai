import {
  BrainCircuit,
  ChevronDown,
  Copy,
  Mic,
  RefreshCw,
  Send,
  Sparkles,
  ThumbsDown,
  ThumbsUp,
  Volume2,
  Files,
  Feather,
  FileCode,
  FileCode2,
  Code,
  FolderGit2,
  ConciergeBell,
  SignalHigh,
  WifiHigh,
  CornerDownRight,
  ChevronRight,
  CirclePlus,
  File,
  X,
  Check,
} from "lucide-react";
import React, { useRef, useState, useEffect } from "react";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { auth, db } from "../firebase";
import {
  arrayRemove,
  arrayUnion,
  onSnapshot,
  serverTimestamp,
} from "firebase/firestore";
import firebase from "../firebase";
import { onAuthStateChanged } from "firebase/auth";

import { zoomies } from "ldrs";
import { processStringDecrypt, processStringEncrypt } from "../utils/functions";
import { TextShimmer } from "./motion-animations/text-shimmer";
import { lineSpinner } from "ldrs";
import { ring2 } from "ldrs";
import { TextEffect, TextLoop } from "./motion-animations/text-effect";
import uplimg from "../assets/img/agriculture-farm-land-countryside-aerial-view-green-3200x2000-3985.jpg";
import uplimg2 from "../assets/img/macos-sequoia-4096x2264-17018.jpg";
import Prism from "prismjs";
import { ring } from "ldrs";
import {
  AiIdeaIcon,
  Alert02Icon,
  ArrowMoveDownRightIcon,
  Cancel01Icon,
  Copy01Icon,
  CursorMagicSelection02Icon,
  DocumentCodeIcon,
  FileAttachmentIcon,
  LinkBackwardIcon,
  Mic02Icon,
  NoodlesIcon,
  Pdf01Icon,
  QuoteDownIcon,
  SatelliteIcon,
  SentIcon,
  SwarmIcon,
  ThumbsDownIcon,
  ThumbsUpIcon,
  VolumeHighIcon,
} from "@hugeicons/core-free-icons";
// import { useRef } from "react";
// import html2pdf from "html2pdf.js";
import { HugeiconsIcon } from "@hugeicons/react";
import AIChatInfo from "./AIChatInfo";
import DownloadingToast, { APIErrorToast } from "../toast/DownloadingToast";
import { useNavigate } from "react-router-dom";

// Default values shown
ring.register();

// Default values shown

// import "../assets/style/prism-vsc-dark-plus.css";

ring2.register();
lineSpinner.register();
zoomies.register();

const aiModels = [
  {
    Model: "gemini-2.5-pro-preview-05-06",
    About: "Coding, reasoning, multimodal",
    limit: 1500,
    rpd: 25,
  },
  {
    Model: "gemini-2.5-pro-preview-05-06",
    About: "Coding, reasoning, multimodal",
    limit: 1500,
    rpd: 25,
  },
  {
    Model: "gemini-2.0-flash",
    About: "Multimodal, realtime streaming",
    limit: 1500,
    rpd: 1500,
  },
  {
    Model: "gemini-2.0-flash-lite",
    About: "Long context, realtime streaming",
    limit: 1500,
    rpd: 1500,
  },
  // {
  //   Model: "gemini-2.0-pro-exp-02-05",
  //   About: "Multimodal, realtime streaming",
  //   limit: 1500,rpd : 25,
  // },
  // {
  //   Model: "gemini-2.0-flash-thinking-exp-01-21",
  //   About: "Multimodal, reasoning, coding",
  //   limit: 1500,rpd : 25,
  // },
  {
    Model: "gemini-1.5-pro",
    About: "Long context, complex & math reasoning",
    limit: 50,
    rpd: 50,
  },
  {
    Model: "gemini-1.5-flash",
    About: "Image, video, audio understanding",
    limit: 1500,
    rpd: 1500,
  },
  {
    Model: "gemini-1.5-flash-8b",
    About: "Low latency, multilingual, summarization",
    limit: 1500,
    rpd: 1500,
  },
];

export default function AiChatBot(props) {
  // ----------------------------- State Variables Declared
  const divRef = useRef(null);
  const subDivRef = useRef(null);
  const [height, setHeight] = useState(0);
  const [subHeight, setSubHeight] = useState(0);
  const [message, setMessage] = useState("");
  const [showModels, setShowModels] = useState(false);
  const [loading, setLoading] = useState(false);
  const [currentModel, setCurrentModel] = useState("gemini-2.0-flash");
  const [chatHistory, setChatHistory] = useState([]);
  const [chatHistoryTemp, setChatHistoryTemp] = useState([]);
  const [activeApiKeyID, setActiveAPIKeyID] = useState("");
  const [replyMessageInfo, setReplyMessageInfo] = useState([]);
  const [downloadStarting, setDownloadStarting] = useState(false);
  const [downloadStartingSub, setDownloadStartingSub] = useState(false);
  const [wholeChatReference, setWholeChatReference] = useState();
  const [APIKeyInfo, setAPIKeyInfo] = useState({});
  const [isCopied, setIsCopied] = useState(false);
  const [APIError, setAPIError] = useState(false);
  const [APIErrorMessage, setAPIErrorMessage] = useState("false");
  const [filesInfo, setFilesInfo] = useState([]);

  // ----------------------------- For navigating to login page if not logged in
  const navigate = useNavigate();
  function navigateToSection() {
    navigate(`/user/login`);
  }

  // ----------------------------- For media links and info
  const handleFileChange = (e) => {
    const selectedFiles = Array.from(e.target.files);

    selectedFiles.forEach((file) => {
      const reader = new FileReader();

      reader.onloadend = () => {
        const isImage = file.type.startsWith("image/");
        const isDocument = file.type === "application/pdf" || !isImage;

        const fileData = {
          name: file.name,
          type: file.type,
          size: (file.size / 1024).toFixed(2) + " KB",
          src: reader.result, // base64 or blob URL
          idDocument: isDocument,
        };

        // If it's an image, we can extract dimensions
        if (isImage) {
          const img = new Image();
          img.src = reader.result;

          img.onload = () => {
            fileData.width = img.width;
            fileData.height = img.height;
            setFilesInfo((prev) => [...prev, fileData]);
          };
        } else {
          setFilesInfo((prev) => [...prev, fileData]);
        }
      };

      reader.readAsDataURL(file); // works for both images and docs
    });
  };

  // const [models, setModels] = useState([]);
  // const [error, setError] = useState(null);

  // ---------------------------- Technique to scroll down to the end in any Chat
  const lastElementRef = useRef(null);

  useEffect(() => {
    if (lastElementRef.current) {
      lastElementRef.current.scrollTop = lastElementRef.current.scrollHeight;
    }
  }, [chatHistoryTemp, props?.selectedChatName]);

  // ---------------------------- Checking if Logged In and then saving Active API Key ------------------------
  useEffect(() => {
    function ActiveApiKey() {
      const listen = onAuthStateChanged(auth, (user) => {
        if (user) {
          console.log("✔️ You'r logged in, taking you to the desired page.");
          const channelRef = db
            .collection("user")
            .doc(user?.uid)
            .collection("APIKeys")
            .doc("APIKeys");

          onSnapshot(channelRef, (snapshot) => {
            setActiveAPIKeyID(snapshot?.data()?.ActiveAPIKey);
          });
        } else {
          console.error("❌ You'r not logged in, Please login or signup.");
          navigateToSection();
        }
      });
    }
    console.log("⏳ Checking if you'r logged in or not");
    ActiveApiKey();
  }, []);

  // ---------------------------- Showing Active API Key ID - Encrypted
  useEffect(() => {
    if (activeApiKeyID.length > 0) {
      console.log("🗝️ Active API Key ID ------>");
      console.log(activeApiKeyID);
    }
  }, [activeApiKeyID]);

  // ---------------------------- Function to get formatted time ( dd/mm/yyyy ) for Chats Timing
  function getFormattedTime() {
    const now = new Date();
    let hours = now.getHours();
    const minutes = now.getMinutes();
    const period = hours >= 12 ? "pm" : "am";

    hours = hours % 12 || 12; // Convert 0 to 12 for 12-hour format
    return `${hours}:${minutes.toString().padStart(2, "0")} ${period}`;
  }

  // ---------------------------- Function to get current Date & Time for normal usage like creating or deletion time
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

  // ---------------------------- Function to fetch API Key Info (Usage Data) from Firebase
  useEffect(() => {
    function fetchAPIKeyInfoFromFirebase() {
      const user = firebase.auth().currentUser;

      const channelRef = db
        .collection("user")
        .doc(user?.uid)
        .collection("APIKeys")
        .doc("APIKey_" + activeApiKeyID);

      onSnapshot(channelRef, (snapshot) => {
        setAPIKeyInfo({
          CurrentDate: snapshot?.data()?.CurrentDate,
          CurrentUsage: snapshot?.data()?.CurrentUsage,
          RequestInADay: snapshot?.data()?.RequestInADay,
          TotalTokens: snapshot?.data()?.TotalTokens,
        });

        if (
          snapshot?.data()?.CurrentDate !=
          new Date().getDate() +
            "/" +
            parseInt(parseInt(new Date().getMonth()) + 1) +
            "/" +
            new Date().getFullYear()
        ) {
          db.collection("user")
            .doc(user?.uid)
            .collection("APIKeys")
            .doc("APIKey_" + activeApiKeyID)
            .update({
              CurrentDate:
                new Date().getDate() +
                "/" +
                parseInt(parseInt(new Date().getMonth()) + 1) +
                "/" +
                new Date().getFullYear(),
              CurrentUsage: 0,
              RequestInADay: [],
            });
        }
      });
    }
    if (activeApiKeyID.length > 0) {
      fetchAPIKeyInfoFromFirebase();
    }
  }, [activeApiKeyID, currentModel]);

  // ---------------------------- Function to fetch normal / agent chats history from Firebase
  useEffect(() => {
    function fetchChatsFromFirebase() {
      const user = firebase.auth().currentUser;
      if (props?.isAgentMode) {
        const channelRef = db
          .collection("user")
          .doc(user?.uid)
          .collection("AIAgents")
          .doc(props?.selectedChatName);

        onSnapshot(channelRef, (snapshot) => {
          setChatHistoryTemp((prev) => snapshot?.data()?.chats);
          props?.setChatLoading((prev) => false);
          console.log(snapshot?.data()?.chats);
        });
      } else {
        const channelRef = db
          .collection("user")
          .doc(user?.uid)
          .collection("AIChats")
          .doc(props?.selectedChatName);

        onSnapshot(channelRef, (snapshot) => {
          setChatHistoryTemp((prev) => snapshot?.data()?.chats);
          props?.setChatLoading((prev) => false);
          console.log(snapshot?.data()?.chats);
        });
      }
    }
    if (props?.selectedChatName.length > 0) {
      fetchChatsFromFirebase();
    }
  }, [props?.selectedChatName]);

  // ---------------------------- Consoling if chat is loading or not
  useEffect(() => {
    if (props?.selectedChatName?.length > 0) {
      if (props?.chatLoading) {
        console.log("⏳ Please wait while your chat is loading !");
      } else {
        console.log("⏳ Chat has been loaded");
      }
    }
  }, [props?.chatLoading]);

  // ---------------------------- Function to store user prompt object in Firebase
  function storeToFirebase(data, path) {
    const user = firebase.auth().currentUser;
    if (props?.agentInfo?.length > 0) {
      db.collection("user")
        .doc(user?.uid)
        .collection("AIAgents")
        .doc(path)
        .update({
          chats: arrayUnion(data),
        });
    } else {
      db.collection("user")
        .doc(user?.uid)
        .collection("AIChats")
        .doc(path)
        .update({
          chats: arrayUnion(data),
        });
    }
    console.log("📥 Chat has been stored to database.");
  }

  // ---------------------------- Function to store first user prompt object to new created chat space
  function storeToFirebaseAutoCreateChatSpace(data, path) {
    const user = firebase.auth().currentUser;
    db.collection("user")
      .doc(user?.uid)
      .collection("AIChats")
      .doc(path)
      .update({
        chats: arrayUnion(data),
      });

    console.log("📥 Chat has been stored to database.");
  }

  // --------------------------- Function to get the first 7 words from prompt for new chat space name
  function getFirst7Words(text) {
    const cleanText = text.replace(/[^\w\s]/gi, "");

    const words = cleanText.trim().split(/\s+/);
    if (words.length <= 7) {
      return cleanText.trim();
    }
    return words.slice(0, 7).join(" ");
  }

  // --------------------------- Function to create user prompt object
  function addUserMessage(text) {
    if (props?.selectedChatName.length == 0) {
      // ---- Condition if a New Chat Space
      let tempTime = getCurrentDateTime();
      const user = firebase.auth().currentUser;
      const chatRef2 = db
        .collection("user")
        .doc(user?.uid)
        .collection("AIChats")
        .doc(getFirst7Words(text))
        .set({
          chats: [],
        });

      chatRef2.then(() => {
        // console.log("Chat space is created, ready to use !");

        let tempData = chatHistory;
        let tempObj = {
          Message: text,
          Date:
            new Date().getDate() +
            "/" +
            (parseInt(new Date().getMonth()) + 1) +
            "/" +
            new Date().getFullYear(),
          Time: getFormattedTime(),
          Sender: "User",
        };
        tempData.push(tempObj);
        storeToFirebaseAutoCreateChatSpace(tempObj, getFirst7Words(text));
        run(text, [], getFirst7Words(text));
        props?.setSelectedChatName(getFirst7Words(text));
        setMessage("");
      });

      const chatRef1 = db
        .collection("user")
        .doc(user?.uid)
        .collection("AIChats")
        .doc("AllAIChats")
        .update({
          AllChatName: arrayUnion(getFirst7Words(text)),
          AllChatNameInfo: arrayUnion({
            ChatName: getFirst7Words(text),
            CreationDate: tempTime.Date,
            CreationTime: tempTime.Time,
            isSecured: false,
            PIN: "",
          }),
        });
      chatRef1.then(() => {
        // console.log("Chat is added to all chats !");
      });
    } else {
      // ---- Condition if not a New Chat Space
      let tempData = chatHistory;
      let tempObj;
      if (props?.agentInfo?.length > 0) {
        // ---- Creating user prompt object for Agent Chat
        tempObj = {
          Message: text,
          Date:
            new Date().getDate() +
            "/" +
            (parseInt(new Date().getMonth()) + 1) +
            "/" +
            new Date().getFullYear(),
          Time: getFormattedTime(),
          Sender: "User",
          Model: currentModel,
        };
      } else {
        // ---- Creating user prompt object for Normal Chat
        tempObj = {
          Message: text,
          Date:
            new Date().getDate() +
            "/" +
            (parseInt(new Date().getMonth()) + 1) +
            "/" +
            new Date().getFullYear(),
          Time: getFormattedTime(),
          Sender: "User",
          isReplied: replyMessageInfo.length > 0 ? true : false,
          RepliedMessage:
            replyMessageInfo.length > 0 ? replyMessageInfo[0]?.repliedText : "",
          Model: currentModel,
        };
      }
      tempData.push(tempObj);
      storeToFirebase(tempObj, props?.selectedChatName); // ---- Storing user prompt to firebase
      run(text, formatMessages(tempData), props?.selectedChatName); // ---- Calling function to generate response
      setMessage(""); // ---- Setting everything to normal
      setReplyMessageInfo([]); // ---- Setting everything to normal
    }
  }

  // --------------------------- Function to format chats to give it to Gemini Model as Chat History
  function formatMessages(messages) {
    return messages.map((message) => ({
      role: message.Sender === "User" ? "user" : "model", // Use "assistant" as the standard role for models/bots.
      parts: [{ text: message.Message }],
    }));
  }

  // --------------------------- Function to convert all the media to base64 to send it to Gemini model
  async function fileToGenerativePart(file) {
    const base64EncodedDataPromise = new Promise((resolve) => {
      const reader = new FileReader();
      reader.onloadend = () => resolve(reader.result.split(",")[1]);
      reader.readAsDataURL(file);
    });

    return {
      inlineData: {
        data: await base64EncodedDataPromise,
        mimeType: file.type,
      },
    };
  }

  // --------------------------- Dynamically changing the gemini model based on changes in active API Key and Agent Chats
  const [model, setModel] = useState();

  useEffect(() => {
    const genAI = new GoogleGenerativeAI(processStringDecrypt(activeApiKeyID));
    if (props?.agentInfo.length > 0) {
      setModel(
        genAI.getGenerativeModel({
          model: currentModel,
          systemInstruction: {
            parts: [{ text: props?.agentInfo[0]?.Description }],
          },
        })
      );
    } else {
      setModel(
        genAI.getGenerativeModel({
          model: currentModel,
        })
      );
    }
  }, [props?.agentInfo, activeApiKeyID, currentModel]);

  // const model = genAI.getGenerativeModel({
  //   model: currentModel,
  //       systemInstruction: {
  //         parts: [
  //           {text: `whatever asked to you should naswer in format like

  //   Question: <question>
  //   Answer: <answer>
  //   Time : india time`},
  //         ],
  //       },
  // });

  // const modelConfig = {
  //   model: currentModel,
  // };

  // // Conditionally add system instruction
  // if (props?.isAgentMode) {
  //   modelConfig.systemInstruction = {
  //     parts: [
  //       {
  //         text: props?.agentInfo?.Description, // `data` should be defined before this
  //       },
  //     ],
  //   };
  // }

  // // Initialize model
  // const model = genAI.getGenerativeModel(modelConfig);

  const generationConfig = {
    temperature: 1,
    top_p: 0.95,
    top_k: 40,
    max_output_tokens: 8192,
    response_mime_type: "text/plain",
  };

  // ----------------------------- Function to generate AI response for the given Prompt
  async function run(text, data, path) {
    console.log("⏳ Please wait ! Gemini is generating response.");

    const chatSession = model.startChat({
      generationConfig,
      history: data,
    });

    let tempPrompt = text;

    let isDocumentAttach = false;

    if (filesInfo.length > 0) {
      isDocumentAttach = true;
    } else {
      isDocumentAttach = false;
    }

    // ------------------

    // Combine the prompt and all file parts
    let allParts;
    if (filesInfo.length > 0) {
      const fileInputEl = document.querySelector("input[type=file]");
      const files = [...fileInputEl.files];

      // Prepare all image parts (with async conversion)
      const imageParts = await Promise.all(files.map(fileToGenerativePart));
      if (replyMessageInfo.length > 0) {
        allParts = [replyMessageInfo[0]?.replyText + tempPrompt, ...imageParts];
      } else {
        allParts = [tempPrompt, ...imageParts];
      }
    } else {
      if (replyMessageInfo.length > 0) {
        allParts = replyMessageInfo[0]?.replyText + tempPrompt;
      } else {
        allParts = tempPrompt;
      }
    }
    // const allParts = [prompt, ...imageParts];

    try {
      const result = await chatSession.sendMessage(allParts);

      setFilesInfo([]);

      // -------------------

      // const result = await chatSession.sendMessage(tempPrompt);

      console.log("✨ Gemini generated response ------>");
      //   console.log(result);
      console.log(result.response.text());
      setLoading(false);
      //   setRes(result.response.text());
      setChatHistory((prev) => [
        ...prev,
        {
          Message: result.response.text(),
          Date:
            new Date().getDate() +
            "/" +
            (parseInt(new Date().getMonth()) + 1) +
            "/" +
            new Date().getFullYear(),
          Time: getFormattedTime(),
          Sender: "Assistant",
          Model: currentModel,
        },
      ]);

      storeToFirebase(
        {
          Message: result.response.text(),
          Date:
            new Date().getDate() +
            "/" +
            (parseInt(new Date().getMonth()) + 1) +
            "/" +
            new Date().getFullYear(),
          Time: getFormattedTime(),
          Sender: "Assistant",
          Model: currentModel,
        },
        path
      );

      // ----------------------- Recording model calls in API for Model Usage

      const user = firebase.auth().currentUser;
      db.collection("user")
        .doc(user?.uid)
        .collection("APIKeys")
        .doc("APIKey_" + activeApiKeyID)
        .update({
          RequestInADay: arrayUnion({
            model: currentModel,
            time:
              new Date().getHours() +
              " " +
              new Date().getMinutes() +
              " " +
              new Date().getSeconds(),
          }),
        });
    } catch (error) {
      console.error("🚨 Some error occured while generating response.", error);

      // Optional: Handle specific error types or show user-friendly messages
      if (error.message.includes("quota")) {
        // alert("You've exceeded your daily quota for the Gemini API.");
        setAPIErrorMessage("quota");
      } else {
        // alert("Something went wrong. Please try again later.");
        setAPIErrorMessage("error");
      }

      setLoading(false);
      setAPIError((prev) => true);
      setTimeout(() => {
        setAPIError((prev) => false);
        setAPIErrorMessage("");
      }, 10000);
    }

    // const result = await chatSession.sendMessage(allParts);

    // setFilesInfo([]);

    // // -------------------

    // // const result = await chatSession.sendMessage(tempPrompt);

    // console.log("Recieved Answer --->");
    // //   console.log(result);
    // console.log(result.response.text());
    // setLoading(false);
    // //   setRes(result.response.text());
    // setChatHistory((prev) => [
    //   ...prev,
    //   {
    //     Message: result.response.text(),
    //     Date:
    //       new Date().getDate() +
    //       "/" +
    //       (parseInt(new Date().getMonth()) + 1) +
    //       "/" +
    //       new Date().getFullYear(),
    //     Time: getFormattedTime(),
    //     Sender: "Assistant",
    //   },
    // ]);

    // storeToFirebase(
    //   {
    //     Message: result.response.text(),
    //     Date:
    //       new Date().getDate() +
    //       "/" +
    //       (parseInt(new Date().getMonth()) + 1) +
    //       "/" +
    //       new Date().getFullYear(),
    //     Time: getFormattedTime(),
    //     Sender: "Assistant",
    //   },
    //   path
    // );
  }

  useEffect(() => {
    const updateHeight = () => {
      if (divRef.current) {
        setHeight(divRef.current.clientHeight);
      }
    };

    updateHeight(); // Get initial height

    window.addEventListener("resize", updateHeight); // Update on resize

    return () => {
      window.removeEventListener("resize", updateHeight); // Cleanup
    };
  }, []);

  useEffect(() => {
    const updateHeight = () => {
      if (subDivRef.current) {
        setSubHeight(subDivRef.current.clientHeight);
      }
    };

    updateHeight(); // Get initial height

    window.addEventListener("resize", updateHeight); // Update on resize

    return () => {
      window.removeEventListener("resize", updateHeight); // Cleanup
    };
  }, []);

  // ---------------------------- Variables for dynamic theme change for code blocks -------------------

  const [theme_CodeSnippetBorder, setTheme_CodeSnippetBorder] =
    useState("#eaeaea");
  const [theme_LanguageBorder, setTheme_LanguageBorder] = useState("#424242");
  const [theme_CopyBGHover, setTheme_CopyBGHover] = useState("#000000");
  const [theme_TextColorPrimary, setTheme_TextColorPrimary] =
    useState("#000000");
  const [theme_TextColorSecondary, setTheme_TextColorSecondary] =
    useState("#5c5c5c");
  const [theme_CodeSnippetBackground, setTheme_CodeSnippetBackground] =
    useState("#f7f7f7");
  const [theme_CodeSnippetForeground, setTheme_CodeSnippetForeground] =
    useState("#f7f7f7");
  const [theme_CodeSnippetScrollbar, setTheme_CodeSnippetScrollbar] =
    useState("snippetScrollLight");
  const [theme_CodeText, setTheme_CodeText] = useState("#ececec");

  // ------------------------------ Changing the value based on theme --------------------

  useEffect(() => {
    setTheme_TextColorPrimary(props?.theme ? "#ffffff" : "#000000");
    setTheme_TextColorSecondary(props?.theme ? "#dddddd" : "#5c5c5c");
    setTheme_CodeSnippetForeground(props?.theme ? "#1a1a1a" : "#ffffff");
    setTheme_CodeSnippetBackground(props?.theme ? "#222222" : "#F6F6F6");
    setTheme_CodeSnippetBorder(props?.theme ? "#383838" : "#eaeaea");
    setTheme_LanguageBorder(props?.theme ? "#dfdfdf" : "#424242");
    setTheme_CodeText(props?.theme ? "#2e2e2e" : "#ececec");
    setTheme_CopyBGHover(props?.theme ? "#383838" : "#ececec");
    setTheme_CodeSnippetScrollbar(
      props?.theme ? "snippetScrollDark" : "snippetScrollLight"
    );
  }, [props?.theme]);

  function printt() {
    console.log("clickeddddd");
  }

  // ----------------------------- Function to format and structure the data recieved from Gemini API -------------

  function formatText(text, props) {
    let codeBlocks = [];
    let placeholder = "__CODE_BLOCK__";

    // Step 1: Extract and replace code blocks with placeholders
    text = text?.replace(/```(.*?)```/gs, (match, p1) => {
      if (p1.trim() === "") return "";

      const lines = p1.trim().split("\n");
      const firstLine = lines[0].trim();
      const hasLanguage =
        !firstLine.includes("{") && /^[a-z]+$/i.test(firstLine); // language like `javascript`, `python`, etc.
      const language = hasLanguage ? firstLine.toLowerCase() : "";
      const codeLines = hasLanguage ? lines.slice(1) : lines;

      // Determine minimum indentation
      const minIndentation = Math.min(
        ...codeLines
          .filter((line) => line.trim() !== "")
          .map((line) => {
            const match = line.match(/^\s*/);
            return match ? match[0].length : 0;
          })
      );

      // Remove minimum indentation
      const code = codeLines
        .map((line) => line.slice(minIndentation))
        .join("\n");

      // Conditionally render language header if language exists
      const header = language
        ? `<div class=" w-full h-[45px] flex justify-between items-center px-[18px] pr-[8px] rounded-t-xl  "><div class=" flex flex-col justify-start items-center w-auto h-full overflow-visible">
      <pre class="min-h-full flex justify-center items-center " style="color : ${theme_LanguageBorder};">${language}</pre>
      <div class=" w-[100%] min-h-[3px] rounded-full mt-[-1.5px] z-30 " style="background : ${theme_LanguageBorder}" ></div></div><button class="p-[5px] rounded-lg flex justify-end hover:bg-[${theme_CopyBGHover}] items-center hover:text-[${theme_TextColorPrimary}] " style="color: ${theme_TextColorSecondary}; border : 1.5px solid ${theme_CodeSnippetBorder}; "   ><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="18" height="18" color="#000000" fill="none">
    <path d="M9 15C9 12.1716 9 10.7574 9.87868 9.87868C10.7574 9 12.1716 9 15 9L16 9C18.8284 9 20.2426 9 21.1213 9.87868C22 10.7574 22 12.1716 22 15V16C22 18.8284 22 20.2426 21.1213 21.1213C20.2426 22 18.8284 22 16 22H15C12.1716 22 10.7574 22 9.87868 21.1213C9 20.2426 9 18.8284 9 16L9 15Z" stroke="#000000" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"></path>
    <path d="M16.9999 9C16.9975 6.04291 16.9528 4.51121 16.092 3.46243C15.9258 3.25989 15.7401 3.07418 15.5376 2.90796C14.4312 2 12.7875 2 9.5 2C6.21252 2 4.56878 2 3.46243 2.90796C3.25989 3.07417 3.07418 3.25989 2.90796 3.46243C2 4.56878 2 6.21252 2 9.5C2 12.7875 2 14.4312 2.90796 15.5376C3.07417 15.7401 3.25989 15.9258 3.46243 16.092C4.51121 16.9528 6.04291 16.9975 9 16.9999" stroke="#000000" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"></path>
</svg></button></div>`
        : "";

      const body = language
        ? `<pre class="p-[18px] w-full text-left overflow-x-scroll ${theme_CodeSnippetScrollbar}" style="border-top : 1.5px solid ${theme_CodeSnippetBorder}; background : ${theme_CodeSnippetForeground};"><code class="language-${language}">${escapeHtml(
            code
          )}</code></pre>`
        : `<pre class="p-[18px] py-[13px] w-full text-left overflow-x-scroll ${theme_CodeSnippetScrollbar}" style=" background : ${theme_CodeSnippetForeground};"><code class="language-${"plaintext"}">${escapeHtml(
            code
          )}</code></pre>`;

      const formattedCode = `<div class=" overflow-hidden rounded-2xl flex flex-col justify-start items-start p-0 w-full h-auto whitespace-pre-wrap " style="border : 1.5px solid ${theme_CodeSnippetBorder}; background : ${theme_CodeSnippetBackground} ; color : ${theme_TextColorPrimary};">${header}
      ${body}</div>`;

      codeBlocks.push(formattedCode);
      return placeholder;
    });

    // Step 2: Apply text formatting (only on non-code text)

    // // Quote
    // text = text?.replace(
    //   /> ([^\s].*?)(?=\n|$)/g,
    //   `<div class="w-full h-auto border-l-[2px] border-[#c7c7c7] pl-[15px]"><span class="quote whitespace-pre-wrap" style="color: gray; font-style: italic;">$1</span></div>`
    // );

    // ---------------------------- Underline
    // text = text?.replace(/<u>(.*?)<\/u>/g, "<u>$1</u>");
    text = text?.replace(
      /(`[^`]*`)|<u>(.*?)<\/u>|<u>(.*?)<\/u>/g,
      (match, backtickText, underlineText1, underlineText2) => {
        if (backtickText) {
          // it's inside backticks — return as-is
          return backtickText;
        } else if (underlineText1) {
          // real underline tag (not in backticks) — convert to styled span
          return `<span class="underline">${underlineText1}</span>`;
        } else if (underlineText2) {
          // plain <u> tag not in backticks — escape so it prints as text
          return escapeHtml(match);
        }
        return match;
      }
    );

    // --------------------------- Bold and Italics text formatting
    // text = text?.replace(/\*\*\*(.*?)\*\*\*/g, `<b>$1</b>`);
    // text = text?.replace(
    //   /`[^`]*`|\*\*\*(\S(?:.*?\S)?)\*\*\*/g,
    //   (match, code, boldItalics) => {
    //     if (code) {
    //       return match;
    //     } else {
    //       return `<b>${boldItalics}</b>`;
    //     }
    //   }
    // );

    // --------------------------- Bold text formatting
    // text = text?.replace(/\*\*(.*?)\*\*/g, `<b>$1</b>`);
    text = text?.replace(
      /(`[^`]*`)|\*\*(\S(?:.*?\S)?)\*\*/gs,
      (match, code, boldText) => {
        if (code) {
          return match; // If it's inside backticks, return it as is
        } else {
          return `<b>${boldText}</b>`; // If not, apply bold formatting
        }
      }
    );

    // ----------------------------- Italics text formatting
    // text = text?.replace(/\*(.*?)\*/g, `<i>$1</i>`);
    // |_(\S(?:.*?\S)?)_   ---> alternate part creating problem, seek solution later _ before /gs
    // text = text?.replace(
    //   /(`[^`]*`)|\*(\S(?:.*?\S)?)\*/gs,
    //   (match, code, italicText) => {
    //     if (code) {
    //       return match; // If it's inside backticks, return it as is
    //     } else {
    //       return `<i>${italicText}</i>`; // If not, apply italic formatting
    //     }
    //   }
    // );
    text = text?.replace(
      /\\\*(.*?)\\\*|(`[^`]*`)|\*(\S(?:.*?\S)?)\*/gs,
      (match, escapedAsterisk, code, italicText) => {
        if (escapedAsterisk) {
          // If it's like \*This is not italic\*, remove the backslashes and asterisks
          return `*${escapedAsterisk}*`;
        } else if (code) {
          return match; // If it's inside backticks, return it as is
        } else {
          return `<i>${italicText}</i>`; // If not, apply italic formatting
        }
      }
    );

    // ------------------- Strikethrough replacement
    // text = text?.replace(
    //   /~~(.*?)~~/g,
    //   `<span style="text-decoration: line-through;">$1</span>`
    // );
    text = text?.replace(/(`[^`]*`)|~~(.*?)~~/gs, (match, code, strikeText) => {
      if (code) return code;
      if (strikeText) {
        return `<span style="text-decoration: line-through;">${strikeText}</span>`;
      }
      return match;
    });

    // ----------------------------------------------------------------------------------------------

    // Bullet point replacement
    text = text?.replace(
      /\* (?!\* |$)/g,
      `<span class = "bullete1 whitespace-pre-wrap">•</span>`
    );
    // text = text?.replace(/(`[^`]*`)|\* (?!\* |$)/g, (match, code) => {
    //   if (code) {
    //     return match; // Preserve code blocks
    //   } else {
    //     return `<span class="bullete1 whitespace-pre-wrap">•</span>`;
    //   }
    // });

    // // Bullet point type-2 replacement
    // text = text.replace(
    //   /\- (?!\- |$)/g,
    //   `<span class = "bullete2 whitespace-pre-wrap">◦</span>`
    // );

    // // Bullet point type-3 replacement
    // text = text.replace(
    //   /\+ (?!\+ |$)/g,
    //   `<span class = "bullete3 whitespace-pre-wrap">▪</span>`
    // );

    // ----------------------------- Qoutes should be here

    // ----------------------------- Header 6 formatting
    // text = text?.replace(
    //   /###### (.*?)(?=\n|$)/g,
    //   `<b class="he3" style="font-size: 16px; font-family:geistSemibold">$1</b>`
    // );
    text = text?.replace(
      /(`[^`]*`)|###### (.*?)(?=\n|$)/g,
      (match, code, headingText) => {
        if (code) {
          return match; // return as-is if inside backticks
        } else {
          return `<b class="he3" style="font-size: 18px; font-family:geistBold">${headingText}</b>`;
        }
      }
    );

    // ----------------------------- Header 5 formatting
    // text = text?.replace(
    //   /##### (.*?)(?=\n|$)/g,
    //   `<b class="he3" style="font-size: 16px; font-family:geistSemibold">$1</b>`
    // );
    text = text?.replace(
      /(`[^`]*`)|##### (.*?)(?=\n|$)/g,
      (match, code, headingText) => {
        if (code) {
          return match; // return as-is if inside backticks
        } else {
          return `<b class="he3" style="font-size: 23px; font-family:geistBold">${headingText}</b>`;
        }
      }
    );

    // ----------------------------- Header 4 formatting
    // text = text?.replace(
    //   /#### (.*?)(?=\n|$)/g,
    //   `<b class="he3" style="font-size: 16px; font-family:geistSemibold">$1</b>`
    // );
    text = text?.replace(
      /(`[^`]*`)|#### (.*?)(?=\n|$)/g,
      (match, code, headingText) => {
        if (code) {
          return match; // return as-is if inside backticks
        } else {
          return `<b class="he3" style="font-size: 28px; font-family:geistBold">${headingText}</b>`;
        }
      }
    );

    // ----------------------------- Header 3 formatting
    // text = text?.replace(
    //   /### (.*?)(?=\n|$)/g,
    //   `<b class="he3" style="font-size: 18px; font-family:geistSemibold">$1</b>`
    // );
    text = text?.replace(
      /(`[^`]*`)|### (.*?)(?=\n|$)/g,
      (match, code, headingText) => {
        if (code) {
          return match; // return as-is if inside backticks
        } else {
          return `<b class="he3" style="font-size: 33px; font-family:geistBold">${headingText}</b>`;
        }
      }
    );

    // ----------------------------- Header 2 formatting
    // text = text?.replace(
    //   /## (.*?)(?=\n|$)/g,
    //   `<b class="he2" style="font-size: 24px; font-family:geistSemibold">$1</b>`
    // );
    text = text?.replace(
      /(`[^`]*`)|## (.*?)(?=\n|$)/g,
      (match, code, headingText) => {
        if (code) {
          return match; // return as-is if inside backticks
        } else {
          return `<b class="he3" style="font-size: 38px; font-family:geistBold">${headingText}</b>`;
        }
      }
    );

    // ----------------------------- Header 1 formatting
    // text = text?.replace(
    //   /# (.*?)(?=\n|$)/g,
    //   `<b class="he1" style="font-size: 30px; font-family:geistBold">$1</b>`
    // );
    text = text?.replace(
      /(`[^`]*`)|# (.*?)(?=\n|$)/g,
      (match, code, headingText) => {
        if (code) {
          return match; // return as-is if inside backticks
        } else {
          return `<b class="he3" style="font-size: 43px; font-family:geistBold">${headingText}</b>`;
        }
      }
    );

    // // ----------------------------- URL formatting
    // text = text?.replace(
    //   /(https:\/\/[^\s]+)/g,
    //   `<a href="$1" class="bold" target="_blank">$1</a>`
    // );

    // ----------------------------- Horizontal Rule
    text = text?.replace(
      /(`[^`]*`)|^(?:\s*)(---|\*\*\*|___)(?:\s*)$/gm,
      (match, code, hrText) => {
        if (code) {
          return match; // Leave as-is if inside backticks
        } else {
          return `<hr class = " my-[10px] " ></hr>`; // Replace with horizontal rule
        }
      }
    );

    text = text?.replace(
      /```([\s\S]*?)```/g,
      (match) => `\`\`\`${match.slice(3, -3)}\`\`\`` // Preserve code blocks
    );

    // --------------------------- Table Formatting
    text = text?.replace(
      /\n\|(.+?)\|\n\|(-+\|?)+\n((\|.*?\|\n)+)/g,
      (match, headers, separator, rows) => {
        // Convert headers into <th> elements, filtering out empty values
        const headerCells = headers
          .split("|")
          .map((h) => h.trim()) // Trim spaces
          .filter((h) => h.length > 0) // Remove empty columns
          .map(
            (h) =>
              `<th style="background-color: ${theme_CodeSnippetBackground}; padding: 7px 13px; border: 1.5px solid ${theme_CodeSnippetBorder}; text-align: left; font-family: 'GeistMedium'; display: table-cell; vertical-align: top;">${h}</th>`
          )
          .join("");

        // Convert each row into <tr> and <td> elements, filtering out empty values
        const rowCells = rows
          .trim()
          .split("\n")
          .map(
            (row) =>
              `<tr>${row
                .split("|")
                .map((cell) => cell.trim()) // Trim spaces
                .filter((cell) => cell.length > 0) // Remove empty columns
                .map(
                  (cell) =>
                    `<td style="padding: 7px 13px; border: 1.5px solid ${theme_CodeSnippetBorder}; text-align: left; display: table-cell; vertical-align: top; max-width: 100%; word-wrap: break-word;">${cell}</td>`
                )
                .join("")}</tr>`
          )
          .join("");

        // Generate final table HTML with proper outer border and responsive width
        return `<div class="w-full max-width:[100%] overflow-x:scroll " style=" overflow: hidden;"><table class="mt-[8px] ; min-width: 0px; border-collapse: collapse; width: 100%; max-width: 100%; min-width: 100%; border-radius: 13px; "><thead><tr>${headerCells}</tr></thead><tbody>${rowCells}</tbody></table></div>`;
      }
    );

    // -------------------------- Inline code formatting
    // text = text?.replace(
    //   /`([^`]+)`/g,
    //   (match, p1) =>
    //     `<code class="bg-[#4D505685] font-[rr] text-center px-[6px] py-[2px] rounded-[4px]" style="background : ${theme_CodeText};">${escapeHtml(
    //       p1
    //     )}</code>`
    // );

    // -------------------------- Inline code formatting
    text = text?.replace(
      /(```[\s\S]*?```)|(`{2})([\s\S]*?)\2|(`)([^`\n]*?)\4/g,
      (match, tripleBacktick, double, doubleContent, single, singleContent) => {
        if (tripleBacktick) {
          // Rule 1: Ignore triple backtick block
          return match;
        } else if (double) {
          // Rule 3: Format double backtick content (can include ` inside)
          return `<code class=" font-[DMSr] text-center px-[6px] py-[2px] rounded-[4px]" style="background : ${theme_CodeText};">${escapeHtml(
            doubleContent
          )}</code>`;
        } else if (single) {
          // Rule 2: Format only if no leading/trailing space
          if (!/^\s|\s$/.test(singleContent)) {
            return `<code class=" font-[DMSr] text-center px-[6px] py-[2px] rounded-[4px]" style="background : ${theme_CodeText};">${escapeHtml(
              singleContent
            )}</code>`;
          } else {
            return match; // Contains space — leave as is
          }
        }
        return match;
      }
    );

    // Step 3: Restore the formatted code blocks back
    let i = 0;
    text = text?.replace(new RegExp(placeholder, "g"), () => codeBlocks[i++]);

    return text;
  }

  // ----------------------------- Helper function to escape HTML ---------------------------

  function escapeHtml(unsafe) {
    return unsafe
      ?.replace(/&/g, "&amp;")
      ?.replace(/</g, "&lt;")
      ?.replace(/>/g, "&gt;")
      ?.replace(/"/g, "&quot;")
      ?.replace(/'/g, "&#039;");
  }

  // ----------------------------- Applying code theme colour to code snippets --------------

  // useEffect(() => {
  //   Prism.highlightAll();
  // });

  function copyToClipboard(text) {
    // const text = "Add note at cursor location";
    navigator.clipboard
      .writeText(text)
      .then(() => {
        console.log("🔗 Text copied to clipboard");
      })
      .catch((err) => {
        console.error("🚨 Failed to copy text to clipboard : ", err);
      });
  }

  const [selection, setSelection] = useState("");
  const [toolbarPos, setToolbarPos] = useState({ x: 0, y: 0 });
  const [showToolbar, setShowToolbar] = useState(false);

  const handleMouseUp = () => {
    const sel = window.getSelection();
    const text = sel.toString().trim();

    if (text.length > 0) {
      const range = sel.getRangeAt(0);
      const clonedRange = range.cloneRange();
      clonedRange.collapse(true);

      const rect = clonedRange.getBoundingClientRect();

      // Check if selection is inside an AI generated chat div
      let node = sel.anchorNode;
      if (node && node.nodeType === 3) {
        // If it's a text node, get its parent
        node = node.parentNode;
      }

      const isInsideAIGenerated = node?.closest(".AIGeneratedChat");

      if (isInsideAIGenerated) {
        setToolbarPos({
          x: rect.left + window.scrollX,
          y: rect.top + window.scrollY - 35,
        });

        setSelection(text);
        setShowToolbar(true);
      } else {
        setShowToolbar(false);
      }
    } else {
      setShowToolbar(false);
    }
  };

  const handleButtonClick = () => {
    //     console.log("Button clicked");
    //     console.log(`I have selected this earlier message from the chat to reply to :
    // ${selection}

    // I am replying with :
    // `);
    setReplyMessageInfo([
      {
        replyText: `I have selected this earlier message from the chat to reply to : 
${selection}

I am replying with : 
`,
        repliedText: selection,
      },
    ]);
    setShowToolbar(false);
  };

  useEffect(() => {
    document.addEventListener("mouseup", handleMouseUp);

    const handleSelectionChange = () => {
      const text = window.getSelection()?.toString().trim();
      if (!text) {
        setShowToolbar(false);
      }
    };

    document.addEventListener("selectionchange", handleSelectionChange);

    return () => {
      document.removeEventListener("mouseup", handleMouseUp);
      document.removeEventListener("selectionchange", handleSelectionChange);
    };
  }, []);

  const handleDownload = async (data) => {
    // const element = contentRef.current;
    const html2pdf = await require("html2pdf.js");
    console.log("Starting download...");
    setDownloadStarting((prev) => true);
    setDownloadStartingSub((prev) => true);

    const options = {
      margin: [0.5, 0.5, 0.5, 0.5], // Top, left, bottom, right in inches
      filename: `Aurora_${props?.selectedChatName}_Chat.pdf`,
      image: { type: "jpeg", quality: 1 },

      html2canvas: { scale: 3, useCORS: true },
      jsPDF: { unit: "in", format: "a4", orientation: "portrait" },
      pagebreak: { mode: ["avoid-all", "css", "legacy"] },
    };

    html2pdf()
      .set(options)
      .from(data)
      .toPdf()
      .get("pdf")
      .then(() => {
        console.log("⬇️ PDF Download started.");
        setDownloadStarting((prev) => false);

        setTimeout(() => {
          setDownloadStartingSub((prev) => false);
        }, 3000);
      })
      .save();
  };

  function getChatRef() {
    setWholeChatReference(
      document.querySelector(".chatMessageParentContainer")
    );
  }

  useEffect(() => {
    getChatRef();
  }, [chatHistoryTemp]);

  function isScrolledToEnd() {
    return (
      lastElementRef.scrollHeight - lastElementRef.scrollTop <=
      lastElementRef.clientHeight + 1
    );
  }

  return (
    <>
      {downloadStartingSub ? (
        <DownloadingToast
          downloadStarting={downloadStarting}
          downloadStartingSub={downloadStartingSub}
          setDownloadStarting={setDownloadStarting}
          setDownloadStartingSub={setDownloadStartingSub}
        />
      ) : (
        <></>
      )}
      <APIErrorToast
        currentModel={currentModel}
        APIError={APIError}
        setAPIError={setAPIError}
        APIErrorMessage={APIErrorMessage}
        setAPIErrorMessage={setAPIErrorMessage}
      />
      {/* {!props?.chatLoading ? (<>
      <div className="w-full h-full flex justify-center items-center bg-white"></div></>) : (<></>)} */}
      {showToolbar && (
        <div
          className={
            "absolute group rounded-full w-[45px] h-[33px] flex flex-col justify-end items-center border-[1px] " +
            (props?.theme
              ? " bg-[#373737] border-[#464646]"
              : " bg-[#ffffff] hover:bg-[#fbfbfb] border-[#d7d7d7]")
          }
          style={{
            // position: "absolute",
            top: toolbarPos.y - 5,
            left: toolbarPos.x,
            // backgroundColor: "#333",
            // color: "#fff",
            // padding: "6px 12px",
            // borderRadius: "6px",
            zIndex: 1000,
            boxShadow: "0px 4px 8px rgba(0,0,0,0.2)",
          }}
        >
          <div
            className={
              "hidden group-hover:flex justify-center items-center rounded-[9px] mb-[3px] text-[12px] px-[8px] py-[3px] cursor-default" +
              (props?.theme
                ? " bg-[#363636] text-[#ededed]"
                : " bg-[black] text-[#ffffff]")
            }
            style={{ boxShadow: "0px 3px 2px rgba(0,0,0,0.1)" }}
          >
            Reply
          </div>
          <button
            className="w-full min-h-full flex justify-center items-center "
            onClick={() => {
              handleButtonClick();
            }}
          >
            <HugeiconsIcon
              className={
                " cursor-pointer " +
                (props?.theme ? " text-[#ffffff]" : " text-[#000000]")
              }
              // onClick={() => {}}
              icon={QuoteDownIcon}
              size={14}
              strokeWidth={2.5}
            />
          </button>
        </div>
      )}
      <div
        className={
          " pb-[10px] md:pb-[30px] lg:pb-[30px] pt-[0px] md:pt-[0px] lg:pt-[0px] h-full flex flex-col justify-center items-center font-[DMSr]" +
          (props?.theme ? " text-[#ffffff]" : " text-[#000000]") +
          (props?.chatSidebarModal
            ? " w-full md:w-[calc(100%-250px)] lg:w-[calc(100%-250px)]"
            : " w-full md:w-[100%] lg:w-[100%]")
        }
        style={{ transition: ".3s" }}
        // onClick={() => {
        //   setShowModels(false);
        // }}
      >
        {chatHistoryTemp?.length > 0 ? (
          <>
            <AIChatInfo
              theme={props?.theme}
              isAgentMode={props?.isAgentMode}
              agentInfo={props?.agentInfo}
              selectedChatName={props?.selectedChatName}
              downloadStarting={downloadStarting}
              downloadStartingSub={downloadStartingSub}
              setDownloadStarting={setDownloadStarting}
              setDownloadStartingSub={setDownloadStartingSub}
              chatReference={wholeChatReference}
              APIKeyInfo={APIKeyInfo}
              setAPIKeyInfo={setAPIKeyInfo}
              currentModel={currentModel}
              activeApiKeyID={activeApiKeyID}
              setChatSidebarModal={props?.setChatSidebarModal}
              chatSidebarModal={props?.chatSidebarModal}
            />
            <div
              ref={lastElementRef}
              className={
                "w-full  h-[calc(100%-50px)] flex flex-col justify-end items-center overflow-y-scroll pt-[20px] md:pt-[30px] lg:pt-[30px] pl-[5px]" +
                (props?.theme ? " chatScrollDark" : " chatScrollLight")
              }
              onScroll={() => {
                setShowToolbar(false);
                // if(isScrolledToEnd()){
                //   console.log("End of the chat")
                // }else{
                //   console.log("In between the chat")
                // }
              }}
            >
              {props?.chatLoading ? (
                <>
                  <div className="w-[calc(100%-35px)] md:w-[calc(100%-35px)] lg:w-[60%] h-full pb-[190px] flex flex-col justify-center items-center z-0 ">
                    <l-ring
                      size="25"
                      stroke="3"
                      bg-opacity="0"
                      speed="2"
                      color="black"
                    ></l-ring>
                  </div>
                </>
              ) : (
                <>
                  <div className="w-[calc(100%-35px)] md:w-[calc(100%-35px)] lg:w-[60%] h-full flex flex-col justify-start items-start z-0 chatMessageParentContainer">
                    {chatHistoryTemp?.map((data, index) => {
                      return (
                        <>
                          {index == 0 ? (
                            <div className="w-full mb-[40px] flex justify-center items-center">
                              <div
                                className={
                                  "w-full border-b-[1.5px]" +
                                  (props?.theme
                                    ? " border-[#262626d1]"
                                    : " border-[#f1f1f1d0]")
                                }
                              ></div>
                              <div
                                className={
                                  "flex justify-center items-center whitespace-nowrap px-[15px] py-[10px] rounded-lg text-[12px] tracking-wider uppercase font-[DMSr]" +
                                  (props?.theme
                                    ? " bg-[#1A1A1A] text-[#5b5b5b]"
                                    : " bg-[#ffffff] text-[#a8a8b1]")
                                }
                              >
                                Start of Conversation
                              </div>
                              <div
                                className={
                                  "w-full border-b-[1.5px]" +
                                  (props?.theme
                                    ? " border-[#262626d1]"
                                    : " border-[#f1f1f1d0]")
                                }
                              ></div>
                            </div>
                          ) : (
                            <></>
                          )}
                          {index != 0 &&
                          chatHistoryTemp[index - 1].Date !== data?.Date ? (
                            <div className="w-full my-[40px] flex justify-center items-center">
                              <div
                                className={
                                  "w-full border-b-[1.5px]" +
                                  (props?.theme
                                    ? " border-[#262626d1]"
                                    : " border-[#f1f1f1d0]")
                                }
                              ></div>
                              <div
                                className={
                                  "flex justify-center items-center px-[15px] py-[10px] rounded-lg text-[12px] tracking-wider" +
                                  (props?.theme
                                    ? " bg-[#1A1A1A] text-[#5b5b5b]"
                                    : " bg-[#ffffff] text-[#a8a8b1]")
                                }
                              >
                                {data?.Date ==
                                new Date().getDate() +
                                  "/" +
                                  (parseInt(new Date().getMonth()) + 1) +
                                  "/" +
                                  new Date().getFullYear() ? (
                                  <>TODAY</>
                                ) : (
                                  <>{data?.Date}</>
                                )}
                              </div>
                              <div
                                className={
                                  "w-full border-b-[1.5px]" +
                                  (props?.theme
                                    ? " border-[#262626d1]"
                                    : " border-[#f1f1f1d0]")
                                }
                              ></div>
                            </div>
                          ) : (
                            <></>
                          )}
                          <div
                            className={
                              "w-full justify-end items-start " +
                              (data?.isReplied && data?.Sender == "User"
                                ? " flex"
                                : " hidden")
                            }
                          >
                            <div
                              className={
                                "w-auto flex justify-start items-start p-[15px] text-[13px] font-[DMSr] text-[#818181]"
                              }
                            >
                              <div className="w-[30px] mr-[0px] flex justify-start items-center">
                                <HugeiconsIcon
                                  className="mt-[3px] rotate-180"
                                  icon={LinkBackwardIcon}
                                  size={14}
                                  strokeWidth={1}
                                  fill="#818181"
                                />
                              </div>
                              <pre className="w-[calc(100%-30px)] whitespace-pre-wrap text-ellipsis overflow-hidden line-clamp-3  bg-[white] font-[DMSr]">
                                {data?.RepliedMessage}
                              </pre>
                            </div>
                          </div>
                          <div
                            key={index}
                            className={
                              "w-full flex justify-start items-start" +
                              (data?.Sender == "User"
                                ? " flex-row-reverse"
                                : " flex-row")
                            }
                          >
                            <div
                              className={
                                " chatMessageContainer rounded-2xl flex flex-col justify-start items-start mb-[20px] " +
                                (data?.Sender == "User"
                                  ? props?.theme
                                    ? " bg-[#222222] p-[15px] px-[20px] max-w-[80%] md:max-w-[70%] lg:max-w-[70%]  w-auto"
                                    : " bg-[#f7f7f7] p-[15px] px-[20px] max-w-[80%] md:max-w-[70%] lg:max-w-[70%]  w-auto"
                                  : " bg-transparent px-[0px] w-full")
                              }
                            >
                              {data?.Sender == "User" &&
                              chatHistoryTemp[index + 1]?.Sender == "User" ? (
                                <HugeiconsIcon
                                  className="text-[#EF4153] ml-[-23px] mt-[-18px] mb-[4px]"
                                  icon={Alert02Icon}
                                  size={16}
                                  strokeWidth={1.8}
                                />
                              ) : (
                                <></>
                              )}
                              <div className="flex justify-start items-center">
                                <span
                                  className={
                                    "font-[DMSb]" +
                                    (props?.theme
                                      ? " text-[white]"
                                      : " text-[black]")
                                  }
                                >
                                  {data?.Sender == "User" ? <>Me</> : <>AI</>}{" "}
                                </span>{" "}
                                <span
                                  className={
                                    "text-[12px] flex justify-center items-center font-[DMSm]" +
                                    (props?.theme
                                      ? " text-[#5b5b5b]"
                                      : " text-[#a8a8b1]")
                                  }
                                >
                                  <span className="mx-[8px] text-[15px] flex justify-center items-center">
                                    •
                                  </span>
                                  <span className="">{data?.Time}</span>
                                </span>
                              </div>
                              {/* <div className="h-[100px] mt-[8px] flex justify-start items-start">
                            <img
                              className="h-full aspect-square rounded-[4px] object-cover"
                              src={uplimg}
                            ></img>
                            <div className="h-full ml-[3px] flex flex-col justify-start items-start">
                              <img
                                className="h-[calc((100%-3px)/2)] aspect-square rounded-[4px] object-cover mb-[3px]"
                                src={uplimg}
                              ></img>
                              <img
                                className="h-[calc((100%-3px)/2)] aspect-square rounded-[4px] object-cover"
                                src={uplimg2}
                              ></img>
                            </div>
                          </div> */}

                              {data?.Sender == "User" ? (
                                <>
                                  <pre
                                    className=" chatMessage mt-[8px] font-[DMSr] leading-[25px] whitespace-pre-wrap w-full "
                                    // dangerouslySetInnerHTML={{
                                    //   __html: formatText(data?.Message),
                                    // }}
                                  >
                                    {data?.Message?.trim()}
                                  </pre>
                                  {/* <div className="rounded-[14px] my-[5px] px-[6px] h-[30px] bg-[#ef41521d] flex justify-start items-center">
                                    <HugeiconsIcon
                                      className="text-[#EF4153] mr-[5px]"
                                      icon={Alert02Icon}
                                      size={16}
                                      strokeWidth={1.8}
                                    />
                                    <span className="text-[12px]">Error</span>
                                  </div> */}
                                </>
                              ) : (
                                <>
                                  <pre
                                    data-index={index}
                                    className={
                                      " chatMessage mt-[8px] mb-[10px] font-[DMSr] leading-[28px] whitespace-pre-wrap w-full AIGeneratedChat" +
                                      (props?.theme
                                        ? " text-[#e0e0e0]"
                                        : " text-[black]")
                                    }
                                    dangerouslySetInnerHTML={{
                                      __html: formatText(data?.Message),
                                    }}
                                  ></pre>
                                </>
                              )}
                              <div
                                className={
                                  "w-full  justify-between items-center mt-[8px]" +
                                  (data?.Sender == "User" ? " hidden" : " flex")
                                }
                              >
                                <div
                                  className=" w-full flex justify-start items-center"
                                  data-html2canvas-ignore
                                >
                                  <div className="group max-h-[28px] max-w-[100px] flex flex-col justify-start items-start  overflow-visible mr-[10px] ">
                                    <div
                                      className={
                                        " flex justify-center items-center min-h-[28px] rounded-full  px-[10px] cursor-context-menu min-w-[100px] whitespace-nowrap text-[12px]" +
                                        (props?.theme
                                          ? " bg-[#222222]"
                                          : " bg-[#ffffff]")
                                      }
                                      onClick={() => {
                                        // fetchAvailableModels();
                                      }}
                                    >
                                      {Math.round(
                                        parseInt(
                                          data?.Message.length +
                                            chatHistoryTemp[index - 1]?.Message
                                              .length
                                        ) / 4
                                      )}{" "}
                                      tokens
                                    </div>{" "}
                                    <div
                                      className={
                                        "hidden mt-[5px] whitespace-nowrap group-hover:flex flex-col  justify-center items-start rounded-[9px]  text-[12px] px-[8px] py-[3px] cursor-default" +
                                        (props?.theme
                                          ? " bg-[#363636] text-[#ededed]"
                                          : " bg-[black] text-[#ffffff]")
                                      }
                                      style={{
                                        boxShadow:
                                          "0px 1px 4px rgba(0,0,0,0.2)",
                                        zIndex: 1000,
                                      }}
                                    >
                                      <span className="flex justify-start items-center whitespace-nowrap">
                                        Tokens used :{" "}
                                        {Math.round(
                                          parseInt(
                                            data?.Message.length +
                                              chatHistoryTemp[index - 1]
                                                ?.Message.length
                                          ) / 4
                                        )}{" "}
                                        tokens
                                      </span>
                                      <span className="flex justify-start items-center whitespace-nowrap">
                                        Model used :{" "}
                                        {data?.Model ? (
                                          <>{data?.Model}</>
                                        ) : (
                                          <>
                                            <HugeiconsIcon
                                              className="ml-[3px]"
                                              icon={SatelliteIcon}
                                              size={13}
                                              strokeWidth={1.8}
                                            />
                                          </>
                                        )}
                                      </span>
                                    </div>
                                  </div>
                                  <div className="group max-h-[28px] max-w-[28px] flex flex-col justify-start items-center  overflow-visible mr-[2px] ">
                                    <div className="min-h-[28px] min-w-[28px] rounded-md hover:bg-[#f0f0f0] text-[#5D5D5D] cursor-pointer flex justify-center items-center ">
                                      <HugeiconsIcon
                                        icon={VolumeHighIcon}
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
                                        boxShadow:
                                          "0px 1px 4px rgba(0,0,0,0.2)",
                                        zIndex: 1000,
                                      }}
                                    >
                                      Read aloud
                                    </div>
                                  </div>
                                  <div
                                    className={
                                      "group max-h-[28px] max-w-[28px] flex flex-col justify-start items-center  overflow-visible mr-[2px] " +
                                      (chatHistoryTemp.length - 1 == index
                                        ? " flex"
                                        : " hidden")
                                      //   +
                                      //   (isLiked == "like" || isLiked.length == 0
                                      //     ? " flex"
                                      //     : " hidden")
                                    }
                                  >
                                    <div
                                      className={
                                        "min-h-[28px] min-w-[28px] rounded-md hover:bg-[#f0f0f0] text-[#5D5D5D] cursor-pointer justify-center items-center  flex"
                                        //   +
                                        //   (isLiked == "like" || isLiked.length == 0
                                        //     ? " flex"
                                        //     : " hidden")
                                      }
                                      onClick={() => {
                                        //   setIsLiked("like");
                                      }}
                                    >
                                      <HugeiconsIcon
                                        icon={ThumbsUpIcon}
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
                                        boxShadow:
                                          "0px 1px 4px rgba(0,0,0,0.2)",
                                        zIndex: 1000,
                                      }}
                                    >
                                      Good response
                                    </div>
                                  </div>
                                  <div
                                    className={
                                      "group max-h-[28px] max-w-[28px] flex flex-col justify-start items-center  overflow-visible mr-[2px] " +
                                      (chatHistoryTemp.length - 1 == index
                                        ? " flex"
                                        : " hidden")
                                      //   +
                                      //   (isLiked == "dislike" || isLiked.length == 0
                                      //     ? " flex"
                                      //     : " hidden")
                                    }
                                  >
                                    <div
                                      className={
                                        "min-h-[28px] min-w-[28px] rounded-md hover:bg-[#f0f0f0] text-[#5D5D5D] cursor-pointer justify-center items-center flex "
                                        //   +
                                        //   (isLiked == "dislike" || isLiked.length == 0
                                        //     ? " flex"
                                        //     : " hidden")
                                      }
                                      onClick={() => {
                                        //   setIsLiked("dislike");
                                      }}
                                    >
                                      <HugeiconsIcon
                                        icon={ThumbsDownIcon}
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
                                        boxShadow:
                                          "0px 1px 4px rgba(0,0,0,0.2)",
                                        zIndex: 1000,
                                      }}
                                    >
                                      Bad response
                                    </div>
                                  </div>
                                  <div className="group max-h-[28px] max-w-[28px] flex flex-col justify-start items-center  overflow-visible ">
                                    <div
                                      className="min-h-[28px] min-w-[28px] rounded-md hover:bg-[#f0f0f0] text-[#5D5D5D] cursor-pointer flex justify-center items-center"
                                      onClick={(e) => {
                                        // handleCopyClick(index)
                                        const preInsideDiv =
                                          document.querySelectorAll(
                                            ".chatMessageContainer"
                                          );
                                        console.log(preInsideDiv);
                                        // handleDownload(preInsideDiv[index]);
                                        if (index > 0) {
                                          const container =
                                            document.createElement("div");
                                          const wrapper1 =
                                            document.createElement("div");
                                          wrapper1.className =
                                            "w-full flex justify-end items-start";
                                          wrapper1.appendChild(
                                            preInsideDiv[index - 1].cloneNode(
                                              true
                                            )
                                          );

                                          container.appendChild(wrapper1);
                                          container.appendChild(
                                            preInsideDiv[index].cloneNode(true)
                                          );

                                          handleDownload(container);
                                        } else {
                                          // Just pass the current if there's no previous one
                                          handleDownload(preInsideDiv[index]);
                                        }
                                      }}
                                    >
                                      <HugeiconsIcon
                                        icon={Pdf01Icon}
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
                                        boxShadow:
                                          "0px 1px 4px rgba(0,0,0,0.2)",
                                        zIndex: 1000,
                                      }}
                                    >
                                      Download PDF
                                    </div>
                                  </div>
                                  <div className="group max-h-[28px] max-w-[28px] flex flex-col justify-start items-center  overflow-visible ">
                                    <div
                                      className="min-h-[28px] min-w-[28px] rounded-md hover:bg-[#f0f0f0] text-[#5D5D5D] cursor-pointer flex justify-center items-center"
                                      onClick={(e) => {
                                        // handleCopyClick(index)
                                        const preInsideDiv =
                                          document.querySelectorAll(
                                            ".chatMessageContainer .chatMessage"
                                          );
                                        setIsCopied(true);
                                        setTimeout(() => {
                                          setIsCopied(false);
                                        }, 1000);
                                        copyToClipboard(
                                          preInsideDiv[index].innerText
                                          // preInsideDiv[index]
                                        );
                                        console.log(preInsideDiv[index]);
                                      }}
                                    >
                                      <HugeiconsIcon
                                        icon={Copy01Icon}
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
                                        boxShadow:
                                          "0px 1px 4px rgba(0,0,0,0.2)",
                                        zIndex: 1000,
                                      }}
                                    >
                                      Copy
                                    </div>
                                  </div>
                                  <div
                                    className={
                                      "h-[28px] ml-[4px] bg-[#f0f0f0] text-[#000000] px-[10px] flex justify-center items-center rounded-md" +
                                      (isCopied ? " opacity-100" : " opacity-0")
                                    }
                                    style={{ transition: ".2s" }}
                                  >
                                    Copied
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                        </>
                      );
                    })}
                    {/* <div
                // key={index}
                className={
                  "w-full justify-start items-start" +
                  (!loading ? " flex" : " hidden")
                }
              >
                <div
                  className={
                    " rounded-xl flex flex-col justify-start items-start p-[15px] mb-[20px] bg-transparent px-[0px] w-full"
                  }
                >
                  <div className="flex justify-start items-center mb-[8px]">
                    <span className="font-[geistSemibold]">AI</span>{" "}
                    <span
                      className={
                        "text-[12px] flex justify-center items-center font-[geistMedium]" +
                        (props?.theme ? " text-[#9ba6aa]" : " text-[#a8a8b1]")
                      }
                    >
                      <span className="mx-[8px] text-[15px] flex justify-center items-center">
                        •
                      </span>
                      03:23_am
                    </span>
                  </div>
                  

                  <div className="flex justify-start items-center">
                    <l-line-spinner
                      size="17"
                      stroke="1.4"
                      speed="1"
                      color="black"
                    ></l-line-spinner>
                    <TextShimmer
                      className="ml-[8px] font-[DMSr]"
                      duration={1}
                    >
                      Generating response ...
                    </TextShimmer>
                  </div>
                </div>
              </div> */}

                    <div
                      // ref={lastElementRef}
                      className="w-full min-h-[calc(100%-300px)]"
                    ></div>
                  </div>
                </>
              )}
            </div>
            <div
              className={
                "fixed justify-center items-center bottom-[193px] md:bottom-[168px] lg:bottom-[168px] z-50  " +
                (loading ? " flex" : " hidden") +
                (props?.chatSidebarModal
                  ? " w-full md:w-[calc(100%-290px)] lg:w-[calc(100%-290px)]"
                  : " w-full md:w-[calc(100%-40px)] lg:w-[calc(100%-40px)]")
              }
            >
              <div
                className={
                  "flex justify-start items-center py-[7px] px-[10px] rounded-lg border-[1.5px]" +
                  (props?.theme
                    ? " bg-[#222222] border-[#292a2d] text-[white]"
                    : " bg-[#f7f7f7] border-[#f2f2f2] text-[black")
                }
              >
                <l-line-spinner
                  size="17"
                  stroke="1.4"
                  speed="1"
                  color={` ${props?.theme ? "#ffffff" : "#000000"}`}
                ></l-line-spinner>

                <TextShimmer
                  theme={props?.theme}
                  className="ml-[8px] font-[DMSr]"
                  duration={1}
                >
                  Generating response ...
                </TextShimmer>
              </div>
            </div>
            <div
              className={
                "min-w-[calc(100%-18px)] min-h-[120px] max-h-[300px] h-auto flex justify-center items-end z-40 " +
                (props?.theme ? " bg-[#1a1a1a]" : " bg-[#ffffff]")
              }
              style={{ marginTop: `-${subHeight}px` }}
            >
              <div
                className={
                  "w-[calc(100%-40px)] md:w-[calc(100%-40px)] lg:w-[60%] h-auto min-h-[120px] max-h-[300px]  rounded-2xl border-[1.5px]  flex flex-col justify-between items-start p-[4px] pt-[0px] z-40  " +
                  (props?.theme
                    ? " bg-[#222222] border-[#292a2d]"
                    : " bg-[#f7f7f7] border-[#f0f0f0]")
                }
                // style={{ height: `${height}px` }}
                ref={subDivRef}
              >
                <div className="w-full flex justify-between items-center h-[40px] px-[9px] py-[4px]">
                  <div className="flex justify-start items-center h-full overflow-x-scroll overflow-y-visible uploadScroll">
                    <div className="max-h-full flex flex-col justify-end items-center overflow-y-visible group">
                      <div
                        className={
                          "hidden group-hover:flex fixed mb-[20px] ml-[-7px] justify-center items-center rounded-[9px]  text-[12px] px-[8px] py-[3px] cursor-default" +
                          (props?.theme
                            ? " bg-[#363636] text-[#ededed]"
                            : " bg-[black] text-[#ffffff]")
                        }
                        style={{ boxShadow: "0px 1px 4px rgba(0,0,0,0.2)" }}
                      >
                        Add photos & files
                      </div>
                      <label
                        className={
                          "cursor-pointer min-h-full " +
                          (props?.theme
                            ? " text-[#8f8f8f] hover:text-[#ffffff]"
                            : " text-[#878787] hover:text-[#000000]")
                        }
                        for="image-file-input"
                      >
                        <CirclePlus
                          width={16}
                          height={16}
                          strokeWidth={2}
                          className=" mr-[9px]"
                        />
                        <input
                          id="image-file-input"
                          className="hidden"
                          type="file"
                          multiple
                          accept="*"
                          onChange={(e) => {
                            handleFileChange(e);
                          }}
                        />
                      </label>
                    </div>{" "}
                    {filesInfo.length > 0 ? (
                      <>
                        {filesInfo?.map((data, index) => {
                          return (
                            <>
                              {data?.idDocument ? (
                                <>
                                  <div
                                    className={
                                      "flex justify-start items-center max-w-[150px]  h-full  rounded-[8px] px-[6px] " +
                                      (index == 0
                                        ? " ml-[0px] "
                                        : " ml-[6px] ") +
                                      (props?.theme
                                        ? " bg-[#000000] border-[#000000] text-[#ffffff]"
                                        : " bg-[white] border-[#f2f2f2] text-[#000000]")
                                    }
                                  >
                                    <div className="w-[20px] flex justify-start items-center mr-[2px]">
                                      <File
                                        width={16}
                                        height={16}
                                        strokeWidth={1.6}
                                        className=""
                                      />
                                    </div>
                                    <div className="flex flex-col justify-center items-start h-full w-[calc(100%-22px)]">
                                      <span
                                        className={
                                          "w-full overflow-hidden text-ellipsis text-[12px]" +
                                          (props?.theme
                                            ? " text-[#ffffff]"
                                            : " text-[#000000]")
                                        }
                                      >
                                        {data?.name}
                                      </span>
                                      <span
                                        className={
                                          "text-[10px] mt-[-4px]" +
                                          (props?.theme
                                            ? " text-[#ffffff]"
                                            : " text-[#727272]")
                                        }
                                      >
                                        .{data?.type?.split("/")?.pop()}
                                      </span>
                                    </div>
                                  </div>
                                  <div className="h-full flex justify-start items-start overflow-y-visible z-50">
                                    <div
                                      className={
                                        "w-[12px] h-[12px] ml-[6px] mt-[-6px] rounded-full flex justify-center items-center border-[0px]" +
                                        (props?.theme
                                          ? " bg-[#ffffff] text-[black] border-[#ffffff]"
                                          : " bg-[#000000] text-[white] border-[#000000]")
                                      }
                                    >
                                      <X
                                        width={8}
                                        height={8}
                                        strokeWidth={4}
                                        className=""
                                      />
                                    </div>
                                  </div>
                                </>
                              ) : (
                                <>
                                  <div
                                    className={
                                      "flex justify-start items-start h-full rounded-[8px] " +
                                      (index == 0 ? " ml-[0px] " : " ml-[6px] ")
                                    }
                                  >
                                    <img
                                      className="h-full aspect-square rounded-[8px] object-cover blur-[0px]"
                                      src={data?.src}
                                      alt="img"
                                    ></img>
                                  </div>
                                </>
                              )}
                            </>
                          );
                        })}
                      </>
                    ) : (
                      <></>
                    )}
                  </div>
                </div>
                <div
                  className={
                    "w-full h-auto rounded-[12px]  p-[13px] pt-[10px] flex flex-col justify-start items-start " +
                    (props?.theme ? " bg-[#1A1A1A]" : " bg-[#ffffff]")
                  }
                >
                  <div
                    className={
                      "w-[calc(100%+6px)] ml-[-3px] text-[12px] rounded-t-[6px] rounded-b-[3px] mb-[10px] h-auto  justify-start items-start p-[10px]" +
                      (props?.theme
                        ? " bg-[#222222] text-[#949494]"
                        : " bg-[#F7F7F7] text-[#747474]") +
                      (replyMessageInfo.length > 0 ? " flex" : " hidden")
                    }
                  >
                    <div
                      className={
                        "w-[25px] flex justify-start items-start" +
                        (props?.theme ? " text-[#afafaf]" : " text-[#454545]")
                      }
                    >
                      {/* <HugeiconsIcon
                        className={" cursor-pointer "}
                        // onClick={() => {}}
                        icon={ArrowMoveDownRightIcon}
                        size={14}
                        strokeWidth={2.5}
                      /> */}
                      <HugeiconsIcon
                        className="mt-[3px] rotate-180"
                        icon={LinkBackwardIcon}
                        size={14}
                        strokeWidth={1}
                        fill="#454545"
                      />
                    </div>
                    <pre className="w-[calc(100%-50px)] whitespace-pre-wrap font-[DMSr] text-ellipsis overflow-hidden line-clamp-2 ">
                      {replyMessageInfo[0]?.repliedText}
                    </pre>
                    <div
                      className={
                        "w-[25px] flex justify-end items-start" +
                        (props?.theme
                          ? " text-[#cacaca] hover:text-[#ffffff]"
                          : " text-[#454545] hover:text-[#000000]")
                      }
                      onClick={() => {
                        setReplyMessageInfo([]);
                      }}
                    >
                      <HugeiconsIcon
                        className={" cursor-pointer "}
                        // onClick={() => {}}
                        icon={Cancel01Icon}
                        size={14}
                        strokeWidth={2.5}
                      />
                    </div>
                  </div>
                  <textarea
                    className="w-full h-auto min-h-[100%] max-h-[100px] pt-[0px] outline-none bg-transparent  resize-none"
                    // style={{ transition: ".2s" }}
                    placeholder={
                      props?.agentInfo.length > 0
                        ? props?.agentInfo[0]?.Placeholder + " ..."
                        : "Type your message ..."
                    }
                    value={message}
                    onInput={(e) => {
                      setMessage(e.target.value);
                      // setHeight()

                      e.target.style.height = "auto"; // Reset the height to auto to recalculate
                      e.target.style.height = `${e.target.scrollHeight}px`; // Set the height to the scroll height
                    }}
                    onKeyDown={(e) => {
                      if (e.key === "Enter" && !e.shiftKey) {
                        e.preventDefault(); // Prevent new line
                        if (message?.trim().length > 0) {
                          addUserMessage(message);
                          setLoading(true);
                          e.target.style.height = "auto";
                        }
                      }
                    }}
                    onScroll={() => {
                      setShowModels(false);
                    }}
                  ></textarea>
                  <div className=" w-full h-[42px] mt-[8px] rounded-[10px] flex justify-between items-end ">
                    <div className="group h-full flex flex-col justify-end items-start overflow-visible max-w-[200px] font-[DMSr]">
                      <div
                        className={
                          "w-auto max-w-[400px] md:max-w-[400px] lg:max-w-[400px]  rounded-[10px] p-[7px]  border-[1.5px] pr-[4px] flex flex-col justify-start items-start backdrop-blur-[20px] boxShadowLight0 " +
                          (showModels
                            ? " opacity-100 mb-[6px] z-10 h-[230px]"
                            : " opacity-0 mb-[-26px] -z-20 h-[130px]") +
                          (props?.theme
                            ? " bg-[#181b20]"
                            : " bg-[#ffffffc4] border-[#f0f0f0]")
                        }
                        style={{ transition: ".2s" }}
                      >
                        <div
                          className={
                            "w-full h-full flex flex-col justify-start items-start overflow-y-scroll modelScrollDark pr-[3px]" +
                            (props?.theme
                              ? " modelScrollDark"
                              : " modelScrollLight")
                          }
                        >
                          {aiModels?.map((data, index) => {
                            return (
                              <span
                                key={index}
                                className={
                                  "group h-auto p-[7px] py-[5px] my-[1px] group cursor-pointer w-full rounded-[6px]   flex whitespace-nowrap justify-start items-center " +
                                  (props?.theme
                                    ? currentModel == data.Model
                                      ? " text-[white] bg-[#353941]"
                                      : " text-[#97a2b0] hover:bg-[#35394150]"
                                    : currentModel == data.Model
                                    ? " text-[#000000] bg-[#F7F7F7]"
                                    : " text-[#262626] hover:bg-[#f7f7f7ce]")
                                }
                                onClick={() => {
                                  setCurrentModel(data?.Model);
                                  setShowModels(false);
                                }}
                              >
                                {/* <div
                                  className={
                                    "min-w-[3px] h-[20px] rounded-full mr-[15px]" +
                                    (props?.theme
                                      ? currentModel == data.Model
                                        ? " bg-[#bcc4d2] flex"
                                        : " bg-transparent hidden"
                                      : currentModel == data.Model
                                      ? " bg-[#000000] flex"
                                      : " bg-transparent hidden")
                                  }
                                  // style={{ borderRadius: "10%" }}
                                ></div>
                                <div
                                  className={
                                    " " +
                                    (currentModel == data.Model
                                      ? " hidden ml-[0px] w-[0px]"
                                      : " block ml-[-5px] w-[23px]")
                                  }
                                >
                                  <ChevronRight
                                    width={18}
                                    height={18}
                                    strokeWidth={3.5}
                                    className={
                                      "text-transparent  " +
                                      (props?.theme
                                        ? " group-hover:text-[#bcc4d2]"
                                        : " group-hover:text-[#262626]")
                                    }
                                  />
                                </div> */}
                                <div className="flex justify-start items-center w-[30px]">
                                  <svg
                                    width="24"
                                    height="24"
                                    viewBox="0 0 24 24"
                                    fill="none"
                                    xmlns="http://www.w3.org/2000/svg"
                                  >
                                    <path
                                      d="M21.9956 12.0175C16.6323 12.3419 12.3399 16.6343 12.0156 21.9975H11.9756C11.6556 16.6343 7.36325 12.3419 2 12.0175V11.9775C7.36325 11.6576 11.6556 7.36521 11.98 2.00195H12.02C12.3444 7.36521 16.6367 11.6576 22 11.982V12.0175H21.9956Z"
                                      fill="#323544"
                                    />
                                  </svg>
                                </div>

                                <div className="flex flex-col justify-start items-start w-[calc(100%-30px)]">
                                  <div
                                    className={
                                      "flex justify-start items-center" +
                                      (props?.theme
                                        ? " group-hover:text-[#ffffff]"
                                        : " group-hover:text-[#000000]")
                                    }
                                  >
                                    {data?.Model}{" "}
                                    {index < 4 ? (
                                      <span
                                        className={
                                          "ml-[10px] rounded-[5px] h-[17px] bg-[#d39561] text-[#ffffff] flex justify-center items-center px-[5px] py-[0px] text-[10px] tracking-wider font-[DMSb] uppercase " +
                                          (currentModel == data?.Model
                                            ? " border-[#525863]"
                                            : " border-[#465463]")
                                        }
                                      >
                                        New
                                      </span>
                                    ) : (
                                      <></>
                                    )}
                                  </div>
                                  <div
                                    className={
                                      "mt-[-1px] text-[11px] tracking-wide group-hover:text-[#a9b0ba]" +
                                      (props?.theme
                                        ? " text-[#a9b0ba]"
                                        : " text-[#a4a4a4]")
                                    }
                                  >
                                    {data?.About}
                                  </div>
                                </div>
                                <div
                                  className={
                                    "" +
                                    (currentModel == data.Model
                                      ? " block"
                                      : " hidden")
                                  }
                                >
                                  <Check
                                    width={16}
                                    height={16}
                                    strokeWidth={3.5}
                                    className={
                                      "mt-[0px]" +
                                      (props?.theme
                                        ? " text-[#737d8a]"
                                        : " text-[#878787]")
                                    }
                                  />
                                </div>
                              </span>
                            );
                          })}
                        </div>
                      </div>

                      <div
                        className={
                          "min-h-[32px] max-h-[32px] px-[10px] rounded-lg flex justify-center items-center cursor-pointer border-[1.5px] max-w-[200px] z-10" +
                          (props?.theme
                            ? " bg-[#181b20] text-[#97a2b0] hover:text-[white] border-[#181b20]"
                            : " bg-[#F7F7F7] border-[#f0f0f0] text-[#000000]")
                        }
                        onClick={() => {
                          setShowModels(!showModels);
                        }}
                      >
                        {/* <Sparkles
                          width={14}
                          height={14}
                          strokeWidth={2.4}
                          className="mr-[8px]"
                        /> */}
                        <div className="flex justify-start items-center w-[24px]">
                          <svg
                            width="18"
                            height="18"
                            viewBox="0 0 24 24"
                            fill="none"
                            xmlns="http://www.w3.org/2000/svg"
                          >
                            <path
                              d="M21.9956 12.0175C16.6323 12.3419 12.3399 16.6343 12.0156 21.9975H11.9756C11.6556 16.6343 7.36325 12.3419 2 12.0175V11.9775C7.36325 11.6576 11.6556 7.36521 11.98 2.00195H12.02C12.3444 7.36521 16.6367 11.6576 22 11.982V12.0175H21.9956Z"
                              fill="#323544"
                            />
                          </svg>
                        </div>
                        <div className="overflow-hidden whitespace-nowrap text-ellipsis w-[calc(100%-40px)]">
                          {currentModel}
                        </div>
                        <ChevronDown
                          width={14}
                          height={14}
                          strokeWidth={2.4}
                          className="ml-[8px]"
                        />
                      </div>
                      <div
                        className={
                          "hidden group-hover:flex fixed mb-[-29px] justify-center items-center rounded-[9px]  text-[12px] px-[8px] py-[3px] cursor-default" +
                          (props?.theme
                            ? " bg-[#363636] text-[#ededed]"
                            : " bg-[black] text-[#ffffff]")
                        }
                        style={{ boxShadow: "0px 1px 4px rgba(0,0,0,0.2)" }}
                      >
                        Choose AI models
                      </div>
                    </div>
                    <div className="flex justify-end items-center ">
                      <div className="flex flex-col justify-start items-center max-w-[32px] group  max-h-[32px] mr-[15px] ">
                        <div className="w-full min-h-full flex justify-center items-center">
                          <HugeiconsIcon
                            className={
                              " cursor-pointer " +
                              (props?.theme
                                ? " text-[#97a2b0] hover:text-[#ffffff]"
                                : " text-[#797979] hover:text-[#000000]")
                            }
                            icon={Mic02Icon}
                            size={18}
                            strokeWidth={1.8}
                          />
                        </div>
                        <div
                          className={
                            "hidden group-hover:flex fixed mt-[32px] justify-center items-center rounded-[9px]  text-[12px] px-[8px] py-[3px] cursor-default" +
                            (props?.theme
                              ? " bg-[#363636] text-[#ededed]"
                              : " bg-[black] text-[#ffffff]")
                          }
                          style={{ boxShadow: "0px 1px 4px rgba(0,0,0,0.2)" }}
                        >
                          Dictate
                        </div>
                      </div>
                      <button
                        className={
                          "h-[32px] px-[10px] pr-[13px] rounded-[10px] flex justify-center items-center " +
                          (props?.theme
                            ? message?.trim().length > 0
                              ? " bg-[#ffffff]  text-[#000000] cursor-pointer"
                              : " bg-[#ffffff20] text-[#ffffff40] cursor-default"
                            : message?.trim().length > 0
                            ? " bg-[#1a191f]  text-[#ffffff] cursor-pointer"
                            : " bg-[#1a191f0a] text-[#B9B9B9] cursor-default")
                        }
                        onClick={() => {
                          if (message?.trim().length > 0) {
                            addUserMessage(message);
                            setLoading(true);
                          }
                        }}
                        style={{ transition: ".15s" }}
                      >
                        {" "}
                        <HugeiconsIcon
                          className="mr-[8px] "
                          icon={SentIcon}
                          size={18}
                          strokeWidth={1.8}
                        />
                        Send
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </>
        ) : (
          <>
            <div className="w-full h-full flex flex-col justify-center items-center">
              <div className="flex justify-center items-center">
                {/* <BrainCircuit
                width={35}
                height={35}
                strokeWidth={2}
                className="mr-[15px]"
              /> */}
                <span className="text-[40px] font-[DMSb] ">I'm ProbeSeek</span>
              </div>
              <div
                className={
                  "mt-[5px] font-[DMSr] " +
                  (props?.theme ? " text-[#828282]" : " text-[#797979]")
                }
              >
                <TextLoop className="text-center">
                  <span className="flex justify-center items-center whitespace-nowrap">
                    How can I assist you today ?
                  </span>
                  <span className="flex justify-center items-center whitespace-nowrap">
                    Generate a logo{" "}
                    <HugeiconsIcon
                      className="ml-[4px] "
                      icon={SwarmIcon}
                      size={14}
                      strokeWidth={2}
                    />
                    {/* <Feather
                      width="14"
                      height="14"
                      strokeWidth="2"
                      className="ml-[4px]"
                    /> */}
                  </span>
                  <span className="flex justify-center items-center whitespace-nowrap">
                    Create a component{" "}
                    <HugeiconsIcon
                      className="ml-[4px] "
                      icon={FileAttachmentIcon}
                      size={14}
                      strokeWidth={2}
                    />
                    {/* <FileCode2
                      width="14"
                      height="14"
                      strokeWidth="2"
                      className="ml-[6px]"
                    /> */}
                  </span>
                  <span className="flex justify-center items-center whitespace-nowrap">
                    Generate code{" "}
                    <HugeiconsIcon
                      className="ml-[4px] "
                      icon={DocumentCodeIcon}
                      size={14}
                      strokeWidth={2}
                    />
                    {/* <Code
                      width="14"
                      height="14"
                      strokeWidth="2"
                      className="ml-[6px]"
                    /> */}
                  </span>
                  <span className="flex justify-center items-center whitespace-nowrap">
                    Create a project{" "}
                    <HugeiconsIcon
                      className="ml-[4px] "
                      icon={AiIdeaIcon}
                      size={14}
                      strokeWidth={2}
                    />
                    {/* <FolderGit2
                      width="14"
                      height="14"
                      strokeWidth="2"
                      className="ml-[6px]"
                    /> */}
                  </span>
                  <span className="flex justify-center items-center whitespace-nowrap">
                    Generate good recipes{" "}
                    <HugeiconsIcon
                      className="ml-[4px] "
                      icon={NoodlesIcon}
                      size={14}
                      strokeWidth={2}
                    />
                    {/* <ConciergeBell
                      width="14"
                      height="14"
                      strokeWidth="2"
                      className="ml-[6px]"
                    /> */}
                  </span>
                </TextLoop>
              </div>
              <div
                className={
                  "w-full flex justify-center items-center z-40 mt-[60px] " +
                  (props?.theme ? " bg-[#1a1a1a]" : " bg-[#ffffff]")
                }
                // style={{ height: `${height}px` }}
              >
                <div
                  className={
                    "w-[calc(100%-40px)] md:w-[calc(100%-40px)] lg:w-[60%] h-auto min-h-[120px] max-h-[300px]  rounded-2xl border-[1.5px]  flex flex-col justify-between items-start p-[4px] pt-[0px] z-40  " +
                    (props?.theme
                      ? " bg-[#222222] border-[#292a2d]"
                      : " bg-[#f7f7f7] border-[#f0f0f0]")
                  }
                  // style={{ height: `${height}px` }}
                  ref={divRef}
                >
                  <div className="w-full flex justify-between items-center h-[40px] px-[9px] py-[4px]">
                    <div className="flex justify-start items-center h-full overflow-x-scroll uploadScroll">
                      {/* <label
                        className={
                          "cursor-pointer  " +
                          (props?.theme
                            ? " text-[#000000] hover:text-[#000000]"
                            : " text-[#878787] hover:text-[#000000]")
                        }
                        for="image-file-input"
                      >
                        <CirclePlus
                          width={16}
                          height={16}
                          strokeWidth={2}
                          className=" mr-[9px]"
                        />
                        <input
                          id="image-file-input"
                          className="hidden"
                          type="file"
                          multiple
                          accept="*"
                          onChange={(e) => {
                            handleFileChange(e);
                          }}
                        />
                      </label>{" "} */}
                      <div className="max-h-full flex flex-col justify-end items-center overflow-y-visible group">
                        <div
                          className={
                            "hidden group-hover:flex fixed mb-[20px] ml-[-7px] justify-center items-center rounded-[9px]  text-[12px] px-[8px] py-[3px] cursor-default" +
                            (props?.theme
                              ? " bg-[#363636] text-[#ededed]"
                              : " bg-[black] text-[#ffffff]")
                          }
                          style={{ boxShadow: "0px 1px 4px rgba(0,0,0,0.2)" }}
                        >
                          Add photos & files
                        </div>
                        <label
                          className={
                            "cursor-pointer min-h-full " +
                            (props?.theme
                              ? " text-[#8f8f8f] hover:text-[#ffffff]"
                              : " text-[#878787] hover:text-[#000000]")
                          }
                          for="image-file-input"
                        >
                          <CirclePlus
                            width={16}
                            height={16}
                            strokeWidth={2}
                            className=" mr-[9px]"
                          />
                          <input
                            id="image-file-input"
                            className="hidden"
                            type="file"
                            multiple
                            accept="*"
                            onChange={(e) => {
                              handleFileChange(e);
                            }}
                          />
                        </label>
                      </div>{" "}
                      {filesInfo.length > 0 ? (
                        <>
                          {filesInfo?.map((data, index) => {
                            return (
                              <>
                                {data?.idDocument ? (
                                  <>
                                    <div
                                      className={
                                        "flex justify-start items-center max-w-[150px]  h-full  rounded-[8px] px-[6px] " +
                                        (index == 0
                                          ? " ml-[0px] "
                                          : " ml-[6px] ") +
                                        (props?.theme
                                          ? " bg-[#000000] border-[#000000] text-[#ffffff]"
                                          : " bg-[white] border-[#f2f2f2] text-[#000000]")
                                      }
                                    >
                                      <div className="w-[20px] flex justify-start items-center mr-[2px]">
                                        <File
                                          width={16}
                                          height={16}
                                          strokeWidth={1.6}
                                          className=""
                                        />
                                      </div>
                                      <div className="flex flex-col justify-center items-start h-full w-[calc(100%-22px)]">
                                        <span
                                          className={
                                            "w-full overflow-hidden text-ellipsis text-[12px]" +
                                            (props?.theme
                                              ? " text-[#ffffff]"
                                              : " text-[#000000]")
                                          }
                                        >
                                          {data?.name}
                                        </span>
                                        <span
                                          className={
                                            "text-[10px] mt-[-4px]" +
                                            (props?.theme
                                              ? " text-[#ffffff]"
                                              : " text-[#727272]")
                                          }
                                        >
                                          .{data?.type?.split("/")?.pop()}
                                        </span>
                                      </div>
                                    </div>
                                  </>
                                ) : (
                                  <>
                                    <div
                                      className={
                                        "flex justify-start items-start h-full rounded-[8px] " +
                                        (index == 0
                                          ? " ml-[0px] "
                                          : " ml-[6px] ")
                                      }
                                    >
                                      <img
                                        className="h-full aspect-square rounded-[8px] object-cover blur-[0px]"
                                        src={data?.src}
                                        alt="img"
                                      ></img>
                                    </div>
                                  </>
                                )}
                              </>
                            );
                          })}
                        </>
                      ) : (
                        <></>
                      )}
                    </div>
                  </div>
                  <div
                    className={
                      "w-full h-auto  rounded-[12px]  p-[13px] pt-[10px] flex flex-col justify-start items-start " +
                      (props?.theme ? " bg-[#1A1A1A]" : " bg-[#ffffff]")
                    }
                  >
                    <textarea
                      className="w-full h-auto min-h-[100%] max-h-[100px] pt-[0px] outline-none bg-transparent  resize-none"
                      // style={{ transition: ".2s" }}
                      placeholder={
                        props?.agentInfo.length > 0
                          ? props?.agentInfo[0]?.Placeholder + " ..."
                          : "Type your message ..."
                      }
                      value={message}
                      onInput={(e) => {
                        setMessage(e.target.value);
                        // setHeight()

                        e.target.style.height = "auto"; // Reset the height to auto to recalculate
                        e.target.style.height = `${e.target.scrollHeight}px`; // Set the height to the scroll height
                      }}
                      onKeyDown={(e) => {
                        if (e.key === "Enter" && !e.shiftKey) {
                          e.preventDefault(); // Prevent new line
                          if (message?.trim().length > 0) {
                            addUserMessage(message);
                            setLoading(true);
                            e.target.style.height = "auto";
                          }
                        }
                      }}
                      onScroll={() => {
                        setShowModels(false);
                      }}
                    ></textarea>
                    <div className="w-full h-[42px] mt-[8px] rounded-[10px] flex justify-between items-end ">
                      <div className="group h-full flex flex-col justify-end items-start overflow-visible max-w-[200px] font-[DMSr]">
                        <div
                          className={
                            "w-auto max-w-[400px] md:max-w-[400px] lg:max-w-[400px]  rounded-[10px] p-[7px]  border-[1.5px] pr-[4px] flex flex-col justify-start items-start backdrop-blur-[20px] boxShadowLight0 " +
                            (showModels
                              ? " opacity-100 mb-[6px] z-10 h-[230px]"
                              : " opacity-0 mb-[-26px] -z-20 h-[130px]") +
                            (props?.theme
                              ? " bg-[#181b20]"
                              : " bg-[#ffffffc4] border-[#f0f0f0]")
                          }
                          style={{ transition: ".2s" }}
                        >
                          <div
                            className={
                              "w-full h-full flex flex-col justify-start items-start overflow-y-scroll modelScrollDark pr-[3px]" +
                              (props?.theme
                                ? " modelScrollDark"
                                : " modelScrollLight")
                            }
                          >
                            {aiModels?.map((data, index) => {
                              return (
                                <span
                                  key={index}
                                  className={
                                    "group h-auto p-[7px] py-[5px] my-[1px] group cursor-pointer w-full rounded-[6px]   flex whitespace-nowrap justify-start items-center " +
                                    (props?.theme
                                      ? currentModel == data.Model
                                        ? " text-[white] bg-[#353941]"
                                        : " text-[#97a2b0] hover:bg-[#35394150]"
                                      : currentModel == data.Model
                                      ? " text-[#000000] bg-[#F7F7F7]"
                                      : " text-[#262626] hover:bg-[#f7f7f7ce]")
                                  }
                                  onClick={() => {
                                    setCurrentModel(data?.Model);
                                    setShowModels(false);
                                  }}
                                >
                                  {/* <div
                                  className={
                                    "min-w-[3px] h-[20px] rounded-full mr-[15px]" +
                                    (props?.theme
                                      ? currentModel == data.Model
                                        ? " bg-[#bcc4d2] flex"
                                        : " bg-transparent hidden"
                                      : currentModel == data.Model
                                      ? " bg-[#000000] flex"
                                      : " bg-transparent hidden")
                                  }
                                  // style={{ borderRadius: "10%" }}
                                ></div>
                                <div
                                  className={
                                    " " +
                                    (currentModel == data.Model
                                      ? " hidden ml-[0px] w-[0px]"
                                      : " block ml-[-5px] w-[23px]")
                                  }
                                >
                                  <ChevronRight
                                    width={18}
                                    height={18}
                                    strokeWidth={3.5}
                                    className={
                                      "text-transparent  " +
                                      (props?.theme
                                        ? " group-hover:text-[#bcc4d2]"
                                        : " group-hover:text-[#262626]")
                                    }
                                  />
                                </div> */}
                                  <div className="flex justify-start items-center w-[30px]">
                                    <svg
                                      width="24"
                                      height="24"
                                      viewBox="0 0 24 24"
                                      fill="none"
                                      xmlns="http://www.w3.org/2000/svg"
                                    >
                                      <path
                                        d="M21.9956 12.0175C16.6323 12.3419 12.3399 16.6343 12.0156 21.9975H11.9756C11.6556 16.6343 7.36325 12.3419 2 12.0175V11.9775C7.36325 11.6576 11.6556 7.36521 11.98 2.00195H12.02C12.3444 7.36521 16.6367 11.6576 22 11.982V12.0175H21.9956Z"
                                        fill="#323544"
                                      />
                                    </svg>
                                  </div>

                                  <div className="flex flex-col justify-start items-start w-[calc(100%-30px)]">
                                    <div
                                      className={
                                        "flex justify-start items-center" +
                                        (props?.theme
                                          ? " group-hover:text-[#ffffff]"
                                          : " group-hover:text-[#000000]")
                                      }
                                    >
                                      {data?.Model}{" "}
                                      {index < 4 ? (
                                        <span
                                          className={
                                            "ml-[10px] rounded-[5px] h-[17px] bg-[#d39561] text-[#ffffff] flex justify-center items-center px-[5px] py-[0px] text-[10px] tracking-wider font-[DMSb] uppercase " +
                                            (currentModel == data?.Model
                                              ? " border-[#525863]"
                                              : " border-[#465463]")
                                          }
                                        >
                                          New
                                        </span>
                                      ) : (
                                        <></>
                                      )}
                                    </div>
                                    <div
                                      className={
                                        "mt-[-1px] text-[11px] tracking-wide group-hover:text-[#a9b0ba]" +
                                        (props?.theme
                                          ? " text-[#a9b0ba]"
                                          : " text-[#a4a4a4]")
                                      }
                                    >
                                      {data?.About}
                                    </div>
                                  </div>
                                  <div
                                    className={
                                      "" +
                                      (currentModel == data.Model
                                        ? " block"
                                        : " hidden")
                                    }
                                  >
                                    <Check
                                      width={16}
                                      height={16}
                                      strokeWidth={3.5}
                                      className={
                                        "mt-[0px]" +
                                        (props?.theme
                                          ? " text-[#737d8a]"
                                          : " text-[#878787]")
                                      }
                                    />
                                  </div>
                                </span>
                              );
                            })}
                          </div>
                        </div>

                        <div
                          className={
                            "min-h-[32px] max-h-[32px] px-[10px] rounded-lg flex justify-center items-center cursor-pointer border-[1.5px] max-w-[200px] z-10" +
                            (props?.theme
                              ? " bg-[#181b20] text-[#97a2b0] hover:text-[white] border-[#181b20]"
                              : " bg-[#F7F7F7] border-[#f0f0f0] text-[#000000]")
                          }
                          onClick={() => {
                            setShowModels(!showModels);
                          }}
                        >
                          {/* <Sparkles
                          width={14}
                          height={14}
                          strokeWidth={2.4}
                          className="mr-[8px]"
                        /> */}
                          <div className="flex justify-start items-center w-[24px]">
                            <svg
                              width="18"
                              height="18"
                              viewBox="0 0 24 24"
                              fill="none"
                              xmlns="http://www.w3.org/2000/svg"
                            >
                              <path
                                d="M21.9956 12.0175C16.6323 12.3419 12.3399 16.6343 12.0156 21.9975H11.9756C11.6556 16.6343 7.36325 12.3419 2 12.0175V11.9775C7.36325 11.6576 11.6556 7.36521 11.98 2.00195H12.02C12.3444 7.36521 16.6367 11.6576 22 11.982V12.0175H21.9956Z"
                                fill="#323544"
                              />
                            </svg>
                          </div>
                          <div className="overflow-hidden whitespace-nowrap text-ellipsis w-[calc(100%-40px)]">
                            {currentModel}
                          </div>
                          <ChevronDown
                            width={14}
                            height={14}
                            strokeWidth={2.4}
                            className="ml-[8px]"
                          />
                        </div>
                        <div
                          className={
                            "hidden group-hover:flex fixed mb-[-29px] justify-center items-center rounded-[9px]  text-[12px] px-[8px] py-[3px] cursor-default" +
                            (props?.theme
                              ? " bg-[#363636] text-[#ededed]"
                              : " bg-[black] text-[#ffffff]")
                          }
                          style={{ boxShadow: "0px 1px 4px rgba(0,0,0,0.2)" }}
                        >
                          Choose AI models
                        </div>
                      </div>
                      <div className="flex justify-end items-center ">
                        <div className="flex flex-col justify-start items-center max-w-[32px] group  max-h-[32px] mr-[15px] ">
                          <div className="w-full min-h-full flex justify-center items-center">
                            <HugeiconsIcon
                              className={
                                " cursor-pointer " +
                                (props?.theme
                                  ? " text-[#97a2b0] hover:text-[#ffffff]"
                                  : " text-[#797979] hover:text-[#000000]")
                              }
                              icon={Mic02Icon}
                              size={18}
                              strokeWidth={1.8}
                            />
                          </div>
                          <div
                            className={
                              "hidden group-hover:flex fixed mt-[32px] justify-center items-center rounded-[9px]  text-[12px] px-[8px] py-[3px] cursor-default" +
                              (props?.theme
                                ? " bg-[#363636] text-[#ededed]"
                                : " bg-[black] text-[#ffffff]")
                            }
                            style={{ boxShadow: "0px 1px 4px rgba(0,0,0,0.2)" }}
                          >
                            Dictate
                          </div>
                        </div>
                        <button
                          className={
                            "h-[32px] px-[10px] pr-[13px] rounded-[10px] flex justify-center items-center " +
                            (props?.theme
                              ? message?.trim().length > 0
                                ? " bg-[#ffffff]  text-[#000000] cursor-pointer"
                                : " bg-[#ffffff20] text-[#ffffff40] cursor-default"
                              : message?.trim().length > 0
                              ? " bg-[#1a191f]  text-[#ffffff] cursor-pointer"
                              : " bg-[#1a191f0a] text-[#B9B9B9] cursor-default")
                          }
                          onClick={() => {
                            if (message?.trim().length > 0) {
                              addUserMessage(message);
                              setLoading(true);
                            }
                          }}
                          style={{ transition: ".15s" }}
                        >
                          {" "}
                          <HugeiconsIcon
                            className="mr-[8px] "
                            icon={SentIcon}
                            size={18}
                            strokeWidth={1.8}
                          />
                          Send
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </>
        )}
      </div>
    </>
  );
}
