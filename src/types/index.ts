type EditorProps = {
  data: any;
  onPublish: (data: any) => void;
};


interface ComponentProps {
  name: string;
  config: any;
  render: (props?: any) => React.ReactElement;
}

interface EmptyEditorProps extends EditorProps {
  config: any;
}

interface RendererProps {
  data: any;
}