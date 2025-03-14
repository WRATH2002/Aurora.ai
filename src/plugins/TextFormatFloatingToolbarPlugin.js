import { $isCodeHighlightNode } from "@lexical/code";
import { $isLinkNode, TOGGLE_LINK_COMMAND } from "@lexical/link";
import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
import { mergeRegister } from "@lexical/utils";
import {
  $getSelection,
  $isRangeSelection,
  $isTextNode,
  COMMAND_PRIORITY_LOW,
  FORMAT_TEXT_COMMAND,
  SELECTION_CHANGE_COMMAND,
} from "lexical";
import React, { useCallback, useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";

// import FormatBoldOutlinedIcon from "@mui/icons-material/FormatBoldOutlined";
// import FormatItalicOutlinedIcon from "@mui/icons-material/FormatItalicOutlined";
// import FormatUnderlinedOutlinedIcon from "@mui/icons-material/FormatUnderlinedOutlined";
// import StrikethroughSOutlinedIcon from "@mui/icons-material/StrikethroughSOutlined";
// import InsertLinkOutlinedIcon from "@mui/icons-material/InsertLinkOutlined";
// import CodeIcon from "@mui/icons-material/Code";

import { getDOMRangeRect } from "../utils/getDOMRangeRect";
import { getSelectedNode } from "../utils/getSelectNode";
import { setFloatingElemPosition } from "../utils/setFloatingElemPosition";
import {
  ArrowDownWideNarrow,
  ArrowUpWideNarrow,
  Bold,
  BriefcaseBusiness,
  ChevronRight,
  Italic,
  RotateCw,
  Sparkle,
  Sparkles,
  Strikethrough,
  TextSearch,
  Underline,
  WandSparkles,
  WrapText,
} from "lucide-react";
import { GoogleGenerativeAI } from "@google/generative-ai";
import APILimitError from "../components/APILimitError";

// import { Box, styled, IconButton } from "@mui/material";

// export const FloatingDivContainer = styled(Box)({
//   display: "flex",
//   background: "#fff",
//   padding: 4,
//   verticalAlign: "middle",
//   position: "absolute",
//   top: 0,
//   left: 0,
//   zIndex: 10,
//   opacity: 0,
//   backgroundColor: "#fff",
//   boxShadow: "0px 5px 10px rgba(0, 0, 0, 0.3)",
//   borderRadius: 8,
//   transition: "opacity 0.5s",
//   height: 35,
//   willChange: "transform",
// });

// function ReplaceSelectedTextButton() {
//   const [editor] = useLexicalComposerContext();

//   const replaceSelectedText = () => {
//     editor.update(() => {
//       const selection = $getSelection();
//       if ($isRangeSelection(selection)) {
//         // Replace the selected text
//         console.log("selection Lexical --->");
//         // console.log(selection);
//         selection.insertText("Hello There");
//       }
//     });
//   };

//   return <button onClick={replaceSelectedText}>Replace Selected Text</button>;
// }

function TextFormatFloatingToolbar({
  editor,
  anchorElem,
  isLink,
  isBold,
  isItalic,
  isUnderline,
  isCode,
  isStrikethrough,
  isSubscript,
  isSuperscript,
  setLoading,
  theme,
  AiOutput,
  setAiOutput,
  AiSection,
  setAiSection,
}) {
  const popupCharStylesEditorRef = useRef(null);
  //   //   const [editor] = useLexicalComposerContext();
  const [showAiMenu, setShowAiMenu] = useState(false);
  const [summarizeModal, setSummarizeModal] = useState(false);
  const [helpModal, setHelpModal] = useState(false);
  const [toneModal, setToneModal] = useState(false);
  const [formatModal, setFormatModal] = useState(false);
  const [selectionNode, setSelectionNode] = useState(null);
  const [selectedText, setSelectedText] = useState("");
  const [prompt, setPrompt] = useState("Make the above text in paras");
  const [aiError, setAiError] = useState(false);
  const [aiErrorMessage, setAiErrorMessage] = useState("");

  const [editorr] = useLexicalComposerContext();

  const replaceSelectedTextt = (text, sel) => {
    editorr.update(() => {
      // const selection = $getSelection();
      if ($isRangeSelection(sel)) {
        // Replace the selected text
        console.log("selection Lexical --->");
        // console.log(selection);
        sel.insertText(text);
      }
    });
  };

  const teext = `Today has been a busy`;

  useEffect(() => {
    // Register the update listener
    const unregister = editor.registerUpdateListener(({ editorState }) => {
      editorState.read(() => {
        const selection = $getSelection();
        if ($isRangeSelection(selection)) {
          setSelectionNode(selection);
          const selectedText = selection.getTextContent();
          setSelectedText(selectedText);
        } else {
          setSelectionNode(null); // Clear selection if it is not a range selection
          setSelectedText("");
        }
      });
    });

    // Cleanup the listener on unmount
    return () => unregister();
  }, [editor]);

  function replaceSelectedText(newText) {
    console.log("replace function ---->");
    console.log(selectedText);
    console.log(selectionNode);
    const selection = $getSelection();
    editor.update(() => {
      if ($isRangeSelection(selection)) {
        // selectionNode.insertText(newText);

        selection.insertText(teext);
      } else {
        console.error("No valid selection found for replacement.");
      }
    });
  }

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

  async function run(chosenPrompt, sec) {
    let selection;
    editorr.update(() => {
      selection = $getSelection();
    });
    console.log("generating text");
    const chatSession = model.startChat({
      generationConfig,
      // safetySettings: Adjust safety settings
      // See https://ai.google.dev/gemini-api/docs/safety-settings
      history: [],
    });

    try {
      const result = await chatSession.sendMessage(
        `${selectedText}` +
          `
        ${chosenPrompt}`
      );

      console.log(result?.response?.text());
      setLoading(false);
      setAiOutput([{ Section: sec, Message: [result?.response?.text()] }]);
      // replaceSelectedTextt(result?.response?.text(), selection);
    } catch (error) {
      setLoading(false);
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
  }

  const insertLink = useCallback(() => {
    if (!isLink) {
      editor.dispatchCommand(TOGGLE_LINK_COMMAND, "https://");
    } else {
      editor.dispatchCommand(TOGGLE_LINK_COMMAND, null);
    }
  }, [editor, isLink]);

  function mouseMoveListener(e) {
    if (
      popupCharStylesEditorRef?.current &&
      (e.buttons === 1 || e.buttons === 3)
    ) {
      popupCharStylesEditorRef.current.style.pointerEvents = "none";
    }
  }
  function mouseUpListener(e) {
    if (popupCharStylesEditorRef?.current) {
      popupCharStylesEditorRef.current.style.pointerEvents = "auto";
    }
  }

  useEffect(() => {
    if (popupCharStylesEditorRef?.current) {
      document.addEventListener("mousemove", mouseMoveListener);
      document.addEventListener("mouseup", mouseUpListener);

      return () => {
        document.removeEventListener("mousemove", mouseMoveListener);
        document.removeEventListener("mouseup", mouseUpListener);
      };
    }
  }, [popupCharStylesEditorRef]);

  const updateTextFormatFloatingToolbar = useCallback(() => {
    const selection = $getSelection();

    const popupCharStylesEditorElem = popupCharStylesEditorRef.current;
    const nativeSelection = window.getSelection();

    if (popupCharStylesEditorElem === null) {
      return;
    }

    const rootElement = editor.getRootElement();
    if (
      selection !== null &&
      nativeSelection !== null &&
      !nativeSelection.isCollapsed &&
      rootElement !== null &&
      rootElement.contains(nativeSelection.anchorNode)
    ) {
      const rangeRect = getDOMRangeRect(nativeSelection, rootElement);

      setFloatingElemPosition(rangeRect, popupCharStylesEditorElem, anchorElem);
    }
  }, [editor, anchorElem]);

  useEffect(() => {
    const scrollerElem = anchorElem.parentElement;

    const update = () => {
      editor.getEditorState().read(() => {
        updateTextFormatFloatingToolbar();
      });
    };

    window.addEventListener("resize", update);
    if (scrollerElem) {
      scrollerElem.addEventListener("scroll", update);
    }

    return () => {
      window.removeEventListener("resize", update);
      if (scrollerElem) {
        scrollerElem.removeEventListener("scroll", update);
      }
    };
  }, [editor, updateTextFormatFloatingToolbar, anchorElem]);

  useEffect(() => {
    editor.getEditorState().read(() => {
      updateTextFormatFloatingToolbar();
    });
    return mergeRegister(
      editor.registerUpdateListener(({ editorState }) => {
        editorState.read(() => {
          updateTextFormatFloatingToolbar();
        });
      }),

      editor.registerCommand(
        SELECTION_CHANGE_COMMAND,
        () => {
          updateTextFormatFloatingToolbar();
          return false;
        },
        COMMAND_PRIORITY_LOW
      )
    );
  }, [editor, updateTextFormatFloatingToolbar]);

  return (
    <>
      {aiError ? (
        <APILimitError
          setAiError={setAiError}
          setAiErrorMessage={setAiErrorMessage}
          aiErrorMessage={aiErrorMessage}
        />
      ) : (
        <></>
      )}

      {editor.isEditable() && (
        <>
          <div
            className="flex flex-col justify-start items-start h-[40px] overflow-visible"
            ref={popupCharStylesEditorRef}
            style={{
              verticalAlign: "middle",
              position: "absolute",
              top: 0,
              left: 0,
              zIndex: 10,
              opacity: 0,
              // boxShadow: "0px 5px 10px rgba(0, 0, 0, 0.5)",
              borderRadius: 8,
              transition: "opacity 0.5s",
              //   height: 35,
              willChange: "transform",
            }}
          >
            <div
              className={
                "flex justify-start items-center  boxShadowLight0  px-[5px] min-w-[30px] min-h-[40px]  border-[1.5px]  rounded-lg w-auto" +
                (theme
                  ? " border-[#252525] bg-[#353e42]"
                  : " border-[#E5E7EB] bg-[#ffffff]")
              }
              style={{
                boxShadow: "0px 1px 15px rgba(0, 0, 0, 0.15)",
              }}
            >
              <button
                className={
                  "w-[30px] h-[30px] rounded-md flex justify-center items-center    cursor-pointer  " +
                  (isBold
                    ? theme
                      ? " bg-[#313C40] text-[#f4efff] cursor-pointer"
                      : " bg-[#e6e6f4] text-[#000000] cursor-pointer"
                    : theme
                    ? " hover:bg-[#313C40] text-[#f4efff] hover:text-[white] "
                    : " hover:bg-[#e6e6f4] text-[#6e6e7c] hover:text-[black] ")
                }
                onClick={() => {
                  editor.dispatchCommand(FORMAT_TEXT_COMMAND, "bold");
                }}
              >
                <Bold width={18} height={18} strokeWidth="1.8" />
              </button>
              <button
                className={
                  "w-[30px] h-[30px] ml-[5px] rounded-md flex justify-center items-center    cursor-pointer  " +
                  (isItalic
                    ? theme
                      ? " bg-[#313C40] text-[#f4efff] cursor-pointer"
                      : " bg-[#e6e6f4] text-[#000000] cursor-pointer"
                    : theme
                    ? " hover:bg-[#313C40] text-[#f4efff] hover:text-[white] "
                    : " hover:bg-[#e6e6f4] text-[#6e6e7c] hover:text-[black] ")
                }
                onClick={() => {
                  editor.dispatchCommand(FORMAT_TEXT_COMMAND, "italic");
                }}
              >
                <Italic width={18} height={18} strokeWidth="1.8" />
              </button>
              <button
                className={
                  "w-[30px] h-[30px] ml-[5px] rounded-md flex justify-center items-center    cursor-pointer  " +
                  (isUnderline
                    ? theme
                      ? " bg-[#313C40] text-[#f4efff] cursor-pointer"
                      : " bg-[#e6e6f4] text-[#000000] cursor-pointer"
                    : theme
                    ? " hover:bg-[#313C40] text-[#f4efff] hover:text-[white] "
                    : " hover:bg-[#e6e6f4] text-[#6e6e7c] hover:text-[black] ")
                }
                onClick={() => {
                  editor.dispatchCommand(FORMAT_TEXT_COMMAND, "underline");
                }}
              >
                <Underline width={18} height={18} strokeWidth="1.8" />
              </button>
              <button
                className={
                  "w-[30px] h-[30px] ml-[5px] rounded-md flex justify-center items-center    cursor-pointer  " +
                  (isStrikethrough
                    ? theme
                      ? " bg-[#313C40] text-[#f4efff] cursor-pointer"
                      : " bg-[#e6e6f4] text-[#000000] cursor-pointer"
                    : theme
                    ? " hover:bg-[#313C40] text-[#f4efff] hover:text-[white] "
                    : " hover:bg-[#e6e6f4] text-[#6e6e7c] hover:text-[black] ")
                }
                onClick={() => {
                  editor.dispatchCommand(FORMAT_TEXT_COMMAND, "strikethrough");
                }}
              >
                <Strikethrough width={18} height={18} strokeWidth="1.8" />
              </button>

              <button
                className={
                  "w-[30px] h-[30px] ml-[5px] rounded-md flex justify-center items-center cursor-pointer " +
                  (showAiMenu
                    ? theme
                      ? " text-[white] bg-[#313C40]"
                      : " text-[black] bg-[#e6e6f4]"
                    : theme
                    ? " text-[#f4efff] hover:text-[white] hover:bg-[#313C40]"
                    : " text-[#6e6e7c] hover:text-[black] hover:bg-[#e6e6f4]")
                }
                onClick={() => {
                  setShowAiMenu(!showAiMenu);
                }}
              >
                <Sparkles width={18} height={18} strokeWidth="1.8" />
              </button>
              {/* <IconButton
            onClick={() => {
              editor.dispatchCommand(FORMAT_TEXT_COMMAND, "bold");
            }}
            color={isBold ? "secondary" : undefined}
          >
            <FormatBoldOutlinedIcon />
          </IconButton>

          <IconButton
            onClick={() => {
              editor.dispatchCommand(FORMAT_TEXT_COMMAND, "italic");
            }}
            color={isItalic ? "secondary" : undefined}
          >
            <FormatItalicOutlinedIcon />
          </IconButton>

          <IconButton
            onClick={() => {
              editor.dispatchCommand(FORMAT_TEXT_COMMAND, "underline");
            }}
            color={isUnderline ? "secondary" : undefined}
          >
            <FormatUnderlinedOutlinedIcon />
          </IconButton>

          <IconButton
            onClick={() => {
              editor.dispatchCommand(FORMAT_TEXT_COMMAND, "strikethrough");
            }}
            color={isStrikethrough ? "secondary" : undefined}
          >
            <StrikethroughSOutlinedIcon />
          </IconButton>

          <IconButton
            onClick={() => {
              editor.dispatchCommand(FORMAT_TEXT_COMMAND, "code");
            }}
            color={isCode ? "secondary" : undefined}
          >
            <CodeIcon />
          </IconButton>

          <IconButton
            onClick={insertLink}
            color={isLink ? "secondary" : undefined}
          >
            <InsertLinkOutlinedIcon />
          </IconButton> */}
            </div>
            <div
              className={
                "mt-[5px]  flex-col justify-start items-center border-[1.5px] rounded-lg  boxShadowLight0 w-[150px] p-[5px]  " +
                (showAiMenu ? " flex" : " hidden") +
                (theme
                  ? " border-[#252525] bg-[#353e42]"
                  : " border-[#E5E7EB] bg-[#ffffff]")
              }
              style={{
                boxShadow: "0px 1px 15px rgba(0, 0, 0, 0.15)",
              }}
            >
              {/* <div
                className={
                  "flex  p-[5px] rounded-t-lg" +
                  (theme ? " bg-[#353e42]" : " bg-[#ffffff]")
                }
              >
                <button className="w-[30px] h-[30px] rounded-md flex justify-center items-center   text-[#f4efff] hover:bg-[#1D2528] hover:text-[white] cursor-pointer bg-transparent ">
                  <TextSearch width={18} height={18} strokeWidth="2.2" />
                </button>
                <button className="w-[30px] h-[30px] ml-[10px] rounded-md flex justify-center items-center   text-[#f4efff] hover:bg-[#1D2528] hover:text-[white] cursor-pointer bg-transparent ">
                  <RotateCw width={18} height={18} strokeWidth="2.2" />
                </button>
                <button className="w-[30px] h-[30px] ml-[10px] rounded-md flex justify-center items-center   text-[#f4efff] hover:bg-[#1D2528] hover:text-[white] cursor-pointer bg-transparent ">
                  <BriefcaseBusiness width={18} height={18} strokeWidth="2.2" />
                </button>
              </div> */}
              <button
                className={
                  "w-full h-[30px] text-[14px] font-[geistRegular]  flex justify-start  items-start bg-transparent cursor-pointer rounded-md overflow-visible"
                }
              >
                <button
                  className={
                    "min-w-full h-[30px]  p-[5px] text-[14px] font-[geistRegular]  flex justify-between pl-[10px]  items-center cursor-pointer rounded-md " +
                    (summarizeModal
                      ? theme
                        ? " bg-[#1D2528] text-[#ffffff]"
                        : " bg-[#e6e6f4] text-[#000000]"
                      : theme
                      ? " hover:bg-[#1D2528] bg-transparent text-[#f4efff] hover:text-[white] "
                      : " hover:bg-[#e6e6f4] bg-transparent text-[#6e6e7c] hover:text-[black] ")
                  }
                  onClick={() => {
                    setHelpModal(false);
                    setToneModal(false);
                    setFormatModal(false);
                    setSummarizeModal(!summarizeModal);
                  }}
                >
                  Summarize{" "}
                  <ChevronRight width={18} height={18} strokeWidth={1.8} />
                </button>
                <div
                  className={
                    "min-w-[150px] h-auto rounded-lg mt-[-5.5px] border-[1.5px] ml-[10px] flex flex-col justify-start items-start p-[5px]" +
                    (summarizeModal ? " flex" : " hidden") +
                    (theme
                      ? " border-[#252525] bg-[#353e42]"
                      : " border-[#E5E7EB] bg-[#ffffff]")
                  }
                  style={{
                    boxShadow: "0px 1px 15px rgba(0, 0, 0, 0.15)",
                  }}
                >
                  <button
                    className={
                      "min-w-full h-[30px]  p-[5px] text-[14px] font-[geistRegular]  flex justify-start pl-[10px]  items-center bg-transparent cursor-pointer rounded-md " +
                      (theme
                        ? " hover:bg-[#1D2528] text-[#f4efff] hover:text-[white] "
                        : " hover:bg-[#e6e6f4] text-[#6e6e7c] hover:text-[black] ")
                    }
                    onClick={() => {
                      run(
                        "Summarize the following text in a detailed and coherent manner, capturing all key points and providing context. Ensure the response is in plain text without using formatting-related symbols for emphasis or bullets. Normal special characters, emojis, and punctuation can be used as needed. Provide only the summary, nothing else.",
                        "Summary/Extended"
                      );
                      setAiSection("Summary/Extended");
                      setLoading(true);
                      // editor.dispatchCommand(FORMAT_TEXT_COMMAND, "ai");
                    }}
                  >
                    Extended
                  </button>
                  <button
                    className={
                      "min-w-full h-[30px]  p-[5px] text-[14px] font-[geistRegular]  flex justify-start pl-[10px]  items-center bg-transparent cursor-pointer rounded-md " +
                      (theme
                        ? " hover:bg-[#1D2528] text-[#f4efff] hover:text-[white] "
                        : " hover:bg-[#e6e6f4] text-[#6e6e7c] hover:text-[black] ")
                    }
                    onClick={() => {
                      run(
                        "Summarize the following text by listing the key points clearly and concisely. Do not use symbols like *, -, or any formatting-related characters for bullets. Normal special characters, emojis, and punctuation can be included where appropriate. Provide each point on a new line as plain text. Do not include additional commentary or instructions.",
                        "Summary/Bullete"
                      );
                      setAiSection("Summary/Bullete");
                      setLoading(true);
                      // editor.dispatchCommand(FORMAT_TEXT_COMMAND, "ai");
                    }}
                  >
                    Bullete
                  </button>
                  <button
                    className={
                      "min-w-full h-[30px]  p-[5px] text-[14px] font-[geistRegular]  flex justify-start pl-[10px]  items-center bg-transparent cursor-pointer rounded-md " +
                      (theme
                        ? " hover:bg-[#1D2528] text-[#f4efff] hover:text-[white] "
                        : " hover:bg-[#e6e6f4] text-[#6e6e7c] hover:text-[black] ")
                    }
                    onClick={() => {
                      run(
                        "Summarize the following text into a single concise sentence. Do not use any formatting symbols like *, -, or ``` for emphasis. Normal special characters, emojis, and punctuation can be included if relevant. Provide only the summary, without any additional details or instructions.",
                        "Summary/Micro"
                      );
                      setAiSection("Summary/Micro");
                      setLoading(true);
                      // editor.dispatchCommand(FORMAT_TEXT_COMMAND, "ai");
                    }}
                  >
                    Micro
                  </button>
                </div>
              </button>
              <button
                className={
                  "w-full h-[30px]  p-[5px] text-[14px] font-[geistRegular] mt-[1.2px] flex justify-start pl-[10px]  items-center bg-transparent cursor-pointer rounded-md " +
                  (theme
                    ? " hover:bg-[#1D2528] text-[#f4efff] hover:text-[white] "
                    : " hover:bg-[#e6e6f4] text-[#6e6e7c] hover:text-[black] ")
                }
                onClick={() => {
                  run(
                    "Check the following text for typos and spelling errors. Provide only the corrected version of the text in plain text. Do not include formatting-related symbols like *, -, or ``` for emphasis. Retain normal special characters and emojis as needed. Provide only the corrected text without any commentary or additional explanations.",
                    "Fix Typos"
                  );
                  setAiSection("Fix Typos");
                  setLoading(true);
                  // editor.dispatchCommand(FORMAT_TEXT_COMMAND, "ai");
                }}
              >
                Fix Typos
              </button>
              <button
                className={
                  "w-full h-[30px] text-[14px] font-[geistRegular] mt-[1.2px]  flex justify-start  items-start  cursor-pointer rounded-md overflow-visible"
                }
              >
                <button
                  className={
                    "min-w-full h-[30px]  p-[5px] text-[14px] font-[geistRegular]  flex justify-between pl-[10px]  items-center  cursor-pointer rounded-md " +
                    (helpModal
                      ? theme
                        ? " bg-[#1D2528] text-[#ffffff]"
                        : " bg-[#e6e6f4] text-[#000000]"
                      : theme
                      ? " hover:bg-[#1D2528] bg-transparent text-[#f4efff] hover:text-[white] "
                      : " hover:bg-[#e6e6f4] bg-transparent text-[#6e6e7c] hover:text-[black] ")
                  }
                  onClick={() => {
                    setSummarizeModal(false);
                    setToneModal(false);
                    setFormatModal(false);
                    setHelpModal(!helpModal);
                  }}
                >
                  Help Me Write{" "}
                  <ChevronRight width={18} height={18} strokeWidth={1.8} />
                </button>
                <div
                  className={
                    "min-w-[150px] h-auto rounded-lg mt-[-5.5px] border-[1.5px] ml-[10px] flex flex-col justify-start items-start p-[5px]" +
                    (helpModal ? " flex" : " hidden") +
                    (theme
                      ? " border-[#252525] bg-[#353e42]"
                      : " border-[#E5E7EB] bg-[#ffffff]")
                  }
                  style={{
                    boxShadow: "0px 1px 15px rgba(0, 0, 0, 0.15)",
                  }}
                >
                  <button
                    className={
                      "min-w-full h-[30px]  p-[5px] text-[14px] font-[geistRegular]  flex justify-start pl-[10px]  items-center bg-transparent cursor-pointer rounded-md " +
                      (theme
                        ? " hover:bg-[#1D2528] text-[#f4efff] hover:text-[white] "
                        : " hover:bg-[#e6e6f4] text-[#6e6e7c] hover:text-[black] ")
                    }
                    onClick={() => {
                      run(
                        "Create an engaging and concise introduction for the following text. The introduction should summarize the main topic and set the tone for the content. Avoid using formatting-related symbols like *, -, or ``` for emphasis, but normal special characters and emojis are allowed if relevant. Provide only the introduction without any additional commentary or instructions.",
                        "Help Me Write/Introduction"
                      );
                      setAiSection("Help Me Write/Introduction");
                      setLoading(true);
                      // editor.dispatchCommand(FORMAT_TEXT_COMMAND, "ai");
                    }}
                  >
                    Introduction
                  </button>
                  <button
                    className={
                      "min-w-full h-[30px]  p-[5px] text-[14px] font-[geistRegular]  flex justify-start pl-[10px]  items-center bg-transparent cursor-pointer rounded-md " +
                      (theme
                        ? " hover:bg-[#1D2528] text-[#f4efff] hover:text-[white] "
                        : " hover:bg-[#e6e6f4] text-[#6e6e7c] hover:text-[black] ")
                    }
                    onClick={() => {
                      run(
                        "Write a clear and impactful conclusion for the following text. The conclusion should summarize the key takeaways and provide a sense of closure. Do not use formatting-related symbols like *, -, or ``` for emphasis. Normal special characters and emojis can be included as needed. Provide only the conclusion without any additional commentary or instructions.",
                        "Help Me Write/Conclusion"
                      );
                      setAiSection("Help Me Write/Conclusion");
                      setLoading(true);
                      // editor.dispatchCommand(FORMAT_TEXT_COMMAND, "ai");
                    }}
                  >
                    Conclusion
                  </button>
                  <button
                    className={
                      "min-w-full h-[30px]  p-[5px] text-[14px] font-[geistRegular]  flex justify-start pl-[10px]  items-center bg-transparent cursor-pointer rounded-md " +
                      (theme
                        ? " hover:bg-[#1D2528] text-[#f4efff] hover:text-[white] "
                        : " hover:bg-[#e6e6f4] text-[#6e6e7c] hover:text-[black] ")
                    }
                    onClick={() => {
                      run(
                        "Generate a concise and attention-grabbing title for the following text. The title should capture the essence of the content and entice the reader. Avoid using formatting-related symbols like *, -, or ``` for emphasis, but normal special characters and emojis are allowed if relevant. Provide only the title without any additional commentary or instructions.",
                        "Help Me Write/Title"
                      );
                      setAiSection("Help Me Write/Title");
                      setLoading(true);
                      // editor.dispatchCommand(FORMAT_TEXT_COMMAND, "ai");
                    }}
                  >
                    Title
                  </button>
                </div>
              </button>

              <button
                className={
                  "w-full h-[30px] text-[14px] font-[geistRegular] mt-[1.2px]  flex justify-start  items-start  cursor-pointer rounded-md overflow-visible"
                }
              >
                <button
                  className={
                    "min-w-full h-[30px]  p-[5px] text-[14px] font-[geistRegular]  flex justify-between pl-[10px]  items-center  cursor-pointer rounded-md " +
                    (toneModal
                      ? theme
                        ? " bg-[#1D2528] text-[#ffffff]"
                        : " bg-[#e6e6f4] text-[#000000]"
                      : theme
                      ? " hover:bg-[#1D2528] bg-transparent text-[#f4efff] hover:text-[white] "
                      : " hover:bg-[#e6e6f4] bg-transparent text-[#6e6e7c] hover:text-[black] ")
                  }
                  onClick={() => {
                    setSummarizeModal(false);
                    setHelpModal(false);
                    setFormatModal(false);
                    setToneModal(!toneModal);
                  }}
                >
                  Change Tone{" "}
                  <ChevronRight width={18} height={18} strokeWidth={1.8} />
                </button>
                <div
                  className={
                    "min-w-[150px] h-auto rounded-lg mt-[-5.5px] border-[1.5px] ml-[10px] flex flex-col justify-start items-start p-[5px]" +
                    (toneModal ? " flex" : " hidden") +
                    (theme
                      ? " border-[#252525] bg-[#353e42]"
                      : " border-[#E5E7EB] bg-[#ffffff]")
                  }
                  style={{
                    boxShadow: "0px 1px 15px rgba(0, 0, 0, 0.15)",
                  }}
                >
                  <button
                    className={
                      "min-w-full h-[30px]  p-[5px] text-[14px] font-[geistRegular]  flex justify-start pl-[10px]  items-center bg-transparent cursor-pointer rounded-md " +
                      (theme
                        ? " hover:bg-[#1D2528] text-[#f4efff] hover:text-[white] "
                        : " hover:bg-[#e6e6f4] text-[#6e6e7c] hover:text-[black] ")
                    }
                    onClick={() => {
                      run(
                        "Rewrite the following text in a professional tone. Ensure the response is formal, clear, and respectful, suitable for business or academic contexts. Avoid using formatting-related symbols like *, -, or ``` for emphasis, but normal special characters and punctuation are allowed. Provide only the revised text without any additional commentary or instructions.",
                        "Change Tone/Professional"
                      );
                      setAiSection("Change Tone/Professional");
                      setLoading(true);
                      // editor.dispatchCommand(FORMAT_TEXT_COMMAND, "ai");
                    }}
                  >
                    Professional
                  </button>
                  <button
                    className={
                      "min-w-full h-[30px]  p-[5px] text-[14px] font-[geistRegular]  flex justify-start pl-[10px]  items-center bg-transparent cursor-pointer rounded-md " +
                      (theme
                        ? " hover:bg-[#1D2528] text-[#f4efff] hover:text-[white] "
                        : " hover:bg-[#e6e6f4] text-[#6e6e7c] hover:text-[black] ")
                    }
                    onClick={() => {
                      run(
                        "Rewrite the following text in a friendly tone. Make it conversational, approachable, and warm while maintaining clarity. Avoid using formatting-related symbols like *, -, or ``` for emphasis, but normal special characters and emojis are allowed. Provide only the revised text without any additional commentary or instructions.",
                        "Change Tone/Friendly"
                      );
                      setAiSection("Change Tone/Friendly");
                      setLoading(true);
                      // editor.dispatchCommand(FORMAT_TEXT_COMMAND, "ai");
                    }}
                  >
                    Friendly
                  </button>
                  <button
                    className={
                      "min-w-full h-[30px]  p-[5px] text-[14px] font-[geistRegular]  flex justify-start pl-[10px]  items-center bg-transparent cursor-pointer rounded-md " +
                      (theme
                        ? " hover:bg-[#1D2528] text-[#f4efff] hover:text-[white] "
                        : " hover:bg-[#e6e6f4] text-[#6e6e7c] hover:text-[black] ")
                    }
                    onClick={() => {
                      run(
                        "Rewrite the following text in a humorous tone. Add lightheartedness, wit, or playful language while ensuring the message remains clear. Avoid using formatting-related symbols like *, -, or ``` for emphasis, but normal special characters, emojis, and punctuation are allowed. Provide only the revised text without any additional commentary or instructions.",
                        "Change Tone/Humorous"
                      );
                      setAiSection("Change Tone/Humorous");
                      setLoading(true);
                      // editor.dispatchCommand(FORMAT_TEXT_COMMAND, "ai");
                    }}
                  >
                    Humorous
                  </button>
                </div>
              </button>
              <button
                className={
                  "w-full h-[30px] text-[14px] font-[geistRegular] mt-[1.2px]  flex justify-start  items-start  cursor-pointer rounded-md overflow-visible"
                }
              >
                <button
                  className={
                    "min-w-full h-[30px]  p-[5px] text-[14px] font-[geistRegular]  flex justify-between pl-[10px]  items-center  cursor-pointer rounded-md " +
                    (formatModal
                      ? theme
                        ? " bg-[#1D2528] text-[#ffffff]"
                        : " bg-[#e6e6f4] text-[#000000]"
                      : theme
                      ? " hover:bg-[#1D2528] bg-transparent text-[#f4efff] hover:text-[white] "
                      : " hover:bg-[#e6e6f4] bg-transparent text-[#6e6e7c] hover:text-[black] ")
                  }
                  onClick={() => {
                    setSummarizeModal(false);
                    setHelpModal(false);
                    setToneModal(false);
                    setFormatModal(!formatModal);
                  }}
                >
                  Change Format{" "}
                  <ChevronRight width={18} height={18} strokeWidth={1.8} />
                </button>
                <div
                  className={
                    "min-w-[150px] h-auto rounded-lg mt-[-5.5px] border-[1.5px] ml-[10px] flex flex-col justify-start items-start p-[5px]" +
                    (formatModal ? " flex" : " hidden") +
                    (theme
                      ? " border-[#252525] bg-[#353e42]"
                      : " border-[#E5E7EB] bg-[#ffffff]")
                  }
                  style={{
                    boxShadow: "0px 1px 15px rgba(0, 0, 0, 0.15)",
                  }}
                >
                  <button
                    className={
                      "min-w-full h-[30px]  p-[5px] text-[14px] font-[geistRegular]  flex justify-start pl-[10px]  items-center bg-transparent cursor-pointer rounded-md " +
                      (theme
                        ? " hover:bg-[#1D2528] text-[#f4efff] hover:text-[white] "
                        : " hover:bg-[#e6e6f4] text-[#6e6e7c] hover:text-[black] ")
                    }
                    onClick={() => {
                      run(
                        "Rewrite the following text into well-structured multiple paragraphs. Each paragraph should focus on a single idea or topic to enhance readability and clarity. Ensure the text flows naturally and is easy to understand. Avoid using formatting-related symbols like *, -, or ``` for emphasis, but normal special characters and punctuation are allowed. Provide only the rewritten text without any additional commentary or instructions.",
                        "Change Format/Paragraph"
                      );
                      setAiSection("Change Format/Paragraph");
                      setLoading(true);
                      // editor.dispatchCommand(FORMAT_TEXT_COMMAND, "ai");
                    }}
                  >
                    Paragraph
                  </button>
                  <button
                    className={
                      "min-w-full h-[30px]  p-[5px] text-[14px] font-[geistRegular]  flex justify-start pl-[10px]  items-center bg-transparent cursor-pointer rounded-md " +
                      (theme
                        ? " hover:bg-[#1D2528] text-[#f4efff] hover:text-[white] "
                        : " hover:bg-[#e6e6f4] text-[#6e6e7c] hover:text-[black] ")
                    }
                    onClick={() => {
                      run(
                        "Rewrite the following text as concise and clear bulleted notes. Each note should represent a key point, but avoid using symbols like *, -, or ``` for bullets. Instead, start each note on a new line with plain text. Normal special characters and punctuation are allowed as needed. Provide only the bulleted notes without any additional commentary or instructions.",
                        "Change Format/Bulleted Note"
                      );
                      setAiSection("Change Format/Bulleted Note");
                      setLoading(true);
                      // editor.dispatchCommand(FORMAT_TEXT_COMMAND, "ai");
                    }}
                  >
                    Bulleted Note
                  </button>
                  <button
                    className={
                      "min-w-full h-[30px]  p-[5px] text-[14px] font-[geistRegular]  flex justify-start pl-[10px]  items-center bg-transparent cursor-pointer rounded-md " +
                      (theme
                        ? " hover:bg-[#1D2528] text-[#f4efff] hover:text-[white] "
                        : " hover:bg-[#e6e6f4] text-[#6e6e7c] hover:text-[black] ")
                    }
                    onClick={() => {
                      run(
                        "Rewrite the following text in the format of an email. Include a subject line, greeting, body text, and a closing statement. The tone should be clear and appropriate for email communication. Avoid using formatting-related symbols like *, -, or ``` for emphasis, but normal special characters and punctuation are allowed. Provide only the email content without any additional commentary or instructions.",
                        "Change Format/Email"
                      );
                      setAiSection("Change Format/Email");
                      setLoading(true);
                      // editor.dispatchCommand(FORMAT_TEXT_COMMAND, "ai");
                    }}
                  >
                    Email
                  </button>
                </div>
              </button>
            </div>
          </div>
        </>
      )}
    </>
  );
}

function useFloatingTextFormatToolbar(
  editor,
  anchorElem,
  setLoading,
  theme,
  AiOutput,
  setAiOutput,
  AiSection,
  setAiSection
) {
  const [isText, setIsText] = useState(false);
  const [isLink, setIsLink] = useState(false);
  const [isBold, setIsBold] = useState(false);
  const [isItalic, setIsItalic] = useState(false);
  const [isUnderline, setIsUnderline] = useState(false);
  const [isStrikethrough, setIsStrikethrough] = useState(false);
  const [isSubscript, setIsSubscript] = useState(false);
  const [isSuperscript, setIsSuperscript] = useState(false);
  const [isCode, setIsCode] = useState(false);

  const updatePopup = useCallback(() => {
    editor.getEditorState().read(() => {
      // Should not to pop up the floating toolbar when using IME input
      if (editor.isComposing()) {
        return;
      }
      const selection = $getSelection();
      const nativeSelection = window.getSelection();
      const rootElement = editor.getRootElement();

      if (
        nativeSelection !== null &&
        (!$isRangeSelection(selection) ||
          rootElement === null ||
          !rootElement.contains(nativeSelection.anchorNode))
      ) {
        setIsText(false);
        return;
      }

      if (!$isRangeSelection(selection)) {
        return;
      }

      const node = getSelectedNode(selection);

      // Update text format
      setIsBold(selection.hasFormat("bold"));
      setIsItalic(selection.hasFormat("italic"));
      setIsUnderline(selection.hasFormat("underline"));
      setIsStrikethrough(selection.hasFormat("strikethrough"));
      setIsSubscript(selection.hasFormat("subscript"));
      setIsSuperscript(selection.hasFormat("superscript"));
      setIsCode(selection.hasFormat("code"));

      // Update links
      const parent = node.getParent();
      if ($isLinkNode(parent) || $isLinkNode(node)) {
        setIsLink(true);
      } else {
        setIsLink(false);
      }

      if (
        !$isCodeHighlightNode(selection.anchor.getNode()) &&
        selection.getTextContent() !== ""
      ) {
        setIsText($isTextNode(node));
      } else {
        setIsText(false);
      }

      const rawTextContent = selection.getTextContent().replace(/\n/g, "");
      if (!selection.isCollapsed() && rawTextContent === "") {
        setIsText(false);
        return;
      }
    });
  }, [editor]);

  useEffect(() => {
    document.addEventListener("selectionchange", updatePopup);
    return () => {
      document.removeEventListener("selectionchange", updatePopup);
    };
  }, [updatePopup]);

  useEffect(() => {
    return mergeRegister(
      editor.registerUpdateListener(() => {
        updatePopup();
      }),
      editor.registerRootListener(() => {
        if (editor.getRootElement() === null) {
          setIsText(false);
        }
      })
    );
  }, [editor, updatePopup]);

  if (!isText || isLink) {
    return null;
  }

  return createPortal(
    <TextFormatFloatingToolbar
      editor={editor}
      anchorElem={anchorElem}
      isLink={isLink}
      isBold={isBold}
      isItalic={isItalic}
      isStrikethrough={isStrikethrough}
      isSubscript={isSubscript}
      isSuperscript={isSuperscript}
      isUnderline={isUnderline}
      isCode={isCode}
      setLoading={setLoading}
      theme={theme}
      AiOutput={AiOutput}
      setAiOutput={setAiOutput}
      AiSection={AiSection}
      setAiSection={setAiSection}
    />,
    anchorElem
  );
}

export default function TextFormatFloatingToolbarPlugin({
  anchorElem = document.body,
  setLoading,
  theme,
  AiOutput,
  setAiOutput,
  AiSection,
  setAiSection,
}) {
  const [editor] = useLexicalComposerContext();
  return useFloatingTextFormatToolbar(
    editor,
    anchorElem,
    setLoading,
    theme,
    AiOutput,
    setAiOutput,
    AiSection,
    setAiSection
  );
}
