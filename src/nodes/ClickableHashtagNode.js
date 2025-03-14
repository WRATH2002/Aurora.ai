import { HashtagNode } from "@lexical/hashtag";
var utils = require("@lexical/utils");

export class HashtagNodeClickable extends HashtagNode {
  // constructor(text, key) {
  //   return super(text, key);
  //   // super('')
  // }

  static getType() {
    return "clickable-hashtag";
  }

  static clone(node) {
    return new HashtagNodeClickable(node.__key);
  }

  // static importJSON(serializedNode) {
  //   return HashtagNode.importJSON(serializedNode);
  // }

  exportJSON() {
    // return super.exportJSON()
    return { ...super.exportJSON(), type: "clickable-hashtag" };
  }

  createDOM(config) {
    const dom = super.createDOM(config);
    console.log("hashtag node with override", config, dom);
    const element = document.createElement("a");
    element.href = `/posts?hashtag=`;
    utils.addClassNamesToElement(element, config.theme.link);
    element.appendChild(dom);
    return element;
  }
}
