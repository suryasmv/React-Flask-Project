import React, { useState, useEffect, useRef } from "react";
import { Button } from "primereact/button";
import { InputText } from "primereact/inputtext";

const AIscore = ({
  selectedPatient,
  selectedConditon,
  severity,
  handleSeverityClick,
  reason,
  setReason,
  aiScore,
  setAiScore,
  concern,
  selectedBatch,
}) => {
  const [patientData, setPatientData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [showScore, setShowScore] = useState(false); // Toggle AI score visibility
  const reasonRef = useRef(null);

  useEffect(() => {
    if (selectedPatient) {
      setLoading(true);
      setError(null);

      fetch(
        `http://127.0.0.1:5000/json/${selectedBatch}/${selectedPatient}/AiScore`
      )
        .then((response) => response.json())
        .then((data) => {
          setPatientData(data);
          setAiScore(data ? data[selectedConditon] : null);
          setLoading(false);
        })
        .catch(() => {
          setError("Failed to fetch data");
          setLoading(false);
        });
    }
  }, [selectedPatient, selectedConditon, setAiScore]);

  useEffect(() => {
    // Reset showScore when selectedConditon or severity changes
    setShowScore(false);
  }, [selectedConditon, severity, selectedPatient]);

  const severityMismatch = severity && aiScore && severity !== aiScore;
  const shouldAutoSubmit = severity === aiScore; // Auto-submit condition

  const handleSubmit = () => {
    const enteredReason = reasonRef.current?.value || ""; // Ensure it starts as an empty string
    setReason(enteredReason);

    handleSeverityClick(selectedConditon, "reason", enteredReason);

    setIsSubmitted(true);
    if (reasonRef.current) {
      reasonRef.current.value = ""; // ✅ Clear input field after submit
    }
  };

  // ✅ Auto-submit if severity and concern match
  useEffect(() => {
    if (severity === aiScore) {
      setReason(""); // ✅ Ensure reason is empty before auto-submitting
      handleSubmit();
    }
  }, [severity, concern, aiScore]); // ✅ Runs when any of these change

  return (
    <div className="flex flex-col items-center">
      {/* ✅ Show loading and error inside JSX instead of returning early */}
      {loading && <div>Loading...</div>}
      {error && <div>{error}</div>}

      {/* ✅ AI Score Display Logic */}
      {!loading && !error && (
        <>
          {severityMismatch ? (
            // ✅ Always show AI Score if there's a mismatch
            <div
              style={{
                backgroundColor: "red",
                color: "white",
                padding: "8px",
                borderRadius: "4px",
                fontWeight: "bold",
                marginBottom: "8px",
              }}
            >
              AI Score: {aiScore}
            </div>
          ) : (
            // ✅ Click to show AI Score when it matches severity
            <Button
              style={{
                backgroundColor: "blue",
                color: "white",
              }}
              label={showScore ? `AI Score: ${aiScore}` : "AI Score"}
              className="mb-2"
              onClick={() => setShowScore((prev) => !prev)}
            />
          )}

          {/* ✅ Show Text Field & Submit Only If Needed */}
          {!shouldAutoSubmit && severityMismatch && (
            <div className="flex items-center gap-2">
              <InputText
                ref={reasonRef}
                placeholder="Enter reason"
                className="p-inputtext-sm mb-2"
              />
              <Button
                style={{
                  backgroundColor: isSubmitted ? "green" : "blue",
                  color: "white",
                }}
                label="Submit"
                onClick={handleSubmit}
              />
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default AIscore;
