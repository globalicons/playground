import React from "react";

import { Puck } from "@measured/puck";
import "@measured/puck/puck.css";

import components from "../components";
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
  root: { props: {} },
  zones: {}
};

const viewports = [
  {
    width: 390,
    height: 844,
    icon: "Smartphone",
    label: "Small"
  }
];

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

const defaultOnPublish = (data: any) => {
  console.log("onPublish", JSON.stringify(data));
};

// Render Puck editor
export const Editor = (props: EditorProps) => {
  const { data, onPublish = defaultOnPublish } = props;
  
  let editorData = initObject;
  
  // Determine the type of data and process accordingly
  if (data) {
    if (isPuckObject(data)) {
      // Case 1: If data is already a Puck object, use it directly
      editorData = data;
    } else if (typeof data === 'string') {
      // Case 2 & 3: If data is a string, determine if it's HTML or plain text
      editorData = isHtmlString(data) 
        ? migrate(data, 'Html') 
        : migrate(data, 'Text');
    }
    // For any other data type, we'll use the default initObject
  }
  
  return (
    <Puck
      config={config}
      data={editorData}
      onPublish={onPublish}
      viewports={viewports}
    />
  );
};

export const EmptyEditor = (props: EmptyEditorProps) => {
  const { data = initObject, config: customConfig } = props;
  return <Puck data={data} config={customConfig} />;
};




