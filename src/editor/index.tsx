import React from "react";
import { Puck } from "@measured/puck";
import "@measured/puck/puck.css";

import components from "../components"

type EditorProps = {
  data: any;
  onPublish: (data: any) => void;
};

interface EmptyEditorProps extends EditorProps {
  config: any;
}
 
// Create Puck component config
const config: any = { components };

const initObject = {
  content: [],
  root: {props: {}},
  zones: {}
}
 
// Render Puck editor
export const Editor = (props: EditorProps) => {
  return <Puck config={config} data={props.data || initObject} onPublish={props.onPublish} />;
}

export const EmptyEditor = (props: EmptyEditorProps) => {
  return <Puck data={props.data || initObject} config={props.config} />
}


