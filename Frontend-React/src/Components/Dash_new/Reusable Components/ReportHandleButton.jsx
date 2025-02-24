import React, { useState } from "react";
import { Button } from "primereact/button";
import { Dialog } from "primereact/dialog";

const ReportHandleButton = ({
  submittedData,
  setSubmittedData, // ✅ Add setSubmittedData to update state
  handleRemove,
  handleDownload,
}) => {
  const [visibleData, setVisibleData] = useState(false);
  



  // ✅ Function to remove all submitted data after download
  const handleRemoveAll = () => {
    setSubmittedData([]); // Clears all submitted data
  };

  return (
    <div className="report-handle-button-container">
      {/* Report Button */}
      <div className="report_b">
        <Button onClick={() => setVisibleData(true)} label="Report" />
      </div>

      {/* Dialog Popup */}
      <Dialog
        header="Submitted Data"
        visible={visibleData}
        style={{ width: "60vw" }}
        onHide={() => setVisibleData(false)}
      >
        <div className="popup-content">
          {submittedData.length === 0 ? (
            <p>No data submitted yet.</p>
          ) : (
            <div
              style={{
                maxHeight: "400px",
                overflowY: "auto",
                fontSize: "0.9rem",
              }}
            >
              <table
                className="data-table"
                style={{ width: "100%", borderCollapse: "collapse" }}
              >
                <thead>
                  <tr>
                    <th style={{ border: "1px solid #ddd", padding: "8px" }}>
                      Condition
                    </th>
                    <th style={{ border: "1px solid #ddd", padding: "8px" }}>
                      Severity
                    </th>
                    <th style={{ border: "1px solid #ddd", padding: "8px" }}>
                      Concern
                    </th>
                    <th style={{ border: "1px solid #ddd", padding: "8px" }}>
                      No Mutation
                    </th>
                    <th style={{ border: "1px solid #ddd", padding: "8px" }}>
                      AI Score
                    </th>
                    <th style={{ border: "1px solid #ddd", padding: "8px" }}>
                      Reason
                    </th>
                    <th style={{ border: "1px solid #ddd", padding: "8px" }}>
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {submittedData.map((entry, index) => (
                    <tr key={index}>
                      <td style={{ border: "1px solid #ddd", padding: "8px" }}>
                        {entry.condition}
                      </td>
                      <td style={{ border: "1px solid #ddd", padding: "8px" }}>
                        {entry.severity}
                      </td>
                      <td style={{ border: "1px solid #ddd", padding: "8px" }}>
                        {entry.Concern || ""}
                      </td>
                      <td style={{ border: "1px solid #ddd", padding: "8px" }}>
                        {entry.NoMutation || ""}
                      </td>
                      <td style={{ border: "1px solid #ddd", padding: "8px" }}>
                        {entry.aiScore || "N/A"}
                      </td>
                      <td style={{ border: "1px solid #ddd", padding: "8px" }}>
                        {entry.reason || "N/A"}
                      </td>
                      <td
                        style={{
                          border: "1px solid #ddd",
                          padding: "8px",
                          textAlign: "center",
                        }}
                      >
                        <Button
                          label="Remove"
                          className="p-button-danger"
                          onClick={() => handleRemove(index)}
                        />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* ✅ Download Button - Clears Data After Download */}
        <div className="download-section">
          <Button
            label="Download"
            onClick={() => {
              handleDownload();
              handleRemoveAll(); // ✅ Clears all submitted data after download
            }}
          />
        </div>
      </Dialog>
    </div>
  );
};

export default ReportHandleButton;
