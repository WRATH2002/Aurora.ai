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
import { processStringDecrypt } from "../utils/functions";
import { TextShimmer } from "./motion-animations/text-shimmer";
import { lineSpinner } from "ldrs";
import { ring2 } from "ldrs";
import { TextEffect, TextLoop } from "./motion-animations/text-effect";
import Prism from "prismjs";
// import "../assets/style/prism-vsc-dark-plus.css";

ring2.register();
lineSpinner.register();
zoomies.register();

const aiModels = [
  {
    Model: "gemini-2.0-flash",
    About: "Multimodal, realtime streaming",
  },
  {
    Model: "gemini-2.0-flash-lite",
    About: "Long context, realtime streaming",
  },
  {
    Model: "gemini-2.0-pro-exp-02-05",
    About: "Multimodal, realtime streaming",
  },
  {
    Model: "gemini-2.0-flash-thinking-exp-01-21",
    About: "Multimodal, reasoning, coding",
  },
  {
    Model: "gemini-1.5-pro",
    About: "Long context, complex & math reasoning",
  },
  {
    Model: "gemini-1.5-flash",
    About: "Image, video, audio understanding",
  },
  {
    Model: "gemini-1.5-flash-8b",
    About: "Low latency, multilingual, summarization",
  },
];

export default function AiChatBot(props) {
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

  const lastElementRef = useRef(null);

  useEffect(() => {
    // if (lastElementRef.current) {
    //   lastElementRef.current.scrollIntoView({ behavior: "smooth" });
    // }
    if (lastElementRef.current) {
      lastElementRef.current.scrollTop = lastElementRef.current.scrollHeight;
    }
  }, [chatHistoryTemp, props?.selectedChatName]);

  // ---------------------------- Used to transfer data to different document --> ( depricated )
  function g() {
    const user = firebase.auth().currentUser;
    const channelRef = db
      .collection("user")
      .doc(user?.uid)
      .collection("AIChats")
      .doc("UI_UX Design Convo")
      .set({
        chats: chatHistoryTemp,
      });
  }

  // ---------------------------- Checking if Loggen In and then saving Active API Key ------------------------

  useEffect(() => {
    function ActiveApiKey() {
      // const user = firebase.auth().currentUser;
      const listen = onAuthStateChanged(auth, (user) => {
        if (user) {
          const channelRef = db
            .collection("user")
            .doc(user?.uid)
            .collection("APIKeys")
            .doc("APIKeys");

          onSnapshot(channelRef, (snapshot) => {
            setActiveAPIKeyID(snapshot?.data()?.ActiveAPIKey);
          });
        } else {
          console.log("Not Logged in");
        }
      });
    }
    ActiveApiKey();
  }, []);

  useEffect(() => {
    console.log("api key");
    console.log(activeApiKeyID);
  }, [activeApiKeyID]);

  // ---------------------------- Function to get formatted time ( dd/mm/yyyy ) -----------------------------------------
  function getFormattedTime() {
    const now = new Date();
    let hours = now.getHours();
    const minutes = now.getMinutes();
    const period = hours >= 12 ? "pm" : "am";

    hours = hours % 12 || 12; // Convert 0 to 12 for 12-hour format
    return `${hours}:${minutes.toString().padStart(2, "0")} ${period}`;
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

  // ---------------------------- Function to fetch chats from Firebase -----------------------------------------
  useEffect(() => {
    function fetchChatsFromFirebase() {
      const user = firebase.auth().currentUser;
      const channelRef = db
        .collection("user")
        .doc(user?.uid)
        .collection("AIChats")
        .doc(props?.selectedChatName);

      onSnapshot(channelRef, (snapshot) => {
        setChatHistoryTemp(snapshot?.data()?.chats);
        console.log(snapshot?.data()?.chats);
      });
    }
    if (props?.selectedChatName.length > 0) {
      fetchChatsFromFirebase();
    }
  }, [props?.selectedChatName]);

  // ---------------------------- Function to store chats in Firebase ----------------------------------
  function storeToFirebase(data, path) {
    const user = firebase.auth().currentUser;
    db.collection("user")
      .doc(user?.uid)
      .collection("AIChats")
      .doc(path)
      .update({
        chats: arrayUnion(data),
      });
  }

  // ---------------------------- Function to store chats in Firebase ----------------------------------
  function storeToFirebaseAutoCreateChatSpace(data, path) {
    const user = firebase.auth().currentUser;
    db.collection("user")
      .doc(user?.uid)
      .collection("AIChats")
      .doc(path)
      .update({
        chats: arrayUnion(data),
      });
  }

  // --------------------------- Function to get the first 15 words from promptsto create chat space
  function getFirst7Words(text) {
    const cleanText = text.replace(/[^\w\s]/gi, "");

    const words = cleanText.trim().split(/\s+/);
    if (words.length <= 7) {
      return cleanText.trim();
    }
    return words.slice(0, 7).join(" ");
  }

  function addUserMessage(text) {
    if (props?.selectedChatName.length == 0) {
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
        console.log("Chat space is created, ready to use !");

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
        console.log("Chat is added to all chats !");
      });
    } else {
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
      storeToFirebase(tempObj, props?.selectedChatName);
      // setChatHistory((prev) => [...prev, tempObj]);

      run(text, formatMessages(tempData), props?.selectedChatName);
      setMessage("");
    }
  }

  // ----------------------------- Function to get array of chats in specific from to give it to Gemini Model for History
  function formatMessages(messages) {
    return messages.map((message) => ({
      role: message.Sender === "User" ? "user" : "model", // Use "assistant" as the standard role for models/bots.
      parts: [{ text: message.Message }],
    }));
  }

  // ----------------------------- Gemini Model and API implementation and settings -----------------------------
  const genAI = new GoogleGenerativeAI(processStringDecrypt(activeApiKeyID));

  const model = genAI.getGenerativeModel({
    model: currentModel,
  });

  const generationConfig = {
    temperature: 1,
    top_p: 0.95,
    top_k: 40,
    max_output_tokens: 8192,
    response_mime_type: "text/plain",
  };

  // ----------------------------- Function to get AI Response from Gemini API -----------------------------
  async function run(text, data, path) {
    console.log("Ai is Giving Answer. Please wait!");
    const chatSession = model.startChat({
      generationConfig,
      history: data,
    });

    let tempPrompt = text;

    const result = await chatSession.sendMessage(tempPrompt);

    console.log("Recieved Answer --->");
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
      },
      path
    );
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
      <div class=" w-[100%] min-h-[3px] rounded-full mt-[-1.5px] z-30 " style="background : ${theme_LanguageBorder}" ></div></div><button class="p-[5px] rounded-lg flex justify-end hover:bg-[${theme_CopyBGHover}] items-center hover:text-[${theme_TextColorPrimary}] " style="color: ${theme_TextColorSecondary}; border : 1.5px solid ${theme_CodeSnippetBorder}; "   ><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-files"><path d="M20 7h-3a2 2 0 0 1-2-2V2"/><path d="M9 18a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h7l4 4v10a2 2 0 0 1-2 2Z"/><path d="M3 7.6v12.8A1.6 1.6 0 0 0 4.6 22h9.8"/></svg></button></div>`
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
          return `<code class="bg-[#4D505685] font-[rr] text-center px-[6px] py-[2px] rounded-[4px]" style="background : ${theme_CodeText};">${escapeHtml(
            doubleContent
          )}</code>`;
        } else if (single) {
          // Rule 2: Format only if no leading/trailing space
          if (!/^\s|\s$/.test(singleContent)) {
            return `<code class="bg-[#4D505685] font-[rr] text-center px-[6px] py-[2px] rounded-[4px]" style="background : ${theme_CodeText};">${escapeHtml(
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

  return (
    <>
      {" "}
      <div
        className={
          " pb-[10px] md:pb-[30px] lg:pb-[30px] pt-[0px] md:pt-[0px] lg:pt-[0px] h-full flex flex-col justify-center items-center font-[geistRegular]" +
          (props?.theme ? " text-[#ffffff]" : " text-[#000000]") +
          (props?.chatSidebarModal
            ? " w-full md:w-[calc(100%-250px)] lg:w-[calc(100%-250px)]"
            : " w-full md:w-full lg:w-full")
        }
        // onClick={() => {
        //   setShowModels(false);
        // }}
      >
        {chatHistoryTemp?.length > 0 ? (
          <>
            <div
              ref={lastElementRef}
              className={
                "w-full  h-full flex flex-col justify-end items-center overflow-y-scroll pt-[20px] md:pt-[30px] lg:pt-[30px] pl-[5px]" +
                (props?.theme ? " chatScrollDark" : " chatScrollLight")
              }
            >
              <div className="w-[calc(100%-35px)] md:w-[calc(100%-35px)] lg:w-[60%] h-full flex flex-col justify-start items-start  ">
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
                              "flex justify-center items-center whitespace-nowrap px-[15px] py-[10px] rounded-lg text-[12px] tracking-wider uppercase" +
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
                            " rounded-2xl flex flex-col justify-start items-start mb-[20px]" +
                            (data?.Sender == "User"
                              ? props?.theme
                                ? " bg-[#222222] p-[15px] px-[20px] max-w-[80%] md:max-w-[70%] lg:max-w-[70%]  w-auto"
                                : " bg-[#f7f7f7] p-[15px] px-[20px] max-w-[80%] md:max-w-[70%] lg:max-w-[70%]  w-auto"
                              : " bg-transparent px-[0px] w-full")
                          }
                        >
                          <div className="flex justify-start items-center">
                            <span
                              className={
                                "font-[geistSemibold]" +
                                (props?.theme
                                  ? " text-[white]"
                                  : " text-[black]")
                              }
                            >
                              {data?.Sender == "User" ? <>Me</> : <>AI</>}{" "}
                            </span>{" "}
                            <span
                              className={
                                "text-[12px] flex justify-center items-center font-[geistMedium]" +
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
                          {data?.Sender == "User" ? (
                            <>
                              <pre
                                className="mt-[8px] font-[geistRegular] leading-[25px] whitespace-pre-wrap w-full "
                                // dangerouslySetInnerHTML={{
                                //   __html: formatText(data?.Message),
                                // }}
                              >
                                {data?.Message?.trim()}
                              </pre>
                            </>
                          ) : (
                            <>
                              <pre
                                className="mt-[8px] font-[geistRegular] leading-[28px] whitespace-pre-wrap w-full "
                                dangerouslySetInnerHTML={{
                                  __html: formatText(data?.Message),
                                }}
                              ></pre>
                            </>
                          )}

                          <div
                            className={
                              "mt-[8px] w-full  justify-start items-center" +
                              (data?.Sender == "User" ? " hidden" : " flex")
                            }
                          >
                            <div className="h-[28px] w-[28px] rounded-md hover:bg-[#f0f0f0] text-[#5D5D5D] cursor-pointer flex justify-center items-center mr-[2px]">
                              <Volume2
                                width={16}
                                height={16}
                                strokeWidth={2.2}
                                className=""
                              />
                            </div>
                            <div
                              className={
                                "h-[28px] w-[28px] rounded-md hover:bg-[#f0f0f0] text-[#5D5D5D] cursor-pointer justify-center items-center mr-[2px]" +
                                (chatHistory.length - 1 == index
                                  ? " flex"
                                  : " hidden")
                              }
                              onClick={() => {
                                //   run(
                                //     props?.AiOutput[0]?.Message[
                                //       props?.AiOutput[0]?.Message.length - 1
                                //     ]
                                //   );
                                //   props?.setLoading(true);
                              }}
                            >
                              <RefreshCw
                                width={16}
                                height={16}
                                strokeWidth={2.2}
                                className=""
                              />
                            </div>
                            <div
                              className={
                                "h-[28px] w-[28px] rounded-md hover:bg-[#f0f0f0] text-[#5D5D5D] cursor-pointer justify-center items-center mr-[2px] " +
                                (chatHistory.length - 1 == index
                                  ? " flex"
                                  : " hidden")
                                //   +
                                //   (isLiked == "like" || isLiked.length == 0
                                //     ? " flex"
                                //     : " hidden")
                              }
                              onClick={() => {
                                //   setIsLiked("like");
                              }}
                            >
                              <ThumbsUp
                                width={16}
                                height={16}
                                strokeWidth={2.2}
                                //   fill={isLiked == "like" ? "currentColor" : "none"}
                                className=""
                              />
                            </div>
                            <div
                              className={
                                "h-[28px] w-[28px] rounded-md hover:bg-[#f0f0f0] text-[#5D5D5D] cursor-pointer justify-center items-center mr-[2px] " +
                                (chatHistory.length - 1 == index
                                  ? " flex"
                                  : " hidden")
                                //   +
                                //   (isLiked == "dislike" || isLiked.length == 0
                                //     ? " flex"
                                //     : " hidden")
                              }
                              onClick={() => {
                                //   setIsLiked("dislike");
                              }}
                            >
                              <ThumbsDown
                                width={16}
                                height={16}
                                strokeWidth={2.2}
                                //   fill={isLiked == "dislike" ? "currentColor" : "none"}
                                className=""
                              />
                            </div>
                            <div
                              className="h-[28px] w-[28px] rounded-md hover:bg-[#f0f0f0] text-[#5D5D5D] cursor-pointer flex justify-center items-center"
                              onClick={() => {
                                //   copyToClipboard(
                                //     props?.AiOutput[0]?.Message[activeIndex]
                                //   );
                                //   setCopied(true);
                                //   setTimeout(() => {
                                //     setCopied(false);
                                //   }, 2000);
                              }}
                            >
                              <Copy
                                width={16}
                                height={16}
                                strokeWidth={2.2}
                                className=""
                              />
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
                      className="ml-[8px] font-[geistRegular]"
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
                {/* <l-ring-2
                      size="10"
                      stroke="1.5"
                      stroke-length="0.25"
                      bg-opacity="0.1"
                      speed="0.8"
                      color="black"
                    ></l-ring-2> */}
                <TextShimmer
                  theme={props?.theme}
                  className="ml-[8px] font-[geistRegular]"
                  duration={1}
                >
                  Generating response ...
                </TextShimmer>
              </div>
            </div>
            <div
              className={
                "w-[calc(100%-40px)] min-h-[120px] max-h-[300px] h-auto flex justify-center items-end z-40 " +
                (props?.theme ? " bg-[#1a1a1a]" : " bg-[#ffffff]")
              }
              style={{ marginTop: `-${subHeight}px` }}
            >
              <div
                className={
                  "w-[calc(100%-0px)] md:w-[calc(100%-0px)] lg:w-[calc(60%+20px)] h-auto min-h-[120px] max-h-[300px]  rounded-xl border-[1.5px]  flex flex-col justify-between items-start p-[4px] pt-[7px] z-40  " +
                  (props?.theme
                    ? " bg-[#222222] border-[#292a2d] text-[white]"
                    : " bg-[#F7F7F7] border-[#f2f2f2] text-[black]")
                }
                // style={{ marginTop: `-${height}px` }}
                // style={{ height: `${subHeight}px` }}
                ref={subDivRef}
                // style={{ transition: ".2s" }}
              >
                <div className="w-full min-h-[calc(100%-50px)] mb-[10px]">
                  <textarea
                    className="w-full h-auto min-h-[100%] px-[8px] max-h-[100px] outline-none bg-transparent  resize-none"
                    style={{ transition: ".2s" }}
                    placeholder="Type your message ..."
                    value={message}
                    onInput={(e) => {
                      setMessage(e.target.value);
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
                </div>
                <div className="w-full h-[40px] rounded-[8px] flex justify-between items-center px-[8px] pb-[8px]">
                  <div className="h-full flex flex-col justify-end items-start overflow-y-visible">
                    <div
                      className={
                        "w-auto max-w-[400px] md:max-w-[400px] lg:max-w-[400px] min-h-[230px] rounded-lg mb-[6px] p-[7px]   pr-[4px] flex-col justify-start items-start backdrop-blur-[40px] boxShadowLight0 " +
                        (showModels ? " flex" : " hidden") +
                        (props?.theme ? " bg-[#181b20]" : " bg-[#1F2125]")
                      }
                    >
                      <div
                        className={
                          "w-full h-full flex flex-col justify-start items-start overflow-y-scroll pr-[3px]" +
                          (props?.theme ? " scroll2" : " ")
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
                                  : " text-[#a4a4a4]")
                              }
                              onClick={() => {
                                setCurrentModel(data?.Model);
                                setShowModels(false);
                              }}
                            >
                              <div
                                className={
                                  "min-w-[3px] h-[20px] rounded-full mr-[15px]" +
                                  (currentModel == data.Model
                                    ? " bg-[#bcc4d2] flex"
                                    : " bg-transparent hidden")
                                }
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
                                  className="text-transparent group-hover:text-[#bcc4d2] "
                                />
                              </div>

                              <div className="flex flex-col justify-start items-start w-[calc(100%-30px)]">
                                <div
                                  className={
                                    "flex justify-start items-center" +
                                    (props?.theme
                                      ? " group-hover:text-[#ffffff]"
                                      : " group-hover:text-[#ffffff]")
                                  }
                                >
                                  {data?.Model}{" "}
                                  {index < 4 ? (
                                    <span
                                      className={
                                        "ml-[10px] rounded-[6px] h-[17px] bg-gradient-to-br from-[#ba96fc] to-[#a477f7] text-[black] flex justify-center items-center px-[5px] py-[0px] text-[10px] tracking-wider font-[geistBold] " +
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
                                      ? currentModel == data.Model
                                        ? " text-[#a9b0ba]"
                                        : " text-[#737d8a]"
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
                                <WifiHigh
                                  width={20}
                                  height={20}
                                  strokeWidth={2}
                                  className="mt-[-7px]"
                                />
                              </div>
                            </span>
                          );
                        })}
                      </div>
                    </div>
                    <div
                      className={
                        "min-h-[32px] max-h-[32px] px-[10px] rounded-lg flex justify-center items-center cursor-pointer border-[1.5px] max-w-[200px]" +
                        (props?.theme
                          ? " bg-[#181b20] text-[#97a2b0] hover:text-[white] border-[#181b20]"
                          : " bg-[#404148] text-[white]")
                      }
                      onClick={() => {
                        setShowModels(!showModels);
                      }}
                    >
                      <Sparkles
                        width={14}
                        height={14}
                        strokeWidth={2.4}
                        className="mr-[8px]"
                      />
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
                  </div>
                  <div className="flex justify-end items-center ">
                    <Mic
                      width={18}
                      height={18}
                      strokeWidth={2.1}
                      className={
                        "mr-[10px] cursor-pointer " +
                        (props?.theme
                          ? " text-[#97a2b0] hover:text-[#ffffff]"
                          : " text-[#6e6e7c] hover:text-[#000000]")
                      }
                    />
                    <button
                      className={
                        "h-[32px] px-[10px] rounded-lg flex justify-center items-center " +
                        (props?.theme
                          ? message?.trim().length > 0
                            ? " bg-[#ffffff]  text-[#000000] cursor-pointer"
                            : " bg-[#ffffff20] text-[#ffffff40] cursor-default"
                          : " bg-[#404148] text-[white] cursor-pointer")
                      }
                      onClick={() => {
                        if (message?.trim().length > 0) {
                          addUserMessage(message);
                          setLoading(true);
                        }
                      }}
                      style={{ transition: ".15s" }}
                    >
                      <Send
                        width={14}
                        height={14}
                        strokeWidth={2.4}
                        className="mr-[8px]"
                      />
                      Send
                    </button>
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
                <span className="text-[30px] font-[geistSemibold]">
                  I'm ProbeSeek
                </span>
              </div>
              <div
                className={
                  "mt-[5px] " +
                  (props?.theme ? " text-[#828282]" : " text-[#6e6e7c]")
                }
              >
                <TextLoop className="text-center">
                  <span className="flex justify-center items-center whitespace-nowrap">
                    How can I assist you today ?
                  </span>
                  <span className="flex justify-center items-center whitespace-nowrap">
                    Generate a logo{" "}
                    <Feather
                      width="14"
                      height="14"
                      strokeWidth="2"
                      className="ml-[4px]"
                    />
                  </span>
                  <span className="flex justify-center items-center whitespace-nowrap">
                    Create a component{" "}
                    <FileCode2
                      width="14"
                      height="14"
                      strokeWidth="2"
                      className="ml-[6px]"
                    />
                  </span>
                  <span className="flex justify-center items-center whitespace-nowrap">
                    Generate code{" "}
                    <Code
                      width="14"
                      height="14"
                      strokeWidth="2"
                      className="ml-[6px]"
                    />
                  </span>
                  <span className="flex justify-center items-center whitespace-nowrap">
                    Create a project{" "}
                    <FolderGit2
                      width="14"
                      height="14"
                      strokeWidth="2"
                      className="ml-[6px]"
                    />
                  </span>
                  <span className="flex justify-center items-center whitespace-nowrap">
                    Generate good recipes{" "}
                    <ConciergeBell
                      width="14"
                      height="14"
                      strokeWidth="2"
                      className="ml-[6px]"
                    />
                  </span>
                </TextLoop>
                {/* How may I assist you today? */}
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
                    "w-[calc(100%-40px)] md:w-[calc(100%-40px)] lg:w-[60%] h-auto min-h-[120px] max-h-[300px]  rounded-xl border-[1.5px]  flex flex-col justify-between items-start p-[4px] pt-[7px] z-40  " +
                    (props?.theme
                      ? " bg-[#222222] border-[#292a2d]"
                      : " bg-[#f7f7f7] border-[#f0f0f0]")
                  }
                  // style={{ height: `${height}px` }}
                  ref={divRef}
                >
                  <div className="w-full min-h-[calc(100%-50px)] h-auto mb-[10px]">
                    <textarea
                      className="w-full h-auto min-h-[100%] px-[8px] max-h-[100px] outline-none bg-transparent  resize-none"
                      style={{ transition: ".2s" }}
                      placeholder="Type your message ..."
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
                  </div>
                  <div className="w-full h-[40px] rounded-[8px] flex justify-between items-center px-[8px] pb-[8px]">
                    <div className="h-full flex flex-col justify-end items-start overflow-visible max-w-[200px]">
                      <div
                        className={
                          "w-auto max-w-[400px] md:max-w-[400px] lg:max-w-[400px] min-h-[230px] rounded-lg mb-[6px] p-[7px]   pr-[4px] flex-col justify-start items-start backdrop-blur-[40px] boxShadowLight0 " +
                          (showModels ? " flex" : " hidden") +
                          (props?.theme ? " bg-[#181b20]" : " bg-[#1F2125]")
                        }
                      >
                        <div
                          className={
                            "w-full h-full flex flex-col justify-start items-start overflow-y-scroll pr-[3px]" +
                            (props?.theme ? " scroll2" : " ")
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
                                    : " text-[#a4a4a4]")
                                }
                                onClick={() => {
                                  setCurrentModel(data?.Model);
                                  setShowModels(false);
                                }}
                              >
                                <div
                                  className={
                                    "min-w-[3px] h-[20px] rounded-full mr-[15px]" +
                                    (currentModel == data.Model
                                      ? " bg-[#bcc4d2] flex"
                                      : " bg-transparent hidden")
                                  }
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
                                    className="text-transparent group-hover:text-[#bcc4d2] "
                                  />
                                </div>

                                <div className="flex flex-col justify-start items-start w-[calc(100%-30px)]">
                                  <div
                                    className={
                                      "flex justify-start items-center" +
                                      (props?.theme
                                        ? " group-hover:text-[#ffffff]"
                                        : " group-hover:text-[#ffffff]")
                                    }
                                  >
                                    {data?.Model}{" "}
                                    {index < 4 ? (
                                      <span
                                        className={
                                          "ml-[10px] rounded-[6px] h-[17px] bg-gradient-to-br from-[#ba96fc] to-[#a477f7] text-[black] flex justify-center items-center px-[5px] py-[0px] text-[10px] tracking-wider font-[geistBold] " +
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
                                        ? currentModel == data.Model
                                          ? " text-[#a9b0ba]"
                                          : " text-[#737d8a]"
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
                                  <WifiHigh
                                    width={20}
                                    height={20}
                                    strokeWidth={2}
                                    className="mt-[-7px]"
                                  />
                                </div>
                              </span>
                            );
                          })}
                        </div>
                      </div>
                      <div
                        className={
                          "min-h-[32px] max-h-[32px] px-[10px] rounded-lg flex justify-center items-center cursor-pointer border-[1.5px] max-w-[200px]" +
                          (props?.theme
                            ? " bg-[#181b20] text-[#97a2b0] hover:text-[white] border-[#181b20]"
                            : " bg-[#404148] text-[white]")
                        }
                        onClick={() => {
                          setShowModels(!showModels);
                        }}
                      >
                        <Sparkles
                          width={14}
                          height={14}
                          strokeWidth={2.4}
                          className="mr-[8px]"
                        />
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
                    </div>
                    <div className="flex justify-end items-center ">
                      <Mic
                        width={18}
                        height={18}
                        strokeWidth={2.1}
                        className={
                          "mr-[10px] cursor-pointer " +
                          (props?.theme
                            ? " text-[#97a2b0] hover:text-[#ffffff]"
                            : " text-[#6e6e7c] hover:text-[#000000]")
                        }
                      />
                      <button
                        className={
                          "h-[32px] px-[10px] rounded-lg flex justify-center items-center " +
                          (props?.theme
                            ? message?.trim().length > 0
                              ? " bg-[#ffffff]  text-[#000000] cursor-pointer"
                              : " bg-[#ffffff20] text-[#ffffff40] cursor-default"
                            : " bg-[#404148] text-[white] cursor-pointer")
                        }
                        onClick={() => {
                          if (message?.trim().length > 0) {
                            addUserMessage(message);
                            setLoading(true);
                          }
                        }}
                        style={{ transition: ".15s" }}
                      >
                        <Send
                          width={14}
                          height={14}
                          strokeWidth={2.4}
                          className="mr-[8px]"
                        />
                        Send
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </>
        )}

        {/* <div className="flex justify-center items-center">
        <BrainCircuit
          width={35}
          height={35}
          strokeWidth={2}
          className="mr-[15px]"
        />
        <span className="text-[30px] font-[geistSemibold]">I'm ProbeSeek</span>
      </div>
      <div
        className={
          "mt-[5px] " + (props?.theme ? " text-[#9ba6aa]" : " text-[#6e6e7c]")
        }
      >
        How may I assist you today?
      </div> */}
      </div>
    </>
  );
}
