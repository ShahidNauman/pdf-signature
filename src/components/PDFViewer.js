import React, { useCallback, useEffect, useRef, useState } from "react";
import * as pdfjs from "pdfjs-dist";
import Modal from "react-modal";
import SignaturePad from "./Signaturepad";

// import jsPDF from "jspdf"; // Import the jsPDF library
// const fs = require('fs');

pdfjs.GlobalWorkerOptions.workerSrc = `${process.env.PUBLIC_URL}/pdf.worker.min.js`;

/**
 * PDFViewer component displays a PDF file and allows the user to interact with it.
 * @param {Object} props - The component props.
 * @param {File} props.file - The PDF file to be displayed.
 * @param {string} props.signatureImage - The URL of the signature image.
 * @returns {JSX.Element} The PDFViewer component.
 */
const PDFViewer = ({ file, signatureImage }) => {
  const containerRef = useRef();
  const [scale, setScale] = useState(1.5);
  const [drawing, setDrawing] = useState(false);

  /**
   * Draws a rectangle on the canvas.
   * @param {Array} rectangle - The rectangle coordinates [x1, y1, x2, y2].
   * @param {CanvasRenderingContext2D} context - The canvas rendering context.
   * @param {PDFPageViewport} viewport - The viewport of the PDF page.
   * @param {string} borderColor - The color of the rectangle border.
   * @param {number} lineWidth - The width of the rectangle border.
   */
  const drawRectangle = useCallback(
    (rectangle, context, viewport, borderColor, lineWidth) => {
      const rect = viewport.convertToViewportRectangle(rectangle);
      context.strokeStyle = borderColor;

      context.lineWidth = lineWidth;
      context.strokeRect(
        rect[0],
        rect[1],
        rect[2] - rect[0],
        rect[3] - rect[1]
      );
    },
    []
  );

  /**
   * Draws the signature image on the canvas.
   * @param {string} image - The URL of the signature image.
   * @param {HTMLCanvasElement} canvas - The canvas element.
   * @param {Array} rect - The rectangle coordinates [x1, y1, x2, y2].
   * @param {PDFPageViewport} viewport - The viewport of the PDF page.
   * @param {CanvasRenderingContext2D} context - The canvas rendering context.
   */
  const drawSignatureImage = useCallback(
    (image, canvas, rect, viewport, context) => {
      const rectViewport = viewport.convertToViewportRectangle(rect);
      const imageObj = new Image();
      imageObj.src = image;
      imageObj.onload = () => {
        const scaleFactorX =
          (rectViewport[2] - rectViewport[0]) / imageObj.width;
        const scaleFactorY =
          (rectViewport[3] - rectViewport[1]) / imageObj.height;
        const scaledImageWidth = imageObj.width * scaleFactorX;
        const scaledImageHeight = imageObj.height * scaleFactorY;
        const offsetX = rectViewport[0];
        const offsetY = rectViewport[1];
        context.drawImage(
          imageObj,
          offsetX,
          offsetY,
          scaledImageWidth,
          scaledImageHeight
        );
      };
    },
    []
  );

  /**
   * Adds the page number to the canvas.
   * @param {HTMLCanvasElement} canvas - The canvas element.
   * @param {number} pageNum - The page number.
   */
  const pageNumber = useCallback((canvas, pageNum) => {
    // Add page number
    const pageNumberSpan = document.createElement('span');
    pageNumberSpan.textContent = pageNum;
    pageNumberSpan.classList.add('page-number');
    // console.log(pageNumberSpan);
    canvas.appendChild(pageNumberSpan);
  }, []);

  /**
   * Saves the modified PDF as a downloadable file.
   */
  // const savePdf = useCallback(() => { 
  //   const canvas = containerRef.current.querySelector("canvas");
  //   const imgData = canvas.toDataURL("image/png");

  //   const pdf = new jsPDF(); // Create a new instance of jsPDF

  //   pdf.addImage(imgData, "PNG", 0, 0);
  //   pdf.save("download.pdf");
  // }, []);


  // Function to save offsetX and offsetY values to an XML file
  // const saveToXML = (offsetX, offsetY) => {
  //   // Create an XML string representing the data
  //   const xmlData = `
  //     <signatureData>
  //       <offsetX>${offsetX}</offsetX>
  //       <offsetY>${offsetY}</offsetY>
  //     </signatureData>
  //   `;

  //   // Write the XML data to a file
  //   fs.writeFile('signature.xml', xmlData, (err) => {
  //     if (err) {
  //       console.error('Error saving data to XML:', err);
  //     } else {
  //       console.log('Data saved to signature.xml');
  //     }
  //   });
  // }; 

  /**
   * Renders the PDF file and its annotations.
   */
  const renderPDF = useCallback(async () => {
    if (!file) return;

    const pdfData = await file.arrayBuffer();
    const pdf = await pdfjs.getDocument(pdfData).promise;

    containerRef.current.innerHTML = "";

    for (let i = 1; i <= pdf.numPages; i++) {
      const page = await pdf.getPage(i);
      const viewport = page.getViewport({ scale });
      const canvas = document.createElement("canvas");
      const context = canvas.getContext("2d");
      canvas.height = viewport.height;
      canvas.width = viewport.width;
      const renderContext = { canvasContext: context, viewport };
      await page.render(renderContext).promise;
      containerRef.current.appendChild(canvas);

      const annotations = await page.getAnnotations();
      annotations.forEach((annotation) => {
        if (annotation.subtype === "Widget") {
          const fieldName = annotation.fieldName
            ? annotation.fieldName.toLowerCase()
            : "";
          const fieldType = annotation.fieldType;
          if (fieldName.includes("signature") || fieldType === "Widget") {
            drawRectangle(annotation.rect, context, viewport, "black", 2);
            drawSignatureImage(
              signatureImage,
              canvas,
              annotation.rect,
              viewport,
              context
            );
          } else if (fieldType === "Tx" || fieldType === "Widget") {
            drawRectangle(annotation.rect, context, viewport, "red", 2);
          }
        }
        pageNumber(canvas, i);
        canvas.classList.add("pdf-page");
      });
    }
  }, [file, scale, signatureImage, drawRectangle, drawSignatureImage]);

  useEffect(() => {
    renderPDF();
  }, [renderPDF]);

  /**
   * Handles the zooming of the PDF.
   * @param {number} factor - The zoom factor.
   */
  const handleZoom = (factor) => {
    setScale((prevScale) => prevScale * factor);
  };

  const [isModalOpen, setIsModalOpen] = useState(false);

  const openModal = () => {
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  const handleMouseDown = (e) => {
    setDrawing(true);
    const canvas = containerRef.current.querySelector("canvas:last-child");
    const context = canvas.getContext("2d");
    context.beginPath();
    const { offsetX, offsetY } = e.nativeEvent;
    context.moveTo(offsetX, offsetY);
  };
  const mouseData = []; // Array to store the mouse data
  const handleMouseMove = (e) => {
    if (!drawing) return;
    console.log("Drawing is true")
    const canvas = containerRef.current.querySelector("canvas:last-child");
    const context = canvas.getContext("2d");
    const { offsetX, offsetY } = e.nativeEvent;
    context.lineTo(offsetX, offsetY);
    context.stroke();
    // saveToXML(offsetX, offsetY);
    mouseData.push(offsetX, offsetY);
  };

  const handleMouseUp = () => {
    console.log(mouseData);
    setDrawing(false);
  };

  return (
    <>
      <div>
        <button onClick={openModal}>eSign</button>
        <Modal
          isOpen={isModalOpen}
          onRequestClose={closeModal}
          contentLabel="eSign Modal"
          ariaHideApp={false}
        >
          <button onClick={closeModal}>Close</button>
          <SignaturePad />
        </Modal>
        <div
          ref={containerRef}
          style={{ position: "relative" }}
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
        ></div>
        <div
          style={{
            position: "absolute",
            bottom: "0%",
            left: "50%",
            transform: "translate(-50%, 50%)",
          }}
        >
          <button className="btn btn-primary" onClick={() => handleZoom(1.1)}>
            Zoom In
          </button>
          <button className="btn btn-primary" onClick={() => handleZoom(0.9)}>
            Zoom Out
          </button>
          {/* <button className="btn btn-primary" onClick={savePdf}>
            Save PDF  
          </button> */}
        </div>
      </div>
    </>
  );
};

export default PDFViewer;
