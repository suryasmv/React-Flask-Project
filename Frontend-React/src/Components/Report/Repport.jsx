// eslint-disable-next-line
import React, { useState } from "react";
import data from "../genes_Conditions.json";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";

const Report = ({ onRowSelect }) => {
  return (
    <div className="card">
      <DataTable
        paginator
        rows={10}
        rowsPerPageOptions={[10, 15, 25, 50, 75, 100]}
        value={data}
        selectionMode="single"
        onSelectionChange={onRowSelect}
      >
        <Column field="Gene Name" header="Gene Name"></Column>
        <Column field="Condition" header="Conditions"></Column>
        <Column field="Headings" header="Heading"></Column>
      </DataTable>
    </div>
  );
};

function MyForm({
  formData,
  numAdditionalTextboxes,
  handleChange,
  handleAdditionalTextboxChange,
  handleAddTextbox,
  handleRemoveTextbox,
  renderAdditionalTextboxes,
}) {
  let conditionValue;
  let condition_firstValue;
  if (typeof formData.Condition === "string") {
    conditionValue = formData.Condition;
    condition_firstValue = conditionValue;
  } else if (
    typeof formData.Condition === "object" &&
    formData.Condition !== null
  ) {
    conditionValue = JSON.stringify(formData.Condition);
    const dataArray = JSON.parse(conditionValue);
    condition_firstValue = dataArray[0](conditionValue);
  } else {
    condition_firstValue = "";
  }

  let GeneNameValue;
  let GeneName_firstValue;
  if (typeof formData.GeneName === "string") {
    GeneNameValue = formData.GeneName;
    GeneName_firstValue = GeneNameValue;
  } else if (
    typeof formData.GeneName === "object" &&
    formData.GeneName !== null
  ) {
    GeneNameValue = JSON.stringify(formData.GeneName);
    const GenedataArray = JSON.parse(GeneNameValue);
    GeneName_firstValue = GenedataArray[0](GeneNameValue);
  } else {
    GeneName_firstValue = "";
  }
  let HeadingsValue;
  let Headings_firstValue;
  if (typeof formData.Headings === "string") {
    HeadingsValue = formData.Headings;
    Headings_firstValue = HeadingsValue;
  } else if (
    typeof formData.Headings === "object" &&
    formData.Headings !== null
  ) {
    HeadingsValue = JSON.stringify(formData.Headings);
    const HeadingsdataArray = JSON.parse(HeadingsValue);
    Headings_firstValue = HeadingsdataArray[0](HeadingsValue);
  } else {
    Headings_firstValue = "";
  }

  return (
    <form>
      <label>
        Gene Name:
        <input
          type="text"
          name="GeneName"
          value={GeneName_firstValue}
          onChange={(event) => handleChange(event, "GeneName")}
        />
        <input
          type="number"
          value={numAdditionalTextboxes.GeneName}
          onChange={(event) => handleAdditionalTextboxChange(event, "GeneName")}
          min="1"
        />
        <button onClick={() => handleAddTextbox("GeneName")}>Add</button>
        {renderAdditionalTextboxes("GeneName")}
      </label>
      <br />
      <label>
        Condition:
        <input
          type="text"
          name="Condition"
          value={condition_firstValue}
          onChange={(event) => handleChange(event, "Condition")}
        />
        <input
          type="number"
          value={numAdditionalTextboxes.Condition}
          onChange={(event) =>
            handleAdditionalTextboxChange(event, "Condition")
          }
          min="1"
        />
        <button onClick={() => handleAddTextbox("Condition")}>Add</button>
        {renderAdditionalTextboxes("Condition")}
      </label>
      <br />
      <label>
        Headings:
        <input
          type="text"
          name="Headings"
          value={Headings_firstValue}
          onChange={(event) => handleChange(event, "Headings")}
        />
        <input
          type="number"
          value={numAdditionalTextboxes.Headings}
          onChange={(event) => handleAdditionalTextboxChange(event, "Headings")}
          min="1"
        />
        <button onClick={() => handleAddTextbox("Headings")}>Add</button>
        {renderAdditionalTextboxes("Headings")}
      </label>
      <br />
      <button type="submit">Submit</button>
    </form>
  );
}

