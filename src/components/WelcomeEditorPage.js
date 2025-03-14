import {
  $createParagraphNode,
  $createTextNode,
  $getSelection,
  $insertNodes,
  $isRangeSelection,
  createEditor,
} from "lexical";
import { useCallback, useEffect, useRef, useState } from "react";

import { AutoLinkNode, LinkNode } from "@lexical/link";
import { AutoFocusPlugin } from "@lexical/react/LexicalAutoFocusPlugin";
import { LexicalComposer } from "@lexical/react/LexicalComposer";
import { RichTextPlugin } from "@lexical/react/LexicalRichTextPlugin";
import { ContentEditable } from "@lexical/react/LexicalContentEditable";
import { HistoryPlugin } from "@lexical/react/LexicalHistoryPlugin";
import { ListPlugin } from "@lexical/react/LexicalListPlugin";

import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";

import { HorizontalRuleNode } from "@lexical/react/LexicalHorizontalRuleNode";

import HorizontalRulePlugin from "../plugins/HorizontalRulePlugin";
import { CheckListPlugin } from "@lexical/react/LexicalCheckListPlugin";
import AutoLinkPlugin from "../plugins/AutoLinkPlugin";
import ClickableLinkPlugin from "../plugins/ClickableLinkPlugin";
import { HashtagPlugin } from "@lexical/react/LexicalHashtagPlugin";
import { LexicalErrorBoundary } from "@lexical/react/LexicalErrorBoundary";
import { ListItemNode, ListNode } from "@lexical/list";
import { CodeNode, CodeHighlightNode } from "@lexical/code";
import { HashtagNode } from "@lexical/hashtag";
import { CustomParagraphNode } from "../nodes/CustomParagraphNode";
import SpeechToTextPlugin from "../plugins/SpeechToTextPlugin";

import Toolbars from "./Toolbars";
import { HeadingNode, QuoteNode } from "@lexical/rich-text";
import LoadState from "./LoadState";
import "../style/editor.css";
import TextFormattingFloatingToolbarPlugin from "../plugins/TextFormatFloatingToolbarPlugin";

import { db } from "../firebase";
import { onSnapshot } from "firebase/firestore";

import { ring2 } from "ldrs";
// import ExcalidrawPlugin from "../plugins/ExcalidrawPlugin";
// import { ExcalidrawNode } from "../nodes/ExcalidrawNode";
import { FileText, File, Folder } from "lucide-react";
ring2.register();

function onError(error) {
  console.error(error);
}

