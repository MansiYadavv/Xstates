import React, { useEffect, useState } from "react";

const LocationSelector = () => {
  const [countries, setCountries] = useState([]);
  const [states, setStates] = useState([]);
  const [cities, setCities] = useState([]);

  const [selectedCountry, setSelectedCountry] = useState("");
  const [selectedState, setSelectedState] = useState("");
  const [selectedCity, setSelectedCity] = useState("");

  useEffect(() => {
    fetch("https://crio-location-selector.onrender.com/countries")
      .then((res) => res.json())
      .then((data) => setCountries(data));
  }, []);

  useEffect(() => {
    if (selectedCountry) {
      fetch(`https://crio-location-selector.onrender.com/country=${selectedCountry}/states`)
        .then((res) => res.json())
        .then((data) => setStates(data));
    } else {
      setStates([]);
      setSelectedState("");
      setCities([]);
      setSelectedCity("");
    }
  }, [selectedCountry]);

  useEffect(() => {
    if (selectedCountry && selectedState) {
      fetch(`https://crio-location-selector.onrender.com/country=${selectedCountry}/state=${selectedState}/cities`)
        .then((res) => res.json())
        .then((data) => setCities(data));
    } else {
      setCities([]);
      setSelectedCity("");
    }
  }, [selectedState, selectedCountry]);

  return (
    <div
      style={{
        minHeight: "55vh",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        fontFamily: "Arial, sans-serif",
        padding: "2rem",
        marginLeft:"35rem",
      }}
    >
      <h2 style={{ fontSize: "2rem", marginBottom: "2rem" }}>Select Location</h2>

      <div
        style={{
          display: "flex",
          gap: "1.5rem",
          justifyContent: "center",
          alignItems: "center",
          flexWrap: "wrap",
        }}
      >
        {/* Country */}
        <select
          style={dropdownStyle}
          value={selectedCountry}
          onChange={(e) => {
            setSelectedCountry(e.target.value);
            setSelectedState("");
            setSelectedCity("");
          }}
        >
          <option value="">Select Country</option>
          {countries.map((country) => (
            <option key={country} value={country}>
              {country}
            </option>
          ))}
        </select>

        {/* State */}
        <select
          style={dropdownStyle}
          value={selectedState}
          onChange={(e) => {
            setSelectedState(e.target.value);
            setSelectedCity("");
          }}
          disabled={!selectedCountry}
        >
          <option value="">Select State</option>
          {states.map((state) => (
            <option key={state} value={state}>
              {state}
            </option>
          ))}
        </select>

        {/* City */}
        <select
          style={dropdownStyle}
          value={selectedCity}
          onChange={(e) => setSelectedCity(e.target.value)}
          disabled={!selectedState}
        >
          <option value="">Select City</option>
          {cities.map((city) => (
            <option key={city} value={city}>
              {city}
            </option>
          ))}
        </select>
      </div>

      {selectedCity && (
        <div style={{ marginTop: "2rem", fontSize: "1.2rem", fontWeight: "bold" }}>
          You selected {selectedCity}, {selectedState}, {selectedCountry}
        </div>
      )}
    </div>
  );
};

// Style for dropdowns
const dropdownStyle = {
  width: "220px",
  height: "45px",
  padding: "10px",
  fontSize: "1rem",
  borderRadius: "6px",
  border: "1px solid #ccc",
};

export default LocationSelector;
