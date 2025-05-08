interface ComponentProps {
  name: string;
  config: any;
  render: (props?: any) => React.ReactElement;
}


export const compileComponent = ({ name, config, render }: ComponentProps) => {
  return {
    [name]: {
      fields: config,
      render: render,
    },
  }
}
