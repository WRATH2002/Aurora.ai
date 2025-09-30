import {
  $createParagraphNode,
  $createTextNode,
  $getRoot,
  $getSelection,
  $insertNodes,
  $isRangeSelection,
  createEditor,
  TextNode,
} from "lexical";
import { useCallback, useEffect, useRef, useState } from "react";

import { AutoLinkNode, LinkNode } from "@lexical/link";
import { AutoFocusPlugin } from "@lexical/react/LexicalAutoFocusPlugin";
import { LexicalComposer } from "@lexical/react/LexicalComposer";
import { RichTextPlugin } from "@lexical/react/LexicalRichTextPlugin";
import { ContentEditable } from "@lexical/react/LexicalContentEditable";
import { HistoryPlugin } from "@lexical/react/LexicalHistoryPlugin";
import { LinkPlugin } from "@lexical/react/LexicalLinkPlugin";
import { ListPlugin } from "@lexical/react/LexicalListPlugin";

import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";

import { HorizontalRuleNode } from "@lexical/react/LexicalHorizontalRuleNode";

// import { HorizontalRulePlugin } from "@lexical/react/LexicalHorizontalRulePlugin";
import HorizontalRulePlugin from "../plugins/HorizontalRulePlugin";
import { CheckListPlugin } from "@lexical/react/LexicalCheckListPlugin";
import AutoLinkPlugin from "../plugins/AutoLinkPlugin";
import ClickableLinkPlugin from "../plugins/ClickableLinkPlugin";
import TreeViewPlugin from "../plugins/TreeViewPlugin";
import { HashtagPlugin } from "@lexical/react/LexicalHashtagPlugin";
// import { HashtagPlugin } from "../plugins/LexicalHashtagPlugin";
// import KeywordsPlugin from "../plugins/KeywordsPlugin";

// import { isValidUrl } from "./utils/url";
import { LexicalErrorBoundary } from "@lexical/react/LexicalErrorBoundary";
import { ListItemNode, ListNode } from "@lexical/list";
import { CodeNode, CodeHighlightNode } from "@lexical/code";
import { HashtagNode } from "@lexical/hashtag";
import { HashtagNodeClickable } from "../nodes/ClickableHashtagNode";
import { ParagraphNode } from "lexical";
import { CustomParagraphNode } from "../nodes/CustomParagraphNode";
// import { AutoLinkPlugin } from "./plugins/AutoLink";
// import { EditLinkPlugin } from "./plugins/EditLink";
// import { FloatingMenuPlugin } from "./plugins/FloatingMenu";
// import { LocalStoragePlugin } from "./plugins/LocalStorage";
// import { OpenLinkPlugin } from "./plugins/OpenLink";
// import { ActionsPlugin } from "./plugins/Actions";
import SpeechToTextPlugin from "../plugins/SpeechToTextPlugin";

import Toolbars from "./Toolbars";
import { HeadingNode, QuoteNode } from "@lexical/rich-text";
import LoadState from "./LoadState";
import "../style/editor.css";
import {
  BookOpen,
  ChevronLeft,
  ChevronRight,
  EllipsisVertical,
  Hash,
  PenLine,
  Plus,
  SquareCheckBig,
} from "lucide-react";
import { toolTemplate } from "../utils/constant";
import FloatingToolbarPlugin from "../plugins/FloatingToolbarPlugin";
import TextFormattingFloatingToolbarPlugin from "../plugins/TextFormatFloatingToolbarPlugin";

import { db } from "../firebase";
import {
  arrayRemove,
  arrayUnion,
  doc,
  getDoc,
  onSnapshot,
  serverTimestamp,
} from "firebase/firestore";
import firebase from "../firebase";

