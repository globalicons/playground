import React from "react";
import { ComponentProps } from "../../types";
import MarkdownIt from "markdown-it";
import mkKatex from "markdown-it-katex";
import "katex/dist/katex.min.css";

// Setup markdown-it with KaTeX plugin
const md = new MarkdownIt({
  html: true,
  breaks: true,
  linkify: true,
}).use(mkKatex);

const name = "Latex";

const config = {
  formula: {
    type: "text",
  },
  display: {
    type: "radio",
    options: [
      { label: "Inline", value: "inline" },
      { label: "Block", value: "block" },
    ],
    default: "block",
  },
  fontSize: {
    type: "radio",
    options: [
      { label: "16", value: 16 },
      { label: "20", value: 20 },
      { label: "24", value: 24 },
    ],
    default: 20,
  },
};

const LatexComponent = ({
  formula,
  fontSize,
}: {
  formula: string;
  fontSize: number;
}) => {
  // Ensure we always pass a valid string to markdown-it
  const safeFormula = typeof formula === "string" ? formula : "";
  const html = md.render(safeFormula);

  return (
    <div
      className="markdown-latex"
      style={{ fontSize }}
      dangerouslySetInnerHTML={{ __html: html }}
    />
  );
};

const render = (props: {
  formula?: string;
  display?: string;
  fontSize?: number;
}) => {
  const {
    formula = "",
    fontSize = 20,
  } = props;

  return <LatexComponent formula={formula} fontSize={fontSize} />;
};

export default {
  name,
  config,
  render,
} as ComponentProps;
