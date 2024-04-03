import React, { useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";

import "./App.css";
import PDFViewer from "./components/PDFViewer";
import FileUploader from "./FileUploader";
import Header from "./components/Header";

function App() {
  const [selectedFile, setSelectedFile] = useState(null);

  const handleFileSelect = (file) => {
    setSelectedFile(file);
  };
  // const signatureImageUrl = 'https://www.signwell.com/assets/vip-signatures/muhammad-ali-signature-3f9237f6fc48c3a04ba083117948e16ee7968aae521ae4ccebdfb8f22596ad22.svg';
  const signatureImageUrl =
    "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQXQ4S4XkfGN-JDeqJqhzRCY0GqraBNfVup9wKozZKl4Q&s";

  return (
    <div className="App">
      <Header />
      <FileUploader onFileSelect={handleFileSelect} />
      {selectedFile && (
        <PDFViewer file={selectedFile} signatureImage={signatureImageUrl} />
      )}
    </div>
  );
}

export default App;