import { ring2 } from "ldrs";
import { useDebouncedCallback } from "use-debounce";
import DraggableBlockPlugin from "../plugins/DraggableBlockPlugin";
import InlineImagePlugin from "../plugins/InlineImagePlugin";
import { InlineImageNode } from "../nodes/InlineImageNode";
import DragDropPaste from "../plugins/DragDropPaste";
import HoverLinkToolbarPlugin from "../plugins/HoverLinkToolbarPlugin";
// import ExcalidrawPlugin from "../plugins/ExcalidrawPlugin";
// import { ExcalidrawNode } from "../nodes/ExcalidrawNode";
ring2.register();

// Catch any errors that occur during Lexical updates and log them
// or throw them as needed. If you don't throw them, Lexical will
// try to recover gracefully without losing user data.
function onError(error) {
  console.error(error);
}

export const EDITOR_NAMESPACE = "lexical-editor";
const text = `{"root":{"children":[{"children":[{"detail":0,"format":1,"mode":"normal","style":"font-size: 50px;font-family: smr;","text":"2023-02-08 ","type":"text","version":1}],"direction":null,"format":"","indent":0,"type":"paragraph","version":1,"textFormat":1,"textStyle":"font-size: 50px;font-family: smr;"},{"children":[],"direction":null,"format":"","indent":0,"type":"paragraph","version":1,"textFormat":1,"textStyle":""},{"children":[{"detail":0,"format":0,"mode":"normal","style":"font-size: 15px;font-family: smr;","text":"Today has been a busy day as always. I woke up early, had my morning coffee and started working on my current project. It's a new software application for a client, and I'm working on improving the user interface. I'm really excited about this project and I feel like I'm making great progress. Later in the day, I had a meeting with my team to discuss the progress of the project and to assign tasks for the next sprint. I'm lucky to be part of a great team, ","type":"text","version":1}],"direction":"ltr","format":"","indent":0,"type":"paragraph","version":1,"textFormat":0,"textStyle":"font-size: 15px;font-family: smr;"},{"children":[],"direction":"ltr","format":"","indent":0,"type":"paragraph","version":1,"textFormat":0,"textStyle":""},{"children":[{"detail":0,"format":0,"mode":"normal","style":"font-size: 15px;font-family: smr;","text":"And i feel like we work well together to achieve our goals. In the afternoon, I took a break from coding and attended a workshop on the latest technologies in software development. It was a great opportunity to learn and network with my peers in the industry. I also had a chance to ask questions and get advice from some of the experts in the field. D Before I knew it, it was already evening, and I had to wrap up my work for the day. I made sure to review my code and do some testing to ensure everything is working as expected.","type":"text","version":1}],"direction":"ltr","format":"","indent":0,"type":"paragraph","version":1,"textFormat":0,"textStyle":"font-size: 15px;font-family: smr;"},{"children":[],"direction":"ltr","format":"","indent":0,"type":"paragraph","version":1,"textFormat":0,"textStyle":""},{"children":[],"direction":null,"format":"","indent":0,"type":"paragraph","version":1,"textFormat":0,"textStyle":""}],"direction":"ltr","format":"","indent":0,"type":"root","version":1}}`;

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

