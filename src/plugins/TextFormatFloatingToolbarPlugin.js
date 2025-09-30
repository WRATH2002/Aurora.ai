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
  Wand,
  WandSparkles,
  WrapText,
} from "lucide-react";
import { GoogleGenerativeAI } from "@google/generative-ai";
import APILimitError from "../components/APILimitError";
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
import { HugeiconsIcon } from "@hugeicons/react";
import {
  ArrowRight01Icon,
  CursorMagicSelection02Icon,
  CursorMagicSelection04Icon,
  Mic02Icon,
  TextBoldIcon,
  TextItalicIcon,
  TextStrikethroughIcon,
  TextUnderlineIcon,
} from "@hugeicons/core-free-icons";
import { AIPrompts, languages, systemPrompt } from "../utils/constant";

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
  const [translateModal, setTranslateModal] = useState(false);
  const [formatModal, setFormatModal] = useState(false);
  const [selectionNode, setSelectionNode] = useState(null);
  const [selectedText, setSelectedText] = useState("");
  const [prompt, setPrompt] = useState("Make the above text in paras");
  const [aiError, setAiError] = useState(false);
  const [aiErrorMessage, setAiErrorMessage] = useState("");
  const [activeApiKeyID, setActiveAPIKeyID] = useState("");

  const [editorr] = useLexicalComposerContext();

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

  const genAI = new GoogleGenerativeAI(processStringDecrypt(activeApiKeyID));
  const model = genAI.getGenerativeModel({
    model: "gemini-2.0-flash",
    systemInstruction: {
      parts: [{ text: systemPrompt }],
    },
  });

  const generationConfig = {
    temperature: 1,
    top_p: 0.95,
    top_k: 64,
    max_output_tokens: 8192,
    // response_mime_type: "text/plain",
    response_mime_type: "application/json",
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
      const result = await chatSession.sendMessage(`${chosenPrompt}
        ${selectedText}`);
      const parsedResponse = JSON.parse(result.response.text());
      console.log(parsedResponse);

      if (parsedResponse?.code == 100) {
        editorr.update(() => {
          const selection = $getSelection();
          if (selection !== null) {
            selection.insertText(parsedResponse?.promptResponse);
          }
        });
      }

      setLoading(false);
      // const result = await chatSession.sendMessage(
      //   `${chosenPrompt}
      //   ${selectedText}`
      // );

      // console.log(result?.response?.text());
      // setLoading(false);
      // setAiOutput([{ Section: sec, Message: [result?.response?.text()] }]);
      // ----------
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
            className="flex flex-col justify-start items-start h-[35px] overflow-visible"
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
              transition: "opacity 0.2s",
              //   height: 35,
              willChange: "transform",
            }}
          >
            <div
              className={
                "font-[r] flex justify-start items-center rounded-[10px] h-[35px] border border-[#d2d2d2]" +
                (theme ? " bg-[#181b20]" : " bg-[#ffffff]")
              }
              style={{
                background: "#fff",
                padding: "4px 4px",
                boxShadow: "0 12px 16px -6px rgba(0, 0, 0, 0.1)",
                zIndex: "200",
                whiteSpace: "nowrap",
              }}
            >
              <button
                className={
                  "h-full aspect-square px-[10px] rounded-lg flex justify-center items-center cursor-pointer " +
                  (showAiMenu
                    ? theme
                      ? " text-[white] bg-[#313C40]"
                      : " text-[black] bg-[#e9e9e9]"
                    : theme
                    ? " text-[#f4efff] hover:bg-[#313C40]"
                    : " text-[#454545] hover:bg-[#e9e9e9]")
                }
                onClick={() => {
                  setShowAiMenu(!showAiMenu);
                }}
              >
                <HugeiconsIcon
                  icon={CursorMagicSelection04Icon}
                  size={16}
                  strokeWidth="1.7"
                  className="rotate-90"
                />{" "}
                <span className="text-[13px] ml-[7px]">Improve writing</span>
              </button>
              <div className="mx-[5px] h-[16px] border-l-[1.5px] border-[#e9e9e9]"></div>
              <button
                className={
                  "h-full aspect-square  ml-[0px] rounded-lg flex justify-center items-center    cursor-pointer  " +
                  (isStrikethrough
                    ? theme
                      ? " bg-[#313C40] text-[#f4efff] cursor-pointer"
                      : " bg-[#e9e9e9] text-[#000000] cursor-pointer"
                    : theme
                    ? " hover:bg-[#313C40] text-[#f4efff] "
                    : " hover:bg-[#e9e9e9] text-[#454545] ")
                }
                onClick={() => {
                  editor.dispatchCommand(FORMAT_TEXT_COMMAND, "strikethrough");
                }}
              >
                <HugeiconsIcon icon={Mic02Icon} size={14} strokeWidth="2.1" />
              </button>
              <div className="mx-[5px] h-[16px] border-l-[1.5px] border-[#e9e9e9]"></div>
              {/* ---- Section */}
              <button
                className={
                  "h-full aspect-square  rounded-lg flex justify-center items-center    cursor-pointer  " +
                  (isBold
                    ? theme
                      ? " bg-[#313C40] text-[#f4efff] cursor-pointer"
                      : " bg-[#e9e9e9] text-[#000000] cursor-pointer"
                    : theme
                    ? " hover:bg-[#313C40] text-[#f4efff] "
                    : " hover:bg-[#e9e9e9] text-[#454545] ")
                }
                onClick={() => {
                  editor.dispatchCommand(FORMAT_TEXT_COMMAND, "bold");
                }}
              >
                <HugeiconsIcon
                  icon={TextBoldIcon}
                  size={14}
                  strokeWidth="2.9"
                />
              </button>
              <button
                className={
                  "h-full aspect-square  ml-[0px] rounded-lg flex justify-center items-center    cursor-pointer  " +
                  (isItalic
                    ? theme
                      ? " bg-[#313C40] text-[#f4efff] cursor-pointer"
                      : " bg-[#e9e9e9] text-[#000000] cursor-pointer"
                    : theme
                    ? " hover:bg-[#313C40] text-[#f4efff] "
                    : " hover:bg-[#e9e9e9] text-[#454545]")
                }
                onClick={() => {
                  editor.dispatchCommand(FORMAT_TEXT_COMMAND, "italic");
                }}
              >
                <HugeiconsIcon
                  icon={TextItalicIcon}
                  size={14}
                  strokeWidth="2.1"
                />
              </button>
              <button
                className={
                  "h-full aspect-square  ml-[0px] rounded-lg flex justify-center items-center    cursor-pointer  " +
                  (isUnderline
                    ? theme
                      ? " bg-[#313C40] text-[#f4efff] cursor-pointer"
                      : " bg-[#e9e9e9] text-[#000000] cursor-pointer"
                    : theme
                    ? " hover:bg-[#313C40] text-[#f4efff] "
                    : " hover:bg-[#e9e9e9] text-[#454545]")
                }
                onClick={() => {
                  editor.dispatchCommand(FORMAT_TEXT_COMMAND, "underline");
                }}
              >
                <HugeiconsIcon
                  icon={TextUnderlineIcon}
                  size={14}
                  strokeWidth="2.1"
                />
              </button>
              <button
                className={
                  "h-full aspect-square  ml-[0px] rounded-lg flex justify-center items-center    cursor-pointer  " +
                  (isStrikethrough
                    ? theme
                      ? " bg-[#313C40] text-[#f4efff] cursor-pointer"
                      : " bg-[#e9e9e9] text-[#000000] cursor-pointer"
                    : theme
                    ? " hover:bg-[#313C40] text-[#f4efff] "
                    : " hover:bg-[#e9e9e9] text-[#454545] ")
                }
                onClick={() => {
                  editor.dispatchCommand(FORMAT_TEXT_COMMAND, "strikethrough");
                }}
              >
                <HugeiconsIcon
                  icon={TextStrikethroughIcon}
                  size={14}
                  strokeWidth="2.1"
                />
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
                "mt-[5px] z-[300] flex-col justify-start items-center font-[r] rounded-[10px] p-[4px] text-[13px] border w-[142px] " +
                (showAiMenu ? " flex" : " hidden") +
                (theme
                  ? " border-[#252525] bg-[#353e42]"
                  : " border-[#d2d2d2] bg-[#ffffff]")
              }
              style={{
                boxShadow: "0 12px 16px -6px rgba(0, 0, 0, 0.1)",
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

              {/* ---- Summarize -> */}
              <button
                className={
                  "w-full h-[27px] flex justify-start  items-start bg-transparent cursor-pointer rounded-lg overflow-visible"
                }
              >
                <button
                  className={
                    "min-w-full h-[27px]  p-[5px] flex justify-between pl-[10px]  items-center cursor-pointer rounded-lg " +
                    (summarizeModal
                      ? theme
                        ? " bg-[#1D2528] text-[#ffffff]"
                        : " bg-[#e9e9e9] text-[#000000]"
                      : theme
                      ? " hover:bg-[#1D2528] bg-transparent text-[#f4efff] "
                      : " hover:bg-[#e9e9e9] bg-transparent text-[#454545] ")
                  }
                  onClick={() => {
                    setHelpModal(false);
                    setToneModal(false);
                    setFormatModal(false);
                    setTranslateModal(false);
                    setSummarizeModal(!summarizeModal);
                  }}
                >
                  Summarize{" "}
                  <HugeiconsIcon
                    icon={ArrowRight01Icon}
                    size={16}
                    strokeWidth={1.8}
                  />
                </button>
                {/* ---- Summarize options -> */}
                <div
                  className={
                    "min-w-[120px] h-auto mt-[-4px] font-[r] rounded-[10px] p-[4px] text-[13px] border ml-[10px] flex flex-col justify-start items-start#" +
                    (summarizeModal ? " flex" : " hidden") +
                    (theme
                      ? " border-[#252525] bg-[#353e42]"
                      : " border-[#d2d2d2] bg-[#ffffff]")
                  }
                  style={{
                    boxShadow: "0 12px 16px -6px rgba(0, 0, 0, 0.1)",
                  }}
                >
                  <button
                    className={
                      "min-w-full h-[27px] p-[5px] flex justify-start pl-[10px]  items-center bg-transparent cursor-pointer rounded-lg " +
                      (theme
                        ? " hover:bg-[#1D2528] text-[#f4efff] "
                        : " hover:bg-[#e9e9e9] text-[#454545] ")
                    }
                    onClick={() => {
                      run(`${AIPrompts.bulleted_summary}`, "summary/bulleted");
                      setAiSection("summary/bulleted");
                      setLoading(true);
                      // editor.dispatchCommand(FORMAT_TEXT_COMMAND, "ai");
                    }}
                  >
                    Bulleted
                  </button>
                  <button
                    className={
                      "min-w-full h-[27px] p-[5px] flex justify-start pl-[10px]  items-center bg-transparent cursor-pointer rounded-lg " +
                      (theme
                        ? " hover:bg-[#1D2528] text-[#f4efff] "
                        : " hover:bg-[#e9e9e9] text-[#454545] ")
                    }
                    onClick={() => {
                      run(
                        `${AIPrompts.paragraph_summary}`,
                        "summary/paragraph"
                      );
                      setAiSection("summary/paragraph");
                      setLoading(true);
                      // editor.dispatchCommand(FORMAT_TEXT_COMMAND, "ai");
                    }}
                  >
                    Paragraph
                  </button>
                  <button
                    className={
                      "min-w-full h-[27px] p-[5px] flex justify-start pl-[10px]  items-center bg-transparent cursor-pointer rounded-lg " +
                      (theme
                        ? " hover:bg-[#1D2528] text-[#f4efff] "
                        : " hover:bg-[#e9e9e9] text-[#454545] ")
                    }
                    onClick={() => {
                      run(
                        `${AIPrompts.one_sentence_summary}`,
                        "summary/oneLiner"
                      );
                      setAiSection("summary/oneLiner");
                      setLoading(true);
                      // editor.dispatchCommand(FORMAT_TEXT_COMMAND, "ai");
                    }}
                  >
                    One-Liner
                  </button>
                </div>
              </button>
              {/* ---- Fix Typos -> */}
              <button
                className={
                  "w-full h-[27px]  p-[5px] mt-[1.2px] flex justify-start pl-[10px]  items-center bg-transparent cursor-pointer rounded-lg " +
                  (theme
                    ? " hover:bg-[#1D2528] text-[#f4efff] "
                    : " hover:bg-[#e9e9e9] text-[#454545] ")
                }
                onClick={() => {
                  run(`${AIPrompts.fix_typos}`, "fixTypos");
                  setAiSection("fixTypos");
                  setLoading(true);
                  // editor.dispatchCommand(FORMAT_TEXT_COMMAND, "ai");
                }}
              >
                Fix Typos
              </button>
              {/* ---- Improve Writing -> */}
              <button
                className={
                  "w-full h-[27px]  p-[5px] mt-[1.2px] flex justify-start pl-[10px]  items-center bg-transparent cursor-pointer rounded-lg " +
                  (theme
                    ? " hover:bg-[#1D2528] text-[#f4efff] "
                    : " hover:bg-[#e9e9e9] text-[#454545] ")
                }
                onClick={() => {
                  run(`${AIPrompts.improve_writing}`, "improveWriting");
                  setAiSection("improveWriting");
                  setLoading(true);
                  // editor.dispatchCommand(FORMAT_TEXT_COMMAND, "ai");
                }}
              >
                Improve Writing
              </button>
              {/* ---- Help me Write -> */}
              <button
                className={
                  "w-full h-[27px] mt-[1.2px]  flex justify-start  items-start  cursor-pointer rounded-lg overflow-visible"
                }
              >
                <button
                  className={
                    "min-w-full h-[27px] p-[5px] flex justify-between pl-[10px]  items-center  cursor-pointer rounded-lg " +
                    (helpModal
                      ? theme
                        ? " bg-[#1D2528] text-[#ffffff]"
                        : " bg-[#e9e9e9] text-[#000000]"
                      : theme
                      ? " hover:bg-[#1D2528] bg-transparent text-[#f4efff] "
                      : " hover:bg-[#e9e9e9] bg-transparent text-[#454545] ")
                  }
                  onClick={() => {
                    setSummarizeModal(false);
                    setToneModal(false);
                    setFormatModal(false);
                    setTranslateModal(false);
                    setHelpModal(!helpModal);
                  }}
                >
                  Help Me Write{" "}
                  <HugeiconsIcon
                    icon={ArrowRight01Icon}
                    size={16}
                    strokeWidth={1.8}
                  />
                </button>
                {/* ---- Help me write options -> */}
                <div
                  className={
                    "min-w-[120px] h-auto mt-[-4px] font-[r] rounded-[10px] p-[4px] text-[13px] border ml-[10px] flex flex-col justify-start items-start#" +
                    (helpModal ? " flex" : " hidden") +
                    (theme
                      ? " border-[#252525] bg-[#353e42]"
                      : " border-[#d2d2d2] bg-[#ffffff]")
                  }
                  style={{
                    boxShadow: "0 12px 16px -6px rgba(0, 0, 0, 0.1)",
                  }}
                >
                  <button
                    className={
                      "min-w-full h-[27px] p-[5px] flex justify-start pl-[10px]  items-center bg-transparent cursor-pointer rounded-lg " +
                      (theme
                        ? " hover:bg-[#1D2528] text-[#f4efff] "
                        : " hover:bg-[#e9e9e9] text-[#454545] ")
                    }
                    onClick={() => {
                      run(`${AIPrompts.title}`, "helpMeWrite/title");
                      setAiSection("helpMeWrite/title");
                      setLoading(true);
                      // editor.dispatchCommand(FORMAT_TEXT_COMMAND, "ai");
                    }}
                  >
                    Title
                  </button>
                  <button
                    className={
                      "min-w-full h-[27px] p-[5px] flex justify-start pl-[10px]  items-center bg-transparent cursor-pointer rounded-lg " +
                      (theme
                        ? " hover:bg-[#1D2528] text-[#f4efff] "
                        : " hover:bg-[#e9e9e9] text-[#454545] ")
                    }
                    onClick={() => {
                      run(
                        `${AIPrompts.introduction}`,
                        "helpMeWrite/introduction"
                      );
                      setAiSection("helpMeWrite/introduction");
                      setLoading(true);
                      // editor.dispatchCommand(FORMAT_TEXT_COMMAND, "ai");
                    }}
                  >
                    Introduction
                  </button>
                  <button
                    className={
                      "min-w-full h-[27px] p-[5px] flex justify-start pl-[10px]  items-center bg-transparent cursor-pointer rounded-lg " +
                      (theme
                        ? " hover:bg-[#1D2528] text-[#f4efff] "
                        : " hover:bg-[#e9e9e9] text-[#454545] ")
                    }
                    onClick={() => {
                      run(`${AIPrompts.conclusion}`, "helpMeWrite/conclusion");
                      setAiSection("helpMeWrite/conclusion");
                      setLoading(true);
                      // editor.dispatchCommand(FORMAT_TEXT_COMMAND, "ai");
                    }}
                  >
                    Conclusion
                  </button>
                </div>
              </button>
              {/* ---- Change Tone -> */}
              <button
                className={
                  "w-full h-[27px] mt-[1.2px]  flex justify-start  items-start  cursor-pointer rounded-lg overflow-visible"
                }
              >
                <button
                  className={
                    "min-w-full h-[27px] p-[5px] flex justify-between pl-[10px]  items-center  cursor-pointer rounded-lg" +
                    (toneModal
                      ? theme
                        ? " bg-[#1D2528] text-[#ffffff]"
                        : " bg-[#e9e9e9] text-[#000000]"
                      : theme
                      ? " hover:bg-[#1D2528] bg-transparent text-[#f4efff] "
                      : " hover:bg-[#e9e9e9] bg-transparent text-[#454545]")
                  }
                  onClick={() => {
                    setSummarizeModal(false);
                    setHelpModal(false);
                    setFormatModal(false);
                    setTranslateModal(false);
                    setToneModal(!toneModal);
                  }}
                >
                  Change Tone{" "}
                  <HugeiconsIcon
                    icon={ArrowRight01Icon}
                    size={16}
                    strokeWidth={1.8}
                  />
                </button>
                {/* ---- Change Tone options -> */}
                <div
                  className={
                    "min-w-[120px] h-auto mt-[-4px] font-[r] rounded-[10px] p-[4px] text-[13px] border ml-[10px] flex flex-col justify-start items-start#" +
                    (toneModal ? " flex" : " hidden") +
                    (theme
                      ? " border-[#252525] bg-[#353e42]"
                      : " border-[#d2d2d2] bg-[#ffffff]")
                  }
                  style={{
                    boxShadow: "0 12px 16px -6px rgba(0, 0, 0, 0.1)",
                  }}
                >
                  <button
                    className={
                      "min-w-full h-[27px] p-[5px] flex justify-start pl-[10px]  items-center bg-transparent cursor-pointer rounded-lg " +
                      (theme
                        ? " hover:bg-[#1D2528] text-[#f4efff] "
                        : " hover:bg-[#e9e9e9] text-[#454545]")
                    }
                    onClick={() => {
                      run(
                        `${AIPrompts.tone_professional}`,
                        "changeTone/professional"
                      );
                      setAiSection("changeTone/professional");
                      setLoading(true);
                      // editor.dispatchCommand(FORMAT_TEXT_COMMAND, "ai");
                    }}
                  >
                    Professional
                  </button>
                  <button
                    className={
                      "min-w-full h-[27px] p-[5px] flex justify-start pl-[10px]  items-center bg-transparent cursor-pointer rounded-lg " +
                      (theme
                        ? " hover:bg-[#1D2528] text-[#f4efff] "
                        : " hover:bg-[#e9e9e9] text-[#454545]")
                    }
                    onClick={() => {
                      run(`${AIPrompts.tone_casual}`, "changeTone/casual");
                      setAiSection("changeTone/casual");
                      setLoading(true);
                      // editor.dispatchCommand(FORMAT_TEXT_COMMAND, "ai");
                    }}
                  >
                    Casual
                  </button>
                  <button
                    className={
                      "min-w-full h-[27px] p-[5px] flex justify-start pl-[10px]  items-center bg-transparent cursor-pointer rounded-lg " +
                      (theme
                        ? " hover:bg-[#1D2528] text-[#f4efff] "
                        : " hover:bg-[#e9e9e9] text-[#454545]")
                    }
                    onClick={() => {
                      run(
                        `${AIPrompts.tone_straightforward}`,
                        "changeTone/straightforward"
                      );
                      setAiSection("changeTone/straightforward");
                      setLoading(true);
                      // editor.dispatchCommand(FORMAT_TEXT_COMMAND, "ai");
                    }}
                  >
                    Straightforward
                  </button>
                  <button
                    className={
                      "min-w-full h-[27px] p-[5px] flex justify-start pl-[10px]  items-center bg-transparent cursor-pointer rounded-lg " +
                      (theme
                        ? " hover:bg-[#1D2528] text-[#f4efff] "
                        : " hover:bg-[#e9e9e9] text-[#454545]")
                    }
                    onClick={() => {
                      run(`${AIPrompts.tone_confdent}`, "changeTone/confident");
                      setAiSection("changeTone/confident");
                      setLoading(true);
                      // editor.dispatchCommand(FORMAT_TEXT_COMMAND, "ai");
                    }}
                  >
                    Confident
                  </button>
                  <button
                    className={
                      "min-w-full h-[27px] p-[5px] flex justify-start pl-[10px]  items-center bg-transparent cursor-pointer rounded-lg " +
                      (theme
                        ? " hover:bg-[#1D2528] text-[#f4efff] "
                        : " hover:bg-[#e9e9e9] text-[#454545]")
                    }
                    onClick={() => {
                      run(`${AIPrompts.tone_friendly}`, "changeTone/friendly");
                      setAiSection("changeTone/friendly");
                      setLoading(true);
                      // editor.dispatchCommand(FORMAT_TEXT_COMMAND, "ai");
                    }}
                  >
                    Friendly
                  </button>
                </div>
              </button>
              {/* ---- Change Format -> */}
              <button
                className={
                  "w-full h-[27px] mt-[1.2px]  flex justify-start  items-start  cursor-pointer rounded-lg overflow-visible"
                }
              >
                <button
                  className={
                    "min-w-full h-[27px] p-[5px] flex justify-between pl-[10px]  items-center  cursor-pointer rounded-lg " +
                    (formatModal
                      ? theme
                        ? " bg-[#1D2528] text-[#ffffff]"
                        : " bg-[#e9e9e9] text-[#000000]"
                      : theme
                      ? " hover:bg-[#1D2528] bg-transparent text-[#f4efff] "
                      : " hover:bg-[#e9e9e9] bg-transparent text-[#454545]")
                  }
                  onClick={() => {
                    setSummarizeModal(false);
                    setHelpModal(false);
                    setToneModal(false);
                    setTranslateModal(false);
                    setFormatModal(!formatModal);
                  }}
                >
                  Change Format{" "}
                  <HugeiconsIcon
                    icon={ArrowRight01Icon}
                    size={16}
                    strokeWidth={1.8}
                  />
                </button>
                {/* ---- Change format options -> */}
                <div
                  className={
                    "min-w-[120px] h-auto mt-[-4px] font-[r] rounded-[10px] p-[4px] text-[13px] border ml-[10px] flex flex-col justify-start items-start#" +
                    (formatModal ? " flex" : " hidden") +
                    (theme
                      ? " border-[#252525] bg-[#353e42]"
                      : " border-[#d2d2d2] bg-[#ffffff]")
                  }
                  style={{
                    boxShadow: "0 12px 16px -6px rgba(0, 0, 0, 0.1)",
                  }}
                >
                  <button
                    className={
                      "min-w-full h-[27px] p-[5px] flex justify-start pl-[10px] items-center bg-transparent cursor-pointer rounded-lg " +
                      (theme
                        ? " hover:bg-[#1D2528] text-[#f4efff] "
                        : " hover:bg-[#e9e9e9] text-[#454545] ")
                    }
                    onClick={() => {
                      run(`${AIPrompts.change_to_email}`, "changeFormat/email");
                      setAiSection("changeFormat/email");
                      setLoading(true);
                      // editor.dispatchCommand(FORMAT_TEXT_COMMAND, "ai");
                    }}
                  >
                    Email
                  </button>
                  <button
                    className={
                      "min-w-full h-[27px] p-[5px] flex justify-start pl-[10px] items-center bg-transparent cursor-pointer rounded-lg " +
                      (theme
                        ? " hover:bg-[#1D2528] text-[#f4efff] "
                        : " hover:bg-[#e9e9e9] text-[#454545] ")
                    }
                    onClick={() => {
                      run(
                        `${AIPrompts.change_to_paragraph}`,
                        "changeFormat/paragraph"
                      );
                      setAiSection("changeFormat/paragraph");
                      setLoading(true);
                      // editor.dispatchCommand(FORMAT_TEXT_COMMAND, "ai");
                    }}
                  >
                    Paragraph
                  </button>
                  <button
                    className={
                      "min-w-full h-[27px] p-[5px] flex justify-start pl-[10px] items-center bg-transparent cursor-pointer rounded-lg " +
                      (theme
                        ? " hover:bg-[#1D2528] text-[#f4efff] "
                        : " hover:bg-[#e9e9e9] text-[#454545] ")
                    }
                    onClick={() => {
                      run(
                        `${AIPrompts.change_to_shorter}`,
                        "changeFormat/makeShorter"
                      );
                      setAiSection("changeFormat/makeShorter");
                      setLoading(true);
                      // editor.dispatchCommand(FORMAT_TEXT_COMMAND, "ai");
                    }}
                  >
                    Make shorter
                  </button>
                  <button
                    className={
                      "min-w-full h-[27px] p-[5px] flex justify-start pl-[10px] items-center bg-transparent cursor-pointer rounded-lg " +
                      (theme
                        ? " hover:bg-[#1D2528] text-[#f4efff] "
                        : " hover:bg-[#e9e9e9] text-[#454545] ")
                    }
                    onClick={() => {
                      run(
                        `${AIPrompts.change_to_longer}`,
                        "changeFormat/makeLonger"
                      );
                      setAiSection("changeFormat/makeLonger");
                      setLoading(true);
                      // editor.dispatchCommand(FORMAT_TEXT_COMMAND, "ai");
                    }}
                  >
                    Make longer
                  </button>
                </div>
              </button>
              {/* ---- Translate to -> */}
              <button
                className={
                  "w-full h-[27px] mt-[1.2px]  flex justify-start  items-start  cursor-pointer rounded-lg overflow-visible"
                }
              >
                <button
                  className={
                    "min-w-full h-[27px] p-[5px] flex justify-between pl-[10px]  items-center  cursor-pointer rounded-lg" +
                    (translateModal
                      ? theme
                        ? " bg-[#1D2528] text-[#ffffff]"
                        : " bg-[#e9e9e9] text-[#000000]"
                      : theme
                      ? " hover:bg-[#1D2528] bg-transparent text-[#f4efff] "
                      : " hover:bg-[#e9e9e9] bg-transparent text-[#454545]")
                  }
                  onClick={() => {
                    setSummarizeModal(false);
                    setHelpModal(false);
                    setFormatModal(false);
                    setToneModal(false);
                    setTranslateModal(!translateModal);
                  }}
                >
                  Translate to{" "}
                  <HugeiconsIcon
                    icon={ArrowRight01Icon}
                    size={16}
                    strokeWidth={1.8}
                  />
                </button>
                {/* ---- Translate to options -> */}
                <div
                  className={
                    "min-w-[120px] max-h-[198px] overflow-y-scroll mt-[-4px] font-[r] rounded-[10px] p-[4px] text-[13px] border ml-[10px] flex flex-col justify-start items-start#" +
                    (translateModal ? " flex" : " hidden") +
                    (theme
                      ? " border-[#252525] bg-[#353e42]"
                      : " border-[#d2d2d2] bg-[#ffffff]")
                  }
                  style={{
                    boxShadow: "0 12px 16px -6px rgba(0, 0, 0, 0.1)",
                  }}
                >
                  {languages?.map((data, index) => {
                    return (
                      <button
                        key={index}
                        className={
                          "min-w-full h-[27px] p-[5px] flex justify-start pl-[10px]  items-center bg-transparent cursor-pointer rounded-lg " +
                          (theme
                            ? " hover:bg-[#1D2528] text-[#f4efff] "
                            : " hover:bg-[#e9e9e9] text-[#454545]")
                        }
                        onClick={() => {
                          run(
                            `Translate the following text into ${data}.${AIPrompts.translate_to_language}`,
                            `translateTo/${data}`
                          );
                          // console.log(
                          //   `Translate the following text into ${data}.${AIPrompts.translate_to_language}`
                          // );
                          setAiSection(`translateTo/${data}`);
                          setLoading(true);
                          // editor.dispatchCommand(FORMAT_TEXT_COMMAND, "ai");
                        }}
                      >
                        {data}
                      </button>
                    );
                  })}
                </div>
              </button>
              {/* <button
                className={
                  "w-full h-[27px]  p-[5px] mt-[1.2px] flex justify-start pl-[10px]  items-center bg-transparent cursor-pointer rounded-lg " +
                  (theme
                    ? " hover:bg-[#1D2528] text-[#f4efff] "
                    : " hover:bg-[#e9e9e9] text-[#454545] ")
                }
                onClick={() => {
                  run(`${AIPrompts.fix_typos}`, "translateTo");
                  setAiSection("translateTo");
                  setLoading(true);
                  // editor.dispatchCommand(FORMAT_TEXT_COMMAND, "ai");
                }}
              >
                Translate to
              </button> */}
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
