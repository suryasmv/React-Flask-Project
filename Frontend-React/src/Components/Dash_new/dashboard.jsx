/* eslint-disable */
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  CSS,
  SortableContext,
  useSortable,
  Dialog,
  Sidebar,
  SvgImage,
  Card,
  TabView,
  TabPanel,
  Button,
  DataTable,
  Column,
  Dropdown,
  DndContext,
  KeyboardSensor,
  PointerSensor,
  TouchSensor,
  closestCorners,
  useSensor,
  useSensors,
  arrayMove,
  sortableKeyboardCoordinates,
} from "../Libraries/Libraries";
import * as XLSX from "xlsx";
//import conditionsData from "../../Conditions/Generated_output.json";
//import data from "../../Conditions/output.json";
// import reportconditions from "../../Conditions/report_Conditions.json";
import fullScreenIcon from "./fullscreen.svg";
import exitFullScreenIcon from "./fullscreen-exit.svg";
import { Navigate } from "../Libraries/Libraries";
import "./dashboard.css";
import DashboardSearch from "./Dash_search/DashboardSearch";
import Phenotype from "../../Components/Phenotype/Phenotype";
import MultiConditionButton from "./Reusable Components/MultiConditionButton";
import SideBarContainer from "./Reusable Components/SideBarContainer";
import MainContentData from "./Reusable Components/MainContentData";
import ReportHandleButton from "./Reusable Components/ReportHandleButton";

const Task = ({ id, title }) => {
  const { attribute, listeners, setNodeRef, transform, transition } =
    useSortable({ id });
  const style = {
    transition,
    transform: CSS.Transform.toString(transform),
  };
  return (
    <div className="task_multiplecard">
      <input
        type="checkbox"
        className="p-checkbox p-checkbox-box"
        name={title}
        id={title}
        style={{ padding: "0px" }}
      />
      <div ref={setNodeRef} {...attribute} {...listeners} style={style}>
        {title}
      </div>
    </div>
  );
};

