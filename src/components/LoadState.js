import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
import React, { useEffect, useRef, useState } from "react";
import { db } from "../firebase";
import {
  arrayRemove,
  arrayUnion,
  onSnapshot,
  serverTimestamp,
} from "firebase/firestore";
import firebase from "../firebase";

export default function LoadState(props) {
  const [editor] = useLexicalComposerContext();
  const [editorText, setEditorText] = useState();

  const isProcessing = useRef(false);
  const lastFetchedNote = useRef(null);

  function saveThisDataLocally(data, lastSaveTime, FileStack, NotePosition) {
    let tempArrWithInfo = [...FileStack];
    tempArrWithInfo[NotePosition] = {
      Title: "",
      Content: data,
      LastSaved: lastSaveTime,
      isReadMode: true,
    };
    props?.setFileStackedWithInfo(tempArrWithInfo);
  }

  function loadNote(NoteName, NotePosition, FileStackLength, FileStack) {
    if (NotePosition < FileStackLength) {
      const newState = editor.parseEditorState(
        JSON?.parse(FileStack[NotePosition]?.Content)
      );
      editor.setEditorState(newState);

      if (FileStack[NotePosition]?.isReadMode) {
        props?.setIsEditMode(false);
        editor.setEditable(false);
      } else {
        props?.setIsEditMode(true);
        editor.setEditable(true);
      }

      props?.setChangeLoading(false);
    }
    // else {
    //   const user = firebase.auth().currentUser;
    //   const docRef = db
    //     .collection("user")
    //     .doc(user?.uid)
    //     .collection("AllNotes")
    //     .doc("FilewiseContent")
    //     .collection("FilewiseContent")
    //     .doc(NoteName?.includes("~_~") ? NoteName : "~_~" + NoteName);

    //   docRef
    //     .get()
    //     .then((dataa) => {
    //       // const savedState = dataa?.data()?.NoteLexicalStructure;
    //       // const newState = editor.parseEditorState(JSON?.parse(savedState));
    //       // editor.setEditorState(newState);
    //       // editor.setEditable(false);

    //       const savedState = dataa?.data()?.Content;
    //       console.log(
    //         "***********************************************************************************"
    //       );
    //       // console.log(savedState);
    //       saveThisDataLocally(
    //         savedState,
    //         dataa?.data()?.LastSaved,
    //         FileStack,
    //         NotePosition
    //       );

    //       const newState = editor.parseEditorState(JSON?.parse(savedState));
    //       editor.setEditorState(newState);
    //       props?.setIsEditMode(false);
    //       editor.setEditable(false);
    //       props?.setChangeLoading(false);
    //     })
    //     .catch((error) => {
    //       console.error("Error fetching document:", error);
    //     });
    // }
  }

  // useEffect(() => {
  //   loadNote(
  //     props?.FileName,
  //     props?.selected,
  //     props?.fileStackedWithInfo?.length,
  //     props?.fileStackedWithInfo
  //   );
  // }, [props?.FileName]);

  useEffect(() => {
    if (!isProcessing.current && props?.fetchNoteQueue?.length > 0) {
      console.log(
        "• Action Function : processQueue()\n• Action Message : Processes are queued, to be performed one by one"
      );
      processQueue();
    } else {
      loadNote(
        props?.FileName,
        props?.selected,
        props?.fileStackedWithInfo?.length,
        props?.fileStackedWithInfo
      );
    }
  }, [props?.fetchNoteQueue, props?.FileName]);

  const fetchNoteData = async (noteName) => {
    try {
      const user = firebase.auth().currentUser;
      const docRef = db
        .collection("user")
        .doc(user?.uid)
        .collection("AllNotes")
        .doc("FilewiseContent")
        .collection("FilewiseContent")
        .doc(noteName.includes("~_~") ? noteName : "~_~" + noteName);

      const dataa = await docRef.get();

      return {
        Title: noteName,
        Content: dataa?.data()?.Content,
        LastSaved: dataa?.data()?.LastSaved,
        isReadMode: true,
      };
    } catch (error) {
      console.error("Error fetching document:", error);
      return null;
    }
  };

  const processQueue = async () => {
    console.log(props?.fetchNoteQueue);
    if (isProcessing.current || props?.fetchNoteQueue.length === 0) return;

    props?.setChangeLoading(false);

    isProcessing.current = true;
    const noteName = props?.fetchNoteQueue[0]; // Take first item in queue
    console.log(
      `• Action Function : processQueue() -> Batch Operation\n• Process Name : ${noteName}\n• Action Message : Process execution started`
    );
    const noteData = await fetchNoteData(noteName);

    if (noteData) {
      props?.setFileStackedWithInfo((prev) => [...prev, noteData]); // Add new data to state
      lastFetchedNote.current = noteData;
    }

    props?.setFetchNoteQueue((prevQueue) => prevQueue.slice(1)); // Remove processed note
    isProcessing.current = false;

    console.log(
      `• Action Function : processQueue() -> Promise\n• Process Name : ${noteName}\n• Action Message : Process execution ended`
    );

    if (props?.fetchNoteQueue.length > 1) {
      processQueue();
    } else if (lastFetchedNote.current) {
      // Apply last fetched note to editor
      console.log(
        `• Action Function : processQueue() -> Empty\n• Action Message : Process Queue finished executing`
      );
      const newState = editor.parseEditorState(
        JSON?.parse(lastFetchedNote.current.Content)
      );
      editor.setEditorState(newState);
      props?.setIsEditMode(false);
      editor.setEditable(false);
      props?.setChangeLoading(false);
    } // Process next item if available
  };

  //
  // useEffect(() => {
  //   setTimeout(() => {
  //     const newState = editor.parseEditorState();
  //     editor.setEditorState(newState);
  //     editor.setEditable(true);
  //   }, 2000);
  // }, [editorText]);

  return <></>;
}
