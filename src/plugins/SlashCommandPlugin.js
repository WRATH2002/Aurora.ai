import { useEffect, useState, useCallback, useRef } from "react";
import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
import {
  $getSelection,
  $isRangeSelection,
  TextNode,
  COMMAND_PRIORITY_LOW,
  KEY_ARROW_DOWN_COMMAND,
  KEY_ARROW_UP_COMMAND,
  KEY_ENTER_COMMAND,
  KEY_ESCAPE_COMMAND,
} from "lexical";
import { HugeiconsIcon } from "@hugeicons/react";
import {
  CheckListIcon,
  Heading01Icon,
  Heading02Icon,
  Heading03Icon,
  LeftToRightListBulletIcon,
  LeftToRightListNumberIcon,
  TextBoldIcon,
  TextItalicIcon,
  TextStrikethroughIcon,
  TextUnderlineIcon,
} from "@hugeicons/core-free-icons";

// Menu items
const sectionGroupedItems = [
  {
    groupName: "Formatting",
    items: [
      { label: "Bold", shortcut: [] },
      { label: "Italic", shortcut: [] },
      { label: "Underline", shortcut: [] },
      { label: "Strikethrough", shortcut: [] },
    ],
  },
  {
    groupName: "Headings",
    items: [
      { label: "Heading 1", shortcut: ["#"] },
      { label: "Heading 2", shortcut: ["##"] },
      { label: "Heading 3", shortcut: ["###"] },
    ],
  },
  {
    groupName: "Lists",
    items: [
      { label: "Bulleted List", shortcut: ["-"] },
      { label: "Numbered List", shortcut: ["1."] },
      { label: "To-do List", shortcut: ["[]"] },
    ],
  },
];

// Flattened list and mapping for arrow navigation
const sectionItems = sectionGroupedItems.flatMap((g) => g.items);
const sectionItemsMappingToIndex = {};
sectionItems.forEach(
  (item, idx) => (sectionItemsMappingToIndex[item.label] = idx)
);

