import React from "react";

import { Puck } from "@measured/puck";
import "@measured/puck/puck.css";

import components from "../components"
import { migrate } from "../utils/migrate";

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

// Helper function to detect if a string contains HTML
const isHtmlString = (str: string): boolean => {
  // Simple check for HTML tags
  return /<[a-z][\s\S]*>/i.test(str);
};

// Helper function to detect if data is a Puck object
const isPuckObject = (data: any): boolean => {
  return (
    data &&
    typeof data === 'object' &&
    Array.isArray(data.content) &&
    data.root &&
    data.zones !== undefined
  );
};

const onPublish = (data: any) => {
  console.log("onPublish", JSON.stringify(data))
}
 
// Render Puck editor
export const Editor = (props: EditorProps) => {
  const { data } = props;
  
  // If no data is provided, use the initial object
  if (!data) {
    return <Puck config={config} data={initObject} onPublish={props.onPublish || onPublish} />;
  }
  
  // Case 1: If data is already a Puck object, use it directly
  if (isPuckObject(data)) {
    return <Puck config={config} data={data} onPublish={props.onPublish || onPublish} />;
  }
  
  // Case 2 & 3: If data is a string, determine if it's HTML or plain text
  if (typeof data === 'string') {
    let migratedData;
    if (isHtmlString(data)) {
      // It's an HTML string, use the HTML migration
      migratedData = migrate(data, 'Html');
    } else {
      // It's a plain text string, use the Text migration
      migratedData = migrate(data, 'Text');
    }
    return <Puck config={config} data={migratedData} onPublish={props.onPublish || onPublish} />;
  }
  
  // Fallback: If data is in an unexpected format, use the initial object
  return <Puck config={config} data={initObject} onPublish={props.onPublish || onPublish} />;
}

export const EmptyEditor = (props: EmptyEditorProps) => {
  return <Puck data={props.data || initObject} config={props.config} />
}




