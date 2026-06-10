import { useState } from "react";

export default function FileUploader() {
  const [file, setFile] =
    useState<File | null>(null);

  return (
    <div>

      <input
        type="file"
        accept=".pdf"
        onChange={(e) =>
          setFile(
            e.target.files?.[0] || null
          )
        }
      />

      {file && (
        <p>
          {file.name}
        </p>
      )}
    </div>
  );
}