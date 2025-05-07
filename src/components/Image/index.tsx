import React, { useState } from "react";

const name = "Image";

const config = {
  imageUrl: {
    type: "custom",
    render: ({ onChange, value }: { name: string, onChange: (objectUrl : string ) => {}, value: string }) => {
      const [previewUrl, setPreviewUrl] = useState<string | null>(value || null);

      const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
          const objectUrl = URL.createObjectURL(file);
          setPreviewUrl(objectUrl);
          onChange(objectUrl);
        }
      };

      return (
        <div>
          <input type="file" accept="image/*" onChange={handleFileChange} />
          {previewUrl && (
            <div style={{ marginTop: "1em" }}>
              <img
                src={previewUrl}
                alt="Preview"
                style={{ maxWidth: "100%", maxHeight: 300, borderRadius: 8 }}
              />
            </div>
          )}
        </div>
      );
    },
  },
};

const render = ({ imageUrl }: { imageUrl: string }) => {
  return (
    <div style={{ textAlign: "center", margin: "1em 0" }}>
      {imageUrl && (
        <img
          src={imageUrl}
          alt="Rendered"
          style={{ maxWidth: "100%", maxHeight: 400, borderRadius: 8 }}
        />
      )}
    </div>
  );
};

export default {
  name,
  config,
  render,
};
