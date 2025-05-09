import React from "react";

import { Render } from "@measured/puck"
import components from "../components"
import { migrate } from "../utils/migrate";

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

export const Renderer = (props: RendererProps) => {
  const { data } = props;
  
  // If no data is provided, use the initial object
  if (!data) {
    return <Render data={initObject} config={{ components }} />;
  }
  
  // Case 1: If data is already a Puck object, use it directly
  if (isPuckObject(data)) {
    return <Render data={data} config={{ components }} />;
  }
  
  // Case 2 & 3: If data is a string, determine if it's HTML or plain text
  if (typeof data === 'string') {
    if (isHtmlString(data)) {
      // It's an HTML string, use the HTML migration
      const migratedData = migrate(data, 'Html');
      console.log("migratedData", migratedData)
      return <Render data={migratedData} config={{ components }} />;
    } else {
      // It's a plain text string, use the Text migration
      const migratedData = migrate(data, 'Text');
      return <Render data={migratedData} config={{ components }} />;
    }
  }
  
  // Fallback: If data is in an unexpected format, use the initial object
  return <Render data={initObject} config={{ components }} />;
}