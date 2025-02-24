import React, { useState, useEffect } from "react";
import "./DashboardSearch.css";

const DashboardSearch = ({ onSelectPatient, fetchDataFromAPIs, selectedBatch, setSelectedBatch }) => {
  const [batches, setBatches] = useState({});
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredPatients, setFilteredPatients] = useState([]);
  const [selectedPatient, setSelectedPatient] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchBatches = async () => {
      try {
        const response = await fetch("http://127.0.0.1:5000/get-batches");
        if (!response.ok) throw new Error("Failed to fetch batches");
        const data = await response.json();
        setBatches(data || {});
      } catch (error) {
        console.error("Error fetching batches:", error);
        setBatches({});
      }
    };

    fetchBatches();
  }, []);

  const handleBatchChange = async (event) => {
    const batch = event.target.value;
    if (batch === selectedBatch) return; // Prevent unnecessary re-fetching
    setSelectedBatch(batch);
    setSearchQuery(""); 
    setFilteredPatients([]);
    setSelectedPatient(null); // Clear patient selection on batch change

    try {
      await fetchDataFromAPIs(batch);
    } catch (err) {
      setError(`Failed to load data: ${err.message}`);
    }
  };

  const handleSearch = (event) => {
    const query = event.target.value;
    setSearchQuery(query);
    
    if (!selectedBatch || !query.trim()) {
      setFilteredPatients([]);
      return;
    }

    setFilteredPatients(
      batches[selectedBatch]?.filter(file => file.toLowerCase().includes(query.toLowerCase())) || []
    );
  };

  const handleSelect = async (patient) => {
    if (selectedPatient === patient) return;
    setSelectedPatient(patient);
    setSearchQuery("");
    setFilteredPatients([]);
    onSelectPatient(patient);

    try {
      await fetchDataFromAPIs(selectedBatch, patient);
    } catch (err) {
      setError(`Failed to load patient data: ${err.message}`);
    }
  };

  return (
    <div className="dashboard-search">
      <select
        value={selectedBatch}
        onChange={handleBatchChange}
        className="batch-dropdown"
      >
        <option value="">Select Batch</option>
        {Object.keys(batches).map((batch) => (
          <option key={batch} value={batch}>{batch}</option>
        ))}
      </select>

      <input
        type="text"
        placeholder="Search patient file..."
        value={searchQuery}
        onChange={handleSearch}
        className="dashboard-search-input"
        disabled={!selectedBatch}
      />
      <i className="pi pi-search dashboard-search-icon"></i>

      {selectedPatient && <span className="selected-patient">{selectedPatient} is selected</span>}

      {filteredPatients.length > 0 && (
        <ul className="search-results">
          {filteredPatients.map((patient) => (
            <li
              key={patient}
              onClick={() => handleSelect(patient)}
              className="search-result-item"
            >
              {patient}
            </li>
          ))}
        </ul>
      )}

      {error && <div className="error-message">{error}</div>}
    </div>
  );
};

export default DashboardSearch;
