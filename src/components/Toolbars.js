import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
import { $createHeadingNode, $createQuoteNode } from "@lexical/rich-text";
import {
  $setBlocksType,
  $wrapNodes,
  $patchStyleText,
  $getSelectionStyleValueForProperty,
  $isParentElementRTL,
  $selectAll,
  // $wrapLeafNodesInElements,
  // $wrapLeafNodesInElements,
} from "@lexical/selection";
import { registerCodeHighlighting, $createCodeNode } from "@lexical/code";
import { $createLinkNode, TOGGLE_LINK_COMMAND } from "@lexical/link";
import {
  $getSelection,
  $isRangeSelection,
  CAN_REDO_COMMAND,
  CAN_UNDO_COMMAND,
  FORMAT_TEXT_COMMAND,
  UNDO_COMMAND,
  REDO_COMMAND,
  FORMAT_ELEMENT_COMMAND,
  COMMAND_PRIORITY_CRITICAL,
  SELECTION_CHANGE_COMMAND,
  $createParagraphNode,
  INDENT_CONTENT_COMMAND,
  OUTDENT_CONTENT_COMMAND,
  // INSERT_UNORDERED_LIST_COMMAND,
  $isTextNode,
  $getRoot,
  KEY_TAB_COMMAND,
  COMMAND_PRIORITY_LOW,
} from "lexical";
import {
  INSERT_ORDERED_LIST_COMMAND,
  INSERT_UNORDERED_LIST_COMMAND,
  REMOVE_LIST_COMMAND,
  $isListNode,
  ListNode,
  INSERT_CHECK_LIST_COMMAND,
} from "@lexical/list";
import React, { useCallback, useEffect, useRef, useState } from "react";
import {
  mergeRegister,
  $getNearestNodeOfType,
  $getNearestBlockElementAncestorOrThrow,
} from "@lexical/utils";
import { $isDecoratorBlockNode } from "@lexical/react/LexicalDecoratorBlockNode";
import {
  AlignCenter,
  AlignJustify,
  AlignLeft,
  AlignRight,
  Bold,
  Check,
  ChevronDown,
  Circle,
  ClockArrowDown,
  CloudUpload,
  Code,
  Delete,
  File,
  FileCheck,
  FileClock,
  Folder,
  FolderOpen,
  Heading,
  Heading1,
  Heading2,
  Heading3,
  Heading4,
  Heading5,
  Highlighter,
  IndentDecrease,
  IndentIncrease,
  Italic,
  Link,
  Link2,
  List,
  ListChecks,
  ListOrdered,
  Loader,
  Mic,
  MicOff,
  Minus,
  Quote,
  Redo,
  RefreshCcw,
  Square,
  SquareCheck,
  Strikethrough,
  Subscript,
  Superscript,
  Type,
  Underline,
  Undo,
} from "lucide-react";
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
import { useDebouncedCallback } from "use-debounce";
import { fontNames, fontSize } from "../utils/constant";
import { INSERT_HORIZONTAL_RULE_COMMAND } from "@lexical/react/LexicalHorizontalRuleNode";
import { ContentEditable } from "@lexical/react/LexicalContentEditable";
import {
  SPEECH_TO_TEXT_COMMAND,
  SUPPORT_SPEECH_RECOGNITION,
} from "../plugins/SpeechToTextPlugin";

import { db } from "../firebase";
import {
  arrayRemove,
  arrayUnion,
  onSnapshot,
  serverTimestamp,
} from "firebase/firestore";
import firebase from "../firebase";
import { formatDate, getDurationFromPresent } from "../utils/functionsConstant";
import { INSERT_EXCALIDRAW_COMMAND } from "../plugins/ExcalidrawPlugin";
import { VscCircleSmall } from "react-icons/vsc";
import { FaExclamation } from "react-icons/fa";
import {
  Alert02Icon,
  ArrowDown01Icon,
  ArrowRight01Icon,
  Book03Icon,
  BookOpen01Icon,
  BookOpen02Icon,
  CheckmarkCircle02Icon,
  CloudUploadIcon,
  File02Icon,
  FileEditIcon,
  FileEmpty02Icon,
  FileSyncIcon,
  Folder02Icon,
  Heading01FreeIcons,
  Heading01Icon,
  HeadingIcon,
  HighlighterIcon,
  Mic02Icon,
  MoreVerticalIcon,
  QuillWrite01Icon,
  Redo03Icon,
  SolidLine01Icon,
  TextBoldIcon,
  TextIcon,
  TextItalicIcon,
  TextStrikethroughIcon,
  TextUnderlineIcon,
  Undo03Icon,
} from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";

