import React, { useState, useEffect } from "react";
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
} from "../../Libraries/Libraries";
import * as XLSX from "xlsx";
import conditionsData from "../../Conditions/Generated_output.json";
import data from "../../Conditions/output.json";
import reportconditions from "../../Conditions/report_Conditions.json";
import fullScreenIcon from "./fullscreen.svg";
import exitFullScreenIcon from "./fullscreen-exit.svg";
import { Navigate } from "../../Libraries/Libraries";
import { InputText } from "primereact/inputtext";
import { IconField } from "primereact/iconfield";
import { InputIcon } from "primereact/inputicon";
import "./dashboard.css";
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
  const [gotocol, setgotocol] = useState(false);
  if (gotocol) {
    return <Navigate to="/columns_selection" />;
  }
  const handlegotocol = () => {
    setgotocol(true);
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
  const concerns = [{ name: "yes", code: "CN" }];

  const RenderReportContent = ({ pref, values }) => {
    // const initialState = () => {
    //     const storedData = reportconditions.reportconditions[0];
    //     ("store", storedData);
    //     return storedData.map(condition => ({
    //         name: condition.name,
    //         selectedOption: null,
    //         concern: null
    //     }));
    // };
    const [conditionNames, setConditionNames] = useState([]);
    // useEffect(() => {
    //     localStorage.setItem('permanent_pref', JSON.stringify(conditionNames));
    // }, [conditionNames]);
    // (conditionNames)
    useEffect(() => {
      // Parse the JSON data
      const conditionsData = [
        {
          reportconditions: [
            [
              {
                name: "Diabetes",
              },
              {
                name: "High Blood pressure",
              },
              {
                name: "Coronary Artery Disease",
              },
              {
                name: "Arrhythmia",
              },
              {
                name: "Heart Failure- Dilated Cardiomyopathy, Restrictive Cardiomyopathy",
              },
              {
                name: "Cholesterol disorders",
              },
              {
                name: "Hypertriglyceridemia",
              },
              {
                name: "Thyroid Disorders- Hypothyroidism, Hyperthyroidism",
              },
              {
                name: "Anemia- Microcytic, Hemolytic",
              },
              {
                name: "Predisposition to Blood clots- Thrombophilia",
              },
              {
                name: "Bleeding Disorders",
              },
              {
                name: "Parkinson’s Disease",
              },
              {
                name: "Alzheimer’s Disease",
              },
              {
                name: "Migraines, Headaches",
              },
              {
                name: "Seizures",
              },
              {
                name: "Inflammatory bowel disease- Crohn’s, Ulcerative colitis",
              },
              {
                name: "Respiratory Allergies",
              },
              {
                name: "Food Allergies",
              },
              {
                name: "Liver Disorders",
              },
              {
                name: "Gall bladder disorders",
              },
              {
                name: "Pancreatic Disorders",
              },
              {
                name: "Nephrotic Syndrome (Focal Segmental Glomerulosclerosis, Membranous nephropathy, Minimal Change Disease)",
              },
              {
                name: "Interstitial Nephritis, Tubulo interstitial Disease",
              },
              {
                name: "Renal Stones- Calcium Oxalate stones, Cystine stones, Uric Acid Stones",
              },
              {
                name: "Dry skin, eczema",
              },
              {
                name: "Skin Allergies",
              },
              {
                name: "Vitiligo",
              },
              {
                name: "Osteoporosis",
              },
              {
                name: "Degenerative Joint Disease, Cartilage degeneration",
              },
              {
                name: "Muscular dystrophy, atrophy",
              },
              {
                name: "Fatigue",
              },
              {
                name: "Mood Disorders- Anxiety, Schizophrenia, Depression",
              },
              {
                name: "Urticaria",
              },
              {
                name: "Essential tremors",
              },
              {
                name: "Renal Disorders",
              },
              {
                name: "Sinusitis, Dust Allergy (Ciliary dykinesia, Hyper IgE syndrome, Angioedma, Chroinc granulomatous)",
              },
              {
                name: "Obesity",
              },
              {
                name: "Skin Health",
              },
              {
                name: "Eye Health",
              },
              {
                name: "Gastritis",
              },
              {
                name: "Fatigue 9. 28. 29.30 which to consider",
              },
              {
                name: "Food Which other disease to consider",
              },
            ],
          ],
        },
      ];
      const conditions = conditionsData[0].reportconditions[0];
      // Initialize each condition with selectedOption and concern properties
      const conditionNames = conditions.map((condition) => ({
        name: condition.name,
        selectedOption: null,
        concern: null,
      }));
      setConditionNames(conditionNames);
    }, []);

    const handleOptionChange = (rowData, newValue) => {
      const updatedConditions = conditionNames.map((condition) => {
        if (condition.name === rowData.name) {
          return { ...condition, selectedOption: newValue };
        }
        return condition;
      });
      setConditionNames(updatedConditions);
    };
    const handleConcernChange = (rowData, newValue) => {
      const updatedConditions = conditionNames.map((condition) => {
        if (condition.name === rowData.name) {
          return { ...condition, concern: newValue };
        }
        return condition;
      });
      setConditionNames(updatedConditions);
    };

    const handleClearRow = (rowData) => {
      const updatedConditions = conditionNames.map((condition) => {
        if (condition.name === rowData.name) {
          return { ...condition, selectedOption: null, concern: null };
        }
        return condition;
      });
      setConditionNames(updatedConditions);
      localStorage.setItem("permanent_pref", JSON.stringify(updatedConditions));
    };
    const exportToExcel = () => {
      const formattedData = conditionNames.reduce((acc, condition) => {
        const rowData = {
          "Medical Condition": condition.name,
          Low:
            condition.selectedOption && condition.selectedOption.code === "L"
              ? "y"
              : "",
          "Low to Mild":
            condition.selectedOption && condition.selectedOption.code === "LM"
              ? "y"
              : "",
          Mild:
            condition.selectedOption && condition.selectedOption.code === "MIL"
              ? "y"
              : "",
          "Mild to Moderate":
            condition.selectedOption && condition.selectedOption.code === "MM"
              ? "y"
              : "",
          Moderate:
            condition.selectedOption && condition.selectedOption.code === "MOD"
              ? "y"
              : "",
          "Moderate to High":
            condition.selectedOption && condition.selectedOption.code === "MOH"
              ? "y"
              : "",
          High:
            condition.selectedOption && condition.selectedOption.code === "H"
              ? "y"
              : "",
          "No Mutations":
            condition.selectedOption && condition.selectedOption.code === "NM"
              ? "y"
              : "",
          concerns:
            condition.concern && condition.concern.code === "CN" ? "y" : "",
          "Food Which other disease to consider":
            condition.selectedOption && condition.selectedOption.code === "FWC"
              ? "y"
              : "",
          "Fatigue 9. 28. 29.30 which to consider":
            condition.selectedOption && condition.selectedOption.code === "FTC"
              ? "y"
              : "",
        };
        acc.push(rowData);
        return acc;
      }, []);

      const worksheet = XLSX.utils.json_to_sheet(formattedData);
      const workbook = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(
        workbook,
        worksheet,
        "Medical Conditions Data"
      );
      XLSX.writeFile(workbook, "medical_conditions_data.xlsx");
    };
    return (
      <div className="table">
        <div className="download">
          <Button onClick={exportToExcel} label="Download" />
        </div>
        <DataTable
          value={conditionNames}
          scrollable={false}
          scrollHeight="100%"
          showGridlines
        >
          <Column field="name" header="Condition Name" />
          <Column
            header="Options"
            body={(rowData) => (
              <Dropdown
                value={rowData.selectedOption}
                options={values}
                onChange={(e) => handleOptionChange(rowData, e.value)}
                optionLabel="name"
                placeholder="Select Option"
              />
            )}
          />
          <Column
            header="Concerns"
            body={(rowData) => (
              <Dropdown
                value={rowData.concern}
                options={concerns}
                onChange={(e) => handleConcernChange(rowData, e.value)}
                optionLabel="name"
                placeholder="Select Option"
              />
            )}
          />
          <Column
            header="Clear"
            body={(rowData) => (
              <Button
                icon="pi pi-times"
                onClick={() => handleClearRow(rowData)}
                className="p-button-rounded p-button-danger"
              />
            )}
          />
        </DataTable>
      </div>
    );
  };

  const RenderTabViewContent = (conditionTitle) => {
    const [globalFilterValue, setGlobalFilterValue] = useState("");
    // useEffect(() => {
    //     setCustomers(getCustomers(data));
    //   }, []);
    const [showFilters, setShowFilters] = useState(false);
    useEffect(() => {
      setShowFilters(false); // Ensure filters are hidden initially
    }, [conditionTitle]); // Only re-run effect when conditionTitle changes

    // Function to toggle visibility of filters
    const toggleFilters = () => {
      setShowFilters(!showFilters);
    };

    const onGlobalFilterChange = (e) => {
      setGlobalFilterValue(e.target.value);
    };
    const renderHeader = () => {
      return (
        <div className="flex justify-content-end">
          <IconField iconPosition="left">
            <InputIcon className="pi pi-search" />
            <InputText
              value={globalFilterValue}
              onChange={onGlobalFilterChange}
              placeholder="Keyword Search"
            />
          </IconField>
        </div>
      );
    };
    const header = renderHeader();

    if (!conditionTitle) {
      setSelectedCondition(preferences[0].title);
      conditionTitle = preferences[0].title;
    }
    const conditionData = conditionsData.conditions.find(
      (c) => c.name === conditionTitle
    );

    return (
      <div>
        <div className="filter_button">
          <Button onClick={toggleFilters}>
            {showFilters ? "Hide Search" : "Show Search"}
          </Button>
        </div>
        <TabView scrollable>
          {conditionData.subcategories.map((subcategory, index) => (
            <TabPanel key={index} header={subcategory.name}>
              {subcategory.subtype ? (
                <TabView scrollable>
                  {subcategory.subtype.map((subtype, subtypeIndex) => (
                    <TabPanel key={subtypeIndex} header={subtype.name}>
                      <div>
                        <DataTable
                          value={data.filter(
                            (item) =>
                              item.Headings === subcategory.name &&
                              item.Condition === subtype.name &&
                              item.subtype_cond === conditionTitle
                          )}
                          scrollable
                          reorderableColumns
                          resizableColumns
                          sortMode="multiple"
                          globalFilterFields={selectedColumns}
                          globalFilter={globalFilterValue}
                          header={header} // Conditionally render header based on showFilters state
                          className={
                            cardsToDisplay === 1
                              ? "single_datatable"
                              : "multiple_datatable"
                          }
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
                                  const namePairs = [];
                                  for (let i = 0; i < names.length; i += 2) {
                                    namePairs.push(
                                      names.slice(i, i + 2).join(",")
                                    );
                                  }
                                  content = namePairs.map((pair, i) => (
                                    <div key={i}>{pair}</div>
                                  ));
                                } else if (
                                  typeof rowData[columnName] === "number"
                                ) {
                                  content = rowData[columnName];
                                } else {
                                  content = "";
                                }
                                return (
                                  <div style={{ whiteSpace: "normal" }}>
                                    {content}
                                  </div>
                                );
                              }}
                              // filter
                              // filterPlaceholder="Search here"
                              // filterMatchMode="in"
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
  const RenderTabViewContentMulti = (conditionTitle) => {
    if (!conditionTitle) {
      setSelectedCondition(preferences[0].title);
      conditionTitle = preferences[0].title;
    }
    const conditionData = conditionsData.conditions.find(
      (c) => c.name === conditionTitle
    );

    return (
      <div>
        <TabView scrollable>
          {conditionData.subcategories.map((subcategory, index) => (
            <TabPanel key={index} header={subcategory.name}>
              {subcategory.subtype ? (
                <TabView scrollable>
                  {subcategory.subtype.map((subtype, subtypeIndex) => (
                    <TabPanel key={subtypeIndex} header={subtype.name}>
                      <div>
                        <DataTable
                          value={data.filter(
                            (item) =>
                              item.Headings === subcategory.name &&
                              item.Condition === subtype.name &&
                              item.subtype_cond === conditionTitle
                          )}
                          scrollable
                          reorderableColumns
                          resizableColumns
                          sortMode="multiple"
                          className={
                            cardsToDisplay === 1
                              ? "single_datatable"
                              : "multiple_datatable"
                          }
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
                                  const namePairs = [];
                                  for (let i = 0; i < names.length; i += 2) {
                                    namePairs.push(
                                      names.slice(i, i + 2).join(",")
                                    );
                                  }
                                  content = namePairs.map((pair, i) => (
                                    <div key={i}>{pair}</div>
                                  ));
                                } else if (
                                  typeof rowData[columnName] === "number"
                                ) {
                                  content = rowData[columnName];
                                } else {
                                  content = "";
                                }
                                return (
                                  <div style={{ whiteSpace: "normal" }}>
                                    {content}
                                  </div>
                                );
                              }}
                              // filter
                              // filterPlaceholder="Search here"
                              // filterMatchMode="in"
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
        <div className="menu">
          <i
            className="pi pi-bars menu_bars"
            onClick={() => setVisibleleft(true)}
          ></i>
        </div>
        <img src={SvgImage} alt="" />
        <div className="right_items">
          <div className="fullscreen" onClick={toggleFullScreen}>
            <img
              src={isFullScreen ? exitFullScreenIcon : fullScreenIcon}
              alt=""
              className="fullicon"
            />
          </div>
          <div className="multi_b">
            <Button
              onClick={() => setPopupVisible(true)}
              className=""
              label="Multi-Condition"
            />
            <Dialog
              className="Dialog_hear"
              header="Multiple Conditions"
              visible={popupVisible}
              onHide={() => setPopupVisible(false)}
            >
              <DndContext
                sensors={sensors}
                onDragEnd={handleDragEnd}
                collisionDetection={closestCorners}
              >
                <SortableContext items={preferences}>
                  {preferences.map((task) => (
                    <Task key={task.id} id={task.id} title={task.title} />
                  ))}
                </SortableContext>
              </DndContext>
              <div className="submit_multiconditions">
                <Button onClick={handleSubmit} label="Submit" />
              </div>
            </Dialog>
          </div>
          <div className="report_b">
            <Button
              className=""
              onClick={() => setVisibleRight(true)}
              label="Report"
            />
            <Sidebar
              header={"Scoring Chart"}
              visible={visibleRight}
              position="right"
              onHide={() => setVisibleRight(false)}
            >
              <RenderReportContent pref={pref} values={values} />
            </Sidebar>
          </div>
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
      <div>
        <Sidebar
          visible={visibleleft}
          position="left"
          onHide={() => setVisibleleft(false)}
        >
          <h2>Selected Conditions</h2>
          {sidebarprefer.map((preference, index) => (
            <button
              key={index}
              className="sidebar_buttons"
              onClick={() => handleSingleCodnition(preference.title)}
            >
              {preference.title}
            </button>
          ))}
        </Sidebar>
      </div>
      <div className="conditions_cards">
        {cardsToDisplay > 1 && (
          <div className="multiple_cards">
            {prefer.slice(0, cardsToDisplay).map((pp, index) => (
              <div key={index} className="card_to_display">
                <Card className="cards_condition">
                  <div className="card-content">
                    <h1 className="conditiontitle">
                      {pp.title.replace(/_/g, " ")}
                    </h1>
                    <div>{RenderTabViewContentMulti(pp.title)}</div>
                  </div>
                </Card>
              </div>
            ))}
          </div>
        )}
        {cardsToDisplay === 1 && (
          <div className="single_card">
            <div className="cards_side_close">
              <Card className="cards_condition">
                <div className="card-content">
                  <h1 className="conditiontitle">
                    {selectedCondition
                      ? selectedCondition.replace(/_/g, " ")
                      : " "}
                  </h1>
                  <div>{RenderTabViewContent(selectedCondition)}</div>
                </div>
              </Card>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
