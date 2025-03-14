import { TextNode } from "lexical";

export class Keywordnode extends TextNode {
  static getType() {
    return "keyword";
  }

  static clone(node) {
    return new Keywordnode(node.__text, node.__key);
  }

  static importJSON(serializedNode) {
    const node = $createKeywordnode(serializedNode.text);
    node.setFormat(serializedNode.format);
    node.setDetail(serializedNode.detail);
    node.setMode(serializedNode.mode);
    node.setStyle(serializedNode.style);
    return node;
  }

  exportJSON() {
    return {
      ...super.exportJSON(),
      type: "keyword",
      version: 1,
    };
  }

  createDOM(config) {
    const dom = super.createDOM(config);
    dom.style.cursor = "default";
    dom.className = "keyword";
    return dom;
  }

  canInsertTextBefore() {
    return false;
  }

  canInsertTextAfter() {
    return false;
  }

  isTextEntity() {
    return true;
  }
}

export function $createKeywordnode(keyword) {
  return new Keywordnode(keyword);
}

export function $isKeywordnode(node) {
  return node instanceof Keywordnode;
}
