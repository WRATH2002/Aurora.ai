import React, { useState, useEffect } from "react";
import { auth, db } from "../firebase";
import {
  arrayRemove,
  arrayUnion,
  onSnapshot,
  serverTimestamp,
  Timestamp,
} from "firebase/firestore";
import firebase from "../firebase";
import { useNavigate, useSearchParams } from "react-router-dom";
import {
  Copy,
  RefreshCw,
  ThumbsDown,
  ThumbsUp,
  Volume2,
  X,
} from "lucide-react";
// import { auth } from "../firebase";
import { onAuthStateChanged } from "firebase/auth";
import { lineWobble } from "ldrs";
lineWobble.register();

// Default values shown

export default function SharedChat() {
  const [isUser, setIsUser] = useState(null);
  const [sharedChat, setSharedChat] = useState([]);
  const [sharedChatInfo, setSharedChatInfo] = useState([]);
  const [searchParams] = useSearchParams();
  const [theme, setTheme] = useState(false);
  const navigate = useNavigate();

  function navigateToSection() {
    navigate(`/shared/login`);
  }

  function fetchTheme(userrr) {
    const user = firebase.auth().currentUser;
    const channelRef = db.collection("user").doc(user?.uid);
    onSnapshot(channelRef, (snapshot) => {
      setTheme(snapshot?.data()?.Theme);
      setTimeout(() => {
        setIsUser(userrr);
      }, 50);
    });
  }

  //   useEffect(() => {

  //   }, []);

  useEffect(() => {
    const listen = onAuthStateChanged(auth, (user) => {
      if (user) {
        fetchTheme(user);
        let temp = searchParams.get("chat")?.split("?userID=");
        fetchAllChatInfo(temp[0] + "~_~" + temp[1]);
        console.log("logged in");
      } else {
        // alert("Please login to your account");
        navigateToSection();
      }
    });
    return () => {
      listen();
    };
  }, []);

  // ------------------------- Function to fetch all AI Chat Info
  function fetchAllChatInfo(path) {
    const user = firebase.auth().currentUser;
    const chatRef1 = db.collection("sharedChat").doc(path);

    onSnapshot(chatRef1, (snapshot) => {
      setSharedChat(snapshot?.data()?.chats);
      setSharedChatInfo({
        SharedDate: snapshot?.data()?.sharedDate,
        SharedTime: snapshot?.data()?.sharedTime,
        SharedDuration: snapshot?.data()?.sharedDuration,
        Visibility: snapshot?.data()?.visibility,
        Users: snapshot?.data()?.users,
      });
    });
  }

  // ------------------------- Calling `fetchAllChatInfo()` function
  //   useEffect(() => {
  //     let temp = searchParams.get("chat")?.split("?userID=");
  //     fetchAllChatInfo(temp[0]);
  //   }, []);

  //   searchParams.get("ID");

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
    setTheme_TextColorPrimary(theme ? "#ffffff" : "#000000");
    setTheme_TextColorSecondary(theme ? "#dddddd" : "#5c5c5c");
    setTheme_CodeSnippetForeground(theme ? "#1a1a1a" : "#ffffff");
    setTheme_CodeSnippetBackground(theme ? "#222222" : "#F6F6F6");
    setTheme_CodeSnippetBorder(theme ? "#383838" : "#eaeaea");
    setTheme_LanguageBorder(theme ? "#dfdfdf" : "#424242");
    setTheme_CodeText(theme ? "#2e2e2e" : "#ececec");
    setTheme_CopyBGHover(theme ? "#383838" : "#ececec");
    setTheme_CodeSnippetScrollbar(
      theme ? "snippetScrollDark" : "snippetScrollLight"
    );
  }, [theme]);

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

  // ----------------------------- Function to send access request
  function sendAccessRequest() {
    const user = firebase.auth().currentUser;
    let temp = searchParams.get("chat")?.split("?userID=");
    db.collection("user")
      .doc(temp[1])
      .collection("AIChats")
      .doc("AllAIChats")
      .update({
        ChatAccessRequest: arrayUnion({
          Requestor: user?.uid,
          RequestedFor: temp[0],
        }),
      });
  }

  return (
    <>
      {isUser ? (
        <>
          <div
            className={
              "w-full h-[100svh] fixed left-0 top-0 justify-center items-center z-50 backdrop-blur-[10px] text-[14px]" +
              (theme ? " bg-[#00000078]" : " bg-[#b0b0b081]") +
              (searchParams.get("chat")?.split("?userID=")[1] == isUser?.uid ||
              sharedChatInfo?.Visibility == "Public" ||
              sharedChatInfo?.Users.includes(isUser?.uid)
                ? " hidden"
                : " flex")
            }
            onClick={() => {
              //   setRenameModalData([]);
              //   setRenameModal(false);
            }}
          >
            <div
              className={
                "w-[350px] h-auto rounded-2xl border-[1.5px] boxShadowLight2 flex flex-col justify-start items-start p-[25px] pt-[18px] " +
                (theme
                  ? " bg-[#1A1A1A] border-[#252525]"
                  : " bg-[#ffffff] border-[#eaeaea]")
              }
              onClick={(e) => {
                e.stopPropagation();
              }}
            >
              <span
                className={
                  "text-[22px] font-[geistMedium] w-full flex justify-between items-center" +
                  (theme ? " text-[white]" : " text-[black]")
                }
              >
                Request access !
                {/* <X
                  width={18}
                  height={18}
                  strokeWidth={2.2}
                  className={
                    "cursor-pointer " +
                    (theme
                      ? " text-[#828282] hover:text-[white]"
                      : " text-[#828282] hover:text-[black]")
                  }
                  onClick={(e) => {}}
                /> */}
              </span>
              <div
                className={
                  "w-full mt-[20px]" +
                  (theme ? " text-[#828282]" : " text-[#828282]")
                }
              >
                You do not currently have permission to view this shared chat.
                Please request access to proceed.
              </div>
              <div className="w-full mt-[30px] flex justify-end items-center">
                <button
                  className={
                    "px-[15px] h-[30px] rounded-[8px] border-[1.5px] flex justify-center items-center text-[14px] " +
                    (theme
                      ? " bg-[#404040] hover:bg-[#656565] border-[#515151] hover:border-[#717171]  text-[#ffffff] opacity-100 cursor-pointer"
                      : " bg-[#222222] text-[#828282]")
                  }
                  onClick={() => {
                    sendAccessRequest();
                  }}
                >
                  Request access
                </button>
              </div>
            </div>
          </div>
          <div
            className={
              "w-full h-[100svh] flex flex-col justify-start items-center p-[8px] text-[14px] " +
              (theme
                ? " bg-[#141414] text-[#ffffff]"
                : " bg-[#ffffff] text-[#000000]")
            }
            //   onClick={() => {
            //     console.log(searchParams.get("chat")?.split("?userID="));
            //   }}
          >
            <div
              className={
                "w-full h-full flex flex-col justify-start items-start" +
                (theme ? " bg-[#1A1A1A]" : " bg-[#ffffff]")
              }
            >
              <div
                className={
                  "w-full  h-full flex flex-col justify-end items-center overflow-y-scroll pt-[20px] md:pt-[30px] lg:pt-[30px] pl-[5px]" +
                  (theme ? " chatScrollDark" : " chatScrollLight")
                }
              >
                <div className="w-[calc(100%-35px)] md:w-[calc(100%-35px)] lg:w-[60%] h-full flex flex-col justify-start items-start  ">
                  {sharedChat?.map((data, index) => {
                    return (
                      <>
                        {index == 0 ? (
                          <div className="w-full mb-[40px] flex justify-center items-center">
                            <div
                              className={
                                "w-full border-b-[1.5px]" +
                                (theme
                                  ? " border-[#262626d1]"
                                  : " border-[#f1f1f1d0]")
                              }
                            ></div>
                            <div
                              className={
                                "flex justify-center items-center whitespace-nowrap px-[15px] py-[10px] rounded-lg text-[12px] tracking-wider uppercase" +
                                (theme
                                  ? " bg-[#1A1A1A] text-[#5b5b5b]"
                                  : " bg-[#ffffff] text-[#a8a8b1]")
                              }
                            >
                              Start of Conversation
                            </div>
                            <div
                              className={
                                "w-full border-b-[1.5px]" +
                                (theme
                                  ? " border-[#262626d1]"
                                  : " border-[#f1f1f1d0]")
                              }
                            ></div>
                          </div>
                        ) : (
                          <></>
                        )}
                        {index != 0 &&
                        sharedChat[index - 1].Date !== data?.Date ? (
                          <div className="w-full my-[40px] flex justify-center items-center">
                            <div
                              className={
                                "w-full border-b-[1.5px]" +
                                (theme
                                  ? " border-[#262626d1]"
                                  : " border-[#f1f1f1d0]")
                              }
                            ></div>
                            <div
                              className={
                                "flex justify-center items-center px-[15px] py-[10px] rounded-lg text-[12px] tracking-wider" +
                                (theme
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
                                (theme
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
                                ? theme
                                  ? " bg-[#222222] p-[15px] px-[20px] max-w-[80%] md:max-w-[70%] lg:max-w-[70%]  w-auto"
                                  : " bg-[#f7f7f7] p-[15px] px-[20px] max-w-[80%] md:max-w-[70%] lg:max-w-[70%]  w-auto"
                                : " bg-transparent px-[0px] w-full")
                            }
                          >
                            <div className="flex justify-start items-center">
                              <span
                                className={
                                  "font-[geistSemibold]" +
                                  (theme ? " text-[white]" : " text-[black]")
                                }
                              >
                                {data?.Sender == "User" ? <>Me</> : <>AI</>}{" "}
                              </span>{" "}
                              <span
                                className={
                                  "text-[12px] flex justify-center items-center font-[geistMedium]" +
                                  (theme
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
                                  (sharedChat.length - 1 == index
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
                                  (sharedChat.length - 1 == index
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
                                  (sharedChat.length - 1 == index
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
                    // ref={lastElementRef}
                    className="w-full min-h-[calc(100%-300px)]"
                  ></div>
                </div>
              </div>
            </div>
          </div>
        </>
      ) : (
        <div className="w-full h-[100svh] flex flex-col justify-center items-center text-[18px] font-[geistSemibold] tracking-wide">
          <span className="mb-[10px]">Loading</span>

          <l-line-wobble
            size="150"
            stroke="5"
            bg-opacity="0.1"
            speed="1.75"
            color="black"
          ></l-line-wobble>
        </div>
      )}
    </>
  );
}