export const EDITOR_NAMESPACE = "lexical-editor";
const WelcomeText = `{"root":{"children":[{"children":[{"detail":0,"format":1,"mode":"normal","style":"font-family: rr;font-size: 50px;","text":"Welcome to AI Notes","type":"text","version":1}],"direction":"ltr","format":"center","indent":0,"type":"paragraph","version":1,"textFormat":1,"textStyle":""},{"children":[],"direction":"ltr","format":"center","indent":0,"type":"paragraph","version":1,"textFormat":1,"textStyle":""},{"children":[],"direction":"ltr","format":"center","indent":0,"type":"paragraph","version":1,"textFormat":1,"textStyle":""},{"children":[{"detail":0,"format":0,"mode":"normal","style":"font-family: rr;","text":"👋 ","type":"text","version":1},{"detail":0,"format":1,"mode":"normal","style":"font-family: rr;","text":"Hello, and welcome aboard!","type":"text","version":1},{"detail":0,"format":0,"mode":"normal","style":"font-family: rr;","text":" You've just unlocked the smartest way to take, organize, and master your notes. Let’s get you started!","type":"text","version":1}],"direction":"ltr","format":"","indent":0,"type":"paragraph","version":1,"textFormat":0,"textStyle":""},{"children":[],"direction":null,"format":"","indent":0,"type":"paragraph","version":1,"textFormat":0,"textStyle":""},{"children":[],"direction":null,"format":"","indent":0,"type":"paragraph","version":1,"textFormat":0,"textStyle":""},{"children":[],"direction":null,"format":"","indent":0,"type":"paragraph","version":1,"textFormat":0,"textStyle":""},{"children":[{"type":"horizontalrule","version":1}],"direction":"ltr","format":"","indent":0,"type":"paragraph","version":1,"textFormat":0,"textStyle":""},{"children":[],"direction":null,"format":"","indent":0,"type":"paragraph","version":1,"textFormat":0,"textStyle":""},{"children":[{"detail":0,"format":1,"mode":"normal","style":"font-family: rr;font-size: 30px;","text":"🚀 Why You’ll Love AI Notes","type":"text","version":1}],"direction":"ltr","format":"","indent":0,"type":"heading","version":1,"tag":"h2"},{"children":[],"direction":"ltr","format":"","indent":0,"type":"paragraph","version":1,"textFormat":0,"textStyle":""},{"children":[{"children":[{"detail":0,"format":0,"mode":"normal","style":"font-family: rr;","text":"✍️ ","type":"text","version":1},{"detail":0,"format":1,"mode":"normal","style":"font-family: rr;","text":"Write Effortlessly:","type":"text","version":1},{"detail":0,"format":0,"mode":"normal","style":"font-family: rr;","text":" Say goodbye to cluttered thoughts. Let AI structure your ideas seamlessly.","type":"text","version":1}],"direction":"ltr","format":"","indent":0,"type":"listitem","version":1,"value":1},{"children":[{"detail":0,"format":0,"mode":"normal","style":"font-family: rr;","text":"🔍 ","type":"text","version":1},{"detail":0,"format":1,"mode":"normal","style":"font-family: rr;","text":"Find Anything, Instantly:","type":"text","version":1},{"detail":0,"format":0,"mode":"normal","style":"font-family: rr;","text":" Can't remember where you saved something? AI-powered search has your back!","type":"text","version":1}],"direction":"ltr","format":"","indent":0,"type":"listitem","version":1,"value":2},{"children":[{"detail":0,"format":0,"mode":"normal","style":"font-family: rr;","text":"🤖 ","type":"text","version":1},{"detail":0,"format":1,"mode":"normal","style":"font-family: rr;","text":"Smarter Notes:","type":"text","version":1},{"detail":0,"format":0,"mode":"normal","style":"font-family: rr;","text":" Get summaries, key insights, or even brainstorm ideas with your AI assistant.","type":"text","version":1}],"direction":"ltr","format":"","indent":0,"type":"listitem","version":1,"value":3},{"children":[{"detail":0,"format":0,"mode":"normal","style":"font-family: rr;","text":"🌍 ","type":"text","version":1},{"detail":0,"format":1,"mode":"normal","style":"font-family: rr;","text":"Anywhere, Anytime:","type":"text","version":1},{"detail":0,"format":0,"mode":"normal","style":"font-family: rr;","text":" Your notes are secure, synced, and accessible across all your devices.","type":"text","version":1}],"direction":"ltr","format":"","indent":0,"type":"listitem","version":1,"value":4}],"direction":"ltr","format":"","indent":0,"type":"list","version":1,"listType":"bullet","start":1,"tag":"ul"},{"children":[],"direction":"ltr","format":"","indent":0,"type":"paragraph","version":1,"textFormat":0,"textStyle":""},{"children":[],"direction":"ltr","format":"","indent":0,"type":"paragraph","version":1,"textFormat":0,"textStyle":""},{"children":[],"direction":"ltr","format":"","indent":0,"type":"paragraph","version":1,"textFormat":0,"textStyle":""},{"children":[{"type":"horizontalrule","version":1}],"direction":"ltr","format":"","indent":0,"type":"paragraph","version":1,"textFormat":0,"textStyle":""},{"children":[],"direction":null,"format":"","indent":0,"type":"paragraph","version":1,"textFormat":0,"textStyle":""},{"children":[],"direction":null,"format":"","indent":0,"type":"paragraph","version":1,"textFormat":0,"textStyle":""},{"children":[{"detail":0,"format":1,"mode":"normal","style":"font-family: rr;font-size: 30px;","text":"🛠️ How to Get Started","type":"text","version":1}],"direction":"ltr","format":"","indent":0,"type":"paragraph","version":1,"textFormat":1,"textStyle":""},{"children":[],"direction":"ltr","format":"","indent":0,"type":"paragraph","version":1,"textFormat":1,"textStyle":""},{"children":[{"detail":0,"format":0,"mode":"normal","style":"font-family: rr;","text":"1️⃣ ","type":"text","version":1},{"detail":0,"format":1,"mode":"normal","style":"font-family: rr;","text":"Open a New Tab:","type":"text","version":1},{"detail":0,"format":0,"mode":"normal","style":"font-family: rr;","text":" Click ","type":"text","version":1},{"detail":0,"format":1,"mode":"normal","style":"font-family: rr;","text":"+ New Tab","type":"text","version":1},{"detail":0,"format":0,"mode":"normal","style":"font-family: rr;","text":" to begin your first note.","type":"text","version":1},{"type":"linebreak","version":1},{"detail":0,"format":0,"mode":"normal","style":"font-family: rr;","text":"2️⃣ ","type":"text","version":1},{"detail":0,"format":1,"mode":"normal","style":"font-family: rr;","text":"View Saved Notes:","type":"text","version":1},{"detail":0,"format":0,"mode":"normal","style":"font-family: rr;","text":" Dive into your archive from the ","type":"text","version":1},{"detail":0,"format":1,"mode":"normal","style":"font-family: rr;","text":"Files","type":"text","version":1},{"detail":0,"format":0,"mode":"normal","style":"font-family: rr;","text":" menu.","type":"text","version":1},{"type":"linebreak","version":1},{"detail":0,"format":0,"mode":"normal","style":"font-family: rr;","text":"3️⃣ ","type":"text","version":1},{"detail":0,"format":1,"mode":"normal","style":"font-family: rr;","text":"Ask the AI:","type":"text","version":1},{"detail":0,"format":0,"mode":"normal","style":"font-family: rr;","text":" Have a question? Highlight text or type a command—AI is ready to help!","type":"text","version":1}],"direction":"ltr","format":"","indent":0,"type":"paragraph","version":1,"textFormat":0,"textStyle":""},{"children":[],"direction":null,"format":"","indent":0,"type":"paragraph","version":1,"textFormat":0,"textStyle":""},{"children":[],"direction":null,"format":"","indent":0,"type":"paragraph","version":1,"textFormat":0,"textStyle":""},{"children":[],"direction":null,"format":"","indent":0,"type":"paragraph","version":1,"textFormat":0,"textStyle":""},{"children":[{"type":"horizontalrule","version":1}],"direction":"ltr","format":"","indent":0,"type":"paragraph","version":1,"textFormat":0,"textStyle":""},{"children":[],"direction":null,"format":"","indent":0,"type":"paragraph","version":1,"textFormat":0,"textStyle":""},{"children":[{"detail":0,"format":1,"mode":"normal","style":"font-family: rr;font-size: 30px;","text":"🎯 Pro Tips","type":"text","version":1}],"direction":"ltr","format":"","indent":0,"type":"heading","version":1,"tag":"h2"},{"children":[],"direction":null,"format":"","indent":0,"type":"paragraph","version":1,"textFormat":0,"textStyle":""},{"children":[{"children":[{"detail":0,"format":1,"mode":"normal","style":"font-family: rr;","text":"Double Click to Rename Tabs","type":"text","version":1},{"detail":0,"format":0,"mode":"normal","style":"font-family: rr;","text":": Keep your workspace tidy by naming your tabs.","type":"text","version":1}],"direction":"ltr","format":"","indent":0,"type":"listitem","version":1,"value":1},{"children":[{"detail":0,"format":1,"mode":"normal","style":"font-family: rr;","text":"Drag to Reorder Tabs","type":"text","version":1},{"detail":0,"format":0,"mode":"normal","style":"font-family: rr;","text":": Organize your ideas, your way.","type":"text","version":1}],"direction":"ltr","format":"","indent":0,"type":"listitem","version":1,"value":2},{"children":[{"detail":0,"format":1,"mode":"normal","style":"font-family: rr;","text":"AI Shortcuts:","type":"text","version":1},{"detail":0,"format":0,"mode":"normal","style":"font-family: rr;","text":" Use ","type":"text","version":1},{"detail":0,"format":16,"mode":"normal","style":"font-family: rr;","text":"/summarize","type":"text","version":1},{"detail":0,"format":0,"mode":"normal","style":"font-family: rr;","text":", ","type":"text","version":1},{"detail":0,"format":16,"mode":"normal","style":"font-family: rr;","text":"/highlight","type":"text","version":1},{"detail":0,"format":0,"mode":"normal","style":"font-family: rr;","text":", or ","type":"text","version":1},{"detail":0,"format":16,"mode":"normal","style":"font-family: rr;","text":"/explain","type":"text","version":1},{"detail":0,"format":0,"mode":"normal","style":"font-family: rr;","text":" in your notes to save time and boost productivity.","type":"text","version":1}],"direction":"ltr","format":"","indent":0,"type":"listitem","version":1,"value":3}],"direction":"ltr","format":"","indent":0,"type":"list","version":1,"listType":"bullet","start":1,"tag":"ul"},{"children":[],"direction":"ltr","format":"","indent":0,"type":"paragraph","version":1,"textFormat":0,"textStyle":""},{"children":[],"direction":null,"format":"","indent":0,"type":"paragraph","version":1,"textFormat":0,"textStyle":""},{"children":[],"direction":"ltr","format":"","indent":0,"type":"paragraph","version":1,"textFormat":0,"textStyle":""},{"children":[{"type":"horizontalrule","version":1}],"direction":"ltr","format":"","indent":0,"type":"paragraph","version":1,"textFormat":0,"textStyle":""},{"children":[],"direction":null,"format":"","indent":0,"type":"paragraph","version":1,"textFormat":0,"textStyle":""},{"children":[{"detail":0,"format":1,"mode":"normal","style":"font-family: rr;font-size: 30px;","text":"🌟 Quick Features Rundown","type":"text","version":1}],"direction":"ltr","format":"","indent":0,"type":"heading","version":1,"tag":"h2"},{"children":[],"direction":"ltr","format":"","indent":0,"type":"paragraph","version":1,"textFormat":0,"textStyle":""},{"children":[{"children":[{"detail":0,"format":0,"mode":"normal","style":"font-family: rr;","text":"📂 ","type":"text","version":1},{"detail":0,"format":1,"mode":"normal","style":"font-family: rr;","text":"Multiple Tabs:","type":"text","version":1},{"detail":0,"format":0,"mode":"normal","style":"font-family: rr;","text":" Like browser tabs, but for your notes—switch between files effortlessly.","type":"text","version":1}],"direction":"ltr","format":"","indent":0,"type":"listitem","version":1,"value":1},{"children":[{"detail":0,"format":0,"mode":"normal","style":"font-family: rr;","text":"🧠 ","type":"text","version":1},{"detail":0,"format":1,"mode":"normal","style":"font-family: rr;","text":"AI Summaries:","type":"text","version":1},{"detail":0,"format":0,"mode":"normal","style":"font-family: rr;","text":" Condense long paragraphs into quick, actionable points.","type":"text","version":1}],"direction":"ltr","format":"","indent":0,"type":"listitem","version":1,"value":2},{"children":[{"detail":0,"format":0,"mode":"normal","style":"font-family: rr;","text":"📝 ","type":"text","version":1},{"detail":0,"format":1,"mode":"normal","style":"font-family: rr;","text":"Collaborative Editing:","type":"text","version":1},{"detail":0,"format":0,"mode":"normal","style":"font-family: rr;","text":" Work with your team in real-time.","type":"text","version":1}],"direction":"ltr","format":"","indent":0,"type":"listitem","version":1,"value":3},{"children":[{"detail":0,"format":0,"mode":"normal","style":"font-family: rr;","text":"📤 ","type":"text","version":1},{"detail":0,"format":1,"mode":"normal","style":"font-family: rr;","text":"Export Options:","type":"text","version":1},{"detail":0,"format":0,"mode":"normal","style":"font-family: rr;","text":" Save your notes as PDFs, Word docs, or even share directly via email.","type":"text","version":1}],"direction":"ltr","format":"","indent":0,"type":"listitem","version":1,"value":4}],"direction":"ltr","format":"","indent":0,"type":"list","version":1,"listType":"bullet","start":1,"tag":"ul"},{"children":[],"direction":null,"format":"","indent":0,"type":"paragraph","version":1,"textFormat":0,"textStyle":""},{"children":[],"direction":null,"format":"","indent":0,"type":"paragraph","version":1,"textFormat":0,"textStyle":""},{"children":[],"direction":null,"format":"","indent":0,"type":"paragraph","version":1,"textFormat":0,"textStyle":""},{"children":[{"type":"horizontalrule","version":1}],"direction":"ltr","format":"","indent":0,"type":"paragraph","version":1,"textFormat":0,"textStyle":""},{"children":[],"direction":null,"format":"","indent":0,"type":"paragraph","version":1,"textFormat":0,"textStyle":""},{"children":[{"detail":0,"format":1,"mode":"normal","style":"font-family: rr;font-size: 30px;","text":"🌈 Fun Fact","type":"text","version":1}],"direction":"ltr","format":"","indent":0,"type":"heading","version":1,"tag":"h2"},{"children":[{"detail":0,"format":0,"mode":"normal","style":"font-family: rr;","text":"On average, users save ","type":"text","version":1},{"detail":0,"format":1,"mode":"normal","style":"font-family: rr;","text":"2 hours per week","type":"text","version":1},{"detail":0,"format":0,"mode":"normal","style":"font-family: rr;","text":" with AI Notes. Imagine what you could do with that extra time—maybe start a new hobby or conquer the world? 🌍","type":"text","version":1}],"direction":"ltr","format":"","indent":0,"type":"paragraph","version":1,"textFormat":0,"textStyle":""},{"children":[{"detail":0,"format":0,"mode":"normal","style":"font-family: rr;","text":"💬 ","type":"text","version":1},{"detail":0,"format":1,"mode":"normal","style":"font-family: rr;","text":"Got Questions?","type":"text","version":1},{"detail":0,"format":0,"mode":"normal","style":"font-family: rr;","text":" Our chatbot in the corner is your 24/7 guide.","type":"text","version":1}],"direction":"ltr","format":"","indent":0,"type":"paragraph","version":1,"textFormat":0,"textStyle":""},{"children":[{"detail":0,"format":0,"mode":"normal","style":"font-family: rr;","text":"🎉 Now, go ahead and hit ","type":"text","version":1},{"detail":0,"format":1,"mode":"normal","style":"font-family: rr;","text":"+ New Tab","type":"text","version":1},{"detail":0,"format":0,"mode":"normal","style":"font-family: rr;","text":" to start crafting brilliance!","type":"text","version":1}],"direction":"ltr","format":"","indent":0,"type":"paragraph","version":1,"textFormat":0,"textStyle":""}],"direction":"ltr","format":"","indent":0,"type":"root","version":1}}`;

