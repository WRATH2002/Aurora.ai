import React, { useState, useEffect } from "react";
import { LexicalComposer } from "@lexical/react/LexicalComposer";
import { RichTextPlugin } from "@lexical/react/LexicalRichTextPlugin";
import { ContentEditable } from "@lexical/react/LexicalContentEditable";
import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
import { $getSelection, $isRangeSelection } from "lexical";

const FloatingToolbarPlugin = () => {
  const [editor] = useLexicalComposerContext();
  const [toolbarPosition, setToolbarPosition] = useState(null);

  useEffect(() => {
    const updateToolbar = () => {
      const selection = $getSelection();
      if ($isRangeSelection(selection)) {
        const textContent = selection.getTextContent();
        if (textContent.trim() !== "") {
          // Ensure there is selected text
          const domRange = window.getSelection()?.getRangeAt(0);
          if (domRange) {
            const rect = domRange.getBoundingClientRect();
            setToolbarPosition({
              top: rect.top - 40, // Adjust to place the toolbar above selection
              left: rect.left + rect.width / 2, // Center the toolbar
            });
          }
        } else {
          setToolbarPosition(null); // Hide toolbar if selection is empty
        }
      } else {
        setToolbarPosition(null); // Hide toolbar if not a range selection
      }
    };

    return editor.registerUpdateListener(({ editorState }) => {
      editorState.read(() => {
        updateToolbar();
      });
    });
  }, [editor]);

  if (!toolbarPosition) return null;

  return (
    <div
      style={{
        position: "absolute",
        top: `${toolbarPosition.top}px`,
        left: `${toolbarPosition.left}px`,
        background: "white",
        border: "1px solid gray",
        padding: "5px",
        borderRadius: "5px",
        zIndex: 1000,
      }}
    >
      <button>Click Me!</button>
    </div>
  );
};

export default FloatingToolbarPlugin;