const Rreport = () => {
  // eslint-disable-next-line
  const [selectedRowData, setSelectedRowData] = useState(null);
  const [formData, setFormData] = useState({
    GeneName: "",
    Condition: "",
    Headings: "",
  });

  const [numAdditionalTextboxes, setNumAdditionalTextboxes] = useState({
    GeneName: 1,
    Condition: 1,
    Headings: 1,
  });

  const handleChange = (event, fieldName, index) => {
    const { value } = event.target;
    setFormData((prevState) => ({
      ...prevState,
      [fieldName]: {
        ...prevState[fieldName],
        [index]: value,
      },
    }));
  };

  const handleAdditionalTextboxChange = (event, fieldName) => {
    let value = parseInt(event.target.value);
    if (isNaN(value) || value < 1) {
      value = 1;
    }
    setNumAdditionalTextboxes({
      ...numAdditionalTextboxes,
      [fieldName]: value,
    });
  };

  const handleAddTextbox = (fieldName) => {
    setNumAdditionalTextboxes((prevState) => ({
      ...prevState,
      [fieldName]: prevState[fieldName] + 1,
    }));
  };

  const handleRemoveTextbox = (fieldName) => {
    setNumAdditionalTextboxes((prevState) => ({
      ...prevState,
      [fieldName]: prevState[fieldName] - 1,
    }));
  };

  const renderAdditionalTextboxes = (fieldName) => {
    const additionalTextboxes = [];
    for (let i = 1; i < numAdditionalTextboxes[fieldName]; i++) {
      additionalTextboxes.push(
        <div key={i}>
          <input
            type="text"
            name={fieldName}
            value={formData[fieldName][i] || ""}
            onChange={(event) => handleChange(event, fieldName, i)}
          />
          <button onClick={() => handleRemoveTextbox(fieldName, i)}>
            Remove
          </button>
        </div>
      );
    }
    return additionalTextboxes;
  };

  const handleRowSelect = (e) => {
    setSelectedRowData(e.value);
    const rowData = e.value;
    const newFormData = {
      GeneName: "",
      Condition: "",
      Headings: "",
    };

    if (rowData["Gene Name"]) {
      const geneNamesList = rowData["Gene Name"]
        .split(";")
        .map((geneName) => geneName.trim());
      if (geneNamesList.length === 1) {
        newFormData.GeneName = geneNamesList[0];
        setNumAdditionalTextboxes({
          ...numAdditionalTextboxes,
          GeneName: 1,
        });
      } else {
        newFormData.GeneName = geneNamesList;
        setNumAdditionalTextboxes({
          ...numAdditionalTextboxes,
          GeneName: geneNamesList.length,
        });
      }
    }
    if (rowData["Headings"]) {
      const headingslist = rowData["Headings"]
        .split(";")
        .map((Headings) => Headings.trim());
      if (headingslist.length === 1) {
        newFormData.Headings = headingslist[0];
        setNumAdditionalTextboxes({
          // ...numAdditionalTextboxes,
          Headings: 1,
        });
      } else {
        newFormData.Headings = headingslist;
        setNumAdditionalTextboxes({
          // ...numAdditionalTextboxes,
          Headings: headingslist.length,
        });
      }
    }
    if (rowData["Condition"]) {
      const conditionsList = rowData["Condition"]
        .split(";")
        .map((condition) => condition.trim());
      if (conditionsList.length === 1) {
        newFormData.Condition = conditionsList[0];
        setNumAdditionalTextboxes({
          ...numAdditionalTextboxes,
          Condition: 1,
        });
      } else {
        newFormData.Condition = conditionsList;
        setNumAdditionalTextboxes({
          ...numAdditionalTextboxes,
          Condition: conditionsList.length,
        });
      }
    }

    setFormData(newFormData);
  };

  return (
    <div style={{ display: "flex" }}>
      <div style={{ width: "50%" }}>
        <Report onRowSelect={handleRowSelect} />
      </div>
      <div style={{ width: "50%" }}>
        <MyForm
          formData={formData}
          numAdditionalTextboxes={numAdditionalTextboxes}
          handleChange={handleChange}
          handleAdditionalTextboxChange={handleAdditionalTextboxChange}
          handleAddTextbox={handleAddTextbox}
          handleRemoveTextbox={handleRemoveTextbox}
          renderAdditionalTextboxes={renderAdditionalTextboxes}
        />
      </div>
    </div>
  );
};

export default Rreport;
