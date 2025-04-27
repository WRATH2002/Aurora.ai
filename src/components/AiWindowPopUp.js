import {
  ChevronLeft,
  ChevronRight,
  ChevronsLeftRightEllipsis,
  Copy,
  Files,
  RefreshCw,
  RotateCcw,
  Sparkles,
  ThumbsDown,
  ThumbsUp,
  Volume2,
} from "lucide-react";
import React, { useEffect, useState } from "react";
import { Rnd } from "react-rnd";
import TypingEffect from "./TypingEffect";
import { GoogleGenerativeAI } from "@google/generative-ai";
import APILimitError from "./APILimitError";
import { auth, db } from "../firebase";
import {
  arrayRemove,
  arrayUnion,
  onSnapshot,
  serverTimestamp,
} from "firebase/firestore";
import firebase from "../firebase";
import { onAuthStateChanged } from "firebase/auth";
import { processStringDecrypt } from "../utils/functions";

export default function AiWindowPopUp(props) {
  const [isLiked, setIsLiked] = useState("");
  const [copied, setCopied] = useState(false);
  const [activeIndex, setActiveIndex] = useState(0);
  const [aiError, setAiError] = useState(false);
  const [aiErrorMessage, setAiErrorMessage] = useState("");
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

  function copyToClipboard(text) {
    // const text = "Add note at cursor location";
    navigator.clipboard
      .writeText(text)
      .then(() => {
        console.log("Text copied to clipboard");
      })
      .catch((err) => {
        console.error("Failed to copy text: ", err);
      });
  }

  const [dimensions, setDimensions] = useState({
    width: 500,
    height: 300,
    x: 0, // Initial horizontal position, to be calculated
    y: 50, // 50px down from the top
  });

  const [isInitialPositionSet, setIsInitialPositionSet] = useState(false);

  useEffect(() => {
    if (!isInitialPositionSet) {
      // Calculate the initial horizontal center position
      const centerX = (window.innerWidth - dimensions.width) / 2;
      setDimensions((prev) => ({ ...prev, x: centerX }));
      setIsInitialPositionSet(true);
    }
  }, [isInitialPositionSet, dimensions.width]);

  const genAI = new GoogleGenerativeAI(processStringDecrypt(activeApiKeyID));
  const model = genAI.getGenerativeModel({
    model: "gemini-2.0-flash",
  });

  const generationConfig = {
    temperature: 1,
    top_p: 0.95,
    top_k: 64,
    max_output_tokens: 8192,
    response_mime_type: "text/plain",
  };

  function myPromise() {
    return new Promise((resolve, reject) => {
      // Simulate an asynchronous operation
      setTimeout(() => {
        resolve("Hello, World!");
      }, 1000); // Resolves after 1 second
    });
  }

  async function run(chosenPrompt) {
    console.log("generating text");
    const chatSession = model.startChat({
      generationConfig,
      // safetySettings: Adjust safety settings
      // See https://ai.google.dev/gemini-api/docs/safety-settings
      history: [],
    });
    // const result = await myPromise();

    try {
      const result = await chatSession.sendMessage(
        `${chosenPrompt}` +
          `

      ` +
          "     Regenerate the following text while maintaining the same format, style, and structure as the original output. Ensure the tone, level of detail, and type of output remain consistent. Do not include formatting-related symbols like *, -, or ``` for emphasis, but normal special characters, punctuation, and emojis are allowed. Provide only the regenerated text without any additional commentary or instructions."
      );

      console.log(result?.response?.text());
      props?.setLoading(false);

      let temp = props?.AiOutput;
      let arr = props?.AiOutput[0]?.Message;
      console.log(arr);
      arr.push(result?.response?.text());
      let temp2 = {
        Section: temp[0]?.Section,
        Message: arr,
      };
      console.log(temp2);

      console.log(temp2);
      props?.setAiOutput([temp2]);
    } catch (error) {
      props?.setLoading(false);
      console.log(error);
      let errorMessage =
        "An unexpected error occurred. Please try again later.";

      // Check if the error is related to the quota being exceeded
      if (error?.response?.status === 429) {
        errorMessage = "It seems you've reached your AI quota limit.";
      } else if (error?.message) {
        errorMessage = `Error: ${error.message}`;
      }

      // Show a popup with the error message
      setAiErrorMessage(errorMessage);
      setAiError(true);
    }

    // replaceSelectedTextt(result?.response?.text(), selection);
  }

  useEffect(() => {
    console.log("after chanfe");
    console.log(props?.AiOutput);
  }, [props?.AiOutput]);

  useEffect(() => {
    setActiveIndex(props?.AiOutput[0]?.Message.length - 1);
  }, [props?.AiOutput[0]?.Message.length]);

  return (
    <>
      {/* <div
        className="w-full h-[100svh] fixed left-0 top-0 flex justify-center  overflow-hidden"
        style={{
          zIndex: "0",
        }}
      > */}
      {aiError ? (
        <APILimitError
          setAiError={setAiError}
          setAiErrorMessage={setAiErrorMessage}
          aiErrorMessage={aiErrorMessage}
        />
      ) : (
        <></>
      )}
      <Rnd
        size={{ width: dimensions.width, height: dimensions.height }}
        position={{ x: dimensions.x, y: dimensions.y }}
        bounds="window" // Restrict movement within parent
        minWidth={350} // Set minimum width
        minHeight={250} // Set minimum height
        onDragStop={(e, d) => {
          setDimensions((prev) => ({
            ...prev,
            x: d.x,
            y: d.y,
          }));
        }}
        onResizeStop={(e, direction, ref, delta, position) => {
          setDimensions({
            width: ref.offsetWidth,
            height: ref.offsetHeight,
            ...position,
          });
        }}
        className="rounded-xl flex flex-col justify-center items-center font-[DMSr] fixed   "
        style={{
          // transform: "translateX(-50%)",
          zIndex: "500",
        }}
      >
        <div className="w-full h-[18px] flex justify-between items-center mb-[-16px] z-[100]">
          <svg
            width="18"
            height="18"
            className="-rotate-90 "
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M2 2 H4 A12 12 0 0 1 16 14 V16"
              stroke="#d3d3d3"
              stroke-width="4"
              fill="none"
              stroke-linecap="round"
            />
          </svg>
          <svg
            width="18"
            height="18"
            className=""
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M2 2 H4 A12 12 0 0 1 16 14 V16"
              stroke="#d3d3d3"
              stroke-width="4"
              fill="none"
              stroke-linecap="round"
            />
          </svg>
        </div>
        <div
          className="w-[calc(100%-4px)] ml-[2px] h-[calc(100%-4px)] rounded-xl border-[1.5px] border-[#2f2f2f12] bg-[#ffffff] boxShadowLight1  flex flex-col justify-start items-start font-[DMSr] text-[18px]"
          // style={{ transform: "translateX(-50%)", zIndex: "300" }}
        >
          <div className="w-full h-[45px] flex justify-start items-center border-b-[1.5px] border-b-[#2f2f2f12] px-[20px]">
            <Sparkles
              width={16}
              height={16}
              strokeWidth={2}
              className="mr-[5px]"
            />{" "}
            AI Edit
            {props?.AiSection?.split("/")?.map((data, index) => {
              return (
                <>
                  <ChevronRight
                    width={18}
                    height={18}
                    strokeWidth={2.5}
                    className="mx-[5px]"
                  />
                  {data}
                </>
              );
            })}
          </div>
          <div className="w-full h-[calc(100%-45px)] flex flex-col justify-start items-start pb-[20px] px-[5px]">
            <span className="text-[14px] w-full min-h-[calc(100%-0px)] max-h-[calc(100%-0px)] overflow-y-scroll px-[15px] pt-[20px] mb-[20px] aiScrollBar ">
              {props?.loading ? (
                <div className="loading-container flex flex-col justify-start items-start min-w-full px-[10px]">
                  <div className="loading-bar-1  "></div>
                  <div className="loading-bar-2 my-[6px] "></div>
                  <div className="loading-bar-3  "></div>
                </div>
              ) : (
                <>
                  <TypingEffect
                    data={props?.AiOutput[0]}
                    activeIndex={activeIndex}
                    setActiveIndex={setActiveIndex}
                  />

                  <div className="w-full h-[30px] text-[14px] flex justify-between items-center mt-[5px] ">
                    <div className="flex justify-start items-center">
                      <div className="h-[28px] w-[28px] rounded-md hover:bg-[#f0f0f0] text-[#5D5D5D] cursor-pointer flex justify-center items-center mr-[2px]">
                        <Volume2
                          width={16}
                          height={16}
                          strokeWidth={2.2}
                          className=""
                        />
                      </div>
                      <div
                        className="h-[28px] w-[28px] rounded-md hover:bg-[#f0f0f0] text-[#5D5D5D] cursor-pointer flex justify-center items-center mr-[2px]"
                        onClick={() => {
                          run(
                            props?.AiOutput[0]?.Message[
                              props?.AiOutput[0]?.Message.length - 1
                            ]
                          );
                          props?.setLoading(true);
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
                          "h-[28px] w-[28px] rounded-md hover:bg-[#f0f0f0] text-[#5D5D5D] cursor-pointer justify-center items-center mr-[2px]" +
                          (isLiked == "like" || isLiked.length == 0
                            ? " flex"
                            : " hidden")
                        }
                        onClick={() => {
                          setIsLiked("like");
                        }}
                      >
                        <ThumbsUp
                          width={16}
                          height={16}
                          strokeWidth={2.2}
                          fill={isLiked == "like" ? "currentColor" : "none"}
                          className=""
                        />
                      </div>
                      <div
                        className={
                          "h-[28px] w-[28px] rounded-md hover:bg-[#f0f0f0] text-[#5D5D5D] cursor-pointer justify-center items-center mr-[2px]" +
                          (isLiked == "dislike" || isLiked.length == 0
                            ? " flex"
                            : " hidden")
                        }
                        onClick={() => {
                          setIsLiked("dislike");
                        }}
                      >
                        <ThumbsDown
                          width={16}
                          height={16}
                          strokeWidth={2.2}
                          fill={isLiked == "dislike" ? "currentColor" : "none"}
                          className=""
                        />
                      </div>
                      <div
                        className="h-[28px] w-[28px] rounded-md hover:bg-[#f0f0f0] text-[#5D5D5D] cursor-pointer flex justify-center items-center"
                        onClick={() => {
                          copyToClipboard(
                            props?.AiOutput[0]?.Message[activeIndex]
                          );
                          setCopied(true);
                          setTimeout(() => {
                            setCopied(false);
                          }, 2000);
                        }}
                      >
                        <Copy
                          width={16}
                          height={16}
                          strokeWidth={2.2}
                          className=""
                        />
                      </div>
                      <div
                        className={
                          "h-[28px] px-[7px] rounded-md bg-[#f0f0f0] text-[#5D5D5D] cursor-pointer justify-center flex items-center mr-[2px]" +
                          (copied
                            ? " opacity-100 scale-100"
                            : " opacity-0 scale-75")
                        }
                        style={{ transition: ".1s" }}
                      >
                        Copied !
                      </div>
                    </div>
                    <div className="flex justify-end items-center">
                      <span
                        className={
                          "mr-[5px] cursor-pointer h-[28px] w-[28px] rounded-md  flex justify-center items-center" +
                          (activeIndex == 0
                            ? " text-[#aaaaaa]"
                            : " text-[#5D5D5D] hover:bg-[#f0f0f0]")
                        }
                        onClick={() => {
                          if (activeIndex - 1 < 0) {
                          } else {
                            setActiveIndex(activeIndex - 1);
                          }
                        }}
                      >
                        <ChevronLeft
                          width={16}
                          height={16}
                          strokeWidth={2.2}
                          className=""
                        />
                      </span>{" "}
                      {activeIndex + 1} / {props?.AiOutput[0]?.Message?.length}{" "}
                      <span
                        className={
                          "ml-[5px] cursor-pointer h-[28px] w-[28px] rounded-md  flex justify-center items-center" +
                          (activeIndex ==
                          props?.AiOutput[0]?.Message?.length - 1
                            ? " text-[#aaaaaa]"
                            : " text-[#5D5D5D] hover:bg-[#f0f0f0]")
                        }
                        onClick={() => {
                          if (
                            activeIndex + 1 >=
                            props?.AiOutput[0]?.Message?.length
                          ) {
                          } else {
                            setActiveIndex(activeIndex + 1);
                          }
                        }}
                      >
                        <ChevronRight
                          width={16}
                          height={16}
                          strokeWidth={2.2}
                          className=""
                        />
                      </span>
                    </div>
                  </div>
                </>
              )}
            </span>
          </div>
        </div>
        <div className="w-full h-[18px] flex justify-between items-center mt-[-16px] z-[100]">
          <svg
            width="18"
            height="18"
            className="rotate-180 "
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M2 2 H4 A12 12 0 0 1 16 14 V16"
              stroke="#d3d3d3"
              stroke-width="4"
              fill="none"
              stroke-linecap="round"
            />
          </svg>
          <svg
            width="18"
            height="18"
            className="rotate-90"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M2 2 H4 A12 12 0 0 1 16 14 V16"
              stroke="#d3d3d3"
              stroke-width="4"
              fill="none"
              stroke-linecap="round"
            />
          </svg>
        </div>
      </Rnd>
      {/* </div> */}
      {/* <div
        className="w-[500px] h-[300px] rounded-xl fixed top-[50px] left-[50%] flex flex-col justify-center items-center font-[DMSr]"
        style={{ transform: "translateX(-50%)", zIndex: "300" }}
      >
        <div className="w-full h-[18px] flex justify-between items-center mb-[-16px] z-[100]">
          <svg
            width="18"
            height="18"
            className="-rotate-90 "
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M2 2 H4 A12 12 0 0 1 16 14 V16"
              stroke="#d3d3d3"
              stroke-width="4"
              fill="none"
              stroke-linecap="round"
            />
          </svg>
          <svg
            width="18"
            height="18"
            className=""
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M2 2 H4 A12 12 0 0 1 16 14 V16"
              stroke="#d3d3d3"
              stroke-width="4"
              fill="none"
              stroke-linecap="round"
            />
          </svg>
        </div>
        <div
          className="w-[calc(100%-4px)] h-[calc(100%-4px)] rounded-xl border-[1.5px] border-[#2f2f2f12] bg-white boxShadowLight1  flex flex-col justify-start items-start font-[DMSr] text-[18px]"
          // style={{ transform: "translateX(-50%)", zIndex: "300" }}
        >
          <div className="w-full h-[45px] flex justify-start items-center border-b-[1.5px] border-b-[#2f2f2f12] px-[20px]">
            <Sparkles
              width={16}
              height={16}
              strokeWidth={2}
              className="mr-[5px]"
            />{" "}
            AI Edit
            {props?.AiSection?.split("/")?.map((data, index) => {
              return (
                <>
                  <ChevronRight
                    width={18}
                    height={18}
                    strokeWidth={2.5}
                    className="mx-[5px]"
                  />
                  {data}
                </>
              );
            })}
          </div>
          <div className="w-full h-[calc(100%-45px)] flex flex-col justify-start items-start pb-[20px] px-[5px]">
           
            <span className="text-[14px] w-full min-h-[calc(100%-0px)] max-h-[calc(100%-0px)] overflow-y-scroll px-[15px] pt-[20px] mb-[20px] ">
              {props?.loading ? (
                <div className="loading-container flex flex-col justify-start items-start min-w-full px-[10px]">
                  <div className="loading-bar-1  "></div>
                  <div className="loading-bar-2 my-[6px] "></div>
                  <div className="loading-bar-3  "></div>
                </div>
              ) : (
                <>
                  <TypingEffect
                    text={props?.AiOutput} // Adjust initial opacity if desired
                  />

                  <div className="w-full h-[30px] text-[14px] flex justify-start items-center mt-[0px]">
                    <div className="h-[28px] w-[28px] rounded-md hover:bg-[#f0f0f0] text-[#5D5D5D] cursor-pointer flex justify-center items-center mr-[2px]">
                      <Volume2
                        width={16}
                        height={16}
                        strokeWidth={2.2}
                        className=""
                      />
                    </div>
                    <div className="h-[28px] w-[28px] rounded-md hover:bg-[#f0f0f0] text-[#5D5D5D] cursor-pointer flex justify-center items-center mr-[2px]">
                      <RefreshCw
                        width={16}
                        height={16}
                        strokeWidth={2.2}
                        className=""
                      />
                    </div>
                    <div
                      className={
                        "h-[28px] w-[28px] rounded-md hover:bg-[#f0f0f0] text-[#5D5D5D] cursor-pointer justify-center items-center mr-[2px]" +
                        (isLiked == "like" || isLiked.length == 0
                          ? " flex"
                          : " hidden")
                      }
                      onClick={() => {
                        setIsLiked("like");
                      }}
                    >
                      <ThumbsUp
                        width={16}
                        height={16}
                        strokeWidth={2.2}
                        fill={isLiked == "like" ? "currentColor" : "none"}
                        className=""
                      />
                    </div>
                    <div
                      className={
                        "h-[28px] w-[28px] rounded-md hover:bg-[#f0f0f0] text-[#5D5D5D] cursor-pointer justify-center items-center mr-[2px]" +
                        (isLiked == "dislike" || isLiked.length == 0
                          ? " flex"
                          : " hidden")
                      }
                      onClick={() => {
                        setIsLiked("dislike");
                      }}
                    >
                      <ThumbsDown
                        width={16}
                        height={16}
                        strokeWidth={2.2}
                        fill={isLiked == "dislike" ? "currentColor" : "none"}
                        className=""
                      />
                    </div>
                    <div
                      className="h-[28px] w-[28px] rounded-md hover:bg-[#f0f0f0] text-[#5D5D5D] cursor-pointer flex justify-center items-center"
                      onClick={() => {
                        copyToClipboard(props?.AiOutput);
                        setCopied(true);
                        setTimeout(() => {
                          setCopied(false);
                        }, 2000);
                      }}
                    >
                      <Copy
                        width={16}
                        height={16}
                        strokeWidth={2.2}
                        className=""
                      />
                    </div>
                    <div
                      className={
                        "h-[28px] px-[7px] rounded-md bg-[#f0f0f0] text-[#5D5D5D] cursor-pointer justify-center flex items-center mr-[2px]" +
                        (copied
                          ? " opacity-100 scale-100"
                          : " opacity-0 scale-75")
                      }
                      style={{ transition: ".1s" }}
                    >
                      Copied !
                    </div>
                  </div>
                </>
              )}
            </span>
          </div>
        </div>
        <div className="w-full h-[18px] flex justify-between items-center mt-[-16px] z-[100]">
          <svg
            width="18"
            height="18"
            className="rotate-180 "
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M2 2 H4 A12 12 0 0 1 16 14 V16"
              stroke="#d3d3d3"
              stroke-width="4"
              fill="none"
              stroke-linecap="round"
            />
          </svg>
          <svg
            width="18"
            height="18"
            className="rotate-90"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M2 2 H4 A12 12 0 0 1 16 14 V16"
              stroke="#d3d3d3"
              stroke-width="4"
              fill="none"
              stroke-linecap="round"
            />
          </svg>
        </div>
      </div> */}
    </>
  );
}
