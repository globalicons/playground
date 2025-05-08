import React from 'react';

const name = "HTML";

const config = {
  content: {
    type: "text",
    label: "HTML Content",
    default: "",
  },
};

const render = ({ content }: { content: string }) => {
  return (
    <div style={{ margin: "1em 0" }}>
      {content && (
        <div dangerouslySetInnerHTML={{ __html: content }} />
      )}
    </div>
  );
};

export default {
  name,
  config,
  render,
};