import React, { useState } from "react";
import { Document, Page, pdfjs } from "react-pdf";
import { DocumentCallback } from "react-pdf/dist/cjs/shared/types";
import "react-pdf/dist/Page/AnnotationLayer.css";
import "react-pdf/dist/Page/TextLayer.css";
import { SignaturePosition } from "./esign-pdf-types";

pdfjs.GlobalWorkerOptions.workerSrc = "/pdf.worker.min.js";

type PDFEditorProps = {
  file: File;
  signature: File;
  positions: SignaturePosition[];
  className?: string;
};

function PDFEditor({
  file,
  signature,
  positions,
  className = "",
  ...props
}: PDFEditorProps) {
  const [totalPages, setTotalPages] = useState<number>(0);

  function onDocumentLoadSuccess({ numPages }: DocumentCallback) {
    setTotalPages(numPages);
  }

  if (!file) return <></>;

  return (
    <Document
      file={file}
      onLoadSuccess={onDocumentLoadSuccess}
      className={className}
      {...props}
    >
      {Array.from(new Array(totalPages), (_, index) => (
        <Page
          key={`page_${index + 1}`}
          pageNumber={index + 1}
          scale={1.5}
          renderAnnotationLayer={false}
          renderTextLayer={false}
        />
      ))}
    </Document>
  );
}

export default PDFEditor;
