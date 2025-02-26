import React, { useState, useEffect } from "react";
import { Button } from "primereact/button";
import Phenotype from "../../Phenotype/Phenotype"; // Assuming Phenotype component is in a separate file
import { MdLocalHospital } from "react-icons/md";
import { TbDna2Off } from "react-icons/tb";
import { MdOutlineMood } from "react-icons/md";
import { TbMoodConfuzed } from "react-icons/tb";
import { TbMoodEmpty } from "react-icons/tb";
import { TbMoodSad } from "react-icons/tb";
import "./MainContentData.css";
import fullScreenIcon from "../fullscreen.svg";
import exitFullScreenIcon from "../fullscreen-exit.svg";
import FullScreenView from "./FullScreenExcel";
import AIscore from "./AIscore";

const MainContentData = ({
  selectedCondition,
  setSelectedCondition,
  submittedData,
  setSubmittedData,
  handleSeverityClick,
  handleSeveritySubmit,
  RenderTabViewContent,
  selectedPatient,
  aiScore,
  reason,
  setReason,
  setAiScore,
  selectedBatch,
  concernChecked, // Receive concernChecked state
  setConcernChecked, // Receive setConcernChecked function
}) => {
  const [isFullScreen, setIsFullScreen] = useState(false);
  const [conditionValue, setConditionValue] = useState(null);

  useEffect(() => {
    if (selectedPatient && selectedBatch && selectedCondition) {
      fetch(
        `http://127.0.0.1:5000/json/${selectedBatch}/${selectedPatient}/Concern`,
        {
          method: "GET",
          headers: {
            BATCH: selectedBatch,
            PATIENTNAME: selectedPatient,
          },
        }
      )
        .then((response) => response.json())
        .then((data) => {
          console.log("Fetched patient condition data:", data); // Debugging
          console.log("Available keys:", Object.keys(data)); // Debugging keys
          setConditionValue(data[selectedCondition] || null);
          setConcernChecked(data[selectedCondition] === "Yes");
        })
        .catch((error) =>
          console.error("Error fetching condition data:", error)
        );
    }
  }, [selectedPatient, selectedBatch, selectedCondition]);

  const getConcernButtonColor = () => {
    console.log(`Condition Value for ${selectedCondition}:`, conditionValue); // Debugging

    if (
      submittedData.some(
        (entry) =>
          entry.condition === selectedCondition && entry.Concern === "Y"
      )
    ) {
      return "red";
    }

    return conditionValue === "Yes" ? "green" : "initial";
  };

  const toggleFullScreen = () => {
    setIsFullScreen(!isFullScreen); // Toggle fullscreen state
  };

  const handleConcernChange = () => {
    setConcernChecked(!concernChecked);
  };

  return (
    <div className="main-layout" style={{ overflowY: "hidden" }}>
      {/* Main Content Area */}
      <div className="main-content-container">
        <div className="main-heading-content">
          <div className="main-fullscreen">
            {/* Heading */}
            <h1 className="conditiontitle">
              {selectedCondition ? selectedCondition.replace(/_/g, " ") : " "}
            </h1>

            <AIscore
              selectedPatient={selectedPatient}
              selectedConditon={selectedCondition}
              severity={
                submittedData.find(
                  (entry) => entry.condition === selectedCondition
                )?.severity || ""
              }
              handleSeverityClick={handleSeverityClick}
              aiScore={aiScore}
              setAiScore={setAiScore}
              reason={reason}
              setReason={setReason}
              selectedBatch={selectedBatch}
            />

            <FullScreenView
              isFullScreen={isFullScreen}
              toggleFullScreen={toggleFullScreen}
              submittedData={submittedData}
              selectedCondition={selectedCondition}
              handleSeverityClick={handleSeverityClick}
              RenderTabViewContent={RenderTabViewContent}
              aiScore={aiScore}
              reason={reason}
              getConcernButtonColor={() =>
                concernChecked ? "green" : "initial"
              }
            />
          </div>

          {/* Concern and No Mutation Buttons */}
          <div className="extra-buttons-style">
            <Button
              style={{
                fontSize: "1rem",
                padding: "0.3rem 0.5rem",
                fontWeight: "extra-bold",
                color: concernChecked ? "red" : "black",
                accentColor: concernChecked ? "red" : "",
              }}
              onClick={handleConcernChange}
            >
              <label
                style={{ display: "flex", alignItems: "center", margin: 0 }}
              >
                <input
                  type="checkbox"
                  checked={concernChecked}
                  onChange={handleConcernChange}
                  style={{
                    marginRight: "0.5rem",
                    width: "18px", // Adjust checkbox width
                    height: "18px", // Adjust checkbox height
                  }}
                />
                Concern
              </label>
            </Button>
            <Button
              style={{
                fontSize: "0.8rem",
                padding: "0.3rem 0.5rem",
                color: "black",
                backgroundColor: submittedData.find(
                  (entry) =>
                    entry.condition === selectedCondition &&
                    entry.NoMutation === "y"
                )
                  ? "red"
                  : "initial",
              }}
              onClick={() => handleSeverityClick(null, "NoMutation")}
              onMouseEnter={(e) => {
                e.currentTarget.querySelector("p").style.color = "red";
                e.currentTarget.querySelector("svg").style.color = "red";
                // const button = document.getElementById("concernButton");
                // button.style.backgroundColor = "initial";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.querySelector("p").style.color = "initial";
                e.currentTarget.querySelector("svg").style.color = "initial";
              }}
            >
              <p style={{ margin: 0 }}>No Mutation</p>
              <TbDna2Off />
            </Button>
          </div>
        </div>

        {/* Severity Buttons */}
        <div className="severity-buttons" style={{ margin: "1rem 0" }}>
          <Button
            style={{
              fontSize: "0.8rem",
              padding: "0.3rem 0.5rem",
              backgroundColor: submittedData.find(
                (entry) =>
                  entry.condition === selectedCondition &&
                  entry.severity === "Low"
              )
                ? "green"
                : "initial",
            }}
            onClick={() => handleSeverityClick("Low", "severity")}
            onMouseEnter={(e) => {
              e.currentTarget.querySelector("p").style.color = "green";
              e.currentTarget.querySelector("svg").style.color = "green";
              // const button = document.getElementById("concernButton");
              // button.style.backgroundColor = "initial";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.querySelector("p").style.color = "initial";
              e.currentTarget.querySelector("svg").style.color = "initial";
            }}
          >
            <p style={{ margin: 0 }}>Low</p>
            <MdOutlineMood />
          </Button>
          <Button
            style={{
              fontSize: "0.8rem",
              padding: "0.3rem 0.5rem",
              backgroundColor: submittedData.find(
                (entry) =>
                  entry.condition === selectedCondition &&
                  entry.severity === "Mild"
              )
                ? "yellow"
                : "initial",
            }}
            onClick={() => handleSeverityClick("Mild", "severity")}
            onMouseEnter={(e) => {
              e.currentTarget.querySelector("p").style.color = "#FFD700";
              e.currentTarget.querySelector("svg").style.color = "#FFD700";
              // const button = document.getElementById("concernButton");
              // button.style.backgroundColor = "initial";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.querySelector("p").style.color = "initial";
              e.currentTarget.querySelector("svg").style.color = "initial";
            }}
          >
            <p style={{ margin: 0 }}>Mild</p>
            <TbMoodConfuzed />
          </Button>
          <Button
            style={{
              fontSize: "0.8rem",
              padding: "0.3rem 0.5rem",
              backgroundColor: submittedData.find(
                (entry) =>
                  entry.condition === selectedCondition &&
                  entry.severity === "Moderate"
              )
                ? "orange"
                : "initial",
            }}
            onClick={() => handleSeverityClick("Moderate", "severity")}
            onMouseEnter={(e) => {
              e.currentTarget.querySelector("p").style.color = "orange";
              e.currentTarget.querySelector("svg").style.color = "orange";
              // const button = document.getElementById("concernButton");
              // button.style.backgroundColor = "initial";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.querySelector("p").style.color = "initial";
              e.currentTarget.querySelector("svg").style.color = "initial";
            }}
          >
            <p style={{ margin: 0 }}>Moderate</p>
            <TbMoodEmpty />
          </Button>
          <Button
            style={{
              fontSize: "0.8rem",
              padding: "0.3rem 0.5rem",
              backgroundColor: submittedData.find(
                (entry) =>
                  entry.condition === selectedCondition &&
                  entry.severity === "Moderate to High"
              )
                ? "red"
                : "initial",
            }}
            onClick={() => handleSeverityClick("Moderate to High", "severity")}
            onMouseEnter={(e) => {
              e.currentTarget.querySelector("p").style.color = "red";
              e.currentTarget.querySelector("svg").style.color = "red";
              // const button = document.getElementById("concernButton");
              // button.style.backgroundColor = "initial";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.querySelector("p").style.color = "initial";
              e.currentTarget.querySelector("svg").style.color = "initial";
            }}
          >
            <p style={{ margin: 0 }}>Moderate to High</p>
            <TbMoodSad />
          </Button>
        </div>

        {/* Render Tab View Content */}
        <div
          style={{ maxHeight: "400px", overflowY: "auto", fontSize: "0.9rem" }}
        >
          <RenderTabViewContent
            selectedCondition={selectedCondition}
            setSelectedCondition={setSelectedCondition}
          />
        </div>
      </div>
    </div>
  );
};

export default MainContentData;
