import React, { useState } from "react";
import { Dialog } from "primereact/dialog";
import { Button } from "primereact/button";
import { X } from "lucide-react";

const MultiConditionButton = ({
  preferences,
  sensors,
  handleDragEnd,
  closestCorners,
  handleSubmit,
  RenderTabViewContent,
  selectedPatient,
  sidebarprefer = [],
  data,
  conditionsData,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedCond1, setSelectedCond1] = useState(null);
  const [selectedCond2, setSelectedCond2] = useState(null);

  return (
    <>
      {/* Open Button */}
      <Button
        onClick={() => {
          console.log("Opening Dialog, Selected Patient:", selectedPatient);
          selectedPatient && setIsOpen(true);
        }}
        label="Multi Conditions"
        disabled={!selectedPatient}
      />

      {/* Dialog Popup */}
      <Dialog
        header="Select Conditions"
        visible={isOpen}
        style={{ width: "100vw", height: "100vh" }}
        onHide={() => setIsOpen(false)}
      >
        {/* Close Button */}
        <Button
          icon={<X size={20} />}
          className="p-button-text p-button-rounded"
          onClick={() => setIsOpen(false)}
          style={{ position: "absolute", right: 20, top: 20 }}
        />

        <div style={{ display: "flex", width: "100%", height: "100%" }}>
          {/* Condition Selection Sections */}
          {[selectedCond1, selectedCond2].map((selectedCond, index) => (
            <div
              key={index}
              style={{
                width: "50%",
                padding: "16px",
                display: "flex",
                flexDirection: "column",
                overflowY: "auto",
              }}
            >
              <label
                style={{
                  display: "block",
                  fontSize: "14px",
                  fontWeight: "500",
                  marginBottom: "8px",
                }}
              >
                Choose Condition {index + 1}
              </label>
              <select
                style={{
                  width: "100%",
                  padding: "8px",
                  border: "1px solid #ddd",
                  borderRadius: "4px",
                  marginBottom: "16px",
                }}
                value={selectedCond ? selectedCond.id : ""}
                onChange={(e) => {
                  const selected = sidebarprefer.find(
                    (pref) => pref.id.toString() === e.target.value
                  );
                  console.log(`Selected Condition ${index + 1}:`, selected);
                  index === 0 ? setSelectedCond1(selected) : setSelectedCond2(selected);
                }}
              >
                <option value="">Select</option>
                {sidebarprefer.map((preference) => (
                  <option key={preference.id} value={preference.id}>
                    {preference.title}
                  </option>
                ))}
              </select>

              <div
                style={{
                  maxHeight: "100%",
                  overflowY: "auto",
                  fontSize: "0.9rem",
                  padding: "10px",
                  backgroundColor: "#f9f9f9",
                }}
              >
                {selectedCond ? (
                  <div>
                    <h3 style={{ marginBottom: "8px", color: "#333" }}>{selectedCond.title}</h3>
                    <div
                      style={{
                        border: "1px solid #ddd",
                        padding: "8px",
                        borderRadius: "5px",
                      }}
                    >
                      {RenderTabViewContent && typeof RenderTabViewContent === "function" ? (
                        <RenderTabViewContent
                          selectedCondition={selectedCond.title}
                          setSelectedCondition={index === 0 ? setSelectedCond1 : setSelectedCond2}
                        />
                      ) : (
                        <p style={{ color: "red" }}>Error: Invalid Content Renderer</p>
                      )}
                    </div>
                  </div>
                ) : (
                  <p style={{ color: "#888" }}>Select a condition to view details</p>
                )}
              </div>
            </div>
          ))}
        </div>
      </Dialog>
    </>
  );
};

export default MultiConditionButton;