export default function Editor(props) {
  const [headingModal, setHeadingModal] = useState(false);
  const [alignModal, setAlignModal] = useState(false);
  const [fontModal, setFontModal] = useState(false);
  const [fontSizeModal, setFontSizeModal] = useState(false);

  // const [editor] = useLexicalComposerContext();
  const editorRef = useRef(null);
  const [editorText, setEditorText] = useState(
    `{"root":{"children":[{"children":[],"direction":null,"format":"","indent":0,"type":"paragraph","version":1,"textFormat":1,"textStyle":"font-size: 50px;font-family: smr;"}],"direction":null,"format":"","indent":0,"type":"root","version":1}}`
  );

  const [isEditMode, setIsEditMode] = useState(false);
  const [chnageLoading, setChangeLoading] = useState(false);
  const [editorTheme, setEditorTheme] = useState(getThemeStyles(false));

  const [fetchQueue, setFetchQueue] = useState([]);
  const [floatingAnchorElem, setFloatingAnchorElem] = useState(null);

  const editor = createEditor();

  const initialConfig = {
    namespace: "MyEditor",
    theme: editorTheme,
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
      InlineImageNode,
      // ExcalidrawNode,
    ],
    editable: false,
  };

  const onRef = (_floatingAnchorElem) => {
    if (_floatingAnchorElem !== null) {
      setFloatingAnchorElem(_floatingAnchorElem);
    }
  };

  useEffect(() => {
    const fetchTheme = async () => {
      try {
        const user = firebase.auth().currentUser;
        const docRef = doc(db, "user", user?.uid); // Adjust path as needed
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          const theme = docSnap.data().Theme; // Boolean: true = dark, false = light
          // setIsDark(theme);
          setEditorTheme(getThemeStyles(theme)); // Update theme dynamically
        }
      } catch (error) {
        console.error("Error fetching theme:", error);
      }
    };

    fetchTheme();
  }, []);

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
    const user = firebase.auth().currentUser;

    const channelRef = db.collection("user").doc(user?.uid);

    onSnapshot(channelRef, (snapshot) => {
      setEditorText(snapshot?.data()?.NoteLexicalStructure);
    });
  }

  useEffect(() => {
    if (props?.selected < props?.fileStackedWithInfo?.length) {
      setChangeLoading(false);
    } else {
      setChangeLoading(true);
      console.log("changed");
      console.log(props?.fileStacked);
    }
  }, [props?.fileStacked, props?.selected]);

  useEffect(() => {
    console.log("filestack");
    console.log(props?.fileStacked);
  }, [props?.fileStacked]);

  const addToQueue = (noteId) => {
    setFetchQueue((prevQueue) => [...prevQueue, noteId]); // Append to queue
  };

  useEffect(() => {
    console.log("fetchNoteQueue");
    console.log(props?.fetchNoteQueue);
  }, []);

  return (
    <div
      className={
        "w-full h-full   " + (props?.theme ? " bg-[#1A1A1A]" : " bg-[#ffffff]")
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
      {/* {props?.loading ? (
        <div className="w-full h-[100svh] fixed top-0 left-0 z-50 flex justify-center items-center">
          <div className="w-[200px] h-[150px] rounded-lg bg-[#141414] flex justify-center items-center">
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
      )} */}

      <LexicalComposer initialConfig={initialConfig} editor={editor}>
        <LoadState
          FileName={props?.fileStacked[props?.selected]}
          setChangeLoading={setChangeLoading}
          fileStacked={props?.fileStacked}
          selected={props?.selected}
          setIsEditMode={setIsEditMode}
          isEditMode={isEditMode}
          fileStackedWithInfo={props?.fileStackedWithInfo}
          setFileStackedWithInfo={props?.setFileStackedWithInfo}
          setFetchNoteQueue={props?.setFetchNoteQueue}
          fetchNoteQueue={props?.fetchNoteQueue}
        />

        <Toolbars
          headingModal={headingModal}
          setHeadingModal={setHeadingModal}
          alignModal={alignModal}
          setAlignModal={setAlignModal}
          fontModal={fontModal}
          setFontModal={setFontModal}
          fontSizeModal={fontSizeModal}
          isMinimise={props?.isMinimise}
          setFontSizeModal={setFontSizeModal}
          isEditMode={isEditMode}
          setIsEditMode={setIsEditMode}
          selected={props?.selected}
          fileStackedWithInfo={props?.fileStackedWithInfo}
          setFileStackedWithInfo={props?.setFileStackedWithInfo}
          setSelected={props?.setSelected}
          fileStacked={props?.fileStacked}
          theme={props?.theme}
          FileName={props?.fileStacked[props?.selected]}
          saveLoading={props?.saveLoading}
          setSaveLoading={props?.setSaveLoading}
        />

        {chnageLoading ? (
          <></>
        ) : (
          <>
            <RichTextPlugin
              contentEditable={
                <ContentEditable
                  name="editor-input"
                  placeholder={"<Placeholder />"}
                  spellcheck="false"
                  className={
                    " focus:outline-none w-full  z-0 py-[30px] md:py-[60px] lg:py-[60px] overflow-y-scroll  border-none outline-none leading-[28px] caret-[#919191] " +
                    (props?.isMinimise
                      ? " px-[150px]"
                      : " px-[30px] md:px-[70px] lg:px-[70px]") +
                    (isEditMode
                      ? " h-[calc(100%-100px)]"
                      : " h-[calc(100%-50px)]") +
                    (props?.theme ? " text-[#fffcfce4]" : " text-[#1e1e1ee4]")
                  }
                  style={{ transition: ".3s", zIndex: "0" }}
                  // onClick={() => {
                  //   console.log("editor");
                  //   console.log(editor.editorState);
                  // }}
                />
              }
              ErrorBoundary={LexicalErrorBoundary}
            />

            <SelectionExtractorPlugin
              setSelectedText={props?.setSelectedText}
              selectedText={props?.selectedText}
            />

            <TextFormattingFloatingToolbarPlugin
              setLoading={props?.setLoading}
              theme={props?.theme}
              AiOutput={props?.AiOutput}
              setAiOutput={props?.setAiOutput}
              AiSection={props?.AiSection}
              setAiSection={props?.setAiSection}
            />
            <HistoryPlugin />
            <AutoFocusPlugin />
            <ListPlugin />
            <HorizontalRulePlugin />
            <CheckListPlugin />
            <AutoLinkPlugin />
            {/* <ClickableLinkPlugin /> */}
            <HoverLinkToolbarPlugin />
            <HashtagPlugin />
            <SpeechToTextPlugin />
            <InlineImagePlugin />
            <DragDropPaste />
            {/* {floatingAnchorElem && (
              <DraggableBlockPlugin anchorElem={floatingAnchorElem} />
            )} */}
          </>
        )}

        {/* <ExcalidrawPlugin /> */}
        {/* <TreeViewPlugin /> */}
      </LexicalComposer>

      {/* <div className="text-white"> {editorText}</div> */}
    </div>
  );
}

