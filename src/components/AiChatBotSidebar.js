import React, { useEffect, useRef, useState } from "react";
import {
  CaseSensitive,
  Command,
  CornerDownRight,
  GitBranchPlus,
  MessageSquare,
  MoveRight,
  Satellite,
  Search,
  Trash,
  X,
} from "lucide-react";

const aiChatNames = [
  "DeepMind Conversational Assistant for Thoughtful and Engaging Discussions",
  "SmartAI Chat Companion with Contextual Awareness and Emotional Intelligence",
  "HyperBrain Virtual Assistant for Advanced AI-Powered Conversations and Insights",
  "NeuralNet Genius Chatbot with Adaptive Learning and Smart Reply System",
  "Gemini AI Chat Pro with DeepThink Mode for Comprehensive Explanations",
  "QuantumTalk AI: The Intelligent Chatbot for Logical and Meaningful Dialogue",
  "AI Sage Companion for Thoughtful Conversations and Knowledge Sharing",
  "EvolveAI Chat with Context Retention and Predictive Response System",
  "ChatNova AI: The Future of Interactive Conversations and AI Thinking",
  "EchoMind AI: Your Conversational Partner for Thoughtful and Smart Dialogues",
  "SentientAI Talkbot with Advanced NLP and Emotion Recognition Capabilities",
  "InfinityBot AI: Conversational Assistant with Deep Learning and Smart Responses",
  "NeuraThink Chat: AI-Powered Chatbot for Deep Conversations and Quick Replies",
  "CerebralChat AI with Advanced Reasoning and Intuitive Conversational Flow",
  "SymphonyAI Conversational Engine for Engaging and Intelligent Discussions",
  "LumiAI Smart Chat Assistant for In-Depth Analysis and Fast Responses",
  "DeepThinker Chatbot for Insightful, Smart, and Engaging AI Conversations",
  "Visionary AI Chatbot with Enhanced Memory and Contextual Understanding",
  "EchoBrain Conversational AI for Dynamic and Thoughtful Human-Like Dialogues",
  "OmniMind AI Chat Assistant for Real-Time Conversations and Thoughtful Replies",
  "CerebralChat AI with Advanced Reasoning and Intuitive Conversational Flow",
  "SymphonyAI Conversational Engine for Engaging and Intelligent Discussions",
  "LumiAI Smart Chat Assistant for In-Depth Analysis and Fast Responses",
  "DeepThinker Chatbot for Insightful, Smart, and Engaging AI Conversations",
  "Visionary AI Chatbot with Enhanced Memory and Contextual Understanding",
  "EchoBrain Conversational AI for Dynamic and Thoughtful Human-Like Dialogues",
  "OmniMind AI Chat Assistant for Real-Time Conversations and Thoughtful Replies",
];

export default function AiChatBotSidebar(props) {
  return (
    <>
      {props?.searchChat ? (
        <SearchChat
          aiChatNames={aiChatNames}
          setSearchChat={props?.setSearchChat}
          searchChat={props?.searchChat}
          theme={props?.theme}
        />
      ) : (
        <></>
      )}

      <div className="w-[250px] h-full bg-transparent rounded-l-lg hidden md:flex lg:flex flex-col justify-start items-start px-[30px] md:px-[7px] lg:px-[7px] overflow-y-scroll">
        <div className="w-full ">
          <Search
            width={18}
            height={18}
            strokeWidth={1.8}
            className=""
            onClick={() => {
              props?.setSearchChat(!props?.searchChat);
            }}
          />
        </div>
        {aiChatNames?.map((data, index) => {
          return (
            <div
              key={index}
              className={
                "w-full min-h-[37px] group rounded-lg flex justify-start items-center px-[10px] cursor-pointer" +
                (props?.theme
                  ? " hover:bg-[#36424E] text-[#9ba6aa] hover:text-[#ffffff]"
                  : " text-[#6e6e7c] hover:text-[#000000]")
              }
            >
              <div className="w-[30px] flex justify-start items-center">
                <MessageSquare
                  width={18}
                  height={18}
                  strokeWidth={1.8}
                  className=""
                />
              </div>
              <div
                className="w-[calc(100%-30px)] group-hover:w-[calc(100%-60px)] text-ellipsis overflow-hidden whitespace-nowrap"
                style={{ transition: ".2s" }}
              >
                {data}
              </div>
              <div
                className="w-[0px] group-hover:w-[30px] overflow-hidden flex justify-end items-center"
                style={{ transition: ".2s" }}
              >
                <Trash width={18} height={18} strokeWidth={1.8} className="" />
              </div>
            </div>
          );
        })}
      </div>
    </>
  );
}

