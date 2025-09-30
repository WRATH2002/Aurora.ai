import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
import { useEffect } from "react";
import { $isLinkNode } from "@lexical/link";
import {
  $getNearestNodeFromDOMNode,
  $getSelection,
  $isRangeSelection,
} from "lexical";

export default function ClickableLinkPlugin({ filter, newTab = true }) {
  const [editor] = useLexicalComposerContext();

  useEffect(() => {
    const applyRedLinks = () => {
      const linkDomNodes = editor.getRootElement().querySelectorAll("a");
      linkDomNodes.forEach((link) => {
        link.classList.add("clickable-link");
      });
    };
    applyRedLinks();
    const unsubscribe = editor.registerUpdateListener(() => {
      applyRedLinks();
    });
    return () => {
      unsubscribe();
    };
  }, [editor]);

  useEffect(() => {
    function onClick(e) {
      const event = e;
      const linkDomNode = getLinkDomNode(event, editor);

      if (linkDomNode === null) {
        return;
      }

      const href = linkDomNode.getAttribute("href");

      if (
        linkDomNode.getAttribute("contenteditable") === "false" ||
        href === undefined
      ) {
        return;
      }

      // Allow user to select link text without following URL
      const selection = editor.getEditorState().read($getSelection);
      if ($isRangeSelection(selection) && !selection.isCollapsed()) {
        return;
      }

      let linkNode = null;
      editor.update(() => {
        const maybeLinkNode = $getNearestNodeFromDOMNode(linkDomNode);

        if ($isLinkNode(maybeLinkNode)) {
          linkNode = maybeLinkNode;
        }
      });

      if (
        linkNode === null ||
        (filter !== undefined && !filter(event, linkNode))
      ) {
        return;
      }

      try {
        if (href !== null) {
          window.open(
            href,
            newTab || event.metaKey || event.ctrlKey ? "_blank" : "_blank"
          );
        }
      } catch {
        // It didn't work, which is better than throwing an exception!
      }
    }

    return editor.registerRootListener((rootElement, prevRootElement) => {
      if (prevRootElement !== null) {
        prevRootElement.removeEventListener("click", onClick);
      }

      if (rootElement !== null) {
        rootElement.addEventListener("click", onClick);
      }
    });
  }, [editor, filter, newTab]);

  return null;
}

function isLinkDomNode(domNode) {
  return domNode.nodeName.toLowerCase() === "a";
}

function getLinkDomNode(event, editor) {
  return editor.getEditorState().read(() => {
    const domNode = event.target;

    if (isLinkDomNode(domNode)) {
      return domNode;
    }

    if (domNode.parentNode && isLinkDomNode(domNode.parentNode)) {
      return domNode.parentNode;
    }

    return null;
  });
}
