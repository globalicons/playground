import "katex/dist/katex.min.css";

import React, { useState } from 'react';
import RichTextEditor from 'reactjs-tiptap-editor';
import { 
  BaseKit, 
} from 'reactjs-tiptap-editor';
import { Heading } from 'reactjs-tiptap-editor/heading'; 
import { Bold } from 'reactjs-tiptap-editor/bold'; 
import { Italic } from 'reactjs-tiptap-editor/italic'; 
import { TextUnderline } from 'reactjs-tiptap-editor/textunderline'; 
import Mathematics from "tiptap-math";

import 'reactjs-tiptap-editor/style.css';

const name = "RichText";

const extensions = [
  BaseKit.configure({ placeholder: {  showOnlyCurrent: true } }),
  Heading,
  Bold,
  Italic,
  TextUnderline,
  Mathematics
];

const DEFAULT = '';

const config = {
  content: {
    type: "custom",
    render: ({ onChange, value }: { name: string, onChange: (content: string) => void, value: string }) => {
      const [editorContent, setEditorContent] = useState(value || DEFAULT);

      const handleContentChange = (newContent: any) => {
        setEditorContent(newContent);
        onChange(newContent);
      };

      return (
       <div>
         <RichTextEditor
          dark={false}
          output='html'
          content={editorContent}
          onChangeContent={handleContentChange}
          extensions={extensions}
        />
       </div>
      );
    },
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