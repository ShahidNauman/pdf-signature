import { PDFDocument } from "pdf-lib";
import React, { useEffect, useState } from "react";
import { Document, Page, pdfjs } from "react-pdf";
import { DocumentCallback } from "react-pdf/dist/cjs/shared/types";
import "react-pdf/dist/Page/AnnotationLayer.css";
import "react-pdf/dist/Page/TextLayer.css";
import { SignaturePosition } from "./esign-pdf-types";
import { PDFDocumentProxy, getDocument } from "pdfjs-dist";

pdfjs.GlobalWorkerOptions.workerSrc = "/pdf.worker.min.js";

function getArrayBuffer(file: File): ArrayBuffer {
  const reader = new FileReader();
  reader.readAsArrayBuffer(file);
  return reader.result as ArrayBuffer;
}

async function getPositions(
  pdfDoc: PDFDocumentProxy,
  keyword: string
): Promise<SignaturePosition[]> {
  const positions: SignaturePosition[] = [];

  // for (let i = 1; i <= pdfDoc.numPages; i++) {
  //   const page = await pdfDoc.getPage(i);
  //   const viewport = page.getViewport({ scale });
  //   const canvas = document.createElement("canvas");
  //   const context = canvas.getContext("2d");
  //   canvas.height = viewport.height;
  //   canvas.width = viewport.width;
  //   const renderContext = { canvasContext: context, viewport };
  //   await page.render(renderContext).promise;
  //   containerRef.current.appendChild(canvas);

  //   const annotations = await page.getAnnotations();
  //   annotations.forEach((annotation) => {
  //     if (annotation.subtype === "Widget") {
  //       const fieldName = annotation.fieldName
  //         ? annotation.fieldName.toLowerCase()
  //         : "";
  //       const fieldType = annotation.fieldType;
  //       if (fieldName.includes("signature") || fieldType === "Widget") {
  //         drawRectangle(annotation.rect, context, viewport, "black", 2);
  //         drawSignatureImage(
  //           signatureImage,
  //           canvas,
  //           annotation.rect,
  //           viewport,
  //           context
  //         );
  //       } else if (fieldType === "Tx" || fieldType === "Widget") {
  //         drawRectangle(annotation.rect, context, viewport, "red", 2);
  //       }
  //     }
  //     pageNumber(canvas, i);
  //     canvas.classList.add("pdf-page");
  //   });
  // }

  return positions;
}

type PDFEditorProps = {
  file: File;
  signature: File;
  positions: SignaturePosition[];
  className?: string;
};

function PDFEditor({
  file,
  signature,
  positions: temp,
  className = "",
  ...props
}: PDFEditorProps) {
  const [totalPages, setTotalPages] = useState<number>(0);
  const [positions, setPositions] = useState<SignaturePosition[]>([]);

  useEffect(() => {
    if (file) {
      (async () => {
        const pdfData = await file.arrayBuffer();
        const pdfDoc = await getDocument(pdfData).promise;
        const thisPositions = await getPositions(pdfDoc, "sign");
        setPositions(thisPositions);
      })();
    }
  }, [file]);

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
