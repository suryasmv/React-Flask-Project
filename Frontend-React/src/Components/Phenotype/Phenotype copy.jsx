import React, { useState } from "react";
import GoogleDrivePicker from "google-drive-picker";
import { Button } from "primereact/button";
import "./Phenotype.css";

function App() {
  const [authToken, setAuthToken] = useState("");
  const [openPicker] = GoogleDrivePicker({ viewMimeTypes: "application/pdf" });
  const [fileSelection, setFileSelection] = useState([null, null, null]);
  const [pdfCount, setPdfCount] = useState(1);

  const handleOpenPicker = (index) => {
    openPicker({
      clientId:
        "495587796363-prf3o1372ce2e1bf67cflu7kn4h0hdrg.apps.googleusercontent.com",
      developerKey: "AIzaSyBTILom7XmvEx6UyVAztR4Kh4nkuiSjhSo",
      viewId: "FOLDERS" | "PDFS",
      token: authToken,
      showUploadView: false,
      showUploadFolders: false,
      supportDrives: true,
      multiselect: false,
      customScopes: ["https://www.googleapis.com/auth/drive.readonly"],
      callbackFunction: (data) => {
        if (data.docs && data.docs.length > 0) {
          const updatedFiles = [...fileSelection];
          updatedFiles[index] = data.docs[0];
          setFileSelection(updatedFiles);
        } else if (data.action === "cancel") {
          ("User clicked cancel/close button");
        }
      },
    });
  };

  const handlePdfCountChange = (e) => {
    const count = Math.min(Math.max(parseInt(e.target.value) || 1, 1), 3); // Limit between 1 and 3
    setPdfCount(count);
    setFileSelection(
      fileSelection.map((file, index) => (index < count ? file : null))
    );
  };

  return (
    <div className="phenotype">
      <div className="control-panel">
        <label htmlFor="pdf-count">Number of PDFs to view (1-3):</label>
        <input
          id="pdf-count"
          type="number"
          min="1"
          max="3"
          value={pdfCount}
          onChange={handlePdfCountChange}
          className="pdf-count-input"
        />
      </div>
      <div className="pdf-selectors">
        {Array.from({ length: pdfCount }).map((_, index) => (
          <div key={index} className="pdf-selector">
            <Button
              label={`Select File ${index + 1}`}
              onClick={() => handleOpenPicker(index)}
              className="select-button"
            />
            {fileSelection[index] && (
              <div className="selected-file">
                <p>{fileSelection[index]?.name}</p>
              </div>
            )}
          </div>
        ))}
      </div>
      <div className="pdf-viewer-container">
        {fileSelection.slice(0, pdfCount).map((file, index) =>
          file ? (
            <iframe
              key={index}
              src={file.embedUrl}
              title={`PDF Viewer ${index}`}
              className="pdf-viewer"
            />
          ) : (
            <div key={index} className="pdf-placeholder">
              <p>Select a file to view</p>
            </div>
          )
        )}
      </div>
    </div>
  );
}

export default App;