export default function Toolbars(props) {
  const [editor] = useLexicalComposerContext();

  const [isSpeechToText, setIsSpeechToText] = useState(false);

  const [activeEditor, setActiveEditor] = useState(editor);
  const [isBold, setIsBold] = useState(false);
  const [isItalic, setIsItalic] = useState(false);
  const [isUnderine, setIsUnderline] = useState(false);

  const [isStrikethrough, setIsStrikethrough] = useState(false);
  const [isHighlight, setIsHighlight] = useState(false);
  const [isLeft, setIsLeft] = useState(false);
  const [isRight, setIsRight] = useState(false);
  const [isCenter, setIsCenter] = useState(false);
  const [isJustify, setIsJustify] = useState(false);
  const [isCode, setIsCode] = useState(false);
  const [blockType, setBlockType] = useState("");
  const [isSubscript, setIsSubscript] = useState(false);
  const [isSuperscript, setIsSuperscript] = useState(false);
  const [canUndo, setCanUndo] = useState(false);
  const [canRedo, setCanRedo] = useState(false);
  const [isRTL, setIsRTL] = useState(false);
  const [fontFamily, setFontFamily] = useState("Arial");
  const [lastSaveTime, setLastSaveTime] = useState("");
  const [saveDuration, setSaveDuration] = useState("");
  const [loading, setLoading] = useState(false);
  const [tempContent, setTempContent] = useState(``);
  const [syncConfirm, setSyncConfirm] = useState(false);

  const [saveState, setSaveState] = useState(true);

  // ---- useEffect for detecting Ctrl + E
  useEffect(() => {
    const handleKeyDown = (event) => {
      if (
        (event.ctrlKey && event.key === "e") ||
        (event.ctrlKey && event.key === "E")
      ) {
        event.preventDefault(); // Prevent default behavior
        console.log("Ctrl + E detected");
        if (props?.isEditMode) {
          editor.setEditable(false);
          props?.setFileStackedWithInfo((prev) =>
            prev.map((item, i) =>
              i === props?.selected
                ? {
                    Title: item?.Title,
                    Content: item?.Content,
                    LastSaved: item.LastSaved,
                    isReadMode: true,
                  }
                : item
            )
          );
        } else {
          editor.setEditable(true);
          props?.setFileStackedWithInfo((prev) =>
            prev.map((item, i) =>
              i === props?.selected
                ? {
                    Title: item?.Title,
                    Content: item?.Content,
                    LastSaved: item.LastSaved,
                    isReadMode: false,
                  }
                : item
            )
          );
        }
      }
    };

    // Attach event listener
    window.addEventListener("keydown", handleKeyDown);
    // Cleanup function to remove the listener
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [props?.isEditMode]);

  function fetchNoteLastSaved() {
    const user = firebase.auth().currentUser;

    const channelRef = db
      .collection("user")
      .doc(user?.uid)
      .collection("AllNotes")
      .doc("FilewiseContent")
      .collection("FilewiseContent")
      .doc(
        props?.FileName?.includes("~_~")
          ? props?.FileName
          : "~_~" + props?.FileName
      );

    onSnapshot(channelRef, (snapshot) => {
      setLastSaveTime(snapshot?.data()?.LastSaved);
      setTempContent(snapshot?.data()?.Content);
      setSaveDuration(getDurationFromPresent(snapshot?.data()?.LastSaved));
    });
  }

  useState(() => {
    fetchNoteLastSaved();
  }, [props?.fileStacked, props?.selected]);

  const [selectionFontSize, setSelectionFontSize] = useState("");
  const isEditable = editor.isEditable();

  // const [isEditMode, setIsEditMode] = useState(true);

  const $updateToolbar = useCallback(() => {
    const selection = $getSelection();

    if ($isRangeSelection(selection)) {
      const anchorNode = selection.anchor.getNode();
      const element =
        anchorNode.getKey() === "root"
          ? anchorNode
          : anchorNode.getTopLevelElementOrThrow();
      const elementKey = element.getKey();
      const elementDOM = activeEditor.getElementByKey(elementKey);

      // Update text format

      setIsBold(selection.hasFormat("bold"));
      setIsItalic(selection.hasFormat("italic"));
      setIsUnderline(selection.hasFormat("underline"));
      setIsStrikethrough(selection.hasFormat("strikethrough"));
      setIsCode(selection.hasFormat("code"));
      setIsSubscript(selection.hasFormat("subscript"));
      setIsSuperscript(selection.hasFormat("superscript"));
      setIsHighlight(selection.hasFormat("highlight"));
      setIsLeft(selection.hasFormat(""));
      setIsRight(selection.hasFormat("highlight"));
      setIsCenter(selection.hasFormat("center"));
      setIsJustify(selection.hasFormat("highlight"));
      setIsRTL($isParentElementRTL(selection));

      setFontFamily(
        $getSelectionStyleValueForProperty(
          selection,
          "font-family",
          "geistRegular"
        )
      );

      if (!elementDOM) return;
      if ($isListNode(element)) {
        const parentList = $getNearestNodeOfType(anchorNode, ListNode);
        const type = parentList ? parentList?.getTag() : element?.getTag();
        setBlockType(type);
      }
    }
  }, []);

  const handleSave = (element, noteName, position) => {
    // if (element !== props?.fileStackedWithInfo[props?.selected]?.Content) {
    saveNote(element, noteName, position);
    props?.setSaveLoading(true);
    setTimeout(() => {
      props?.setSaveLoading(false);
    }, 500);
    // }
  };

  function saveNote(edState, noteName, position) {
    // props?.setFileStackedWithInfo((prev) =>
    //   prev.map((item, i) =>
    //     i === props?.selected
    //       ? {
    //           Title: item?.Title,
    //           Content: serializedState,
    //           LastSaved: time,
    //           isReadMode: item?.isReadMode,
    //         }
    //       : item
    //   )
    // );

    const user = firebase.auth().currentUser;
    let time = formatDate();
    const docRef = db
      .collection("user")
      .doc(user?.uid)
      .collection("AllNotes")
      .doc("FilewiseContent")
      .collection("FilewiseContent")
      .doc(noteName.includes("~_~") ? noteName : "~_~" + noteName);
    const serializedState = edState; // Convert state to string
    docRef.update({
      Content: serializedState,
      LastSaved: time,
    });

    const updatedArray = props?.fileStackedWithInfo.map((item, i) =>
      item?.Title == noteName
        ? {
            Title: item.Title,
            isReadMode: item.isReadMode, // Keep other properties unchanged
            Content: serializedState,
            LastSaved: time,
          }
        : item
    );

    // Set the updated array instantly
    props?.setFileStackedWithInfo(updatedArray);

    console.log(
      "• Action Function : handleSave()\n• Action Message : Note content saved to firebase"
    );

    console.log("Note Name --> " + noteName);
    console.log("Position --> " + position);
  }

  useEffect(() => {
    mergeRegister(
      editor.registerUpdateListener(
        ({ editorState, dirtyElements, dirtyLeaves }) => {
          editorState.read(() => {
            $updateToolbar();
          });
          // if (dirtyElements.size === 0 && dirtyLeaves.size === 0) {
          //   if (
          //     JSON.stringify(editorState) ==
          //     props?.fileStackedWithInfo[props?.selected]?.Content
          //   ) {
          //     console.log(
          //       "• Action Function : -- None --\n• Action Message : Same note content, already saved in firebase (No action performed)"
          //     );
          //   } else {
          //     // handleSave(JSON.stringify(editorState));
          //     // console.log(JSON.stringify(editorState));
          //   }
          // }
        }
      ),
      editor.registerCommand(
        CAN_UNDO_COMMAND,
        (payload) => {
          setCanUndo(payload);
          return false;
        },
        1
      ),
      editor.registerCommand(
        CAN_REDO_COMMAND,
        (payload) => {
          setCanRedo(payload);
          return false;
        },
        1
      ),
      editor.registerEditableListener((isEditable) => {
        // The editor's mode is passed in!
        console.log(isEditable);
        if (isEditable) {
          props?.setIsEditMode(true);
        } else {
          props?.setIsEditMode(false);
        }
      })
    );
  }, [editor, $updateToolbar]);

  useEffect(() => {
    registerCodeHighlighting(editor);
  }, [editor]);

  const handleHeading = (headingLevel) => {
    editor.update(() => {
      const selection = $getSelection();
      if ($isRangeSelection(selection)) {
        $setBlocksType(selection, () => $createHeadingNode(headingLevel));
      }
    });
  };

  const formatParagraph = () => {
    if (blockType !== "paragraph") {
      editor.update(() => {
        const selection = $getSelection();

        if ($isRangeSelection(selection)) {
          $wrapNodes(selection, () => $createParagraphNode());
        }
      });
    }
  };

  const handleTextColor = () => {
    const color = prompt("Enter a hex color code (e.g., #ff0000):");
    if (color) {
      editor.update(() => {
        const selection = $getSelection();
        if ($isRangeSelection(selection)) {
          selection.formatText("color", color);
        }
      });
    }
  };

  const handleHighlight = () => {
    editor.update(() => {
      const selection = $getSelection();
      if ($isRangeSelection(selection)) {
        selection.formatText("backgroundColor", "yellow");
      }
    });
  };

  const handleCodeSnippet = () => {
    editor.update(() => {
      const selection = $getSelection();
      if ($isRangeSelection(selection)) {
        $wrapNodes(selection, () => $createCodeNode());
      }
    });
  };

  const formatCheckedList = () => {
    // if (blockType !== "ol") {
    editor.dispatchCommand(INSERT_CHECK_LIST_COMMAND, undefined);
    //   // setBlockType("ol");
    // } else {
    //   editor.dispatchCommand(REMOVE_LIST_COMMAND, undefined);
    //   setBlockType("");
    // }
  };

  // ---- Function for inserting link in a text
  const insertLink = () => {
    const url = prompt("Enter the link URL:");
    if (url) {
      editor.dispatchCommand(TOGGLE_LINK_COMMAND, url);
    }
  };

  // ---- Function for ordered list
  const formatOrderedList = () => {
    if (blockType !== "ol") {
      editor.dispatchCommand(INSERT_ORDERED_LIST_COMMAND, undefined);
    } else {
      editor.dispatchCommand(REMOVE_LIST_COMMAND, undefined);
      setBlockType("");
    }
  };

  // ---- Function for unordered list
  const formatUnorderedList = () => {
    if (blockType !== "ul") {
      editor.dispatchCommand(INSERT_UNORDERED_LIST_COMMAND, undefined);
      // setBlockType("ul");
    } else {
      editor.dispatchCommand(REMOVE_LIST_COMMAND, undefined);
      setBlockType("");
    }
  };

  const handleQuote = () => {
    editor.update(() => {
      const selection = $getSelection();
      if ($isRangeSelection(selection)) {
        $wrapNodes(selection, () => {
          const quoteDiv = document.createElement("div");
          quoteDiv.className = "editor-quote"; // Apply the CSS class
          return quoteDiv;
        });
      }
    });
  };

  // ---- Function to change font size
  function handleFontSizeChange(size) {
    editor.update(() => {
      const selection = $getSelection();
      if ($isRangeSelection(selection)) {
        $patchStyleText(selection, {
          "font-size": size,
        });
      }
    });
  }

  // ---- Function to change font family
  function handleFontFamilyChange(fontName) {
    editor.update(() => {
      const selection = $getSelection();
      if ($isRangeSelection(selection)) {
        $patchStyleText(selection, {
          "font-family": fontName,
        });
      }
    });
  }

  const $updateSelectionFontSize = useCallback(() => {
    const selection = $getSelection();
    if (!$isRangeSelection(selection)) {
      return;
    }
    // console.log(selection);
    const fontSize = $getSelectionStyleValueForProperty(
      selection,
      "font-size",
      "15px"
    );
    setSelectionFontSize(fontSize);
  }, [editor]);

  useEffect(() => {
    // Update when selection changes
    return editor.registerCommand(
      SELECTION_CHANGE_COMMAND,
      () => {
        $updateSelectionFontSize();
        return false;
      },
      COMMAND_PRIORITY_CRITICAL
    );
  }, [editor, $updateSelectionFontSize]);

  useEffect(() => {
    // Update when edits are made
    return editor.registerUpdateListener(({ editorState }) => {
      editorState.read(() => $updateSelectionFontSize());
    });
  }, [editor, $updateSelectionFontSize]);

  const clearFormatting = useCallback(() => {
    activeEditor.update(() => {
      const selection = $getSelection();
      if ($isRangeSelection(selection)) {
        $selectAll(selection);
        selection.getNodes().forEach((node) => {
          if ($isTextNode(node)) {
            node.setFormat(0);
            node.setStyle("");
            $getNearestBlockElementAncestorOrThrow(node).setFormat("");
          }
          if ($isDecoratorBlockNode(node)) {
            node.setFormat("");
          }
        });
      }
    });
  }, [activeEditor]);

  function getFontNameByTag(tag) {
    const font = fontNames.find((font) => font.tag === tag);

    return font?.fontName;
  }

  const formatBulletList = () => {
    if (blockType !== "bullet") {
      editor.dispatchCommand(INSERT_UNORDERED_LIST_COMMAND, undefined);
    } else {
      editor.dispatchCommand(REMOVE_LIST_COMMAND, undefined);
    }
  };

  const formatCheckList = () => {
    if (blockType !== "check") {
      editor.dispatchCommand(INSERT_CHECK_LIST_COMMAND, undefined);
    } else {
      editor.dispatchCommand(REMOVE_LIST_COMMAND, undefined);
    }
  };

  const formatNumberedList = () => {
    if (blockType !== "number") {
      editor.dispatchCommand(INSERT_ORDERED_LIST_COMMAND, undefined);
    } else {
      editor.dispatchCommand(REMOVE_LIST_COMMAND, undefined);
    }
  };

  const formatQuote = () => {
    if (blockType !== "quote") {
      editor.update(() => {
        const selection = $getSelection();

        if ($isRangeSelection(selection)) {
          $wrapNodes(selection, () => $createQuoteNode());
        }
      });
    }
  };

  function listenForKeystrokes() {
    document.addEventListener("keydown", (event) => {
      if (props?.isEditMode) {
        if (event.ctrlKey && event.altKey && event.key === "s") {
          // Speech to Text
        }
        if (event.ctrlKey && event.key === "z") {
          // Undo
        }
        if (event.ctrlKey && event.key === "y") {
          // Redo
        }
        if (event.ctrlKey && event.altKey && event.key === "f") {
          // Toggle Font Style
        }
        if (event.ctrlKey && event.altKey && event.key === "+") {
          // Toggle Font Size
        }
        if (event.ctrlKey && event.key === "b") {
          // Toggle Bold
          editor.dispatchCommand(FORMAT_TEXT_COMMAND, "bold");
        }
        if (event.ctrlKey && event.key === "i") {
          // Toggle Italics
          editor.dispatchCommand(FORMAT_TEXT_COMMAND, "italic");
        }
        if (event.ctrlKey && event.key === "u") {
          // Toggle Underline
          editor.dispatchCommand(FORMAT_TEXT_COMMAND, "underline");
        }
        if (event.altKey && event.shiftKey && event.key === "s") {
          // Toggle Strikethrough
          editor.dispatchCommand(FORMAT_TEXT_COMMAND, "strikethrough");
        }
        if (event.ctrlKey && event.altKey && event.key === "h") {
          // Toggle Highlight
          editor.dispatchCommand(FORMAT_TEXT_COMMAND, "highlight");
        }
        if (event.ctrlKey && event.altKey && event.key === "-") {
          // Toggle Horizontal Rule
          activeEditor.dispatchCommand(
            INSERT_HORIZONTAL_RULE_COMMAND,
            undefined
          );
        }
        if (event.ctrlKey && event.altKey && event.key === "q") {
          // Toggle Quote
          editor.dispatchCommand(FORMAT_TEXT_COMMAND, "bold");
        }
        if (event.ctrlKey && event.key === ",") {
          // Toggle Subscript
        }
        if (event.ctrlKey && event.key === ".") {
          // Toggle Superscript
        }
        if (event.ctrlKey && event.shiftKey && event.key === "l") {
          // Toggle Bullet List
        }
        if (event.ctrlKey && event.shiftKey && event.key === "n") {
          // Toggle Number List
        }
        if (event.ctrlKey && event.shiftKey && event.key === "c") {
          // Toggle Checkbox
        }
        if (event.ctrlKey && event.altKey && event.key === "a") {
          // Toggle Text Alignment
        }
        if (event.ctrlKey && event.altKey && event.key === "x") {
          // Clear Format
        }
        if (event.key === "Tab") {
          // Indent Item
        }
        if (event.shiftKey && event.key === "Tab") {
          // Unindent Item
        }
      }
    });
  }

  useEffect(() => {
    // listenForKeystrokes();
  });

  function getSelectedChildNodesAndIndexes(editor) {
    let selectedNodes = [];
    let selectedIndexes = [];

    editor.getEditorState().read(() => {
      const selection = $getSelection();

      if ($isRangeSelection(selection)) {
        const anchor = selection.anchor.getNode();
        const focus = selection.focus.getNode();
        const root = $getRoot();

        const children = root.getChildren(); // Get all direct children of the root
        children.forEach((child, index) => {
          if (
            anchor.isDescendantOf(child) ||
            focus.isDescendantOf(child) ||
            child === anchor ||
            child === focus
          ) {
            selectedNodes.push(child);
            selectedIndexes.push(index);
          }
        });
      }
    });

    return { selectedNodes, selectedIndexes };
  }

  const timeoutRef = useRef(null);

  useEffect(() => {
    if (
      props?.fileStackedWithInfo?.length > 0 &&
      props?.selected < props?.fileStackedWithInfo?.length
    ) {
      timeoutRef.current = setTimeout(() => {
        setSaveDuration(
          getDurationFromPresent(
            props?.fileStackedWithInfo[props?.selected]?.LastSaved
          )
        );
      }, 60000);
      return () => clearTimeout(timeoutRef.current);
    }
  }, [saveDuration]);

  useEffect(() => {
    if (
      props?.fileStackedWithInfo?.length > 0 &&
      props?.selected < props?.fileStackedWithInfo?.length
    ) {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }

      setSaveDuration(
        getDurationFromPresent(
          props?.fileStackedWithInfo[props?.selected]?.LastSaved
        )
      );
    }
  }, [
    props?.FileName,
    props?.selected,
    props?.fileStackedWithInfo[props?.selected]?.LastSave,
  ]);

  useEffect(() => {
    const handleKeyDown = (event) => {
      if (event.ctrlKey && event.key === "s") {
        event.preventDefault(); // Prevent default save behavior

        editor.update(() => {
          const editorState = editor.getEditorState();
          let Content = props?.fileStackedWithInfo[props?.selected]?.Content;
          let noteName = props?.fileStacked[props?.selected];
          // console.log(JSON.stringify(editorState));

          if (JSON.stringify(editorState) == Content) {
            console.log(
              "• Action Function : -- None --\n• Action Message : Same note content, already saved in firebase (No action performed)"
            );
          } else {
            handleSave(JSON.stringify(editorState), noteName, props?.selected);
            // console.log("Called function to save ");
            // console.log(JSON.stringify(editorState));
          }
        });
      }
    };

    // Attach event listener
    window.addEventListener("keydown", handleKeyDown);

    // Cleanup function to remove the listener
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [props?.fileStackedWithInfo]);

  // ---- Auto Save Functionality
  const debouncedAutoSave = useDebouncedCallback(() => {
    editor.update(() => {
      const editorState = editor.getEditorState();
      let Content = props?.fileStackedWithInfo[props?.selected]?.Content;
      let noteName = props?.fileStacked[props?.selected];

      if (JSON.stringify(editorState) !== Content) {
        console.log(
          "• Action Function : -- None --\n• Action Message : Auto-saving note content to firebase"
        );
        handleSave(JSON.stringify(editorState), noteName, props?.selected);
        setSaveState(true); // Update save state to true after auto-save
        // Optionally: show a toast or indicator for auto-save
      }
    });
  }, 2000); // 2 seconds

  // ---- Debounced Auto Save State update
  useEffect(() => {
    // Listen for editor changes and trigger debounced auto-save

    if (props?.fileStackedWithInfo[props?.selected] !== undefined) {
      console.log("mount registerUpdateListener requested !");
      console.log(props?.fileStackedWithInfo[props?.selected]);
      const unregister = editor.registerUpdateListener(() => {
        editor.update(() => {
          const editorState = editor.getEditorState();
          let Content = props?.fileStackedWithInfo[props?.selected]?.Content;

          if (JSON.stringify(editorState) !== Content) {
            if (saveState) setSaveState(false);
          } else {
            if (!saveState) setSaveState(true);
          }
        });

        debouncedAutoSave();
      });
      return () => unregister();
    }
  }, [
    editor,
    debouncedAutoSave,
    props?.fileStackedWithInfo,
    // props?.selected,
    saveState,
  ]);

  useEffect(() => {
    // Listen for editor changes and trigger debounced auto-save
    const unregister = editor.registerUpdateListener(() => {
      debouncedAutoSave();
    });
    return () => unregister();
  }, [editor, debouncedAutoSave, props?.fileStackedWithInfo, props?.selected]);

  const [currentNoteFirebaseData, setCurrentNoteFirebaseData] = useState("");

  function fetchFirebaseNoteData() {
    const user = firebase.auth().currentUser;

    const channelRef = db
      .collection("user")
      .doc(user?.uid)
      .collection("AllNotes")
      .doc("FilewiseContent")
      .collection("FilewiseContent")
      .doc(
        props?.fileStacked[props?.selected]?.includes("~_~")
          ? props?.fileStacked[props?.selected]
          : "~_~" + props?.fileStacked[props?.selected]
      );

    onSnapshot(channelRef, (snapshot) => {
      setCurrentNoteFirebaseData(snapshot?.data()?.Content);
    });
  }

  useEffect(() => {
    if (props?.fileStacked?.length > 0 && props?.selected >= 0) {
      fetchFirebaseNoteData();
    }
  }, [props?.selected, props?.fileStacked]);

  function updateLocalNoteStorage(edState, noteName, position) {
    const serializedState = edState; // Convert state to string
    let time = formatDate();

    const updatedArray = props?.fileStackedWithInfo.map((item, i) =>
      item?.Title == noteName
        ? {
            Title: item.Title,
            isReadMode: item.isReadMode, // Keep other properties unchanged
            Content: serializedState,
            LastSaved: time,
          }
        : item
    );

    // Set the updated array instantly
    props?.setFileStackedWithInfo(updatedArray);

    console.log(
      "• Action Function : handleSave()\n• Action Message : Note content saved to firebase"
    );
  }

  useEffect(() => {
    return editor.registerCommand(
      KEY_TAB_COMMAND,
      (event) => {
        event.preventDefault();
        if (event.shiftKey) {
          editor.dispatchCommand(OUTDENT_CONTENT_COMMAND, undefined);
        } else {
          editor.dispatchCommand(INDENT_CONTENT_COMMAND, undefined);
        }
        return true;
      },
      COMMAND_PRIORITY_LOW
    );
  }, [editor]);

  return (
    <div className="w-full flex flex-col justify-start items-start">
      <div
        className={
          "w-full h-[100svh]  justify-center items-center fixed top-0 left-0 z-50 backdrop-blur-[5px]" +
          (props?.theme ? " bg-[#1414146a]" : " bg-[#ffffff81]") +
          (syncConfirm ? " flex" : " hidden")
        }
      >
        <div
          className={
            "w-[calc(100%-60px)] md:w-[500px] lg:w-[500px] rounded-2xl h-auto p-[30px] pt-[25px] flex flex-col justify-center items-start fixed left-[50%] top-[50%] boxShadowLight2" +
            (props?.theme ? " bg-[#1A1A1A]" : " bg-[white]")
          }
          style={{ transform: "translate(-50%,-50%)" }}
        >
          <span
            className={
              "text-[20px] font-[geistSemibold] mb-[15px] flex justify-start items-center" +
              (props?.theme ? " text-[#ffffff]" : " text-[black]")
            }
          >
            <RefreshCcw
              width={18}
              height={18}
              strokeWidth="2.9"
              // fill="currentColor"
              className="mr-[7px]"
            />{" "}
            Sync Confirmation
          </span>
          <span
            className={
              "" + (props?.theme ? " text-[#9ba6aa]" : " text-[black]")
            }
          >
            If you choose to sync your note, any changes you have made here will
            not be saved. Do you still want to proceed with syncing?
          </span>
          <div className="flex justify-end items-center w-full mt-[20px]">
            <div
              className={
                "flex justify-center items-center px-[7px] py-[3px] rounded-lg border-[1.5px] border-[#f0f0f0] h-[35px] cursor-pointer" +
                (props?.theme
                  ? " bg-[#222222] hover:bg-[#222222] border-[#3d4a56]"
                  : " bg-[#F9F9F9] border-[#f0f0f0]") +
                (props?.theme ? " text-[#ffffff]" : " text-[black]")
              }
              onClick={() => {
                setSyncConfirm(false);
              }}
            >
              Cancel
            </div>
            <div
              className={
                "flex justify-center items-center px-[7px] py-[3px] rounded-lg border-[1.5px] border-[#f0f0f0] h-[35px] cursor-pointer ml-[15px]" +
                (props?.theme
                  ? " bg-[#A2B9D5] hover:bg-[#C2D9F5] border-[#abc1db]"
                  : " bg-[#F9F9F9] border-[#f0f0f0]") +
                (props?.theme ? " text-[#000000]" : " text-[black]")
              }
              onClick={() => {
                let temp = props?.fileStacked[props?.selected];
                updateLocalNoteStorage(
                  currentNoteFirebaseData,
                  temp,
                  props?.selected
                );
                const newState = editor.parseEditorState(
                  JSON?.parse(currentNoteFirebaseData)
                );
                editor.setEditorState(newState);

                console.log(props?.fileStackedWithInfo);
                console.log(currentNoteFirebaseData);
                setSyncConfirm(false);
              }}
            >
              Sync
            </div>
          </div>
        </div>
      </div>
      <div
        className={
          "w-full h-[50px] flex justify-between items-center border-b-[1.5px] border-[#f6f6f6]  text-[#f4efff]  z-10 " +
          (props?.isMinimise
            ? " px-[30px] md:px-[27px] lg:px-[27px]"
            : " px-[30px] md:px-[27px] lg:px-[27px]")
        }
        style={{ transition: ".3s" }}
        // border-b-[1.5px] border-[#252525]
      >
        <div
          className={
            "text-center overflow-hidden whitespace-nowrap text-ellipsis w-[calc(100%-280px)] text-[14px] hidden md:flex lg:flex justify-start items-center " +
            (props?.theme ? " text-[#f4efff]" : " text-[#6e6e7c]")
          }
        >
          {props?.fileStacked[props?.selected]
            ?.split("~_~")
            ?.map((data, index) => {
              return (
                <>
                  {props?.fileStacked[props?.selected].split("~_~")?.length -
                    1 ==
                  index ? (
                    <>
                      <span
                        className={
                          "flex justify-start items-center cursor-default text-[13px]" +
                          (props?.theme ? " text-[#ffffff]" : " text-[#949494]")
                        }
                      >
                        {/* <File
                          width={16}
                          height={16}
                          strokeWidth="1.8"
                          className="mr-[5px]"
                        /> */}
                        {/* File Icon */}
                        <HugeiconsIcon
                          className="mr-[5px] mt-[-1px]"
                          icon={File02Icon}
                          size={14}
                          strokeWidth={2.2}
                        />
                        {/* Empty File Icon */}
                        {/* <HugeiconsIcon
                          className="mr-[5px] mt-[-2px]"
                          icon={FileEmpty02Icon}
                          size={16}
                          strokeWidth={2}
                        /> */}
                        {data}
                      </span>
                    </>
                  ) : (
                    <>
                      <span
                        className={
                          "flex justify-start items-center cursor-default text-[13px]" +
                          (props?.theme ? " text-[#ffffff]" : " text-[#949494]")
                        }
                      >
                        {/* <FolderOpen
                          width={18}
                          height={18}
                          strokeWidth="1.8"
                          className="mr-[5px]"
                        /> */}
                        <HugeiconsIcon
                          className="mr-[5px] mt-[-1px]"
                          icon={Folder02Icon}
                          size={14}
                          strokeWidth={2.2}
                        />
                        {data}
                        <HugeiconsIcon
                          className="mx-[5px]"
                          icon={ArrowRight01Icon}
                          size={12}
                          strokeWidth={2.4}
                        />
                        {/* <ChevronRight
                          width={14}
                          height={14}
                          strokeWidth="2.5"
                          className={
                            "mx-[5px]" +
                            (props?.theme
                              ? " text-[#6e6e7c]"
                              : " text-[#6e6e7c]")
                          }
                        /> */}
                      </span>
                    </>
                  )}
                </>
              );
            })}
        </div>
        {/* <div
          className={
            "flex justify-center items-center px-[7px] py-[3px] rounded-lg  text-[14px]" +
            (currentNoteFirebaseData ===
              props?.fileStackedWithInfo[props?.selected]?.Content &&
            currentNoteFirebaseData?.length !== 0 &&
            currentNoteFirebaseData !== undefined
              ? " bg-[#d7eae2] border-[1.5px] border-[#c8dfd5] text-[black] opacity-100 cursor-default"
              : " bg-[#ce361a42] border-[1.5px] border-[#ff958142] text-[black] opacity-100 cursor-pointer")
          }
          onClick={() => {
            if (
              currentNoteFirebaseData ===
                props?.fileStackedWithInfo[props?.selected]?.Content &&
              currentNoteFirebaseData?.length !== 0 &&
              currentNoteFirebaseData !== undefined
            ) {
            } else {
              setSyncConfirm(true);
            }
          }}
        >
          {currentNoteFirebaseData ===
            props?.fileStackedWithInfo[props?.selected]?.Content &&
          currentNoteFirebaseData?.length !== 0 &&
          currentNoteFirebaseData !== undefined ? (
            <>
              <div className="flex justify-center items-center mr-[5px] w-[16px] ">
                <Circle
                  width={16}
                  height={16}
                  strokeWidth="1.8"
                  fill="currentColor"
                  className=" text-[#1a2417] absolute"
                />
                <Check
                  width={9}
                  height={9}
                  strokeWidth="4.8"
                  // fill="currentColor"
                  className=" text-[#ffffff] absolute"
                />
              </div>
              Synced
            </>
          ) : (
            <>
              <div className="flex justify-center items-center mr-[5px] w-[16px] ">
                <Circle
                  width={16}
                  height={16}
                  strokeWidth="1.8"
                  fill="currentColor"
                  className=" text-[#a90814] absolute"
                />
                <FaExclamation className="text-[white] text-[9px] ] absolute" />
              </div>
              Sync
            </>
          )}
        </div> */}
        {/* <div
          className=""
          onClick={() => {
            // console.log(props?.fileStackedWithInfo[props?.selected]?.Content);
            if (
              JSON.stringify(editor.getEditorState()) ==
              props?.fileStackedWithInfo[props?.selected]?.Content
            ) {
              console.log("true");
            } else {
              console.log("false");
            }
          }}
        >
          click
        </div> */}

        {/* {currentNoteFirebaseData ===
        props?.fileStackedWithInfo[props?.selected]?.Content ? (
          <>YEs</>
        ) : (
          <>No</>
        )} */}
        {/* <div className="w-full h-[100svh] fixed left-0 top-0 z-50 ">
          {currentNoteFirebaseData} ==={" "}
          {props?.fileStackedWithInfo[props?.selected]?.Content}
        </div> */}
        <div className="flex justify-end items-center w-[110px] md:w-[200px] lg:w-[200px]  ">
          {/* <button
            // disabled={!canUndo}

            className={`w-[30px] h-[30px] mr-[10px] rounded-md flex justify-center items-center hover:bg-[#222222] hover:text-[white]`}
            aria-label="Undo"
          >
            no
          </button>*/}
          {/* <div className="flex md:flex lg:flex justify-center items-center">
            {JSON.stringify(editor.getEditorState()) ==
            props?.fileStackedWithInfo[props?.selected]?.Content ? (
              <FileCheck
                width={18}
                height={18}
                strokeWidth={1.8}
                className={
                  "mr-[5px]" +
                  (props?.theme ? " text-[#6e6e7c]" : " text-[#6e6e7c]")
                }
              />
            ) : (
              <FileClock
                width={18}
                height={18}
                strokeWidth={1.8}
                className={
                  "mr-[5px]" +
                  (props?.theme ? " text-[#6e6e7c]" : " text-[#6e6e7c]")
                }
              />
            )}
          </div> */}

          {/* <button
            onClick={() => {
             const newState = editor.parseEditorState(
        JSON?.parse(lastFetchedNote.current.Content)
      );
      editor.setEditorState(newState);
      props?.setIsEditMode(false);
      editor.setEditable(false);
      props?.setChangeLoading(false);
            }}
            className={`w-[30px] h-[30px] mr-[10px] rounded-md flex justify-center items-center hover:bg-[#222222] hover:text-[white]`}
            aria-label="Undo"
          >
            yes
          </button> */}
          {/* <div
            className={
              "hidden md:flex lg:flex justify-start items-center w-auto mr-[10px]  text-[14px] whitespace-nowrap font-[DMSr]" +
              (props?.theme ? " text-[#9ba6aa]" : " text-[#9999aa]")
            }
          >
            {saveDuration?.length == 0 || props?.saveLoading ? (
              <>
                <Loader
                  width={18}
                  height={18}
                  strokeWidth={2.1}
                  className="mr-[5px] rotating "
                />
              </>
            ) : (
              <>
                <CloudUpload
                  width={18}
                  height={18}
                  strokeWidth={2.1}
                  className="mr-[5px]"
                />
                
                {saveDuration?.length == 0 ? <></> : <>{saveDuration}</>}
              </>
            )}
          </div> */}
          {/* <HugeiconsIcon
            className="text-[#50a41c]"
            icon={CloudUploadIcon}
            size={20}
            strokeWidth={2}
          /> */}
          {saveState ? (
            <>
              <HugeiconsIcon
                className="text-[#50a41c]"
                icon={CheckmarkCircle02Icon}
                size={14}
                strokeWidth={2.2}
              />
              <span className="ml-[3px] mr-[10px] font-[ir] text-[13px] text-[#50a41c]">
                saved
              </span>
            </>
          ) : (
            <>
              <HugeiconsIcon
                className="text-[#ee6e2e]"
                icon={Alert02Icon}
                size={14}
                strokeWidth={2.2}
              />
              <span className="ml-[3px] mr-[10px] font-[ir] text-[13px] text-[#ee6e2e]">
                not saved
              </span>
            </>
          )}

          {props?.isEditMode ? (
            <div
              className={
                `w-[30px] h-[30px] mr-[5px] cursor-pointer rounded-md flex justify-center items-center ` +
                (props?.theme
                  ? " text-[#f4efff] hover:text-[white] hover:bg-[#222222]"
                  : " text-[#6e6e7c] hover:text-[black] hover:bg-[#e6e6f4]")
              }
              onClick={() => {
                editor.setEditable(false);
                props?.setFileStackedWithInfo((prev) =>
                  prev.map((item, i) =>
                    i === props?.selected
                      ? {
                          Title: item?.Title,
                          Content: item?.Content,
                          LastSaved: item.LastSaved,
                          isReadMode: true,
                        }
                      : item
                  )
                );
              }}
            >
              {/* <BookOpen
                width={20}
                height={20}
                strokeWidth="1.8"
                className="cursor-pointer"
              />{" "} */}
              <HugeiconsIcon icon={Book03Icon} size={20} strokeWidth={2} />
            </div>
          ) : (
            <div
              className={
                `w-[30px] h-[30px] mr-[5px] cursor-pointer rounded-md flex justify-center items-center ` +
                (props?.theme
                  ? " text-[#f4efff] hover:text-[white] hover:bg-[#222222]"
                  : " text-[#6e6e7c] hover:text-[black] hover:bg-[#e6e6f4]")
              }
              onClick={() => {
                editor.setEditable(true);
                props?.setFileStackedWithInfo((prev) =>
                  prev.map((item, i) =>
                    i === props?.selected
                      ? {
                          Title: item?.Title,
                          Content: item?.Content,
                          LastSaved: item.LastSaved,
                          isReadMode: false,
                        }
                      : item
                  )
                );
              }}
            >
              {/* <PenLine
                width={20}
                height={20}
                strokeWidth="1.8"
                className="cursor-pointer"
              /> */}
              <HugeiconsIcon
                icon={QuillWrite01Icon}
                size={20}
                strokeWidth={2}
              />
            </div>
          )}
          <div
            className={
              `w-[30px] h-[30px] cursor-pointer rounded-md flex justify-center items-center ` +
              (props?.theme
                ? " text-[#f4efff] hover:text-[white] hover:bg-[#222222]"
                : " text-[#6e6e7c] hover:text-[black] hover:bg-[#e6e6f4]")
            }
            onClick={() => {
              // editor.setEditable(true);
            }}
          >
            {/* <EllipsisVertical
              width={20}
              height={20}
              strokeWidth="1.8"
              className={
                "" +
                (props?.theme
                  ? " text-[#f4efff] hover:text-[white] hover:bg-[#222222]"
                  : " text-[#6e6e7c] hover:text-[black] hover:bg-[#e6e6f4]")
              }
            /> */}
            <HugeiconsIcon
              icon={MoreVerticalIcon}
              size={20}
              strokeWidth={3.5}
              className={
                "" +
                (props?.theme
                  ? " text-[#f4efff] hover:text-[white] hover:bg-[#222222]"
                  : " text-[#6e6e7c] hover:text-[black] hover:bg-[#e6e6f4]")
              }
            />
          </div>
        </div>
      </div>
      <div
        className={
          " flex w-full justify-center items-end " +
          (props?.isMinimise
            ? " w-[calc(100%-50px)] left-[50px] px-[19.5px]"
            : " w-[calc(100%-300px)] left-[300px] px-[19.5px]") +
          (props?.isEditMode
            ? " h-[50px] opacity-100 mt-[0px] z-10"
            : " h-[50px] overflow-hidden opacity-0 mt-[-50px] -z-10") +
          (props?.theme
            ? " text-[#f4efff] hover:text-[white]"
            : " text-[#2c2c2c] hover:text-[black]")
        }
        style={{
          // transition: "opacity .2s, margin .3s",
          transition: ".3s",
        }}
      >
        {/* <div className="h-[40px] w-[40px] bg-[black] mr-[0px]">
          <div className="w-full h-full rounded-br-[16px] bg-white"></div>
        </div> */}
        <div className="w-auto min-[100px] bg-[#d9979700] flex justify-start items-center h-[calc(100%-0px)] rounded-t-[16px]  px-[10px]">
          {SUPPORT_SPEECH_RECOGNITION && (
            <button
              onClick={() => {
                editor.dispatchCommand(SPEECH_TO_TEXT_COMMAND, !isSpeechToText);
                setIsSpeechToText(!isSpeechToText);
              }}
              className={
                " px-[10px] h-[30px] mr-[5px] rounded-[10px] flex justify-center items-center " +
                (isSpeechToText
                  ? props?.theme
                    ? " bg-[#222222] w-auto"
                    : " bg-[#e6e6f4] w-auto"
                  : " bg-[#22222200] w-[30px]") +
                (props?.theme ? "  hover:bg-[#222222]" : "  hover:bg-[#e6e6f4]")
              }
              title="Speech To Text"
              aria-label={`${
                isSpeechToText ? "Enable" : "Disable"
              } speech to text`}
            >
              {/* <i className="mic" /> */}
              <div
                className={" " + (isSpeechToText ? " mr-[5px]" : " mr-[0px]")}
                // style={{ transition: ".3s" }}
              >
                {isSpeechToText ? (
                  <Square
                    fill="currentColor"
                    width={18}
                    height={18}
                    strokeWidth="1.8"
                  />
                ) : (
                  // <Mic width={18} height={18} strokeWidth="1.8" />
                  <HugeiconsIcon icon={Mic02Icon} size={16} strokeWidth={1.7} />
                )}
              </div>
              <div
                className={
                  "now playing  h-full items-end pb-[6px]" +
                  (isSpeechToText ? " flex opacity-100" : " hidden opacity-0")
                }
                style={{
                  transition: ".3s",
                  transitionDelay: isSpeechToText ? " .2s" : " 0s",
                }}
                id="music"
              >
                <span className="bar n1 mx-[1.5px] min-w-[2.5px] max-w-[2.5px]"></span>
                <span className="bar n2 mx-[1.5px] min-w-[2.5px] max-w-[2.5px]"></span>
                <span className="bar n3 mx-[1.5px] min-w-[2.5px] max-w-[2.5px]"></span>
              </div>
            </button>
          )}
          {/* <button
          onClick={() => {
            editor.dispatchCommand(INSERT_EXCALIDRAW_COMMAND, undefined);
          }}
          className={"toolbar-item spaced "}
        >
          <span className="text">Insert Excalidraw</span>
        </button> */}
          <div
            className={
              "h-[22px] min-w-[2px] max-w-[2px] rounded-full mr-[5px]" +
              (props?.theme ? " bg-[#252525]" : " bg-[#E5E7EB]")
            }
          ></div>
          <button
            disabled={!canUndo}
            onClick={() => {
              if (props?.isEditMode) {
                editor.dispatchCommand(UNDO_COMMAND, undefined);
              }
            }}
            className={
              `w-[30px] h-[30px] mr-[5px] rounded-md flex justify-center items-center` +
              (props?.theme
                ? " hover:text-[white] hover:bg-[#222222]"
                : " hover:text-[black] hover:bg-[#e6e6f4]")
            }
            aria-label="Undo"
          >
            {/* <Undo width={18} height={18} strokeWidth="1.8" /> */}
            <HugeiconsIcon icon={Undo03Icon} size={16} strokeWidth={1.7} />
          </button>

          <button
            disabled={!canRedo}
            onClick={() => {
              if (props?.isEditMode) {
                editor.dispatchCommand(REDO_COMMAND, undefined);
              }
            }}
            className={
              `w-[30px] h-[30px] mr-[5px] rounded-md flex justify-center items-center cursor-pointer ` +
              (props?.theme
                ? " hover:text-[white] hover:bg-[#222222]"
                : " hover:text-[black] hover:bg-[#e6e6f4]")
            }
            aria-label="Redo"
          >
            {/* <Redo width={18} height={18} strokeWidth="1.8" /> */}
            <HugeiconsIcon icon={Redo03Icon} size={16} strokeWidth={1.7} />
          </button>
          <div
            className={
              "h-[22px] min-w-[2px] max-w-[2px] rounded-full mr-[5px]" +
              (props?.theme ? " bg-[#252525]" : " bg-[#E5E7EB]")
            }
          ></div>
          {/* <div className="h-[20px] border-b-[1.5px] border-[#252525] mx-[5px]"></div> */}

          <div className="min-w-[140px] max-w-[140px] h-[30px] flex flex-col justify-start items-end mr-[5px] ">
            <button
              onClick={() => {
                if (props?.isEditMode) {
                  props?.setFontModal(!props?.fontModal);
                }
              }}
              className={`min-w-[140px] max-w-[140px] px-[10px] pr-[5px] min-h-[30px] rounded-md flex justify-center items-center  ${
                props?.theme
                  ? props?.isEditMode
                    ? props?.fontModal
                      ? " bg-[#222222] text-[#ffffff]"
                      : " hover:bg-[#222222] text-[#f4efff] hover:text-[white] cursor-pointer"
                    : " hover:bg-[#22222200] text-[#f4efff00] cursor-default"
                  : props?.isEditMode
                  ? props?.fontModal
                    ? " bg-[#e6e6f4] text-[#000000]"
                    : " hover:bg-[#e6e6f4] text-[#5d5d5d] hover:text-[black] cursor-pointer"
                  : " hover:bg-[#e6e6f400] text-[#f4efff00] cursor-default"
              }`}
            >
              <div className="flex justify-start items-center w-[25px] h-full">
                {/* <Type width={18} height={18} strokeWidth="1.8" /> */}
                <HugeiconsIcon icon={TextIcon} size={16} strokeWidth={1.7} />
              </div>
              <div className="w-[calc(100%-45px)] text-ellipsis overflow-hidden whitespace-nowrap text-[14px]">
                {getFontNameByTag(fontFamily)}
              </div>
              <div className="flex justify-start items-center w-[20px] h-full">
                {/* <ChevronDown width={18} height={18} strokeWidth="1.8" /> */}
                <HugeiconsIcon
                  icon={ArrowDown01Icon}
                  size={16}
                  strokeWidth={1.7}
                />
              </div>
            </button>

            <div
              className={
                "mt-[5px] min-w-[140px] max-w-[140px] min-h-[300px] p-[5px] flex-col justify-start items-start border-[1.5px] rounded-lg z-[200] boxShadowLight0 overflow-y-scroll" +
                (props?.fontModal ? " flex" : " hidden") +
                (props?.theme
                  ? " border-[#252525] bg-[#232d31]"
                  : " border-[#E5E7EB] bg-[#ffffff]")
              }
              style={{ zIndex: "400" }}
            >
              {fontNames?.map((data, index) => {
                return (
                  <button
                    key={index}
                    onClick={() => {
                      if (props?.isEditMode) {
                        // handleHeading(data?.short);
                        handleFontFamilyChange(data?.tag);
                        props?.setHeadingModal(false);
                      }
                    }}
                    className={
                      `w-full min-h-[25px] px-[10px] outline-none rounded-[4px] flex justify-start items-center cursor-pointer ` +
                      (props?.theme
                        ? getFontNameByTag(fontFamily) == data?.fontName
                          ? " bg-[#222222] text-[white]"
                          : "text-[#f4efff] hover:text-[white] hover:bg-[#222222]"
                        : getFontNameByTag(fontFamily) == data?.fontName
                        ? " bg-[#e6e6f4] text-[black]"
                        : " text-[#5d5d5d] hover:text-[black] hover:bg-[#e6e6f4]")
                    }
                    style={{ fontFamily: `${data?.tag}` }}
                  >
                    <span className="w-full text-ellipsis overflow-hidden whitespace-nowrap text-[14px]">
                      {data?.fontName}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>
          <div
            className={
              "h-[22px] min-w-[2px] max-w-[2px] rounded-full mr-[5px]" +
              (props?.theme ? " bg-[#252525]" : " bg-[#E5E7EB]")
            }
          ></div>

          <div className="min-w-[65px] max-w-[65px] h-[30px] flex flex-col justify-start items-end mr-[5px] ">
            <button
              onClick={() => {
                if (props?.isEditMode) {
                  props?.setFontSizeModal(!props?.fontSizeModal);
                }
              }}
              className={`min-w-[65px] max-w-[65px] pr-[5px]  min-h-[30px] rounded-md flex justify-center items-center  ${
                props?.theme
                  ? props?.isEditMode
                    ? props?.fontSizeModal
                      ? " bg-[#222222] text-[#ffffff]"
                      : " hover:bg-[#222222] text-[#f4efff] hover:text-[white] cursor-pointer"
                    : " hover:bg-[#22222200] text-[#f4efff00] cursor-default"
                  : props?.isEditMode
                  ? props?.fontSizeModal
                    ? " bg-[#e6e6f4] text-[#000000]"
                    : " hover:bg-[#e6e6f4] text-[#5d5d5d] hover:text-[black] cursor-pointer"
                  : " hover:bg-[#e6e6f400] text-[#f4efff00] cursor-default"
              }`}
            >
              <div className="w-[calc(100%-20px)] flex justify-center items-center text-[14px]">
                {selectionFontSize.split("px")[0]}
              </div>
              <div className="flex justify-start items-center w-[20px] h-full">
                {/* <ChevronDown width={18} height={18} strokeWidth="1.8" /> */}
                <HugeiconsIcon
                  icon={ArrowDown01Icon}
                  size={16}
                  strokeWidth={1.7}
                />
              </div>
            </button>

            <div
              className={
                "mt-[5px] min-w-[65px] max-w-[65px] min-h-[300px] p-[5px] flex-col justify-start items-start border-[1.5px]  rounded-lg  z-[100] boxShadowLight0 overflow-y-scroll" +
                (props?.fontSizeModal ? " flex" : " hidden") +
                (props?.theme
                  ? " border-[#252525] bg-[#232d31]"
                  : " border-[#E5E7EB] bg-[#ffffff]")
              }
            >
              {fontSize?.map((data, index) => {
                return (
                  <button
                    key={index}
                    onClick={() => {
                      if (props?.isEditMode) {
                        handleFontSizeChange(data);
                        props?.setHeadingModal(false);
                      }
                    }}
                    className={
                      `w-full min-h-[25px] px-[10px] rounded-[4px] flex justify-start items-center cursor-pointer` +
                      (props?.theme
                        ? selectionFontSize.split("px")[0] ==
                          data.split("px")[0]
                          ? " bg-[#222222] text-[white]"
                          : "text-[#f4efff] hover:text-[white] hover:bg-[#222222]"
                        : selectionFontSize.split("px")[0] ==
                          data.split("px")[0]
                        ? " bg-[#e6e6f4] text-[black]"
                        : " text-[#5d5d5d] hover:text-[black] hover:bg-[#e6e6f4]")
                    }
                    // style={{ fontFamily: `${data?.tag}` }}
                  >
                    <span className="w-full text-ellipsis overflow-hidden whitespace-nowrap text-[14px]">
                      {data.split("px")[0]}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          <div
            className={
              "h-[22px] min-w-[2px] max-w-[2px] rounded-full mr-[5px]" +
              (props?.theme ? " bg-[#252525]" : " bg-[#E5E7EB]")
            }
          ></div>

          <button
            onClick={() => {
              if (props?.isEditMode) {
                editor.dispatchCommand(FORMAT_TEXT_COMMAND, "bold");
              }
            }}
            className={`w-[30px] h-[30px] mr-[5px] rounded-md ${
              isBold
                ? props?.theme
                  ? props?.isEditMode
                    ? " bg-[#222222] text-[#f4efff] cursor-pointer"
                    : " bg-[#22222200] text-[#f4efff00] cursor-default"
                  : props?.isEditMode
                  ? " bg-[#e6e6f4] text-[#000000] cursor-pointer"
                  : " bg-[#e6e6f400] text-[#00000000] cursor-default"
                : props?.theme
                ? " hover:bg-[#222222] text-[#f4efff] hover:text-[white] "
                : " hover:bg-[#e6e6f4] text-[#5d5d5d] hover:text-[black] "
            } flex justify-center items-center`}
          >
            {/* <Bold width={18} height={18} strokeWidth="1.8" /> */}
            <HugeiconsIcon icon={TextBoldIcon} size={18} strokeWidth={2} />
          </button>
          <button
            onClick={() => {
              if (props?.isEditMode) {
                editor.dispatchCommand(FORMAT_TEXT_COMMAND, "italic");
              }
            }}
            className={`w-[30px] h-[30px] mr-[5px] rounded-md ${
              isItalic
                ? props?.theme
                  ? props?.isEditMode
                    ? " bg-[#222222] text-[#f4efff] cursor-pointer"
                    : " bg-[#22222200] text-[#f4efff00] cursor-default"
                  : props?.isEditMode
                  ? " bg-[#e6e6f4] text-[#000000] cursor-pointer"
                  : " bg-[#e6e6f400] text-[#00000000] cursor-default"
                : props?.theme
                ? " hover:bg-[#222222] text-[#f4efff] hover:text-[white] "
                : " hover:bg-[#e6e6f4] text-[#5d5d5d] hover:text-[black] "
            } flex justify-center items-center  ml-[0px]`}
          >
            {/* <Italic width={18} height={18} strokeWidth="1.8" /> */}
            <HugeiconsIcon icon={TextItalicIcon} size={16} strokeWidth={1.7} />
          </button>
          <button
            onClick={() => {
              if (props?.isEditMode) {
                editor.dispatchCommand(FORMAT_TEXT_COMMAND, "underline");
              }
            }}
            className={`w-[30px] h-[30px] mr-[5px] rounded-md ${
              isUnderine
                ? props?.theme
                  ? props?.isEditMode
                    ? " bg-[#222222] text-[#f4efff] cursor-pointer"
                    : " bg-[#22222200] text-[#f4efff00] cursor-default"
                  : props?.isEditMode
                  ? " bg-[#e6e6f4] text-[#000000] cursor-pointer"
                  : " bg-[#e6e6f400] text-[#00000000] cursor-default"
                : props?.theme
                ? " hover:bg-[#222222] text-[#f4efff] hover:text-[white] "
                : " hover:bg-[#e6e6f4] text-[#5d5d5d] hover:text-[black] "
            } flex justify-center items-center`}
          >
            {/* <Underline width={18} height={18} strokeWidth="1.8" /> */}
            <HugeiconsIcon
              icon={TextUnderlineIcon}
              size={16}
              strokeWidth={1.7}
            />
          </button>
          <button
            onClick={() => {
              if (props?.isEditMode) {
                editor.dispatchCommand(FORMAT_TEXT_COMMAND, "strikethrough");
              }
            }}
            className={`w-[30px] h-[30px] mr-[5px] rounded-md ${
              isStrikethrough
                ? props?.theme
                  ? props?.isEditMode
                    ? " bg-[#222222] text-[#f4efff] cursor-pointer"
                    : " bg-[#22222200] text-[#f4efff00] cursor-default"
                  : props?.isEditMode
                  ? " bg-[#e6e6f4] text-[#000000] cursor-pointer"
                  : " bg-[#e6e6f400] text-[#00000000] cursor-default"
                : props?.theme
                ? " hover:bg-[#222222] text-[#f4efff] hover:text-[white] "
                : " hover:bg-[#e6e6f4] text-[#5d5d5d] hover:text-[black] "
            } flex justify-center items-center `}
          >
            {/* <Strikethrough width={18} height={18} strokeWidth="1.8" /> */}
            <HugeiconsIcon
              icon={TextStrikethroughIcon}
              size={16}
              strokeWidth={1.7}
            />
          </button>
          <button
            onClick={() => {
              if (props?.isEditMode) {
                editor.dispatchCommand(FORMAT_TEXT_COMMAND, "highlight");
              }
            }}
            className={`w-[30px] h-[30px] mr-[5px] rounded-md ${
              isHighlight
                ? props?.theme
                  ? props?.isEditMode
                    ? " bg-[#222222] text-[#f4efff] cursor-pointer"
                    : " bg-[#22222200] text-[#f4efff00] cursor-default"
                  : props?.isEditMode
                  ? " bg-[#e6e6f4] text-[#000000] cursor-pointer"
                  : " bg-[#e6e6f400] text-[#00000000] cursor-default"
                : props?.theme
                ? " hover:bg-[#222222] text-[#f4efff] hover:text-[white] "
                : " hover:bg-[#e6e6f4] text-[#5d5d5d] hover:text-[black] "
            } flex justify-center items-center `}
          >
            {/* <Highlighter width={18} height={18} strokeWidth="1.8" /> */}
            <HugeiconsIcon icon={HighlighterIcon} size={16} strokeWidth={1.7} />
          </button>

          <button
            onClick={() => {
              if (props?.isEditMode) {
                activeEditor.dispatchCommand(
                  INSERT_HORIZONTAL_RULE_COMMAND,
                  undefined
                );
              }
            }}
            className={`w-[30px] h-[30px] mr-[5px] rounded-md flex justify-center items-center  ${
              props?.isEditMode
                ? props?.theme
                  ? " hover:bg-[#222222] text-[#f4efff] hover:text-[white] cursor-pointer"
                  : " hover:bg-[#e6e6f4] text-[#5d5d5d] hover:text-[black] cursor-pointer"
                : props?.theme
                ? " text-[#f4efff00] cursor-default "
                : " text-[#5d5d5d00] cursor-default "
            }`}
          >
            {/* <Minus width={18} height={18} strokeWidth="1.8" /> */}
            <HugeiconsIcon icon={SolidLine01Icon} size={16} strokeWidth={1.7} />
          </button>

          <div className="w-[30px] h-[30px] flex flex-col justify-start items-end mr-[5px] ">
            <button
              onClick={() => {
                if (props?.isEditMode) {
                  props?.setHeadingModal(!props?.headingModal);
                }
              }}
              className={`min-w-[30px] min-h-[30px] rounded-md flex justify-center items-center  ${
                props?.theme
                  ? props?.isEditMode
                    ? props?.headingModal
                      ? " bg-[#222222] text-[#ffffff]"
                      : " hover:bg-[#222222] text-[#f4efff] hover:text-[white] cursor-pointer"
                    : " hover:bg-[#22222200] text-[#f4efff00] cursor-default"
                  : props?.isEditMode
                  ? props?.headingModal
                    ? " bg-[#e6e6f4] text-[#000000]"
                    : " hover:bg-[#e6e6f4] text-[#5d5d5d] hover:text-[black] cursor-pointer"
                  : " hover:bg-[#e6e6f400] text-[#f4efff00] cursor-default"
              }`}
            >
              {/* <Heading width={18} height={18} strokeWidth="1.8" /> */}
              <HugeiconsIcon icon={HeadingIcon} size={16} strokeWidth={1.7} />
            </button>
            <div
              className={
                "mt-[5px] min-w-[30px] min-h-[40px] p-[5px] justify-end items-center border-[1.5px]  rounded-lg  boxShadowLight0 relative" +
                (props?.headingModal ? " flex" : " hidden") +
                (props?.theme
                  ? " border-[#252525] bg-[#232d31]"
                  : " border-[#E5E7EB] bg-[#ffffff]")
              }
              style={{ zIndex: "400" }}
            >
              <button
                onClick={() => {
                  if (props?.isEditMode) {
                    // handleHeading("h8");
                    // editor.dispatchCommand(FORMAT_TEXT_COMMAND, "bold");
                    handleFontSizeChange("15px");
                    props?.setHeadingModal(false);
                    if (!isBold) {
                    } else {
                      editor.dispatchCommand(FORMAT_TEXT_COMMAND, "bold");
                    }
                  }
                }}
                className={`w-auto px-[10px] font-[geistSemibold] h-[30px] rounded-md flex justify-center items-center  ${
                  props?.theme
                    ? props?.isEditMode
                      ? " hover:bg-[#222222] text-[#f4efff] hover:text-[white] cursor-pointer"
                      : " hover:bg-[#22222200] text-[#f4efff00] cursor-default"
                    : props?.isEditMode
                    ? " hover:bg-[#e6e6f4] text-[#5d5d5d] hover:text-[#000000] cursor-pointer"
                    : " hover:bg-[#e6e6f400]  hover:text-[#00000000] cursor-default"
                }`}
              >
                {/* <Heading1 width={23} height={23} strokeWidth="1.8" /> */}
                Normal
              </button>
              <div
                className={
                  "h-[20px] border-[1.4px] mx-[5px]" +
                  (props?.theme ? " border-[#252525]" : " border-[#E5E7EB]")
                }
              ></div>
              <button
                onClick={() => {
                  if (props?.isEditMode) {
                    // handleHeading("h1");
                    if (isBold) {
                    } else {
                      editor.dispatchCommand(FORMAT_TEXT_COMMAND, "bold");
                    }

                    handleFontSizeChange("60px");
                    props?.setHeadingModal(false);
                  }
                }}
                className={`w-[30px] h-[30px] rounded-md flex justify-center items-center  ${
                  props?.theme
                    ? props?.isEditMode
                      ? " hover:bg-[#222222] text-[#f4efff] hover:text-[white] cursor-pointer"
                      : " hover:bg-[#22222200] text-[#f4efff00] cursor-default"
                    : props?.isEditMode
                    ? " hover:bg-[#e6e6f4] text-[#5d5d5d] hover:text-[#000000] cursor-pointer"
                    : " hover:bg-[#e6e6f400]  hover:text-[#00000000] cursor-default"
                }`}
              >
                {/* <Heading1 width={23} height={23} strokeWidth="1.8" /> */}
                <HugeiconsIcon
                  icon={Heading01FreeIcons}
                  size={16}
                  strokeWidth={1.7}
                />
              </button>
              <button
                onClick={() => {
                  if (props?.isEditMode) {
                    // handleHeading("h2");
                    if (isBold) {
                    } else {
                      editor.dispatchCommand(FORMAT_TEXT_COMMAND, "bold");
                    }
                    handleFontSizeChange("50px");
                    props?.setHeadingModal(false);
                  }
                }}
                className={`w-[30px] h-[30px] ml-[5px] rounded-md flex justify-center items-center  ${
                  props?.theme
                    ? props?.isEditMode
                      ? " hover:bg-[#222222] text-[#f4efff] hover:text-[white] cursor-pointer"
                      : " hover:bg-[#22222200] text-[#f4efff00] cursor-default"
                    : props?.isEditMode
                    ? " hover:bg-[#e6e6f4] text-[#5d5d5d] hover:text-[#000000] cursor-pointer"
                    : " hover:bg-[#e6e6f400]  hover:text-[#00000000] cursor-default"
                }`}
              >
                <Heading2 width={23} height={23} strokeWidth="1.8" />
              </button>
              <button
                onClick={() => {
                  if (props?.isEditMode) {
                    // handleHeading("h3");
                    if (isBold) {
                    } else {
                      editor.dispatchCommand(FORMAT_TEXT_COMMAND, "bold");
                    }
                    handleFontSizeChange("40px");
                    props?.setHeadingModal(false);
                  }
                }}
                className={`w-[30px] h-[30px] ml-[5px] rounded-md flex justify-center items-center  ${
                  props?.theme
                    ? props?.isEditMode
                      ? " hover:bg-[#222222] text-[#f4efff] hover:text-[white] cursor-pointer"
                      : " hover:bg-[#22222200] text-[#f4efff00] cursor-default"
                    : props?.isEditMode
                    ? " hover:bg-[#e6e6f4] text-[#5d5d5d] hover:text-[#000000] cursor-pointer"
                    : " hover:bg-[#e6e6f400]  hover:text-[#00000000] cursor-default"
                }`}
              >
                <Heading3 width={23} height={23} strokeWidth="1.8" />
              </button>
              <button
                onClick={() => {
                  if (props?.isEditMode) {
                    // handleHeading("h4");
                    if (isBold) {
                    } else {
                      editor.dispatchCommand(FORMAT_TEXT_COMMAND, "bold");
                    }
                    handleFontSizeChange("30px");
                    props?.setHeadingModal(false);
                  }
                }}
                className={`w-[30px] h-[30px] ml-[5px] rounded-md flex justify-center items-center  ${
                  props?.theme
                    ? props?.isEditMode
                      ? " hover:bg-[#222222] text-[#f4efff] hover:text-[white] cursor-pointer"
                      : " hover:bg-[#22222200] text-[#f4efff00] cursor-default"
                    : props?.isEditMode
                    ? " hover:bg-[#e6e6f4] text-[#5d5d5d] hover:text-[#000000] cursor-pointer"
                    : " hover:bg-[#e6e6f400]  hover:text-[#00000000] cursor-default"
                }`}
              >
                <Heading4 width={23} height={23} strokeWidth="1.8" />
              </button>
              <button
                onClick={() => {
                  if (props?.isEditMode) {
                    // handleHeading("h5");
                    if (isBold) {
                    } else {
                      editor.dispatchCommand(FORMAT_TEXT_COMMAND, "bold");
                    }
                    handleFontSizeChange("20px");
                    props?.setHeadingModal(false);
                  }
                }}
                className={`w-[30px] h-[30px] ml-[5px] rounded-md flex justify-center items-center  ${
                  props?.theme
                    ? props?.isEditMode
                      ? " hover:bg-[#222222] text-[#f4efff] hover:text-[white] cursor-pointer"
                      : " hover:bg-[#22222200] text-[#f4efff00] cursor-default"
                    : props?.isEditMode
                    ? " hover:bg-[#e6e6f4] text-[#5d5d5d] hover:text-[#000000] cursor-pointer"
                    : " hover:bg-[#e6e6f400]  hover:text-[#00000000] cursor-default"
                }`}
              >
                <Heading5 width={23} height={23} strokeWidth="1.8" />
              </button>
            </div>
          </div>

          <button
            onClick={() => {
              if (props?.isEditMode) {
                formatQuote();
              }
            }}
            className={`w-[30px] h-[30px] mr-[5px] rounded-md flex justify-center items-center ${
              blockType === "quote"
                ? props?.theme
                  ? props?.isEditMode
                    ? " bg-[#222222] text-[#f4efff] cursor-pointer"
                    : " bg-[#22222200] text-[#f4efff00] cursor-default"
                  : props?.isEditMode
                  ? " bg-[#e6e6f4] text-[#000000] cursor-pointer"
                  : " bg-[#e6e6f400] text-[#00000000] cursor-default"
                : props?.theme
                ? " hover:bg-[#222222] text-[#f4efff] hover:text-[white] "
                : " hover:bg-[#e6e6f4] text-[#5d5d5d] hover:text-[black] "
            }`}
          >
            <Quote width={20} height={20} strokeWidth="1.8" />
          </button>

          <button
            onClick={() => {
              if (props?.isEditMode) {
                editor.dispatchCommand(FORMAT_TEXT_COMMAND, "superscript");
              }
            }}
            className={`w-[30px] h-[30px] mr-[5px] rounded-md ${
              isSuperscript
                ? props?.theme
                  ? props?.isEditMode
                    ? " bg-[#222222] text-[#f4efff] cursor-pointer"
                    : " bg-[#22222200] text-[#f4efff00] cursor-default"
                  : props?.isEditMode
                  ? " bg-[#e6e6f4] text-[#000000] cursor-pointer"
                  : " bg-[#e6e6f400] text-[#00000000] cursor-default"
                : props?.theme
                ? " hover:bg-[#222222] text-[#f4efff] hover:text-[white] "
                : " hover:bg-[#e6e6f4] text-[#5d5d5d] hover:text-[black] "
            } flex justify-center items-center `}
          >
            <Superscript width={20} height={20} strokeWidth="1.8" />
          </button>
          <button
            onClick={() => {
              if (props?.isEditMode) {
                editor.dispatchCommand(FORMAT_TEXT_COMMAND, "subscript");
              }
            }}
            className={`w-[30px] h-[30px] mr-[5px] rounded-md ${
              isSubscript
                ? props?.theme
                  ? props?.isEditMode
                    ? " bg-[#222222] text-[#f4efff] cursor-pointer"
                    : " bg-[#22222200] text-[#f4efff00] cursor-default"
                  : props?.isEditMode
                  ? " bg-[#e6e6f4] text-[#000000] cursor-pointer"
                  : " bg-[#e6e6f400] text-[#00000000] cursor-default"
                : props?.theme
                ? " hover:bg-[#222222] text-[#f4efff] hover:text-[white] "
                : " hover:bg-[#e6e6f4] text-[#5d5d5d] hover:text-[black] "
            } flex justify-center items-center `}
          >
            <Subscript width={20} height={20} strokeWidth="1.8" />
          </button>

          <div
            className={
              "h-[22px] min-w-[2px] max-w-[2px] rounded-full mr-[5px]" +
              (props?.theme ? " bg-[#252525]" : " bg-[#E5E7EB]")
            }
          ></div>

          {/* <button
        onClick={() => {
          editor.dispatchCommand(FORMAT_TEXT_COMMAND, "code");
        }}
        // onClick={handleCodeSnippet}
        className={`w-[30px] h-[30px] mr-[5px] rounded-md ${
          isCode ? "bg-[#222222]" : ""
        } flex justify-center items-center hover:bg-[#222222] hover:text-[white]`}
      >
        <Code width={18} height={18} strokeWidth="1.8" />
      </button> */}
          {/* <button
        onClick={() => {
          editor.dispatchCommand(FORMAT_TEXT_COMMAND, "highlight");
        }}
        className={`w-[30px] h-[30px] mr-[5px] rounded-md ${
          isItalic ? "bg-[#222222]" : ""
        } flex justify-center items-center hover:bg-[#222222] hover:text-[white]`}
      >
        <Link2 width={18} height={18} strokeWidth="1.8" />
      </button> */}
          <button
            onClick={() => {
              if (props?.isEditMode) {
                formatUnorderedList();
              }
            }}
            className={`w-[30px] h-[30px] mr-[5px] rounded-md ${
              blockType === "ul"
                ? props?.theme
                  ? props?.isEditMode
                    ? " bg-[#222222] text-[#f4efff] cursor-pointer"
                    : " bg-[#22222200] text-[#f4efff00] cursor-default"
                  : props?.isEditMode
                  ? " bg-[#e6e6f4] text-[#000000] cursor-pointer"
                  : " bg-[#e6e6f400] text-[#00000000] cursor-default"
                : props?.theme
                ? " hover:bg-[#222222] text-[#f4efff] hover:text-[white] "
                : " hover:bg-[#e6e6f4] text-[#5d5d5d] hover:text-[black] "
            } flex justify-center items-center `}
          >
            <List width={18} height={18} strokeWidth="1.8" />
          </button>
          <button
            onClick={() => {
              if (props?.isEditMode) {
                formatOrderedList();
              }
            }}
            className={`w-[30px] h-[30px] mr-[5px] rounded-md ${
              blockType === "ol"
                ? props?.theme
                  ? props?.isEditMode
                    ? " bg-[#222222] text-[#f4efff] cursor-pointer"
                    : " bg-[#22222200] text-[#f4efff00] cursor-default"
                  : props?.isEditMode
                  ? " bg-[#e6e6f4] text-[#000000] cursor-pointer"
                  : " bg-[#e6e6f400] text-[#00000000] cursor-default"
                : props?.theme
                ? " hover:bg-[#222222] text-[#f4efff] hover:text-[white] "
                : " hover:bg-[#e6e6f4] text-[#5d5d5d] hover:text-[black] "
            } flex justify-center items-center `}
          >
            <ListOrdered width={18} height={18} strokeWidth="1.8" />
          </button>

          <button
            onClick={() => {
              if (props?.isEditMode) {
                formatCheckList();
              }
            }}
            className={`w-[30px] h-[30px] mr-[5px] rounded-md ${
              blockType === "check"
                ? props?.theme
                  ? props?.isEditMode
                    ? " bg-[#222222] text-[#f4efff] cursor-pointer"
                    : " bg-[#22222200] text-[#f4efff00] cursor-default"
                  : props?.isEditMode
                  ? " bg-[#e6e6f4] text-[#000000] cursor-pointer"
                  : " bg-[#e6e6f400] text-[#00000000] cursor-default"
                : props?.theme
                ? " hover:bg-[#222222] text-[#f4efff] hover:text-[white] "
                : " hover:bg-[#e6e6f4] text-[#5d5d5d] hover:text-[black] "
            } flex justify-center items-center  `}
          >
            <ListChecks width={18} height={18} strokeWidth="1.8" />
          </button>

          <button
            onClick={insertLink}
            className={`w-[30px] h-[30px] mr-[5px] rounded-md ${
              isItalic ? "bg-[#222222]" : ""
            } flex justify-center items-center hover:bg-[#222222] hover:text-[white]`}
          >
            <Link width={18} height={18} strokeWidth="1.8" />
          </button>

          {/* <button
        onClick={() => {
          editor.dispatchCommand(INSERT_UNORDERED_LIST_COMMAND, undefined);
        }}
        className={`w-[30px] h-[30px] mr-[5px] rounded-md`}
      >
        ol
      </button> */}
          <div className="w-[30px] h-[30px] flex flex-col justify-start items-end mr-[5px]">
            <button
              onClick={() => {
                if (props?.isEditMode) {
                  props?.setAlignModal(!props?.alignModal);
                }
              }}
              className={`min-w-[30px] min-h-[30px] rounded-md flex justify-center items-center  ${
                props?.theme
                  ? props?.isEditMode
                    ? props?.alignModal
                      ? " bg-[#222222] text-[#ffffff]"
                      : " hover:bg-[#222222] text-[#f4efff] hover:text-[white] cursor-pointer"
                    : " hover:bg-[#22222200] text-[#f4efff00] cursor-default"
                  : props?.isEditMode
                  ? props?.alignModal
                    ? " bg-[#e6e6f4] text-[#000000]"
                    : " hover:bg-[#e6e6f4] text-[#5d5d5d] hover:text-[black] cursor-pointer"
                  : " hover:bg-[#e6e6f400] text-[#f4efff00] cursor-default"
              }`}
            >
              <AlignJustify width={18} height={18} strokeWidth="1.8" />
            </button>
            <div
              className={
                "mt-[5px] min-w-[30px] min-h-[40px] p-[5px] justify-end items-center border-[1.5px]  rounded-lg z-10 boxShadowLight0" +
                (props?.alignModal ? " flex" : " hidden") +
                (props?.theme
                  ? " border-[#252525] bg-[#232d31]"
                  : " border-[#E5E7EB] bg-[#ffffff]")
              }
            >
              <button
                onClick={() => {
                  if (props?.isEditMode) {
                    editor.dispatchCommand(FORMAT_ELEMENT_COMMAND, "left");
                    props?.setAlignModal(false);
                  }
                }}
                className={`w-[30px] h-[30px] mr-[5px] rounded-md flex justify-center items-center ${
                  props?.theme
                    ? props?.isEditMode
                      ? " hover:bg-[#222222] text-[#f4efff] hover:text-[white] cursor-pointer"
                      : " hover:bg-[#22222200] text-[#f4efff00] cursor-default"
                    : props?.isEditMode
                    ? " hover:bg-[#e6e6f4] text-[#5d5d5d] hover:text-[#000000] cursor-pointer"
                    : " hover:bg-[#e6e6f400]  hover:text-[#00000000] cursor-default"
                } `}
              >
                <AlignLeft width={18} height={18} strokeWidth="1.8" />
              </button>
              <button
                onClick={() => {
                  if (props?.isEditMode) {
                    editor.dispatchCommand(FORMAT_ELEMENT_COMMAND, "center");
                    props?.setAlignModal(false);
                  }
                }}
                className={`w-[30px] h-[30px] mr-[5px] rounded-md flex justify-center items-center ${
                  props?.theme
                    ? props?.isEditMode
                      ? " hover:bg-[#222222] text-[#f4efff] hover:text-[white] cursor-pointer"
                      : " hover:bg-[#22222200] text-[#f4efff00] cursor-default"
                    : props?.isEditMode
                    ? " hover:bg-[#e6e6f4] text-[#5d5d5d] hover:text-[#000000] cursor-pointer"
                    : " hover:bg-[#e6e6f400]  hover:text-[#00000000] cursor-default"
                } `}
              >
                <AlignCenter width={18} height={18} strokeWidth="1.8" />
              </button>
              <button
                onClick={() => {
                  if (props?.isEditMode) {
                    editor.dispatchCommand(FORMAT_ELEMENT_COMMAND, "right");
                    props?.setAlignModal(false);
                  }
                }}
                className={`w-[30px] h-[30px] mr-[5px] rounded-md flex justify-center items-center ${
                  props?.theme
                    ? props?.isEditMode
                      ? " hover:bg-[#222222] text-[#f4efff] hover:text-[white] cursor-pointer"
                      : " hover:bg-[#22222200] text-[#f4efff00] cursor-default"
                    : props?.isEditMode
                    ? " hover:bg-[#e6e6f4] text-[#5d5d5d] hover:text-[#000000] cursor-pointer"
                    : " hover:bg-[#e6e6f400]  hover:text-[#00000000] cursor-default"
                } `}
              >
                <AlignRight width={18} height={18} strokeWidth="1.8" />
              </button>
              <button
                onClick={() => {
                  if (props?.isEditMode) {
                    editor.dispatchCommand(FORMAT_ELEMENT_COMMAND, "justify");
                    props?.setAlignModal(false);
                  }
                }}
                className={`w-[30px] h-[30px] mr-[5px] rounded-md flex justify-center items-center ${
                  props?.theme
                    ? props?.isEditMode
                      ? " hover:bg-[#222222] text-[#f4efff] hover:text-[white] cursor-pointer"
                      : " hover:bg-[#22222200] text-[#f4efff00] cursor-default"
                    : props?.isEditMode
                    ? " hover:bg-[#e6e6f4] text-[#5d5d5d] hover:text-[#000000] cursor-pointer"
                    : " hover:bg-[#e6e6f400]  hover:text-[#00000000] cursor-default"
                }`}
              >
                <AlignJustify width={18} height={18} strokeWidth="1.8" />
              </button>
              <button
                onClick={() => {
                  if (props?.isEditMode) {
                    activeEditor.dispatchCommand(
                      OUTDENT_CONTENT_COMMAND,
                      undefined
                    );
                  }
                }}
                className={`w-[30px] h-[30px] mr-[5px] rounded-md ${
                  props?.theme
                    ? props?.isEditMode
                      ? " hover:bg-[#222222] text-[#f4efff] hover:text-[white] cursor-pointer"
                      : " hover:bg-[#22222200] text-[#f4efff00] cursor-default"
                    : props?.isEditMode
                    ? " hover:bg-[#e6e6f4] text-[#5d5d5d] hover:text-[#000000] cursor-pointer"
                    : " hover:bg-[#e6e6f400]  hover:text-[#00000000] cursor-default"
                } flex justify-center items-center `}
              >
                <IndentDecrease width={18} height={18} strokeWidth="1.8" />
              </button>
              <button
                onClick={() => {
                  if (props?.isEditMode) {
                    activeEditor.dispatchCommand(
                      INDENT_CONTENT_COMMAND,
                      undefined
                    );
                  }
                }}
                className={`w-[30px] h-[30px] mr-[0px] rounded-md ${
                  props?.theme
                    ? props?.isEditMode
                      ? " hover:bg-[#222222] text-[#f4efff] hover:text-[white] cursor-pointer"
                      : " hover:bg-[#22222200] text-[#f4efff00] cursor-default"
                    : props?.isEditMode
                    ? " hover:bg-[#e6e6f4] text-[#5d5d5d] hover:text-[#000000] cursor-pointer"
                    : " hover:bg-[#e6e6f400]  hover:text-[#00000000] cursor-default"
                } flex justify-center items-center `}
              >
                <IndentIncrease width={18} height={18} strokeWidth="1.8" />
              </button>
            </div>
          </div>
          <div
            className={
              "h-[22px] min-w-[2px] max-w-[2px] rounded-full mr-[5px]" +
              (props?.theme ? " bg-[#252525]" : " bg-[#E5E7EB]")
            }
          ></div>

          <button
            onClick={() => {
              if (props?.isEditMode) {
                clearFormatting();
              }
            }}
            className={
              `w-[30px] h-[30px] mr-[5px] rounded-md flex justify-center items-center  cursor-pointer ` +
              (props?.theme
                ? " text-[#f4efff] hover:text-[white] hover:bg-[#222222]"
                : " text-[#5d5d5d] hover:text-[black] hover:bg-[#e6e6f4]")
            }
          >
            <Delete width={18} height={18} strokeWidth="1.8" />
          </button>
        </div>
        {/* <div className="h-[40px] w-[40px] bg-[black] mr-[0px]">
          <div className="w-full h-full rounded-bl-[16px] bg-white"></div>
        </div> */}
      </div>
      <div className="w-full h-[0px] flex justify-start items-start  ">
        <div
          className={
            "w-full min-h-[60px] bg-gradient-to-b  from-[10%] to-transparent fixed z-[50] " +
            (props?.theme ? " from-[#1A1A1A]" : " from-[#ffffff]")
          }
          style={{ zIndex: "100" }}
        ></div>
      </div>
    </div>
  );
}
