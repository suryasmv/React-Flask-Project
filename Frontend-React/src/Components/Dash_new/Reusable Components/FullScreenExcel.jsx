import React from "react";
import { Button } from "primereact/button";
import { MdOutlineMood, MdLocalHospital } from "react-icons/md";
import {
  TbMoodConfuzed,
  TbMoodEmpty,
  TbMoodSad,
  TbDna2Off,
} from "react-icons/tb";
import fullScreenIcon from "../fullscreen.svg";
import exitFullScreenIcon from "../fullscreen-exit.svg";

const FullScreenView = ({
  isFullScreen,
  toggleFullScreen,
  handleSeverityClick,
  selectedCondition,
  submittedData,
  RenderTabViewContent,
  getConcernButtonColor,
  setSelectedCondition,
}) => {
  const getButtonColor = (severity) => {
    const entry = submittedData.find(
      (entry) => entry.condition === selectedCondition
    );
    if (!entry) return "initial";
    switch (severity) {
      case "Low":
        return entry.severity === "Low" ? "green" : "initial";
      case "Mild":
        return entry.severity === "Mild" ? "#FFD700" : "initial";
      case "Moderate":
        return entry.severity === "Moderate" ? "orange" : "initial";
      case "Moderate to High":
        return entry.severity === "Moderate to High" ? "red" : "initial";
      case "Concern":
        return getConcernButtonColor(entry.Concern);
      case "NoMutation":
        return entry.NoMutation === "Y" ? "red" : "initial";
      default:
        return "initial";
    }
  };

  return (
    <div
      className="fullscreen"
      onClick={toggleFullScreen}
      style={{ cursor: "pointer" }}
    >
      <img
        src={isFullScreen ? exitFullScreenIcon : fullScreenIcon}
        alt={isFullScreen ? "Exit Fullscreen" : "Enter Fullscreen"}
        className="fullicon"
        style={{ width: "40px", height: "40px" }}
      />
      {isFullScreen && (
        <div
          style={{
            position: "fixed",
            top: "1%",
            left: "0%",
            width: "100%",
            height: "100%",
            backgroundColor: "#f9f9f9",
            borderRadius: "16px",
            boxShadow: "0px 6px 20px rgba(0, 0, 0, 0.3)",
            padding: "3px",
            zIndex: 1000,
            overflowY: "auto",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
          onClick={(e) => e.stopPropagation()}
        >
          <button
            onClick={toggleFullScreen}
            style={{
              position: "absolute",
              top: "15px",
              right: "15px",
              padding: "5px 5px",
              border: "none",
              borderRadius: "8px",
              backgroundColor: "red",
              color: "white",
              fontSize: "0.8rem",
              cursor: "pointer",
            }}
          >
            Close
          </button>

          {/* Severity and Concern Buttons */}
          <div
            className="severity-buttons"
            style={{
              display: "flex",
              justifyContent: "space-evenly",
              flexWrap: "wrap",
              marginBottom: "10px",
            }}
          >
            {["Low", "Mild", "Moderate", "Moderate to High"].map(
              (severity, idx) => {
                const icons = {
                  Low: <MdOutlineMood />,
                  Mild: <TbMoodConfuzed />,
                  Moderate: <TbMoodEmpty />,
                  "Moderate to High": <TbMoodSad />,
                };
                return (
                  <Button
                    key={idx}
                    style={{
                      backgroundColor: getButtonColor(severity),
                      minWidth: "120px",
                    }}
                    onClick={() => handleSeverityClick(severity, "severity")}
                    onMouseEnter={(e) => {
                      const pElement = e.currentTarget.querySelector("p");
                      const svgElement = e.currentTarget.querySelector("svg");
                      if (pElement)
                        pElement.style.color = getButtonColor(severity);
                      if (svgElement)
                        svgElement.style.color = getButtonColor(severity);
                    }}
                    onMouseLeave={(e) => {
                      const pElement = e.currentTarget.querySelector("p");
                      const svgElement = e.currentTarget.querySelector("svg");
                      if (pElement) pElement.style.color = "initial";
                      if (svgElement) svgElement.style.color = "initial";
                    }}
                  >
                    {icons[severity]} {severity}
                  </Button>
                );
              }
            )}
            <Button
              style={{
                backgroundColor: getButtonColor("Concern"),
                minWidth: "100px",
              }}
              onClick={() => handleSeverityClick(null, "Concern")}
              onMouseEnter={(e) => {
                const pElement = e.currentTarget.querySelector("p");
                const svgElement = e.currentTarget.querySelector("svg");
                if (pElement) pElement.style.color = getButtonColor("Concern");
                if (svgElement)
                  svgElement.style.color = getButtonColor("Concern");
              }}
              onMouseLeave={(e) => {
                const pElement = e.currentTarget.querySelector("p");
                const svgElement = e.currentTarget.querySelector("svg");
                if (pElement) pElement.style.color = "initial";
                if (svgElement) svgElement.style.color = "initial";
              }}
            >
              <MdLocalHospital /> Concern
            </Button>
            <Button
              style={{
                backgroundColor: getButtonColor("NoMutation"),
                minWidth: "100px",
              }}
              onClick={() => handleSeverityClick(null, "NoMutation")}
              onMouseEnter={(e) => {
                const pElement = e.currentTarget.querySelector("p");
                const svgElement = e.currentTarget.querySelector("svg");
                if (pElement)
                  pElement.style.color = getButtonColor("NoMutation");
                if (svgElement)
                  svgElement.style.color = getButtonColor("NoMutation");
              }}
              onMouseLeave={(e) => {
                const pElement = e.currentTarget.querySelector("p");
                const svgElement = e.currentTarget.querySelector("svg");
                if (pElement) pElement.style.color = "initial";
                if (svgElement) svgElement.style.color = "initial";
              }}
            >
              <TbDna2Off /> No Mutation
            </Button>
          </div>

          {/* Table Content */}
          <div style={{ width: "97%", overflowX: "auto", scrollHeight:"700px"}}>
            <div><RenderTabViewContent
            selectedCondition={selectedCondition}
            setSelectedCondition={setSelectedCondition}
          /></div>
          </div>
        </div>
      )}
    </div>
  );
};

export default FullScreenView;