export function SlashCommandPlugin({ menuItems = sectionItems }) {
  const [editor] = useLexicalComposerContext();
  const [showMenu, setShowMenu] = useState(false);
  const [menuPosition, setMenuPosition] = useState({ top: 0, left: 0 });
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [slashNode, setSlashNode] = useState(null);
  const [activeSectionIndex, setActiveSectionIndex] = useState(0);
  const menuRef = useRef(null);

  // Check if slash command should trigger
  const checkForSlashCommand = useCallback(() => {
    if (!editor) return null;

    return editor.getEditorState().read(() => {
      const selection = $getSelection();
      if (!$isRangeSelection(selection) || !selection.isCollapsed())
        return null;

      const anchor = selection.anchor;
      const node = anchor.getNode();

      if (!(node instanceof TextNode)) return null;

      const text = node.getTextContent();
      const offset = anchor.offset;

      if (offset === 0) return null;
      if (text[offset - 1] !== "/") return null;

      const charBeforeSlash = offset >= 2 ? text[offset - 2] : " ";
      if (charBeforeSlash !== " " && charBeforeSlash !== "\n") return null;

      return { node, offset };
    });
  }, [editor]);

  // Show menu when slash detected
  useEffect(() => {
    if (!editor) return;

    const unregister = editor.registerUpdateListener(() => {
      try {
        const result = checkForSlashCommand();
        if (result) {
          const { node } = result;
          setSlashNode(node);

          // Calculate menu position
          const domSelection = window.getSelection();
          if (domSelection && domSelection.rangeCount > 0) {
            const range = domSelection.getRangeAt(0).cloneRange();
            range.setStart(range.endContainer, range.endOffset - 1);
            const rect = range.getBoundingClientRect();

            const viewportWidth = window.innerWidth;
            const viewportHeight = window.innerHeight;
            let left = rect.left + window.scrollX;
            let top = rect.bottom + window.scrollY + 4;

            const menuWidth = menuRef.current?.offsetWidth || 250;
            if (left + menuWidth > viewportWidth - 10) {
              left = viewportWidth - menuWidth - 10;
            }

            const menuHeight = menuRef.current?.offsetHeight || 260;
            if (rect.bottom + menuHeight > viewportHeight) {
              top = rect.top + window.scrollY - menuHeight - 4;
            }

            setMenuPosition({ top, left });
            setShowMenu(true);
            setSelectedIndex(0);
            setActiveSectionIndex(0);
            return;
          }
        }
        setShowMenu(false);
        setSlashNode(null);
      } catch (err) {
        console.error("Slash command error:", err);
      }
    });

    return () => {
      unregister();
    };
  }, [editor, checkForSlashCommand]);

  // Remove slash and execute selected action
  const removeSlashAndExecute = useCallback(
    (item) => {
      editor.update(() => {
        if (slashNode) {
          const text = slashNode.getTextContent();
          slashNode.setTextContent(text.slice(0, -1));
        }
      });
      setShowMenu(false);
      item.onSelect?.();
    },
    [editor, slashNode]
  );

  // Keyboard navigation
  useEffect(() => {
    if (!showMenu) return;

    const handleArrowDown = editor.registerCommand(
      KEY_ARROW_DOWN_COMMAND,
      () => {
        setActiveSectionIndex((prev) => (prev + 1) % menuItems.length);
        return true;
      },
      COMMAND_PRIORITY_LOW
    );

    const handleArrowUp = editor.registerCommand(
      KEY_ARROW_UP_COMMAND,
      () => {
        setActiveSectionIndex((prev) =>
          prev - 1 < 0 ? menuItems.length - 1 : prev - 1
        );
        return true;
      },
      COMMAND_PRIORITY_LOW
    );

    const handleEnter = editor.registerCommand(
      KEY_ENTER_COMMAND,
      () => {
        if (menuItems[activeSectionIndex]) {
          removeSlashAndExecute(menuItems[activeSectionIndex]);
          return true;
        }
        return false;
      },
      COMMAND_PRIORITY_LOW
    );

    const handleEscape = editor.registerCommand(
      KEY_ESCAPE_COMMAND,
      () => {
        setShowMenu(false);
        return true;
      },
      COMMAND_PRIORITY_LOW
    );

    return () => {
      handleArrowDown();
      handleArrowUp();
      handleEnter();
      handleEscape();
    };
  }, [editor, showMenu, menuItems, activeSectionIndex, removeSlashAndExecute]);

  if (!showMenu) return null;

  return (
    <div
      ref={menuRef}
      className="absolute font-[r] text-[13px] text-[#454545] bg-white rounded-[10px] border border-[#d2d2d2] min-w-[200px] h-[250px] px-[5px] pr-[2px] overflow-hidden shadow-lg z-[200]"
      style={{
        top: `${menuPosition.top + 5}px`,
        left: `${menuPosition.left}px`,
        whiteSpace: "nowrap",
      }}
    >
      <div className="w-full h-full flex flex-col justify-start items-start overflow-y-scroll py-[5px] scrollbar-thin">
        {sectionGroupedItems.map((group, groupIndex) => (
          <div key={groupIndex} className="w-full">
            {groupIndex !== 0 && (
              <div className="w-full border-t border-[#ebebeb] my-[10px]" />
            )}
            <div className="pl-[7px] text-[12px] my-[5px] text-[#b0b0b0]">
              {group.groupName}
            </div>
            {group.items.map((item, itemIndex) => (
              <button
                key={itemIndex}
                className={`w-full flex justify-between items-center outline-none hover:bg-[#e9e9e9] rounded-[6px] px-[7px] min-h-[27px] ${
                  sectionItemsMappingToIndex[item.label] === activeSectionIndex
                    ? "bg-[#e9e9e9]"
                    : "bg-transparent"
                }`}
                onClick={() => removeSlashAndExecute(item)}
              >
                <div className="flex items-center">
                  {item.label === "Bold" && (
                    <HugeiconsIcon
                      icon={TextBoldIcon}
                      size={14}
                      strokeWidth={2.7}
                      className="mr-[10px]"
                    />
                  )}
                  {item.label === "Italic" && (
                    <HugeiconsIcon
                      icon={TextItalicIcon}
                      size={14}
                      strokeWidth={2}
                      className="mr-[10px]"
                    />
                  )}
                  {item.label === "Underline" && (
                    <HugeiconsIcon
                      icon={TextUnderlineIcon}
                      size={14}
                      strokeWidth={2}
                      className="mr-[10px]"
                    />
                  )}
                  {item.label === "Strikethrough" && (
                    <HugeiconsIcon
                      icon={TextStrikethroughIcon}
                      size={14}
                      strokeWidth={2}
                      className="mr-[10px]"
                    />
                  )}
                  {item.label === "Heading 1" && (
                    <HugeiconsIcon
                      icon={Heading01Icon}
                      size={16}
                      strokeWidth={1.8}
                      className="mr-[10px]"
                    />
                  )}
                  {item.label === "Heading 2" && (
                    <HugeiconsIcon
                      icon={Heading02Icon}
                      size={16}
                      strokeWidth={1.8}
                      className="mr-[10px]"
                    />
                  )}
                  {item.label === "Heading 3" && (
                    <HugeiconsIcon
                      icon={Heading03Icon}
                      size={16}
                      strokeWidth={1.8}
                      className="mr-[10px]"
                    />
                  )}
                  {item.label === "Bulleted List" && (
                    <HugeiconsIcon
                      icon={LeftToRightListBulletIcon}
                      size={14}
                      strokeWidth={2}
                      className="mr-[10px]"
                    />
                  )}
                  {item.label === "Numbered List" && (
                    <HugeiconsIcon
                      icon={LeftToRightListNumberIcon}
                      size={14}
                      strokeWidth={2}
                      className="mr-[10px]"
                    />
                  )}
                  {item.label === "To-do List" && (
                    <HugeiconsIcon
                      icon={CheckListIcon}
                      size={14}
                      strokeWidth={2}
                      className="mr-[10px]"
                    />
                  )}
                  {item.label}
                </div>
                <div className="flex justify-end items-center text-[#ababab]">
                  {item.shortcut.map((sc, idx) => (
                    <span
                      key={idx}
                      className="text-[10px] min-w-[7px] mx-[2px]"
                    >
                      {sc}
                    </span>
                  ))}
                </div>
              </button>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}
