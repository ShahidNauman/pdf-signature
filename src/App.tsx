import React, { useEffect, useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import ESignPDF from "./components/ESignPDF";
import Header from "./components/Header";
import PDFViewer from "./components/PDFViewer";
import FileUploader from "./FileUploader";
import "./App.css";

// const signatureImageUrl =
//   "https://www.signwell.com/assets/vip-signatures/muhammad-ali-signature-3f9237f6fc48c3a04ba083117948e16ee7968aae521ae4ccebdfb8f22596ad22.svg";
// const signatureImageUrl =
//   "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQXQ4S4XkfGN-JDeqJqhzRCY0GqraBNfVup9wKozZKl4Q&s";
const signatureImageUrl = require("./assets/images/signature.png");

function App() {
  const [selectedFile, setSelectedFile] = useState<File>();
  const [selectedSignature, setSelectedSignature] = useState<File>();

  useEffect(() => {
    (async function () {
      try {
        const response = await fetch(signatureImageUrl);
        if (!response.ok) {
          throw new Error(`Failed to download image: ${response.statusText}`);
        }

        const blob = await response.blob();
        const filename =
          signatureImageUrl.split("/").pop() ||
          `uploaded_${new Date().getTime()}`;

        const signatureImage = new File([blob], filename, { type: blob.type });
        setSelectedSignature(signatureImage);
      } catch (error) {
        console.error(error);
      }
    })();
  }, [selectedFile]);

  return (
    <div className="App">
      <Header />
      <FileUploader onFileSelect={setSelectedFile} />
      {selectedFile && selectedSignature && (
        <>
          <ESignPDF file={selectedFile} signature={selectedSignature} />
          <PDFViewer file={selectedFile} signatureImage={signatureImageUrl} />
        </>
      )}
    </div>
  );
}

export default App;
