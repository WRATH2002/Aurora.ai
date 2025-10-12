import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
import * as React from "react";

import { $getRoot } from "lexical";
import { $createStickyNode } from "../nodes/StickyNode";

export default function StickyToolbarPlugin() {
  const [editor] = useLexicalComposerContext();

  return (
    <div className="toolbar fixed top-[100px] z-[1000] cursor-pointer">
      <button
        onClick={() => {
          editor.update(() => {
            const root = $getRoot();
            const stickyNode = $createStickyNode(0, 0);
            root.append(stickyNode);
          });
        }}
        className={"toolbar-item spaced "}
      >
        <span className="text">Insert Sticky Note</span>
      </button>
    </div>
  );
}
