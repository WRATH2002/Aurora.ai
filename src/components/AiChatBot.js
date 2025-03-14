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
zoomies.register();

export default function AiChatBot(props) {
  const divRef = useRef(null);
  const subDivRef = useRef(null);
  const [aiModels, setAIModels] = useState([
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
  ]);
  const [height, setHeight] = useState(0);
  const [subHeight, setSubHeight] = useState(0);
  const [message, setMessage] = useState("");
  const [showModels, setShowModels] = useState(false);
  const [loading, setLoading] = useState(false);
  const [currentModel, setCurrentModel] = useState("gemini-2.0-flash");
  const [chatHistory, setChatHistory] = useState([]);
  const [activeApiKeyID, setActiveAPIKeyID] = useState("");

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

  useEffect(() => {
    ActiveApiKey();
  }, []);

  useEffect(() => {
    console.log("api key");
    console.log(activeApiKeyID);
  }, [activeApiKeyID]);

  function getFormattedTime() {
    const now = new Date();
    let hours = now.getHours();
    const minutes = now.getMinutes();
    const period = hours >= 12 ? "pm" : "am";

    hours = hours % 12 || 12; // Convert 0 to 12 for 12-hour format
    return `${hours}/${minutes.toString().padStart(2, "0")}_${period}`;
  }

  function addUserMessage(text) {
    let tempData = chatHistory;
    let tempObj = {
      Message: text,
      Date: new Date().getMonth(),
      Time: getFormattedTime(),
      Sender: "User",
    };
    tempData.push(tempObj);
    // setChatHistory((prev) => [...prev, tempObj]);
    setMessage("");
    run(text, formatMessages(tempData));
  }

  function formatMessages(messages) {
    return messages.map((message) => ({
      role: message.Sender === "User" ? "user" : "model", // Use "assistant" as the standard role for models/bots.
      parts: [{ text: message.Message }],
    }));
  }

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

  async function run(text, data) {
    console.log("Ai is Giving Answer. Please wait!");
    const chatSession = model.startChat({
      generationConfig,
      // safetySettings: Adjust safety settings
      // See https://ai.google.dev/gemini-api/docs/safety-settings
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
        Date: 6,
        Time: "02:37_am",
        Sender: "Assistant",
      },
    ]);
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

  useEffect(() => {
    document.querySelectorAll(".bgc").forEach((el) => {
      el.style.backgroundColor = props?.theme ? "#293542" : "#F8F8F8";
    });
  }, [props?.theme]);

  useEffect(() => {
    document.querySelectorAll(".subbgc").forEach((el) => {
      el.style.backgroundColor = props?.theme ? "#394551" : "#e7e7e7";
    });
  }, [props?.theme, chatHistory]);

  function formatText(text, props) {
    let codeBlocks = [];
    let placeholder = "__CODE_BLOCK__";

    // Step 1: Extract and replace code blocks with placeholders
    text = text.replace(/```(.*?)```/gs, (match, p1) => {
      if (p1.trim() === "") return "";

      const lines = p1.trim().split("\n");
      const language = lines[0].trim().toLowerCase();
      const codeLines = lines.slice(1);

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

      let codeBG = props?.theme ? "#293542" : "#F8F8F8"; // Header background
      let codeTOP = props?.theme ? "#394551" : "#e7e7e7"; // Border color
      // const textColor = !props?.theme ? "#000000" : "#FFFFFF";

      const formattedCode = `<div class=" text-white rounded-xl flex flex-col justify-start items-start p-0 pb-1  w-full h-auto whitespace-pre-wrap bgc" >
      <div class=" w-full h-10 flex justify-between items-center px-4 rounded-t-xl subbgc ">
        <span class="">${language}</span>
        <button class="flex justify-end items-center copyHover ${
          props?.theme
            ? "text-[#ffffff] hover:text-[#ffffff]"
            : "text-[#6a6a6a] hover:text-[#000000]"
        }"><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-files"><path d="M20 7h-3a2 2 0 0 1-2-2V2"/><path d="M9 18a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h7l4 4v10a2 2 0 0 1-2 2Z"/><path d="M3 7.6v12.8A1.6 1.6 0 0 0 4.6 22h9.8"/></svg>  copy</button>
      </div>
      <pre class="p-4 w-full overflow-x-scroll snippetScroll "><code class="language-${language}">${escapeHtml(
        code
      )}</code></pre>
    </div>`;

      codeBlocks.push(formattedCode);
      return placeholder;
    });

    // Step 2: Apply text formatting (only on non-code text)

    // Quote
    text = text.replace(
      /> ([^\s].*?)(?=\n|$)/g,
      `<div class="w-full h-auto border-l-[2px] border-[#c7c7c7] pl-[15px]"><span class="quote whitespace-pre-wrap" style="color: gray; font-style: italic;">$1</span></div>`
    );

    // Inline code formatting
    text = text.replace(
      /`([^`]+)`/g,
      (match, p1) =>
        `<code class="bgc " style=" padding : 2px 7px; border-radius : 3px;">${escapeHtml(
          p1
        )}</code>`
    );

    // Bold and Italics text formatting
    text = text.replace(/\*\*\*(.*?)\*\*\*/g, `<b>$1</b>`);

    // Bold text formatting
    text = text.replace(/\*\*(.*?)\*\*/g, `<b>$1</b>`);

    // Italics text formatting
    text = text.replace(/\*(.*?)\*/g, `<b>$1</b>`);

    // Bullet point replacement
    text = text.replace(
      /\* (?!\* |$)/g,
      `<span class = "bullete1 whitespace-pre-wrap">•</span>`
    );

    // Bullet point type-2 replacement
    text = text.replace(
      /\- (?!\- |$)/g,
      `<span class = "bullete2 whitespace-pre-wrap">◦</span>`
    );

    // Bullet point type-3 replacement
    text = text.replace(
      /\+ (?!\+ |$)/g,
      `<span class = "bullete3 whitespace-pre-wrap">▪</span>`
    );

    // Strikethrough replacement
    text = text.replace(
      /~~(.*?)~~/g,
      `<span style="text-decoration: line-through;">$1</span>`
    );

    // Header 4 formatting
    text = text.replace(
      /#### (.*?)(?=\n|$)/g,
      `<b class="he3" style="font-size: 16px; font-family:geistSemibold">$1</b>`
    );

    // Header 3 formatting
    text = text.replace(
      /### (.*?)(?=\n|$)/g,
      `<b class="he3" style="font-size: 18px; font-family:geistSemibold">$1</b>`
    );

    // Header 2 formatting
    text = text.replace(
      /## (.*?)(?=\n|$)/g,
      `<b class="he2" style="font-size: 24px; font-family:geistSemibold">$1</b>`
    );

    // Header 1 formatting
    text = text.replace(
      /# (.*?)(?=\n|$)/g,
      `<b class="he1" style="font-size: 30px; font-family:geistBold">$1</b>`
    );

    // URL formatting
    text = text.replace(
      /(https:\/\/[^\s]+)/g,
      `<a href="$1" class="bold" target="_blank">$1</a>`
    );

    text = text.replace(
      /```([\s\S]*?)```/g,
      (match) => `\`\`\`${match.slice(3, -3)}\`\`\`` // Preserve code blocks
    );

    text = text.replace(
      /\n\|(.+?)\|\n\|(-+\|?)+\n((\|.*?\|\n)+)/g,
      (match, headers, separator, rows) => {
        // Define theme-based styling
        const headerBg = !props?.theme ? "#E7E7E7" : "#000000"; // Header background
        const borderColor = !props?.theme ? "#C3C3C3" : "#000000"; // Border color
        const textColor = !props?.theme ? "#000000" : "#FFFFFF"; // Text color for dark mode readability

        // Convert headers into <th> elements, filtering out empty values
        const headerCells = headers
          .split("|")
          .map((h) => h.trim()) // Trim spaces
          .filter((h) => h.length > 0) // Remove empty columns
          .map(
            (h) =>
              `<th style="background-color: ${headerBg}; color: ${textColor}; padding: 7px 13px; border: 1px solid ${borderColor}; text-align: left; font-family: 'GeistMedium'; display: table-cell; vertical-align: top;">${h}</th>`
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
                    `<td style="padding: 7px 13px; border: 1px solid ${borderColor}; text-align: left; display: table-cell; vertical-align: top; max-width: 100%; word-wrap: break-word;">${cell}</td>`
                )
                .join("")}</tr>`
          )
          .join("");

        // Generate final table HTML with proper outer border and responsive width
        return `<div style="w-full max-width:[100%] overflow-x:scroll " style="border: 2px solid ${borderColor}; overflow: hidden; border-radius: 12px;"><table class="mt-[8px] " style="min-width: 0px; border-collapse: collapse; width: 100%; max-width: 100%; min-width: 100%; border-radius: 13px; "><thead><tr>${headerCells}</tr></thead><tbody>${rowCells}</tbody></table></div>`;
      }
    );

    // Step 3: Restore the formatted code blocks back
    let i = 0;
    text = text.replace(new RegExp(placeholder, "g"), () => codeBlocks[i++]);

    return text;
  }

  // Helper function to escape HTML
  function escapeHtml(unsafe) {
    return unsafe
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#039;");
  }

  return (
    <div
      className={
        "w-full md:w-[calc(100%-250px)] lg:w-[calc(100%-250px)] pb-[10px] md:pb-[30px] lg:pb-[30px] pt-[0px] md:pt-[0px] lg:pt-[0px] h-full flex flex-col justify-center items-center font-[geistRegular]" +
        (props?.theme ? " text-[#ffffff]" : " text-[#000000]")
      }
      // onClick={() => {
      //   setShowModels(false);
      // }}
    >
      {chatHistory?.length > 0 ? (
        <>
          <div className="w-full  h-full flex flex-col justify-end items-center overflow-y-scroll pt-[20px] md:pt-[30px] lg:pt-[30px]">
            <div className="w-[calc(100%-40px)] md:w-[calc(100%-40px)] lg:w-[60%] h-full flex flex-col justify-start items-start  ">
              {chatHistory?.map((data, index) => {
                return (
                  <>
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
                          " rounded-xl flex flex-col justify-start items-start p-[15px] mb-[20px]" +
                          (data?.Sender == "User"
                            ? props?.theme
                              ? " bg-[#293542] px-[15px] max-w-[80%] md:max-w-[70%] lg:max-w-[70%]  w-auto"
                              : " bg-[#F8F8F8] px-[15px] max-w-[80%] md:max-w-[70%] lg:max-w-[70%]  w-auto"
                            : " bg-transparent px-[0px] w-full")
                        }
                      >
                        <div className="flex justify-start items-center">
                          <span className="font-[geistSemibold]">
                            {data?.Sender == "User" ? <>Me</> : <>AI</>}{" "}
                          </span>{" "}
                          <span
                            className={
                              "text-[12px] flex justify-center items-center font-[geistMedium]" +
                              (props?.theme
                                ? " text-[#9ba6aa]"
                                : " text-[#a8a8b1]")
                            }
                          >
                            <span className="mx-[8px] text-[15px] flex justify-center items-center">
                              •
                            </span>
                            {data?.Time}
                          </span>
                        </div>
                        {data?.Sender == "User" ? (
                          <>
                            <pre
                              className="mt-[8px] font-[geistRegular] whitespace-pre-wrap w-full "
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
                              className="mt-[8px] font-[geistRegular] whitespace-pre-wrap w-full "
                              dangerouslySetInnerHTML={{
                                __html: formatText(data?.Message),
                              }}
                            >
                              {/* {data?.Message} */}
                            </pre>
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
              <div
                // key={index}
                className={
                  "w-full justify-start items-start" +
                  (loading ? " flex" : " hidden")
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

                  <l-zoomies
                    size="80"
                    stroke="5"
                    bg-opacity="0.1"
                    speed="1.4"
                    color="black"
                    className="z-0"
                  ></l-zoomies>
                </div>
              </div>

              <div className="w-full min-h-[calc(100%-300px)]"></div>
            </div>
          </div>
          <div
            className={
              "w-full min-h-[120px] max-h-[300px] h-auto flex justify-center items-end z-40 " +
              (props?.theme ? " bg-[#1D2935]" : " bg-[#ffffff]")
            }
            style={{ marginTop: `-${subHeight}px` }}
          >
            <div
              className={
                "w-[calc(100%-40px)] h-auto md:w-[calc(100%-40px)] lg:w-[60%] min-h-[120px] max-h-[300px]  rounded-xl border-[1.5px]  flex flex-col justify-between items-start p-[4px] pt-[7px] z-40 " +
                (props?.theme
                  ? " bg-[#111D2A] border-[#232f3a]"
                  : " bg-[#F8F8F8] border-[#f0f0f0]")
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
                      "w-auto max-w-[350px] md:max-w-[400px] lg:max-w-[400px] min-h-[230px] rounded-lg mb-[6px] p-[3px]   flex-col justify-start items-start border-[1.5px] overflow-y-scroll" +
                      (showModels ? " flex" : " hidden") +
                      (props?.theme
                        ? " bg-[#293542] border-[#2d3945]"
                        : " bg-[#1F2125]")
                    }
                  >
                    {aiModels?.map((data, index) => {
                      return (
                        <span
                          key={index}
                          className={
                            "h-auto p-[7px] py-[5px] my-[1px] group cursor-pointer w-full rounded-[6px]   flex whitespace-nowrap justify-start items-start " +
                            (props?.theme
                              ? currentModel == data.Model
                                ? " text-[white] bg-[#3e4b5a]"
                                : " text-[#97a2b0] hover:bg-[#3e4b5a]"
                              : " text-[#a4a4a4]")
                          }
                          onClick={() => {
                            setCurrentModel(data?.Model);
                            setShowModels(false);
                          }}
                        >
                          <Sparkles
                            width={14}
                            height={14}
                            strokeWidth={2.4}
                            className={
                              "mr-[8px] mt-[4px]" +
                              (props?.theme
                                ? " group-hover:text-[#ffffff]"
                                : " group-hover:text-[#ffffff]")
                            }
                          />
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
                                <span className="ml-[10px] rounded-[6px] border-[1.5px] border-[#465463] flex justify-center items-center px-[6px] py-[2px] text-[12px] h-[20px]  ">
                                  new
                                </span>
                              ) : (
                                <></>
                              )}
                            </div>
                            <div
                              className={
                                "mt-[-3px] text-[12px]" +
                                (props?.theme
                                  ? " text-[#737d8a]"
                                  : " text-[#a4a4a4]")
                              }
                            >
                              {data?.About}
                            </div>
                          </div>
                        </span>
                      );
                    })}
                  </div>
                  <div
                    className={
                      "min-h-[32px] max-h-[32px] px-[10px] rounded-lg flex justify-center items-center cursor-pointer border-[1.5px] max-w-[200px]" +
                      (props?.theme
                        ? " bg-[#293542] hover:bg-[#344352] text-[#97a2b0] hover:text-[white] border-[#2d3945]"
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
                  <div
                    className={
                      "h-[32px] px-[10px] rounded-lg flex justify-center items-center  border-[1.5px]" +
                      (props?.theme
                        ? message?.trim().length > 0
                          ? " bg-[#293542] hover:bg-[#344352] text-[#ffffff] hover:text-[white] hover:border-[#3d4b59] border-[#2d3945] cursor-pointer"
                          : " bg-[#1c2734] text-[#5f666e] border-[#2d3945] cursor-default"
                        : " bg-[#404148] text-[white] cursor-pointer")
                    }
                    onClick={() => {
                      if (message?.trim().length > 0) {
                        addUserMessage(message);
                        setLoading(true);
                      }
                    }}
                  >
                    <Send
                      width={14}
                      height={14}
                      strokeWidth={2.4}
                      className="mr-[8px]"
                    />
                    Send
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
              <BrainCircuit
                width={35}
                height={35}
                strokeWidth={2}
                className="mr-[15px]"
              />
              <span className="text-[30px] font-[geistSemibold]">
                I'm ProbeSeek
              </span>
            </div>
            <div
              className={
                "mt-[5px] " +
                (props?.theme ? " text-[#9ba6aa]" : " text-[#6e6e7c]")
              }
            >
              How may I assist you today?
            </div>
            <div
              className={
                "w-full flex justify-center items-center z-40 mt-[60px] " +
                (props?.theme ? " bg-[#1D2935]" : " bg-[#ffffff]")
              }
              // style={{ height: `${height}px` }}
            >
              <div
                className={
                  "w-[calc(100%-40px)] md:w-[calc(100%-40px)] lg:w-[60%] h-auto min-h-[120px] max-h-[300px]  rounded-xl border-[1.5px]  flex flex-col justify-between items-start p-[4px] pt-[7px] z-40 " +
                  (props?.theme
                    ? " bg-[#111D2A] border-[#232f3a]"
                    : " bg-[#F8F8F8] border-[#f0f0f0]")
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
                        "w-auto max-w-[350px] md:max-w-[400px] lg:max-w-[400px] min-h-[230px] rounded-lg mb-[6px] p-[3px]   flex-col justify-start items-start border-[1.5px] overflow-y-scroll" +
                        (showModels ? " flex" : " hidden") +
                        (props?.theme
                          ? " bg-[#293542] border-[#2d3945]"
                          : " bg-[#1F2125]")
                      }
                    >
                      {aiModels?.map((data, index) => {
                        return (
                          <span
                            key={index}
                            className={
                              "h-auto p-[7px] py-[5px] my-[1px] group cursor-pointer w-full rounded-[6px]   flex whitespace-nowrap justify-start items-start " +
                              (props?.theme
                                ? currentModel == data.Model
                                  ? " text-[white] bg-[#3e4b5a]"
                                  : " text-[#97a2b0] hover:bg-[#3e4b5a]"
                                : " text-[#a4a4a4]")
                            }
                            onClick={() => {
                              setCurrentModel(data?.Model);
                              setShowModels(false);
                            }}
                          >
                            <Sparkles
                              width={14}
                              height={14}
                              strokeWidth={2.4}
                              className={
                                "mr-[8px] mt-[4px]" +
                                (props?.theme
                                  ? " group-hover:text-[#ffffff]"
                                  : " group-hover:text-[#ffffff]")
                              }
                            />
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
                                  <span className="ml-[10px] rounded-[6px] border-[1.5px] border-[#465463] flex justify-center items-center px-[6px] py-[2px] text-[12px] h-[20px]  ">
                                    new
                                  </span>
                                ) : (
                                  <></>
                                )}
                              </div>
                              <div
                                className={
                                  "mt-[-3px] text-[12px]" +
                                  (props?.theme
                                    ? " text-[#737d8a]"
                                    : " text-[#a4a4a4]")
                                }
                              >
                                {data?.About}
                              </div>
                            </div>
                          </span>
                        );
                      })}
                    </div>
                    <div
                      className={
                        "min-h-[32px] max-h-[32px] px-[10px] rounded-lg flex justify-center items-center cursor-pointer border-[1.5px] max-w-[200px]" +
                        (props?.theme
                          ? " bg-[#293542] hover:bg-[#344352] text-[#97a2b0] hover:text-[white] border-[#2d3945]"
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
                    <div
                      className={
                        "h-[32px] px-[10px] rounded-lg flex justify-center items-center  border-[1.5px]" +
                        (props?.theme
                          ? message?.trim().length > 0
                            ? " bg-[#293542] hover:bg-[#344352] text-[#ffffff] hover:text-[white] hover:border-[#3d4b59] border-[#2d3945] cursor-pointer"
                            : " bg-[#1c2734] text-[#5f666e] border-[#2d3945] cursor-default"
                          : " bg-[#404148] text-[white] cursor-pointer")
                      }
                      onClick={() => {
                        if (message?.trim().length > 0) {
                          addUserMessage(message);
                          setLoading(true);
                        }
                      }}
                    >
                      <Send
                        width={14}
                        height={14}
                        strokeWidth={2.4}
                        className="mr-[8px]"
                      />
                      Send
                    </div>
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
  );
}
