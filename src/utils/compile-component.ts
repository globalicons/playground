export default function compileComponent({ name, config, render }: ComponentProps) {
  return {
    [name]: {
      fields: config,
      render: render,
    },
  }
}
