import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
import { useEffect, useRef, useState } from "react";
import { getUrlName } from "../utils/functions";
import { HugeiconsIcon } from "@hugeicons/react";
import {
  Copy01Icon,
  Globe02Icon,
  LinkSquare02Icon,
  PencilEdit01Icon,
} from "@hugeicons/core-free-icons";
import EditLinkModal from "../components/EditLinkModal";

export default function HoverLinkToolbarPlugin() {
  const [editor] = useLexicalComposerContext();
  const [toolbar, setToolbar] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingLink, setEditingLink] = useState(null);

  const hideTimeout = useRef(null);
  const toolbarRef = useRef(null);

  // Apply class and handle ALT+click
  useEffect(() => {
    const root = editor.getRootElement();
    if (!root) return;

    const handleLinkClick = (e) => {
      e.preventDefault();
      e.stopPropagation();
      const url = e.currentTarget.href;
      if (e.altKey) {
        window.open(url, "_blank", "noopener,noreferrer");
      }
    };

    const applyClickableLinks = () => {
      const links = root.querySelectorAll("a");
      links.forEach((link) => {
        link.classList.add("clickable-link");
        link.removeEventListener("click", handleLinkClick);
        link.addEventListener("click", handleLinkClick);
      });
    };

    applyClickableLinks();
    const unsubscribe = editor.registerUpdateListener(() => {
      applyClickableLinks();
    });

    return () => {
      unsubscribe();
      root.querySelectorAll("a").forEach((link) => {
        link.removeEventListener("click", handleLinkClick);
      });
    };
  }, [editor]);

  // Hover detection for toolbar
  useEffect(() => {
    const rootElement = editor.getRootElement();
    function handleMouseOver(e) {
      const link = e.target.closest("a");
      if (link) {
        if (hideTimeout.current) {
          clearTimeout(hideTimeout.current);
          hideTimeout.current = null;
        }
        const rect = link.getBoundingClientRect();
        setToolbar({
          url: link.href,
          top: rect.bottom + window.scrollY + 8,
          left: rect.left + window.scrollX,
        });
      }
    }

    function handleMouseOut(e) {
      const link = e.target.closest("a");
      if (link) {
        hideTimeout.current = setTimeout(() => {
          setToolbar(null);
        }, 200);
      }
    }

    rootElement.addEventListener("mouseover", handleMouseOver);
    rootElement.addEventListener("mouseout", handleMouseOut);

    return () => {
      rootElement.removeEventListener("mouseover", handleMouseOver);
      rootElement.removeEventListener("mouseout", handleMouseOut);
    };
  }, [editor]);

  // Keep toolbar alive on hover
  useEffect(() => {
    function handleToolbarEnter() {
      if (hideTimeout.current) {
        clearTimeout(hideTimeout.current);
        hideTimeout.current = null;
      }
    }
    function handleToolbarLeave() {
      hideTimeout.current = setTimeout(() => {
        setToolbar(null);
      }, 200);
    }
    const node = toolbarRef.current;
    if (node) {
      node.addEventListener("mouseenter", handleToolbarEnter);
      node.addEventListener("mouseleave", handleToolbarLeave);
    }
    return () => {
      if (node) {
        node.removeEventListener("mouseenter", handleToolbarEnter);
        node.removeEventListener("mouseleave", handleToolbarLeave);
      }
    };
  }, [toolbar]);

  // Save handler (update DOM link)
  const handleSaveLink = (newUrl, newText) => {
    editor.update(() => {
      const root = editor.getRootElement();
      const links = root.querySelectorAll(`a[href="${editingLink}"]`);
      if (links.length > 0) {
        const link = links[0];
        link.setAttribute("href", newUrl); // ✅ update URL
        link.textContent = newText; // ✅ replace text
      }
    });
    setIsModalOpen(false);
    setEditingLink(null);
  };

  if (!toolbar)
    return (
      <>
        {isModalOpen && (
          <EditLinkModal
            isOpen={isModalOpen}
            onClose={() => {
              setIsModalOpen(false);
              setEditingLink(null);
            }}
            initialUrl={editingLink || ""}
            initialText={editingLink || ""}
            onSave={handleSaveLink}
          />
        )}
      </>
    );

  return (
    <>
      <div
        className="font-[r] flex justify-start items-center rounded-[10px] h-[35px] text-[#454545] border border-[#d2d2d2]"
        ref={toolbarRef}
        style={{
          position: "fixed",
          top: toolbar.top,
          left: toolbar.left,
          background: "#fff",
          padding: "3px 7px",
          boxShadow: "0 12px 16px -6px rgba(0, 0, 0, 0.1)",
          zIndex: 9999,
          whiteSpace: "nowrap",
        }}
      >
        <div className="flex justify-center items-center text-[13px] text-[#454545] cursor-default ml-[3px] ">
          <HugeiconsIcon
            icon={Globe02Icon}
            size={14}
            strokeWidth={1.7}
            className="mr-[5px]"
          />
          {getUrlName(toolbar?.url)}
        </div>
        <div className="ml-[9px] mr-[5px] h-[16px] border-l-[1.5px] border-[#e9e9e9]"></div>
        <a
          href={toolbar.url}
          target="_blank"
          rel="noreferrer"
          className="h-[calc(100%-3px)] aspect-square flex justify-center items-center hover:bg-[#e9e9e9] rounded-md"
        >
          <HugeiconsIcon icon={LinkSquare02Icon} size={14} strokeWidth={1.7} />
        </a>
        <button
          className="h-[calc(100%-3px)] aspect-square flex justify-center items-center hover:bg-[#e9e9e9] rounded-md ml-[5px]"
          onClick={() => navigator.clipboard.writeText(toolbar.url)}
        >
          <HugeiconsIcon icon={Copy01Icon} size={14} strokeWidth={1.7} />
        </button>
        <button
          className="h-[calc(100%-3px)] aspect-square flex justify-center items-center hover:bg-[#e9e9e9] rounded-md ml-[5px] mr-[-2px]"
          onClick={() => {
            setEditingLink(toolbar.url);
            setIsModalOpen(true);
          }}
        >
          <HugeiconsIcon icon={PencilEdit01Icon} size={14} strokeWidth={1.7} />
        </button>
      </div>

      {/* Modal */}
      {isModalOpen && (
        <EditLinkModal
          isOpen={isModalOpen}
          onClose={() => {
            setIsModalOpen(false);
            setEditingLink(null);
          }}
          initialUrl={editingLink || ""}
          initialText={editingLink || ""}
          onSave={handleSaveLink}
        />
      )}
    </>
  );
}
