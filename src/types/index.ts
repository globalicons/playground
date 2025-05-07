export interface ComponentProps {
  name: string;
  config: any;
  render: (props?: any) => React.ReactElement;
}