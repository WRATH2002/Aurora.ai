import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  ArrowRight,
  BadgeCheck,
  ChartNoAxesColumn,
  FileSymlink,
  MoveRight,
  NotebookPen,
  Rocket,
  TrendingUp,
} from "lucide-react";

export default function Documentation() {
  const navigate = useNavigate();

  const [nav, setNav] = useState(false);
  const [info, setInfo] = useState(false);
  const [test, setTest] = useState(false);
  const [head1, setHead1] = useState(false);
  const [head2, setHead2] = useState(false);
  const [anime, setAnime] = useState(false);

  useEffect(() => {
    setAnime(true);
    setTimeout(() => {
      setHead1(true);
    }, 800);
    setTimeout(() => {
      setHead2(true);
    }, 1200);
    setTimeout(() => {
      setTest(true);
    }, 3000);
  }, []);

  function navigateToLoginPage() {
    navigate(`/user/login`);
  }

  function navigateToDocs() {
    navigate(`/documentation`);
  }

  function navigateToSignupPage() {
    navigate(`/user/signup`);
  }
  return (
    <>
      <div className="-z-30 left-0 top-0 fixed w-full h-[100svh] bg-[#0D101A] flex justify-end items-start">
        <div className="w-[85%] h-[70%] rounded-b-[70%] bg-gradient-to-b from-[#232234] to-[#3b4554] blur-[150px] mt-[-50px] mr-[-100px] md:mt-[-150px] md:mr-[-400px] lg:mt-[-150px] lg:mr-[-400px]"></div>
      </div>
      <div className="w-full h-[100svh] flex flex-col justify-start items-start overflow-y-scroll text-[#d7d9e1]">
        <div
          className={
            "w-full h-[60px] md:h-[80px] lg:[80px]  flex justify-between items-center px-[20px] md:px-[100px] lg:px-[100px] z-40" +
            (anime ? " mt-[0px] opacity-100" : " mt-[-60px] opacity-0")
          }
          style={{
            transition: "margin-top .5s, opacity .6s",
            transitionDelay: "0s , .2s ",
          }}
        >
          <div className="font-[recoleta] font-bold text-[20px] tracking-wider flex justify-start items-center text-[white]">
            <div className="flex justify-start items-center">
              <Rocket
                width={20}
                height={20}
                strokeWidth={2.5}
                className="mr-[7px] moving-item"
              />{" "}
              aurora.ai
            </div>
            <button
              className="text-[15px] hidden md:block lg:block tracking-normal hover:text-[white] ml-[80px] font-[DMSr] text-[#cecece] font-normal "
              onClick={() => {
                // navigateToLoginPage();
              }}
            >
              Pricing
            </button>
            <button
              className="text-[15px] hidden md:block lg:block tracking-normal hover:text-[white] ml-[50px] font-[DMSr] text-[#cecece] font-normal "
              onClick={() => {
                navigateToDocs();
              }}
            >
              Docs
            </button>
            <button
              className="text-[15px] hidden md:block lg:block tracking-normal hover:text-[white] ml-[50px] font-[DMSr] text-[#cecece] font-normal "
              onClick={() => {
                // navigateToLoginPage();
              }}
            >
              FAQs
            </button>
          </div>
          <div className="w-auto flex justify-end items-center text-[#cecece]">
            <button
              className="text-[15px] hidden md:block lg:block px-[15px] hover:text-[white] "
              onClick={() => {
                navigateToLoginPage();
              }}
            >
              Log in
            </button>
            <button
              className="text-[15px]  hidden md:flex lg:flex px-[15px] h-[31px] w-auto rounded-xl bg-gradient-to-tr from-[#cfcfcf] via-[#ffffff] to-[#ffffff] ml-[30px] text-[black] whitespace-nowrap  justify-center items-center "
              onClick={() => {
                navigateToSignupPage();
              }}
            >
              Signup{" "}
              <ArrowRight
                width={16}
                height={16}
                strokeWidth={2.5}
                className="ml-[7px] mr-[-3px]"
              />
            </button>
            {/* <StarBorder
                      as="button"
                      className="custom-class"
                      color="white"
                      speed="1s"
                    >
                      Sign up
                    </StarBorder> */}
            <div>
              <ChartNoAxesColumn
                width={25}
                height={25}
                strokeWidth={2.4}
                className="flex md:hidden lg:hidden -rotate-90 text-[white]"
              />
            </div>
          </div>
        </div>
        <div className="w-full h-[calc(100%-60px)] md:h-[calc(100%-80px)] lg:h-[calc(100%-80px)]  flex flex-col justify-start items-start pt-[50px] md:pt-[130px] lg:pt-[130px] pb-[200px] font-[DMSr] px-[20px] md:px-[100px] lg:px-[100px]  ">
          <span className="text-[40px] font-extrabold mb-[10px]">
            {data[0]?.heading}
          </span>
          <span className="text-[14px] text-[#bdbdbd] mb-[40px]">
            {data[0].subHeading}
          </span>
          <hr className="w-full mt-[0px] opacity-20"></hr>
          <span className="text-[40px] font-extrabold mt-[40px] mb-[10px]">
            Features Overview
          </span>
          <span className="text-[25px] font-semibold mt-[10px] mb-[10px] flex justify-start items-center">
            <span className="text-[15px] mr-[8px]">▨</span> Notes Section
          </span>
          <span className="text-[14px] text-[#bdbdbd] ml-[20px] flex justify-start items-center ">
            <span className="text-[25px] mr-[7px] text-[#d7d9e1]">•</span>{" "}
            <span className=" font-semibold mr-[8px] text-[#d7d9e1]">
              Lexical Editor :{" "}
            </span>{" "}
            Provides rich-text editing with features like bold, italics,
            underline, and more.
          </span>
          <span className="text-[14px] text-[#bdbdbd] ml-[20px] flex justify-start items-center  mt-[0px]">
            <span className="text-[25px] mr-[7px] text-[#d7d9e1]">•</span>{" "}
            <span className=" font-semibold mr-[8px] text-[#d7d9e1]">
              Tab-Based System :{" "}
            </span>{" "}
            Open multiple notes in different tabs and switch between them
            effortlessly.
          </span>
          <span className="text-[14px] text-[#bdbdbd] ml-[20px] flex justify-start items-center  mt-[0px]">
            <span className="text-[25px] mr-[7px] text-[#d7d9e1]">•</span>{" "}
            <span className=" font-semibold mr-[8px] text-[#d7d9e1]">
              Tree Structure :{" "}
            </span>{" "}
            Organize notes in a hierarchical folder structure for better
            management.
          </span>
          {/* ---------------------------------------- */}
          <span className="text-[25px] font-semibold mt-[25px] mb-[10px] flex justify-start items-center">
            <span className="text-[15px] mr-[8px]">▨</span> Archived Notes
          </span>
          <span className="text-[14px] text-[#bdbdbd] ml-[20px] flex justify-start items-center ">
            <span className="text-[25px] mr-[7px] text-[#d7d9e1]">•</span>{" "}
            <span className=" font-semibold mr-[8px] text-[#d7d9e1]">
              Archiving :{" "}
            </span>{" "}
            Move notes to the archive instead of deleting them.
          </span>
          <span className="text-[14px] text-[#bdbdbd] ml-[20px] flex justify-start items-center  mt-[0px]">
            <span className="text-[25px] mr-[7px] text-[#d7d9e1]">•</span>{" "}
            <span className=" font-semibold mr-[8px] text-[#d7d9e1]">
              Shared Notes :{" "}
            </span>{" "}
            Keep track of notes shared with friends.
          </span>

          {/* ---------------------------------------- */}
          <span className="text-[25px] font-semibold mt-[25px] mb-[10px] flex justify-start items-center">
            <span className="text-[15px] mr-[8px]">▨</span> Roadmaps (Task
            Management)
          </span>
          <span className="text-[14px] text-[#bdbdbd] ml-[20px] flex justify-start items-center ">
            <span className="text-[25px] mr-[7px] text-[#d7d9e1]">•</span>{" "}
            <span className=" font-semibold mr-[8px] text-[#d7d9e1]">
              Kanban-Style Board :{" "}
            </span>{" "}
            Categorize tasks under To-Do, In Progress, and Done.
          </span>
          <span className="text-[14px] text-[#bdbdbd] ml-[20px] flex justify-start items-center  mt-[0px]">
            <span className="text-[25px] mr-[7px] text-[#d7d9e1]">•</span>{" "}
            <span className=" font-semibold mr-[8px] text-[#d7d9e1]">
              Daily Task Creation :{" "}
            </span>{" "}
            Plan daily activities with ease.
          </span>
          {/* ------------------------------------------- */}

          {/* ------------------------------------------- */}
          <div className="w-full min-h-[300px]"></div>
        </div>
      </div>
    </>
  );
}

