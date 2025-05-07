import React from "react";

const name = "Text"

const config = {
    text: { type: "text" },
    fontWeight: { type: "radio", options: [{ label: 'Normal', value: 'normal'}, { label: 'Bold', value: 'bold'}] },
    fontSize: { type: "radio", options: [{ label: '16', value: 16 }, { label: '20', value: 20 }, { label: '24', value: 24 }] },
}

const render = ({ text, fontWeight, fontSize } : { text: string, fontWeight: string, fontSize: number }) => {
    return <p style={{ fontWeight, fontSize }}>{text}</p>
}

export default {
    name,
    config,
    render
} as ComponentProps;
