import compileComponent from "../utils/compile-component"

import RawText from "./Text"
import RawLatex from "./Latex"
import RawImage from "./Image"

export const Text = compileComponent(RawText)
export const Latex = compileComponent(RawLatex)
export const Image = compileComponent(RawImage)


export default {
  ...Text,
  ...Latex,
  ...Image
}