const SelectionExtractorPlugin = (props) => {
  const [editor] = useLexicalComposerContext();

  useEffect(() => {
    // Register the update listener
    const unregister = editor.registerUpdateListener(({ editorState }) => {
      editorState.read(() => {
        const selection = $getSelection();
        if ($isRangeSelection(selection)) {
          // Get the plain text of the selected range
          const selectedText = selection.getTextContent();

          // Get the JSON structure of the selected range
          const nodes = selection.getNodes();
          const selectedStructure = nodes.map((node) => node.getLatest());

          // console.log("Selected Text:", selectedText);
          props?.setSelectedText(selectedText);
          // console.log("Selected Structure:", selectedStructure);
        }
      });
    });

    // Cleanup the listener on unmount
    return () => unregister();
  }, [editor]);

  return null;
};

function ReplaceSelectedTextButton() {
  const [editor] = useLexicalComposerContext();

  const replaceSelectedText = () => {
    editor.update(() => {
      const selection = $getSelection();
      if ($isRangeSelection(selection)) {
        // Replace the selected text
        console.log("selection Lexical --->");
        // console.log(selection);
        selection.insertText("Hello There");
      }
    });
  };

  return <button onClick={replaceSelectedText}>Replace Selected Text</button>;
}

export default function WelcomeEditorPage(props) {
  const [headingModal, setHeadingModal] = useState(false);
  const [alignModal, setAlignModal] = useState(false);
  const [fontModal, setFontModal] = useState(false);
  const [fontSizeModal, setFontSizeModal] = useState(false);
  const [loading, setLoading] = useState(false);
  // const [editor] = useLexicalComposerContext();
  const editorRef = useRef(null);
  const [editorText, setEditorText] = useState(
    `{"root":{"children":[{"children":[],"direction":null,"format":"","indent":0,"type":"paragraph","version":1,"textFormat":1,"textStyle":"font-size: 50px;font-family: smr;"}],"direction":null,"format":"","indent":0,"type":"root","version":1}}`
  );

  const [isEditMode, setIsEditMode] = useState(false);

  const editor = createEditor();

  const initialConfig = {
    namespace: "MyEditor",
    theme: exampleTheme,
    onError,
    nodes: [
      HeadingNode,
      ListNode,
      AutoLinkNode,
      LinkNode,
      ListItemNode,
      CodeNode,
      CodeHighlightNode,
      QuoteNode,
      HorizontalRuleNode,
      CustomParagraphNode,
      HashtagNode,
      // ExcalidrawNode,
    ],
    editable: false,
  };

  const replaceText = useCallback(
    (popoverContent) => {
      // Accept content as argument
      editor.update(() => {
        const selection = $getSelection();

        if ($isRangeSelection(selection)) {
          const nativeSelection = window.getSelection(); // Get native selection

          if (nativeSelection) {
            const range = nativeSelection.getRangeAt(0);
            range.deleteContents(); // Delete selected contents

            const paragraphNode = $createParagraphNode();
            const newNode = $createTextNode(popoverContent);
            paragraphNode.append(newNode);

            $insertNodes([paragraphNode]);
          }
        } else {
          const paragraphNode = $createParagraphNode();
          const newNode = $createTextNode(popoverContent);
          paragraphNode.append(newNode);
          $insertNodes([paragraphNode]);
        }
      });
    },
    [editor]
  );

  function findSelectedObjects(editorData, selectedRange) {
    let result = [];

    // Recursive function to traverse the tree and find selected text
    function traverse(node, parentIndex = null, childIndex = null) {
      // Check if the node contains text and if it's within the selected range
      if (node.type === "paragraph" && node.children) {
        for (let i = 0; i < node.children.length; i++) {
          const child = node.children[i];
          if (
            child.type === "text" &&
            isTextInRange(child.text, selectedRange)
          ) {
            // If selected text is in this child, push the parent-child objects to result
            result.push({ parentIndex, childIndex: i, childObject: child });
          }
        }
      }

      // If the node has nested children, recurse into them
      if (node.children) {
        for (let i = 0; i < node.children.length; i++) {
          const child = node.children[i];
          traverse(
            child,
            parentIndex === null ? i : parentIndex,
            childIndex === null ? i : childIndex
          );
        }
      }
    }

    // Start the traversal from the root
    traverse(editorData.root);

    return result;
  }

  // Utility function to check if the text is within the selected range
  function isTextInRange(text, selectedRange) {
    // Assuming selectedRange is an object with 'start' and 'end' properties that represent the indices
    const textStart = 0;
    const textEnd = text.length;

    // Check if the selected range overlaps with the text range
    return selectedRange.start <= textEnd && selectedRange.end >= textStart;
  }

  function getSelectionRange() {
    const selection = document.getSelection();
    if (selection && selection.rangeCount > 0) {
      const range = selection.getRangeAt(0);
      const startContainer = range.startContainer;
      const endContainer = range.endContainer;

      // Get the text content before the start and end containers
      const startOffset = calculateAbsoluteOffset(
        startContainer,
        range.startOffset
      );
      const endOffset = calculateAbsoluteOffset(endContainer, range.endOffset);

      return { start: startOffset, end: endOffset };
    }
    return null;
  }

  // Helper function to calculate absolute offset
  function calculateAbsoluteOffset(container, offset) {
    let totalOffset = offset;
    let currentNode = container;

    // Traverse backward through siblings and parents to calculate the total offset
    while (currentNode.previousSibling) {
      currentNode = currentNode.previousSibling;
      totalOffset += currentNode.textContent.length;
    }

    return totalOffset;
  }

  function fetchNoteLexicalStructure() {
    // const user = firebase.auth().currentUser;

    const channelRef = db.collection("user").doc("lv5PcvKwOUUj45R95lwE");

    onSnapshot(channelRef, (snapshot) => {
      setEditorText(snapshot?.data()?.NoteLexicalStructure);
    });
  }

  return (
    <div
      className={
        "w-full h-full   " +
        (props?.theme ? " bg-[#1d2935]" : " bg-[#ffffffb5]")
      }
      onClick={() => {
        if (headingModal) {
          setHeadingModal(false);
        }
        if (alignModal) {
          setAlignModal(false);
        }
        if (fontModal) {
          setFontModal(false);
        }
        if (fontSizeModal) {
          setFontSizeModal(false);
        }
      }}
    >
      {loading ? (
        <div className="w-full h-[100svh] fixed top-0 left-0 z-50 flex justify-center items-center">
          <div className="w-[200px] h-[150px] rounded-lg bg-[#111d2a] flex justify-center items-center">
            <l-ring-2
              size="40"
              stroke="5"
              stroke-length="0.25"
              bg-opacity="0.1"
              speed="0.8"
              color="white"
            ></l-ring-2>
          </div>
        </div>
      ) : (
        <></>
      )}
      <LexicalComposer initialConfig={initialConfig} editor={editor}>
        <LoadState text={WelcomeText} />

        <div
          className={
            "w-full h-[50px] flex justify-between items-center text-[#f4efff] rounded-l-md " +
            (props?.isMinimise ? " px-[27px]" : " px-[27px]")
          }
          style={{ transition: ".3s" }}
          // border-b-[1.5px] border-[#252525]
        >
          <div
            className={
              "text-center overflow-hidden whitespace-nowrap text-ellipsis w-[calc(100%-140px)] text-[14px] flex justify-start items-center " +
              (props?.theme ? " text-[#f4efff]" : " text-[#6e6e7c]")
            }
          >
            <File
              width={16}
              height={16}
              strokeWidth="1.8"
              className="cursor-pointer mr-[5px]"
            />
            Welcome to Obsidian
          </div>
          <div className="flex justify-end items-center w-[140px] ">
            {/* {props?.isEditMode ? (
              <div
                className={
                  `w-[30px] h-[30px] mr-[10px] rounded-md flex justify-center items-center ` +
                  (props?.theme
                    ? " text-[#f4efff] hover:text-[white] hover:bg-[#36424e]"
                    : " text-[#6e6e7c] hover:text-[black] hover:bg-[#e6e6f4]")
                }
                onClick={() => {
                  editor.setEditable(false);
                }}
              >
                <PenLine
                  width={20}
                  height={20}
                  strokeWidth="1.8"
                  className="cursor-pointer"
                />
              </div>
            ) : (
              <div
                className={
                  `w-[30px] h-[30px] mr-[10px] rounded-md flex justify-center items-center ` +
                  (props?.theme
                    ? " text-[#f4efff] hover:text-[white] hover:bg-[#36424e]"
                    : " text-[#6e6e7c] hover:text-[black] hover:bg-[#e6e6f4]")
                }
                onClick={() => {
                  editor.setEditable(true);
                }}
              >
                <BookOpen
                  width={20}
                  height={20}
                  strokeWidth="1.8"
                  className="cursor-pointer"
                />
              </div>
            )} */}

            {/* <EllipsisVertical
              width={20}
              height={20}
              strokeWidth="1.8"
              className={
                "ml-[15px]" +
                (props?.theme
                  ? " text-[#f4efff] hover:text-[white] hover:bg-[#36424e]"
                  : " text-[#6e6e7c] hover:text-[black] hover:bg-[#e6e6f4]")
              }
            /> */}
          </div>
        </div>

        <RichTextPlugin
          contentEditable={
            <ContentEditable
              name="editor-input"
              contentEditable={false}
              // placeholder={<Placeholder />}
              className={
                " focus:outline-none w-full  z-0 py-[60px] overflow-y-scroll  border-none outline-none" +
                (props?.isMinimise ? " px-[150px]" : " px-[70px]") +
                (isEditMode
                  ? " h-[calc(100%-100px)]"
                  : " h-[calc(100%-50px)]") +
                (props?.theme ? " text-[#fffcfce4]" : " text-[#1e1e1ee4]")
              }
              style={{ transition: ".3s", zIndex: "0" }}
            />
          }
          ErrorBoundary={LexicalErrorBoundary}
        />

        {/* <SelectionExtractorPlugin
          setSelectedText={props?.setSelectedText}
          selectedText={props?.selectedText}
        />

        <TextFormattingFloatingToolbarPlugin
          setLoading={setLoading}
          theme={props?.theme}
        />
        <HistoryPlugin />
        <AutoFocusPlugin />
        <ListPlugin />
        <HorizontalRulePlugin />
        <CheckListPlugin />
        <AutoLinkPlugin />
        <ClickableLinkPlugin />
        <HashtagPlugin />
        <SpeechToTextPlugin />
        <ExcalidrawPlugin /> */}
        {/* <TreeViewPlugin /> */}
      </LexicalComposer>
      {/* <div className="text-white"> {editorText}</div> */}
    </div>
  );
}

