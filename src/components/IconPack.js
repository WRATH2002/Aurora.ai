import React from "react";
import {
  AlignJustify,
  Bold,
  Delete,
  Heading,
  Highlighter,
  Indent,
  IndentDecrease,
  Italic,
  List,
  ListOrdered,
  Mic,
  Minus,
  Quote,
  Redo,
  SquareCheck,
  Strikethrough,
  Subscript,
  Superscript,
  Type,
  Underline,
  Undo,
} from "lucide-react";

export default function IconPack(props) {
  return (
    <>
      {props?.data?.itemTag === "T1" ? (
        <>
          <Mic
            width={18}
            height={18}
            strokeWidth="2.2"
            className="mr-[10px] cursor-pointer"
          />
        </>
      ) : props?.data?.itemTag === "T2" ? (
        <>
          <Undo
            width={18}
            height={18}
            strokeWidth="2.2"
            className="mr-[10px] cursor-pointer"
          />
        </>
      ) : props?.data?.itemTag === "T3" ? (
        <>
          <Redo
            width={18}
            height={18}
            strokeWidth="2.2"
            className="mr-[10px] cursor-pointer"
          />
        </>
      ) : props?.data?.itemTag === "T4" ? (
        <>
          <Type
            width={18}
            height={18}
            strokeWidth="2.2"
            className="mr-[10px] cursor-pointer"
          />
        </>
      ) : props?.data?.itemTag === "T5" ? (
        <>
          <Bold
            width={18}
            height={18}
            strokeWidth="2.2"
            className="mr-[10px] cursor-pointer"
          />
        </>
      ) : props?.data?.itemTag === "T6" ? (
        <>
          <Bold
            width={18}
            height={18}
            strokeWidth="2.2"
            className="mr-[10px] cursor-pointer"
          />
        </>
      ) : props?.data?.itemTag === "T7" ? (
        <>
          <Italic
            width={18}
            height={18}
            strokeWidth="2.2"
            className="mr-[10px] cursor-pointer"
          />
        </>
      ) : props?.data?.itemTag === "T8" ? (
        <>
          <Underline
            width={18}
            height={18}
            strokeWidth="2.2"
            className="mr-[10px] cursor-pointer"
          />
        </>
      ) : props?.data?.itemTag === "T9" ? (
        <>
          <Strikethrough
            width={18}
            height={18}
            strokeWidth="2.2"
            className="mr-[10px] cursor-pointer"
          />
        </>
      ) : props?.data?.itemTag === "T10" ? (
        <>
          <Highlighter
            width={18}
            height={18}
            strokeWidth="2.2"
            className="mr-[10px] cursor-pointer"
          />
        </>
      ) : props?.data?.itemTag === "T11" ? (
        <>
          <Minus
            width={18}
            height={18}
            strokeWidth="2.2"
            className="mr-[10px] cursor-pointer"
          />
        </>
      ) : props?.data?.itemTag === "T12" ? (
        <>
          <Heading
            width={18}
            height={18}
            strokeWidth="2.2"
            className="mr-[10px] cursor-pointer"
          />
        </>
      ) : props?.data?.itemTag === "T13" ? (
        <>
          <Quote
            width={18}
            height={18}
            strokeWidth="2.2"
            className="mr-[10px] cursor-pointer"
          />
        </>
      ) : props?.data?.itemTag === "T14" ? (
        <>
          <Subscript
            width={18}
            height={18}
            strokeWidth="2.2"
            className="mr-[10px] cursor-pointer"
          />
        </>
      ) : props?.data?.itemTag === "T15" ? (
        <>
          <Superscript
            width={18}
            height={18}
            strokeWidth="2.2"
            className="mr-[10px] cursor-pointer"
          />
        </>
      ) : props?.data?.itemTag === "T16" ? (
        <>
          <List
            width={18}
            height={18}
            strokeWidth="2.2"
            className="mr-[10px] cursor-pointer"
          />
        </>
      ) : props?.data?.itemTag === "T17" ? (
        <>
          <ListOrdered
            width={18}
            height={18}
            strokeWidth="2.2"
            className="mr-[10px] cursor-pointer"
          />
        </>
      ) : props?.data?.itemTag === "T18" ? (
        <>
          <SquareCheck
            width={18}
            height={18}
            strokeWidth="2.2"
            className="mr-[10px] cursor-pointer"
          />
        </>
      ) : props?.data?.itemTag === "T19" ? (
        <>
          <AlignJustify
            width={18}
            height={18}
            strokeWidth="2.2"
            className="mr-[10px] cursor-pointer"
          />
        </>
      ) : props?.data?.itemTag === "T20" ? (
        <>
          <Delete
            width={18}
            height={18}
            strokeWidth="2.2"
            className="mr-[10px] cursor-pointer"
          />
        </>
      ) : props?.data?.itemTag === "T21" ? (
        <>
          <Indent
            width={18}
            height={18}
            strokeWidth="2.2"
            className="mr-[10px] cursor-pointer"
          />
        </>
      ) : props?.data?.itemTag === "T22" ? (
        <>
          <IndentDecrease
            width={18}
            height={18}
            strokeWidth="2.2"
            className="mr-[10px] cursor-pointer"
          />
        </>
      ) : (
        <></>
      )}
    </>
  );
}