const Dashboard = () => {
  const [isFullScreen, setIsFullScreen] = useState(false);
  const [selectedColumns, setSelectedColumns] = useState([]);
  const [cardsToDisplay, setCardsToDisplay] = useState(1);
  const [visibleRight, setVisibleRight] = useState(false);
  const [visibleleft, setVisibleleft] = useState(false);
  const [hovered, setHovered] = useState(false);
  const [selectedCondition, setSelectedCondition] = useState(null);
  const [isPhenotypeVisible, setPhenotypeVisible] = useState(true);
  const [aiScore, setAiScore] = useState();
  const [reason, setReason] = useState();
  const [submittedConditions, setSubmittedConditions] = useState([]); // Track submitted conditions
  const [removedCondition, setRemovedCondition] = useState(null);
  const [selectedBatch, setSelectedBatch] = useState("Batch1"); // Store selected batch
  const [submittedData, setSubmittedData] = useState([]);
  const [concernChecked, setConcernChecked] = useState(false); // Add concernChecked state

  useEffect(() => {
    const storedColumns = localStorage.getItem("selectedColumns");
    if (storedColumns) {
      setSelectedColumns(JSON.parse(storedColumns));
    }
  }, []);
  const prefered = JSON.parse(localStorage.getItem("preferences") || "[]");
  const [popupVisible, setPopupVisible] = useState(false);
  const [preferences, setPreferences] = useState(prefered);
  const [prefer, setPrefer] = useState(prefered);
  const [sidebarprefer, setsidebarPrefer] = useState(prefered);
  const [logout, setlogout] = useState(false);
  const [conditionsData, setConditionsData] = useState(null);
  const [data, setData] = useState(null);
  const [selectedPatient, setSelectedPatient] = useState(null);
  const [error, setError] = useState(null);

  const handleSelectPatient = (patient) => {
    setSelectedPatient(patient);
  };

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(TouchSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const getTaskPos = (id) => preferences.findIndex((task) => task.id === id);

  const handleDragEnd = (e) => {
    const { active, over } = e;
    if (active.id === over.id) return;
    setPreferences((preferences) => {
      const originalPos = getTaskPos(active.id);
      const newPos = getTaskPos(over.id);
      return arrayMove(preferences, originalPos, newPos);
    });
  };

  const navigate = useNavigate();

  const handlegotocol = () => {
    navigate("/columns_selection");
  };

  const pref = preferences;

  const values = [
    { name: "Low", code: "L" },
    { name: "Low to Mild", code: "LM" },
    { name: "Mild to Moderate", code: "MM" },
    { name: "Mild", code: "MIL" },
    { name: "Moderate", code: "MOD" },
    { name: "Moderate to High", code: "MOH" },
    { name: "High", code: "H" },
    { name: "No Mutations", code: "NM" },
    { name: "Fatigue 9. 28. 29.30 which to consider", code: "FTC" },
    { name: "Food Which other disease to consider", code: "FWC" },
  ];

  const handleSeverityClick = (level, property, value = "y") => {
    if (!selectedCondition) {
      alert("Please select a condition first!");
      return;
    }

    const existingIndex = submittedData.findIndex(
      (entry) => entry.condition === selectedCondition
    );

    if (existingIndex !== -1) {
      const updatedData = [...submittedData];
      if (property === "severity") {
        updatedData[existingIndex].severity = level;
        updatedData[existingIndex].aiScore = aiScore;
        updatedData[existingIndex].reason = "";
      } else {
        updatedData[existingIndex][property] =
          updatedData[existingIndex][property] === value ? "" : value;
      }
      updatedData[existingIndex].Concern = concernChecked ? "y" : ""; // Update concern based on checkbox state
      setSubmittedData(updatedData);
    } else {
      const newEntry = {
        condition: selectedCondition,
        severity: property === "severity" ? level : null,
        aiScore: aiScore,
        Concern: concernChecked ? "y" : "", // Add concern to new entry
        NoMutation: property === "NoMutation" ? "y" : "",
        Reason: property === "reason" ? value : "",
      };
      setSubmittedData([...submittedData, newEntry]);
    }

    if (!submittedConditions.includes(selectedCondition)) {
      setSubmittedConditions([...submittedConditions, selectedCondition]);
    }

    console.log(
      `Updated ${property} for ${selectedCondition}: ${
        level || value
      }, AI Score: ${aiScore}`
    );
  };

  const [severity, setSeverity] = useState(null); // Holds selected severity
  // Tracks all submissions

  // Function to remove a specific entry
  const handleRemove = (index) => {
    const updatedData = [...submittedData];
    const removed = updatedData.splice(index, 1)[0];
    setSubmittedData(updatedData);
    setRemovedCondition(removed.condition); // Set the removed condition
    setSubmittedConditions((prevConditions) =>
      prevConditions.filter((condition) => condition !== removed.condition)
    ); // Update submittedConditions state
  };

  const handleDownload = async () => {
    const headers = [
      "Medical Condition ",
      "Low",
      "Low to Mild",
      "Mild",
      "Mild to Moderate",
      "Moderate",
      "Moderate to High",
      "High",
      "concerns",
      "No Mutations",
      "AI Score",
      "Reason",
    ];

    const data = submittedData.map((entry) => ({
      condition: entry.condition,
      low: entry.severity === "Low" ? "y" : "",
      lowToMild: entry.severity === "Low to Mild" ? "y" : "",
      mild: entry.severity === "Mild" ? "y" : "",
      mildToModerate: entry.severity === "Mild to Moderate" ? "y" : "",
      moderate: entry.severity === "Moderate" ? "y" : "",
      moderateToHigh: entry.severity === "Moderate to High" ? "y" : "",
      high: entry.severity === "High" ? "y" : "",
      concern: entry.Concern || "",
      noMutation: entry.NoMutation || "",
      aiScore: entry.aiScore || "",
      reason: entry.reason || "",
    }));

    const response = await fetch("http://127.0.0.1:5000/excel-download", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ headers, data, selectedPatient, selectedBatch }),
    });

    if (!response.ok) throw new Error("Failed to generate Excel");

    // ✅ Show a simple popup notification
    console.log(selectedPatient);
    alert(`${selectedPatient}_Scoring_chart.xlsx has been saved to reports`);
  };

  // Function to fetch data from both APIs
  const fetchDataFromAPIs = async () => {
    try {
      // Fetch conditions data
      const responseConditionsData = await fetch(
        `http://127.0.0.1:5000/get-batch-data?batch_name=${selectedBatch}`
      );
      if (!responseConditionsData.ok) {
        throw new Error(`
          Error fetching conditionsData: ${responseConditionsData.statusText}
        `);
      }
      const conditionsJsonData = await responseConditionsData.json();
      setConditionsData(conditionsJsonData);

      // Fetch other data
      const responseData = await fetch(
        `http://127.0.0.1:5000/get-batch-data2?batch_name=${selectedBatch}`
      );
      if (!responseData.ok) {
        throw new Error(`Error fetching data: ${responseData.statusText}`);
      }
      const jsonData = await responseData.json();
      setData(jsonData);
    } catch (err) {
      setError(`Failed to fetch data: ${err.message}`);
    }
  };

  // UseEffect to call the fetchDataFromAPIs function when the component mounts
  useEffect(() => {
    fetchDataFromAPIs();
  }, []); // Ensuring this is only called once

  // Render loading, error, or the data
  if (error) {
    return <div>Error: {error}</div>;
  }

  if (conditionsData === null || data === null) {
    return (
      <div className="loading-container">
        <div className="loader"></div>
      </div>
    );
  }

  const RenderTabViewContent = ({
    selectedCondition,
    setSelectedCondition,
  }) => {
    let renderPatient = `${selectedPatient}.xlsx`;

    if (!renderPatient) return null; // Early exit if no patient is selected

    const patientData = data[renderPatient];

    const getCellStyle = (columnName, value) => {
      switch (columnName) {
        case "Zygosity":
          return value === "Homozygous Variant"
            ? { backgroundColor: "orange" }
            : {};
        case "clin sig":
          return value === "Uncertain Significance"
            ? { backgroundColor: "yellow" }
            : {};
        case "IMPACT":
          return value === "HIGH" ? { backgroundColor: "red" } : {};
        case "Lit":
          return value === "Yes"
            ? { backgroundColor: "green", color: "white" }
            : value === "No"
            ? { backgroundColor: "violet" }
            : {};
        default:
          return {};
      }
    };

    // Set a default condition if none is selected
    let conditionTitle = selectedCondition || preferences[0].title;
    if (!selectedCondition) {
      setSelectedCondition(conditionTitle);
    }

    const selectedPatientData = conditionsData.conditions[renderPatient];

    if (!selectedPatientData) {
      console.warn("No data available for the selected patient.");
      return <div>No data available for the selected patient.</div>;
    }

    const conditionData = selectedPatientData.subcategories.find(
      (subcategory) => subcategory.name === conditionTitle
    );

    if (!conditionData) {
      console.warn("No condition data available for the selected condition.");
      return <div>No condition data available for the selected condition.</div>;
    }

    return (
      <div>
        <TabView scrollable>
          {conditionData.subcategories.map((subcategory, index) => (
            <TabPanel
              key={index}
              header={
                <span style={{ fontSize: "14px", position: "sticky" }}>
                  {subcategory.name}
                </span>
              }
            >
              {subcategory.subtype ? (
                <TabView scrollable>
                  {subcategory.subtype.map((subtype, subtypeIndex) => (
                    <TabPanel
                      key={subtypeIndex}
                      header={
                        <span style={{ fontSize: "14px" }}>{subtype.name}</span>
                      }
                    >
                      <div className="datatable-container">
                        <DataTable
                          value={patientData?.conditions?.filter(
                            (item) =>
                              item.Headings === subcategory.name &&
                              item.Condition === subtype.name &&
                              item.subtype_cond === conditionTitle
                          )}
                          reorderableColumns
                          resizableColumns
                          className="doctor-datatable"
                          scrollable
                          scrollHeight="400px"
                          sortMode="multiple"
                          globalFilterFields={selectedColumns}
                          style={{
                            fontSize: "14px",
                            maxHeight: "1000px",
                            overflow: "auto",
                          }}
                        >
                          {selectedColumns.map((columnName, index) => (
                            <Column
                              key={index}
                              sortable
                              field={columnName}
                              header={
                                <div
                                  style={{
                                    whiteSpace: "normal",
                                    textAlign: "center",
                                    fontSize: "12px",
                                    fontWeight: "bold",
                                  }}
                                >
                                  {columnName.split(" ").map((part, i) => (
                                    <div key={i}>{part}</div>
                                  ))}
                                </div>
                              }
                              body={(rowData) => {
                                let content;
                                if (typeof rowData[columnName] === "string") {
                                  const names = rowData[columnName].split(",");
                                  content = names.map((name, i) => (
                                    <div key={i}>{name}</div>
                                  ));
                                } else if (
                                  typeof rowData[columnName] === "number"
                                ) {
                                  content = rowData[columnName];
                                } else {
                                  content = "";
                                }
                                return (
                                  <div
                                    style={{
                                      whiteSpace: "normal",
                                      textAlign: "left",
                                      fontSize: "14px",
                                      ...getCellStyle(
                                        columnName,
                                        rowData[columnName]
                                      ),
                                    }}
                                  >
                                    {content}
                                  </div>
                                );
                              }}
                              style={{ minWidth: "50px", textAlign: "center" }}
                            />
                          ))}
                        </DataTable>
                      </div>
                    </TabPanel>
                  ))}
                </TabView>
              ) : (
                <div>{subcategory.name}</div>
              )}
            </TabPanel>
          ))}
        </TabView>
      </div>
    );
  };

  if (logout) {
    return <Navigate to="/" />;
  }
  const handleSubmit = () => {
    const checkedPreferences = preferences.filter((task) => {
      const checkbox = document.getElementById(task.title);
      return checkbox.checked;
    });
    setPrefer(checkedPreferences);
    setPopupVisible(false);
    setCardsToDisplay(checkedPreferences.length);
    // (checkedPreferences)
  };
  // (prefer)

  const handleSingleCodnition = (selectedCondition) => {
    if (selectedCondition) {
      setCardsToDisplay(1);
      setSelectedCondition(selectedCondition);
      setVisibleleft(false);
    }
  };

  // const useFetchPatientNames = () => {
  //   const [patients, setPatients] = useState([]);

  //   // Function to fetch patient names
  //   const fetchPatientNames = async () => {
  //     try {
  //       const response = await fetch("http://127.0.0.1:5000/get-file-names");
  //       const data = await response.json();
  //       ("Fetched patient names:", data.file_names); // Debugging log
  //       setPatients(data.file_names || []); // Update patients dynamically
  //     } catch (error) {
  //       console.error("Error fetching patient names:", error);
  //     }
  //   };

  //   // Call the fetch function inside useEffect
  //   useEffect(() => {
  //     fetchPatientNames();
  //   }, []);

  //   return { patients, fetchPatientNames };
  // };

  // const { patients } = useFetchPatientNames();

  // const [patients, setPatients] = useState([]);
  // const PatientSearch = () => {

  //   useEffect(() => {
  //     // Fetch data from the API
  //     const fetchPatients = async () => {
  //       try {
  //         const response = await fetch("http://127.0.0.1:5000/get-file-names");
  //         if (!response.ok) {
  //           throw new Error("Failed to fetch patients");
  //         }
  //         const data = await response.json(); // Assuming the API returns JSON
  //         setPatients(data);
  //       } catch (error) {
  //         console.error("Error fetching patients:", error);
  //       }
  //     };

  //     fetchPatients();
  //   }, []); // Empty dependency array means this runs once when the component mounts
  // };

  const toggleFullScreen = () => {
    if (!isFullScreen) {
      document.documentElement.requestFullscreen();
    } else {
      document.exitFullscreen();
    }
    setIsFullScreen(!isFullScreen);
  };
  const handlelogout = () => {
    // Clear authentication-related cookies
    document.cookie =
      "accessToken=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
    document.cookie = "email=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";

    // Redirect to login page
    setlogout(true);
  };
  return (
    <div className="dashboard">
      <div className="card_navbar">
        <img src={SvgImage} alt="" />
        <DashboardSearch
          onSelectPatient={handleSelectPatient}
          fetchDataFromAPIs={fetchDataFromAPIs}
          selectedBatch={selectedBatch}
          setSelectedBatch={setSelectedBatch}
        />
        <div className="right_items">
          <div className="fullscreen" onClick={toggleFullScreen}>
            <img
              src={isFullScreen ? exitFullScreenIcon : fullScreenIcon}
              alt=""
              className="fullicon"
            />
          </div>
          <MultiConditionButton
            selectedPatient={selectedPatient}
            RenderTabViewContent={RenderTabViewContent}
            sidebarprefer={sidebarprefer}
          />

          {/* Dialog Popup */}
          <ReportHandleButton
            submittedData={submittedData}
            setSubmittedData={setSubmittedData}
            handleRemove={handleRemove}
            handleDownload={handleDownload}
          />

          <div className="Back">
            <Button
              label="Columns"
              className="goback_col"
              onClick={handlegotocol}
            />
          </div>
          <div
            className="user_pi"
            onMouseEnter={() => setHovered(true)}
            onMouseLeave={() => setHovered(false)}
          >
            <i
              className="pi pi-sign-out user_p"
              onClick={handlelogout}
              title={hovered ? "logout" : ""}
            />
          </div>
        </div>
      </div>

      <div className="conditions_cards">
        {cardsToDisplay === 1 && (
          <div className="side-content-container">
            {/* All three containers displayed side by side */}
            <div className="cards-container">
              {/* Sidebar container */}
              {sidebarprefer && (
                <div className="card sidebar">
                  <SideBarContainer
                    visibleleft={visibleleft}
                    setVisibleleft={setVisibleleft}
                    sidebarprefer={sidebarprefer}
                    handleSingleCodnition={handleSingleCodnition}
                    submittedConditions={submittedConditions} // Pass submitted conditions
                    removedCondition={removedCondition} // Pass removed condition
                    setSubmittedConditions={setSubmittedConditions}
                    selectedPatient={selectedPatient}
                  />
                </div>
              )}

              {/* Main content container */}
              <div className="card main-content">
                <MainContentData
                  selectedCondition={selectedCondition}
                  setSelectedCondition={setSelectedCondition}
                  isPhenotypeVisible={isPhenotypeVisible}
                  submittedData={submittedData}
                  setSubmittedData={setSubmittedData}
                  handleSeverityClick={handleSeverityClick}
                  RenderTabViewContent={RenderTabViewContent}
                  selectedPatient={selectedPatient}
                  aiScore={aiScore}
                  reason={reason}
                  setAiScore={setAiScore}
                  setReason={setReason}
                  selectedBatch={selectedBatch}
                  concernChecked={concernChecked} // Pass concernChecked state
                  setConcernChecked={setConcernChecked} // Pass setConcernChecked function
                />
              </div>

              {/* Phenotype container */}
              <div className="card phenotype-section">
                <Phenotype
                  isPhenotypeVisible={isPhenotypeVisible}
                  selectedPatient={selectedPatient}
                  selectedBatch={selectedBatch}
                />
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
