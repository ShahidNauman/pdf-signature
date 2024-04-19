import { PDFDocument } from "pdf-lib";
import React, { useState } from "react";
import type { SignaturePosition } from "./esign-pdf-types";
import PDFEditor from "./PDFEditor";
import "./ESignPDF.css";

type ESignPDFProps = {
  file: File;
  signature: File;
  className?: string;
};

function ESignPDF({
  file,
  signature,
  className = "",
  ...props
}: ESignPDFProps) {
  const [positions, setPositions] = useState<SignaturePosition[]>([]);

  async function savePDFWithSigns() {
    const pdfBytes = await file.arrayBuffer();
    const signatureBytes = await signature.arrayBuffer();
    if (pdfBytes && signatureBytes) {
      const pdfDoc = await PDFDocument.load(pdfBytes);
      const signImage = await pdfDoc.embedPng(signatureBytes);

      positions.forEach(({ page, x, y, width, height }) => {
        const { width: signWidth, height: signHeight } = signImage;

        let thisHeight = height || (width / signWidth) * signHeight;
        thisHeight = thisHeight < 50 ? 50 : thisHeight;

        const thisScale = width / thisHeight;
        const scaledWidth = signHeight / thisScale;
        const thisX = x + (width - scaledWidth) / 2;

        pdfDoc.getPage(page - 1).drawImage(signImage, {
          x: thisX,
          y,
          width: scaledWidth,
          height: thisHeight,
        });
      });

      const savedPDFBytes = await pdfDoc.save();

      const url = URL.createObjectURL(
        new Blob([savedPDFBytes], { type: "application/pdf" })
      );

      const tempLink = document.createElement("a");
      tempLink.href = url;
      tempLink.download = file.name + ".pdf";
      tempLink.click();
    }
  }

  return (
    <div className={`${className}`} {...props}>
      <button onClick={savePDFWithSigns}>Save</button>
      <PDFEditor
        file={file}
        signature={signature}
        positions={positions}
        onPositionChange={setPositions}
      />
    </div>
  );
}

export default ESignPDF;
