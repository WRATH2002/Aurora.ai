import {
  AiBrain01Icon,
  AiProgrammingIcon,
  CursorInfo02Icon,
  Delete02Icon,
  InformationCircleIcon,
  UploadCircle01Icon,
} from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { X } from "lucide-react";
import React, { useState } from "react";
import {
  arrayRemove,
  arrayUnion,
  onSnapshot,
  serverTimestamp,
  Timestamp,
} from "firebase/firestore";
import firebase from "../firebase";
import { useNavigate } from "react-router-dom";
import { onAuthStateChanged } from "firebase/auth";
import { auth, db } from "../firebase";

export default function CreateNewAgent(props) {
  const [agentName, setAgentName] = useState("");
  const [agentDescription, setAgentDescription] = useState("");
  const [agentPlaceholder, setAgentPlaceholder] = useState("");
  const [activeInputField, setActiveInputField] = useState("agentName");
  const [showInfo, setShowInfo] = useState(false);

  // ---------------------------------- Function to get current date and time

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

  // ----------------------------------- Function to create AI agent

  function createAIAgent(agentName, agentDescription, agentPlaceholder) {
    const user = firebase.auth().currentUser;
    let tempDateTime = getCurrentDateTime();
    let obj = {
      agentName: agentName,
      agentDescription: agentDescription,
      agentPlaceholder: agentPlaceholder,
      creationDate: tempDateTime.Date,
      creationTime: tempDateTime.Time,
    };

    db.collection("user")
      .doc(user?.uid)
      .collection("AIAgents")
      .doc("AllAIAgents")
      .update({
        AllAIAgentInfo: arrayUnion(obj),
      });

    db.collection("user")
      .doc(user?.uid)
      .collection("AIAgents")
      .doc("AllAIAgents")
      .update({
        AllAgentName: arrayUnion(obj?.agentName),
      });

    db.collection("user")
      .doc(user?.uid)
      .collection("AIAgents")
      .doc(obj?.agentName)
      .set({
        agentName: obj?.agentName,
        agentDescription: obj?.agentDescription,
        agentPlaceholder: obj?.agentPlaceholder,
        isAgent: true,
        chats: [],
      });

    setAgentDescription("");
    setAgentName("");
    setAgentPlaceholder("");
    setActiveInputField("");
  }

  return (
    <div
      className={
        "w-full h-[100svh] fixed z-[50] left-0 top-0 flex justify-center items-center backdrop-blur-[5px]" +
        (props?.theme ? " bg-[#00000078]" : " bg-[#b0b0b081]")
      }
      onClick={() => {
        props?.setAgentModal(false);
      }}
    >
      <div
        className={
          "w-[400px] h-auto rounded-2xl border-[1.5px] boxShadowLight2 flex flex-col justify-start items-start p-[25px] pt-[18px] " +
          (props?.theme
            ? " bg-[#1A1A1A] border-[#252525]"
            : " bg-[#ffffff] border-[#eaeaea]")
        }
        onClick={(e) => {
          e.stopPropagation();
        }}
      >
        <span
          className={
            "text-[22px] font-[DMSm] w-full flex justify-between items-center" +
            (props?.theme ? " text-[white]" : " text-[black]")
          }
        >
          <div className="flex flex-col justify-start items-start">
            <div className="flex justify-start items-center">
              <HugeiconsIcon
                icon={AiBrain01Icon}
                size={22}
                strokeWidth={2.5}
                className="mr-[10px]"
              />
              Create New Agent{" "}
              <HugeiconsIcon
                onMouseEnter={() => {
                  // console.log("focus");
                  setShowInfo(true);
                }}
                onMouseLeave={() => {
                  // console.log("blur");
                  setShowInfo(false);
                }}
                className={
                  "ml-[10px] cursor-pointer " +
                  (props?.theme
                    ? " text-[#828282] hover:text-[white]"
                    : " text-[#999999] hover:text-[black]")
                }
                icon={InformationCircleIcon}
                size={18}
                strokeWidth={1.8}
              />
            </div>
            <pre
              className={
                "mt-[35px] max-w-[350px] fixed flex-col justify-start items-start whitespace-pre-wrap font-[DMSr] rounded-[9px]  text-[12px] px-[10px] py-[5px] cursor-default" +
                (props?.theme
                  ? " bg-[#363636] text-[#d7d7d7]"
                  : " bg-[black] text-[#ffffff]") +
                (showInfo ? " flex" : " hidden")
              }
              style={{ boxShadow: "0px 1px 4px rgba(0,0,0,0.2)", zIndex: 1000 }}
            >
              <span className="font-[DMSb]">Agent Description :</span>
              <span className="">{`Clearly describe the intended role and behavior of your AI agent. The more specific and detailed your description, the better the agent will perform.
              `}</span>
              <span className="font-[DMSb]">Tip : </span>
              <span className="">{`You can use an AI platform (such as Gemini or ChatGPT) to help craft a well-structured prompt. Simply provide the task details, and ask it to generate an optimized system prompt for your agent.`}</span>
            </pre>
          </div>
          <X
            width={18}
            height={18}
            strokeWidth={2.2}
            className={
              "cursor-pointer " +
              (props?.theme
                ? " text-[#828282] hover:text-[white]"
                : " text-[#828282] hover:text-[black]")
            }
            onClick={() => {
              props?.setAgentModal(false);
            }}
          />
        </span>
        <div className="mt-[30px] flex flex-col justify-start items-start w-full">
          <label
            className={
              "text-[12px] h-[2px] flex justify-center items-center px-[6px] mb-[-1.5px] ml-[10px] z-50 " +
              (props?.theme
                ? activeInputField === "agentName"
                  ? " text-[#a3a3a3] bg-[#1A1A1A]"
                  : " text-[#828282] bg-[#1A1A1A]"
                : activeInputField === "agentName"
                ? " text-[#565656] bg-[#ffffff]"
                : " text-[#999999] bg-[#ffffff]")
            }
            style={{ transition: ".1s" }}
          >
            Agent name
          </label>
          <input
            className={
              "w-[calc(100%-0px)] px-[15px] bg-transparent h-[40px] outline-none rounded-[10px] border-[1.5px] text-[14px] mt-[0px]" +
              (props?.theme
                ? activeInputField === "agentName"
                  ? " text-[white] placeholder:text-[#5b5b5b] border-[#636363]"
                  : " text-[white] placeholder:text-[#5b5b5b] border-[#2c2c2c]"
                : activeInputField === "agentName"
                ? " text-[black] placeholder:text-[#828282] border-[#cdcdcd] "
                : " text-[black] placeholder:text-[#828282] border-[#ececec] ")
            }
            style={{ transition: ".1s" }}
            autoFocus
            spellcheck="false"
            onFocus={(e) => {
              setActiveInputField("agentName");
            }}
            onBlur={(e) => {
              setActiveInputField("");
            }}
            value={agentName}
            onChange={(e) => {
              if (
                !e.target.value.includes(".") &
                !e.target.value.includes("/") &
                !e.target.value.includes("%")
              ) {
                setAgentName(e.target.value);
              }
            }}
            placeholder="eg. PDF to summary agent"
          ></input>
        </div>
        <div className="mt-[20px] flex flex-col justify-start items-start w-full">
          <label
            className={
              "text-[12px] h-[2px] flex justify-center items-center px-[6px] mb-[-1.5px] ml-[10px] z-50 " +
              (props?.theme
                ? activeInputField === "agentDescription"
                  ? " text-[#a3a3a3] bg-[#1A1A1A]"
                  : " text-[#828282] bg-[#1A1A1A]"
                : activeInputField === "agentDescription"
                ? " text-[#565656] bg-[#ffffff]"
                : " text-[#999999] bg-[#ffffff]")
            }
            style={{ transition: ".1s" }}
          >
            Agent description
          </label>
          <div
            className={
              "w-[calc(100%-0px)] bg-transparent  outline-none rounded-[10px] border-[1.5px] text-[14px] mt-[0px] pt-[5px]" +
              (props?.theme
                ? activeInputField === "agentDescription"
                  ? " text-[white] border-[#636363]"
                  : " text-[white] border-[#2c2c2c]"
                : activeInputField === "agentDescription"
                ? " text-[black] border-[#cdcdcd] "
                : " text-[black] border-[#ececec] ")
            }
            style={{ transition: "border .1s" }}
          >
            <textarea
              className={
                "w-[calc(100%-0px)] px-[15px] bg-transparent pt-[4px] outline-none rounded-[10px] text-[14px] mt-[0px] h-[100px] resize-none" +
                (props?.theme
                  ? " placeholder:text-[#5b5b5b] chatScrollDark"
                  : " placeholder:text-[#828282] chatScrollLight")
              }
              value={agentDescription}
              spellcheck="false"
              onFocus={(e) => {
                setActiveInputField("agentDescription");
              }}
              onBlur={(e) => {
                setActiveInputField("");
              }}
              onChange={(e) => {
                setAgentDescription(e.target.value);
              }}
              placeholder="Describe what your AI Agent should do ..."
            ></textarea>
          </div>
        </div>
        <div className="mt-[20px] flex flex-col justify-start items-start w-full">
          <label
            className={
              "text-[12px] h-[2px] flex justify-center items-center px-[6px] mb-[-1.5px] ml-[10px] z-50 " +
              (props?.theme
                ? activeInputField === "agentName"
                  ? " text-[#a3a3a3] bg-[#1A1A1A]"
                  : " text-[#828282] bg-[#1A1A1A]"
                : activeInputField === "agentName"
                ? " text-[#565656] bg-[#ffffff]"
                : " text-[#999999] bg-[#ffffff]")
            }
            style={{ transition: ".1s" }}
          >
            Agent Placeholder
          </label>
          <input
            className={
              "w-[calc(100%-0px)] px-[15px] bg-transparent h-[40px] outline-none rounded-[10px] border-[1.5px] text-[14px] mt-[0px]" +
              (props?.theme
                ? activeInputField === "agentPlaceholder"
                  ? " text-[white] placeholder:text-[#5b5b5b] border-[#636363]"
                  : " text-[white] placeholder:text-[#5b5b5b] border-[#2c2c2c]"
                : activeInputField === "agentPlaceholder"
                ? " text-[black] placeholder:text-[#828282] border-[#cdcdcd] "
                : " text-[black] placeholder:text-[#828282] border-[#ececec] ")
            }
            style={{ transition: ".1s" }}
            spellcheck="false"
            onFocus={(e) => {
              setActiveInputField("agentPlaceholder");
            }}
            onBlur={(e) => {
              setActiveInputField("");
            }}
            value={agentPlaceholder}
            onChange={(e) => {
              setAgentPlaceholder(e.target.value);
            }}
            placeholder="Reference placeholder to enhance clarity"
          ></input>
        </div>
        <div className="group flex w-full justify-start items-center mt-[20px] max-h-[35px] flex-col">
          <div
            className={
              " w-auto px-[10px]  rounded-[10px] min-h-[35px] flex justify-center items-center " +
              (props?.theme
                ? agentDescription.length > 0 &&
                  agentName.length > 0 &&
                  agentPlaceholder.length > 0
                  ? " bg-[white] hover:bg-[#eaeaea] text-[#000000] cursor-pointer"
                  : " bg-[white] text-[#000000] cursor-not-allowed opacity-25"
                : agentDescription.length > 0 &&
                  agentName.length > 0 &&
                  agentPlaceholder.length > 0
                ? " bg-[black] hover:bg-[#292929] text-[#ffffff] cursor-pointer"
                : " bg-[black] text-[#ffffff] cursor-not-allowed opacity-25")
            }
            onClick={(e) => {
              if (
                agentDescription.length > 0 &&
                agentName.length > 0 &&
                agentPlaceholder.length > 0
              ) {
                createAIAgent(agentName, agentDescription, agentPlaceholder);
              }
            }}
          >
            <HugeiconsIcon
              icon={UploadCircle01Icon}
              size={18}
              strokeWidth={1.8}
              className="mr-[8px]"
            />
            Publish Agent
          </div>
          <div
            className={
              "mt-[5px] whitespace-nowrap   justify-center items-center rounded-[9px]  text-[12px] px-[8px] py-[3px] cursor-default" +
              (props?.theme
                ? " bg-[#363636] text-[#d7d7d7]"
                : " bg-[black] text-[#ffffff]") +
              (agentDescription.length > 0 &&
              agentName.length > 0 &&
              agentPlaceholder.length > 0
                ? " hidden group-hover:hidden"
                : " hidden group-hover:flex")
            }
            style={{ boxShadow: "0px 1px 4px rgba(0,0,0,0.2)", zIndex: 1000 }}
          >
            Fill all the fields
          </div>
        </div>
      </div>
    </div>
  );
}
