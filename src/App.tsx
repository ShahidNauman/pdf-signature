import React, { useEffect, useState } from "react";
import ESignPDF from "./components/esign-pdf/ESignPDF";
import FileUploader from "./FileUploader";

// const signatureImageUrl =
//   "https://www.signwell.com/assets/vip-signatures/muhammad-ali-signature-3f9237f6fc48c3a04ba083117948e16ee7968aae521ae4ccebdfb8f22596ad22.svg";
// const signatureImageUrl =
//   "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQXQ4S4XkfGN-JDeqJqhzRCY0GqraBNfVup9wKozZKl4Q&s";
const signatureImageUrl = require("./assets/images/signature.png");

function App() {
  const [selectedPDF, setSelectedPDF] = useState<File>();
  const [selectedSignature, setSelectedSignature] = useState<File>();

  useEffect(() => {
    if (!selectedSignature) {
      (async function () {
        try {
          const response = await fetch(signatureImageUrl);
          const blob = await response.blob();
          const filename =
            signatureImageUrl.split("/").pop() ||
            `uploaded_${new Date().getTime()}`;

          const signatureImage = new File([blob], filename, {
            type: blob.type,
          });
          setSelectedSignature(signatureImage);
        } catch (error) {
          console.error(error);
        }
      })();
    }
  }, [selectedSignature]);

  return (
    <div>
      <FileUploader onFileSelect={setSelectedPDF} />
      {selectedPDF && selectedSignature && (
        <ESignPDF file={selectedPDF} signature={selectedSignature} />
      )}
    </div>
  );
}

export default App;