// ■ ◍ •

const data = [
  {
    heading: "Introduction",
    subHeading:
      "Welcome to the AI Note-Taking Website, an advanced, AI-powered platform designed for seamless and structured note management. Built with the Lexical Editor, this application offers a rich text-editing experience along with features like multi-tabbed note organization, folder-based structuring, AI chatbot integration, task management, and calendar scheduling.",
  },
  {
    heading: "1 . Notes Section",
    subHeading: [
      "Lexical Editor : Provides rich-text editing with features like bold, italics, underline, and more.",
      "Tab-Based System : Open multiple notes in different tabs and switch between them effortlessly.",
      "Tree Structure : Organize notes in a hierarchical folder structure for better management.",
    ],
  },
  {
    heading: "2 . Archived Notes",
    subHeading: [
      "Archiving : Move notes to the archive instead of deleting them.",
      "Shared Notes : Keep track of notes shared with friends.",
    ],
  },
  {
    heading: "3 . Roadmaps (Task Management)",
    subHeading: [
      "Kanban-Style Board : Categorize tasks under To-Do, In Progress, and Done.",
      "Daily Task Creation : Plan daily activities with ease.",
    ],
  },
  {
    heading: "4 . Calendar",
    subHeading: [
      "Event Scheduling : Add upcoming meetings, project deadlines, or important reminders.",
      "Visual Representation : A structured calendar view to organize tasks efficiently.",
    ],
  },
  {
    heading: "5 . AI Chatbot",
    subHeading: [
      "Multi-Platform AI Support : Choose from Gemini, Claude, or ChatGPT.",
      "Integrated Experience : No need to switch browser tabs to access AI assistance.",
      "User API Key Storage : Securely store API keys to avoid work disruptions due to token limitations.",
    ],
  },
  {
    heading: "6 . Customization & Settings",
    subHeading: [
      "Editor Toolbar Customization : Modify toolbar settings to match user preferences.",
      "Theme Customization : Switch between light and dark themes.",
      "API Key Management : Store and manage API keys for AI platforms securely.",
    ],
  },
  {
    heading: "Technology Stack",
    subHeading:
      "The website is developed using modern web technologies, ensuring high performance and a smooth user experience.",
  },
  {
    heading: "Frontend",
    subHeading: [
      "ReactJS 19 : Core framework for the user interface.",
      "Lexical Editor : Provides rich-text editing features.",
      "Tailwind CSS : Ensures a responsive and modern UI.",
      "Framer Motion : Enables smooth animations.",
    ],
  },
  {
    heading: "Backend & Database",
    subHeading: [
      "Firebase : Manages authentication, database, and hosting.",
      "Dotenv : Handles environment variables securely.",
    ],
  },
];
