import React, { useEffect, useState } from "react";
import { PDFDocument } from "pdf-lib";

type SignaturePosition = {
  page: number;
  x: number;
  y: number;
  width: number;
  height?: number;
};

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
  const [pdfBytes, setPDFBytes] = useState<string | ArrayBuffer | Uint8Array>();
  const [signatureBytes, setSignatureBytes] = useState<
    string | ArrayBuffer | Uint8Array
  >();
  const [positions, setPositions] = useState<SignaturePosition[]>([]);

  function getArrayBuffer(file: File): Promise<string | ArrayBuffer | null> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = function (e) {
        if (e.target?.readyState === FileReader.DONE) {
          resolve(e.target.result);
        } else {
          reject(new Error("Failed to read the file."));
        }
      };
      reader.readAsArrayBuffer(file);
    });
  }

  useEffect(() => {
    if (file) {
      (async () => {
        const thisPDFBytes = await getArrayBuffer(file);
        if (thisPDFBytes) {
          setPDFBytes(thisPDFBytes);
        }

        const thisSignatureBytes = await getArrayBuffer(signature);
        if (thisSignatureBytes) {
          setSignatureBytes(thisSignatureBytes);
        }

        if (thisPDFBytes && thisSignatureBytes) {
          setPositions([
            { page: 1, x: 100, y: 200, width: 100 },
            { page: 1, x: 100, y: 150, width: 100 },
            { page: 1, x: 100, y: 100, width: 100 },
          ]);
        }
      })();
    }
  }, [file, signature]);

  async function savePDFWithSigns() {
    if (pdfBytes && signatureBytes) {
      const pdfDoc = await PDFDocument.load(pdfBytes);
      const sigImage = await pdfDoc.embedPng(signatureBytes);

      pdfDoc.getPages().forEach((aPage, index) => {
        const { width: sigWidth, height: sigHeight } = sigImage;

        positions
          .filter((p) => p.page === index + 1)
          .forEach(({ x, y, width, height }) => {
            // const { width: pageWidth, height: pageHeight } = aPage.getSize();
            // if (x + sigWidth > pageWidth || y + sigHeight > pageHeight) {
            //   throw new Error(
            //     "Signature image is too large for the specified position."
            //   );
            // }

            const scale = width / sigWidth;
            const scaledHeight = sigHeight * scale;

            aPage.drawImage(sigImage, {
              x,
              y,
              width: width,
              height: height ?? scaledHeight,
            });
          });
      });

      const savedPDFBytes = await pdfDoc.save();

      const url = URL.createObjectURL(
        new Blob([savedPDFBytes], { type: "application/pdf" })
      );

      const link = document.createElement("a");
      link.href = url;
      link.download = file.name + ".pdf";
      link.click();

      // Use the URL to display the PDF in your React component
      // (e.g., using an object URL and anchor tag)
    }
  }

  return (
    <div className={`${className}`} {...props}>
      <button onClick={savePDFWithSigns}>Save</button>
    </div>
  );
}

export default ESignPDF;
