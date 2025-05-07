declare module 'markdown-it';

export interface ComponentProps {
  name: string;
  config: any;
  render: (props?: any) => React.ReactElement;
}