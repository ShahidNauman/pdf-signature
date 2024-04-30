import React, { useEffect, useState } from "react";
import ESignPDF from "./components/esign-pdf/ESignPDF";
import FileUploader from "./FileUploader";

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
