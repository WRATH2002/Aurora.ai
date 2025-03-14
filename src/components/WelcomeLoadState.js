import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
import React, { useEffect, useState } from "react";

export default function WelcomeLoadState(props) {
  const [editor] = useLexicalComposerContext();
  const [editorText, setEditorText] = useState();

  function loadNote() {
    const newState = editor.parseEditorState(JSON?.parse(props?.text));
    editor.setEditorState(newState);
    editor.setEditable(false);
  }

  useEffect(() => {
    loadNote();
  }, []);

  return <></>;
}
