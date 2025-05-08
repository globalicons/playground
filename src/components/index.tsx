import compileComponent from "../utils/compile-component"

import RawText from "./Text"
import RawLatex from "./Latex"
import RawImage from "./Image"
import RawRichText from "./RichText"
import RawHtml from "./Html"

export const Text = compileComponent(RawText)
export const Latex = compileComponent(RawLatex)
export const Image = compileComponent(RawImage)
export const RichText = compileComponent(RawRichText)
export const Html = compileComponent(RawHtml)


export default {
  ...Text,
  ...Latex,
  ...Image,
  ...RichText,
  ...Html
}