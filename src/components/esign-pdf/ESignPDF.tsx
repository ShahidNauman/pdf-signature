import { PDFDocument } from "pdf-lib";
import React, { useEffect, useState } from "react";
import type { SignatureField, SignaturePosition } from "./esign-pdf-types";
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
            signatureFields.map(({ page, x, y, width, height }) => {
              const scaledHeight = height < 50 ? 50 : height;
              const scaledWidth = (scaledHeight * signWidth) / signHeight;

              return {
                page,
                x: x + (width - scaledWidth) / 2,
                y,
                width: scaledWidth,
                height: scaledHeight,
              };
            })
          );
        };
      })();
    }
  }, [file, signature]);

  async function getSignatureFields(
    file: File,
    keyword: string
  ): Promise<SignatureField[]> {
    const pdfBytes = await file.arrayBuffer();
    const pdfDoc = await PDFDocument.load(pdfBytes);

    const fieldPositions: SignatureField[] = [];

    const form = pdfDoc.getForm();
    const fields = form.getFields();

    // Get the positions of all text fields
    fields.forEach((field) => {
      const widgets = field.acroField.getWidgets();
      const firstWidget = widgets[0]; // Assuming the field has at least one widget
      const fieldPosition = firstWidget.getRectangle();

      if (field.getName().toLowerCase().includes(keyword.toLowerCase())) {
        fieldPositions.push({ ...fieldPosition, page: 1, field });
      }
    });

    return fieldPositions;
  }

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

      signaturePositions.forEach(({ page, x, y, width, height }) => {
        pdfDoc.getPage(page - 1).drawImage(signImage, { x, y, width, height });
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