function Placeholder() {
  return (
    <div className="editor-placeholder font-extrabold ">
      Play around with the speech to text button on the bottom right...{" "}
    </div>
  );
}

const getThemeStyles = (isDark) => ({
  ltr: "ltr",
  rtl: "rtl",
  paragraph: "",
  hashtag: "hashTagC",
  // horizontalrule: "border-[1px] border-[#ffffff75]",
  // hashtag: "bg-[red]",
  quote: "editorQuote border-l-[1px] border-[#927de6]",
  heading: {
    h1: "text-[60px] font-extrabold ",
    h2: "text-[50px] font-extrabold ",
    h3: "text-[40px] font-extrabold ",
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
    h41: "font-[gr]",
    h42: "font-[sr]",
    h43: "font-[cms1]",
    h44: "font-[cms2]",
    h45: "font-[cms3]",
    h46: "font-[mnc]",
    h47: "font-[mn0]",
    h48: "font-[ir]",
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
  image: "rounded-lg",
  link: "cursor-pointer text-blue",
  text: {
    bold: "font-bold",
    code: "bg-[#F035F5] px-[5px] rounded-sm",
    italic: "italic",
    strikethrough: "line-through",
    subscript: "editor-textSubscript",
    superscript: "editor-textSuperscript",
    underline: "underline underline-offset-[5px]",
    underlineStrikethrough: "underline underline-offset-[5px] line-through",
    highlight: isDark ? "highlightDark" : "highlightLight",
    // highlight: "border border-[white] rounded-[6px] bg-[#1A1A1A]",
    ai: "bg-gradient-to-r from-[#4aa6d5] via-[#61e1e4] to-[#4aa6d5] gradDiv",
    cfont: "font-[mono]",
  },
  code: isDark ? " text-[white] editorCode d" : " text-[black] editorCode l",
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
});

// const exampleTheme = {
//   ltr: "ltr",
//   rtl: "rtl",
//   paragraph: "",
//   hashtag: "hashTagC",
//   // horizontalrule: "border-[1px] border-[#ffffff75]",
//   // hashtag: "bg-[red]",
//   quote: "editorQuote border-l-[1px] border-[#927de6]",
//   heading: {
//     h1: "text-[60px] font-bold",
//     h2: "text-[50px] font-bold",
//     h3: "text-[40px] font-bold",
//     h4: "text-[30px] font-bold",
//     h5: "text-[20px] font-bold",
//     h6: "text-[30px] font-bold",
//     h8: "text-[15px]",
//     h11: "font-[geistRegular]",
//     h12: "font-[google]",

//     h21: "font-[dr]",
//     h22: "font-[drr]",
//     h23: "font-[mr]",
//     h24: "font-[nr]",
//     h25: "font-[or]",
//     h26: "font-[pr]",
//     h27: "font-[r]",
//     h28: "font-[rr]",
//     h29: "font-[rsr]",
//     h30: "font-[smr]",
//     h31: "font-[tr]",
//     h32: "font-[ur]",
//     h33: "font-[umr]",
//     h34: "font-[v]",
//     h35: "font-[mo]",
//     h36: "font-[iub]",
//     // h37: "font-[sbitn]",
//     h38: "font-[dt1]",
//     // h39: "font-[jspr]",
//     h40: "font-[ot]",
//     h41: "font-[gr]",
//     h42: "font-[sr]",
//     // h41: "font-[wtdr]",
//   },
//   list: {
//     nested: {
//       listitem: "editor-nested-listitem",
//     },
//     ol: " listDeci list-inside ",
//     ul: " listD list-inside ",
//     listitem: "",
//     listitemChecked: "PlaygroundEditorTheme__listItemChecked",
//     listitemUnchecked: "PlaygroundEditorTheme__listItemUnchecked",
//   },
//   // hashtag: "editor-hashtag",
//   image: "editor-image",
//   link: "cursor-pointer text-blue",
//   text: {
//     bold: "font-bold",
//     code: "bg-[#F0F2F5] px-[5px] rounded-sm",
//     italic: "italic",
//     strikethrough: "line-through",
//     subscript: "editor-textSubscript",
//     superscript: "editor-textSuperscript",
//     underline: "underline underline-offset-[5px]",
//     underlineStrikethrough: "underline underline-offset-[5px] line-through",
//     highlight: "bg-[#dcd2ff]",
//     // highlight: "border border-[white] rounded-[6px] bg-[#1A1A1A]",
//     ai: "bg-gradient-to-r from-[#4aa6d5] via-[#61e1e4] to-[#4aa6d5] gradDiv",
//     cfont: "font-[mono]",
//   },
//   code: "editorCode",
//   codeHighlight: {
//     atrule: "editor-tokenAttr",
//     attr: "editor-tokenAttr",
//     boolean: "editor-tokenProperty",
//     builtin: "editor-tokenSelector",
//     cdata: "editor-tokenComment",
//     char: "editor-tokenSelector",
//     class: "editor-tokenFunction",
//     "class-name": "editor-tokenFunction",
//     comment: "editor-tokenComment",
//     constant: "editor-tokenProperty",
//     deleted: "editor-tokenProperty",
//     doctype: "editor-tokenComment",
//     entity: "editor-tokenOperator",
//     function: "editor-tokenFunction",
//     important: "editor-tokenVariable",
//     inserted: "editor-tokenSelector",
//     keyword: "editor-tokenAttr",
//     namespace: "editor-tokenVariable",
//     number: "editor-tokenProperty",
//     operator: "editor-tokenOperator",
//     prolog: "editor-tokenComment",
//     property: "editor-tokenProperty",
//     punctuation: "editor-tokenPunctuation",
//     regex: "editor-tokenVariable",
//     selector: "editor-tokenSelector",
//     string: "editor-tokenSelector",
//     symbol: "editor-tokenProperty",
//     tag: "editor-tokenProperty",
//     url: "editor-tokenOperator",
//     variable: "editor-tokenVariable",
//   },
// };
