import React from "react";

type FileUploaderProps = {
  onFileSelect: (file: File) => void;
  className?: string;
};

function FileUploader({
  onFileSelect,
  className = "",
  ...props
}: FileUploaderProps) {
  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (file) {
      onFileSelect(file);
    }
  }

  return (
    <div className={`${className}`} {...props}>
      <input type="file" accept="application/pdf" onChange={handleFileChange} />
    </div>
  );
}

export default FileUploader;
