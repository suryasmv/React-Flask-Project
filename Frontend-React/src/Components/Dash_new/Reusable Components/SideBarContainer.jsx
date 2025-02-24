import React, { useState, useEffect } from "react";
import "./SideBarContainer.css"; // Import the CSS file

const SideBarContainer = ({
  visibleleft,
  setVisibleleft,
  sidebarprefer,
  handleSingleCodnition,
  submittedConditions,
  setSubmittedConditions, // Ensure this is passed from parent
  removedCondition,
  selectedPatient, // Pass selectedPatient as a prop
}) => {
  const [selectedPreference, setSelectedPreference] = useState(null);

  useEffect(() => {
    // Reset selected preference and submitted conditions when patient changes
    setSelectedPreference(null);
    setSubmittedConditions([]); // Reset submitted conditions here
  }, [selectedPatient]);

  const handleClick = (title) => {
    setSelectedPreference(title);
    handleSingleCodnition(title);
  };

  return (
    <div className={`sidebar-container ${visibleleft ? "visible" : ""}`}>
      <div
        className="sidebar-content"
        style={{
          width: "100%",
          display: "flex",
          flexWrap: "wrap",
          justifyContent: "center",
        }}
      >
        {sidebarprefer.map((preference, index) => (
          <button
            key={index}
            className={`sidebar-button ${
              selectedPreference === preference.title ? "selected" : ""
            } ${
              submittedConditions.includes(preference.title) ? "submitted" : ""
            }`}
            onClick={() => handleClick(preference.title)}
          >
            <img
              src={preference.icon}
              className="condition-icons"
              alt={preference.title}
            />
            <span
              style={{
                width: "100%",
                wordWrap: "break-word",
                textAlign: "center",
              }}
            >
              {preference.title}
            </span>
          </button>
        ))}
      </div>
    </div>
  );
};

export default SideBarContainer;