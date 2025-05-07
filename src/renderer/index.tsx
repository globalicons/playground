import React from "react";

import { Render  } from "@measured/puck"
import components from "../components"

const initObject = {
  content: [],
  root: {props: {}},
  zones: {}
}

export const Renderer = (props: RendererProps) => {
  return <Render data={props.data || initObject} config={{ components }} />
}