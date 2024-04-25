import { PDFDocument } from "pdf-lib";
import React, { useEffect, useState } from "react";
import PDFEditor from "./PDFEditor";
import { getSignatureFields } from "./esignpdf-helpers";
import type { SignaturePosition } from "./esignpdf-types";
import "./esignpdf-styles.css";

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
  const [signaturePositions, setSignaturePositions] = useState<
    SignaturePosition[]
  >([]);

  useEffect(() => {
    if (file) {
      (async function () {
        const signatureFields = await getSignatureFields(file, "sign");

        const signImage = new Image();
        signImage.src = URL.createObjectURL(signature);
        signImage.onload = (e) => {
          const { width: signWidth, height: signHeight } =
            e.target as HTMLImageElement;

          setSignaturePositions(
            signatureFields.map(({ page, left, top, width, height }) => {
              const scaledHeight = height < 50 ? 50 : height;
              const scaledWidth = (scaledHeight * signWidth) / signHeight;

              return {
                page,
                left: left + (width - scaledWidth) / 2,
                top: top + height - scaledHeight,
                width: scaledWidth,
                height: scaledHeight,
              };
            })
          );
        };
      })();
    }
  }, [file, signature]);

  async function savePDFWithSignatures() {
    const pdfBytes = await file.arrayBuffer();
    const signatureBytes = await signature.arrayBuffer();
    if (pdfBytes && signatureBytes) {
      const pdfDoc = await PDFDocument.load(pdfBytes);
      const signImage = await pdfDoc.embedPng(signatureBytes);

      // TODO: Refine this logic later on.
      const form = pdfDoc.getForm();
      const fields = form.getFields();
      fields.forEach((field) => {
        if (field.getName().toLowerCase().includes("sign")) {
          field.enableReadOnly();
        }
      });

      const pageHeight = pdfDoc.getPage(0).getHeight();
      signaturePositions.forEach(
        ({ page, left, top, width, height, translateX, translateY }) => {
          pdfDoc.getPage(page - 1).drawImage(signImage, {
            x: left + (translateX || 0),
            y: pageHeight - (top + height + (translateY || 0)),
            width,
            height,
          });
        }
      );

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
      <button onClick={savePDFWithSignatures}>Save</button>
      <PDFEditor
        file={file}
        signature={signature}
        positions={signaturePositions}
        onPositionsChange={setSignaturePositions}
      />
    </div>
  );
}

export default ESignPDF;
