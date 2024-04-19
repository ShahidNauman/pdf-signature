import { PDFDocument } from "pdf-lib";
import React, { useEffect, useState } from "react";
import { Document, Page, pdfjs } from "react-pdf";
import "react-pdf/dist/Page/AnnotationLayer.css";
import "react-pdf/dist/Page/TextLayer.css";
import type { SignFieldPosition, SignaturePosition } from "./esign-pdf-types";
import SignatureCanvas from "./SignatureCanvas";

pdfjs.GlobalWorkerOptions.workerSrc = "/pdf.worker.min.js";

async function getPositions(
  pdfDoc: PDFDocument,
  keyword: string
): Promise<SignFieldPosition[]> {
  const positions: SignFieldPosition[] = [];

  const form = pdfDoc.getForm();
  const fields = form.getFields();

  // Get the positions of all text fields
  fields.forEach((field) => {
    const widgets = field.acroField.getWidgets();
    const firstWidget = widgets[0]; // Assuming the field has at least one widget
    const fieldPosition = firstWidget.getRectangle();

    if (field.getName().toLowerCase().includes(keyword.toLowerCase())) {
      positions.push({
        page: 1,
        x: fieldPosition.x,
        y: fieldPosition.y,
        width: fieldPosition.width,
        height: fieldPosition.height,
      });
    }
  });

  return positions;
}

type PDFEditorProps = {
  file: File;
  signature: File;
  positions?: SignaturePosition[];
  onPositionChange?: (positions: SignaturePosition[]) => void;
  className?: string;
};

function PDFEditor({
  file,
  signature,
  positions = [],
  onPositionChange,
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
        onPositionChange?.(await getPositions(thisPdfDoc, "sign"));
      })();
    }
  }, [file, onPositionChange]);

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
          <SignatureCanvas
            signature={signature}
            positions={positions.filter((p) => p.page === index + 1)}
            width={page.getWidth()}
            height={page.getHeight()}
            className="overlay-canvas"
          />
        </Page>
      ))}
    </Document>
  );
}

export default PDFEditor;