const SearchChat = (props) => {
  const [searchPrompt, setSearchPrompt] = useState("");
  const [resultArr, setResultArr] = useState([]);
  const [caseSensitive, setCaseSensitive] = useState(false);
  const debounceRef = useRef(null);

  function filterBySection(searchPrompt) {
    if (searchPrompt.length == 0) {
      setResultArr(aiChatNames);
    } else {
      if (caseSensitive) {
        setResultArr(
          props?.aiChatNames.filter((data) => data?.includes(searchPrompt))
        );
      } else {
        setResultArr(
          props?.aiChatNames.filter((data) =>
            data?.toLowerCase()?.includes(searchPrompt.toLowerCase())
          )
        );
      }
    }
  }

  useEffect(() => {
    filterBySection(searchPrompt);
  }, [caseSensitive]);

  useEffect(() => {
    const handler = setTimeout(() => {
      filterBySection(searchPrompt);
    }, 300);

    return () => {
      clearTimeout(handler);
    };
  }, [searchPrompt]);

  useEffect(() => {
    const handleEsc = (event) => {
      if (event.key === "Escape") {
        props?.setSearchChat(false);
      }
    };

    document.addEventListener("keydown", handleEsc);

    return () => {
      document.removeEventListener("keydown", handleEsc);
    };
  }, []);

  return (
    <div
      className={
        "w-full h-[100svh] fixed left-0 top-0 flex justify-center items-center z-50 backdrop-blur-[5px]" +
        (props?.theme ? " bg-[#161b1e5c]" : " bg-[#b0b0b081]")
      }
    >
      <div
        className="w-[90%] md:w-[540px] lg:w-[540px] flex flex-col justify-start items-start  h-[500px]"
        // style={{ transform: "translate(-50%, -50%)" }}
      >
        <div className="w-full flex justify-center items-center mb-[10px]">
          <div
            className={
              "h-[35px] boxShadowLight2 flex justify-center items-center px-[10px] pr-[5px] rounded-lg py-[5px] cursor-pointer border-[1.5px]" +
              (props?.theme
                ? " text-[#9ba6aa] hover:text-[#ffffff] bg-[#1D2935] border-[#25303c]"
                : " text-[#6e6e7c] hover:text-[#000000] bg-[#1D2935] border-[#25303c]")
            }
            onClick={() => {
              props?.setSearchChat(false);
            }}
          >
            <X width="16" height="16" strokeWidth="2.5" className="mr-[6px]" />{" "}
            Close{" "}
            <div
              className={
                " h-[23px] ml-[10px] rounded-[4px] flex justify-center items-center text-[12px] px-[7px] cursor-default border-[1.5px]" +
                (props?.theme
                  ? " bg-[#36424E] text-[#9ba6aa] border-[#404b56]"
                  : " bg-[#36424E] text-[#6e6e7c] border-[#404b56]")
              }
            >
              <Command
                width="12"
                height="12"
                strokeWidth="2.2"
                className="mr-[4px]"
              />
              Esc
            </div>
          </div>
        </div>
        <div
          className="w-full flex flex-col justify-start items-start rounded-2xl max-h-[calc(100%-45px)] h-auto bg-[#1D2935] border-[#25303c] boxShadowLight2 px-[7px] py-[7px] font-[geistRegular] text-[14px] border-[1.5px]"
          style={{ transition: ".2s" }}
        >
          <div className="flex justify-between items-center w-full px-[10px]">
            <div
              className={"flex justify-start items-center w-[30px]  "}
              onClick={() => {
                //   setSearchPrompt("");
              }}
            >
              <Search width="16" height="16" strokeWidth="2.2" />
            </div>
            <input
              className={
                " bg-transparent h-[35px] outline-none text-[14px] pr-[20px]" +
                (searchPrompt.length == 0
                  ? " w-[calc(100%-60px)]"
                  : " w-[calc(100%-90px)]")
              }
              placeholder="Search in Splitwise ..."
              value={searchPrompt}
              onChange={(e) => {
                setSearchPrompt(e.target.value);
              }}
            ></input>
            <div
              className={
                "flex justify-center items-center w-[30px] h-[30px] rounded-[6px] cursor-pointer " +
                (!caseSensitive
                  ? props?.theme
                    ? " text-[#9ba6aa] hover:text-[#ffffff]"
                    : " text-[#6e6e7c] hover:text-[#000000]"
                  : props?.theme
                  ? " text-[#ffffff] bg-[#36424E]"
                  : " text-[#000000] bg-[#36424E]")
              }
              onClick={() => {
                setCaseSensitive(!caseSensitive);
              }}
            >
              <CaseSensitive width="16" height="16" strokeWidth="2.2" />
            </div>
            <div
              className={
                "justify-end items-center w-[30px] cursor-pointer " +
                (searchPrompt.length > 0 ? " flex" : " hidden")
              }
              onClick={() => {
                setSearchPrompt("");
              }}
            >
              <X width="16" height="16" strokeWidth="2.2" />
            </div>
          </div>
          <div className="w-full border-t-[1.5px] border-[#2b3642] mt-[7px] mb-[6px]"></div>
          <div className="w-full flex flex-col justify-start items-start h-[calc(100%-45.5px)] overflow-y-auto ">
            {searchPrompt.length == 0 && resultArr.length == 0 ? (
              <>
                <div
                  className={
                    "py-[7px] h-[35px] w-full cursor-pointer flex justify-center items-center my-[1px] px-[10px] rounded-[6px]" +
                    (props?.theme
                      ? " text-[#9ba6aa] "
                      : " text-[#6e6e7c] hover:text-[#000000] border-[#e9e9e9]")
                  }
                >
                  <div
                    className={
                      "flex justify-start items-center w-[30px] cursor-pointer mt-[3px] "
                    }
                    onClick={() => {
                      // setSearchPrompt("");
                    }}
                  >
                    <Satellite width="16" height="16" strokeWidth="2.2" />
                  </div>
                  <div className="w-auto">No Chats</div>
                </div>
              </>
            ) : searchPrompt.length > 0 && resultArr.length == 0 ? (
              <>
                {" "}
                <div
                  className={
                    "py-[7px] h-[35px] w-full cursor-pointer flex justify-start items-start my-[1px] px-[10px] rounded-[6px]" +
                    (props?.theme
                      ? " hover:bg-[#36424E] text-[#818b8f] hover:text-[#ffffff] "
                      : " text-[#6e6e7c] hover:text-[#000000] border-[#e9e9e9]")
                  }
                  onClick={() => {
                    //   setSection(data);
                  }}
                >
                  <div
                    className={
                      "flex justify-start items-center w-[30px] cursor-pointer mt-[3px] "
                    }
                    onClick={() => {
                      setSearchPrompt("");
                    }}
                  >
                    <GitBranchPlus width="16" height="16" strokeWidth="2.2" />
                  </div>
                  <div className="w-[calc(100%-120px)] flex justify-start items-center h-full ">
                    <div className="w-auto  text-ellipsis overflow-hidden whitespace-nowrap  max-[calc(100%-100px)] ">
                      {searchPrompt}
                    </div>
                    <div className="w-[90px] ml-[10px] flex justify-start items-center whitespace-nowrap h-full">
                      <MoveRight
                        width="12"
                        height="12"
                        strokeWidth="2.5"
                        className="mr-[4px]"
                      />{" "}
                      <span className="ml-[5px] text-[12px] flex justify-start items-center h-full">
                        create chat
                      </span>
                    </div>
                  </div>
                  <div
                    className={
                      "flex justify-end items-center w-[90px] h-full" +
                      (props?.theme ? " text-[#818b8f] " : " text-[#6e6e7c] ")
                    }
                  >
                    <CornerDownRight
                      width="12"
                      height="12"
                      strokeWidth="2.5"
                      className="mr-[4px]"
                    />
                    <span className="text-[12px] whitespace-nowrap">
                      Alt + Enter
                    </span>
                  </div>
                </div>
                <div
                  className={
                    "py-[7px] h-[35px] w-full cursor-pointer flex justify-center items-center my-[1px] px-[10px] rounded-[6px]" +
                    (props?.theme
                      ? " text-[#9ba6aa] "
                      : " text-[#6e6e7c] hover:text-[#000000] border-[#e9e9e9]")
                  }
                  onClick={() => {
                    //   setSection(data);
                  }}
                >
                  <div
                    className={
                      "flex justify-start items-center w-[30px] cursor-pointer mt-[3px] "
                    }
                    onClick={() => {
                      setSearchPrompt("");
                    }}
                  >
                    <Satellite width="16" height="16" strokeWidth="2.2" />
                  </div>
                  <div className="w-auto">No Result Found</div>
                </div>
              </>
            ) : (
              <>
                <div
                  className={
                    "py-[7px] h-[35px] w-full cursor-pointer justify-start items-start my-[1px] px-[10px] rounded-[6px]" +
                    (props?.theme
                      ? " hover:bg-[#36424E] text-[#818b8f] hover:text-[#ffffff] "
                      : " text-[#6e6e7c] hover:text-[#000000] border-[#e9e9e9]") +
                    (searchPrompt.length > 0 ? " flex" : " hidden")
                  }
                  onClick={() => {
                    //   setSection(data);
                  }}
                >
                  <div
                    className={
                      "flex justify-start items-center w-[30px] cursor-pointer mt-[3px] "
                    }
                    onClick={() => {
                      setSearchPrompt("");
                    }}
                  >
                    <GitBranchPlus width="16" height="16" strokeWidth="2.2" />
                  </div>
                  <div className="w-[calc(100%-120px)] flex justify-start items-center">
                    <div className="w-auto  text-ellipsis overflow-hidden whitespace-nowrap  max-[calc(100%-100px)] ">
                      {searchPrompt}
                    </div>
                    <div className="w-[90px] ml-[10px] flex justify-start items-center whitespace-nowrap">
                      <MoveRight
                        width="12"
                        height="12"
                        strokeWidth="2.5"
                        className="mr-[4px]"
                      />{" "}
                      <span className="ml-[5px] text-[12px]">create chat</span>
                    </div>
                  </div>
                  <div
                    className={
                      "flex justify-end items-center w-[90px] h-full" +
                      (props?.theme ? " text-[#818b8f] " : " text-[#6e6e7c] ")
                    }
                  >
                    <Command
                      width="12"
                      height="12"
                      strokeWidth="2.5"
                      className="mr-[4px]"
                    />
                    <span className="text-[12px] whitespace-nowrap">
                      Alt + Enter
                    </span>
                  </div>
                </div>
                {resultArr?.map((data, index) => {
                  return (
                    <div
                      className={
                        "py-[7px] h-[35px] w-full cursor-pointer flex justify-start items-start my-[1px] px-[10px] rounded-[6px]" +
                        (props?.theme
                          ? " hover:bg-[#36424E] text-[#9ba6aa] hover:text-[#ffffff] "
                          : " text-[#6e6e7c] hover:text-[#000000] border-[#e9e9e9]")
                      }
                      onClick={() => {
                        //   setSection(data);
                      }}
                      key={index}
                    >
                      <div
                        className={
                          "flex justify-start items-center w-[30px] cursor-pointer mt-[3px] "
                        }
                        onClick={() => {
                          setSearchPrompt("");
                        }}
                      >
                        <MessageSquare
                          width="16"
                          height="16"
                          strokeWidth="2.2"
                        />
                      </div>
                      <div className="w-[calc(100%-30px)] text-ellipsis overflow-hidden whitespace-nowrap">
                        {data}
                      </div>
                    </div>
                  );
                })}
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
