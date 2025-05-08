import { compileComponent } from "../utils"

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

export const rawComponents = {
  Text: RawText,
  Latex: RawLatex,
  Image: RawImage,
  RichText: RawRichText,
  Html: RawHtml
}


export default {
  ...Text,
  ...Latex,
  ...Image,
  ...RichText,
  ...Html
}