// PDFViewer.js
import React, { useCallback, useEffect, useRef, useState } from "react";
import * as pdfjs from "pdfjs-dist";
import Modal from "react-modal";
import SignaturePad from "./Signaturepad";
import { drawRectangle, drawSignatureImage } from "../utils/drawingUtils";

pdfjs.GlobalWorkerOptions.workerSrc = `${process.env.PUBLIC_URL}/pdf.worker.min.js`;

const PDFViewer = ({ file, signatureImage }) => {
  const containerRef = useRef();
  const [scale, setScale] = useState(1.5); // Initial scale
  const [rotation, setRotation] = useState(0); // Initial rotation

  const renderPDF = useCallback(async () => {
    const pdfData = await file.arrayBuffer();
    const pdf = await pdfjs.getDocument(pdfData).promise;

    // Clear the container before rendering
    containerRef.current.innerHTML = "";
    const fields = [];
    // Loop through each page and render it
    for (let i = 1; i <= pdf.numPages; i++) {
      const page = await pdf.getPage(i);
      // const scale = 1.5;
      const viewport = page.getViewport({ scale });
      const canvas = document.createElement("canvas");
      const context = canvas.getContext("2d");
      canvas.height = viewport.height;
      canvas.width = viewport.width;
      const renderContext = {
        canvasContext: context,
        viewport: viewport,
      };
      await page.render(renderContext).promise;
      containerRef.current.appendChild(canvas);

      // Get annotations for the page
      const annotations = await page.getAnnotations();
      annotations.forEach((annotation) => {
        if (annotation.subtype === "Widget") {
          // Check if the annotation is a signature field
          const fieldName = (annotation.fieldName = annotation.fieldName || "");
          const fieldType = annotation.fieldType;
          if (
            fieldName.toLowerCase().includes("signature") ||
            fieldType === "Widget"
          ) {
            //   Draw a rectangle around the signature field
            drawRectangle(annotation.rect, context, viewport, "yellow", 2);
            //   Draw the signature image
            drawSignatureImage(
              signatureImage,
              canvas,
              annotation.rect,
              viewport,
              context
            );
          } else if (fieldType === "Tx" || fieldType === "Widget") {
            //   Draw a rectangle around the text field
            drawRectangle(annotation.rect, context, viewport, "red", 2);
          }
        }
      });
    }
  }, [file, scale, signatureImage]);

  useEffect(() => {
    if (file) {
      renderPDF();
    }
  }, [file, renderPDF]);

  const handleZoomIn = () => {
    setScale(scale * 1.1); // Increase scale by 10%
  };

  const handleZoomOut = () => {
    setScale(scale / 1.1); // Decrease scale by 10%
  };
  // const handleRotateClockwise = () => {
  //     setRotation((rotation + 90) % 360); // Rotate clockwise by 90 degrees
  // };

  // const handleRotateCounterClockwise = () => {
  //     setRotation((rotation - 90 + 360) % 360); // Rotate counterclockwise by 90 degrees
  // };
  const savePDF = async (pdfData, annotations) => {
    const mergedPdfData = mergeAnnotations(pdfData, annotations);
    const blob = new Blob([mergedPdfData], { type: "application/pdf" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "highlighted_pdf.pdf";
    link.click();
    URL.revokeObjectURL(url);
  };

  const mergeAnnotations = (pdfData, annotations) => {
    const pdf = new Uint8Array(pdfData);
    const data = new Uint8Array(pdf.length + annotations.length);
    data.set(pdf);
    data.set(annotations, pdf.length);
    return data;
  };

  // Signature Pad
  const [isModalOpen, setIsModalOpen] = useState(false);

  const openModal = () => {
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  return (
    <>
      <div>
        <button onClick={openModal}>eSign</button>
        <Modal
          isOpen={isModalOpen}
          onRequestClose={closeModal}
          contentLabel="eSign Modal"
          ariaHideApp={false} // This prevents the app from being hidden from screen readers when the modal is open
        >
          <button onClick={closeModal}>Close</button>
          <SignaturePad />
        </Modal>

        <div ref={containerRef} style={{ position: "relative" }}></div>
        <div
          style={{
            position: "absolute",
            bottom: "0%",
            left: "50%",
            transform: "translate(-50%, 50%)",
          }}
        >
          <button className="btn btn-primary" onClick={handleZoomIn}>
            Zoom In
          </button>
          <button className="btn btn-primary" onClick={handleZoomOut}>
            Zoom Out
          </button>
        </div>
      </div>
    </>
  );
};

export default PDFViewer;
