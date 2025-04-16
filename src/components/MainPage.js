import React, { useState } from "react";
import MainPageTopBar from "./MainPageTopBar";
import {
  Bold,
  BookOpen,
  ChevronLeft,
  ChevronRight,
  EllipsisVertical,
  PenLine,
  Plus,
} from "lucide-react";
import Editor from "./Editor";
import WelcomeEditorPage from "./WelcomeEditorPage";
import AiWindowPopUp from "./AiWindowPopUp";
import APILimitError from "./APILimitError";
// import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";

const MainPage = (props) => {
  const [inputText, setInputText] = useState("");
  // const [AiOutput, setAiOutput] = useState("");
  // const [loading, setLoading] = useState(false);
  // const [AiSection, setAiSection] = useState("");
  // const [editor] = useLexicalComposerContext();
  return (
    <div
      className="w-full h-[calc(100%-0px)]  flex flex-col justify-start items-start "
      style={{ zIndex: "100" }}
    >
      {/* <div className="w-full h-[50px] flex justify-start items-center">
        <div className="w-[35px] h-[35px] bg-slate-50 flex justify-center items-center cursor-pointer">
          <Bold width={20} height={20} strokeWidth="1.8" />
        </div>
      </div> */}
      {/* <textarea
        className="w-full h-[calc(100%-100px)] resize-none pt-[80px] outline-none px-[20px] text-[14px]"
        value={inputText}
        onChange={(e) => {
          setInputText(e.target.value);
        }}
      ></textarea> */}
      <div
        className={
          "w-full h-[calc(100%-0px)]  resize-none pt-[0px] outline-none text-[15px] overflow-hidden" +
          (props?.isMinimise ? " rounded-l-md" : " rounded-l-[0px]")
        }
        style={{ zIndex: "900" }}
      >
        {props?.fileStacked[props?.selected] == "Welcome to Obsidian" ? (
          // <WelcomeEditorPage
          //   theme={props?.theme}
          //   isMinimise={props?.isMinimise}
          //   selectedText={props?.selectedText}
          //   setSelectedText={props?.setSelectedText}
          //   selected={props?.selected}
          //   setSelected={props?.setSelected}
          //   fileStacked={props?.fileStacked}
          // />
          <div
            className={
              "w-full h-full flex flex-col justify-center items-center" +
              (props?.theme
                ? " text-[#9ba6aa] bg-[#1A1A1A]"
                : " text-[#9999aa] bg-[#ffffff]")
            }
          >
            <div className="flex flex-col w-auto h-auto justify-center items-center">
              <span
                className={
                  "font-[geistSemibold] text-[25px] mb-[10px]" +
                  (props?.theme ? " text-[#ffffff]" : " text-[#000000]")
                }
              >
                No file is open
              </span>
              <span className="flex justify-center items-center text-[15px] cursor-pointer">
                <Plus
                  width={16}
                  height={16}
                  strokeWidth="2.3"
                  className={
                    "mr-[5px]"
                    // +
                    // (props?.theme
                    //   ? searchParams.get("ID")?.split("?section=")[1] ==
                    //     "Terminal"
                    //     ? " text-[#ffffff]"
                    //     : " hover:text-[#ffffff]"
                    //   : searchParams.get("ID")?.split("?section=")[1] ==
                    //     "Terminal"
                    //   ? " text-[#1e1e1ee4]"
                    //   : " hover:text-[#1e1e1ee4]")
                  }
                />{" "}
                Create new file
              </span>
              <span className="flex justify-center items-center text-[15px] cursor-pointer mt-[2px]">
                <Plus
                  width={16}
                  height={16}
                  strokeWidth="2.3"
                  className={
                    "mr-[5px]"
                    // +
                    // (props?.theme
                    //   ? searchParams.get("ID")?.split("?section=")[1] ==
                    //     "Terminal"
                    //     ? " text-[#ffffff]"
                    //     : " hover:text-[#ffffff]"
                    //   : searchParams.get("ID")?.split("?section=")[1] ==
                    //     "Terminal"
                    //   ? " text-[#1e1e1ee4]"
                    //   : " hover:text-[#1e1e1ee4]")
                  }
                />{" "}
                Create new folder
              </span>
              {/* <span className="flex justify-center items-center text-[15px] cursor-pointer rounded-md">
                Open new file
              </span> */}
            </div>
          </div>
        ) : (
          <Editor
            theme={props?.theme}
            isMinimise={props?.isMinimise}
            selectedText={props?.selectedText}
            setSelectedText={props?.setSelectedText}
            selected={props?.selected}
            setSelected={props?.setSelected}
            fileStacked={props?.fileStacked}
            fileStackedWithInfo={props?.fileStackedWithInfo}
            setFileStackedWithInfo={props?.setFileStackedWithInfo}
            AiOutput={props?.AiOutput}
            setAiOutput={props?.setAiOutput}
            loading={props?.loading}
            setLoading={props?.setLoading}
            AiSection={props?.AiSection}
            setAiSection={props?.setAiSection}
            setFetchNoteQueue={props?.setFetchNoteQueue}
            fetchNoteQueue={props?.fetchNoteQueue}
            saveLoading={props?.saveLoading}
            setSaveLoading={props?.setSaveLoading}
          />
        )}
        {/* <AiWindowPopUp
          AiOutput={AiOutput}
          setAiOutput={setAiOutput}
          loading={loading}
          AiSection={AiSection}
          setAiSection={setAiSection}
        /> */}
        {/* {loading || AiOutput.length > 0 ? (
          <AiWindowPopUp
            AiOutput={AiOutput}
            setAiOutput={setAiOutput}
            loading={loading}
            AiSection={AiSection}
            setAiSection={setAiSection}
          />
        ) : (
          <></>
        )} */}

        {/* <APILimitError /> */}
      </div>
    </div>
  );
};

export default MainPage;
