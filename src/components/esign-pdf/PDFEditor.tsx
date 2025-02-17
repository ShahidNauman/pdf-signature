import { PDFDocument } from "pdf-lib";
import React, { useEffect, useState } from "react";
import { Document, Page, pdfjs } from "react-pdf";
import "react-pdf/dist/Page/AnnotationLayer.css";
import "react-pdf/dist/Page/TextLayer.css";
import SignaturesEditor from "./SignaturesEditor";
import type { SignaturePosition } from "./esignpdf-types";

pdfjs.GlobalWorkerOptions.workerSrc = "/pdf.worker.min.js";

type PDFEditorProps = {
  file: File;
  signature: File;
  positions?: SignaturePosition[];
  onPositionsChange?: (positions: SignaturePosition[]) => void;
  className?: string;
};

function PDFEditor({
  file,
  signature,
  positions = [],
  onPositionsChange,
  className = "",
  ...props
}: PDFEditorProps) {
  const [pdfDoc, setPdfDoc] = useState<PDFDocument>();

  useEffect(() => {
    if (file) {
      (async () => {
        const pdfBytes = await file.arrayBuffer();
        const thisPdfDoc = await PDFDocument.load(pdfBytes);
        setPdfDoc(thisPdfDoc);
      })();
    }
  }, [file]);

  if (!file) return <></>;

  return (
    <Document file={file} className={className} {...props}>
      {pdfDoc?.getPages().map((page, index) => (
        <Page
          key={`page_${index}`}
          pageNumber={index + 1}
          renderAnnotationLayer={false}
          renderTextLayer={false}
          className="pdf-page"
        >
          <SignaturesEditor
            signature={signature}
            positions={positions.filter((p) => p.page === index + 1)}
            width={page.getWidth()}
            height={page.getHeight()}
            onPositionsChange={(p) =>
              onPositionsChange?.([
                ...positions.filter((p) => p.page !== index + 1),
                ...p.map((p) => ({ ...p, page: index + 1 })),
              ])
            }
            className="overlay-canvas"
          />
        </Page>
      ))}
    </Document>
  );
}

export default PDFEditor;