function Placeholder() {
  return (
    <div className="editor-placeholder ">
      Play around with the speech to text button on the bottom right...{" "}
    </div>
  );
}

const exampleTheme = {
  ltr: "ltr",
  rtl: "rtl",
  paragraph: "",
  hashtag: "hashTagC",
  // horizontalrule: "border-[1px] border-[#ffffff75]",
  // hashtag: "bg-[red]",
  quote: "editorQuote border-l-[1px] border-[#927de6]",
  heading: {
    h1: "text-[60px] font-bold",
    h2: "text-[50px] font-bold",
    h3: "text-[40px] font-bold",
    h4: "text-[30px] font-bold",
    h5: "text-[20px] font-bold",
    h6: "text-[30px] font-bold",
    h8: "text-[15px]",
    h11: "font-[geistRegular]",
    h12: "font-[google]",

    h21: "font-[dr]",
    h22: "font-[drr]",
    h23: "font-[mr]",
    h24: "font-[nr]",
    h25: "font-[or]",
    h26: "font-[pr]",
    h27: "font-[r]",
    h28: "font-[rr]",
    h29: "font-[rsr]",
    h30: "font-[smr]",
    h31: "font-[tr]",
    h32: "font-[ur]",
    h33: "font-[umr]",
    h34: "font-[v]",
    h35: "font-[mo]",
    h36: "font-[iub]",
    // h37: "font-[sbitn]",
    h38: "font-[dt1]",
    // h39: "font-[jspr]",
    h40: "font-[ot]",
    // h41: "font-[wtdr]",
  },
  list: {
    nested: {
      listitem: "editor-nested-listitem",
    },
    ol: " listDeci list-inside ",
    ul: " listD list-inside ",
    listitem: "",
    listitemChecked: "PlaygroundEditorTheme__listItemChecked",
    listitemUnchecked: "PlaygroundEditorTheme__listItemUnchecked",
  },
  // hashtag: "editor-hashtag",
  image: "editor-image",
  link: "cursor-pointer text-blue",
  text: {
    bold: "font-bold",
    code: "bg-[#F0F2F5] px-[5px] rounded-sm",
    italic: "italic",
    strikethrough: "line-through",
    subscript: "editor-textSubscript",
    superscript: "editor-textSuperscript",
    underline: "underline underline-offset-[5px]",
    underlineStrikethrough: "underline underline-offset-[5px] line-through",
    highlight: "bg-[#dcd2ff]",
    // highlight: "border border-[white] rounded-[6px] bg-[#1d2935]",
    ai: "bg-gradient-to-r from-[#4aa6d5] via-[#61e1e4] to-[#4aa6d5] gradDiv",
    cfont: "font-[mono]",
  },
  code: "editorCode",
  codeHighlight: {
    atrule: "editor-tokenAttr",
    attr: "editor-tokenAttr",
    boolean: "editor-tokenProperty",
    builtin: "editor-tokenSelector",
    cdata: "editor-tokenComment",
    char: "editor-tokenSelector",
    class: "editor-tokenFunction",
    "class-name": "editor-tokenFunction",
    comment: "editor-tokenComment",
    constant: "editor-tokenProperty",
    deleted: "editor-tokenProperty",
    doctype: "editor-tokenComment",
    entity: "editor-tokenOperator",
    function: "editor-tokenFunction",
    important: "editor-tokenVariable",
    inserted: "editor-tokenSelector",
    keyword: "editor-tokenAttr",
    namespace: "editor-tokenVariable",
    number: "editor-tokenProperty",
    operator: "editor-tokenOperator",
    prolog: "editor-tokenComment",
    property: "editor-tokenProperty",
    punctuation: "editor-tokenPunctuation",
    regex: "editor-tokenVariable",
    selector: "editor-tokenSelector",
    string: "editor-tokenSelector",
    symbol: "editor-tokenProperty",
    tag: "editor-tokenProperty",
    url: "editor-tokenOperator",
    variable: "editor-tokenVariable",
  },
};
